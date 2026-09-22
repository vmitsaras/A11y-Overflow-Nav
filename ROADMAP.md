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

Status: v0.1 implementation and package-level automated verification are complete. Real-browser geometry and manual accessibility evidence remain intentionally tracked in v0.2/v0.3 before a release-quality verification claim.

## v0.2 — Real-browser verification

- [ ] OVN-910 Playwright geometry suite for Chromium, Firefox, WebKit
- [ ] Flex nowrap matrix
- [ ] Flex wrap matrix
- [ ] Grid matrix
- [ ] grow/shrink threshold cycles
- [ ] fractional widths
- [ ] long/localized labels
- [ ] RTL
- [ ] focus transitions during live resize

## v0.3 — Release QA

- [ ] 200–400% zoom checks
- [ ] browser text-size checks
- [ ] forced-colors checks
- [ ] NVDA/browser manual matrix
- [ ] VoiceOver/Safari manual matrix
- [ ] performance stress fixture
- [ ] package release audit

## Deferred

- numeric priorities
- nested / mega-menu redistribution
- MutationObserver automation
- animation
- generated markup
- arbitrary CSS reorder support
