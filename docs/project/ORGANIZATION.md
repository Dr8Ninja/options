# Project organization record

Date: 21 September 2026. Scope: write the execution prompt pack and organize existing/supplied files. No research/build prompt was executed as part of this organization task.

## File moves and archived inputs

| Previous location | Current location |
|---|---|
| Root `options-learning-roadmap.md` | `sources/roadmaps/options-learning-roadmap.md` |
| Root `options-master-knowledge-map.md` | `sources/roadmaps/options-master-knowledge-map.md` |
| Root `options-curriculum-catalog.json` | `sources/roadmaps/options-curriculum-catalog.json` |
| Root `INVENTORY.md` | `docs/research/INVENTORY.md` |
| Root `RESEARCH.md` | `docs/research/RESEARCH.md` |
| Root `TODO.md` | `docs/project/TODO.md` |
| Root `DECISIONS.md` | `docs/project/DECISIONS.md` |
| `research/reviews/phase-1-gaps.md` | `docs/research/reviews/phase-1-gaps.md` |
| `research/reviews/phase-1-validation.md` | `docs/research/reviews/phase-1-validation.md` |
| `research/source-checks-2026-09-21.json` | `research/evidence/source-checks-2026-09-21.json` |
| Research prompt attachment | `sources/prompts/01-deep-research-original.md` |
| Production-build prompt attachment | `sources/prompts/02-production-build-original.md` |

All three roadmap files were moved without modifying their bytes. Both attachments were copied intact; [the manifest](../../sources/manifest.json) records original attachment locations and all five hashes. Original roadmap cross-links still resolve because the files moved together. Existing analysis remains intact with corrected relative links; status/decision records include the new execution plan.

## New or updated navigation and tooling

- [PROMPTS.md](../../PROMPTS.md): 23 sequential assignments, shared execution rules, research checklist, gates and resume instructions.
- [README.md](../../README.md): current status, folder map and next assignment.
- [Prompt coverage](PROMPT_COVERAGE.md): reconciliation with the master brief and both supplied prompts.
- [Source guide](../../sources/README.md), [research guide](../../research/README.md) and [canonical data boundary](../../data/README.md).
- `sources/prompts/00-master-project-brief.md`: clearly labeled chat-derived requirements summary, not an original attachment.
- `scripts/inventory_sources.py`: source paths and generated module-index links updated for the archive location. Its seven outputs were regenerated; observed curriculum counts and source bytes remain unchanged.

## Verification

The following checks passed after reorganization:

| Check | Result |
|---|---|
| SHA-256 and byte-size comparison with the archive manifest | All five supplied files match |
| Roadmap hashes compared with the pre-move inventory digests | All three originals match |
| Archived prompt contents compared directly with attachment files | Both are byte-identical |
| `python3 scripts/inventory_sources.py --check` | Pass; all seven generated artifacts agree |
| Inventory totals after moving sources | Unchanged: 67 modules, 1,019 topic/scope records, 70 resources, 17 stages, 67 module assessment briefs, seven capstones |
| Local Markdown file-target check, excluding fenced examples and external/anchor-only URLs | 19 Markdown files inspected; 516 local file links resolve; zero missing targets |
| Prompt numbering and required instruction/gate sections | P01–P23 appear exactly once in order; all 23 have a prompt body and gate |

The folder is not currently a Git repository, so no Git diff or commit was produced. These checks concern local file integrity, inventory and prompt structure; they do not establish external-link correctness, financial research completeness, browser rendering or application readiness. No backend/frontend code, application tests or deployment were performed in this organization task.

**Handoff:** prompt writing and organization are complete. The next separate assignment is “Execute P01 from PROMPTS.md.” It continues the existing research queue and completes the canonical learning design before product architecture begins.
