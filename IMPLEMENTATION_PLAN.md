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

Status: implemented; real-browser geometry verification remains in Slice 6.

Deliverables:

- geometry-based fit probe
- ordered suffix migration
- ordered restoration
- disappearing-More final-item test
- ResizeObserver invalidation
- requestAnimationFrame batching
- root state / count synchronization

## Slice 3 — Focus continuity

Status: implemented; real-browser focus verification remains in Slice 6.

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

## Slice 6 — Real-browser geometry

Status: next.

Add Playwright only for behavior that requires actual layout. Reuse the scenario lab fixture where practical.

Acceptance targets:

- deterministic prefix/suffix distribution across Chromium, Firefox, WebKit;
- no oscillation at thresholds;
- focus remains visible and valid during redistribution;
- open More disclosure remains coherent during width changes.

## Current automated verification

The latest v0.1 implementation passed the GitHub Actions package gates on 2026-09-22:

1. dependency installation
2. `npm run test`
3. `npm run typecheck`
4. `npm run build`
5. `npm run pack:check`

See `VERIFICATION.md` for the recorded evidence and remaining limitations.

## Remaining verification sequence

1. add and run real-browser geometry tests
2. validate focus transitions in real browsers
3. run zoom, text-size, forced-colors, and localization checks
4. run the supported assistive-technology matrix
5. complete the package release audit
