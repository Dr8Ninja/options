#!/usr/bin/env python3
"""Validate P05's offline contract. No HTTP server/database/runtime tests are run."""
from pathlib import Path
from copy import deepcopy
import hashlib
import json
import re
import subprocess
import sys

try:
    from jsonschema import Draft202012Validator, FormatChecker
    from openapi_spec_validator import validate
except ImportError:
    raise SystemExit('Install scripts/requirements-api-contract.txt in an isolated venv; see CONTRACT_TEST_PLAN.md.')

ROOT = Path(__file__).resolve().parents[1]
ENG = ROOT / 'docs/engineering'
SPEC = ENG / 'openapi/openapi.json'
POLICIES = {'PUBLIC','ANONYMOUS','ACCOUNT','ACCOUNT_RECENT','ACCOUNT_ENROLLMENT',
            'ACCOUNT_RECENT_MFA','OWNER','EDITORIAL','EDITOR_RECENT','PUBLISHER_RECENT','ADMIN_RECENT'}
METHODS = {'get','put','post','delete','patch','head','options'}


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def walk(value):
    if isinstance(value, dict):
        yield value
        for v in value.values():
            yield from walk(v)
    elif isinstance(value, list):
        for v in value:
            yield from walk(v)


def resolve(spec, ref):
    require(ref.startswith('#/'), f'External reference not bundled: {ref}')
    value = spec
    for part in ref[2:].split('/'):
        value = value[part.replace('~1','/').replace('~0','~')]
    return value


def audit(spec, matrix, journeys):
    validate(spec)
    require(spec['servers'] == [{'url':'/api/v1','description':'Same-origin ingress; no deployed host assumed.'}], 'Versioned same-origin server drift')
    refs = [node['$ref'] for node in walk(spec) if '$ref' in node]
    for r in refs:
        resolve(spec, r)
    operations = {}
    expected_rows = []
    for path, methods in spec['paths'].items():
        require(not any(x in path for x in ['/ratings','/chapters','/users/']), 'Out-of-scope endpoint')
        for method, op in methods.items():
            if method not in METHODS:
                continue
            oid = op['operationId']
            require(oid not in operations, f'Duplicate operation: {oid}')
            operations[oid] = (path, method, op)
            policy = op['x-authorization']
            require(policy in POLICIES, f'Unknown policy {oid}')
            public = policy in {'PUBLIC','ANONYMOUS'}
            require(op['security'] == ([] if public else [{'sessionCookie':[]}]), f'Security drift: {oid}')
            require(op['x-owner'] == ('principal' if policy.startswith(('OWNER','ACCOUNT')) else 'none'), f'Owner policy drift {oid}')
            pars = [resolve(spec,p['$ref']) if '$ref' in p else p for p in op.get('parameters',[])]
            require(len({(p['in'],p['name']) for p in pars}) == len(pars), f'Duplicate parameter {oid}')
            path_names = set(re.findall(r'{([^}]+)}',path))
            require(path_names == {p['name'] for p in pars if p['in']=='path'},f'Path parameters {oid}')
            if method not in {'get','head'}:
                require(any(p['name']=='X-CSRF-TOKEN' and p.get('required') for p in pars), f'CSRF missing {oid}')
                require(any(p['name']=='Origin' for p in pars), f'Origin contract missing {oid}')
            if op['x-idempotency']=='required':
                require(any(p['name']=='Idempotency-Key' and p.get('required') for p in pars), f'Idempotency missing {oid}')
            if any(p['name']=='If-Match' for p in pars):
                require({'412','428'} <= set(op['responses']), f'Conditional errors missing {oid}')
            for code,response in op['responses'].items():
                r = resolve(spec,response['$ref']) if '$ref' in response else response
                require(r['headers']['Cache-Control']['schema']['const']=='no-store',f'Cache policy {oid}/{code}')
                require('X-Request-ID' in r['headers'], f'Correlation missing {oid}')
                if int(code)>=400:
                    require('application/problem+json' in r['content'],f'Error type {oid}')
            if 'requestBody' in op:
                content=op['requestBody']['content']
                if 'application/json' in content:
                    body=resolve(spec,content['application/json']['schema']['$ref'])
                    require(body.get('additionalProperties') is False, f'Open input object {oid}')
                    forbidden={'ownerId','userId','accountId','roles','score','passed','mastery'}
                    require(not (forbidden & set(body['properties'])),f'Overposting field {oid}')
            expected_rows.append(f"| {method.upper()} | `{path}` | `{oid}` | {policy} | {op['x-owner']} |")
    actual_rows=[line for line in matrix.splitlines() if re.match(r'^\| (GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS) \|',line)]
    require(set(actual_rows)==set(expected_rows) and len(actual_rows)==len(expected_rows),'Authorization matrix drift')
    require(set(journeys)=={f'J{i:02}' for i in range(1,18)},'Journey allocation incomplete')
    for journey, ids in journeys.items():
        require(ids and set(ids)<=set(operations),f'Missing operation in {journey}: {set(ids)-set(operations)}')
    # Structural reachability guards on question/quiz projections, not mere substring grep.
    def property_names(name,seen=None):
        seen=set() if seen is None else seen
        if name in seen:return set()
        seen.add(name); result=set()
        for node in walk(spec['components']['schemas'][name]):
            result.update(node.get('properties',{}))
            if '$ref' in node:
                result.update(property_names(node['$ref'].split('/')[-1],seen))
        return result
    for name in ['Quiz','Question','Topic','Card','SearchHit','Resource','Path','Project']:
        require(not ({'answerKey','correct','expectedNumeric','expectedAnswer','referenceSolution','reference_behavior','rubric','feedback'} & property_names(name)), f'Protected material reachable in {name}')
    for name,schema in spec['components']['schemas'].items():
        Draft202012Validator.check_schema(schema)
    return operations,len(refs)


def main():
    upstream=subprocess.run([sys.executable,str(ROOT/'scripts/validate_database_design.py')],cwd=ROOT,capture_output=True,text=True)
    require(upstream.returncode==0,'P04 gate failed: '+upstream.stdout+upstream.stderr)
    upstream_data=json.loads(upstream.stdout)
    spec=json.loads(SPEC.read_text())
    matrix=(ENG/'api/AUTHORIZATION_MATRIX.md').read_text()
    journeys=json.loads((ENG/'api/journey-contracts.json').read_text())
    operations,refs=audit(spec,matrix,journeys)
    canonical_schema_count=0
    for f in sorted((ROOT/'data/schemas').glob('*.schema.json')):
        # Package envelopes are operator interchange, not canonical record DTOs.
        if f.name in {'manifest.schema.json','import-package.schema.json'}:continue
        name='Canonical'+''.join(part.title() for part in f.stem.split('.')[0].split('_'))
        require(spec['components']['schemas'][name]==json.loads(f.read_text())['properties']['records']['items'],f'Canonical schema drift: {name}')
        canonical_schema_count+=1
    examples=json.loads((ENG/'openapi/examples/examples.json').read_text())['examples']
    names=set();positive=negative=canonical=0
    for ex in examples:
        require(ex['name'] not in names,'Duplicate example name');names.add(ex['name'])
        schema={'$ref':'#/components/schemas/'+ex['schema'],'components':spec['components']}
        errors=list(Draft202012Validator(schema,format_checker=FormatChecker()).iter_errors(ex['value']))
        require(bool(errors) != ex['valid'],f"Example expectation failed: {ex['name']}: {[e.message[:150] for e in errors]}")
        if ex['valid']:positive+=1
        else:negative+=1
        if 'operationId' in ex:
            require(ex['operationId'] in operations,'Example operation absent')
            op=operations[ex['operationId']][2]
            schemas={node['$ref'].split('/')[-1] for node in walk(op) if '$ref' in node and node['$ref'].startswith('#/components/schemas/')}
            require(ex['schema'] in schemas,f'Example schema not wired to operation {ex["name"]}')
        for claim in ex.get('canonicalAssertions',[]):
            data=json.loads((ROOT/f'data/v1/{claim["collection"]}.json').read_text())['records']
            record=next(x for x in data if x['id']==claim['id'])
            require(ex['value'][claim['wireField']]==record[claim['sourceField']],f'Invented canonical example {ex["name"]}')
            canonical+=1
    rejected=[]
    for name in ['removed_session','removed_csrf','removed_journey','matrix_drift','public_key_leak']:
        s=deepcopy(spec);m=matrix;j=deepcopy(journeys)
        if name=='removed_session':s['paths']['/me/notes/{id}']['get']['security']=[]
        if name=='removed_csrf':s['paths']['/auth/login']['post']['parameters']=[p for p in s['paths']['/auth/login']['post']['parameters'] if not p.get('$ref','').endswith('/CSRF')]
        if name=='removed_journey':j.pop('J17')
        if name=='matrix_drift':m=m.replace('| GET | `/programs`','| GET | `/missing`',1)
        if name=='public_key_leak':s['components']['schemas']['Question']['properties']['expectedNumeric']={'type':'number'}
        try:audit(s,m,j)
        except (AssertionError,ValueError):rejected.append(name)
        else:raise AssertionError('Corruption accepted: '+name)
    local_links=0
    for file in [ENG/'API.md',*(ENG/'api').glob('*.md')]:
        for link in re.findall(r'\]\(([^)]+)\)',file.read_text()):
            if '://' in link or link.startswith('#'):continue
            require((file.parent/link.split('#')[0]).exists(),f'Broken local link in {file.name}: {link}')
            local_links+=1
    hashes={str(f.relative_to(ROOT)):hashlib.sha256(f.read_bytes()).hexdigest() for folder in ['data/v1','sources/roadmaps','sources/prompts'] for f in sorted((ROOT/folder).glob('*')) if f.is_file()}
    result={'as_of':'2026-09-23','result':'PASS','scope':'Offline OpenAPI/schema/example/policy/journey validation only; runtime cases CT01–CT35 pending.','upstream_p04_gate':upstream_data['result'],'openapi_version':spec['openapi'],'contract_sha256':hashlib.sha256(SPEC.read_bytes()).hexdigest(),'paths':len(spec['paths']),'operations':len(operations),'schemas':len(spec['components']['schemas']),'references_resolved':refs,'authorization_rows':len(operations),'journeys':len(journeys),'valid_examples':positive,'invalid_examples_rejected':negative,'canonical_assertions':canonical,'canonical_record_schemas_verified':canonical_schema_count,'negative_design_mutations_rejected':rejected,'local_links_checked':local_links,'runtime_tests_run':False,'endpoints_implemented':False,'postgresql_tests_run':False,'messages_sent':False,'deployment_performed':False,'preserved_input_sha256':hashes}
    (ENG/'evidence/p05-validation.json').write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps({k:v for k,v in result.items() if k!='preserved_input_sha256'},indent=2))

if __name__=='__main__':main()
