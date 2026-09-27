#!/usr/bin/env python3
"""Apply documented P01 review corrections; regenerate indexes/reconciliation metadata."""
import json,re,copy,collections
from pathlib import Path
R=Path(__file__).resolve().parents[1];V='1.0.0-design';D='2026-09-22'
def read(p):return json.loads((R/p).read_text())
def write(p,x):(R/p).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n' if not isinstance(x,str) else x)
def save(n,rows):write('data/v1/'+n+'.json',{'version':V,'as_of':D,'records':rows})
mods=read('data/v1/modules.json')['records'];cs=read('data/v1/competencies.json')['records'];rs=read('data/v1/resources.json')['records'];a=read('data/v1/associations.json')['records'];maps=read('data/v1/source_mappings.json')['records']
rs=[r for r in rs if r['id'] not in ['RX23','RX24','RX25','RX26']]
a=[x for x in a if not x['id'].startswith('A-FREE-')]
by={r['id']:r for r in rs}
by['RX04'].update(title='Calibration to American Options: Numerical Investigation of the de-Americanization Method',author_organization='Olena Burkovska, Kathrin Glau, Maximilian Gaß, Mirco Mahlstedt, Wim Schoutens and Barbara Wohlmuth',doi='10.48550/arXiv.1611.06181',publication_date='2016-11-18')
by['RX04']['unknowns'].pop('doi',None);by['RX04']['unknowns'].pop('publication_date',None)
by['R11'].update(edition='1; ISBN9780471792512',publication_date='2006-09',verification_scope='Wiley-VCH first-edition print metadata/TOC reviewed. Online-platform dates differ from original print publication. Full book not reviewed.',status='limited_review',doi='10.1002/9781119202073');by['R11']['unknowns'].pop('edition',None);by['R11']['unknowns'].pop('publication_date',None);by['R11']['unknowns'].pop('doi',None)
by['R49'].update(canonical_url='https://math.nyu.edu/inmemoriam/avellaneda/HighFrequencyTrading.pdf',publication_date='2008-04',doi='10.1080/14697680701381228',verification_scope='Author/university-hosted published paper: introduction and sections2.1–2.4 read. Stylized inventory model; full empirical validation or options implementation not claimed.',status='selected_sections_reviewed')
for k in ['publication_date','doi']:by['R49']['unknowns'].pop(k,None)
by['R32'].update(publication_date='2025-05-02',verification_scope='Mandy Xu executive-summary article read; linked full report not reviewed. Exchange estimates have classification/sample limitations; headline percentages and causal conclusions not adopted.',status='limited_review');by['R32']['unknowns'].pop('publication_date',None)
by['RX10']['verification_scope']='Author-hosted2014 PDF cover/TOC, p55 corridor convention and pp160–161 relative-value/correlation discussion read. Practitioner weighting prescriptions are heuristics; historical liquidity assertions not current rules.'
by['R67']['verification_scope']='Full short1999-05-06 Parkinson testimony read; leverage, counterparty information and collateral-management discussion. Not an LTCM complete position reconstruction.'
by['RX03']['verification_scope']='Full short OIC article read: input list, American binomial comment and model-price limitations. It does not contain the full BSM formula/assumptions derivation; use RX26 for the closed-form formula and RX24 for replication/PDE intuition.'
extras=[('RX23','Options Theory for Professional Trading','Zerodha Varsity','https://zerodha.com/varsity/module/option-theory/','broker education','Beginner','Module directory reviewed; chapter contents not fully reviewed. Optional India-friendly explanation candidate; dated rules must come from current official sources.','M21 M24 M32'),('RX24','Finance Theory I, Lectures10–11: Options','Andrew W. Lo / MIT OCW','https://ocw.mit.edu/courses/15-401-finance-theory-i-fall-2008/c40ecc0cc0dce0fbf2d229bc4027c43b_MIT15_401F08_lec10.pdf','university lecture notes','Intermediate','Slides3–13 payoffs and16–21 replication/BSM PDE; original2007–2008 teaching notes. Slide21 PDE visually verified separately; no video timestamps asserted.','M21 M24 M25 M29 M30'),('RX25','Financial Crisis Inquiry Report, Chapter19: September2008, The Bailout of AIG','Financial Crisis Inquiry Commission','https://fcic-static.law.stanford.edu/cdn_media/fcic-reports/fcic_final_report_chapter19.pdf','official historical report','Intermediate','Printed pp344–350 selected paragraphs: funding, collateral, downgrade and securities-lending channels. Majority report; broader crisis conclusions/dissents not exhaustively reviewed.','M46 M47 M66')]
extras.append(('RX26','Financial Management, Class20: Options (2)','MIT Sloan / MIT OCW','https://ocw.mit.edu/courses/15-414-financial-management-summer-2003/bd1dfbf076784d6494586eb77afb07a1_lec20_options2.pdf','university lecture notes','Intermediate','Summer2003 notes pp5–12: parity and BSM closed-form teaching formula; not current contract facts. Formula page visually checked; historical American-stock example needs explicit modeling assumptions.','M29 M30 M32'))
for id,title,author,url,kind,level,scope,mids in extras:
 row=copy.deepcopy(by['RX01']);row.update(id=id,title=title,author_organization=author,canonical_url=url,resource_type=kind,difficulty=level,access_limitations=scope,verification_scope=scope,rationale=scope,topics_competencies=['C-'+m for m in mids.split()],status='limited_review',original_provenance={'origin':'P01 canonical review'});rs.append(row)
for r in rs:
 r['publication_status']='primary preprint; subsequent journal status not established in this review' if r['id'] in ['RX04','R35','R41'] else 'published journal paper; author-hosted copy' if r['id']=='R49' else 'publisher/official source; exact peer-review status not inferred' 
 r['video_timestamps']=None;r['video_timestamp_reason']='Not a video assignment, or video not watched; no timestamp invented.'
 r['entitlement_status']='link_only; no right to redistribute source text or market data established'
dates={'R01':'2024-06','R10':'2013','R56':'2026-08-20','R67':'1999-05-06','R68':'2021-10-14','RX04':'2016-11-18','RX09':'2013-04','RX16':'2007','RX17':'2018-03','RX18':'2020-11-17','RX24':'2008','RX25':'2011','RX26':'2003'}
for r in rs:
 if r['id'] in dates:r['publication_date']=dates[r['id']];r['unknowns'].pop('publication_date',None)
 if r['id']=='R10':r['doi']='10.1002/9781118662724';r['unknowns'].pop('doi',None)
 if r['id']=='R58':r['updated_date']='2026-04-01';r['unknowns'].pop('updated_date',None)
a.append({'id':'A-FREE-BSM','resource_id':'RX26','competency_id':'C-M30','topic_ids':['M30.01'],'reading_scope':'Class20 pp5–12: parity and closed-form formula; model assumptions explicit','purpose':'Free numerical-formula reference','status':'selected_reading','evidence_claim_ids':['CL02','CL03']})
# Exact free teaching assignments augment broad TOC candidates.
for mid,tids,scope in [('M21',['M21.01'],'Slides3–9: rights and payoff tables'),('M24',['M24.01'],'Slides8–13: signed legs and strategy examples'),('M29',['M29.01'],'Slides16–20: one-period replication and no-arbitrage'),('M30',['M30.01'],'Slides16–21: binomial replication and BSM PDE')]:
 a.append({'id':'A-FREE-'+mid,'resource_id':'RX24','competency_id':'C-'+mid,'topic_ids':tids,'reading_scope':scope,'purpose':'Free exact-section alternative for this competency, not the entire advanced textbook.','status':'selected_reading','evidence_claim_ids':['CL02','CL03']})
for c in cs:
 target=next(m for m in mods if m['id']==c['module_id'])
 c['hard_edge_justifications']=[{'requires':p,'supplied_skill':next(x['outcome'] for x in cs if x['id']==p),'consumed_by':target['why_it_matters']} for p in c['hard_prerequisites']]
save('competencies',cs);save('resources',rs);save('associations',a)
domains=sorted({m['domain'] for m in read('research/inventory/modules.json')})+['DB · Entry bridges'];save('domains',[{'id':d.split(' · ')[0],'title':d.split(' · ')[1]} for d in domains])
for m in maps:
 p=m['provenance']
 if 'json_pointer' in p and 'source' not in p:p['source']='sources/roadmaps/options-curriculum-catalog.json'
 if 'master_line' in p:p['master_source']='sources/roadmaps/options-master-knowledge-map.md'
save('source_mappings',maps)
source_items=[]
for name in ['modules','topics','resources','stages']:
 for i,row in enumerate(read('research/inventory/'+name+'.json')):
  key=row.get('id','STAGE-'+str(row.get('stage')))
  source_items.append({'id':'SRC-'+key,'kind':name,'original_record':row,'source':'research/inventory/'+name+'.json','pointer':'/'+str(i),'disposition':'Lossless archival item; canonical relationships and pedagogical fields are separate.'})
catalog=read('sources/roadmaps/options-curriculum-catalog.json')
source_items.append({'id':'SRC-CATALOG-METADATA','kind':'catalog_metadata','original_record':{k:v for k,v in catalog.items() if k not in ['modules','resources','assessments','stages']},'source':'sources/roadmaps/options-curriculum-catalog.json','pointer':'/','disposition':'Original title/version/date/scope metadata preserved.'})
save('source_items',source_items)
rules=read('data/v1/market_rules.json')['records']
for rule in rules:
 rule['publication_eligible_scope']='historical citation only' if rule['publication_eligible'] else 'excluded factual detail; research/conflict discussion only'
 rule['current_operational_publication_eligible']=False
save('market_rules',rules)
queue=[]
for t in read('data/v1/topics.json')['records']:
 hours={'Beginner':[6,10],'Intermediate':[8,14],'Advanced':[12,20],'Professional/Quantitative':[16,30]}.get(t['difficulty'],[8,16])
 queue.append({'id':'AUTH-'+t['id'],'topic_id':t['id'],'owner_stage':'P17','status':'not_authored_reviewed','remaining_work':['Topic-specific teaching brief or refinement','Original explanation and worked example','Fresh exercise and reference/rubric','Source/units/numerical review','Accessibility and transfer check'],'author_review_hours':hours,'estimate_basis':'Editorial estimate including one correction cycle; add15–25% program integration and additional empirical/rights work as needed.'})
save('authoring_queue',queue)
# Complete coverage rows include item-level capstones/decision cards/branches and each representation.
cov=read('research/registers/coverage-matrix.json');rows={x['mapping_id']:x for x in cov['records']}
for m in maps:
 if m['id'] not in rows:rows[m['id']]={'id':'COV-'+m['original_id'],'mapping_id':m['id'],'kind':m['kind'],'rating':'Good','evidence':m['provenance'],'scope':'present','accuracy':'archival parity, external evidence separately bounded','teaching':'preserved policy/brief, not full lesson','practice':'integrated with canonical projects/policy','verification':'exact original text retained','maintenance':'stableID and provenance','disposition':m['disposition']}
 row=rows[m['id']];row['evidence']=m['provenance'];row['source_representations']=[]
 if 'master_line' in m['provenance']:row['source_representations'].append({'file':'sources/roadmaps/options-master-knowledge-map.md','line':m['provenance']['master_line'],'rating':row['rating']})
 if 'json_pointer' in m['provenance']:row['source_representations'].append({'file':'sources/roadmaps/options-curriculum-catalog.json','pointer':m['provenance']['json_pointer'],'rating':row['rating']})
 if m['provenance'].get('source')=='sources/roadmaps/options-learning-roadmap.md':row['source_representations'].append({'file':m['provenance']['source'],'line':m['provenance'].get('line'),'rating':row['rating']})
 if m['kind']=='resource':
  resource=next(r for r in rs if r['id']==m['original_id']);row['verification']=resource['verification_scope'];row['rating']='Good' if resource['status']=='selected_sections_reviewed' else 'Partial' if resource['status']=='limited_review' else 'Weak'
 row['gap_types']=['missing_teaching','missing_practice_variants'] if m['kind'] in ['topic','subtopic_scope'] else ['absent_verification'] if m['kind'] in ['resource','inherited_topic_resource','module_resource'] else []
 if m['original_id'] in ['R56','R58','R60']:row['gap_types']+=['inaccurate_or_conflicting_claim','maintenance_gap']
cov['records']=list(rows.values());write('research/registers/coverage-matrix.json',cov)
# Human indexes generated from exact canonical records.
text='# Module index\n\nEvery link opens a complete module design. Topics inside remain explicitly scoped, not publication-ready lessons.\n\n| Module | Level | Study hours |\n|---|---|---|\n'
for m in mods:text+=f"| [{m['id']} — {m['title']}](modules/{m['id']}.md) | {m['level']} | {m['study_hours'][0]}–{m['study_hours'][1]} |\n"
write('docs/curriculum/MODULE_INDEX.md',text)
text='# Learning paths\n\nHard prerequisite closure is included in every sequence. Demonstrated diagnostic credit can shorten repeat work. Hours exclude project integrations and are editorial estimates.\n\n'
for p in read('data/v1/learning_paths.json')['records']:
 text+=f"## {p['title']} — {p['id']}\n\nAudience: {p['audience']}. Entry: {p['entry_criteria']}\n\nSequence: "+' → '.join(f'[{m}](modules/{m}.md)' for m in p['module_sequence'])+f".\n\nBranches: {', '.join(x['module_id'] for x in p['branches'])}, after their hard prerequisites. Exit: {p['exit_competencies'][0]} Study: {p['study_hours'][0]}–{p['study_hours'][1]} hours before diagnostic credit.\n\nGates: each module's quiz/practical rubric, zero critical safety errors, fresh transfer evidence, and the path-relevant capstone. Coding-dependent work requires B03.\n\n"
write('docs/curriculum/PATHS.md',text)
text='# Project capability specifications\n\nAll12 specifications use synthetic data by default, with separately licensed real-data extensions only where appropriate. Project completion is not claimed in P01. Prerequisite PR IDs are earlier projects; M/B IDs are assessed modules. Each project has an85% rubric threshold and a critical-error override.\n\n'
for p in read('data/v1/projects.json')['records']:
 text+=f"## {p['id']} — {p['title']}\n\nPrerequisites: {', '.join(p['prerequisites'])}. Effort: {p['study_hours'][0]}–{p['study_hours'][1]} hours, assuming entry competencies.\n\n{p['learning_objective']}\n\nData: {p['data_plan']}\n\nSteps:\n\n"+'\n'.join(f'{i+1}. {s.strip()}' for i,s in enumerate(p['steps']))+f"\n\nDeliverables: {p['deliverables']}\n\nReference: {p['reference_behavior']}\n\nRubric: "+', '.join(f'{k.replace("_"," ")} {v}%' for k,v in p['rubric'].items())+'. '+p['critical_failure']+'\n\nFailure cases: '+'; '.join(p['failure_cases'])+f"\n\nLimitations: {p['limitations']}\n\n"
text+='## Original capstone integration\n\n'
for c in read('data/v1/capstones.json')['records']:text+=f"- **{c['id']} {c['title']}** — {c['original_brief']} Project capabilities: {', '.join(c['project_ids'])}.\n"
write('docs/curriculum/PROJECTS.md',text)
text='# Verified resource database and reading policy\n\nVerification is scoped. A transport check, bibliographic check, selected-section reading and numerical replication are distinct. No full paywalled book review is claimed. Null metadata has a reason in the export. This index links all original resources and the targeted additions; exact assignments live in associations.json. Original inherited links remain archival context.\n\nSee [book evaluations](BOOK_EVALUATIONS.md), [explicit assignments](../../data/v1/associations.json), and [full metadata](../../data/v1/resources.json). A required source must be usable at release; unreviewed candidates and inaccessible full texts are optional/reference only until resolved.\n\n| ID and source | Cost / priority | Verification scope |\n|---|---|---|\n'
for r in rs:text+=f"| [{r['id']} — {r['title']}]({r['canonical_url']}) | {r['cost']} / {r['priority']} | {r['verification_scope'].replace('|','/')} |\n"
write('docs/curriculum/RESOURCES.md',text)
manifest=read('data/v1/manifest.json');manifest['counts'].update(resources=len(rs),source_mappings=len(maps),projects=12,capstones=7,decision_cards=23,specializations=7,market_rules=len(rules),associations=len(a),source_items=len(source_items),authoring_queue=len(queue));write('data/v1/manifest.json',manifest)
print('Finalized',len(rs),'resources;',len(maps),'source mappings;',len(a),'explicit assignments')
from polish_prose import polish
polish()
