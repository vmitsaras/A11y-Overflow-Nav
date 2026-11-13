import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createOverflowNav,
  initOverflowNavs,
  OVERFLOW_NAV_EVENTS,
  type OverflowNavEventDetail,
} from '../src/index.js';

function createFixture(
  labels = ['Articles', 'Books', 'Events'],
): HTMLElement {
  const root = document.createElement('nav');
  root.setAttribute('data-a11y-overflow-nav', '');
  root.setAttribute('aria-label', 'Primary');

  const items = labels
    .map(
      (label) =>
        '<li data-overflow-nav-item><a href="#' +
        label.toLowerCase() +
        '">' +
        label +
        '</a></li>',
    )
    .join('');

  root.innerHTML =
    '<ul data-overflow-nav-list>' +
    items +
    '<li data-overflow-nav-control hidden>' +
    '<div data-overflow-nav-menu>' +
    '<button type="button" aria-controls="overflow-panel">More</button>' +
    '<div id="overflow-panel" hidden>' +
    '<ul data-overflow-nav-overflow-list></ul>' +
    '</div>' +
    '</div>' +
    '</li>' +
    '</ul>';

  document.body.append(root);
  return root;
}

function mockCapacity(root: HTMLElement, width: number): { width: number } {
  const capacity = { width };
  const list = root.querySelector('[data-overflow-nav-list]');
  if (!(list instanceof HTMLElement)) throw new Error('missing list');
  Object.defineProperties(list, {
    clientWidth: { configurable: true, get: () => capacity.width },
    scrollWidth: {
      configurable: true,
      get: () => Array.from(list.children).reduce((total, child) => {
        if (!(child instanceof HTMLElement) || child.hidden) return total;
        return total + (child.hasAttribute('data-overflow-nav-item') ? 80 : 40);
      }, 0),
    },
  });
  return capacity;
}

const originalResizeObserver = Reflect.get(window, 'ResizeObserver');

class FakeResizeObserver {
  public static instances: FakeResizeObserver[] = [];

  public readonly observed = new Set<Element>();
  private readonly callback: ResizeObserverCallback;

  public constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    FakeResizeObserver.instances.push(this);
  }

  public observe(target: Element): void {
    this.observed.add(target);
  }

  public unobserve(target: Element): void {
    this.observed.delete(target);
  }

  public disconnect(): void {
    this.observed.clear();
  }

  public trigger(): void {
    this.callback([], this as unknown as ResizeObserver);
  }
}

afterEach(() => {
  vi.restoreAllMocks();
  Object.defineProperty(window, 'ResizeObserver', {
    configurable: true,
    writable: true,
    value: originalResizeObserver,
  });
  FakeResizeObserver.instances = [];
  document.body.replaceChildren();
});

describe('A11yOverflowNav', () => {
  it('initializes semantic markup when geometry fits', () => {
    const root = createFixture();
    const instance = createOverflowNav(root, {
      observeResize: false,
    });

    expect(instance.visibleItems).toHaveLength(3);
    expect(instance.overflowItems).toHaveLength(0);
    expect(instance.overflowCount).toBe(0);
    expect(root.getAttribute('data-overflow-state')).toBe('fit');
    expect(root.getAttribute('data-overflow-count')).toBe('0');
    expect(instance.overflowControl.hidden).toBe(true);
  });

  it('reuses the existing instance for duplicate initialization', () => {
    const root = createFixture();
    const first = createOverflowNav(root, { observeResize: false });
    const second = createOverflowNav(root, { observeResize: false });

    expect(second).toBe(first);
  });

  it('rolls back owned menu state when layout observation setup fails', () => {
    class FailingResizeObserver {
      public constructor() {
        throw new Error('ResizeObserver setup failed');
      }
    }

    Object.defineProperty(window, 'ResizeObserver', {
      configurable: true,
      writable: true,
      value: FailingResizeObserver,
    });

    const root = createFixture();
    const trigger = root.querySelector('button');
    const panel = root.querySelector('#overflow-panel');

    expect(() => createOverflowNav(root)).toThrow('ResizeObserver setup failed');
    expect(root.hasAttribute('data-overflow-nav-ready')).toBe(false);
    expect(root.hasAttribute('data-overflow-state')).toBe(false);
    expect(root.hasAttribute('data-overflow-count')).toBe(false);
    expect(root.querySelector('[data-overflow-nav-control]')?.hasAttribute('hidden')).toBe(true);
    expect(trigger?.hasAttribute('aria-expanded')).toBe(false);
    expect(trigger?.getAttribute('aria-controls')).toBe('overflow-panel');
    expect(panel?.hasAttribute('hidden')).toBe(true);
  });

  it('requires the overflow control to be authored hidden', () => {
    const root = createFixture();
    const control = root.querySelector('[data-overflow-nav-control]');
    if (!(control instanceof HTMLElement)) throw new Error('missing control');
    control.hidden = false;

    expect(() =>
      createOverflowNav(root, { observeResize: false }),
    ).toThrow(/hidden attribute/);
  });

  it('dispatches bubbling lifecycle events', () => {
    const root = createFixture();
    const list = root.querySelector('[data-overflow-nav-list]');
    if (!(list instanceof HTMLElement)) throw new Error('missing list');
    Object.defineProperties(list, {
      clientWidth: { configurable: true, value: 200 },
      scrollWidth: { configurable: true, value: 500 },
    });

    const ancestor = document.createElement('div');
    ancestor.append(root);
    document.body.append(ancestor);
    const seen: Array<{
      type: string;
      event: CustomEvent<OverflowNavEventDetail>;
    }> = [];
    const onLifecycle = (event: Event) => {
      seen.push({
        type: event.type,
        event: event as CustomEvent<OverflowNavEventDetail>,
      });
    };

    for (const eventName of Object.values(OVERFLOW_NAV_EVENTS)) {
      ancestor.addEventListener(eventName, onLifecycle);
    }

    const instance = createOverflowNav(root, {
      observeResize: false,
    });
    expect(seen.map(({ type }) => type)).toEqual([
      OVERFLOW_NAV_EVENTS.change,
      OVERFLOW_NAV_EVENTS.init,
    ]);
    const initialChange = seen[0]?.event;
    expect(initialChange?.target).toBe(root);
    expect(initialChange?.bubbles).toBe(true);
    expect(initialChange?.composed).toBe(false);
    expect(initialChange?.cancelable).toBe(false);
    expect(initialChange?.detail).toMatchObject({
      instance,
      overflowCount: 3,
      reason: 'init',
    });
    expect(initialChange?.detail.visibleItems).toEqual([]);
    expect(initialChange?.detail.overflowItems).toEqual(instance.overflowItems);

    Object.defineProperty(list, 'scrollWidth', {
      configurable: true,
      value: 200,
    });
    instance.refresh();
    expect(seen.map(({ type }) => type)).toEqual([
      OVERFLOW_NAV_EVENTS.change,
      OVERFLOW_NAV_EVENTS.init,
      OVERFLOW_NAV_EVENTS.change,
      OVERFLOW_NAV_EVENTS.refresh,
    ]);
    expect(seen[2]?.event.detail.reason).toBe('refresh');
    expect(seen[3]?.event.detail.reason).toBe('refresh');

    Object.defineProperty(list, 'scrollWidth', {
      configurable: true,
      value: 500,
    });
    instance.refresh();
    expect(seen.slice(-2).map(({ type }) => type)).toEqual([
      OVERFLOW_NAV_EVENTS.change,
      OVERFLOW_NAV_EVENTS.refresh,
    ]);

    instance.refresh();
    expect(seen.at(-1)?.type).toBe(OVERFLOW_NAV_EVENTS.refresh);
    expect(seen).toHaveLength(7);

    instance.destroy();
    const destroyEvent = seen.at(-1)?.event;
    expect(seen.at(-1)?.type).toBe(OVERFLOW_NAV_EVENTS.destroy);
    expect(destroyEvent?.detail.overflowCount).toBe(3);
    expect(destroyEvent?.detail.visibleItems).toEqual([]);
    expect(destroyEvent?.detail.overflowItems).toHaveLength(3);

    instance.destroy();
    expect(seen.at(-1)?.type).toBe(OVERFLOW_NAV_EVENTS.destroy);
    expect(seen).toHaveLength(8);
    expect(Object.isFrozen(OVERFLOW_NAV_EVENTS)).toBe(true);

    for (const eventName of Object.values(OVERFLOW_NAV_EVENTS)) {
      ancestor.removeEventListener(eventName, onLifecycle);
    }
  });

  it('refreshes the canonical item set after an item is added', () => {
    const root = createFixture();
    const instance = createOverflowNav(root, {
      observeResize: false,
    });
    const item = document.createElement('li');
    item.setAttribute('data-overflow-nav-item', '');
    item.innerHTML = '<a href="#membership">Membership</a>';
    instance.list.insertBefore(item, instance.overflowControl);

    instance.refresh();

    expect(instance.visibleItems).toHaveLength(4);
    expect(instance.visibleItems.at(-1)).toBe(item);
  });

  it('treats different-height same-row items as fitting', () => {
    const root = createFixture();
    const instance = createOverflowNav(root, {
      observeResize: false,
    });
    const firstItem = instance.visibleItems[0];

    if (!firstItem) throw new Error('missing item');

    Object.defineProperties(instance.list, {
      clientWidth: {
        configurable: true,
        value: 200,
      },
      scrollWidth: {
        configurable: true,
        value: 200,
      },
    });

    vi.spyOn(instance.list, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      right: 200,
      top: 0,
      bottom: 48,
      width: 200,
      height: 48,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    vi.spyOn(firstItem, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      right: 80,
      top: 2,
      bottom: 42,
      width: 80,
      height: 40,
      x: 0,
      y: 2,
      toJSON: () => ({}),
    });

    vi.spyOn(instance.overflowControl, 'getBoundingClientRect').mockReturnValue({
      left: 88,
      right: 160,
      top: 0,
      bottom: 46,
      width: 72,
      height: 46,
      x: 88,
      y: 0,
      toJSON: () => ({}),
    });

    instance.overflowControl.hidden = false;
    instance.visibleItems.slice(1).forEach((item) => {
      instance.overflowList.append(item);
    });

    const fits = Reflect.get(instance, 'fits').bind(instance);

    expect(fits()).toBe(true);
  });

  it('restores original order and control visibility on destroy', () => {
    const root = createFixture([
      'Articles',
      'Books',
      'Events',
      'Membership',
    ]);
    const instance = createOverflowNav(root, {
      observeResize: false,
    });
    const originalItems = [...instance.visibleItems];
    const lastItem = originalItems.at(-1);
    if (!lastItem) throw new Error('missing item');

    instance.overflowControl.hidden = false;
    instance.overflowList.append(lastItem);
    instance.destroy();

    const restored = Array.from(instance.list.children).filter(
      (element): element is HTMLElement =>
        element instanceof HTMLElement &&
        element.hasAttribute('data-overflow-nav-item'),
    );

    expect(restored).toEqual(originalItems);
    expect(instance.overflowControl.hidden).toBe(true);
    expect(root.hasAttribute('data-overflow-state')).toBe(false);
    expect(root.hasAttribute('data-overflow-count')).toBe(false);
    expect(root.hasAttribute('data-overflow-nav-ready')).toBe(false);
  });

  it('coalesces repeated resize observer signals into one animation frame', () => {
    Object.defineProperty(window, 'ResizeObserver', {
      configurable: true,
      writable: true,
      value: FakeResizeObserver,
    });

    const callbacks: FrameRequestCallback[] = [];
    const raf = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback) => {
        callbacks.push(callback);
        return callbacks.length;
      });

    const root = createFixture();
    const instance = createOverflowNav(root);

    const observer = FakeResizeObserver.instances[0];
    expect(observer).toBeDefined();
    expect(observer?.observed.size).toBe(5);

    observer?.trigger();
    observer?.trigger();
    observer?.trigger();

    expect(raf).toHaveBeenCalledTimes(1);

    callbacks[0]?.(16);
    instance.destroy();
  });

  it('cancels pending resize work during destroy', () => {
    Object.defineProperty(window, 'ResizeObserver', {
      configurable: true,
      writable: true,
      value: FakeResizeObserver,
    });

    const raf = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation(() => 37);
    const cancel = vi
      .spyOn(window, 'cancelAnimationFrame')
      .mockImplementation(() => undefined);

    const root = createFixture();
    const instance = createOverflowNav(root);
    const observer = FakeResizeObserver.instances[0];

    observer?.trigger();
    expect(raf).toHaveBeenCalledTimes(1);

    instance.destroy();

    expect(cancel).toHaveBeenCalledWith(37);
    expect(observer?.observed.size).toBe(0);
  });

  it('can be destroyed and initialized again safely', () => {
    const root = createFixture();
    const first = createOverflowNav(root, {
      observeResize: false,
    });
    first.destroy();

    const second = createOverflowNav(root, {
      observeResize: false,
    });

    expect(second).not.toBe(first);
    expect(second.visibleItems).toHaveLength(3);
  });

  it.each(['', '   ', '2px', '2 trailing', 'Infinity', 'NaN', '-1'])(
    'rejects an invalid dataset fit tolerance %j',
    (value) => {
      const root = createFixture();
      root.dataset.fitTolerance = value;
      const instance = createOverflowNav(root, { observeResize: false });
      expect(instance.options.fitTolerance).toBe(1);
      instance.destroy();
    },
  );

  it.each(['0', ' 2.5 ', '1e-2'])(
    'accepts a complete finite dataset fit tolerance %j',
    (value) => {
      const root = createFixture();
      root.dataset.fitTolerance = value;
      const instance = createOverflowNav(root, { observeResize: false });
      expect(instance.options.fitTolerance).toBe(Number(value));
      instance.destroy();
    },
  );

  it.each([NaN, Infinity, -Infinity, -1])(
    'falls back for invalid programmatic tolerance %j before dataset values',
    (value) => {
      const root = createFixture();
      root.dataset.fitTolerance = '4';
      const instance = createOverflowNav(root, {
        observeResize: false,
        fitTolerance: value,
      });
      expect(instance.options.fitTolerance).toBe(1);
      instance.destroy();
    },
  );

  it('gives a valid zero programmatic tolerance precedence over the dataset', () => {
    const root = createFixture();
    root.dataset.fitTolerance = '4';
    const instance = createOverflowNav(root, {
      observeResize: false,
      fitTolerance: 0,
    });
    expect(instance.options.fitTolerance).toBe(0);
    instance.destroy();
  });

  it('restores an overflowing detached root without requiring refresh first', () => {
    const root = createFixture();
    mockCapacity(root, 120);
    const instance = createOverflowNav(root, { observeResize: false });
    const items = [...instance.visibleItems, ...instance.overflowItems];
    root.remove();

    instance.destroy();

    expect(instance.visibleItems).toEqual(items);
    expect(instance.overflowCount).toBe(0);
    expect(instance.overflowControl.hidden).toBe(true);
  });

  it('preserves detached overflow items through refresh and restores them on destroy', () => {
    const root = createFixture();
    mockCapacity(root, 120);
    const originalItems = Array.from(root.querySelectorAll<HTMLElement>('[data-overflow-nav-item]'));
    const instance = createOverflowNav(root, { observeResize: false });
    expect(instance.overflowCount).toBe(2);
    root.remove();

    instance.refresh();
    expect([...instance.visibleItems, ...instance.overflowItems]).toEqual(originalItems);
    expect(instance.overflowCount).toBe(2);
    instance.destroy();
    expect(instance.visibleItems).toEqual(originalItems);
    expect(instance.overflowCount).toBe(0);
    expect(instance.overflowControl.hidden).toBe(true);

    document.body.append(root);
    const next = createOverflowNav(root, { observeResize: false });
    expect(next).not.toBe(instance);
    expect([...next.visibleItems, ...next.overflowItems]).toEqual(originalItems);
    next.destroy();
  });

  it.each([false, true])('does not reclaim removed or externally reparented items (refresh: %j)', (refresh) => {
    const root = createFixture();
    mockCapacity(root, 120);
    const instance = createOverflowNav(root, { observeResize: false });
    const removed = instance.overflowItems[0]!;
    const reparented = instance.overflowItems[1]!;
    const external = document.createElement('ul');
    document.body.append(external);
    removed.remove();
    external.append(reparented);

    if (refresh) instance.refresh();
    instance.destroy();

    expect(removed.parentElement).toBe(null);
    expect(reparented.parentElement).toBe(external);
    expect(instance.visibleItems).toHaveLength(1);
    expect(instance.overflowCount).toBe(0);
  });

  it('moves focus to More when refresh closes the panel containing the saved destination', () => {
    const root = createFixture();
    mockCapacity(root, 120);
    const instance = createOverflowNav(root, { observeResize: false });
    const trigger = root.querySelector('button')!;
    trigger.click();
    const link = instance.overflowItems[0]!.querySelector('a')!;
    link.focus();

    instance.refresh();

    expect(instance.overflowList.contains(link)).toBe(true);
    expect(root.querySelector('#overflow-panel')!.hasAttribute('hidden')).toBe(true);
    expect(document.activeElement).toBe(trigger);
    instance.destroy();
  });

  it('moves focus to More when refresh moves a focused primary destination into overflow', () => {
    const root = createFixture();
    const capacity = mockCapacity(root, 300);
    const instance = createOverflowNav(root, { observeResize: false });
    const link = instance.visibleItems.at(-1)!.querySelector('a')!;
    link.focus();
    capacity.width = 120;

    instance.refresh();

    expect(instance.overflowList.contains(link)).toBe(true);
    expect(document.activeElement).toBe(root.querySelector('button'));
    instance.destroy();
  });

  it('restores the saved destination when it returns from overflow during refresh', () => {
    const root = createFixture();
    const capacity = mockCapacity(root, 120);
    const instance = createOverflowNav(root, { observeResize: false });
    root.querySelector('button')!.click();
    const link = instance.overflowItems[0]!.querySelector('a')!;
    link.focus();
    capacity.width = 300;

    instance.refresh();

    expect(instance.list.contains(link)).toBe(true);
    expect(instance.overflowControl.hidden).toBe(true);
    expect(document.activeElement).toBe(link);
    instance.destroy();
  });

  it('focuses the final restored destination when More disappears during refresh', () => {
    const root = createFixture();
    const capacity = mockCapacity(root, 120);
    const instance = createOverflowNav(root, { observeResize: false });
    root.querySelector('button')!.focus();
    capacity.width = 300;

    instance.refresh();

    expect(instance.overflowControl.hidden).toBe(true);
    expect(document.activeElement).toBe(instance.visibleItems.at(-1)!.querySelector('a'));
    instance.destroy();
  });

  it('preserves an external focus target during refresh', () => {
    const root = createFixture();
    mockCapacity(root, 120);
    const instance = createOverflowNav(root, { observeResize: false });
    const external = document.createElement('button');
    document.body.append(external);
    external.focus();

    instance.refresh();

    expect(document.activeElement).toBe(external);
    instance.destroy();
  });

  it('keeps focus on a primary destination that remains visible during refresh', () => {
    const root = createFixture();
    mockCapacity(root, 120);
    const instance = createOverflowNav(root, { observeResize: false });
    const link = instance.visibleItems[0]!.querySelector('a')!;
    link.focus();

    instance.refresh();

    expect(document.activeElement).toBe(link);
    instance.destroy();
  });

  it('does not restart initialization after destruction from the first change event', () => {
    Object.defineProperty(window, 'ResizeObserver', {
      configurable: true,
      writable: true,
      value: FakeResizeObserver,
    });
    const root = createFixture();
    mockCapacity(root, 120);
    const init = vi.fn();
    root.addEventListener(OVERFLOW_NAV_EVENTS.init, init);
    root.addEventListener(OVERFLOW_NAV_EVENTS.change, (event) => {
      (event as CustomEvent<OverflowNavEventDetail>).detail.instance.destroy();
    }, { once: true });

    const instance = createOverflowNav(root);

    expect(FakeResizeObserver.instances).toHaveLength(0);
    expect(init).not.toHaveBeenCalled();
    expect(root.hasAttribute('data-overflow-nav-ready')).toBe(false);
    expect(instance.visibleItems).toHaveLength(3);
    const next = createOverflowNav(root, { observeResize: false });
    expect(next).not.toBe(instance);
    next.destroy();
  });

  it('cleans up when destroyed from the owned menu initialization callback', () => {
    const root = createFixture();
    root.addEventListener('menu-button:init', () => {
      createOverflowNav(root).destroy();
    }, { once: true });
    const init = vi.fn();
    root.addEventListener(OVERFLOW_NAV_EVENTS.init, init);

    createOverflowNav(root);

    expect(init).not.toHaveBeenCalled();
    expect(root.querySelector('button')!.hasAttribute('aria-expanded')).toBe(false);
    expect(root.hasAttribute('data-overflow-nav-ready')).toBe(false);
    const next = createOverflowNav(root, { observeResize: false });
    expect(root.querySelector('button')!.getAttribute('aria-expanded')).toBe('false');
    next.destroy();
  });

  it.each(['menu-button:close', 'menu-button:refresh', OVERFLOW_NAV_EVENTS.change])(
    'stops refresh after destruction from %s',
    (eventName) => {
      Object.defineProperty(window, 'ResizeObserver', {
        configurable: true,
        writable: true,
        value: FakeResizeObserver,
      });
      const root = createFixture();
      const capacity = mockCapacity(root, 120);
      const instance = createOverflowNav(root);
      root.querySelector('button')!.click();
      const refreshed = vi.fn();
      root.addEventListener(OVERFLOW_NAV_EVENTS.refresh, refreshed);
      root.addEventListener(eventName, () => instance.destroy(), { once: true });
      if (eventName === OVERFLOW_NAV_EVENTS.change) capacity.width = 200;

      instance.refresh();

      expect(refreshed).not.toHaveBeenCalled();
      expect(FakeResizeObserver.instances.every((observer) => observer.observed.size === 0)).toBe(true);
      expect(root.hasAttribute('data-overflow-nav-ready')).toBe(false);
      expect(root.hasAttribute('data-overflow-state')).toBe(false);
      expect(instance.visibleItems).toHaveLength(3);
      expect(instance.overflowControl.hidden).toBe(true);
    },
  );

  it('stops redistribution when focusing More synchronously destroys the instance', () => {
    const root = createFixture();
    const capacity = mockCapacity(root, 300);
    const instance = createOverflowNav(root, { observeResize: false });
    instance.visibleItems.at(-1)!.querySelector('a')!.focus();
    const refreshed = vi.fn();
    root.addEventListener(OVERFLOW_NAV_EVENTS.refresh, refreshed);
    root.querySelector('button')!.addEventListener('focus', () => instance.destroy(), { once: true });
    capacity.width = 120;

    instance.refresh();

    expect(instance.visibleItems).toHaveLength(3);
    expect(instance.overflowCount).toBe(0);
    expect(instance.overflowControl.hidden).toBe(true);
    expect(root.hasAttribute('data-overflow-state')).toBe(false);
    expect(refreshed).not.toHaveBeenCalled();
  });

  it('does not emit refresh after restoration focus synchronously destroys the instance', () => {
    const root = createFixture();
    const capacity = mockCapacity(root, 120);
    const instance = createOverflowNav(root, { observeResize: false });
    const destination = instance.overflowItems.at(-1)!.querySelector('a')!;
    root.querySelector('button')!.focus();
    const refreshed = vi.fn();
    root.addEventListener(OVERFLOW_NAV_EVENTS.refresh, refreshed);
    destination.addEventListener('focus', () => instance.destroy(), { once: true });
    capacity.width = 300;

    instance.refresh();

    expect(instance.visibleItems).toHaveLength(3);
    expect(instance.overflowControl.hidden).toBe(true);
    expect(root.hasAttribute('data-overflow-nav-ready')).toBe(false);
    expect(refreshed).not.toHaveBeenCalled();
  });
});

describe('initOverflowNavs', () => {
  it('initializes all matching descendants', () => {
    const wrapper = document.createElement('div');
    const rootA = createFixture(['Home', 'About']);
    const rootB = createFixture(['Contact', 'Blog']);
    wrapper.append(rootA, rootB);
    document.body.append(wrapper);

    const instances = initOverflowNavs(wrapper, { observeResize: false });

    expect(instances).toHaveLength(2);
    expect(instances[0]?.root).toBe(rootA);
    expect(instances[1]?.root).toBe(rootB);
    expect(instances[0]?.visibleItems).toHaveLength(2);
    expect(instances[1]?.visibleItems).toHaveLength(2);
  });

  it('also initializes the root element itself when it matches the selector', () => {
    const root = createFixture(['X', 'Y']);

    const instances = initOverflowNavs(root, { observeResize: false });

    expect(instances).toHaveLength(1);
    expect(instances[0]?.root).toBe(root);
  });

  it('returns an empty array when no elements match', () => {
    const wrapper = document.createElement('div');
    document.body.append(wrapper);

    const instances = initOverflowNavs(wrapper, { observeResize: false });

    expect(instances).toHaveLength(0);
  });

  it('reuses a live instance for a root already initialized', () => {
    const root = createFixture(['A', 'B', 'C']);
    const first = createOverflowNav(root, { observeResize: false });

    const instances = initOverflowNavs(root, { observeResize: false });

    expect(instances).toHaveLength(1);
    expect(instances[0]).toBe(first);
  });

  it('defaults to document scope when called with no arguments', () => {
    const rootA = createFixture(['P', 'Q']);
    const rootB = createFixture(['R', 'S']);
    document.body.append(rootA, rootB);

    const instances = initOverflowNavs(undefined as unknown as ParentNode, { observeResize: false });

    expect(instances.length).toBeGreaterThanOrEqual(2);
    expect(instances.some((i) => i.root === rootA)).toBe(true);
    expect(instances.some((i) => i.root === rootB)).toBe(true);
  });
});
