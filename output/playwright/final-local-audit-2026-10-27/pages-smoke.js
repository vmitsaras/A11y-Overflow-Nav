async page => {
 const results=[];
 for(const route of ['/docs/','/docs/examples/basic/index.html','/docs/examples/stress/index.html']){
  const errors=[],responses=[];
  const onError=e=>errors.push(e.message);
  const onResponse=r=>{if(r.status()>=400&&!r.url().endsWith('/favicon.ico'))responses.push({url:r.url(),status:r.status()})};
  page.on('pageerror',onError);page.on('response',onResponse);
  await page.goto('http://127.0.0.1:8879'+route);
  await page.waitForSelector('[data-overflow-nav-ready="true"]');
  if(route==='/docs/'){
   await page.locator('[data-preset="many"]').click();
   await page.locator('[data-labels]').selectOption('de');
  }
  await page.waitForFunction(()=>Number(document.querySelector('[data-a11y-overflow-nav]').dataset.overflowCount)>0);
  await page.evaluate(()=>{const r=document.querySelector('[data-a11y-overflow-nav]');window.__auditItems=[...r.querySelectorAll('[data-overflow-nav-list]>[data-overflow-nav-item]'),...r.querySelectorAll('[data-overflow-nav-overflow-list]>[data-overflow-nav-item]')];});
  const trigger=page.locator('[data-overflow-nav-menu]>button');
  await trigger.click();await trigger.press('ArrowDown');await page.keyboard.press('End');await page.waitForTimeout(150);
  const end=await page.evaluate(()=>{
   const r=document.querySelector('[data-a11y-overflow-nav]'),m=r.querySelector('[data-overflow-nav-menu]'),b=m.querySelector('button'),p=document.getElementById(b.getAttribute('aria-controls')),a=document.activeElement,rect=a.getBoundingClientRect(),hit=document.elementFromPoint(rect.x+rect.width/2,rect.y+rect.height/2);
   const nodes=[...r.querySelectorAll('[data-overflow-nav-list]>[data-overflow-nav-item]'),...r.querySelectorAll('[data-overflow-nav-overflow-list]>[data-overflow-nav-item]')];
   return {active:a.textContent,expanded:b.getAttribute('aria-expanded'),visible:hit===a||a.contains(hit),focusVisible:a.matches(':focus-visible'),panelWidth:[p.clientWidth,p.scrollWidth],documentWidth:[document.documentElement.clientWidth,document.documentElement.scrollWidth],identity:nodes.length===window.__auditItems.length&&nodes.every((n,i)=>n===window.__auditItems[i]),placement:m.dataset.placement};
  });
  await page.keyboard.press('Home');await page.keyboard.press('Escape');
  const escape=await trigger.evaluate(b=>document.activeElement===b&&b.getAttribute('aria-expanded')==='false');
  const pass=end.expanded==='true'&&end.visible&&end.focusVisible&&end.identity&&end.panelWidth[0]===end.panelWidth[1]&&end.documentWidth[0]===end.documentWidth[1]&&escape&&!errors.length&&!responses.length;
  results.push({route,pass,end,escape,errors,responses});
  page.off('pageerror',onError);page.off('response',onResponse);
 }
 const report={browser:page.context().browser().version(),viewport:page.viewportSize(),results};
 if(results.some(x=>!x.pass))throw Error('Pages smoke assertion failed');
 return report;
}
