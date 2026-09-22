# A11y Overflow Nav

A TypeScript-first Priority+ navigation controller. When the primary navigation no longer fits on one line, it moves the original source-ordered items into a **More** disclosure and restores those same nodes when space returns. Disclosure interaction is delegated to `a11y-menu-button`.

## Architecture

- HTML owns navigation semantics, labels, URLs, and current-page state.
- CSS owns visual layout; this package ships no runtime CSS.
- A11y Overflow Nav owns fit detection, redistribution, focus continuity, resize observation, refresh, and restoration.
- A11y Menu Button owns the More trigger, expanded state, menu keyboard behavior, Escape, focus-out handling, and panel placement.

The plugin does not clone links, use viewport breakpoints, observe DOM mutations, or initialize automatically on import.

## Installation

~~~bash
npm install a11y-overflow-nav a11y-menu-button
pnpm add a11y-overflow-nav a11y-menu-button
yarn add a11y-overflow-nav a11y-menu-button
~~~

## Required HTML

All managed destinations begin in the primary list. The overflow list starts empty and the final overflow control starts with `hidden`, preserving access to every link when JavaScript does not run.

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

The primary list and overflow control must be direct parent/child elements as shown, and the control must be the primary list's final child.

## Detailed initialization

Register lifecycle listeners before creating the instance. Initialization is synchronous, so a listener attached afterward misses `overflow-nav:init` and any initial `overflow-nav:change`.

~~~ts
import {
  createOverflowNav,
  OVERFLOW_NAV_EVENTS,
  type OverflowNavEventDetail,
} from 'a11y-overflow-nav';

const root = document.querySelector('[data-a11y-overflow-nav]');

if (root instanceof HTMLElement) {
  const onLifecycle = (event: Event) => {
    const { detail } = event as CustomEvent<OverflowNavEventDetail>;
    console.log(event.type, detail.reason, detail.overflowCount);
  };

  for (const eventName of Object.values(OVERFLOW_NAV_EVENTS)) {
    root.addEventListener(eventName, onLifecycle);
  }

  const overflowNav = createOverflowNav(root, {
    observeResize: true,
    fitTolerance: 1,
    menuButtonOptions: {},
  });

  console.log(overflowNav.visibleItems, overflowNav.overflowItems);
  overflowNav.refresh(); // After application-driven item or label changes.

  // During application teardown:
  // overflowNav.destroy();
  // for (const eventName of Object.values(OVERFLOW_NAV_EVENTS)) {
  //   root.removeEventListener(eventName, onLifecycle);
  // }
}
~~~

Calling `createOverflowNav()` again for the same live root returns the existing instance; later options are not applied. Destroy the current instance before intentionally reinitializing with new options.

## Options

| Option | Type | Default | HTML equivalent | Behavior |
| --- | --- | --- | --- | --- |
| `observeResize` | `boolean` | `true` | `data-observe-resize="true|false"` | Observes the list, control, and managed items when `ResizeObserver` is available. |
| `fitTolerance` | `number` | `1` | `data-fit-tolerance="number"` | Nonnegative pixel tolerance used by geometry comparisons. |
| `menuButtonOptions` | `A11yMenuButtonOptions` | `{}` | None | Passed to `a11y-menu-button/core`. |

Programmatic values take precedence over dataset values. Invalid dataset values fall back to defaults.

## Public API

### Runtime values

- `A11yOverflowNav` — class implementing the controller.
- `createOverflowNav(root, options?)` — initializes one root or returns its existing live instance.
- `initOverflowNavs(root = document, options?)` — explicitly initializes a matching root and matching descendants.
- `OVERFLOW_NAV_EVENTS` — frozen event-name map for `init`, `change`, `refresh`, and `destroy`.

### Instance surface

- `root`, `list`, `overflowControl`, `overflowList` — readonly structural elements.
- `visibleItems`, `overflowItems` — readonly item arrays in canonical source order.
- `overflowCount` — current number of overflow items.
- `refresh()` — reconciles supported application-driven item changes and recalculates layout.
- `destroy()` — disconnects observation, cancels scheduled layout, restores authored state and source order, destroys the owned menu button, and releases the cached instance.

### Exported types

`A11yOverflowNavInstance`, `A11yOverflowNavOptions`, `OverflowNavEventDetail`, `OverflowNavEventName`, and `OverflowNavReason` are exported from the package root.

## Lifecycle

1. **Initialize:** validates authored structure, creates the Menu Button instance, marks the root ready, performs the first reflow, starts resize observation, and emits `overflow-nav:init`.
2. **Redistribute:** resize work is coalesced through `requestAnimationFrame`; `overflow-nav:change` fires only when visible or overflow membership changes.
3. **Refresh:** call `refresh()` after adding, removing, or relabeling managed items. Add new items to the primary list. Replacing structural list/control/menu nodes or inserting a new managed item directly into overflow is rejected.
4. **Destroy:** emits `overflow-nav:destroy` before restoration, then restores canonical item order, original runtime attributes, control visibility, observers, scheduled work, and Menu Button state. Repeated calls are safe no-ops.
5. **Reinitialize:** after destruction, `createOverflowNav()` creates a fresh instance.

## Events

All events bubble, are non-cancelable, and use `composed: false`, so they do not cross a shadow boundary.

| Event | Timing | Reason |
| --- | --- | --- |
| `overflow-nav:init` | After the initial reflow and observation setup. | `init` |
| `overflow-nav:change` | Only when the visible/overflow node sequence changes. | `init`, `resize`, or `refresh` |
| `overflow-nav:refresh` | After every successful `refresh()` reconciliation and reflow. | `refresh` |
| `overflow-nav:destroy` | Before items, attributes, focus, and Menu Button state are restored. | `programmatic` |

Every event has the same detail shape:

~~~ts
interface OverflowNavEventDetail {
  instance: A11yOverflowNav;
  visibleItems: readonly HTMLElement[];
  overflowItems: readonly HTMLElement[];
  overflowCount: number;
  reason: 'init' | 'resize' | 'refresh' | 'programmatic';
}
~~~

An initial redistribution can emit `change` with reason `init` before `init`. A refresh that changes distribution emits `change` with reason `refresh` before the unconditional `refresh` event. Destroy detail describes the pre-restoration distribution. A11y Menu Button emits its own `menu-button:*` events separately.

## Selectors and state attributes

Authored hooks:

- `[data-a11y-overflow-nav]`
- `[data-overflow-nav-list]`
- `[data-overflow-nav-item]`
- `[data-overflow-nav-control]`
- `[data-overflow-nav-menu]`
- `[data-overflow-nav-overflow-list]`

Runtime state on the root:

- `data-overflow-nav-ready="true"`
- `data-overflow-state="fit|overflow"`
- `data-overflow-count="0|…"`

The plugin restores any authored values for these attributes during `destroy()`.

## Layout contract and source order

The plugin reads rendered geometry rather than calculating Flex or Grid tracks. It targets horizontal one-line navigation and supports Flex, wrapping Flex, single-row/auto-flow Grid, gaps, fluid spacing, variable labels, container-based layouts, and RTL.

For `A B C D E`, every stable state is an ordered primary prefix plus an ordered overflow suffix. Do not use CSS `order` to contradict source order, and avoid `display: contents` on managed top-level items because they need measurable boxes.

## Accessibility and keyboard behavior

- Author a named `nav`, semantic lists, links, and a native More button.
- The plugin moves original nodes rather than cloning destinations, preserving identity and source order.
- If a focused item moves into a closed overflow panel, focus moves to More. When items return or the control disappears, focus is restored to a suitable connected destination where possible.
- `refresh()` preserves the active connected element where possible; destroying while focus is within the overflow control moves focus to the final restored destination.
- Tab order remains native. More activation and menu navigation are delegated to A11y Menu Button, including its supported arrow-key, Home/End, Escape, and typeahead behavior.
- The core plugin does not create live announcements. Any status announcement in the examples is consumer-authored.
- With JavaScript disabled, all destinations remain in the primary list and More remains hidden. Consumer CSS should provide a readable wrapping fallback.

The package is designed to support accessible navigation, but integration details still require testing with target browsers and assistive technologies.

## Examples

The root `index.html` is a scenario lab for layout, direction, text scaling, focus, and lifecycle events. A smaller copy-friendly example is in [`examples/basic/`](examples/basic/).

~~~bash
npm install
npm run build
npx serve .
~~~

## Structured docs metadata

~~~ts
import { docs } from 'a11y-overflow-nav/docs';
~~~

The export contains structured install, usage, selector, option, event, lifecycle, accessibility, API, example, and limitation metadata for documentation sites.

## Limitations

v1 excludes nested or mega-menu redistribution, numeric priorities, viewport breakpoints, cloned navigation trees, MutationObserver automation, animation, generated markup, structural-node replacement during refresh, and arbitrary CSS visual reordering.

## Verification

~~~bash
npm run test
npm run typecheck
npm run build
npm run pack:check
~~~

Real-browser geometry, keyboard, focus, zoom, and assistive-technology verification remain separate from DOM unit tests.

## License

MIT © 2026 Vasileios Mitsaras.
