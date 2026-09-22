# Implementation plan

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

Status: implemented and included in the manual VoiceOver verification pass.

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

Status: verified.

Evidence recorded on 2026-09-22:

- project owner tested the current implementation in a real browser;
- VoiceOver was included;
- the verification passed;
- no blocking regression was reported.

This is manual acceptance evidence. It does not claim that the optional Playwright cross-browser matrix has been implemented.

## Slice 7 — Release hardening

Status: next.

Primary tasks:

1. add a performance stress fixture with a deliberately large navigation set;
2. inspect ResizeObserver callback frequency, requestAnimationFrame batching, fit checks, and DOM moves;
3. optimize only confirmed bottlenecks;
4. run 200–400% zoom and browser text-size checks;
5. run forced-colors checks;
6. run NVDA/browser validation if Windows AT support is part of the release target;
7. complete a package/release audit;
8. synchronize README, docs metadata, roadmap, and verification records.

### Optional regression automation

A Playwright geometry suite remains valuable for repeatable Chromium/Firefox/WebKit regression coverage, but it is tracked as automation hardening rather than a blocker for the already-completed manual verification.

## Current verification

Latest repository implementation inspected before this update:

- head: `62fdf29f0b86d02dd86a0afa4c650bd19fa22376`
- GitHub Actions run: `35749073102`
- install: pass
- tests: pass
- typecheck: pass
- build: pass
- pack check: pass
- manual real-browser test: pass
- VoiceOver test: pass

See `VERIFICATION.md` for evidence boundaries and remaining release-hardening work.
