#!/usr/bin/env python3
from pathlib import Path
import json
R=Path(__file__).resolve().parents[1];rows=[]
(R/'docs/research/cases').mkdir(exist_ok=True)
for line in (R/'research/design/cases.psv').read_text().splitlines():
 if not line or line.startswith('#'):continue
 id,title,sources,scope,chron,mechanism,limits,exercise,status=line.split('|')
 row={'id':id,'title':title,'resource_ids':sources.split(),'reading_scope':scope,'chronology':chron,'mechanism':mechanism,'competing_explanations_and_limits':limits,'exercise':exercise,'status':status,'publication_ready':False,'next_action':'Author full sourced chronology, test the exercise and review interpretation in P17; CASE05 first requires full primary-section reading.'};rows.append(row)
 (R/'docs/research/cases'/f'{id}.md').write_text(f'# {id} — {title}\n\nStatus: {status}; not a reviewed historical lesson.\n\nSources: {sources}. Read scope: {scope}\n\nChronology: {chron}\n\nMechanism: {mechanism}\n\nCompeting explanations and limits: {limits}\n\nAssessment: {exercise}\n\nNext work: {row["next_action"]}\n')
(R/'research/registers/cases.json').write_text(json.dumps({'as_of':'2026-09-22','records':rows},ensure_ascii=False,indent=2)+'\n')
