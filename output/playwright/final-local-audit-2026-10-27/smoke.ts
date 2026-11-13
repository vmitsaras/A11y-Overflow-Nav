import { A11yOverflowNav, createOverflowNav, initOverflowNavs, OVERFLOW_NAV_EVENTS, type A11yOverflowNavOptions, type A11yOverflowNavInstance, type OverflowNavEventDetail, type OverflowNavEventMap, type OverflowNavEventName, type OverflowNavReason } from 'a11y-overflow-nav';
import { docs, type PluginDocs } from 'a11y-overflow-nav/docs';
const options: A11yOverflowNavOptions = {observeResize:true,fitTolerance:0,menuButtonOptions:{closeOnEscape:true}};
const root = document.createElement('nav');
const instance: A11yOverflowNavInstance = createOverflowNav(root,options);
const direct: A11yOverflowNav = new A11yOverflowNav(root,options);
const items: readonly HTMLElement[] = instance.visibleItems;
const count: number = instance.overflowCount;
const instances: A11yOverflowNav[] = initOverflowNavs(root, options);
const eventName: OverflowNavEventName = OVERFLOW_NAV_EVENTS.change;
const reason: OverflowNavReason = 'refresh';
const handler = (event: CustomEvent<OverflowNavEventMap[typeof eventName]>) => {
  const detail: OverflowNavEventDetail = event.detail;
  detail.instance.refresh();
};
const metadata: PluginDocs = docs;
instance.refresh();
instance.destroy();
void [direct,items,count,instances,reason,handler,metadata];
