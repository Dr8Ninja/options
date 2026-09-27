#!/usr/bin/env python3
"""Offline P06 design audit; browser checks must be run separately. No product QA claim."""
from pathlib import Path
from copy import deepcopy
import hashlib
import json
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
D = ROOT / 'design'

def require(test, message):
    if not test:
        raise AssertionError(message)

def read(path):
    return json.loads(path.read_text())

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def contrast(a, b):
    def luminance(color):
        values=[int(color[i:i+2],16)/255 for i in (1,3,5)]
        values=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in values]
        return sum(v*w for v,w in zip(values,(.2126,.7152,.0722)))
    x,y=sorted((luminance(a),luminance(b)))
    return (y+.05)/(x+.05)

def audit_tokens(tokens):
    results=[]
    for name,t in tokens['themes'].items():
        pairs=[(fg,bg,4.5) for fg in ['ink','muted','accent'] for bg in ['background','surface']]
        pairs += [('accent','soft',4.5),('onAccent','accent',4.5),('warning','warningSurface',4.5),('danger','dangerSurface',4.5)]
        pairs += [(fg,bg,3) for fg in ['control','focus'] for bg in ['surface','background','soft']]
        for fg,bg,minimum in pairs:
            ratio=contrast(t[fg],t[bg]);require(ratio>=minimum,f'Contrast {name} {fg}/{bg}: {ratio}')
            results.append(dict(theme=name,foreground=fg,background=bg,ratio=round(ratio,2),minimum=minimum))
    return results

def audit_routes(manifest,operations):
    routes=manifest['routes'];require(len({r['prototype'] for r in routes})==35,'Route inventory drift')
    journeys={j for r in routes for j in r['journeys']}
    require(journeys=={f'J{i:02}' for i in range(1,18)},'Missing journey')
    for r in routes:
        require(set(r['operations'])<=operations,'Unknown API operation: '+r['prototype'])
        require((D/r['stateSpec']).is_file() and (D/r['accessibilitySpec']).is_file(),'Missing state/accessibility contract')
    return len(routes)

def main():
    target=D/'evidence/design-validation.json'
    target.write_text(json.dumps({'result':'RUNNING','scope':'Offline P06 design audit'})+'\n')
    subprocess.run([sys.executable,str(ROOT/'scripts/validate_api_contract.py')],cwd=ROOT,check=True,capture_output=True,text=True)
    api=read(ROOT/'docs/engineering/openapi/openapi.json')
    operations={o['operationId'] for v in api['paths'].values() for o in v.values() if isinstance(o,dict) and 'operationId' in o}
    tokens=read(D/'tokens.json');pairs=audit_tokens(tokens)
    css=(D/'prototype/tokens.css').read_text()
    for t in tokens['themes'].values():
        for value in t.values():require(value in css,'Token CSS drift: '+value)
    routes=read(D/'routes.json');route_count=audit_routes(routes,operations)
    fixture=json.loads((D/'prototype/content.js').read_text().removeprefix('window.CURRICULUM = ').strip().removesuffix(';'))
    provenance=read(D/'content-manifest.json');records=fields=0
    for collection,entry in provenance['collections'].items():
        originals=read(ROOT/entry['file'])['records']
        expected=[{k:r[k] for k in entry['fields'] if k in r} for r in originals]
        require(fixture[collection]==expected,'Canonical design fixture drift: '+collection)
        require(len(expected)==entry['records'],'Untruthful count')
        records+=len(expected);fields+=sum(len(r) for r in expected)
    entry=read(D/'evidence/p06-entry.json')['p05_before_amendment']
    for p,digest in entry['preserved_input_sha256'].items():require(sha(ROOT/p)==digest,'Source modified: '+p)
    browser=read(D/'evidence/browser-validation.json');require(browser['passed'] and not browser['failures'] and not browser['runtimeErrors'],'Browser audit failed')
    for p,digest in browser['artifactHashes'].items():require(sha(ROOT/p)==digest,'Browser evidence stale: '+p)
    for p in browser['screenshots']:require((D/'evidence'/p).is_file(),'Missing screenshot')
    require(browser['productionTestsRun'] is False and browser['screenReaderTestsRun'] is False,'Evidence overclaim')
    app=(D/'prototype/app.js').read_text();require('localStorage' not in app and 'sessionStorage' not in app and 'fetch(' not in app,'Unexpected prototype persistence/network')
    # Independent reconciliation of the plotted synthetic worksheet values.
    chart_values={s:50*s-50*100+2*50-5-max(s-105,0)*50 for s in [80,100,105,110]}
    require(list(chart_values.values())==[-905,95,345,345],'Dossier chart math')
    links=0
    for file in [ROOT/'docs/engineering/FRONTEND.md',*D.rglob('*.md')]:
        for link in re.findall(r'\]\(([^)]+)\)',file.read_text()):
            if '://' in link or link.startswith('#'):continue
            require((file.parent/link.split('#')[0]).exists(),f'Broken link: {file}: {link}');links+=1
    negatives=[]
    bad=deepcopy(tokens);bad['themes']['light']['ink']=bad['themes']['light']['background']
    try:audit_tokens(bad)
    except AssertionError:negatives.append('low_contrast')
    else:raise AssertionError('Low contrast accepted')
    bad=deepcopy(routes);bad['routes'][0]['operations']=['inventedEndpoint']
    try:audit_routes(bad,operations)
    except AssertionError:negatives.append('invented_operation')
    else:raise AssertionError('Unknown endpoint accepted')
    bad=deepcopy(routes)
    for r in bad['routes']:r['journeys']=[j for j in r['journeys'] if j!='J12']
    try:audit_routes(bad,operations)
    except AssertionError:negatives.append('missing_journey')
    else:raise AssertionError('Missing journey accepted')
    result={'as_of':'2026-09-23','result':'PASS','scope':'P06 design gate only','upstream_p05_gate':'PASS','contract_version':api['info']['version'],'contract_sha256':sha(ROOT/'docs/engineering/openapi/openapi.json'),'routes':route_count,'journeys':17,'canonical_records_compared':records,'canonical_fields_compared':fields,'original_files_preserved':len(entry['preserved_input_sha256']),'contrast_pairs':pairs,'local_links_checked':links,'negative_cases_rejected':negatives,'synthetic_chart_values':chart_values,'browser_report_sha256':sha(D/'evidence/browser-validation.json'),'production_tests_run':False,'screen_reader_tests_run':False,'deployment_performed':False}
    target.write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps({k:v for k,v in result.items() if k!='contrast_pairs'},indent=2))

if __name__=='__main__':main()
