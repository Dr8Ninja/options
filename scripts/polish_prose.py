"""Light spacing normalization for authored Markdown, never original sources or data."""
from pathlib import Path
import re
ROOT=Path(__file__).resolve().parents[1]
def polish():
 files=list((ROOT/'docs/curriculum').rglob('*.md'))
 files += [ROOT/p for p in ['README.md','docs/project/TODO.md','docs/project/EXECUTION_LOG.md','docs/research/RESEARCH.md','docs/research/RECONCILIATION.md','docs/research/SOURCE_ANALYSIS.md','docs/research/ROADMAP_COMPARISON.md','docs/research/RESEARCH_METHODOLOGY.md','data/FIELD_DEFINITIONS.md']]
 files += list((ROOT/'docs/research/reviews').glob('canonical-pass-*.md'))+list((ROOT/'docs/research/cases').glob('*.md'))
 words='all|a|an|the|these|those|one|two|three|every|with|of|from|after|before|by|through|on|about|approximately|roughly|another|between|for|plus|minus|in|published|reviewed|printed|selected|add|Section|sections|chapter|chapters|slide|slides|pp|January|February|March|April|May|June|July|August|September|October|November|December'
 tails='modules|topics|design|specifications|resources|bridges|capstones|questions|contracts|traders|lakh|crore|pages|shares|hours|days|years|points|perspectives|requested|original|step|contract|point|year|paper|profile|module|topic|January|February|March|April|May|June|July|August|September|October|November|December'
 for p in files:
  if not p.exists():continue
  s=p.read_text();parts=re.split(r'(`[^`]*`|\]\([^)]*\)|https?://\S+)',s)
  for i,x in enumerate(parts):
   if i%2:continue
   x=re.sub(r'(\d{1,2})(January|February|March|April|May|June|July|August|September|October|November|December)(\d{4})',r'\1 \2 \3',x)
   # Keep identifiers and URLs intact; separate prose words and quantities.
   x=re.sub(r'\b([A-Za-z][a-z]{2,})(?=\d)',r'\1 ',x)
   x=re.sub(r'(?<=\d)(?=[A-Za-z]{2,}\b)(?!DTE\b|st\b|nd\b|rd\b|th\b)',r' ',x)
   x=re.sub(r'(\d) (st|nd|rd|th)\b',r'\1\2',x)
   x=re.sub(r'\b('+words+r')(?=\d)',r'\1 ',x,flags=re.I)
   x=re.sub(r'(?<=\d)('+tails+r')\b',r' \1',x,flags=re.I)
   x=re.sub(r',(?=[A-Za-z])',', ',x)
   x=re.sub(r'(?<=[A-Za-z]),(?=\d)',', ',x)
   parts[i]=x
  p.write_text(''.join(parts))
if __name__=='__main__':polish()
