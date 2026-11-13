import { A11yMenuButtonOptions } from "a11y-menu-button/core";
type OverflowNavReason = 'init' | 'resize' | 'refresh' | 'programmatic';
interface A11yOverflowNavOptions {
  observeResize?: boolean;
  fitTolerance?: number;
  menuButtonOptions?: A11yMenuButtonOptions;
}
interface OverflowNavEventDetail {
  instance: A11yOverflowNav;
  visibleItems: readonly HTMLElement[];
  overflowItems: readonly HTMLElement[];
  overflowCount: number;
  reason: OverflowNavReason;
}
interface A11yOverflowNavInstance {
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
declare const OVERFLOW_NAV_EVENTS: Readonly<{
  readonly init: "overflow-nav:init";
  readonly change: "overflow-nav:change";
  readonly refresh: "overflow-nav:refresh";
  readonly destroy: "overflow-nav:destroy";
}>;
type OverflowNavEventName = (typeof OVERFLOW_NAV_EVENTS)[keyof typeof OVERFLOW_NAV_EVENTS];
interface OverflowNavEventMap {
  [OVERFLOW_NAV_EVENTS.init]: OverflowNavEventDetail;
  [OVERFLOW_NAV_EVENTS.change]: OverflowNavEventDetail;
  [OVERFLOW_NAV_EVENTS.refresh]: OverflowNavEventDetail;
  [OVERFLOW_NAV_EVENTS.destroy]: OverflowNavEventDetail;
}
declare class A11yOverflowNav implements A11yOverflowNavInstance {
  private static readonly instances;
  readonly root: HTMLElement;
  readonly options: Readonly<NormalizedOptions>;
  readonly list: HTMLElement;
  readonly overflowControl: HTMLElement;
  readonly overflowList: HTMLElement;
  private readonly menuRoot;
  private menuButton;
  private canonicalItems;
  private initialState;
  private resizeObserver;
  private layoutFrame;
  private scheduledReason;
  private layoutRunning;
  private pendingReason;
  private destroyed;
  private readonly handleResize;
  constructor(root: HTMLElement, options?: A11yOverflowNavOptions);
  get visibleItems(): readonly HTMLElement[];
  get overflowItems(): readonly HTMLElement[];
  get overflowCount(): number;
  private initialize;
  private queryStructure;
  private captureInitialState;
  private getDirectItems;
  private observeLayout;
  private onResize;
  private scheduleLayout;
  private cancelScheduledLayout;
  private fits;
  private containsActiveElement;
  private restoreFocus;
  private getFocusableWithin;
  private movePrimaryItemToOverflow;
  private tryRestoreFirstOverflowItem;
  private shrinkUntilFit;
  private growWhilePossible;
  private syncState;
  private reflow;
  private restoreCanonicalItemsToPrimary;
  refresh(): void;
  private createEventDetail;
  private dispatch;
  destroy(): void;
}
declare function createOverflowNav(root: HTMLElement, options?: A11yOverflowNavOptions): A11yOverflowNav;
declare function initOverflowNavs(root?: ParentNode, options?: A11yOverflowNavOptions): A11yOverflowNav[];
export { A11yOverflowNav, type A11yOverflowNavInstance, type A11yOverflowNavOptions, OVERFLOW_NAV_EVENTS, type OverflowNavEventDetail, type OverflowNavEventMap, type OverflowNavEventName, type OverflowNavReason, createOverflowNav, initOverflowNavs };
//# sourceMappingURL=index.d.ts.map