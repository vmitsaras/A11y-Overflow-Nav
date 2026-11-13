# Performance stress fixture

This developer-only fixture exercises A11y Overflow Nav with 24 top-level items.
Its fictional nature-reserve destinations include trails, habitats, tide pools,
and a visitor centre. Use a fresh measurement baseline when comparing this
content with earlier fixture revisions: label widths affect redistribution.

## Run

From the repository root:

~~~bash
npm install
npm run build
npx serve .
~~~

Open `examples/stress/index.html`.

For integration guidance, start with the [basic example](../basic/index.html)
and its [consumer-owned stylesheet](../basic/styles.css). Use the
[scenario lab](../../index.html) to explore layout, localization, focus, and
lifecycle behavior. This fixture is for developer measurements.

## What it records

A width sweep changes only the component width and records:

- total elapsed sweep time;
- number of width steps;
- minimum and maximum measured container widths (including padding/border);
- `overflow-nav:change` events;
- callbacks and entries from a mirrored diagnostic `ResizeObserver`;
- estimated item moves from overflow-count deltas;
- maximum and final overflow count.

The mirrored observer is part of the fixture, not the plugin.

Run, Reset, and the manual width control are disabled while a sweep or reset is active so concurrent controls cannot change the measurement. Failures are reported in the summary, invalidate the displayed result, and restore the controls for another attempt.

Controls remain disabled until initialization succeeds. Changing the maximum
width manually clears the previous sweep result. Reset restores the requested
width to 900px and clears results. A keyboard-triggered operation restores focus
to its button if disabling it left focus on the document body.
The More disclosure stays within the navigation row's width and scrolls within
its available height, including when only one destination fits beside More.

## How to use the result

Use the fixture for **before/after comparisons on the same browser, device, and window size**. Do not treat a single elapsed-time number as a universal performance threshold.

Each run settles at a requested 1200px width before timing the 21-step sweep.
The requested width is capped by available space; a narrow window may produce
one measured width and no item moves throughout the sweep.

Elapsed time includes three animation-frame waits per step, diagnostic work,
and browser scheduling; it does not isolate plugin execution time. The third
frame lets the plugin's ResizeObserver-scheduled layout finish before sampling.
Establish a fresh baseline for this fixture revision; earlier two-frame runs
could sample stale overflow counts and have a different waiting overhead.

If a future change produces a material regression, inspect the resize-scheduling path and repeated fit probes before adding caching or more complex state.
