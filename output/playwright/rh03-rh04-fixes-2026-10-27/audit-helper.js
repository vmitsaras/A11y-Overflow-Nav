(async()=>{
 document.title='Overflow native text audit | '+document.title;
 const root=document.querySelector('[data-a11y-overflow-nav]');if(!root)return;
 while(root.dataset.overflowNavReady!=='true')await new Promise(requestAnimationFrame);
 const list=root.querySelector('[data-overflow-nav-list]'),overflow=root.querySelector('[data-overflow-nav-overflow-list]'),menu=root.querySelector('[data-overflow-nav-menu]'),trigger=menu.querySelector('button'),panel=document.getElementById(trigger.getAttribute('aria-controls'));
 const originals=[...list.children,...overflow.children].filter(el=>el.hasAttribute('data-overflow-nav-item'));
 const box=document.createElement('div');box.dataset.textZoomCalibration='';box.style.cssText='position:fixed;left:-10000px;top:0;width:100px;height:20px;font:16px Arial;white-space:nowrap;';const span=document.createElement('span');span.textContent='MMMMMMMMMM';span.style.display='inline-block';box.append(span);document.body.append(box);
 let sequence=0;let timer;
 const record=(reason)=>{
  const range=document.createRange();range.selectNodeContents(span);const active=document.activeElement,rect=active.getBoundingClientRect(),hit=document.elementFromPoint(rect.left+rect.width/2,rect.top+rect.height/2),ps=getComputedStyle(panel),as=getComputedStyle(active),ls=getComputedStyle(root.querySelector('a'));
  const combined=[...list.children,...overflow.children].filter(el=>el.hasAttribute('data-overflow-nav-item'));
  const data={time:new Date().toISOString(),sequence:++sequence,reason,path:location.pathname,case:new URLSearchParams(location.search).get('case')||'default',stage:new URLSearchParams(location.search).get('stage')||'100',locale:document.querySelector('[data-labels]')?.value||'en',triggerText:trigger.textContent.trim(),placement:menu.dataset.placement,ua:navigator.userAgent,viewport:[innerWidth,innerHeight],dpr:devicePixelRatio,pageWidths:[document.documentElement.clientWidth,document.documentElement.scrollWidth],calibration:{authorFont:box.style.fontSize,computedFont:getComputedStyle(span).fontSize,textRect:range.getBoundingClientRect().toJSON(),fixedBox:box.getBoundingClientRect().toJSON()},linkFont:ls.fontSize,overflow:Number(root.dataset.overflowCount),order:combined.map(el=>el.querySelector('a').hash),identity:combined.length===originals.length&&combined.every((el,i)=>el===originals[i]),expanded:trigger.getAttribute('aria-expanded'),active:{tag:active.tagName,text:active.textContent.trim().slice(0,80),href:active.getAttribute('href'),visible:hit===active||active.contains(hit),focusVisible:active.matches(':focus-visible'),outline:as.outline},panel:{rect:panel.getBoundingClientRect().toJSON(),clientWidth:panel.clientWidth,scrollWidth:panel.scrollWidth,maxHeight:ps.maxHeight,overflowY:ps.overflowY},lastEvent:document.querySelector('[data-event-log] li')?.textContent||null};
  fetch('/__audit/event',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)}).catch(()=>{});
 };
 const schedule=(reason)=>{clearTimeout(timer);timer=setTimeout(()=>record(reason),250);};
 const observer=new ResizeObserver(()=>schedule('native-font-or-layout-resize'));observer.observe(span);observer.observe(list);observer.observe(panel);
 document.addEventListener('focusin',()=>schedule('focus'));document.addEventListener('keydown',event=>schedule('key:'+event.key));window.addEventListener('resize',()=>schedule('window-resize'));
 for(const name of ['overflow-nav:change','overflow-nav:refresh','menu-button:open','menu-button:close'])root.addEventListener(name,()=>schedule(name));
 const config=new URLSearchParams(location.search).get('case');
 if(config==='many')document.querySelector('[data-preset="many"]')?.click();
 if(config==='narrow')document.querySelector('[data-demo-resize]')?.click();
 if(['de','el','long'].includes(config)){document.querySelector('[data-preset="many"]')?.click();const select=document.querySelector('[data-labels]');select.value=config;select.dispatchEvent(new Event('change'));}
 if(config==='top')trigger.scrollIntoView({block:'end'});
 schedule('ready');
})();
