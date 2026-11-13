import { createMenuButton } from "a11y-menu-button/core";
//#region src/A11yOverflowNav.ts
const DEFAULT_OPTIONS = Object.freeze({
	observeResize: true,
	fitTolerance: 1
});
const SELECTORS = Object.freeze({
	root: "[data-a11y-overflow-nav]",
	list: ":scope > [data-overflow-nav-list]",
	item: "[data-overflow-nav-item]",
	control: ":scope > [data-overflow-nav-control]",
	menu: "[data-overflow-nav-menu]",
	overflowList: "[data-overflow-nav-overflow-list]",
	focusable: [
		"a[href]",
		"button:not([disabled])",
		"input:not([disabled])",
		"select:not([disabled])",
		"textarea:not([disabled])",
		"[tabindex]:not([tabindex=\"-1\"])"
	].join(", ")
});
const ATTRIBUTES = Object.freeze({
	state: "data-overflow-state",
	count: "data-overflow-count",
	ready: "data-overflow-nav-ready"
});
const OVERFLOW_NAV_EVENTS = Object.freeze({
	init: "overflow-nav:init",
	change: "overflow-nav:change",
	refresh: "overflow-nav:refresh",
	destroy: "overflow-nav:destroy"
});
function snapshotAttribute(element, name) {
	return {
		exists: element.hasAttribute(name),
		value: element.getAttribute(name)
	};
}
function restoreAttribute(element, name, snapshot) {
	if (snapshot.exists) element.setAttribute(name, snapshot.value ?? "");
	else element.removeAttribute(name);
}
function toSafeBoolean(value, fallback) {
	if (value === true || value === "true") return true;
	if (value === false || value === "false") return false;
	return fallback;
}
function toSafeNumber(value, fallback, min = 0) {
	if (value === void 0 || typeof value === "string" && value.trim() === "") return fallback;
	const parsed = typeof value === "number" ? value : Number(value);
	return Number.isFinite(parsed) && parsed >= min ? parsed : fallback;
}
function normalizeOptions(root, options) {
	return Object.freeze({
		observeResize: toSafeBoolean(options.observeResize ?? root.dataset.observeResize, DEFAULT_OPTIONS.observeResize),
		fitTolerance: toSafeNumber(options.fitTolerance ?? root.dataset.fitTolerance, DEFAULT_OPTIONS.fitTolerance),
		menuButtonOptions: Object.freeze({ ...options.menuButtonOptions ?? {} })
	});
}
function sameNodes(left, right) {
	return left.length === right.length && left.every((element, index) => element === right[index]);
}
var A11yOverflowNav = class A11yOverflowNav {
	static instances = /* @__PURE__ */ new WeakMap();
	root;
	options;
	list;
	overflowControl;
	overflowList;
	menuRoot;
	menuButton;
	canonicalItems = [];
	initialState;
	resizeObserver = null;
	layoutFrame = null;
	scheduledReason = "resize";
	layoutRunning = false;
	pendingReason = null;
	destroyed = false;
	handleResize;
	constructor(root, options = {}) {
		if (!(root instanceof HTMLElement)) throw new TypeError("A11yOverflowNav: root must be an HTMLElement");
		const existingInstance = A11yOverflowNav.instances.get(root);
		if (existingInstance) return existingInstance;
		this.root = root;
		this.options = normalizeOptions(root, options);
		this.handleResize = this.onResize.bind(this);
		const { list, overflowControl, menuRoot, overflowList } = this.queryStructure(true);
		this.list = list;
		this.overflowControl = overflowControl;
		this.menuRoot = menuRoot;
		this.overflowList = overflowList;
		this.initialState = this.captureInitialState();
		this.canonicalItems = this.getDirectItems(this.list);
		A11yOverflowNav.instances.set(root, this);
		try {
			this.menuButton = createMenuButton(this.menuRoot, this.options.menuButtonOptions);
			if (this.destroyed) {
				this.menuButton.destroy();
				return;
			}
			this.initialize();
		} catch (error) {
			this.resizeObserver?.disconnect();
			this.resizeObserver = null;
			this.cancelScheduledLayout();
			try {
				this.menuButton?.destroy();
			} catch {}
			this.restoreCanonicalItemsToPrimary();
			restoreAttribute(this.root, ATTRIBUTES.state, this.initialState.rootState);
			restoreAttribute(this.root, ATTRIBUTES.count, this.initialState.rootCount);
			restoreAttribute(this.root, ATTRIBUTES.ready, this.initialState.rootReady);
			this.overflowControl.hidden = this.initialState.controlHidden;
			A11yOverflowNav.instances.delete(root);
			throw error;
		}
	}
	get visibleItems() {
		return this.canonicalItems.filter((item) => item.parentElement === this.list);
	}
	get overflowItems() {
		return this.canonicalItems.filter((item) => item.parentElement === this.overflowList);
	}
	get overflowCount() {
		return this.overflowItems.length;
	}
	initialize() {
		if (this.destroyed) return;
		this.root.setAttribute(ATTRIBUTES.ready, "true");
		this.reflow("init");
		if (this.destroyed) return;
		this.observeLayout();
		if (this.destroyed) return;
		this.dispatch(OVERFLOW_NAV_EVENTS.init, "init");
	}
	queryStructure(initial) {
		const list = this.root.querySelector(SELECTORS.list);
		if (!(list instanceof HTMLElement)) throw new Error("A11yOverflowNav: a direct-child [data-overflow-nav-list] is required");
		const control = list.querySelector(SELECTORS.control);
		if (!(control instanceof HTMLElement) || control.parentElement !== list) throw new Error("A11yOverflowNav: a direct-child [data-overflow-nav-control] is required");
		if (list.lastElementChild !== control) throw new Error("A11yOverflowNav: the overflow control must be the final direct child of the navigation list");
		const menuRoot = control.querySelector(SELECTORS.menu);
		const overflowList = control.querySelector(SELECTORS.overflowList);
		if (!(menuRoot instanceof HTMLElement)) throw new Error("A11yOverflowNav: [data-overflow-nav-menu] is required inside the overflow control");
		if (!(overflowList instanceof HTMLElement)) throw new Error("A11yOverflowNav: [data-overflow-nav-overflow-list] is required inside the overflow control");
		if (initial && !control.hidden) throw new Error("A11yOverflowNav: the overflow control must be authored with the hidden attribute for the progressive-enhancement fallback");
		if (initial && overflowList.querySelector(SELECTORS.item) instanceof HTMLElement) throw new Error("A11yOverflowNav: managed navigation items must start in the primary list, not in the overflow list");
		return {
			list,
			overflowControl: control,
			menuRoot,
			overflowList
		};
	}
	captureInitialState() {
		return {
			rootState: snapshotAttribute(this.root, ATTRIBUTES.state),
			rootCount: snapshotAttribute(this.root, ATTRIBUTES.count),
			rootReady: snapshotAttribute(this.root, ATTRIBUTES.ready),
			controlHidden: this.overflowControl.hidden
		};
	}
	getDirectItems(parent) {
		return Array.from(parent.children).filter((element) => element instanceof HTMLElement && element.matches(SELECTORS.item));
	}
	observeLayout() {
		if (this.destroyed) return;
		this.resizeObserver?.disconnect();
		this.resizeObserver = null;
		if (!this.options.observeResize || !("ResizeObserver" in window)) return;
		this.resizeObserver = new ResizeObserver(this.handleResize);
		this.resizeObserver.observe(this.list);
		this.resizeObserver.observe(this.overflowControl);
		for (const item of this.canonicalItems) this.resizeObserver.observe(item);
	}
	onResize() {
		this.scheduleLayout("resize");
	}
	scheduleLayout(reason) {
		if (this.destroyed) return;
		this.scheduledReason = reason;
		if (this.layoutFrame !== null) return;
		this.layoutFrame = window.requestAnimationFrame(() => {
			this.layoutFrame = null;
			const nextReason = this.scheduledReason;
			this.scheduledReason = "resize";
			this.reflow(nextReason);
		});
	}
	cancelScheduledLayout() {
		if (this.layoutFrame !== null) {
			window.cancelAnimationFrame(this.layoutFrame);
			this.layoutFrame = null;
		}
		this.pendingReason = null;
	}
	fits() {
		const participants = [...this.visibleItems, ...this.overflowControl.hidden ? [] : [this.overflowControl]];
		if (participants.length === 0) return true;
		const tolerance = this.options.fitTolerance;
		const listRect = this.list.getBoundingClientRect();
		const availableWidth = this.list.clientWidth || listRect.width;
		if (availableWidth > 0 && this.list.scrollWidth > availableWidth + tolerance) return false;
		const firstRect = participants[0]?.getBoundingClientRect();
		if (!firstRect) return true;
		for (const participant of participants) {
			const rect = participant.getBoundingClientRect();
			if (!(!(firstRect.height > 0 && rect.height > 0) || rect.bottom >= firstRect.top + tolerance && rect.top <= firstRect.bottom - tolerance)) return false;
			if (listRect.width > 0 && (rect.left < listRect.left - tolerance || rect.right > listRect.right + tolerance)) return false;
		}
		return true;
	}
	containsActiveElement(element) {
		const active = document.activeElement;
		return active instanceof HTMLElement && (active === element || element.contains(active));
	}
	restoreFocus(element) {
		if (this.destroyed || !element || !document.contains(element) || element.closest("[hidden], [inert]")) return;
		element.focus({ preventScroll: true });
	}
	getFocusableWithin(item) {
		if (item.matches(SELECTORS.focusable)) return item;
		const focusable = item.querySelector(SELECTORS.focusable);
		return focusable instanceof HTMLElement ? focusable : null;
	}
	movePrimaryItemToOverflow(item) {
		const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		const focusedInside = this.containsActiveElement(item);
		if (focusedInside && !this.menuButton.isOpen()) {
			this.menuButton.trigger.focus({ preventScroll: true });
			if (this.destroyed) return;
		}
		this.overflowList.insertBefore(item, this.overflowList.firstElementChild);
		if (this.destroyed) return;
		if (focusedInside && this.menuButton.isOpen()) this.restoreFocus(active);
	}
	tryRestoreFirstOverflowItem() {
		const candidate = this.overflowItems[0];
		if (!candidate) return false;
		const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		const focusWasInsideCandidate = active !== null && (active === candidate || candidate.contains(active));
		const focusWasInsideControl = active !== null && (active === this.overflowControl || this.overflowControl.contains(active));
		this.list.insertBefore(candidate, this.overflowControl);
		if (this.destroyed) return false;
		const isFinalOverflowItem = this.overflowItems.length === 0;
		if (isFinalOverflowItem) this.overflowControl.hidden = true;
		if (this.fits()) {
			if (isFinalOverflowItem) {
				if (this.menuButton.isOpen()) {
					this.menuButton.close({
						returnFocus: false,
						reason: "programmatic"
					});
					if (this.destroyed) return false;
				}
				if (focusWasInsideControl && !focusWasInsideCandidate) this.getFocusableWithin(candidate)?.focus({ preventScroll: true });
				else if (focusWasInsideCandidate) this.restoreFocus(active);
			} else if (focusWasInsideCandidate) this.restoreFocus(active);
			return true;
		}
		this.overflowList.insertBefore(candidate, this.overflowList.firstElementChild);
		if (this.destroyed) return false;
		this.overflowControl.hidden = false;
		if (focusWasInsideCandidate || focusWasInsideControl) this.restoreFocus(active);
		return false;
	}
	shrinkUntilFit() {
		if (this.fits()) return;
		this.overflowControl.hidden = false;
		while (!this.destroyed && !this.fits()) {
			const candidate = this.visibleItems.at(-1);
			if (!candidate) break;
			this.movePrimaryItemToOverflow(candidate);
		}
	}
	growWhilePossible() {
		while (!this.destroyed && this.overflowItems.length > 0) if (!this.tryRestoreFirstOverflowItem()) break;
	}
	syncState() {
		const count = this.overflowCount;
		this.root.setAttribute(ATTRIBUTES.state, count > 0 ? "overflow" : "fit");
		this.root.setAttribute(ATTRIBUTES.count, String(count));
		this.overflowControl.hidden = count === 0;
	}
	reflow(reason, previousDistribution) {
		if (this.destroyed) return;
		if (this.layoutRunning) {
			this.pendingReason = reason;
			return;
		}
		this.layoutRunning = true;
		const beforeVisible = previousDistribution ? [...previousDistribution.visibleItems] : [...this.visibleItems];
		const beforeOverflow = previousDistribution ? [...previousDistribution.overflowItems] : [...this.overflowItems];
		try {
			if (this.overflowItems.length === 0) this.overflowControl.hidden = true;
			else {
				this.overflowControl.hidden = false;
				this.growWhilePossible();
			}
			if (this.destroyed) return;
			this.shrinkUntilFit();
			if (this.destroyed) return;
			this.syncState();
			if (!this.overflowControl.hidden) {
				if (this.menuRoot.isConnected) this.menuButton.refresh();
			} else if (this.menuButton.isOpen()) this.menuButton.close({
				returnFocus: false,
				reason: "programmatic"
			});
		} finally {
			this.layoutRunning = false;
		}
		if (this.destroyed) return;
		const afterVisible = [...this.visibleItems];
		const afterOverflow = [...this.overflowItems];
		if (!sameNodes(beforeVisible, afterVisible) || !sameNodes(beforeOverflow, afterOverflow)) this.dispatch(OVERFLOW_NAV_EVENTS.change, reason);
		if (this.destroyed) return;
		const pendingReason = this.pendingReason;
		this.pendingReason = null;
		if (pendingReason) this.scheduleLayout(pendingReason);
	}
	restoreCanonicalItemsToPrimary(stopWhenDestroyed = false) {
		let anchor = this.overflowControl;
		for (let index = this.canonicalItems.length - 1; index >= 0; index -= 1) {
			if (stopWhenDestroyed && this.destroyed) return;
			const item = this.canonicalItems[index];
			if (!item || item.parentElement !== this.list && item.parentElement !== this.overflowList) continue;
			if (item.parentElement !== this.list || item.nextElementSibling !== anchor) this.list.insertBefore(item, anchor);
			anchor = item;
		}
	}
	refresh() {
		if (this.destroyed) return;
		const previousDistribution = {
			visibleItems: [...this.visibleItems],
			overflowItems: [...this.overflowItems]
		};
		const structure = this.queryStructure(false);
		if (structure.list !== this.list || structure.overflowControl !== this.overflowControl || structure.menuRoot !== this.menuRoot || structure.overflowList !== this.overflowList) throw new Error("A11yOverflowNav: refresh cannot replace structural nodes; destroy and reinitialize instead");
		if (this.getDirectItems(this.overflowList).find((item) => !this.canonicalItems.includes(item))) throw new Error("A11yOverflowNav: add new managed items to the primary list before calling refresh()");
		const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		const focusWasInsideControl = active !== null && this.overflowControl.contains(active);
		const primaryItems = this.getDirectItems(this.list);
		const primarySet = new Set(primaryItems);
		const retainedOverflowItems = this.canonicalItems.filter((item) => item.parentElement === this.overflowList && !primarySet.has(item));
		this.canonicalItems = [...primaryItems, ...retainedOverflowItems];
		this.restoreCanonicalItemsToPrimary(true);
		if (this.destroyed) return;
		if (this.menuButton.isOpen()) {
			this.menuButton.close({
				returnFocus: false,
				reason: "programmatic"
			});
			if (this.destroyed) return;
		}
		this.overflowControl.hidden = true;
		this.observeLayout();
		this.reflow("refresh", previousDistribution);
		if (this.destroyed) return;
		if (active && this.overflowList.contains(active) && !this.menuButton.isOpen()) this.restoreFocus(this.menuButton.trigger);
		else if (active && focusWasInsideControl && this.overflowControl.contains(active) && this.overflowControl.hidden) {
			const restoredItem = this.visibleItems.at(-1);
			this.restoreFocus(restoredItem ? this.getFocusableWithin(restoredItem) : null);
		} else this.restoreFocus(active);
		if (this.destroyed) return;
		this.dispatch(OVERFLOW_NAV_EVENTS.refresh, "refresh");
	}
	createEventDetail(reason) {
		const overflowItems = [...this.overflowItems];
		return {
			instance: this,
			visibleItems: [...this.visibleItems],
			overflowItems,
			overflowCount: overflowItems.length,
			reason
		};
	}
	dispatch(type, reason) {
		this.root.dispatchEvent(new CustomEvent(type, {
			bubbles: true,
			composed: false,
			cancelable: false,
			detail: this.createEventDetail(reason)
		}));
	}
	destroy() {
		if (this.destroyed) return;
		this.destroyed = true;
		this.resizeObserver?.disconnect();
		this.resizeObserver = null;
		this.cancelScheduledLayout();
		this.dispatch(OVERFLOW_NAV_EVENTS.destroy, "programmatic");
		const controlHadFocus = this.containsActiveElement(this.overflowControl);
		this.restoreCanonicalItemsToPrimary();
		if (controlHadFocus) {
			const lastItem = this.visibleItems.at(-1);
			if (lastItem) this.getFocusableWithin(lastItem)?.focus({ preventScroll: true });
		}
		if (this.menuButton?.isOpen()) this.menuButton.close({
			returnFocus: false,
			reason: "programmatic"
		});
		this.menuButton?.destroy();
		restoreAttribute(this.root, ATTRIBUTES.state, this.initialState.rootState);
		restoreAttribute(this.root, ATTRIBUTES.count, this.initialState.rootCount);
		restoreAttribute(this.root, ATTRIBUTES.ready, this.initialState.rootReady);
		this.overflowControl.hidden = this.initialState.controlHidden;
		A11yOverflowNav.instances.delete(this.root);
	}
};
function createOverflowNav(root, options = {}) {
	return new A11yOverflowNav(root, options);
}
function initOverflowNavs(root = document, options = {}) {
	const matchesRoot = root instanceof HTMLElement && root.matches(SELECTORS.root) ? [root] : [];
	const descendants = Array.from(root.querySelectorAll(SELECTORS.root)).filter((element) => element instanceof HTMLElement);
	return [...matchesRoot, ...descendants].map((element) => createOverflowNav(element, options));
}
//#endregion
export { A11yOverflowNav, OVERFLOW_NAV_EVENTS, createOverflowNav, initOverflowNavs };

//# sourceMappingURL=index.js.map