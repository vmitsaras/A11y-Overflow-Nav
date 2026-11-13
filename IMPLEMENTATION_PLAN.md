# Implementation plan

Status updated on **2026-11-13**. Stable **1.0.0** is applied and its notes are in [CHANGELOG.md](CHANGELOG.md). The owner reports AT and native browser zoom/text checks as passed; Windows contrast-theme testing is retired as a package gate and belongs to consumer CSS integration. Remaining work is Git delivery, current-tree CI, and deployment/publication verification. See [current verification](#current-verification) and the [roadmap](ROADMAP.md#current-status--2026-11-13).

## Slice 1 — Foundation and semantic contract

Status: implemented and package-gate verified.

Deliverables:

- TypeScript / ESM package
- strict semantic markup validation
- source-order capture
- duplicate initialization protection
- A11y Menu Button core composition
- lifecycle events
- clean destruction

## Slice 2 — Responsive distribution

Status: implemented and manually verified in a real browser.

Deliverables:

- geometry-based fit probe
- ordered suffix migration
- ordered restoration
- disappearing-More final-item test
- ResizeObserver invalidation
- requestAnimationFrame batching
- root state / count synchronization

## Slice 3 — Focus continuity

Status: implemented and included in the historical 2026-09-22 VoiceOver pass; current-tree AT qualification remains open.

Deliverables:

- focused primary item moving into hidden overflow
- focused overflow item returning to primary
- More trigger disappearing
- menu refresh after redistribution

## Slice 4 — Dynamic content boundary

Status: implemented and unit-tested.

Deliverables:

- explicit `refresh()`
- canonical item reconciliation
- observer target refresh
- structural replacement rejection
- regression fix preserving application-added primary item order

## Slice 5 — Demo and unit coverage

Status: implemented and package-gate verified.

Deliverables:

- minimal example
- interactive scenario lab
- lifecycle/state inspector
- Flex nowrap / Flex wrap / Grid controls
- LTR / RTL
- label expansion
- text scaling
- destroy / reinitialize
- happy-dom lifecycle tests

## Slice 6 — Manual real-browser verification

Status: historically verified for the 2026-09-22 target.

Evidence recorded on 2026-09-22:

- project owner tested the then-current implementation in a real browser;
- VoiceOver was included;
- the verification passed;
- no blocking regression was reported.

This is manual acceptance evidence. It does not claim that the optional Playwright cross-browser matrix has been implemented.

## Slice 7 — Release hardening

Status: in progress; the original performance-hardening lineage has historical CI evidence and stress-fixture measurements. Current-tree CI and release qualification remain open.

The following October timeline preserves earlier findings and their subsequent fixes; its interim open-defect statements are not the current status summary.

2026-10-27 follow-up: the initial native zoom inspection found RH-01/RH-02, then a bounded demo CSS remediation fixed the lab grid/inline bounds and disclosure scrolling/placement. Pages was regenerated. Final verification passed 48 Chrome 156 headless layout/localization cases, 9 isolated Chrome for Testing 153 native zoom/locale cases, the original short-viewport keyboard reproduction, 17 supplemental assertions, and local package gates. Runtime/API/dependencies are unchanged. Native text-only resize, Windows contrast themes, current AT, supported-browser/native-zoom qualification, and final release audit remain open; see `VERIFICATION.md`.

Subsequent 2026-10-27 inspection exercised native Firefox text-only resizing at 100/150/200%, with independent calibration. Basic and sampled English/Greek lab paths passed, but RH-03 (stress End closes the panel and loses focus at 200%) and RH-04 (German lab panel horizontal scrolling at 200%) remain open for remediation and retest. Fresh package gates passed; no product files changed. Windows contrast themes and current AT checks remain open. See the latest `VERIFICATION.md` section for exact browser versions, evidence, and matrix limits.

Historical scope/classification update, 2026-10-27: RH-03 is caused by stress-demo CSS ignoring Menu Button's available-height value. A native Firefox 159 event trace captures `visibility-change` closure after document scrolling; a temporary CSS-only bound prevents it with identical JavaScript. RH-03 and lab-only RH-04 are excluded from runtime blockers per user direction, superseding the remediation requirement above. No product fix was applied. Bounded native text-size inspection is complete; wider chosen native qualification, Windows contrast themes, current AT, and final audit remain open.

Subsequent requested quick fixes, 2026-10-27: stress CSS now honors available panel height/top placement (RH-03), and lab overflow links wrap long words (RH-04). Pages was regenerated. Four focused native Firefox 159 cases at 200% text-only size pass for source/generated demos, final-link focus, German wrapping, and generated top placement. Runtime code is unchanged; local package gates pass. No manual screen-reader tests were run, per user instruction. Wider native qualification, Windows contrast themes, current AT, and final audit remain open.

Implemented in the current slice:

1. a developer-only 24-item performance stress fixture in `examples/stress/`;
2. browser-side measurement of elapsed sweep time, distribution-change events, mirrored ResizeObserver callbacks/entries, estimated item moves, and maximum overflow;
3. unit regression coverage proving repeated ResizeObserver signals coalesce into one pending animation frame;
4. unit regression coverage proving pending resize work is cancelled during `destroy()`;
5. a source-level performance review documenting the current cost model and the threshold for future optimization;
6. an in-progress release audit with explicit evidence boundaries.

No runtime diagnostics or new runtime dependencies were added.

Historical stress-fixture measurement recorded on 2026-09-22 (not a baseline for the revised fixture):

- environment: `examples/stress/index.html` served locally in HeadlessChrome 153.0.0.0 on macOS (`MacIntel`);
- viewport: 756 x 469, device pixel ratio 1;
- elapsed: 674.2 ms across 21 width steps;
- change events: 8;
- observer callbacks / entries: 16 / 20;
- estimated item moves: 8;
- maximum overflow: 22;
- final overflow: 18.

Still required for release delivery:

1. deliberately include the intended source, generator, generated Pages, version/changelog, and selected evidence in the release commit;
2. obtain passing CI for that commit;
3. verify the Pages deployment and npm publication when those actions are authorized.

The owner accepted AT and native browser zoom/text checks on 2026-11-13. Specific combinations/versions were not supplied, so this is not a full browser/AT matrix claim. Windows contrast-theme checks are integration work, not a package release blocker. Further integration matrices and performance optimization require their own scope/evidence.

### Optional regression automation

A Playwright geometry suite remains valuable for repeatable Chromium/Firefox/WebKit regression coverage, but it is tracked as automation hardening rather than a blocker for the already-completed manual verification.

## Current verification

The latest recorded local implementation/docs checks are the [November verification entries](VERIFICATION.md#recorded-november-verification): demo controls and measurement changes on 2026-11-03; reserve content, disclosure/focus fixes, and example navigation on 2026-11-12. These entries record 48 tests, typecheck, build/Pages, package dry-run, parity, and bounded Chrome checks for their targets. Docs-plan Tasks 1–3 reconcile lifecycle usage, example discovery, and status/evidence summaries. [Performance measurements](PERFORMANCE_REVIEW.md) from the older fixture are not directly comparable to the revised sampling and labels.

The **2026-10-27 final local release audit** and **RA-01 resolution** remain historical. Their tarball sizes, offline-consumer checks, and native/browser results apply to those recorded targets. The earlier 0.1.1 patch plan was superseded by the owner-requested stable 1.0.0 version on 2026-11-13. See the [owner acceptance/version record](VERIFICATION.md#v1-owner-acceptance-and-version-preparation--2026-11-13) and [current release status](RELEASE_AUDIT.md#current-status). Git/CI/deployment delivery remains open; evidence links retain their [local-only scope](VERIFICATION.md#evidence-delivery).

The earlier **2026-10-26 focused improvement pass** verified refresh focus, detached ownership/restoration, synchronous destruction guards, complete numeric parsing, demo language/fallback behavior, and stress-fixture recovery against the working tree based on `6895d10`. Its independent review and bounded Chromium evidence remain historical; they do not replace current-tree CI or manual qualification.

Historical repository implementation inspected for the September record:

- head: `62fdf29f0b86d02dd86a0afa4c650bd19fa22376`
- GitHub Actions run: `35749073102`
- install: pass
- tests: pass
- typecheck: pass
- build: pass
- pack check: pass
- manual real-browser test: pass
- VoiceOver test: pass

Historical v0.3 hardening CI (not current-tree CI):

- implementation head: `c471e26ad96f75fc62940547ae32da8ee4bbf0e0`
- GitHub Actions run: `35751176276`
- install: pass
- tests: pass
- typecheck: pass
- build: pass
- pack check: pass

See `VERIFICATION.md` for evidence boundaries and remaining release-hardening work.
