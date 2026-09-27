# P06 design review

A responsive design artifact for the options learning platform. **No product endpoints, authentication, scoring or durable storage are implemented.** Canonical content is `1.0.0-design`; all existing topics remain scopes/briefs, with zero reviewed lessons. “Options / A field guide to learning” is a working descriptive identity pending U06.

Open [prototype/index.html](prototype/index.html) directly in a browser, or from the repository root:

```sh
python3 -m http.server 8766 --bind 127.0.0.1 --directory design/prototype
```

Then open `http://127.0.0.1:8766/#/review`. This is a local design server, not a deployed application. The separate top review bar selects Light/Dark/System and nine states. Its navigation shortcuts expose synthetic learner/editor screens for inspection; production role checks remain mandatory.

Suggested review: Home → Foundations → curriculum/module/planned scope → lesson specimen; Resources → free filter → OCC scope; Paths → Absolute Beginner; Projects → PR01/capstone/dossier; Registration/login/recovery; My learning → note/conflict/bookmark; quiz → confirmation → feedback; Editorial → draft → review/publication → maintenance. Try each at 390px and 1440px, then the 320px boundary. No credentials, mail recipients, bank details or private writing are needed; use sample text only.

Artifacts:

- [FRONTEND contract](../docs/engineering/FRONTEND.md): architecture/IA/layout/implementation handoff.
- [Machine-readable tokens](tokens.json), [component rules](specs/COMPONENTS.md), [interaction states](specs/INTERACTIONS.md).
- [Accessibility/visual acceptance](specs/ACCESSIBILITY_ACCEPTANCE.md), [routes and journeys](routes.json), [content provenance](content-manifest.json).
- [Browser check report](evidence/browser-validation.json), [offline design report](evidence/design-validation.json), screenshots in evidence/.

Prototype interactions include menu/theme, phase disclosure, basic resource/ID search, saved bookmark/note in memory, note conflicts/dialog focus, sample numeric feedback, quiz submission confirmation, account lifecycle confirmations and editorial failure/confirmation layouts. Full filter/cursor behavior, 10-item forms, WebAuthn, draft rendering/reordering, complete import/report jobs and publication validation are specified for implementation; the preview does not pretend to perform them. Refresh discards sample state. Nothing is written to localStorage, IndexedDB or an external service.

To reproduce browser checks, install the pinned utility packages outside the application tree:

```sh
npm install --prefix /tmp/p06-design-tools playwright@1.58.2 axe-core@4.11.0 --no-fund --no-audit
node scripts/verify_design_browser.cjs
```

The local server must be running. Set P06_NODE_MODULES and P06_CHROME for other runtime locations. This test uses local Chrome headless, not a production browser-matrix certification. Offline design validation: `/tmp/p05-contract-venv/bin/python scripts/validate_frontend_design.py`; it includes the P05 validator and token/content/route checks. See [the review log](evidence/REVIEW.md) for actual failures, fixes and limitations.
