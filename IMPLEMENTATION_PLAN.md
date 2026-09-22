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

Status: in progress; implementation hardening is CI verified.

Implemented in the current slice:

1. a developer-only 24-item performance stress fixture in `examples/stress/`;
2. browser-side measurement of elapsed sweep time, distribution-change events, mirrored ResizeObserver callbacks/entries, estimated item moves, and maximum overflow;
3. unit regression coverage proving repeated ResizeObserver signals coalesce into one pending animation frame;
4. unit regression coverage proving pending resize work is cancelled during `destroy()`;
5. a source-level performance review documenting the current cost model and the threshold for future optimization;
6. an in-progress release audit with explicit evidence boundaries.

No runtime diagnostics or new runtime dependencies were added.

Still required:

1. run and record the stress fixture in a real browser;
2. optimize only if those measurements expose a material bottleneck;
3. run 200–400% zoom and browser text-size checks;
4. run forced-colors checks;
5. run NVDA/browser validation if Windows AT support is part of the release target;
6. finish the package/release audit;
7. synchronize final verification and release documentation.

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

Latest v0.3 hardening CI:

- implementation head: `c471e26ad96f75fc62940547ae32da8ee4bbf0e0`
- GitHub Actions run: `35751176276`
- install: pass
- tests: pass
- typecheck: pass
- build: pass
- pack check: pass

See `VERIFICATION.md` for evidence boundaries and remaining release-hardening work.
