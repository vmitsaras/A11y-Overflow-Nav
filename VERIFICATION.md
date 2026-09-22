# Verification — v0.1 Core Priority+ Engine

Date: 2026-09-22  
Implementation head: `2e731035d35977abd6daadd8fe8419d3a2eb9fbd`  
GitHub Actions run: `35741120544`

## Summary

The v0.1 implementation passed its package-level automated gates after one implementation regression was found and fixed.

The earlier automated run exposed an ordering defect in `refresh()`: a newly inserted primary item could be reordered behind the previous canonical items. The refresh reconciliation was changed to capture current primary DOM order before restoring the canonical sequence. The regression test then passed.

This verification does **not** claim real-browser Flex/Grid geometry, zoom, or assistive-technology compatibility. Those checks remain scheduled in the roadmap.

## Automated gates

| Check | Status | Evidence |
| --- | --- | --- |
| Dependency installation | Pass | GitHub Actions run 35741120544 |
| Unit/lifecycle tests | Pass | `npm run test` |
| TypeScript integrity | Pass | `npm run typecheck` |
| Package build | Pass | `npm run build` |
| Package contents | Pass | `npm run pack:check` |

## Covered behavior

The current unit suite covers:

- initialization against valid semantic markup;
- all-items-fit state;
- duplicate initialization reuse;
- progressive-enhancement requirement that More starts hidden;
- bubbling init/destroy lifecycle events;
- explicit refresh after an application inserts a new primary item;
- exact source-order restoration on destroy;
- destroy/reinitialize safety.

## Failure found and resolved

### V-01 — Refresh order reconciliation

**Observed:** The first CI test run on Node 24 failed the dynamic-item refresh test. The newly added `Membership` item was no longer the last primary item after refresh.

**Cause:** The old implementation restored the previous canonical item array before capturing the application's new primary-list order.

**Resolution:** `refresh()` now validates stable structural nodes, captures direct primary items in their current DOM order, retains connected canonical overflow items, builds the next canonical sequence, and only then restores/reflows.

**Result:** The follow-up CI run passed test, typecheck, build, and package checks.

## Remaining limitations

Not yet verified:

- actual Flex nowrap, Flex wrap, and Grid geometry in Chromium/Firefox/WebKit;
- fractional-width threshold behavior;
- repeated grow/shrink oscillation resistance in a real layout engine;
- live focus behavior during responsive redistribution;
- 200–400% browser zoom and text-only resize;
- forced-colors behavior;
- VoiceOver/Safari;
- NVDA/browser combinations.

## Final status

**Package-level verification complete. Real-browser and manual accessibility verification pending.**
