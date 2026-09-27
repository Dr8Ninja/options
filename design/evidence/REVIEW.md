# P06 design review record

23 September 2026. Scope: design contract, standalone responsive prototype, source fidelity and offline API compatibility. No implemented application, public lesson, production identity, scoring, publishing or deployment is claimed. No user approval/brand approval is presumed.

## Inputs and findings

Read shared instructions and P02 J01–J17/REQ-04–15/content release, P03 rendering/security/editorial decisions, P04/P05 semantics and canonical curriculum samples. P05 entry validation passed; [entry record](p06-entry.json) preserves the earlier contract hash. Manual comparison found gaps against unchanged P02 REQ-09–11: capstone browse/detail, geography/review facets, module/readiness/Ready to learn and priority/review sorting, and 50-item ceiling. These were corrected in prerelease OpenAPI 1.0.1 and its API/matrix/test-plan documents before UI implementation. No canonical source data changed. The validate_frontend_design audit verifies preserved source hashes and reruns P05/P04/P03/P02 gates.

Design direction: original restrained field-guide composition, serif reading, system UI controls, warm paper/teal light theme and corresponding dark theme required by P02. Both provide meaningful states, strong focus and accessible tables/math. The provisional wordmark remains U06. Canonical map counts and zero reviewed lessons are explicit; lesson/learner/admin specimens are labeled synthetic. The visualize skill was inspected; this task's standalone project artifacts do not use its inline-visualization workflow.

## Review passes and corrections

Initial construction caught two JavaScript issues before screenshot review: missing expression closure and a path function shorthand. Corrected and syntax-checked. Early empty screenshots were replaced with actual rendered pages, not accepted as evidence.

The first complete browser run checked 350 route/width/theme combinations, 36 axe samples, 32 interrupted states and 20 interactions. No default-layout overflow or axe violations occurred, but five interaction assertions failed. Its [original report](browser-validation-initial.json) is retained. Navigation/filter checks sampled before asynchronous hash rendering settled; the harness now waits for the specified resulting state rather than accepting stale content. The accumulated scenario/style state also required explicit reset between review cases. A genuine 200% text overflow in the desktop header was fixed by allowing flex wrapping independently of media breakpoints. Heading/button overflow wrapping also protects long labels. Generic action buttons now explicitly use type=button to prevent accidental form submission, and mobile-menu Escape and in-page heading focus are explicit.

Final browser coverage adds the actual longest canonical module title (M39), topic title (M17.19) and resource title (R22): 38 route variants × five widths × two themes = 380 layout checks. The 35 base route families map all 17 journeys. The machine report records exact final results, utility/browser versions, screenshots and hashes of tested source files; the offline validator rejects stale browser evidence. Packages live outside the application tree under /tmp/p06-design-tools.

## Visual inspection

Inspected rendered Home desktop, lesson at 390px/light and 1440px/dark, publication desktop and dossier desktop. Home hierarchy, honest counts, long reading flow, unit-bearing equation/table, distinct source scope, mobile stacked actions, dark contrast, editorial review blocking and dossier table/chart were legible. Dense tables retain labels; mobile charts switch to an open equivalent table. Subsequent automated runs check long-title variants and all viewports; they do not replace human/AT review of a production process.

Primary screenshots: [home](home-1440-light.png), [mobile lesson](lesson-M01.01-390-light.png), [dark lesson](lesson-M01.01-1440-dark.png), [publication](publish-1440-light.png), [dossier](dossier-1440-light.png), [mobile resources](resources-390-light.png), [mobile registration](auth-register-390-light.png). The [browser report](browser-validation.json) lists every retained final capture.

## Exit evidence and limitations

The authoritative results are [browser validation](browser-validation.json) and [offline design validation](design-validation.json); the latter must report PASS before P06 is complete. It checks contrast pair calculations, 35 route families/17 journeys against real operation IDs, exact safe canonical fields, original-file hashes, synthetic ledger arithmetic, local links and deliberate low-contrast/unknown-operation/missing-journey rejection. It does not validate a deployed service or mark the product checklist complete.

P07–P16 can implement the documented layouts, tokens, components, behavior and contracts. Full filter combinations/cursors, real WebAuthn/mail, 10-item scored forms, all editor/import states, sanitizer/KaTeX, SSR/no-JS, owner persistence, export/deletion and publication must be implemented and tested at their assigned gates. Real screen-reader, device/current-previous-browser, performance and security checks remain P18–P21. U01–U06 and all content/publication exclusions remain. A complete R1 course still requires P17 authoring and review; there is no dead Tools/ratings/navigation feature.
