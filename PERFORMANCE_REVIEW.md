# Performance review — v0.3

Date: 2026-09-22  
Scope: overflow redistribution, ResizeObserver scheduling, DOM movement, cleanup.

## Measurement validity — reconciled 2026-11-12

This is a **historical 2026-09-22 source review and fixture measurement** for the v0.3 planning milestone, not an npm version or a fresh performance qualification. The recorded numbers below are preserved, but are not a baseline for the current fixture.

The [2026-11-03 fixture correction](VERIFICATION.md#stress-fixture-product-polish--2026-11-03) changed sampling from two to three animation-frame waits and settled each run at a requested 1200px before timing/counters. The [2026-11-12 content change](VERIFICATION.md#original-example-navigation-content--2026-11-12) changed label widths and distribution counts. Elapsed sweep time includes frame waits, diagnostic work, and scheduling; it does not isolate plugin CPU time. Counts and timings across these revisions are not directly comparable.

Use the [current fixture guide](examples/stress/README.md#how-to-use-the-result) and a fresh baseline with the same fixture revision, browser, device, and window size. Neither the newer demo checks nor the historical values establish a runtime speed improvement or justify an optimization by themselves. Referenced artifacts follow the [local evidence delivery policy](VERIFICATION.md#evidence-delivery).

## Runtime cost model reviewed on 2026-09-22

The plugin uses one `ResizeObserver` instance per initialized navigation when observation is enabled. It observes:

- the primary list;
- the overflow control;
- each managed navigation item.

Resize callbacks do not mutate layout directly. They call `scheduleLayout('resize')`, which keeps at most one pending `requestAnimationFrame`. Additional observer signals before that frame are coalesced.

The v0.3 regression tests now cover that coalescing behavior and cancellation of pending animation-frame work during `destroy()`.

## Reflow work

A reflow:

1. tries to restore overflow items while they fit;
2. moves primary items into overflow until the one-line fit contract is satisfied;
3. synchronizes root state;
4. refreshes the owned Menu Button only when the overflow control remains visible.

Each fit probe reads browser geometry. Moving one item can require another probe, so a deliberately huge navigation can perform several reads and node moves in one transaction.

For normal site navigation, the expected item count is small. The implementation therefore favors correctness and layout independence over a width-cache abstraction.

## Complexity note

The reviewed implementation repeatedly derives visible/overflow arrays from the canonical item list. In a pathological large navigation, repeated filtering during grow/shrink can trend toward quadratic work.

No optimization is applied in this slice because there is no measured bottleneck yet. Introducing index bookkeeping or cached widths would add state and invalidation complexity.

If the stress fixture exposes a material regression, the first optimization candidates are:

1. track the prefix boundary/index during one reflow transaction;
2. avoid rebuilding filtered arrays for each moved item;
3. batch geometry reads before writes where browser behavior permits without breaking Flex/Grid correctness.

## Stress fixture

`examples/stress/` contains a 24-item width sweep. It records browser-level observer signals and public plugin events without changing the runtime package API.

The fixture deliberately has no pass/fail timing threshold because hardware, browser, zoom, and font metrics vary.

Historical fixture run recorded on 2026-09-22 (not comparable to the revised fixture):

- environment: `examples/stress/index.html` served locally in HeadlessChrome 153.0.0.0 on macOS (`MacIntel`);
- viewport: 756 x 469, device pixel ratio 1;
- elapsed: 674.2 ms across 21 width steps;
- `overflow-nav:change` events: 8;
- mirrored `ResizeObserver` callbacks / entries: 16 / 20;
- estimated item moves: 8;
- maximum overflow: 22;
- final overflow: 18.

## Review result

- No hidden polling, timers, network work, or persistence were introduced.
- Resize work is frame-coalesced.
- Pending frame work is cancelled on destroy.
- No new runtime dependency is required for performance diagnostics.
- No source optimization is justified by the recorded fixture result.

Historical review status: **implementation hardening complete for the reviewed slice; stress measurements recorded; no source optimization justified by that result.** This does not close the current release-qualification checks.
