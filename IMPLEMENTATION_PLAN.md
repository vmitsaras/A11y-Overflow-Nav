# Implementation plan

## Slice 1 — Foundation and semantic contract

Status: implemented.

Deliverables:

- TypeScript / ESM package
- strict semantic markup validation
- source-order capture
- duplicate initialization protection
- A11y Menu Button core composition
- lifecycle events
- clean destruction

## Slice 2 — Responsive distribution

Status: implemented.

Deliverables:

- geometry-based fit probe
- ordered suffix migration
- ordered restoration
- disappearing-More final-item test
- ResizeObserver invalidation
- requestAnimationFrame batching
- root state / count synchronization

## Slice 3 — Focus continuity

Status: implemented.

Deliverables:

- focused primary item moving into hidden overflow
- focused overflow item returning to primary
- More trigger disappearing
- menu refresh after redistribution

## Slice 4 — Dynamic content boundary

Status: implemented.

Deliverables:

- explicit `refresh()`
- canonical item reconciliation
- observer target refresh
- structural replacement rejection

## Slice 5 — Demo and unit coverage

Status: implemented.

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

## Verification sequence

1. `npm run test`
2. `npm run typecheck`
3. `npm run build`
4. `npm run pack:check`
5. add and run real-browser geometry tests
6. manual assistive-technology and zoom validation
