# Performance review — v0.3

Date: 2026-09-22  
Scope: overflow redistribution, ResizeObserver scheduling, DOM movement, cleanup.

## Current runtime cost model

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

The current implementation repeatedly derives visible/overflow arrays from the canonical item list. In a pathological large navigation, repeated filtering during grow/shrink can trend toward quadratic work.

No optimization is applied in this slice because there is no measured bottleneck yet. Introducing index bookkeeping or cached widths would add state and invalidation complexity.

If the stress fixture exposes a material regression, the first optimization candidates are:

1. track the prefix boundary/index during one reflow transaction;
2. avoid rebuilding filtered arrays for each moved item;
3. batch geometry reads before writes where browser behavior permits without breaking Flex/Grid correctness.

## Stress fixture

`examples/stress/` contains a 24-item width sweep. It records browser-level observer signals and public plugin events without changing the runtime package API.

The fixture deliberately has no pass/fail timing threshold because hardware, browser, zoom, and font metrics vary.

## Review result

- No hidden polling, timers, network work, or persistence were introduced.
- Resize work is frame-coalesced.
- Pending frame work is cancelled on destroy.
- No new runtime dependency is required for performance diagnostics.
- No source optimization is justified without measured evidence.

Status: **implementation hardening complete; manual stress measurements pending.**
