# A11y Overflow Nav

A TypeScript-first Priority+ navigation controller.

When the primary navigation no longer fits on one line, the plugin moves the original source-ordered navigation item nodes into a **More** disclosure. When space returns, those same nodes move back. Disclosure interaction is delegated to the published `a11y-menu-button` package.

## Architecture

- HTML owns navigation semantics, labels, URLs, and current-page state.
- CSS owns visual layout.
- A11y Overflow Nav owns fit detection, redistribution, focus continuity, resize observation, refresh, and restoration.
- A11y Menu Button owns the More trigger, expanded state, keyboard behavior, Escape, focus-out handling, and panel placement.

The plugin does not clone navigation links and does not use viewport breakpoints.

## Installation

~~~bash
npm install a11y-overflow-nav a11y-menu-button
~~~

## Usage

~~~ts
import { createOverflowNav } from 'a11y-overflow-nav';

const root = document.querySelector('[data-a11y-overflow-nav]');

if (root instanceof HTMLElement) {
  createOverflowNav(root);
}
~~~

A11y Overflow Nav itself ships no runtime CSS.

## Required HTML

All managed destinations begin in the primary list. The overflow list starts empty and the More control starts with `hidden`, so navigation remains available when JavaScript does not run.

~~~html
<nav data-a11y-overflow-nav aria-label="Primary">
  <ul data-overflow-nav-list>
    <li data-overflow-nav-item><a href="/articles">Articles</a></li>
    <li data-overflow-nav-item><a href="/books">Books</a></li>
    <li data-overflow-nav-item><a href="/events">Events</a></li>

    <li data-overflow-nav-control hidden>
      <div data-overflow-nav-menu>
        <button type="button" aria-controls="overflow-panel">More</button>
        <div id="overflow-panel" hidden>
          <ul data-overflow-nav-overflow-list></ul>
        </div>
      </div>
    </li>
  </ul>
</nav>
~~~

The overflow control must be the final direct child of the primary list.

## Layout contract

The plugin reads the browser's resulting geometry rather than calculating Flex or Grid tracks itself. It targets horizontal one-line navigation and supports normal modern layout approaches such as Flex, wrapping Flex, single-row/auto-flow Grid, gaps, fluid spacing, variable labels, container-based layouts, and RTL.

Do not use CSS `order` to create a visual priority that differs from source order. Avoid `display: contents` on managed top-level items because they need measurable boxes.

## Source-order invariant

For `A B C D E`, every stable state is an ordered primary prefix plus an ordered overflow suffix. The plugin never clones nodes and never produces arbitrary priority selections.

## Options

~~~ts
interface A11yOverflowNavOptions {
  observeResize?: boolean;
  fitTolerance?: number;
  menuButtonOptions?: A11yMenuButtonOptions;
}
~~~

HTML may also provide `data-observe-resize` and `data-fit-tolerance`.

## API

~~~ts
const instance = createOverflowNav(root);

instance.visibleItems;
instance.overflowItems;
instance.overflowCount;
instance.refresh();
instance.destroy();
~~~

`refresh()` is the v1 boundary for application-driven structural changes. MutationObserver automation is intentionally deferred.

## Events

Bubbling lifecycle events:

- `overflow-nav:init`
- `overflow-nav:change`
- `overflow-nav:refresh`
- `overflow-nav:destroy`

A11y Menu Button continues to emit its own `menu-button:*` lifecycle events.

## Focus behavior

If a focused primary destination moves into a closed overflow panel, focus moves to More first. If a focused overflow destination returns, the original node is retained and focus is restored where possible. If More disappears, focus moves to the restored destination.

## Progressive enhancement

With JavaScript disabled, all navigation destinations remain in the primary list and More stays hidden. Consuming CSS should provide a readable fallback such as wrapping.

## Limitations

v1 deliberately excludes nested/mega-menu redistribution, numeric priorities, viewport breakpoints, cloned navigation trees, MutationObserver automation, animation, generated markup, and arbitrary CSS visual reordering.

## Verification

~~~bash
npm run test
npm run typecheck
npm run build
npm run pack:check
~~~

Real-browser geometry and assistive-technology verification remain separate from DOM unit tests.

## License

MIT © 2026 Vasileios Mitsaras.
