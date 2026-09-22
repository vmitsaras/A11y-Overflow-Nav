# Roadmap

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

Status: verified by the project owner on 2026-09-22 against the current implementation. Browser/version details were not recorded in the verification note, so this does not imply a full Chromium/Firefox/WebKit matrix.

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
- [ ] 200–400% zoom checks
- [ ] browser text-size checks
- [ ] forced-colors checks
- [ ] NVDA/browser manual matrix when Windows AT support is in scope
- [x] VoiceOver manual verification
- [x] Create release-audit checklist and evidence boundary
- [ ] Final package release audit
- [ ] Final documentation/repository synchronization review

## Deferred

- numeric priorities
- nested / mega-menu redistribution
- MutationObserver automation
- animation
- generated markup
- arbitrary CSS reorder support
