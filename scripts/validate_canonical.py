#!/usr/bin/env python3
"""Offline P01 validation with deterministic --as-of, schema checks and lossless leaf round-trip."""
import argparse,json,hashlib,datetime,copy,math
from pathlib import Path
R=Path(__file__).resolve().parents[1]
def load(p):return json.loads(p.read_text())
def typ(v):return 'null' if v is None else 'boolean' if isinstance(v,bool) else 'integer' if isinstance(v,int) else 'number' if isinstance(v,float) else 'string' if isinstance(v,str) else 'array' if isinstance(v,list) else 'object'
def shape(v):
 t=typ(v);s={'type':t}
 if t=='object':s.update(properties={k:shape(x) for k,x in v.items()},required=list(v),additionalProperties=False)
 if t=='array':s['items']=merge([shape(x) for x in v]) if v else {}
 return s
def merge(ss):
 unique={json.dumps(x,sort_keys=True):x for x in ss};ss=list(unique.values())
 if not ss:return {}
 if len(ss)==1:return ss[0]
 if len({s.get('type') for s in ss})>1:return {'anyOf':ss}
 t=ss[0]['type']
 if t=='object':
  keys=set.union(*(set(s['properties']) for s in ss));req=set.intersection(*(set(s['required']) for s in ss))
  return {'type':t,'properties':{k:merge([s['properties'][k] for s in ss if k in s['properties']]) for k in sorted(keys)},'required':sorted(req),'additionalProperties':False}
 if t=='array':return {'type':t,'items':merge([s['items'] for s in ss])}
 return {'type':t}
def schema_check(v,s,p='$'):
 if 'enum' in s:assert v in s['enum'],(p,'invalid enum',v)
 if 'anyOf' in s:
  errs=[]
  for branch in s['anyOf']:
   try:schema_check(v,branch,p);return
   except AssertionError as e:errs.append(str(e))
  raise AssertionError(p+' does not match any schema branch')
 if 'type' not in s:return
 assert typ(v)==s['type'],(p,typ(v),s['type'])
 if typ(v)=='object':
  assert set(s['required'])<=set(v),(p,'missing',set(s['required'])-set(v))
  assert set(v)<=set(s['properties']),(p,'unknown fields',set(v)-set(s['properties']))
  for k,x in v.items():schema_check(x,s['properties'][k],p+'/'+k)
 if typ(v)=='array':
  for i,x in enumerate(v):schema_check(x,s['items'],p+'/'+str(i))
def flatten(v,path=()):
 # Empty containers retained explicitly; paths have typed integer array indexes.
 if not isinstance(v,(dict,list)) or not v:return [(path,typ(v),v)]
 return [(p,t,z) for k,x in (v.items() if isinstance(v,dict) else enumerate(v)) for p,t,z in flatten(x,path+(k,))]
def unflatten(rows):
 if rows[0][0]==():return rows[0][2]
 root=[] if isinstance(rows[0][0][0],int) else {}
 for path,t,value in rows:
  ptr=root
  for j,k in enumerate(path):
   end=j==len(path)-1
   if isinstance(ptr,list):
    while len(ptr)<=k:ptr.append(None)
   if end:ptr[k]=value
   else:
    try:exists=ptr[k]
    except (KeyError,IndexError):exists=None
    if exists is None:ptr[k]=[] if isinstance(path[j+1],int) else {}
    ptr=ptr[k]
 return root
def acyclic(graph):
 visiting=set();done=set();order=[]
 def visit(n):
  assert n not in visiting,('cycle',n)
  if n in done:return
  assert n in graph,('unknown graph node',n)
  visiting.add(n)
  for p in graph[n]:visit(p)
  visiting.remove(n);done.add(n);order.append(n)
 for n in graph:visit(n)
 return order

def validate(ds,asof):
 for name,count in ds['manifest']['counts'].items():
  if name in ds:assert len(ds[name]['records'])==count,('manifest count',name)
 allids={};count=0
 for name,d in ds.items():
  for row in d.get('records',[]):
   assert 'id' in row,(name,'missingid');id=row['id'];assert id not in allids,('duplicateid',id);allids[id]=name;count+=1
 def refs(ids,kind=None):
  for x in ids:
   assert x in allids,('broken ref',x)
   if kind:assert allids[x]==kind,('wrongrefkind',x,kind)
 modules={r['id']:r for r in ds['modules']['records']};topics={r['id']:r for r in ds['topics']['records']};comps={r['id']:r for r in ds['competencies']['records']};res={r['id']:r for r in ds['resources']['records']}
 graph={k:v['hard_prerequisites'] for k,v in comps.items()};order=acyclic(graph)
 acyclic({k:v['hard_prerequisites']+v['recommended_preparation'] for k,v in comps.items()})
 for c in comps.values():refs(c['recommended_preparation'],'competencies');refs(c['optional_enrichment'],'competencies')
 for m in modules.values():
  for k in ['slug','level','tags','why_it_matters','objectives','topic_ids','required_math','reading_assignments','exercise_ids','practical_assignment','common_mistakes','checkpoint_questions','mastery_criteria','remediation','estimate_basis']:
   assert m.get(k),(m['id'],'missing design',k)
  assert 0<m['study_hours'][0]<=m['study_hours'][1]
  refs(m['topic_ids'],'topics');refs(m['exercise_ids'],'exercises');refs([m['quiz_id']],'quiz_blueprints');refs(m['competency_ids'],'competencies');refs([m['domain_id']],'domains');refs([m['phase_id']],'phases');refs([m['program_id']],'programs')
  for tid in m['topic_ids']:assert topics[tid]['module_id']==m['id']
 for t in topics.values():refs([t['module_id']],'modules');refs(t['subtopic_ids'],'subtopics');assert t['scope_outline'];assert t['readiness']!='publication_ready' or t['reviewed_lesson'] is not None
 for s in ds['subtopics']['records']:refs([s['topic_id']],'topics');refs(s['competency_ids'],'competencies');assert s['scope']
 for a in ds['associations']['records']:refs([a['resource_id']],'resources');refs([a['competency_id']],'competencies');refs(a['topic_ids'],'topics')
 claims={r['id'] for r in load(R/'research/registers/claims.json')['records']}
 for a in ds['associations']['records']:
  assert set(a['evidence_claim_ids'])<=claims
  if a['status']=='selected_reading':assert a['evidence_claim_ids'],(a['id'],'selected reading lacks bounded evidence')
 for name in ['exercises','quiz_blueprints']:
  for row in ds[name]['records']:refs([row['module_id']],'modules');refs(row['competency_ids'],'competencies');assert row['pass_score']==85
 pg={p['id']:[x for x in p['prerequisites'] if x.startswith('PR')] for p in ds['projects']['records']};acyclic(pg)
 for p in ds['projects']['records']:refs(p['prerequisites']);assert sum(p['rubric'].values())==100
 for p in ds['learning_paths']['records']:
  have=set()
  for mid in p['module_sequence']:
   assert set(graph['C-'+mid])<=have,(p['id'],'inaccessible module',mid)
   have.add('C-'+mid)
  refs(p['assessment_gates'],'quiz_blueprints')
 for r in res.values():
  for k in ['title','author_organization','canonical_url','difficulty','cost','access_limitations','study_hours','time_basis','topics_competencies','recommended_audience','rationale','prerequisites','priority','role','geography','last_verification_date','verification_scope','rights','status']:
   assert r.get(k),(r['id'],'resource metadata',k)
  refs(r['replacement_ids']+r['supersedes_ids']+r['free_alternative_ids'],'resources')
  assert r['canonical_url'].startswith('https://')
 for c in ds['capstones']['records']:refs(c['project_ids'],'projects');refs([c['assessment_policy']],'assessment_policies')
 for c in comps.values():refs(c['assessment_ids'],'exercises');refs([c['diagnostic']['bridge']],'modules')
 for r in res.values():refs(r['topics_competencies'],'competencies')
 for q in ds['quiz_blueprints']['records']:
  assert sum(i['weight'] for i in q['items'])==100
  for i in q['items']:
   if 'exercise_id' in i:refs([i['exercise_id']],'exercises')
 for p in ds['programs']['records']:refs(p['phase_ids'],'phases')
 for p in ds['phases']['records']:refs(p['module_ids'],'modules')
 for p in ds['decision_cards']['records']:refs(p['required_in_capstones'],'capstones')
 for p in ds['authoring_queue']['records']:refs([p['topic_id']],'topics')
 mappings=ds['source_mappings']['records'];ids={x['original_id'] for x in mappings}
 for f in ['modules','topics','resources']:
  original=load(R/'research/inventory'/f'{f}.json');assert {x['id'] for x in original}<=ids
  if f=='topics':
   for old in original:assert topics[old['id']]['scope_outline']==old['subtopics'],('scope loss',old['id'])
 for row in mappings:refs(row['canonical_ids'])
 assert sum(m['kind']=='capstone' for m in mappings)==7
 assert sum(m['kind']=='decision_card' for m in mappings)==23
 assert sum(m['kind']=='inherited_topic_resource' for m in mappings)==3656
 assert sum(m['kind']=='module_resource' for m in mappings)==239
 assert sum(m['kind']=='prerequisite' for m in mappings)==186
 snapshots={x['id']:x for x in ds['source_items']['records']}
 for name in ['modules','topics','resources','stages']:
  for original in load(R/'research/inventory'/f'{name}.json'):
   key=original.get('id','STAGE-'+str(original.get('stage')))
   assert snapshots['SRC-'+key]['original_record']==original,('archival field loss',key)
 stale=[];quarantine=[]
 for r in ds['market_rules']['records']:
  checked=datetime.date.fromisoformat(r['verification_date']);age=(asof-checked).days
  assert age>=0,('future verification',r['id'])
  if age>r['review_interval_days']:stale.append(r['id'])
  if r['review_status'].startswith('quarantined') or r['review_status'].startswith('rejected'):quarantine.append(r['id']);assert not r['publication_eligible']
  assert r['source_url'] and r['uncertainty'] and r['unknown_date_reason']
  assert not r['current_operational_publication_eligible'],('uncertified current rule',r['id'])
 # Flatten/rebuild ALL values including nested relationships, ordered arrays and explicit nulls.
 leaves=0
 for name,d in ds.items():
  rows=flatten(d);rebuilt=unflatten(rows);assert rebuilt==d,('roundtrip',name);leaves+=len(rows)
 return {'entity_count':count,'hard_graph_nodes':len(order),'hard_graph_edges':sum(map(len,graph.values())),'roundtrip_leaf_values':leaves,'stale_rules':stale,'quarantined_or_rejected_rules':quarantine,'publication_ready_lessons':sum(t['readiness']=='publication_ready' for t in topics.values())}
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--as-of',default='2026-09-22');ap.add_argument('--write-schemas',action='store_true');ap.add_argument('--negative-tests',action='store_true');a=ap.parse_args();ds={p.stem:load(p) for p in sorted((R/'data/v1').glob('*.json'))}
 for n,d in ds.items():
  p=R/'data/schemas'/f'{n}.schema.json'
  if a.write_schemas:
   s=shape(d);s.update({'$schema':'https://json-schema.org/draft/2020-12/schema','title':'P01 '+n+' interchange','description':'Structural contract. Cross-entity, source parity and pedagogical invariants are checked by validate_canonical.py.'})
   enums={'resources':{'cost':['free','paid','mixed','unknown'],'priority':['Essential','Recommended','Advanced','Optional','Reference'],'role':['foundational','optional'],'status':['access_or_inherited_metadata_only','limited_review','selected_sections_reviewed']},'topics':{'readiness':['scope_outline','teaching_brief','publication_ready']},'modules':{'readiness':['learning_design']}}
   for field,values in enums.get(n,{}).items():s['properties']['records']['items']['properties'][field]['enum']=values
   p.write_text(json.dumps(s,indent=2)+'\n')
  assert p.exists(),('missing schema',n)
  schema_check(d,load(p))
 result=validate(ds,datetime.date.fromisoformat(a.as_of));neg=[]
 if a.negative_tests:
  changes=[('cycle',lambda d:d['competencies']['records'][0]['hard_prerequisites'].append(d['competencies']['records'][0]['id'])),('lost_scope',lambda d:d['topics']['records'][0].update(scope_outline='dropped')),('broken_resource',lambda d:d['associations']['records'][0].update(resource_id='R-MISSING')),('unsafe_quarantine',lambda d:next(x for x in d['market_rules']['records'] if x['review_status'].startswith('quarantined')).update(publication_eligible=True))]
  for label,change in changes:
   bad=copy.deepcopy(ds);change(bad)
   try:validate(bad,datetime.date.fromisoformat(a.as_of))
   except AssertionError:neg.append(label);continue
   raise AssertionError('negative test failed: '+label)
 result.update(as_of=a.as_of,result='PASS',negative_tests_rejected=neg,files=len(ds),version='1.0.0-design')
 (R/'research/validation-p01.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
if __name__=='__main__':main()
