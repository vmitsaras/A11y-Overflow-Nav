(async()=>{
 const root=document.querySelector('[data-a11y-overflow-nav]');
 while(root.dataset.overflowNavReady!=='true')await new Promise(requestAnimationFrame);
 const menu=root.querySelector('[data-overflow-nav-menu]'),trigger=menu.querySelector('button'),panel=document.getElementById(trigger.getAttribute('aria-controls'));
 const list=root.querySelector('[data-overflow-nav-list]'),overflow=root.querySelector('[data-overflow-nav-overflow-list]');
 const nodes=()=>[...list.children,...overflow.children].filter(x=>x.matches('[data-overflow-nav-item]'));
 const originals=nodes();let sequence=0;
 const record=(type,reason=null)=>{const a=document.activeElement;const data={time:new Date().toISOString(),sequence:++sequence,variant:new URLSearchParams(location.search).get('variant')||'original',type,reason,ua:navigator.userAgent,viewport:[innerWidth,innerHeight],dpr:devicePixelRatio,font:getComputedStyle(document.body).fontSize,scrollY,active:a.tagName+':'+a.textContent.trim().slice(0,50),expanded:trigger.getAttribute('aria-expanded'),placement:menu.dataset.placement,availableHeight:menu.style.getPropertyValue('--_panel-max-height'),panelRect:panel.getBoundingClientRect().toJSON(),panelMaxHeight:getComputedStyle(panel).maxHeight,panelScrollTop:panel.scrollTop,triggerRect:trigger.getBoundingClientRect().toJSON(),identity:nodes().every((el,i)=>el===originals[i])};fetch('/__trace',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});};
 for(const name of ['menu-button:before-open','menu-button:open','menu-button:before-close','menu-button:close','menu-button:refresh','overflow-nav:change','overflow-nav:refresh'])root.addEventListener(name,e=>record(name,e.detail?.reason));
 document.addEventListener('focusin',()=>record('focusin'));
 document.addEventListener('keydown',e=>{record('keydown',e.key);setTimeout(()=>record('after-key',e.key),350)});
 window.addEventListener('scroll',e=>record('scroll',e.target===document?'document':e.target.tagName),true);
 record('ready');
})();
