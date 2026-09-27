# Supplied sources and prompt history

These files preserve the project's inputs. Research conclusions and implementation instructions evolve in the living documents; do not rewrite the originals to make them match later decisions.

## Byte-preserved user files

| File | Role |
|---|---|
| [options-learning-roadmap.md](roadmaps/options-learning-roadmap.md) | Original learning sequence and assessment guidance |
| [options-master-knowledge-map.md](roadmaps/options-master-knowledge-map.md) | Original detailed knowledge map and resource library |
| [options-curriculum-catalog.json](roadmaps/options-curriculum-catalog.json) | Original machine-readable subset |
| [01-deep-research-original.md](prompts/01-deep-research-original.md) | Complete original research prompt attachment |
| [02-production-build-original.md](prompts/02-production-build-original.md) | Complete original production-build prompt attachment |

The roadmaps were moved together from the project root without changing their contents, preserving their relative cross-links. Both prompt attachments were copied from the Codex attachments directory; their entire contents, including line endings, are unchanged. The `.md` extension improves readability without changing the original text bytes.

[manifest.json](manifest.json) records the original locations, current project-relative paths, sizes and SHA-256 digests of these five files. It is an archive integrity record, not proof that their financial claims are correct or current.

## Chat-derived brief and current execution guide

[00-master-project-brief.md](prompts/00-master-project-brief.md) is a structured requirements record derived from the user's master message. It is explicitly a summary, not a byte-identical copy of an attachment. It is not included among the five file checksums.

[PROMPTS.md](../PROMPTS.md) is the current working guide. It combines the requirements with actual inventory findings, replaces the single large build assignment with gated stages, and distinguishes curriculum outlines from reviewed lessons. The archived production prompt assumes a future completed research phase; that condition is not true merely because the attachment exists.

The latest user instructions govern scope. For this organization task, only the prompt pack and file organization were requested; the research/build prompts have not been executed.
