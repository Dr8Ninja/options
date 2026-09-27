# Component and visual specification

Design version 1.0.0. [Tokens](../tokens.json) are the source of numeric/color values; [prototype styles](../prototype/styles.css) show composition. Prefix production CSS variables with the product namespace during P07 integration; avoid separate ad hoc light/dark values in individual components.

## Typography, grid and surfaces

| Element | Size / line height / weight | Constraints |
|---|---|---|
| Interface body | 16px / 1.55 / 400 | System UI stack; browser default rem scaling |
| Reading prose | 19px desktop, 18px narrow / 1.75 / 400 | Georgia serif; ≤66ch; no fully justified text |
| Secondary/help | 14px / 1.55 / 400 | Never use low-opacity body text; measured muted pair |
| Caption/eyebrow | 13px minimum substantive caption; 12px short overline / 1.4 | Overline uppercase only for short nonessential navigation labels |
| H1 | 36–56px / 1.12 / 400 | Georgia; negative tracking −.035em; actual long title wraps |
| Home display | 44–76px / 1.12 / 400 | Reserved for home; 48px at narrow default size |
| H2 | 32px desktop / 28px narrow / 1.12 | Serif section title; 400 weight |
| H3 / component title | 20px / 1.35 / 600 | Sans-serif, no fake all-caps hierarchy |
| Numerals | Tabular figures for ledgers/results, ordinary figures elsewhere | Signs/units align; do not use decorative tabular lining on prose |
| Code/source | Native monospace 14px / 1.6 | Inert, wrap or own labeled scroll region |

Scale spacing uses 4/8/12/16/24/32/48/64/96px. Use 4–8 within labels, 12–16 within a control group, 24 between related sections, 40–64 between editorial sections. Max content width 1,248px; article 66ch; gutter 20/24/40px. Cards use 24px padding (20px narrow), 1px decorative line, 10px radius; controls 6px; no pervasive shadow. Only modal surfaces use shadow, with a dim inert background. Dividers may be subtle; essential input boundaries use the higher-contrast control token. Layout must reflow under larger base text, not fixed pixel heights.

## Colors and contrast

Light: warm background #f7f6f0, paper surface #fffef9, ink #202d2b, muted #52615d, teal action #146458. Dark: #141d1c background, #1c2826 surface, #eef3ec ink, #a6b6ad muted, #a4d2bd action with dark text. Green is not a synonym for correctness: result copy supplies the meaning. Warning/danger have distinct text and a safe-pair surface. Status badges always carry words.

The offline check measures ink/muted/accent on both relevant surfaces, action text on action fill, warning/danger pairs and focus/control edges. Minimum 4.5:1 for normal text; 3:1 for essential control boundaries/focus against adjacent surfaces. Decorative rules may be lower. Do not use transparency to disable readability; disabled actions show an explicit reason and still meet text legibility where practical. Hover adds fill/underline, never color alone. Links in prose are underlined. Light/dark/System selector uses the system preference by default in production; the prototype starts Light to make its visual review reproducible. Theme persistence alone is allowed; private writing never shares that storage.

## Component inventory

| ID / component | Anatomy, semantics and variants | Keyboard / small-screen contract |
|---|---|---|
| C01 Shell | Skip link; header wordmark; primary nav; search/auth utility; main; footer; editorial shell separate | Skip is first focusable item; landmark names unique; Menu disclosure below 960px, Escape closes if open; no mobile focus trap |
| C02 Breadcrumb | Ordered linked parents, current text, decorative separators | Wrap full labels; no hover-only expanded title |
| C03 Page heading | Stable ID/context, H1, purpose/summary, readiness and effort basis | Exactly one H1; focus it on client route change, suppress its outline only for programmatic title focus |
| C04 Action | Primary filled, secondary outlined, textual, destructive; 44px target minimum | Button mutates; link navigates. Visible name starts accessible name. One primary action; no icon-only destructive controls |
| C05 Icon | Small stroke icon, 20px box/1.5px stroke, currentColor; search/menu/external/bookmark/check/info/warning only | Native text labels accompany icons. Decorative aria-hidden; icon-only utility needs accessible name and 44px target; no emoji as sole status |
| C06 Status badge | Published/Planned, Self-completed/Gate passed/Self-reviewed/Needs recheck; readonly | Word, shape/fill and context, never color-only; not a toggle or button |
| C07 Phase disclosure | Summary with phase name/count/readiness; ordered module list; native details/summary | Enter/Space toggles, all child links ordinary tab order. Same list at every width; not a tree widget requiring custom arrows |
| C08 Curriculum row | Ordinal + stable ID, title, scope/estimate, readiness | Title wraps; metadata can move below; never whole row plus nested conflicting click actions |
| C09 Preparation list | Required for assessment, Recommended, Optional; edge rationale and target readiness | Reading never locked. Explanations inline; no tooltip-only prerequisite reason |
| C10 Resource row | Title/source/type, rationale, access/difficulty/priority, effort/basis, review date/scope, inspect | One reading order on mobile; canonical range label not shortened; record-level actions at end |
| C11 Filter group | Search input, expandable labeled facets, applied chips/clear, result count, sort, page size | Production multivalue facets use native checkboxes in labeled groups; OR within/AND across. Searchable long facet list filters options locally; no network on every keystroke. Explicit Apply; Enter submits search; focus summary of results after Apply |
| C12 Pagination | Previous, page/result range, next; 20/50 per page | Keep URL state; change filter/size resets page. Announce new count; focus result heading, not unrelated top-of-page. Cursor history exists in memory; no fabricated total for cursor API |
| C13 Reading body | H2/H3, prose, lists, blockquote, code, equation, worked case, source notes | Never render raw HTML/MDX. No heading-level jumps. In-page links use stable section IDs, update focus to heading and scroll without animation under reduced motion |
| C14 Formula | KaTeX HTML+MathML in production; named symbols/units, prose explanation | Sample native MathML only. No screenshot of math; scroll only equation region when truly necessary. Provide verbal equation, avoid duplicate math reading |
| C15 Data table | Caption, th scope, signed numeric alignment, unit-bearing headers, total definition | Labeled region focusable only if overflow; table remains semantic. Never convert essential ledger into unlabeled cards; offer equivalent summary where useful |
| C16 Chart | Accessible title/description, quantitative axes/units, direct labels, non-color distinction, data table | Below 640px prefer open data table rather than tiny axes. No hover required; no market-like animation or live-feed implication |
| C17 Source card | Exact title/edition when known, review scope/date, rights/access, link status vs substantive status | Unknown date has words, not “0 days ago”; external-new-tab cue in accessible label. Current-rule eligibility cannot be inferred from URL reachability |
| C18 Form field | Persistent label, optional/required text, help, error; autocomplete/inputmode | Associate helper/error IDs; error summary links/focus first invalid. Keep value on recoverable error; allow paste/password managers. Numeric amounts use text input, decimal parsing, explicit units |
| C19 Private note | Plain-text textarea; 10k code-point count; unsaved/saving/saved/failed; save/delete | No silent autosave guarantee. Preserve in-tab on offline/conflict; do not cache privately across account switch; explicit delete confirmation |
| C20 Progress | Separate lesson count, gate outcomes, project label; reasoned next action | Native/ARIA progress value/name for lesson fraction only; no aggregate mastery percentage; 18/36 stays fixed on publication |
| C21 Assessment item | Fieldset/legend, ordinal, critical marker, radios/checkboxes/decimal; visible units | Arrow keys within radios, Space on checkbox, no auto-advance. Review unanswered before final submission. No correct/incorrect class before server result |
| C22 Feedback | Score/version/critical override, original own answer, released reference/explanation, exact next step | Announce submit result once; focus result heading. Feedback only assigned submitted form; unsafe withdrawn material removed. Warning is not blame |
| C23 Dialog | Title, meaning/consequence, fields if needed, explicit confirm/cancel, native modal | Focus heading for long content; Tab contained, background inert, Escape cancel, trigger focus restored. ≤viewport with internal scroll; no nested modal |
| C24 Conflict comparison | Latest/current and unsaved; editorial adds base/proposed; clear resolution action | Side-by-side ≥640, vertically labeled below; words/addition markers rather than red/green alone; never replace unsaved text on Refresh |
| C25 Editorial review | Exact identity/revision/hash, named review dimension, findings, decision, actor/same-author | No implied independent review; keyboard order source→preview→review; readonly preview not public URL |
| C26 Publish confirmation | Complete manifest, readiness/review failures linked to IDs, affected routes, active-version expectation | Recent-auth interrupt preserves candidate. Confirm only if server preflight succeeds; no Force publish for stale version |
| C27 Notice/status | Info, pending, success, warning, error; concise action and correlation when applicable | role=status for async progress/results, role=alert for immediate blocking failure; no repeated announcement on every render or countdown second |
| C28 Reorder | Ordered membership and Move up/Move down controls, optional drag | Accessible item-position announcement, focus remains on moved item control; first/last disabled with reason; full new order sent with version check |
| C29 Access management | Public account UUID, status, role set, pending-factor setup, action reason | ADMIN_RECENT only; no learner content drilldown. Suspension and last-admin/recovery constraints explained before confirmation |

## Visual acceptance particulars

No essential clipping at 320px, 200% text or equivalent 400% desktop zoom; tables/code/formulas may have their own clearly labeled two-dimensional region. Button groups stack/wrap, not shrink type. Do not use line-clamp on learning objectives, source verification, errors or prerequisite explanations. Resource list may shorten a nonessential summary with an explicit detail link, never hide access cost. Page loading reserves stable text-space without a continuously moving shimmer. Respect reduced motion for all hover, disclosure and scroll enhancements; no animation conveys state exclusively.

Use the actual longest canonical topic/resource/module titles in browser fixtures. Distinguish the prototype review toolbar from product chrome; it is removed from every production build. No prototype schema, answer, fake session or synthetic publication is bundled into the production public app.
