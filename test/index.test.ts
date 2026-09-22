import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createOverflowNav,
  OVERFLOW_NAV_EVENTS,
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
    const seen: string[] = [];

    root.addEventListener(OVERFLOW_NAV_EVENTS.init, () => {
      seen.push('init');
    });
    root.addEventListener(OVERFLOW_NAV_EVENTS.destroy, () => {
      seen.push('destroy');
    });

    const instance = createOverflowNav(root, {
      observeResize: false,
    });
    instance.destroy();

    expect(seen).toEqual(['init', 'destroy']);
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
});
