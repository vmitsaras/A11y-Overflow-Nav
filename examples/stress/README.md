# Performance stress fixture

This developer-only fixture exercises A11y Overflow Nav with 24 top-level items.

## Run

From the repository root:

~~~bash
npm install
npm run build
npx serve .
~~~

Open `examples/stress/index.html`.

## What it records

A width sweep changes only the component width and records:

- total elapsed sweep time;
- number of width steps;
- `overflow-nav:change` events;
- callbacks and entries from a mirrored diagnostic `ResizeObserver`;
- estimated item moves from overflow-count deltas;
- maximum and final overflow count.

The mirrored observer is part of the fixture, not the plugin.

## How to use the result

Use the fixture for **before/after comparisons on the same browser and device**. Do not treat a single elapsed-time number as a universal performance threshold.

If a future change produces a material regression, inspect the resize-scheduling path and repeated fit probes before adding caching or more complex state.
