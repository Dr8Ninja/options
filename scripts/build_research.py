#!/usr/bin/env python3
import json,re
from pathlib import Path
R=Path(__file__).resolve().parents[1];D='2026-09-22'
def read(p):return json.loads((R/p).read_text())
def write(p,x):(R/p).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
cs=[]
for l in (R/'research/design/claims.psv').read_text().splitlines():
 if not l or l.startswith('#'):continue
 id,cl,claim,rids,scope,status,limits=l.split('|');cs.append({'id':id,'class':cl,'claim':claim,'resource_ids':rids.split(),'review_scope':scope,'status':status,'limitations':limits,'verified_on':D,'publication_ready':False,'publication_reason':'Bounded research conclusion may inform authoring; no reviewed lesson publication is claimed.','next_action':'Preserve caveat in lesson and independent review' if status.startswith('adopted') else 'Resolve source conflict or exclude claim from publication'})
write('research/registers/claims.json',{'as_of':D,'records':cs})
areas=[
('CK01','Foundations and contracts','M01 M02 M03 M21 M22 M23','Contract dimensions and loss accounting','CL01 CL14','Resolved conceptual scope; jurisdiction-specific details gated'),
('CK02','Market infrastructure and execution','M03 M04 M05 M47 M49 M50 M51 M52','Queue, hidden liquidity, adverse selection, inventory, margin, outages and reconciliation','CL01 CL11 CL17 CL20','Venue algorithms and current margin parameters remain product-specific readings'),
('CK03','Payoffs and structures','M24 M25 M26 M27 M28','Signed legs, multi-date cash paths, assignment and funding','CL02 CL04','Every inherited named structure retained; detailed variant lessons P17'),
('CK04','Greeks and P&L','M32 M33 M34 M48','Primary/higher derivatives, units, finite differences and nonlinear repricing','CL03 CL11','Greek convention table authored; higher-order numerical lesson packs P17'),
('CK05','Pricing and numerics','M13 M14 M29 M30 M31','No-arbitrage, martingale/PDE, trees, MC/variance reduction, FD, exercise and dividends','CL02 CL03 CL06','Conditional theory distinguished from calibration evidence; advanced full lessons P17'),
('CK06','Advanced models and surfaces','M37 M40 M44','Local/stochastic/Heston/SABR/jumps/SVI, identification and American treatment','CL05 CL06','SVI conditions reviewed; Heston/SABR original full texts not yet reviewed, implementation claims excluded'),
('CK07','Volatility','M12 M35 M36 M37 M38 M39 M41','RV/IV/forward, skew/convexity, VRP/events/cones/regimes/GARCH/swaps/VIX/dispersion','CL04 CL05 CL08','Exact current VIX methodology retrieval bounded; FAQ-level distinction and synthetic variance work usable'),
('CK08','Hedging and hypotheses','M28 M34 M41 M48 M53 M55','Direction/horizon/skew/term/event/liquidity/tail/convexity/carry/edge/falsification','CL04 CL12','No strategy profitability adopted; costed hypothesis dossier required'),
('CK09','Quantitative foundations','M01 M10 M11 M12 M13 M14 M57 B02','Algebra through Itô, regression, bootstrap/Bayes, time series, MC and ML limits','CL03 CL12 CL15','Competency-linked math levels and entry bridge; advanced prerequisites only at use'),
('CK10','Research validity','M54 M55 M56 M57 M58 M65','Lineage/rights/timestamps/adjustments/filtering, bias, holdouts and uncertainty','CL12 CL13','Synthetic route fully rights-safe; real-data rights require use-specific approval'),
('CK11','Risk and capital','M45 M46 M47 M48 M49','Ruin/drawdown/Kelly/VaR/ES, joint stresses, funding and operations','CL01 CL11 CL14','No universal retail risk percentage; training budgets explicitly hypothetical'),
('CK12','Psychology','M60 M61 M65','Overconfidence/revenge/FOMO/loss aversion/gambler/recency/anchoring/confirmation/sunk cost','CL12 CL15','Process journal and calibrated forecast review; no diagnosis or guaranteed behavioral cure'),
('CK13','Professional specializations','M33 M38 M40 M41 M43 M44 M50 M51 M52 M67','Market making/RV/dispersion/dealer flows/pinning/0DTE/exotics/autocallables','CL05 CL06 CL11','Observed/inferred separation; advanced implementation claims not publication ready'),
('CK14','Historical cases','M39 M42 M66','1987/LTCM/2008/2018/2020/meme stocks/0DTE/short-vol failures','CL07 CL08 CL09 CL10','Case packs distinguish full source reading from discovery;2008/2020 detail bounded'),
('CK15','India and global','M62 M63 M64','Exchange/product-specific contracts, STT/fees/margins/restrictions/expiry and rule chains','CL14 CL17 CL18 CL20','Settlement principle resolved; R56 statistics and unverified current BSE/NSE constants quarantined')]
rows=[]
for id,area,mids,scope,claims,disp in areas:
 rows.append({'id':id,'area':area,'module_ids':mids.split(),'required_scope':scope,'claim_ids':claims.split(),'scope_rating':'Good','teaching_rating':'Partial','practice_rating':'Good','evidence_rating':'Partial','maintenance_rating':'Good','disposition':disp,'coverage_evidence':'All module topic/scope strings retained in data/v1/topics.json; module dossiers contain distinct numerical examples and checkpoint/practical work; no full-topic lesson claim.'})
write('research/registers/checklist.json',{'as_of':D,'records':rows})
qs=[]
for n,(id,area,mids,scope,claims,disp) in enumerate(areas,1):
 qs.append({'id':f'RQ{n:02d}','priority':'P0' if n in [1,3,4,10,11,15] else 'P1','question':'What evidence, prerequisite and practical test makes '+area.lower()+' teachable and bounded?','modules':mids.split(),'claims':claims.split(),'answer':disp,'status':'bounded' if any(x in disp.lower() for x in ['quarantin','not yet','bounded','p17','product-specific','not publication']) else 'resolved_for_design','diminishing_returns':'Further broad links would not change this design decision; next useful work is the named source/lesson verification, not more general discovery.','reopen_trigger':'New operative rule, contradictory primary evidence, failed exercise, or P17 authoring of the bounded section.'})
# Domain-specific stopping reasons, rather than a link quota.
reasons={'D01':'Contract distinctions triangulated with ODD/OIC; product procedures need live worksheet.','D02':'Event/vintage design set; no causal macro trading effect claimed.','D03':'Math dependency and numerical benchmarks set; advanced derivation review remains P17.','D04':'Optional placement justified by evidence limitations; exhaustive pattern efficacy search has low expected design value.','D05':'Signed-leg accounting supports all structure families; variant lessons remain.','D06':'BSM/parity benchmarks and numerical failure design ready; advanced algorithms require implementation validation.','D07':'Variance/surface evidence changes adopted; exact VIX method and deeper model texts are targeted blockers.','D08':'Specialist-only scope prevents generalizing equity conventions; product term sheets required for lessons.','D09':'Joint loss/funding/operational framework set; margin constants intentionally excluded.','D10':'Inventory and adverse-selection distinction set; venue-specific rules need exact reading.','D11':'Leakage/rights controls and synthetic route set; licensed chains unavailable without entitlement.','D12':'Practice review designed; measured training efficacy not claimed.','D13':'High-value circular conflicts exposed; current-rule certification awaits masters/operative chains.','D14':'Case mechanisms bounded; avoid accumulating famous anecdotes.'}
write('research/registers/questions.json',{'as_of':D,'records':qs,'domain_stopping_review':[{'domain_id':d,'reason':v,'status':'design decision stable; exclusions explicit'} for d,v in reasons.items()]})
gaps=[]
for l in (R/'docs/research/reviews/phase-1-gaps.md').read_text().splitlines():
 if re.match(r'\| G\d\d \|',l):
  _,id,finding,severity,resolution,_=l.split('|');id=id.strip();n=int(id[1:]);status='resolved_design'
  if n in [1,12,22,23,25]:status='design_resolved_authoring_or_delivery_deferred_P17'
  if n in [9,10,11,14,15,16,17,19]:status='bounded_with_publication_exclusions'
  if n==21:status='excluded_P02_onward'
  gaps.append({'id':id,'original_finding':finding.strip(),'severity':severity.strip(),'required_resolution':resolution.strip(),'status':status,'evidence':['data/v1/modules.json','data/v1/associations.json','research/registers/claims.json','data/v1/market_rules.json','docs/curriculum/CONTENT_GUIDE.md'],'disposition':'No archival loss. Design fields/policies supplied; scope-only lessons, unavailable full-text evidence and uncertified current rules are not publication ready.','recheck':'scripts/validate_canonical.py plus three canonical review records'})
write('research/registers/gaps.json',{'as_of':D,'records':gaps})
old=read('research/evidence/source-checks-2026-09-21.json')['records']
write('research/evidence/p01-ledger.json',{'as_of':D,'source_checks_preserved':old,'updates':[{'id':'P01-'+q['id'],'supersedes_status_of':q['id'],'resource_ids':q['original_resource_ids'],'disposition':'See canonical resource verification_scope and claim register for new reading. Earlier record retained as historical observation.','status':'bounded; no automatic promotion from transport to content review'} for q in old],'claim_review_records':cs,'transport_reports':['resource-access-p01.json','priority-access-p01.json','extra-access-p01.json'],'cache_policy':'Temporary third-party retrievals stayed outside distributable data; no full books/datasets included.','excluded_sources':['Unlicensed mirrors of Sinclair/Gatheral books: no content used.','Smallake mirror of execution paper retrieved but excluded as nonprimary; seek author/university copy.','Old BSE investor-deck crawl dates cannot establish current contract rules.','Marketing profitability claims and snippets were discovery only.']})
print('Research registers:',len(cs),'claims',len(rows),'checklist areas',len(gaps),'original gaps')
# Individual closure/bounding for every original evidence question.
qdis={
'Q001':'Selected ODD II/VIII/X content and visual/source routes reviewed; exact product/broker procedures remain dated worksheets.',
'Q002':'Supersession in SR26-2 confirmed; detailed attachment not fully read. Bank-supervisory scope, no retail legal obligation adopted.',
'Q003':'PDF recovered; methodology and key sections read; Table5/prose numeric conflict quarantined in CL10.',
'Q004':'NSE notices/specification page examined; current daily master and later amendments remain excluded.',
'Q005':'Table and bases read; internal wording/primary-law chain unresolved, current tax calculation excluded.',
'Q006':'Portfolio-margin excerpt used conceptually; full amendment history and thresholds excluded.',
'Q007':'Directory/selected engine candidates retained; no version/API execution certification.',
'Q008':'Full short exercise article read and explicitly assigned to contract/assignment competencies.',
'Q009':'Quick guide PDF not fully reviewed; excluded as mandatory evidence. Signed-leg cases and OIC/MIT alternatives supplied.',
'Q010':'Course/Unit1–2 selected; exact exercise/video segments require P17 review; timestamps unknown.',
'Q011':'Linear-algebra course remains a candidate; covariance/PSD competency and original example specified, no lecture completion claimed.',
'Q012':'Array/index/broadcasting documentation candidate selected for B03/M58; implementation release pin remains future.',
'Q013':'Specific brentq documentation opened; bracket/tolerance requirements selected for PR05.',
'Q014':'Statsmodels time-series documentation candidate; exact model API/version/tests remain implementation work.',
'Q015':'Common pitfalls12.1–12.2 read; leakage claim bounded and explicit assignment created.',
'Q016':'arch optional GARCH tool candidate; no maintained-release or forecast-quality claim adopted.',
'Q017':'Longstaff-Schwartz full methods not reviewed; least-squares Monte Carlo remains specialist scope with source/implementation review required before publication.',
'Q018':'Author PDF summary and printed pp9–18 read; selected later replication/jump chapters assigned as candidates only.',
'Q019':'Inspected document covers other volatility indices; explicitly rejected as a substitute for exact current VIX methodology.',
'Q020':'BIS2018 mechanism read; limited historical case pack created without universal causal claim.',
'Q021':'Primary preprint cover, introduction/benchmark scope and conclusion reviewed; all six authors and dividend limitation recorded.',
'Q022':'BuyWrite methodology remains candidate; no index-return replication or strategy profitability claim adopted.',
'Q023':'Maintainer README/license reviewed; separate Yahoo entitlement and redistribution restrictions made explicit.',
'Q024':'Current specification page plus2025 transition notices reviewed; series-specific current master not certified.',
'Q025':'Retail-algorithmic framework remains historical observation; subsequent full chain/broker permissions excluded as current rules.',
'Q026':'Extension observation retained; does not establish complete current implementation chain or permission to trade.',
'Q027':'Generic cash-settlement sentence rejected for stock derivatives; preserved as conflict evidence.',
'Q028':'Full2018 SEBI physical-settlement mandate read; historical principle adopted with scope.',
'Q029':'2019 follow-up landing identified; full operative attachment not reviewed, exact procedural claims excluded.'}
p=R/'research/evidence/p01-ledger.json';ledger=json.loads(p.read_text())
for row in ledger['updates']:row['disposition']=qdis[row['supersedes_status_of']]
ledger['additional_reading_events']=[{'source_url':'https://ocw.mit.edu/courses/15-414-financial-management-summer-2003/bd1dfbf076784d6494586eb77afb07a1_lec20_options2.pdf','section':'Class20 pp5–12: parity and BSM closed-form teaching notes','scope':'Text read; source historical stock example assumptions are not generalized to actual American quotes.'},{'source_url':'https://fcic-static.law.stanford.edu/cdn_media/fcic-reports/fcic_final_report_chapter19.pdf','section':'Printed pp344–350 and chapter conclusion selected paragraphs','scope':'AIG collateral/funding/securities-lending mechanism; not all crisis evidence or dissents reviewed.'}]
p.write_text(json.dumps(ledger,ensure_ascii=False,indent=2)+'\n')
