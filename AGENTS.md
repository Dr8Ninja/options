# Repository workflow

User instruction, 1 October 2026:

- Work directly on `main`. Do not create feature branches or branch-based worktrees unless the user explicitly changes this instruction.
- Push project work only to `origin/main`; do not push new branches. Use normal fast-forward pushes, never force-push shared history.
- Before committing or pushing, inspect the working tree, fetch the remote, and preserve existing work. Reconcile remote changes on `main` and run checks appropriate to the changes.
- Use the repository's configured user Git identity for new commits. Do not rewrite existing authorship or add agent coauthor attribution.
- This direct-to-main instruction replaces earlier requirements to create a branch or pull request. Required review, tests and dependency/security validation still apply.
- Continue to follow `PROMPTS.md` for stage scope and execution records. Do not start another stage merely to commit or synchronize existing work.
