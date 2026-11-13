# Roadmap

## Current status — 2026-11-13

The v0.1, v0.2, and v0.3 headings below name **planning milestones**, not published npm versions. The owner requested stable **1.0.0** on 2026-11-13. That version has been applied through Changesets and its accumulated notes are in [CHANGELOG.md](CHANGELOG.md); the earlier 0.1.1 patch plan was superseded and consumed.

The [November records](VERIFICATION.md#recorded-november-verification) retain their dated automated/browser evidence. The [2026-11-13 owner report and release-scope decision](VERIFICATION.md#v1-owner-acceptance-and-version-preparation--2026-11-13) accept AT and native browser zoom/text checks as passed; combinations and versions were not supplied. Windows contrast-theme testing is retired as a package release gate and remains consumer CSS integration work. The release-hardening milestone remains **in progress** for Git delivery, current-tree CI, and final deployment/publication verification. Evidence artifacts and the generated Pages tree remain [local/untracked](VERIFICATION.md#evidence-delivery).

## v0.1 — Core Priority+ engine

- [x] OVN-001 Architecture contract
- [x] OVN-002 TypeScript / ESM package scaffold
- [x] OVN-003 A11y Menu Button core dependency boundary
- [x] OVN-100 Semantic DOM contract
- [x] OVN-101 Progressive-enhancement initial state
- [x] OVN-102 Structural validation
- [x] OVN-200 Canonical source-order capture
- [x] OVN-210 Shrink algorithm
- [x] OVN-220 Grow algorithm
- [x] OVN-230 Final-item / disappearing-More case
- [x] OVN-300 Browser-geometry fit predicate
- [x] OVN-400 ResizeObserver + requestAnimationFrame scheduling
- [x] OVN-430 Explicit refresh boundary
- [x] OVN-500 Owned A11y Menu Button composition
- [x] OVN-510 Menu refresh after redistribution
- [x] OVN-520 Empty-overflow transition
- [x] OVN-600 Primary-to-overflow focus continuity
- [x] OVN-610 Overflow-to-primary focus continuity
- [x] OVN-620 More-disappears focus continuity
- [x] OVN-700 Exact source-order restoration
- [x] OVN-710 Observer/lifecycle cleanup
- [x] OVN-800 Basic example
- [x] OVN-810 Interactive scenario lab
- [x] OVN-900 DOM/lifecycle unit tests
- [x] Automated package gates: install, test, typecheck, build, pack check

Status: complete and package-gate verified.

## v0.2 — Manual real-browser + VoiceOver verification

- [x] OVN-910 Manual real-browser functional verification
- [x] Priority+ redistribution exercised in a real layout engine
- [x] More disclosure exercised with the published A11y Menu Button integration
- [x] VoiceOver verification completed
- [x] No blocking regression reported during manual verification

Status: verified by the project owner on 2026-09-22 against the then-current implementation. Browser/version details were not recorded in the verification note, so this does not imply current-tree AT qualification or a full Chromium/Firefox/WebKit matrix.

### Optional automation hardening

- [ ] Playwright geometry suite for Chromium, Firefox, WebKit
- [ ] automated Flex nowrap matrix
- [ ] automated Flex wrap matrix
- [ ] automated Grid matrix
- [ ] automated grow/shrink threshold cycles
- [ ] automated fractional-width checks
- [ ] automated long/localized-label checks
- [ ] automated RTL checks
- [ ] automated focus-transition checks during live resize

These are useful regression protections, but they are no longer blocking the manual v0.2 verification record.

## v0.3 — Release hardening

In progress.

- [x] OVN-1000 Add a developer-only 24-item performance stress fixture
- [x] OVN-1010 Add ResizeObserver/requestAnimationFrame coalescing regression coverage (CI verified)
- [x] OVN-1020 Complete source-level observer/reflow cost review
- [x] v0.3 automated package gates after performance-hardening changes
- [x] OVN-1030 Record manual stress-fixture measurements in a real browser
- [x] Bounded 200–400% zoom/reflow checks — RH-01/RH-02 fixed; final native Chrome for Testing 153 and Chrome 156 headless matrix pass (2026-10-27); supported-browser native matrix remains open
- [x] Bounded native text-size inspection — Firefox 100/150/200% samples recorded; RH-03/RH-04 demo CSS fixes pass focused native 200% source/Pages retests (2026-10-27). Wider chosen matrix remains open
- [x] Windows contrast-theme package gate retired by owner on 2026-11-13 — consumer-owned CSS integration responsibility, not a test-pass claim
- [ ] Specific NVDA/browser matrix — optional integration coverage beyond the unspecified owner-reported AT combinations; not a 1.0.0 package release gate
- [x] VoiceOver manual verification — historical 2026-09-22 evidence
- [x] Current release AT and native browser zoom/text checks — owner-reported pass on 2026-11-13; AT/browser/version details not recorded
- [x] Create release-audit checklist and evidence boundary
- [x] Final local code/package audit — 2026-10-27: tests/build/types, tarball consumer, and three-page browser smoke pass; no confirmed code/package-content blocker
- [x] RA-01 Release version/notes — earlier patch plan superseded; stable 1.0.0 applied through Changesets on 2026-11-13, notes retained in the changelog
- [ ] Full release delivery — release commit/current-tree CI and deployment/publication verification
- [x] Docs-plan Tasks 1–3: lifecycle/example guidance and dated status/evidence reconciliation — 2026-11-12; local scope only
- [ ] Final release-artifact/repository synchronization — selected evidence delivery, tracked Pages output, and current-tree CI; local 1.0.0 version/changelog preparation is complete

## Completed local quality pass — 2026-10-26

The focused improvement pass fixed refresh focus, detached ownership/restoration, callback-triggered destruction, numeric parsing, demo language/fallback behavior, and stress-fixture operation recovery/clipping. Local verification passed 48 unit tests, typecheck, build, package dry-run, independent source review, and bounded Chromium browser checks. Pages output was regenerated and checked. See `VERIFICATION.md` for the target and evidence limits.

The optional committed Playwright suite and the outstanding release-hardening/manual checks above remain open.

## RH-01/RH-02 remediation — 2026-10-27

Resolved in consumer demo CSS: the lab grid/panel stay within available width, and the disclosure scrolls within its available height while honoring top placement. Pages was regenerated. Final checks passed 48 layout/localization cases, 9 native zoom/locale cases, the original keyboard reproduction, 17 supplemental assertions, and local package gates. See `VERIFICATION.md` for versions, dimensions, evidence, and remaining manual checks. This does not complete the release audit.

## Native text-only resizing inspection — 2026-10-27

Executed native Firefox text-only checks at 100%, 150%, and 200%, with text scaling confirmed independently of viewport/DPR scaling. Basic and sampled English/Greek lab paths pass. Subsequent RH-03 classification captured a dependency `visibility-change` close caused by stress-demo CSS ignoring the supplied height bound; a CSS-only browser comparison resolves the reproduction with unchanged JavaScript. RH-03 and lab-only RH-04 are excluded from runtime blockers per user scope; no product files changed. See `VERIFICATION.md` for evidence and disposition. Next: chosen browser/native qualification, Windows contrast themes, current AT checks, and final audit remain open.

Historical follow-up, 2026-10-27: RH-03 and RH-04 were subsequently fixed in demo CSS and Pages regenerated. Four focused native Firefox 159 cases at 200% text-only size pass, including generated top placement and German wrapping. Runtime code is unchanged. Manual screen-reader testing was explicitly excluded; Windows contrast themes, current AT, the wider matrix, and final audit remain open. See the dated `VERIFICATION.md` record.

## November demo and documentation follow-ups

- **2026-11-03:** recorded lab/basic control and focus feedback improvements; the stress fixture gained settled starting widths, three-frame sampling, measured-width feedback, and stale-result clearing.
- **2026-11-12:** recorded localized reserve destinations, narrow disclosure fixes, readable focus-inspector labels, and reciprocal example navigation with integration CSS links. Docs metadata now uses removable lifecycle listeners and consistent node-sequence wording.

The [verification entries](VERIFICATION.md#recorded-november-verification) retain their individual environments and limits. Older stress counts/timings are not comparable to the revised fixture; see the [performance review](PERFORMANCE_REVIEW.md). The October isolated-consumer/native results and September VoiceOver report remain historical. A passing local docs pass does not complete release qualification.

## Deferred


- numeric priorities
- nested / mega-menu redistribution
- MutationObserver automation
- animation
- generated markup
- arbitrary CSS reorder support
