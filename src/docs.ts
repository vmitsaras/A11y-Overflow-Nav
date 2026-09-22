export interface PluginDocs {
  slug: string;
  name: string;
  packageName: string;
  description: string;
  repo?: string;
  install: { npm: string; pnpm: string; yarn: string };
  usage: string;
  selectors?: string[];
  keyboard?: Array<{ key: string; description: string }>;
  api: Array<{ name: string; type: string; description: string }>;
  examples?: Array<{ name: string; description: string; path: string }>;
  options?: Array<{
    name: string;
    type: string;
    default: string;
    attribute?: string;
    description: string;
  }>;
  attributes?: Array<{
    name: string;
    authored: boolean;
    description: string;
  }>;
  events?: Array<{
    name: string;
    timing: string;
    reasons: string[];
    bubbles: boolean;
    composed: boolean;
    cancelable: boolean;
    detail: string;
  }>;
  lifecycle?: Array<{ stage: string; description: string }>;
  accessibility?: Array<{ topic: string; description: string }>;
  limitations?: string[];
}

const eventDetail =
  '{ instance, visibleItems, overflowItems, overflowCount, reason }';

export const docs = {
  slug: 'a11y-overflow-nav',
  name: 'A11y Overflow Nav',
  packageName: 'a11y-overflow-nav',
  description:
    'Priority+ navigation behavior that moves source-ordered items into an accessible More disclosure when the navigation no longer fits on one line.',
  repo: 'https://github.com/vmitsaras/A11y-Overflow-Nav',
  install: {
    npm: 'npm install a11y-overflow-nav a11y-menu-button',
    pnpm: 'pnpm add a11y-overflow-nav a11y-menu-button',
    yarn: 'yarn add a11y-overflow-nav a11y-menu-button',
  },
  usage: `import {
  createOverflowNav,
  OVERFLOW_NAV_EVENTS,
} from 'a11y-overflow-nav';

const root = document.querySelector('[data-a11y-overflow-nav]');

if (root instanceof HTMLElement) {
  for (const eventName of Object.values(OVERFLOW_NAV_EVENTS)) {
    root.addEventListener(eventName, (event) => {
      console.log(event.type, event.detail.reason, event.detail.overflowCount);
    });
  }

  const instance = createOverflowNav(root, {
    observeResize: true,
    fitTolerance: 1,
    menuButtonOptions: {},
  });

  // Call after application-driven item or label changes.
  instance.refresh();
  // Call during application teardown.
  // instance.destroy();
}`,
  selectors: [
    '[data-a11y-overflow-nav]',
    '[data-overflow-nav-list]',
    '[data-overflow-nav-item]',
    '[data-overflow-nav-control]',
    '[data-overflow-nav-menu]',
    '[data-overflow-nav-overflow-list]',
  ],
  options: [
    {
      name: 'observeResize',
      type: 'boolean',
      default: 'true',
      attribute: 'data-observe-resize',
      description:
        'Observes the list, overflow control, and managed items when ResizeObserver is available.',
    },
    {
      name: 'fitTolerance',
      type: 'number',
      default: '1',
      attribute: 'data-fit-tolerance',
      description:
        'Sets the nonnegative pixel tolerance used by geometry comparisons.',
    },
    {
      name: 'menuButtonOptions',
      type: 'A11yMenuButtonOptions',
      default: '{}',
      description: 'Passes options to a11y-menu-button/core.',
    },
  ],
  attributes: [
    {
      name: 'data-overflow-nav-ready',
      authored: false,
      description:
        'Set to true after initialization and restored to its authored state on destroy.',
    },
    {
      name: 'data-overflow-state',
      authored: false,
      description:
        'Reflects fit or overflow and is restored to its authored state on destroy.',
    },
    {
      name: 'data-overflow-count',
      authored: false,
      description:
        'Reflects the current number of overflow items and is restored on destroy.',
    },
  ],
  keyboard: [
    {
      key: 'Tab',
      description:
        'Uses native document tab order. Responsive redistribution preserves source order and manages focus when the active item moves.',
    },
    {
      key: 'Enter / Space',
      description:
        'The native More button delegates activation to A11y Menu Button.',
    },
    {
      key: 'Arrow keys, Home / End, Escape, typeahead',
      description:
        'Overflow-menu keyboard behavior is owned by A11y Menu Button; verify the dependency behavior for the installed version.',
    },
  ],
  api: [
    {
      name: 'A11yOverflowNav',
      type: 'class',
      description:
        'Controller class. Duplicate construction for the same live root returns its cached instance.',
    },
    {
      name: 'createOverflowNav(root, options)',
      type: '(root: HTMLElement, options?: A11yOverflowNavOptions) => A11yOverflowNav',
      description:
        'Explicitly initializes one overflow navigation and reuses an existing live instance.',
    },
    {
      name: 'initOverflowNavs(root, options)',
      type: '(root?: ParentNode, options?: A11yOverflowNavOptions) => A11yOverflowNav[]',
      description:
        'Initializes a matching root and matching descendants without auto-running on import.',
    },
    {
      name: 'visibleItems / overflowItems / overflowCount',
      type: 'readonly HTMLElement[] / readonly HTMLElement[] / number',
      description: 'Expose the current source-ordered distribution and count.',
    },
    {
      name: 'refresh()',
      type: '() => void',
      description:
        'Reconciles supported item changes, re-observes layout, reflows, preserves focus, and emits refresh.',
    },
    {
      name: 'destroy()',
      type: '() => void',
      description:
        'Emits destroy, disconnects observers, cancels scheduled work, restores source order and authored state, and releases the instance.',
    },
    {
      name: 'OVERFLOW_NAV_EVENTS',
      type: 'Readonly<{ init; change; refresh; destroy }>',
      description: 'Provides the four public lifecycle event names.',
    },
    {
      name: 'Public types',
      type: 'A11yOverflowNavInstance | A11yOverflowNavOptions | OverflowNavEventDetail | OverflowNavEventName | OverflowNavReason',
      description: 'TypeScript contracts exported from the package root.',
    },
  ],
  events: [
    {
      name: 'overflow-nav:init',
      timing: 'After initial reflow and resize-observer setup.',
      reasons: ['init'],
      bubbles: true,
      composed: false,
      cancelable: false,
      detail: eventDetail,
    },
    {
      name: 'overflow-nav:change',
      timing: 'Only when the visible or overflow node sequence changes.',
      reasons: ['init', 'resize', 'refresh'],
      bubbles: true,
      composed: false,
      cancelable: false,
      detail: eventDetail,
    },
    {
      name: 'overflow-nav:refresh',
      timing: 'After each successful refresh reconciliation and reflow.',
      reasons: ['refresh'],
      bubbles: true,
      composed: false,
      cancelable: false,
      detail: eventDetail,
    },
    {
      name: 'overflow-nav:destroy',
      timing: 'Before DOM, focus, attributes, and menu state are restored.',
      reasons: ['programmatic'],
      bubbles: true,
      composed: false,
      cancelable: false,
      detail: eventDetail,
    },
  ],
  lifecycle: [
    {
      stage: 'initialize',
      description:
        'Validate authored structure, initialize Menu Button, perform the first reflow, observe layout, and emit init. Attach event listeners first.',
    },
    {
      stage: 'redistribute',
      description:
        'Coalesce resize work in requestAnimationFrame and emit change only when item membership changes.',
    },
    {
      stage: 'refresh',
      description:
        'Reconcile primary-list item changes. Structural-node replacement and new items inserted directly into overflow are rejected.',
    },
    {
      stage: 'destroy',
      description:
        'Emit the pre-restoration snapshot, then restore source order and authored state and release the cached instance.',
    },
    {
      stage: 'reinitialize',
      description: 'Create a fresh instance after destroy.',
    },
  ],
  accessibility: [
    {
      topic: 'Semantics',
      description:
        'Consumers author the named navigation landmark, lists, links, native More button, and controlled panel.',
    },
    {
      topic: 'Focus',
      description:
        'Focus moves to More before a focused item enters a closed panel and is restored to a suitable connected destination when items return or the control disappears.',
    },
    {
      topic: 'Keyboard and ARIA',
      description:
        'Menu interaction and ARIA state are delegated to a11y-menu-button/core; overflow-nav adds no keyboard handlers of its own.',
    },
    {
      topic: 'Progressive enhancement',
      description:
        'All destinations start in the primary list and the More control starts hidden, leaving a usable no-JavaScript fallback.',
    },
    {
      topic: 'Announcements and testing',
      description:
        'The core emits events but creates no live announcements. Consumers should test their integration with target browsers and assistive technologies.',
    },
  ],
  examples: [
    {
      name: 'Basic',
      description: 'Minimal semantic Priority+ navigation.',
      path: 'examples/basic',
    },
    {
      name: 'Scenario lab',
      description: 'Interactive layout and lifecycle scenarios.',
      path: 'index.html',
    },
    {
      name: 'Performance stress fixture',
      description:
        'Developer-only 24-item width sweep that records observer signals, distribution changes, estimated DOM moves, and elapsed time without adding runtime instrumentation to the package.',
      path: 'examples/stress',
    },
  ],
  limitations: [
    'No nested or mega-menu redistribution.',
    'No numeric priorities, viewport breakpoints, cloned trees, generated markup, or automatic initialization.',
    'No MutationObserver; application-driven changes require refresh().',
    'refresh() cannot replace structural list, control, menu, or overflow-list nodes.',
    'Geometry-sensitive behavior requires real-browser verification.',
    'The package ships no runtime layout CSS or animation.',
  ],
} satisfies PluginDocs;
