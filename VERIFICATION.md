# Verification — A11y Overflow Nav

Updated on **2026-11-13**. Stable **1.0.0** is applied through Changesets, superseding the pending 0.1.1 patch plan. The owner reports AT and native browser zoom/text checks as passed; combinations/versions were not supplied, and the agent did not perform those manual checks. Native Windows contrast-theme testing is retired as a package release gate because styling is consumer-owned. See the [owner acceptance and version record](#v1-owner-acceptance-and-version-preparation--2026-11-13). Git delivery, current-tree CI, and deployment/publication verification remain open. Earlier audit/browser results retain their dated targets and limits.

## Recorded November verification

| Record | Recorded scope | Boundary |
| --- | --- | --- |
| [Scenario lab](#scenario-lab-product-polish--2026-11-03), [basic demo](#basic-demo-product-polish--2026-11-03), [stress fixture](#stress-fixture-product-polish--2026-11-03) — 2026-11-03 | Local package gates, generated parity, bounded Chrome interaction/responsive checks; revised stress sampling | Screenshots illustrate the results; interaction outcomes are recorded in the dated prose. These are not current AT/native-zoom results |
| [Reserve navigation content](#original-example-navigation-content--2026-11-12) — 2026-11-12 | Local gates, localization/destination checks, bounded browser cases with structured observations | New labels invalidate comparison with older overflow-count baselines; lab/basic message-channel errors were recorded |
| [Final example polish](#final-example-polish-pass--2026-11-12) — 2026-11-12 | Local gates, bounded disclosure bounds, keyboard/focus and inspector checks | Demo text scaling is not native browser zoom; these sampled checks do not renew the wider release matrix |
| [Example navigation/docs](#example-navigation-and-integration-docs--2026-11-12) — 2026-11-12 | Local gates, relative links/parity, project-subpath keyboard navigation and 320px checks | Standalone CSS viewing was client-blocked; HTTP delivery and in-page stylesheet loading were checked separately |

These are prior-run results with the targets and limitations recorded in each entry. New documentation reconciliation does not extend their coverage or establish live npm/Pages availability.

## Evidence delivery

As inspected on **2026-11-13**, `output/` and `docs/` contain no Git-tracked files; the prepared Pages generator is also untracked. The earlier pending Changeset was consumed when applying 1.0.0; its notes are retained in the changelog. Links to `output/` artifacts in this record and the release audit are **local-only evidence references**. Their existence does not establish that they are available from GitHub, npm, or the deployed Pages site.

For a release handoff, deliberately select any evidence to retain with the documentation and recheck its links/tracking; otherwise keep it labelled local-only. Do not bulk-add the evidence directory merely to satisfy link checks. The npm allowlist and Pages generator do not include `output/`; builds do not publish evidence or configure GitHub Pages. The intended Pages source remains **main → /docs**, pending repository delivery/settings verification.

## Historical September baseline

The following September summary and boundary describe the targets below. Later dated records supersede its then-open items only within their stated scope.

Date: 2026-09-22  
Manual verification target: `62fdf29f0b86d02dd86a0afa4c650bd19fa22376`  
Historical v0.3 implementation head: `c471e26ad96f75fc62940547ae32da8ee4bbf0e0`

Historical automated run: `35751176276`

## Summary

The September implementation had both package-level automated evidence and project-owner manual real-browser accessibility evidence.

The project owner reported testing the then-current implementation in a real browser with VoiceOver and reported the result as **verified / passed**.

This record intentionally distinguishes that manual evidence from checks that were not explicitly reported, such as a full Chromium/Firefox/WebKit automation matrix, forced-colors testing, or NVDA coverage.

## Automated package gates

For v0.3 implementation head `c471e26ad96f75fc62940547ae32da8ee4bbf0e0`, GitHub Actions run `35751176276` completed successfully.

| Check | Status | Evidence |
| --- | --- | --- |
| Dependency installation | Pass | GitHub Actions run 35751176276 |
| Unit/lifecycle tests | Pass | CI |
| TypeScript integrity | Pass | CI |
| Package build | Pass | CI |
| Package contents | Pass | CI |

## v0.3 performance-hardening evidence

The September hardening slice added:

- a developer-only 24-item real-browser stress fixture;
- ResizeObserver/requestAnimationFrame coalescing regression coverage;
- pending-frame cancellation coverage for `destroy()`;
- a source-level performance review;
- an in-progress release-audit checklist.

The new automated tests passed in GitHub Actions run `35751176276`. No runtime diagnostics, polling, persistence, or new runtime dependency were added.

Manual stress-fixture measurements were recorded from the developer fixture in a real browser on 2026-09-22. These values are environment-specific and are useful for before/after comparison on the same browser/device; they are not a universal performance threshold.

| Check | Status | Evidence |
| --- | --- | --- |
| Stress fixture real-browser measurement | Pass / Recorded | `examples/stress/index.html` served locally and run in HeadlessChrome 153.0.0.0 on macOS (`MacIntel`) |

Recorded fixture values:

- viewport: 756 x 469, device pixel ratio 1;
- elapsed: 674.2 ms;
- steps: 21;
- change events: 8;
- observer callbacks: 16;
- observer entries: 20;
- estimated item moves: 8;
- maximum overflow: 22;
- final overflow: 18.

## Manual real-browser evidence

Reported by the project owner on 2026-09-22:

| Check | Status | Evidence |
| --- | --- | --- |
| Real-browser functional verification | Pass | Manual project-owner test |
| VoiceOver verification | Pass | Manual project-owner test |
| Blocking regression found | No | Manual project-owner report |

The exact browser/version and operating-system version were not recorded in the report, so this verification note does not infer them.

## Previously resolved implementation regression

### V-01 — Refresh order reconciliation

**Observed:** An earlier CI run found that a newly inserted primary item could be reordered behind the previous canonical items during `refresh()`.

**Resolution:** `refresh()` now captures current direct primary-item DOM order before rebuilding the canonical sequence and restoring/reflowing.

**Result:** Subsequent automated package gates passed.

## Verification boundary

Verified for the September targets:

- package install/test/typecheck/build/pack checks;
- the then-current implementation in a real browser;
- VoiceOver manual interaction pass;
- stress-fixture measurements in a real browser;
- no reported blocking regression in that manual pass.

Not yet claimed as verified:

- automated Chromium/Firefox/WebKit geometry matrix;
- fractional-width threshold automation;
- repeated threshold-cycle automation;
- 200–400% zoom;
- browser text-only resize;
- forced-colors behavior;
- NVDA/browser combinations;

## Next verification slice

v0.3 release hardening:

1. zoom/text-size checks;
2. forced-colors checks;
3. NVDA/browser coverage if in the supported release matrix;
4. package release audit;
5. final documentation synchronization.

## Final status

**Core implementation verified through automated package gates plus manual real-browser and VoiceOver testing. Release-hardening checks remain open.**

## Focused improvement pass — 2026-10-26

Target: the local working tree based on `6895d10`, including pre-existing runtime/documentation-site work. No commit, publication, deployment, or new CI result is claimed.

Implemented fixes:

- refresh focus resolves against the final distribution, including a closed overflow panel and disappearing More;
- detached refresh/destruction restores owned nodes without reclaiming application-removed or externally reparented items;
- synchronous destruction stops initialization, refresh, and redistribution before further owned work or completion events;
- numeric tolerance parsing accepts complete finite nonnegative values and rejects partial strings;
- demos preserve localized language metadata, wrap before enhancement/after destruction, and expose the stress disclosure without ancestor clipping;
- stress sweep/reset operations lock competing controls, invalidate failed results, and restore controls after errors;
- Pages output was regenerated from the current source and package build.

| Check | Status | Evidence |
| --- | --- | --- |
| Unit/lifecycle tests | Pass | `npm run test`: 48 tests, including 32 new regression cases |
| Typecheck | Pass | `npm run typecheck` |
| Full package + Pages build | Pass | `npm run build` |
| Package dry-run | Pass | `npm --cache /private/tmp/a11y-overflow-nav-npm-cache run pack:check`: 12 files; default npm cache was unwritable |
| Diff whitespace | Pass | `git diff --check` |
| Independent source review | Pass | Read-only review of runtime, tests, demo language/fallback behavior, and stress-operation recovery; no blocking findings |
| Lint | Not applicable | No lint script is configured |

### Browser evidence

Local preview served at `http://127.0.0.1:8876/`. Playwright CLI drove HeadlessChrome **156.0.0.0** on macOS; desktop viewports were 1440 × 1000 / 1440 × 1100, and the no-JavaScript fallback viewport was 360 × 900.

- **132 runtime assertions passed** using original five-item fixtures across Flex nowrap, wrapping Flex, and Grid in both LTR and RTL. Each combination checked focused open-overflow refresh → More, focused primary shrink → More, returning destination focus, disappearing More → restored destination, and preservation of external focus. ResizeObserver-driven width cycles at 600, 300, 400, 460, 490, 280, 600, and 300 px checked expected counts plus canonical order and node identity.
- **17 demo assertions passed** for German → Greek → English labels/mirrors, language-preserving event history, destroyed Grid wrapping, a complete 21-step sweep, competing-control locking, reset, injected sweep/reset failures with result invalidation/control recovery, a successful subsequent sweep, disclosure hit-test visibility, and all three pages' narrow no-JavaScript wrapping fallback.
- **8 integration assertions passed** for ArrowDown/End/Escape focus and visible disclosure destinations, detached refresh/destruction followed by reattachment/reinitialization, and successful initialization of all three generated Pages entrypoints with no page errors or failed local asset/module responses (favicon excluded).
- All eight `docs/dist/` files match root `dist/` byte-for-byte. Generated HTML/CSS follow the authored sources with the intended local import-map rewrite.

These were bounded, temporary browser probes, not a committed Playwright suite. Synthetic failure cases intentionally logged errors to the stress summary/console. They do not establish a performance improvement, a complete browser matrix, screen-reader behavior, or release readiness. Existing zoom/text-size, forced-colors, current assistive-technology, final CI/release-audit, and optional browser-automation work remain open.

## Release-hardening inspection — 2026-10-27

### Scope and evidence

Target: the same local working tree based on `6895d10`, including the 2026-10-26 fixes. This slice inspected the scenario lab, basic example, and stress fixture without changing product source, CSS, dependencies, or public APIs. WCAG 2.2 A/AA provides the finding-mapping baseline; this is a sampled technical inspection, not a whole-product conformance assessment.

Environment: macOS **27.0.1**, native Google Chrome **156.0.8078.48**. Native Chrome's zoom popup verified 200%, 300%, and 400%; device pixel ratio changed from 2 at 100% to 4, 6, and 8. The physical browser window was held constant. Its content viewport at 100% was 1624 × 915 CSS px. Chrome zoom was restored to 100% afterward.

Supplemental Playwright CLI checks used HeadlessChrome **156.0.0.0**, real layout and keyboard input, a 320 × 900 CSS-pixel reflow viewport, and a 1280 × 900 viewport for text/forced-colors probes. The text probe doubled each body element's computed font size (navigation links 16 → 32 px), leaving the root font at 16 px; it was **not native browser text-only zoom**. Forced colors used Chromium media emulation with both light and dark palettes, **not Windows contrast themes**.

Evidence files: [`browser-report.json`](output/playwright/release-hardening-2026-10-27/browser-report.json) records measurements, keyboard outcomes, temporary causal probes, and SHA-256 fingerprints of the inspected runtime/demo sources. Screenshots in the same folder illustrate captured states; interaction and viewport claims rely on the measurements and recorded steps, not screenshots alone.

### Results

| Native Chrome zoom | Resulting CSS viewport | Basic example | Scenario lab | Stress fixture |
| --- | --- | --- | --- | --- |
| 200% | 812 × 457; document client width 804 | Pass for sampled navigation; Narrow preview, ArrowDown → End reached About us with visible focus | Default page has no horizontal overflow; Many overflow → Careers reachable | Account reachable with visible focus; no page-wide horizontal overflow |
| 300% | 541 × 305; document client width 536 | Final overflow destination reachable with visible focus after zoom settled | **Fail RH-01:** document scroll width 709 px against 536 px client width | Account reachable with visible focus; no page-wide horizontal overflow |
| 400% | 406 × 228; document client width 402 | Final overflow destination reachable in the sampled Narrow preview state | **Fail RH-01:** document scroll width 709 px against 402 px client width. **Fail RH-02:** Many overflow can close while reaching Careers, losing focus | Account reachable with visible focus; scrollable disclosure stays open; no page-wide horizontal overflow |

| Supplemental check | Result | Boundary |
| --- | --- | --- |
| 320 CSS-pixel reflow | Basic/stress: pass sampled page-width and keyboard checks. Lab: **Fail RH-01**, 709 px scroll width against 320 px client width | Equivalent reflow threshold, not a claim of native 400% zoom from a 1280 px window |
| Doubled computed text at 1280 × 900 | Pass sampled checks on all three pages: 32 px navigation text, no page-wide horizontal overflow, final overflow link reachable/visible, Escape returns focus to More | CSS font-size override only; native browser text-only resizing remains unqualified |
| Forced colors, light and dark palettes | Pass sampled emulation on all three pages: media query active, panel text/background/borders resolve to system colors, 3 px focus outline visible, ArrowDown/End/Escape work | Six page/palette cases; no native Windows theme or exhaustive contrast/current-state audit |
| Package gates | Pass: 48 tests, typecheck, full build, package dry-run (12 files, temporary npm cache), and diff check | Local evidence, not new CI or release approval |

Native Firefox text-only resize was not qualified: the available UI tooling did not reliably expose the mode's checked state or provide a Firefox screenshot. A temporary mode toggle was reversed and the audit tab closed; no native Firefox text-resize pass is inferred.

### RH-01 — Scenario lab expands beyond the reflow viewport

- **Target:** scenario lab `/` and its generated Pages copy; default Flex nowrap, 300–400% native Chrome zoom and 320 px reflow viewport.
- **Inspection status / severity / confidence:** confirmed, medium, high; resolved by the remediation and retest below. Before the fix, controls and navigation required horizontal as well as vertical movement; the basic/stress examples did not reproduce this page-level failure.
- **Evidence:** native and headless measurements above. At 320 px, `.lab` children extend to approximately x=709; the navigation incorrectly has enough expanded grid space to keep all destinations in the primary list. [`lab-reflow-320.png`](output/playwright/release-hardening-2026-10-27/lab-reflow-320.png) shows off-screen controls.
- **Cause / ownership:** consumer demo grid intrinsic sizing (`demo.css`, `.lab` and `.lab__frame`), not a new runtime layout rule. A temporary `.lab { grid-template-columns: minmax(0, 1fr); }` override reduced document scroll width from 709 to 320 px and allowed redistribution (six overflow items). This diagnostic override was not saved to product CSS.
- **Mapping:** WCAG 2.2 **1.4.10 Reflow (AA)**: ordinary navigation and controls require page-wide two-dimensional scrolling at 320 CSS px; they do not receive the code-example scrolling exception.
- **Recommendation / retest:** constrain the lab grid track and its children to available inline space, preserving consumer-owned Flex/Grid styling. Retest the default layout, all layout modes, locales, presets, and keyboard access at 320 px and native 200–400% zoom. Close only when ordinary page content stays within the viewport and the original destinations redistribute correctly.

### RH-02 — Tall lab disclosure closes when the final destination receives focus

- **Target:** scenario lab's More disclosure in a short zoomed viewport; observed with native 400% zoom at 406 × 228 CSS px.
- **Inspection status / severity / confidence:** confirmed, high, high; resolved by the remediation and retest below. Before the fix, keyboard users could lose the selected destination and focus instead of completing navigation. Occurrence depended on panel height and scroll position.
- **Reproduce:** use Many overflow (or set container width to 260 px), open More with ArrowDown, allow opening/layout to settle, then press End from the first overflow link. The document scrolls, More leaves the viewport, `menu-button:close` reports `reason: visibility-change`, the panel closes, and `document.activeElement` becomes BODY. Normal viewport and the stress fixture's bounded scrolling panel do not reproduce this failure in the sampled checks.
- **Evidence / cause:** native event inspector plus the headless `406 × 228` reproduction in `browser-report.json`; [`lab-short-viewport-focus-loss.png`](output/playwright/release-hardening-2026-10-27/lab-short-viewport-focus-loss.png). `.lab__panel` has no block-size bound/scroll container, while the owned Menu Button closes when its observed root leaves view. A temporary bounded, scrollable panel override kept Careers focused and the disclosure open in the settled 260 px scenario; no product CSS or dependency behavior was changed.
- **Mapping:** WCAG 2.2 **2.4.7 Focus Visible (AA)**: keyboard operation leaves no visible focused control after the focused destination is hidden. No separate keyboard-trap or 1.4.4 failure is inferred from this observation.
- **Recommendation / retest:** consume the dependency's placement/available-height behavior in demo CSS and provide scrolling within a bounded panel. Preserve the Menu Button responsibility boundary and visibility protection. At native 200–400% zoom and short viewports, verify ArrowDown, End/Home, repeated arrow movement, activation, and Escape with first/final items in view, focus retained, and source order unchanged.

### Remaining checks and release verdict

1. Fix RH-01/RH-02 in the consumer demo integration, regenerate Pages, and repeat the failing native zoom/reflow/keyboard scenarios plus regression gates.
2. Run native browser text-only resizing through 200%, including labels, controls, disclosure first/final destinations, long/localized labels, and recovery to normal size. The lab's text-scale control and the computed-font probe do not replace this check.
3. Run real Windows contrast themes in the chosen browser(s): light/dark themes, text, More boundary/chevron, current-page state, focus, open disclosure, disabled sweep controls, and state changes. Chromium emulation is supplemental evidence only.
4. Refresh VoiceOver evidence against the corrected current working tree; perform NVDA/browser checks if Windows AT support is in the release matrix. The 2026-09-22 report remains historical evidence.
5. Complete the supported-browser/manual matrix, final CI/package release audit, and final documentation synchronization. Full normal-theme contrast, text-spacing, orientation, target-size, hover-content, and complete localization/browser coverage were outside this bounded inspection; no passes are inferred for them.

**Pre-remediation inspection verdict:** RH-01 and RH-02 blocked completion. The following remediation record supersedes that finding status while preserving the original reproduction evidence. Text-resize and forced-colors emulation do not replace the remaining native/manual checks.

## RH-01/RH-02 remediation and retest — 2026-10-27

### Implemented

- **RH-01:** the scenario lab uses an explicit `minmax(0, 1fr)` grid track. Its disclosure is positioned and width-bounded within the navigation row, including localized labels and RTL. This also fixes a German-label edge case found during retesting where aligning the panel to More put its edge outside the viewport.
- **RH-02:** the panel has an available-height/viewport bound and vertical scrolling. CSS honors the Menu Button's top-placement state and supplied height/offset values; keyboard interaction and visibility protection remain owned by the dependency.
- Pages was regenerated; `docs/demo.css` matches the authored stylesheet and all eight copied distribution files match package output. Runtime source and built runtime hashes are unchanged from the inspection. No API or dependency changes were made.

### Verification

Final evidence: [`summary.json`](output/playwright/release-hardening-fixes-2026-10-27/summary.json), with source fingerprints and links-by-filename to the matrix/native/supplemental JSON files in that folder. The original failing evidence remains in `release-hardening-2026-10-27/`.

| Check | Status | Evidence and limit |
| --- | --- | --- |
| Layout/localization matrix | Pass, 48 cases | Headless Chrome 156.0.8078.48: Flex nowrap, wrapping Flex, Grid × LTR/RTL × short English, long English, German, Greek at 320 × 900 and 406 × 228 CSS px. Page/panel stay within inline bounds, no panel horizontal scrolling, canonical order/node identity preserved |
| Keyboard matrix | Pass | Each matrix case exercised every overflow link with arrows, Home, End, destination activation, and Escape; final focus remains visible, panel stays open while navigating, Escape returns focus to More |
| Original short-viewport regression | Pass | Many overflow, 260 px container, settled opening before End at 406 × 228: Careers remains visibly focused in the open scrollable panel; activation succeeds |
| Native browser zoom | Pass, 9 locale cases | Final CSS in isolated **Chrome for Testing 153.0.8010.12** on macOS 27.0.1; native popup verified 200/300/400%, DPR 4/6/8. English/German/Greek first/final items, Home/arrows, activation, and Escape pass. See dimensions below |
| Presets and lifecycle fallback | Pass | All six presets fit at 320 px; destroy/reinitialize retains wrapping fallback for all three layout modes; no-JavaScript lab at 320 px retains all seven destinations |
| Supplemental text/forced colors | Pass within probe scope | Doubled computed text at 1280 × 900 and light/dark forced-colors emulation at 406 × 228 retain visible final-link focus; these do not qualify native text-only resizing or Windows contrast themes |
| Generated Pages | Pass | All three entrypoints initialize and fit at 320 px without uncaught page errors; CSS/distribution parity checked |
| Package gates | Pass | 48 unit tests, typecheck, full build/Pages generation, package dry-run (12 files, temporary cache), `git diff --check`. No lint script is configured |

| Final native zoom | CSS viewport | Document client / scroll width | Result |
| --- | --- | --- | --- |
| 200% | 640 × 468 | 632 / 632 px | Three locale cases pass |
| 300% | 426 × 312 | 421 / 421 px | Three locale cases pass |
| 400% | 320 × 234 | 316 / 316 px | Three locale cases pass at the reflow threshold |

The initial Chrome 156 native retest passed reflow/focus before the final localized inline-bound adjustment. Because the user's regular browser was active, final native qualification used a separate installed Chrome for Testing 153 window with a temporary profile and no viewport override. The complete final matrix used Chrome 156 headless. This is bounded browser evidence, not a full browser/version matrix or a current Chrome 156 native-zoom qualification. The regular browser's test-site zoom had already been restored to 100%; the isolated test browser was closed after verification.

Retained headless screenshots such as [`short-viewport-end.png`](output/playwright/release-hardening-fixes-2026-10-27/short-viewport-end.png) and [`reflow-320.png`](output/playwright/release-hardening-fixes-2026-10-27/reflow-320.png) illustrate the corrected states. A native application screenshot also confirmed visible Careers focus and the open scrolling panel at 400%; native CDP captures rendered blank and were excluded from the evidence files. Measurements and actual keyboard actions support the pass claims; screenshots alone do not qualify interaction or assistive technology.

### Remaining manual checks

- Native browser text-only resizing through 200%, including enlarged/localized controls and first/final disclosure destinations.
- Real Windows light/dark contrast themes, including focus, current-page state, More, disabled controls, and open disclosure.
- Current-tree VoiceOver; NVDA/browser checks if Windows AT support is in the release matrix.
- Chosen supported-browser/native-zoom matrix (including current Chrome 156 where required), final CI/package release audit, and final release documentation synchronization. The earlier inspection's other explicit coverage gaps remain unqualified.

**Current verdict: RH-01 and RH-02 resolved in the tested scope; release hardening remains in progress pending the manual qualification and final audit above.** No package publication, deployment, or release decision was performed.

## Native text-only resizing inspection — 2026-10-27

### Target and method

Inspected the same working-tree product files as the RH-01/RH-02 retest, based on `6895d10e226fe8332a1b6eb740da079f759319d6`. No runtime, demo CSS/HTML, API, or dependency changes were made in this slice. Fresh build output and Pages distribution/CSS parity passed; product fingerprints match the prior fix record.

Used the signed native Firefox application on macOS **27.0.1 (26A434)** with a separate temporary profile. Native settings showed **Zoom text only / Nur Text zoomen checked** and Default Zoom selected at **100%, 150%, and 200%**. This follows [Mozilla's text zoom method](https://support.mozilla.org/kb/Textzoom); it is separate from the earlier computed-font override and full-page zoom probes. Firefox **158.0.1** (UA 158.0) supplied the three-page English samples; after a native UI recovery/restart, Firefox reported **159.0** (UA 159.0) for stress at 200%, German/Greek lab samples, and recovery. These results do not establish a complete matrix on either version.

A temporary localhost response helper measured the unchanged demo and recorded local snapshots. It added an offscreen `font: 16px Arial` text calibration inside a fixed 100 × 20 px box; it did not override demo fonts or styles. The helper selected authored Narrow/Many overflow and label controls through their existing handlers. Navigation used actual native browser keys. The lab's own Text scale stayed at **100%**. All measurements below use CSS pixels.

| Native text setting | Calibration computed font | Text range width | Fixed box / viewport / DPR |
| --- | --- | --- | --- |
| 100% | 16 px | 133.33 px | 100 × 20 / 1280 × 955 / 2 |
| 150% | 24 px | 200 px | unchanged |
| 200% | 32 px | 266.5 px | unchanged |

The increasing text measurements with unchanged non-text geometry confirm native text resizing. Document client/scroll width remained **1265 / 1265 px** in the recorded samples. This does not qualify a combined 320 px viewport/text-size matrix.

### Results

Evidence: [`summary.json`](output/playwright/native-text-only-2026-10-27/summary.json), [`events.jsonl`](output/playwright/native-text-only-2026-10-27/events.jsonl), [transcribed native AX observations](output/playwright/native-text-only-2026-10-27/native-observations.json), and the [measurement helper](output/playwright/native-text-only-2026-10-27/audit-helper.js). Event snapshots are debounced; they are not a complete key/event trace. Native screenshots were visually inspected, but no native PNG was retained for this slice.

| Sample | Status | Observed result |
| --- | --- | --- |
| Basic Narrow preview, 100/150/200% | Pass in sampled scope | Final link About us remains focused and visible in the open disclosure; no panel horizontal scrolling. At 200%, Home/arrows, activation, and Escape to More also pass |
| English lab Many overflow, 100/150/200%, Flex nowrap LTR | Pass in sampled scope | Careers remains focused and visible; no panel horizontal scrolling. At 200%, Home/arrows, activation, and Escape to More also pass |
| Stress default 900 px frame, 100/150% | Pass in sampled scope | Account remains visibly focused in the open disclosure; Escape returns to More |
| Stress default frame, 200% | **Fail RH-03** | More opens and ArrowDown focuses Membership; End closes the panel and leaves focus on BODY / native HTML content |
| German lab Many overflow, 200%, Flex nowrap LTR | **Fail RH-04** | First/final focus, Home/arrows, activation, and Escape to Mehr work, but the panel requires horizontal scrolling: **362 px scroll width / 255 px client width** |
| Greek lab Many overflow, 200%, Flex nowrap LTR | Pass in sampled scope | First/final links visibly focused, no horizontal panel scrolling; Home/arrows, activation, and Escape to Περισσότερα pass |
| Restore native text size to 100% | Pass | Calibration returns to 16 px; stress End focuses Account and Escape returns to More in Firefox 159 |
| Canonical order / original nodes | Pass in recorded samples | Combined primary/overflow node identity and canonical href order remain unchanged, including failed presentation cases |
| Local package gates | Pass | 48 unit tests, typecheck, full build/Pages generation, package dry-run (12 files, temporary npm cache), copied distribution/CSS parity, and `git diff --check`; no lint script exists |

### Open findings

- **RH-03 — Stress disclosure loses focus at native 200% text.** Reproduce in Firefox 159 with text-only zoom at 200%: open `examples/stress/index.html` at 1280 × 955 CSS px, retain the default 900 px frame, activate More, press ArrowDown, then End. Expected: Account stays visibly focused in an open scrollable panel. Observed: the panel closes and focus falls to BODY. Opening telemetry places the panel at y=529.5–1102.5 in a 955 px viewport. Repeated with telemetry and reproduced again on the original page served without injection. Source inspection shows stress CSS limits height to `60vh` but does not consume the dependency's available-height/top-placement values. Focus scrolling followed by dependency visibility closure is the supported explanation; the exact close-event reason was not captured. **Open for remediation and native retest.**
- **RH-04 — German lab disclosure needs horizontal scrolling at native 200% text.** Use Many overflow, German labels, Flex nowrap, LTR, and leave the lab text scale at 100%. Open Mehr and press ArrowDown then End. Karrieremöglichkeiten remains focused, but panel content is 362 px wide within a 255 px client area. Expected: localized labels reflow within the panel. The document itself stays within inline bounds. **Open for remediation and localized native retest.** The earlier Chromium full-page zoom/localization pass does not cover this Firefox text-only result.

Cached Playwright Firefox builds could not launch in this macOS environment because of sandbox/helper errors; security settings were not weakened. The native Firefox 158 UI later stalled during label selection; testing recovered in the same isolated profile, reporting Firefox 159. That incident does not establish a plugin hang. The temporary profile's zoom was restored to 100% after testing; the regular user profile was not changed.

### Remaining qualification

- Fix and retest RH-03/RH-04; text-resize release qualification remains **open after executed checks**, rather than unrun.
- Expand native text-only coverage to the chosen browser/version, localized, layout, direction, and narrow-viewport matrix as required by the release target. Long English, wrapping Flex, Grid, RTL, and localized 150% cases were not qualified in this slice.
- **Open:** real Windows light/dark contrast themes, including focus, current-page state, More, disabled controls, and the open disclosure. Earlier Chromium forced-colors emulation remains supplemental evidence only.
- **Open:** current-tree VoiceOver and NVDA/browser checks where Windows AT is supported. No AT check was performed in this slice; historical owner-reported VoiceOver evidence remains dated.
- **Open:** chosen supported-browser/native-zoom matrix, final CI/package release audit, and final release documentation synchronization.

**Verdict: native text-only resizing was exercised through 200%; qualification is incomplete because RH-03 and RH-04 remain open.** No publication, deployment, commit, or release decision was performed.

## RH-03 classification and demo finding disposition — 2026-10-27

**RH-03 is a stress-demo CSS integration issue. No defect in Overflow Nav's JavaScript was identified in this reproduction.** Per the user's scope decision, demo-only findings are excluded from runtime release blockers: RH-03 is classified accordingly, and RH-04 is ignored as a lab presentation issue. Neither source stylesheet was changed. The historical failed observations above remain valid; this section supersedes their required-remediation status.

Reproduced RH-03 in native Firefox **159.0**, with **Zoom text only checked at 200%**, viewport **1280 × 955**, DPR **2**, and body text **32 px**. Added diagnostic event logging through a temporary localhost response and compared the original stress stylesheet against a response with only an available-height CSS bound and top-placement rule added. Both samples actually used `bottom-end`, so the effective difference was the height bound. Runtime code, options, node ownership, and dependency visibility protection were identical.

| Evidence | Original stress CSS | Temporary CSS comparison |
| --- | --- | --- |
| Menu Button supplied height limit | 425.5 px, ignored by `max-block-size: 60vh` | 425.5 px, consumed by `min(60vh, var(--_panel-max-height, 60vh))` |
| Actual panel | y=529.5–1102.5, height 573 px | y=529.5–955, height 425.5 px |
| End key | Initially focuses Account, then document scrolls from 680.85 to 1252.25 px | Focuses Account; document scroll stays at 680.85 px while the panel scrolls internally |
| Close event | `menu-button:close`, reason **`visibility-change`** | No visibility close; disclosure stays open with Account focused |
| Home / Escape | Prior failure already reproduced | Home focuses Membership; Escape returns focus to More |

The exact chain is now captured: native focus scrolling moves the menu root outside the viewport, and Menu Button's existing visibility observer closes with `returnFocus: false`, hiding the focused link. The original demo rule is in `examples/stress/index.html` around lines 101–108. The installed dependency supplies the available-height value in `updatePlacement()` and closes on non-intersection in `setupVisibilityObserver()`. No `overflow-nav:change` or `overflow-nav:refresh` event occurred during the captured keyboard sequence. Respecting the height value resolves the reproduction without changing either JavaScript implementation or disabling the visibility guard.

Evidence: [classification summary](output/playwright/rh03-classification-2026-10-27/summary.json), [event trace](output/playwright/rh03-classification-2026-10-27/events.jsonl), [diagnostic helper](output/playwright/rh03-classification-2026-10-27/trace-helper.js), and [temporary comparison server](output/playwright/rh03-classification-2026-10-27/comparison-server.py). Requests can complete out of order; use each page's sequence numbers to order its trace. Source fingerprints match the preceding native-text record. The temporary profile was restored to 100% afterward.

Fresh verification: **48 tests, typecheck, full build/Pages generation, package dry-run (12 files), copied distribution/CSS parity, and diff checks pass**. No lint script exists. These gates do not replace browser or AT evidence.

**Current disposition:** bounded native text-size inspection completed; RH-03/RH-04 do not block the runtime release scope. Wider browser/text-size qualification, real Windows contrast themes, current VoiceOver/NVDA checks where supported, and the final release audit remain open. No demo or runtime fix, commit, publication, or deployment was performed in this classification slice.

## RH-03/RH-04 demo fixes and retest — 2026-10-27

Both demo CSS findings are now **resolved in the tested scope**:

- **RH-03:** the stress disclosure consumes Menu Button's available-height value through `min(60vh, var(--_panel-max-height, 60vh))` and honors top placement. Final-link focus scrolls the panel internally instead of moving More offscreen.
- **RH-04:** overflow links in the lab use `overflow-wrap: anywhere`, allowing long German words to wrap within the constrained panel.

Pages was regenerated. No runtime JavaScript, API, dependency, or keyboard responsibility changed. Source/built runtime fingerprints match the preceding classification record.

Focused native verification used **Firefox 159.0 on macOS 27.0.1**, **Zoom text only checked at 200%**, viewport **1280 × 955**, DPR **2**, calibration font **32 px**. The local measurement helper does not override demo fonts/styles; the lab's Text scale stays at 100%. The generated stress top-placement case scrolls More near the viewport bottom before opening it.

| Case | Result |
| --- | --- |
| Source stress, default 900 px frame | Pass: End leaves Account visibly focused in the open panel, height bounded to 425.5 px; no horizontal panel scrolling |
| Source German lab, Many overflow | Pass: End leaves Karrieremöglichkeiten visibly focused; panel client/scroll width **255 / 255 px**, previously 255 / 362 px |
| Generated Pages German lab | Pass: final-link focus remains visible and panel width is **255 / 255 px** |
| Generated Pages stress, top placement | Pass: `top-end` placement, Account visibly focused in the open panel; no horizontal panel scrolling |
| Home / Escape | Pass on source stress/German and generated stress: Home returns to the first overflow link; Escape returns to More/Mehr. Generated German Escape also returns to Mehr |
| Order, identity, document bounds | Pass in all four End snapshots: original nodes/canonical order retained, no document horizontal overflow |
| Package/generated checks | Pass: 48 tests, typecheck, full build/Pages generation, package dry-run (12 files), copied CSS/distribution parity, and `git diff --check`; no lint script exists |

Evidence: [summary and source fingerprints](output/playwright/rh03-rh04-fixes-2026-10-27/summary.json), [native event snapshots](output/playwright/rh03-rh04-fixes-2026-10-27/events.jsonl), and [measurement helper](output/playwright/rh03-rh04-fixes-2026-10-27/audit-helper.js). The isolated profile was restored to 100% afterward. Historical failing records remain intact.

**No manual screen-reader testing was performed, as requested.** Current VoiceOver/NVDA qualification, real Windows contrast themes, the wider chosen native/browser matrix, and final release audit remain open. No commit, publication, or deployment was performed.

## Final local release audit — 2026-10-27

**Code/package gate: Pass. No confirmed code or package-content blocker found.** Full release readiness remains conditional. The target is the current uncommitted tree based on `6895d10`, with the RH-03/RH-04 fixes; product fingerprints did not change during the audit.

Fresh checks passed: **48 tests**, typecheck, full build, package dry-run, actual tarball allowlist/byte validation (**12 files, 26,044 compressed bytes**), all public export/type paths, Pages module/CSS/distribution parity, unchanged Pages regeneration, and diff checks. Source maps are intentionally configured and included. There is no lint script.

An isolated offline installation using local plugin and installed dependency tarballs passed. Node **24.21.0** imports the runtime, `/docs`, and `/package.json` without a DOM. A strict NodeNext TypeScript consumer exercises all exported root types and `PluginDocs` without `skipLibCheck`; it compiles successfully. This does not assert online registry installation/version availability.

Fresh headless Chrome for Testing **153.0.8010.12** checks at **320 × 900** pass on all three generated pages. Each initializes, retains canonical node identity/order, keeps the final disclosure destination visibly focused, and returns focus to More with Escape. German lab and stress top-placement cases are included; no horizontal document/panel overflow or page/module error was observed. The initial missing favicon request is nonessential and excluded from module assertions. These checks do not replace the native-text evidence or a wider browser matrix.

**Open RA-01:** Changesets status exits **1**, reporting a changed package without a pending Changeset. The built package/imports are valid, but release changeset/notes and version preparation are unfinished. No changeset or version was created because this audit did not request release mutations.

**Open / not run:** Windows contrast themes, current VoiceOver/NVDA and other AT checks, wider chosen native/browser qualification, current-tree CI, registry availability/credentials/advisory freshness, and final release synchronization. **Manual screen-reader testing was explicitly excluded and not performed.**

See the [final local audit](RELEASE_AUDIT.md#final-local-audit--2026-10-27) for the full decision and [structured evidence](output/playwright/final-local-audit-2026-10-27/summary.json) for check outcomes. Historical results remain preserved; no commit, tag, publication, or deployment was performed.

## RA-01 resolution — 2026-10-27

**Resolved:** added [release notes originally prepared in a patch Changeset](CHANGELOG.md) for the current runtime and demo fixes. Changesets status exits **0**, recognizing one patch plan for `a11y-overflow-nav`, **0.1.0 → 0.1.1**. The planned increment has **not** been applied: `package.json` is still **0.1.0**, and versioned changelog generation is deferred. This supersedes the earlier RA-01 failure status without replacing its historical evidence.

Fresh verification passes: **48 tests**, typecheck, full build/Pages, package dry-run (**12 files**, unchanged package hash), generated parity, and diff checks. Product/package fingerprints match the final local audit. No browser retest was needed for this release-metadata-only change; prior browser evidence retains its recorded scope.

[Changesets status output](output/playwright/ra01-resolution-2026-10-27/changesets-status.json) and [resolution summary](output/playwright/ra01-resolution-2026-10-27/summary.json) record the pending plan. **Windows contrast themes and AT checks remain open. Manual SR testing was not run.** Wider native qualification, current-tree CI, and separately authorized version application remain pending. No version command, commit, tag, publication, or deployment was performed.


## Scenario-lab product polish — 2026-11-03

Bounded demo-only changes: lifecycle controls disable unavailable actions, a polite status explains active/destroyed states and recovery, and focus moves from a newly disabled lifecycle button to the next usable lifecycle action. Controls start disabled until initialization succeeds. Medium/compact preset labels no longer imply an exact overflow count; the width label and associated hint explain the available-space limit. Package runtime and public API were not changed in this pass; pre-existing working-tree changes were preserved.

Pass: 48 unit tests, typecheck, full build/Pages generation, package dry-run (12 files), generated lab HTML/CSS parity with the expected import-map rewrite, and diff whitespace check. The first package dry-run failed on local npm cache permissions; retrying with a writable temporary cache passed without changing the normal cache.

Pass: local generated Pages lab in native Chrome, at the default viewport and a temporary 320 × 900 viewport. Verified initial enabled/disabled controls; destroy/reinitialize recovery using Enter; focus transfer to Reinitialize and back to Destroy; original links restored after destruction; redistribution restored after reinitialization; and renamed compact preset applying 360px. At 320px, document scroll width was 305px, with no horizontal page overflow. Temporary viewport override was reset. Browser checks used the connected Chrome session after the Playwright CLI was unavailable due to registry DNS access. Screenshot: [polished controls](output/playwright/product-polish-2026-11-03/lab.png).

Not run: current screen-reader announcements or a wider browser/AT matrix. The existing release-qualification gaps remain open. No commit, publication, or deployment was performed.


## Basic-demo product polish — 2026-11-03

Demo-only changes: the width-toggle hint now describes its on/off setting and explains that a small window can make both widths identical. The toggle retains its stable name and pressed state and has a minimum 44px height. Initial status accurately describes the unenhanced markup; active overflow feedback explains how to reach the remaining links and avoids rewriting unchanged announcements. Disclosure CSS now honors the dependency's available-height value and top placement, matching the other demos. Basic README and generated Pages output were synchronized. Existing unrelated changes were preserved; runtime/API/dependencies were not changed by this slice.

Pass: 48 unit tests, typecheck, full build, package dry-run with writable temporary npm cache (12 files), generated basic HTML/CSS parity after the import-map rewrite, and diff whitespace check.

Pass: generated basic demo in connected native Chrome, default viewport and temporary 320 × 500 viewport. Space toggles the width, pressed state, and explanatory hint; the default desktop narrow state reports four overflow links. At 320px, toggling off leaves the same constrained layout and six overflow links, with the hint explaining the limitation; document scroll width is 305px. Toggle height is 44px. More opens with Enter; ArrowDown reaches its first link; End reaches About us visibly; Escape closes and returns focus to More. Bottom placement was constrained to 222px with 272px scroll content. A separate top-placement check placed the panel at y=127.92–401.85 above the trigger at y=409.85 within the 500px viewport. No warning/error logs were captured. Viewport override was reset.

Screenshots: [basic controls](output/playwright/basic-polish-2026-11-03/basic.png), [top placement](output/playwright/basic-polish-2026-11-03/top-panel.png).

Not run: manual screen-reader announcements, browser-disabled-JavaScript runtime checks, or a wider browser/AT matrix. The static fallback was reviewed in source. Existing release qualification gaps remain open. No commit, publication, or deployment was performed.


## Stress-fixture product polish — 2026-11-03

Fixture-only changes: manual width edits invalidate the previous sweep; controls remain disabled until setup completes; operation buttons regain focus when disabling them dropped focus to the body. The maximum-width hint explains viewport capping, and a measured border-box width range is recorded with each result. Result columns can shrink/wrap at narrow widths. No runtime/API/dependency changes were made by this slice; pre-existing changes were preserved.

A repeat run exposed stale sampling: two animation-frame waits could resume before the plugin's ResizeObserver-scheduled layout. The fixture now waits three frames per step and settles at a requested 1200px before starting its timer and counters. The completion message and README explain that elapsed time includes frame waits/diagnostics and requires a fresh baseline for this fixture revision. No plugin performance improvement is claimed.

Pass: 48 unit tests, typecheck, full build/Pages generation, package dry-run with temporary writable cache (12 files), generated stress HTML parity with the expected import-map rewrite, and diff whitespace check.

Pass: generated fixture in connected native Chrome. Before the third-frame correction, desktop sweeps starting from 900px and 280px reported 21 and 27 estimated moves. After correction, both report 21 steps, 18 estimated moves, 16 change events, maximum overflow 22, final overflow 13, and a measured 280.0–1200.0px range. A subsequent desktop run gives the same counts. Timing values remain browser/device/scheduling dependent. Manual input clears every result; keyboard Run/Reset controls disable during operations and restore availability/focus; Reset restores requested 900px and clears results.

At temporary 320 × 700, a complete sweep reports measured widths 273.0–273.0px, zero estimated moves, and 23 maximum/final overflow items, accurately exposing the available-space cap. Document scroll width is 305px; result labels and values remain within the page. Viewport override was reset. No warning/error logs were captured.

Evidence: [repeatability values](output/playwright/stress-polish-2026-11-03/repeatability.json), [desktop result](output/playwright/stress-polish-2026-11-03/stress.png), [narrow result](output/playwright/stress-polish-2026-11-03/narrow.png).

Not run: injected failure paths, JavaScript-disabled runtime checks, manual screen-reader announcements, or other browser/AT qualification. Static initialization/failure handling was reviewed in source. Existing release-qualification gaps remain open. No commit, publication, or deployment was performed.


## Original example navigation content — 2026-11-12

Replaced every managed destination in the scenario lab, basic example, and stress fixture with fictional nature-reserve content. The shared seven-link set is Trails, Habitats, Wildlife, Guided walks, Ranger talks, Conservation, and Getting here. The stress fixture retains 24 distinct destinations, extending the theme with tide pools, bird hides, viewpoints, restoration, and a reserve map. The lab's long English, German, and Greek variants and their data-key mappings were replaced together. The basic scenario now names Cedar Coast Reserve; its preview ID and controlling button were updated together. The README and displayed HTML snippets, example READMEs, and generated Pages copies match the new destinations. Historical evidence and unrelated test-fixture labels remain unchanged. Existing working-tree changes were preserved.

Pass: 48 tests, typecheck, full build/Pages generation, package dry-run with temporary writable cache (12 files), diff whitespace check, 7/7/24 unique destination counts, and generated HTML parity after the import-map rewrite. Runtime distribution bytes match the pre-task generated distribution. An independent read-only subagent reviewed coverage, localization-key completeness, preview/control ID agreement, generated parity, and the slice diff; no actionable inconsistency was found.

Pass: local generated Pages in connected Chrome. The lab Wide preset displays all seven links; compact scenarios load all seven nonempty labels with matching hrefs and lang attributes in short English, long English, German, and Greek. Grid, RTL, and long-label scenarios at temporary 320 × 700 retain 305px document scroll width. The Greek and long-English disclosures allow ArrowDown/End to reach the final destination and Escape returns focus to More. The basic demo retains Trails as the current-page link, its width toggle works, and its final Getting here destination is keyboard reachable; at 320px it reports six overflow links without horizontal page overflow. The stress sweep completes all 21 steps with 24 destinations, a 280–1200px measured range, and final overflow 14 in this desktop sample; End reaches Reserve map. These counts reflect new label lengths and are not comparable to earlier content baselines. The temporary viewport override was reset.

Browser logs: stress has no captured warning/error entries. Lab/basic captured asynchronous listener/message-channel errors; their source was not established, and this record does not claim a clean console. No functional failure was observed in the exercised flows.

Evidence: [browser checks](output/playwright/reserve-nav-2026-11-12/checks.json), [basic example preview](output/playwright/reserve-nav-2026-11-12/basic.png). Not run: current screen-reader or wider browser qualification. Existing release-qualification gaps remain open. No commit, tag, publication, or deployment was performed.


## Final example-polish pass — 2026-11-12

Reviewed the scenario lab, basic demo, and stress fixture with the nature-reserve destinations. Two bounded defects were reproduced and fixed: at a 280px viewport the basic/stress disclosures extended beyond the left edge, and the lab Focus inspector displayed INPUT for ranges or all option text for selects. The basic and stress panels now anchor to their navigation rows and cap their inline size, matching the lab's existing approach. The inspector uses each range/select's authored label and retains localized link names. Basic/stress READMEs and generated Pages were synchronized. Only these three implementation files changed in this slice; package runtime/API/dependencies and unrelated work were preserved.

Pass: 48 unit tests, typecheck, full build, package dry-run with temporary writable cache (12 files), generated HTML/CSS parity, unchanged runtime-distribution bytes, and diff whitespace check. Browser-evidence assertions also passed for all six corrected panel-bound cases, final-link visibility, control labels, localization, lifecycle, and sweep/reset results.

Pass: connected Chrome against local source reproductions and generated Pages retests. At 280px, basic panel bounds improved from x=-15.83–192.17 to x=38.61–226.41; stress improved from x=-81.05–158.95 to x=29–236. Both final destinations (Getting here / Reserve map) remained visibly keyboard focused, and Escape returned focus to More. At confirmed 320 × 500, both panels stayed within horizontal and vertical viewport bounds for bottom and top-end placement. Basic top bounds were y=127.90–401.83 and stress top bounds y=103.80–403.80.

The lab now identifies focused controls as Maximum container width, Layout, Direction, Labels, and Text scale. Wide, compact, long-label, Grid, and RTL presets retain all seven destinations; all four label variants remain nonempty and localized. At 320 × 700 with Greek labels, RTL, and the lab's 200% text-scale control, End reaches Πρόσβαση and the inspector reports the same name without horizontal page overflow (305px document width). This is demo text scaling, not native browser zoom qualification. Destroy restores seven primary items and focuses Reinitialize; reinitialization retains seven items and focuses Destroy. The desktop stress sweep completes 21 steps over measured 280–1200px, and Reset clears results and restores requested 900px with button focus. Final-review-tab warning/error logs were empty. The temporary viewport override was reset.

Evidence: [structured browser checks](output/playwright/final-example-polish-2026-11-12/checks.json), [final basic preview](output/playwright/final-example-polish-2026-11-12/basic.png).

Not run: manual screen-reader announcements, JavaScript-disabled runtime checks, native text-only resizing/zoom, forced colors, or other browser/AT qualification. Existing release-qualification gaps remain open. No commit, publication, or deployment was performed.

## Example navigation and integration docs — 2026-11-12

Added reciprocal example navigation to the scenario lab, basic example, and developer performance fixture, with one current-page link per page. Integration guidance now links directly to the existing consumer-owned demo stylesheets. Updated README/example guides and metadata descriptions, then regenerated Pages. A bounded read-only subagent review identified a missing in-page stylesheet pointer on the stress fixture; that pointer was added before final verification.

Pass: 48 tests, typecheck, full build/Pages generation, package dry-run (12 files), source/generated relative-link checks, HTML/CSS/distribution parity, and diff whitespace checks. Baseline file fingerprints confirm unrelated working-tree files, demo scripts, runtime distribution, declarations, package metadata, and the preceding Task 1 changes were preserved.

Pass: connected Chrome against the local `/A11y-Overflow-Nav/` preview. Enter follows the lab → basic → developer fixture → lab navigation cycle. At a temporary 320 × 700 viewport, each page has 305px document scroll width, the example links stay within the page and have 44px minimum height, and the current-page labels are correct. Tab shows a solid focus outline on the basic example link. The viewport override was reset; captured lab warning/error logs were empty.

Client limitation: standalone navigation to the linked CSS file was blocked by Chrome with `ERR_BLOCKED_BY_CLIENT`. A separate HTTP HEAD returned `200 OK`, `text/css`, and 9133 bytes; the same stylesheet loaded on the basic demo. This is not a successful browser CSS-source preview claim. No deployed Pages or new assistive-technology/native-zoom qualification was performed.

Evidence: [link, parity, preservation, and browser observations](output/playwright/docs-navigation-2026-11-12/checks.json), [navigation preview](output/playwright/docs-navigation-2026-11-12/lab.jpg).

## Documentation evidence reconciliation — 2026-11-12

Completed docs-plan Task 3: reconciled current roadmap/implementation/release summaries with the recorded November work, labelled the September review and older stress measurements as historical/non-comparable, distinguished planning milestones from package versions, and documented local-only evidence delivery. Expanded the pending patch notes for the November demo/docs changes. Historical figures, failures, screenshots, and structured evidence were preserved; no version was applied.

Fresh checks pass: **48 tests**, typecheck, full build/Pages, package dry-run (**12 files**), Changesets status (**one unapplied patch plan, 0.1.0 → 0.1.1**), relative-link/heading-anchor checks, and final whitespace checks. An independent bounded read-only subagent review found no actionable documentation discrepancy. Baseline fingerprints confirm only the seven intended documentation/release-note files changed; existing source, package metadata, generated distribution/Pages, and evidence artifact bytes were preserved.

This is documentation and local package verification. No browser, screen-reader, native-zoom/text-size, Windows contrast-theme, remote CI, registry, isolated-consumer, or deployed Pages checks were rerun. Earlier dated evidence retains its scope. Full release qualification, selected artifact delivery, and version application remain open.

## v1 owner acceptance and version preparation — 2026-11-13

The project owner requested version 1, reported that AT testing works, and reported native browser zoom/text checks as passed. These are accepted as **owner-reported passes for the 1.0.0 release scope**. The AT/browser combinations, versions, devices, and precise native zoom/text settings were not supplied; the agent did not perform or independently repeat those manual checks. This does not establish a universal browser/AT matrix or identify a specific VoiceOver/NVDA result.

The owner explicitly retired **native Windows contrast-theme testing as a package release gate** because this behavior-only plugin ships no CSS and is integrated into sites with different styling. This is a scope decision, not a contrast test pass. Each integration remains responsible for contrast themes, visible focus, current-page styling, and its other CSS-dependent accessibility behavior.

The requested **1.0.0** version was applied through `npm run version-packages` after changing the existing release plan from patch to major. The earlier 0.1.1 plan was superseded; Changesets consumed its file and retained the accumulated notes in `CHANGELOG.md`. This is stable-version preparation without an API/runtime/dependency change. JSON-LD version metadata in the lab/basic sources was aligned for regeneration into Pages. Historical release notes, results, and artifact bytes were preserved.

The remaining release work is Git delivery of the intended release files and selected evidence, passing CI for that commit, and deployment/publication verification when authorized. This preparation does not itself perform a commit, tag, push, publication, or deployment. Earlier references to the consumed Changeset now point to the changelog; the historical 0.1.1 diagnostic remains a dated record.

Fresh automated verification for 1.0.0 passes: **48 tests**, typecheck, full package/Pages build, package dry-run (**12 files**), 76 local Markdown link/anchor checks, generated JSON-LD version parity, accumulated release-note preservation, and diff whitespace checks. Baseline fingerprints confirm all unrelated working-tree files, runtime/declaration bytes, demo scripts, and historical artifact bytes are preserved. A bounded independent review found no actionable issue in the reviewed version/docs delta; README and architecture wording were inspected but their full before/after copies were not supplied to that reviewer.

**Changesets status: exits 1**, reporting changed packages with no pending Changesets after the version command consumed the plan. The release working tree is still uncommitted. No empty or additional release Changeset was added to hide that state; recheck the workflow status as part of Git delivery. The successful version command, package version, generated changelog, and retained notes establish that 1.0.0 was applied locally. No agent-run manual AT/native-zoom/Windows test is claimed by the automated results.
