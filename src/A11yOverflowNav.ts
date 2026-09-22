import {
  createMenuButton,
  type A11yMenuButton,
  type A11yMenuButtonOptions,
} from 'a11y-menu-button/core';

export type OverflowNavReason =
  | 'init'
  | 'resize'
  | 'refresh'
  | 'programmatic';

export interface A11yOverflowNavOptions {
  observeResize?: boolean;
  fitTolerance?: number;
  menuButtonOptions?: A11yMenuButtonOptions;
}

export interface OverflowNavEventDetail {
  instance: A11yOverflowNav;
  visibleItems: readonly HTMLElement[];
  overflowItems: readonly HTMLElement[];
  overflowCount: number;
  reason: OverflowNavReason;
}

export interface A11yOverflowNavInstance {
  readonly root: HTMLElement;
  readonly list: HTMLElement;
  readonly overflowControl: HTMLElement;
  readonly overflowList: HTMLElement;
  readonly visibleItems: readonly HTMLElement[];
  readonly overflowItems: readonly HTMLElement[];
  readonly overflowCount: number;
  refresh(): void;
  destroy(): void;
}

interface NormalizedOptions {
  observeResize: boolean;
  fitTolerance: number;
  menuButtonOptions: Readonly<A11yMenuButtonOptions>;
}

interface AttributeSnapshot {
  exists: boolean;
  value: string | null;
}

interface InitialDomState {
  rootState: AttributeSnapshot;
  rootCount: AttributeSnapshot;
  rootReady: AttributeSnapshot;
  controlHidden: boolean;
}

const DEFAULT_OPTIONS = Object.freeze({
  observeResize: true,
  fitTolerance: 1,
});

const SELECTORS = Object.freeze({
  root: '[data-a11y-overflow-nav]',
  list: ':scope > [data-overflow-nav-list]',
  item: '[data-overflow-nav-item]',
  control: ':scope > [data-overflow-nav-control]',
  menu: '[data-overflow-nav-menu]',
  overflowList: '[data-overflow-nav-overflow-list]',
  focusable: [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', '),
});

const ATTRIBUTES = Object.freeze({
  state: 'data-overflow-state',
  count: 'data-overflow-count',
  ready: 'data-overflow-nav-ready',
});

export const OVERFLOW_NAV_EVENTS = Object.freeze({
  init: 'overflow-nav:init',
  change: 'overflow-nav:change',
  refresh: 'overflow-nav:refresh',
  destroy: 'overflow-nav:destroy',
} as const);

export type OverflowNavEventName =
  (typeof OVERFLOW_NAV_EVENTS)[keyof typeof OVERFLOW_NAV_EVENTS];

function snapshotAttribute(element: Element, name: string): AttributeSnapshot {
  return {
    exists: element.hasAttribute(name),
    value: element.getAttribute(name),
  };
}

function restoreAttribute(
  element: Element,
  name: string,
  snapshot: AttributeSnapshot,
): void {
  if (snapshot.exists) {
    element.setAttribute(name, snapshot.value ?? '');
  } else {
    element.removeAttribute(name);
  }
}

function toSafeBoolean(
  value: boolean | string | undefined,
  fallback: boolean,
): boolean {
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return fallback;
}

function toSafeNumber(
  value: number | string | undefined,
  fallback: number,
  min = 0,
): number {
  if (value === '' || value === undefined) return fallback;
  const parsed = typeof value === 'number' ? value : Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed >= min ? parsed : fallback;
}

function normalizeOptions(
  root: HTMLElement,
  options: A11yOverflowNavOptions,
): Readonly<NormalizedOptions> {
  return Object.freeze({
    observeResize: toSafeBoolean(
      options.observeResize ?? root.dataset.observeResize,
      DEFAULT_OPTIONS.observeResize,
    ),
    fitTolerance: toSafeNumber(
      options.fitTolerance ?? root.dataset.fitTolerance,
      DEFAULT_OPTIONS.fitTolerance,
    ),
    menuButtonOptions: Object.freeze({
      ...(options.menuButtonOptions ?? {}),
    }),
  });
}

function sameNodes(
  left: readonly HTMLElement[],
  right: readonly HTMLElement[],
): boolean {
  return (
    left.length === right.length &&
    left.every((element, index) => element === right[index])
  );
}

export class A11yOverflowNav implements A11yOverflowNavInstance {
  private static readonly instances = new WeakMap<HTMLElement, A11yOverflowNav>();

  public readonly root!: HTMLElement;
  public readonly options!: Readonly<NormalizedOptions>;
  public list!: HTMLElement;
  public overflowControl!: HTMLElement;
  public overflowList!: HTMLElement;

  private menuRoot!: HTMLElement;
  private menuButton!: A11yMenuButton;
  private canonicalItems: HTMLElement[] = [];
  private initialState!: InitialDomState;
  private resizeObserver: ResizeObserver | null = null;
  private layoutFrame: number | null = null;
  private scheduledReason: OverflowNavReason = 'resize';
  private layoutRunning = false;
  private pendingReason: OverflowNavReason | null = null;
  private destroyed = false;
  private readonly handleResize!: () => void;

  public constructor(
    root: HTMLElement,
    options: A11yOverflowNavOptions = {},
  ) {
    if (!(root instanceof HTMLElement)) {
      throw new TypeError('A11yOverflowNav: root must be an HTMLElement');
    }

    const existingInstance = A11yOverflowNav.instances.get(root);
    if (existingInstance) return existingInstance;

    this.root = root;
    this.options = normalizeOptions(root, options);
    this.handleResize = this.onResize.bind(this);

    this.queryStructure(true);
    this.initialState = this.captureInitialState();
    this.canonicalItems = this.getDirectItems(this.list);
    A11yOverflowNav.instances.set(root, this);

    try {
      this.menuButton = createMenuButton(
        this.menuRoot,
        this.options.menuButtonOptions,
      );
      this.initialize();
    } catch (error) {
      A11yOverflowNav.instances.delete(root);
      throw error;
    }
  }

  public get visibleItems(): readonly HTMLElement[] {
    return this.canonicalItems.filter(
      (item) => item.parentElement === this.list,
    );
  }

  public get overflowItems(): readonly HTMLElement[] {
    return this.canonicalItems.filter(
      (item) => item.parentElement === this.overflowList,
    );
  }

  public get overflowCount(): number {
    return this.overflowItems.length;
  }

  private initialize(): void {
    this.root.setAttribute(ATTRIBUTES.ready, 'true');
    this.reflow('init');
    this.observeLayout();
    this.dispatch(OVERFLOW_NAV_EVENTS.init, 'init');
  }

  private queryStructure(initial: boolean): void {
    const list = this.root.querySelector(SELECTORS.list);
    if (!(list instanceof HTMLElement)) {
      throw new Error(
        'A11yOverflowNav: a direct-child [data-overflow-nav-list] is required',
      );
    }

    const control = list.querySelector(SELECTORS.control);
    if (!(control instanceof HTMLElement) || control.parentElement !== list) {
      throw new Error(
        'A11yOverflowNav: a direct-child [data-overflow-nav-control] is required',
      );
    }

    if (list.lastElementChild !== control) {
      throw new Error(
        'A11yOverflowNav: the overflow control must be the final direct child of the navigation list',
      );
    }

    const menuRoot = control.querySelector(SELECTORS.menu);
    const overflowList = control.querySelector(SELECTORS.overflowList);

    if (!(menuRoot instanceof HTMLElement)) {
      throw new Error(
        'A11yOverflowNav: [data-overflow-nav-menu] is required inside the overflow control',
      );
    }

    if (!(overflowList instanceof HTMLElement)) {
      throw new Error(
        'A11yOverflowNav: [data-overflow-nav-overflow-list] is required inside the overflow control',
      );
    }

    if (initial && !control.hidden) {
      throw new Error(
        'A11yOverflowNav: the overflow control must be authored with the hidden attribute for the progressive-enhancement fallback',
      );
    }

    if (
      initial &&
      overflowList.querySelector(SELECTORS.item) instanceof HTMLElement
    ) {
      throw new Error(
        'A11yOverflowNav: managed navigation items must start in the primary list, not in the overflow list',
      );
    }

    this.list = list;
    this.overflowControl = control;
    this.menuRoot = menuRoot;
    this.overflowList = overflowList;
  }

  private captureInitialState(): InitialDomState {
    return {
      rootState: snapshotAttribute(this.root, ATTRIBUTES.state),
      rootCount: snapshotAttribute(this.root, ATTRIBUTES.count),
      rootReady: snapshotAttribute(this.root, ATTRIBUTES.ready),
      controlHidden: this.overflowControl.hidden,
    };
  }

  private getDirectItems(parent: HTMLElement): HTMLElement[] {
    return Array.from(parent.children).filter(
      (element): element is HTMLElement =>
        element instanceof HTMLElement &&
        element.matches(SELECTORS.item),
    );
  }

  private observeLayout(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    if (!this.options.observeResize || !('ResizeObserver' in window)) return;

    this.resizeObserver = new ResizeObserver(this.handleResize);
    this.resizeObserver.observe(this.list);
    this.resizeObserver.observe(this.overflowControl);
    for (const item of this.canonicalItems) {
      this.resizeObserver.observe(item);
    }
  }

  private onResize(): void {
    this.scheduleLayout('resize');
  }

  private scheduleLayout(reason: OverflowNavReason): void {
    if (this.destroyed) return;
    this.scheduledReason = reason;
    if (this.layoutFrame !== null) return;

    this.layoutFrame = window.requestAnimationFrame(() => {
      this.layoutFrame = null;
      const nextReason = this.scheduledReason;
      this.scheduledReason = 'resize';
      this.reflow(nextReason);
    });
  }

  private cancelScheduledLayout(): void {
    if (this.layoutFrame !== null) {
      window.cancelAnimationFrame(this.layoutFrame);
      this.layoutFrame = null;
    }
    this.pendingReason = null;
  }

  private getPrimaryItems(): HTMLElement[] {
    return this.canonicalItems.filter(
      (item) => item.parentElement === this.list,
    );
  }

  private fits(): boolean {
    const participants = [
      ...this.getPrimaryItems(),
      ...(this.overflowControl.hidden ? [] : [this.overflowControl]),
    ];

    if (participants.length === 0) return true;

    const tolerance = this.options.fitTolerance;
    const listRect = this.list.getBoundingClientRect();
    const availableWidth = this.list.clientWidth || listRect.width;

    if (
      availableWidth > 0 &&
      this.list.scrollWidth > availableWidth + tolerance
    ) {
      return false;
    }

    const firstRect = participants[0]?.getBoundingClientRect();
    if (!firstRect) return true;

    for (const participant of participants) {
      const rect = participant.getBoundingClientRect();

      const hasMeasurableBlockSize =
        firstRect.height > 0 && rect.height > 0;
      const overlapsFirstRow =
        !hasMeasurableBlockSize ||
        (rect.bottom >= firstRect.top + tolerance &&
          rect.top <= firstRect.bottom - tolerance);

      if (!overlapsFirstRow) {
        return false;
      }

      if (
        listRect.width > 0 &&
        (rect.left < listRect.left - tolerance ||
          rect.right > listRect.right + tolerance)
      ) {
        return false;
      }
    }

    return true;
  }

  private containsActiveElement(element: HTMLElement): boolean {
    const active = document.activeElement;
    return (
      active instanceof HTMLElement &&
      (active === element || element.contains(active))
    );
  }

  private restoreFocus(element: HTMLElement | null): void {
    if (!element || !document.contains(element)) return;
    element.focus({ preventScroll: true });
  }

  private getFocusableWithin(item: HTMLElement): HTMLElement | null {
    if (item.matches(SELECTORS.focusable)) return item;
    const focusable = item.querySelector(SELECTORS.focusable);
    return focusable instanceof HTMLElement ? focusable : null;
  }

  private movePrimaryItemToOverflow(item: HTMLElement): void {
    const active =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const focusedInside = this.containsActiveElement(item);

    if (focusedInside && !this.menuButton.isOpen()) {
      this.menuButton.trigger.focus({ preventScroll: true });
    }

    this.overflowList.insertBefore(
      item,
      this.overflowList.firstElementChild,
    );

    if (focusedInside && this.menuButton.isOpen()) {
      this.restoreFocus(active);
    }
  }

  private tryRestoreFirstOverflowItem(): boolean {
    const candidate = this.overflowItems[0];
    if (!candidate) return false;

    const active =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const focusWasInsideCandidate =
      active !== null &&
      (active === candidate || candidate.contains(active));
    const focusWasInsideControl =
      active !== null &&
      (active === this.overflowControl ||
        this.overflowControl.contains(active));

    this.list.insertBefore(candidate, this.overflowControl);

    const isFinalOverflowItem = this.overflowItems.length === 0;
    if (isFinalOverflowItem) {
      this.overflowControl.hidden = true;
    }

    if (this.fits()) {
      if (isFinalOverflowItem) {
        if (this.menuButton.isOpen()) {
          this.menuButton.close({
            returnFocus: false,
            reason: 'programmatic',
          });
        }

        if (focusWasInsideControl && !focusWasInsideCandidate) {
          this.getFocusableWithin(candidate)?.focus({ preventScroll: true });
        } else if (focusWasInsideCandidate) {
          this.restoreFocus(active);
        }
      } else if (focusWasInsideCandidate) {
        this.restoreFocus(active);
      }
      return true;
    }

    this.overflowList.insertBefore(
      candidate,
      this.overflowList.firstElementChild,
    );
    this.overflowControl.hidden = false;

    if (focusWasInsideCandidate || focusWasInsideControl) {
      this.restoreFocus(active);
    }

    return false;
  }

  private shrinkUntilFit(): void {
    if (this.fits()) return;

    this.overflowControl.hidden = false;

    while (!this.fits()) {
      const candidate = this.getPrimaryItems().at(-1);
      if (!candidate) break;
      this.movePrimaryItemToOverflow(candidate);
    }
  }

  private growWhilePossible(): void {
    while (this.overflowItems.length > 0) {
      if (!this.tryRestoreFirstOverflowItem()) break;
    }
  }

  private syncState(): void {
    const count = this.overflowCount;
    this.root.setAttribute(
      ATTRIBUTES.state,
      count > 0 ? 'overflow' : 'fit',
    );
    this.root.setAttribute(ATTRIBUTES.count, String(count));
    this.overflowControl.hidden = count === 0;
  }

  private reflow(reason: OverflowNavReason): void {
    if (this.destroyed) return;

    if (this.layoutRunning) {
      this.pendingReason = reason;
      return;
    }

    this.layoutRunning = true;
    const beforeVisible = [...this.visibleItems];
    const beforeOverflow = [...this.overflowItems];

    try {
      if (this.overflowItems.length === 0) {
        this.overflowControl.hidden = true;
      } else {
        this.overflowControl.hidden = false;
        this.growWhilePossible();
      }

      this.shrinkUntilFit();
      this.syncState();

      if (!this.overflowControl.hidden) {
        this.menuButton.refresh();
      } else if (this.menuButton.isOpen()) {
        this.menuButton.close({
          returnFocus: false,
          reason: 'programmatic',
        });
      }
    } finally {
      this.layoutRunning = false;
    }

    const afterVisible = [...this.visibleItems];
    const afterOverflow = [...this.overflowItems];

    if (
      !sameNodes(beforeVisible, afterVisible) ||
      !sameNodes(beforeOverflow, afterOverflow)
    ) {
      this.dispatch(OVERFLOW_NAV_EVENTS.change, reason);
    }

    const pendingReason = this.pendingReason;
    this.pendingReason = null;
    if (pendingReason) this.scheduleLayout(pendingReason);
  }

  private restoreCanonicalItemsToPrimary(): void {
    let anchor: Element = this.overflowControl;

    for (
      let index = this.canonicalItems.length - 1;
      index >= 0;
      index -= 1
    ) {
      const item = this.canonicalItems[index];
      if (!item || !item.isConnected) continue;
      this.list.insertBefore(item, anchor);
      anchor = item;
    }
  }

  public refresh(): void {
    if (this.destroyed) return;

    const previousList = this.list;
    const previousControl = this.overflowControl;
    const previousMenuRoot = this.menuRoot;
    const previousOverflowList = this.overflowList;

    this.queryStructure(false);

    if (
      this.list !== previousList ||
      this.overflowControl !== previousControl ||
      this.menuRoot !== previousMenuRoot ||
      this.overflowList !== previousOverflowList
    ) {
      this.list = previousList;
      this.overflowControl = previousControl;
      this.menuRoot = previousMenuRoot;
      this.overflowList = previousOverflowList;
      throw new Error(
        'A11yOverflowNav: refresh cannot replace structural nodes; destroy and reinitialize instead',
      );
    }

    const unexpectedOverflowItem = this.getDirectItems(
      this.overflowList,
    ).find((item) => !this.canonicalItems.includes(item));

    if (unexpectedOverflowItem) {
      throw new Error(
        'A11yOverflowNav: add new managed items to the primary list before calling refresh()',
      );
    }

    const active =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const primaryItems = this.getDirectItems(this.list);
    const primarySet = new Set(primaryItems);
    const retainedOverflowItems = this.canonicalItems.filter(
      (item) =>
        item.isConnected &&
        item.parentElement === this.overflowList &&
        !primarySet.has(item),
    );

    this.canonicalItems = [
      ...primaryItems,
      ...retainedOverflowItems,
    ];

    this.restoreCanonicalItemsToPrimary();

    if (this.menuButton.isOpen()) {
      this.menuButton.close({
        returnFocus: false,
        reason: 'programmatic',
      });
    }

    this.overflowControl.hidden = true;
    this.observeLayout();
    this.reflow('refresh');
    this.restoreFocus(active);
    this.dispatch(OVERFLOW_NAV_EVENTS.refresh, 'refresh');
  }

  private createEventDetail(
    reason: OverflowNavReason,
  ): OverflowNavEventDetail {
    return {
      instance: this,
      visibleItems: [...this.visibleItems],
      overflowItems: [...this.overflowItems],
      overflowCount: this.overflowCount,
      reason,
    };
  }

  private dispatch(
    type: OverflowNavEventName,
    reason: OverflowNavReason,
  ): void {
    this.root.dispatchEvent(
      new CustomEvent<OverflowNavEventDetail>(type, {
        bubbles: true,
        composed: false,
        detail: this.createEventDetail(reason),
      }),
    );
  }

  public destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;

    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.cancelScheduledLayout();

    this.dispatch(OVERFLOW_NAV_EVENTS.destroy, 'programmatic');

    const controlHadFocus = this.containsActiveElement(
      this.overflowControl,
    );

    this.restoreCanonicalItemsToPrimary();

    if (controlHadFocus) {
      const lastItem = this.canonicalItems.at(-1);
      if (lastItem) {
        this.getFocusableWithin(lastItem)?.focus({ preventScroll: true });
      }
    }

    this.menuButton.destroy();

    restoreAttribute(
      this.root,
      ATTRIBUTES.state,
      this.initialState.rootState,
    );
    restoreAttribute(
      this.root,
      ATTRIBUTES.count,
      this.initialState.rootCount,
    );
    restoreAttribute(
      this.root,
      ATTRIBUTES.ready,
      this.initialState.rootReady,
    );
    this.overflowControl.hidden = this.initialState.controlHidden;

    A11yOverflowNav.instances.delete(this.root);
  }
}

export function createOverflowNav(
  root: HTMLElement,
  options: A11yOverflowNavOptions = {},
): A11yOverflowNav {
  return new A11yOverflowNav(root, options);
}

export function initOverflowNavs(
  root: ParentNode = document,
  options: A11yOverflowNavOptions = {},
): A11yOverflowNav[] {
  const matchesRoot =
    root instanceof HTMLElement && root.matches(SELECTORS.root)
      ? [root]
      : [];

  const descendants = Array.from(
    root.querySelectorAll(SELECTORS.root),
  ).filter(
    (element): element is HTMLElement =>
      element instanceof HTMLElement,
  );

  return [...matchesRoot, ...descendants].map((element) =>
    createOverflowNav(element, options),
  );
}
