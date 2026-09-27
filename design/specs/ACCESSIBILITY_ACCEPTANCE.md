# Accessibility and visual acceptance — P06

Target: WCAG 2.2 AA across complete P02 journeys. The following are implementation acceptance criteria, not a claim of conformance. P06 demonstrates representative layouts, simulated keyboard actions and automated checks; P18 must test the implemented process with people/assistive technology and real API state. [Browser evidence](../evidence/browser-validation.json) identifies what ran. Checkboxes below remain unchecked until the **product** passes. Design coverage is mapped in [routes](../routes.json) and [states](INTERACTIONS.md).

The applicable reference is the [W3C WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/); modal behavior follows the [W3C dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/). Reviewed 23 September 2026. These sources inform focus, contrast, reflow, input, status and authentication criteria; a rule scanner cannot determine complete conformance.

## Shared acceptance checks

- [ ] A01 Structure: one visible H1 and one main landmark per screen; named primary/breadcrumb/editor navigation; ordered H2/H3 structure; accurate document title; skip link moves focus to main. Only one current navigation link in each set. J01–J17.
- [ ] A02 Keyboard: logical DOM order matches visual order; no positive tabindex, hover-only or drag-only action. Every route/action/filter/disclosure works without pointer. Menu Escape returns focus; disclosure is not a modal trap. Visible 3px focus never hidden behind sticky chrome. J01/J04/J05/J14/J17.
- [ ] A03 Dialogs: named dialog, initial heading/input focus as specified, background inert, Tab/Shift+Tab contained, Escape cancels safely, focus returns to trigger or meaningful successor if deleted. No nested dialogs; long comparisons can be full pages. J07/J11–J16.
- [ ] A04 Contrast: ordinary text ≥4.5:1, large text ≥3:1; meaningful controls, boundaries and focus ≥3:1 against adjacent colors in both themes. Decorative separators may be lighter. Status always has text/icon shape, not color alone. Disabled controls include readable adjacent reasons. J17/all.
- [ ] A05 Resize/reflow: 200% text, 400% browser zoom/320 CSS px; no clipping, overlapping or loss of action. 1.5 line height, .12em letter spacing, .16em word spacing and 2em paragraph spacing remain usable. Long canonical titles/IDs and email addresses wrap. Tables alone may scroll in labeled focusable regions. J01/J02/J04/J13/J14/J17.
- [ ] A06 Targets: independent controls ≥44×44 CSS px with 8px preferred separation; inline prose links retain clear underline and adequate line height. Native checkbox/radio has a padded clickable label. No tiny icon-only action or accidental menu overlap. J17/all.
- [ ] A07 Motion: reduced-motion eliminates optional transition/scroll animation; no shimmer, autoplay, flashing or drag requirement. Status does not repeatedly interrupt reading. J17/all.
- [ ] A08 Forms: visible persistent label, required/optional indicated in words, appropriate autocomplete/input mode, paste/password managers allowed. Helper and field error associated by ID; invalid state plus error summary links. Focus first invalid field after explicit submission, retain valid fields. Server error reference is safe and copyable. J02/J06–J16.
- [ ] A09 Status: named loading/busy state, polite save/result announcement, assertive only for action-blocking failure. Success remains inline. Announcements do not reread a whole page or countdown each second. J04/J05/J09–J17.
- [ ] A10 Authentication: reading never requires sign-in; password/key flows support accessible authenticators; no memorization puzzle/CAPTCHA-only path. Identity unresolved/expired hides protected data. Recovery retains safe return destination and current-tab draft; account switch erases old private memory. J06–J08/J16.
- [ ] A11 Math: trusted production renderer emits MathML; each symbol and unit defined in surrounding prose; verbal worked reasoning available. Read “negative three times fifty” correctly; no mathematical expression only in a background image. Copy/render at 200% and with screen readers. J02/J12/J13.
- [ ] A12 Tables/charts: caption, headers/scope and units/signs; no fake layout table. Chart has title/summary, meaningful shape/labels and equivalent ordered data with same precision. Missing ≠ zero; mobile table substitutes for unreadable chart. Prerequisites have a nonvisual ordered list. J01/J02/J13/J17.
- [ ] A13 Resilience: 404, empty, loading, offline, 401, 403, 409, 412, 429, 503 and withdrawn states have distinct safe copy and actionable recovery. A failed save cannot display Saved. Loading never erases a draft. J01–J17.
- [ ] A14 Public/private: hidden quiz keys are absent from HTML/JSON/bundles before authorized release; protected preview no-store/noindex; every staff role checked with server policy, no role chosen in learner UI. J12/J14–J16.
- [ ] A15 Content truth: counts/estimates have basis; Planned scope has no complete/quiz action; self-completion is separate from gate and self-review; older evidence carries version and recheck state. Source access/review/date/unknown labels remain distinct. J01–J05/J09/J12/J13.

## P02 journey visual and full-process checklist

| Journey | Required review path / specimen | Visual and interaction acceptance | Product sign-off |
|---|---|---|---|
| J01 | Home → Learn → Curriculum → M01 → M01.01 | Clear beginner entry, phases in reading order, full long titles, required/recommended prerequisites, no wide-map dependency; released lesson within three activations | [ ] P10/P11/P18 |
| J02 | Lesson M01.01 → changed-number practice → reading → next | 66ch prose, readable MathML and ledger, signed units, error then feedback, source scope; no fake mastery | [ ] P11/P15/P18 |
| J03 | Paths → PATH-BEGINNER / Foundations | Audience/entry/effort/sequence, map-only path distinct from enrollable finite course; diagnostic/prerequisite recovery | [ ] P12/P14/P15/P18 |
| J04 | Resources → cost Free → R01 → report | Applied chips, scope/date/limitations, full filters and deterministic sort, source freshness, 20/50 pagination; no fabricated ratings | [ ] P12/P18 |
| J05 | Search M21.01 → Ready to learn | Exact identifier prominence, keyboard form/results, no keys/drafts, honest zero lessons; Back/filter/version reset | [ ] P10/P12/P18 |
| J06 | Register → generic confirmation → verification | Eligibility/password labels, field errors, resend and latest-link state; no account enumeration | [ ] P13/P18 |
| J07 | Sign-in → key → dashboard → logout | Accessible factor/cancel/retry, safe return, expired session recovery, logout/all-session effect | [ ] P13/P18 |
| J08 | Forgot → reset; account pending email/cancel | Generic replies, invalid/latest/consumed link, explicit confirmation, no premature identity change | [ ] P13/P18 |
| J09 | Dashboard → resume → self-complete → version migration | Three separate measures, frozen denominator, safe next step, conflict/correction review; cross-device server truth | [ ] P14/P18 |
| J10 | Lesson bookmark → saved list → remove | Toggle name/state and status, stable tombstone, retry failure; no inaccessible whole-row link nesting | [ ] P14/P18 |
| J11 | Notes → save → conflict → delete | Plain text, counter, unsaved/saved state, current/mine comparison, keyboard focus restoration and loss warning | [ ] P14/P18 |
| J12 | Quiz → review/skip → immutable feedback → remediation/exhausted | Untimed ten-item product form, group labels/numeric units, no pre-submit clues; score/critical failure/freshness distinct | [ ] P15/P18 |
| J13 | PR01/C01 → R1 dossier → self-review | Broad project brief separate from limited manual workspace; ledger/chart/table, numeric/text/rubric checks, reference released only after own success | [ ] P12/P15/P18 |
| J14 | Editorial → draft → preview → reviews → publish | Separate shell, exact revision, source-before-preview mobile, honest attribution; missing review/rights/stale candidate blocks activation | [ ] P16/P18 |
| J15 | Maintenance → import/conflict/freshness/withdraw/rollback | Staged report/diff/no auto-publish; corrections preserve learner history; no restoration of safety exclusions | [ ] P09/P16/P18 |
| J16 | Account → security/export/delete; admin access | Current/recent identity, progress/expiry/download, precise deletion consequence/confirmation; roles do not expose learner writing | [ ] P13/P16/P19 |
| J17 | All above by keyboard, AT, zoom, both themes | A01–A15 across complete flows and interruptions; current/previous major browsers per P02; no automated-only sign-off | [ ] P18/P19/P20 |

## Review protocol and evidence boundaries

P06: inspect home desktop, lesson mobile/dark, library mobile, canonical long titles, editorial publication and dossier graph/table. Run 35 routes × five widths × two themes, selected axe rules, representative interrupted states, keyboard/dialog/form/filter interactions and text resizing. Save screenshots and failures honestly. Confirm exact safe canonical fields against the manifest; synthetic figures/learner states must be visibly labeled. Do not treat a sample quiz result as scoring proof.

Implementation: repeat all checks using real server data/auth and both fresh/returning sessions. Test native keyboard Tab/Shift+Tab/Enter/Space/Escape through all journeys, VoiceOver/Safari and NVDA/Firefox or Chrome, mobile VoiceOver/TalkBack, zoom/forced-colors and reduced motion. Verify nonvisual reading order, math speech, table navigation, live announcements and error recovery by listening, not only inspecting ARIA. Real browser/device/assistive-technology runs remain pending; record versions and observed failures in P18 evidence. Fix failures before release, rerun affected paths and retain original findings.

Visual acceptance: spacing scale consistent, body never compressed to fit, 66ch reading target, line lengths and serif numerals legible, neutral surfaces coherent in both themes, no absent-state CTA, no content hidden under overlays, no unexplained empty navigation or decorative finance chart. Screenshot baseline changes require explicit review against this contract and actual content. New product scope requires its own design review rather than silently repurposing a generic admin component.
