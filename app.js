// Each research URL keeps one price-animation variant across its success screen.
const rollPriceAnimation=document.body.dataset.priceAnimation==='roll';
const constructorPage=rollPriceAnimation?'combo-roll.html':'combo.html';
const successPage=rollPriceAnimation?'success-roll.html':'success.html';
// The success URL is a research milestone; the constructor remains visible.
document.addEventListener('click',event=>{
 if(!event.target.closest('button,a,input,select,textarea,[role="button"]'))return;
 clearTimeout(researchSuccessTimer);researchSuccessTimer=null;
 if(location.pathname.endsWith('/'+successPage)){
  history.replaceState(null,'',new URL(constructorPage,location.href));
 }
},true);
let researchSuccessTimer=null;
function checkResearchSuccess(previousCount){
 const count=Object.values(quantities).reduce((sum,q)=>sum+(Number(q)||0),0);
 if(count<4){clearTimeout(researchSuccessTimer);researchSuccessTimer=null;return;}
 if(previousCount<4&&researchSuccessTimer===null){
  researchSuccessTimer=setTimeout(()=>{save();history.pushState(null,'',new URL(successPage,location.href));researchSuccessTimer=null;},800);
 }
}
window.addEventListener('pagehide',()=>{clearTimeout(researchSuccessTimer);researchSuccessTimer=null;});
const A='assets/';
const progressWheel=document.querySelector('.numbers');
progressWheel.innerHTML='<div class="percentage-reel"><b id="discount">0</b><b>15</b><b>20</b></div>';
const progressSvg=document.createElementNS('http://www.w3.org/2000/svg','svg');
progressSvg.setAttribute('viewBox','0 0 40 40');progressSvg.setAttribute('class','progress-arc');progressSvg.setAttribute('aria-hidden','true');
progressSvg.innerHTML='<circle cx="20" cy="20" r="19" pathLength="100" /><circle class="progress-complete" cx="20" cy="20" r="19" />';
document.querySelector('.progress').append(progressSvg);
function animateProgress(count,discount){
 document.querySelector('.progress').classList.toggle('arc-empty',count===0);
 document.querySelector('.progress').classList.toggle('arc-complete',count>=5);
 const index=discount===20?2:discount===15?1:0;
 const reel=progressWheel.firstElementChild;
 reel.style.transform=`translateY(${-index*13}px)`;
 [...reel.children].forEach((row,i)=>row.classList.toggle('current',i===index));
 // Each of the five items fills 20% (72 degrees) of the circle.
 progressSvg.firstElementChild.style.strokeDashoffset=100-Math.max(0,Math.min(count,5))*20;
 document.querySelector('.progress').setAttribute('aria-label','Скидка '+discount+' процентов');
}

let quantities={},likes={},selectionOrder=[];
try{const saved=JSON.parse(localStorage.getItem('combo-selection-v3')||'{}');quantities=saved.quantities||{};likes=saved.likes||{};selectionOrder=Array.isArray(saved.selectionOrder)?saved.selectionOrder:[];}catch{}
// A study entry link starts a new selection without affecting cart return visits.
const studyEntryUrl=new URL(location.href);
if(studyEntryUrl.searchParams.get('start')==='1'&&location.pathname.endsWith('/'+constructorPage)){
 quantities={};selectionOrder=[];
 try{localStorage.setItem('combo-selection-v3',JSON.stringify({quantities,likes,selectionOrder}));}catch{}
 studyEntryUrl.searchParams.delete('start');
 history.replaceState(null,'',studyEntryUrl);
}
// Discard selections for products removed from the prototype.
for(const id of Object.keys(quantities))if(!products.some(p=>p.id===Number(id)))delete quantities[id];
const stockLimits={0:2};
for(const [id,limit] of Object.entries(stockLimits))if(quantities[id]>limit)quantities[id]=limit;
const catalog=document.querySelector('#catalog');
const nav=document.querySelector('#categories');let activeCategory='Завтраки';
nav.innerHTML=`<button class="sort-trigger" aria-label="Сортировка" aria-haspopup="dialog"><img src="${A}sorting.svg" width="16" height="16" alt=""></button>`+categories.map(c=>`<button data-category="${c}">${c}</button>`).join('');
function card(p){return `<article class="card" data-id="${p.id}"><div class="photo ${p.crop?'crop':''}"><img class="product-image" src="${A+p.asset}" alt="${p.title}" loading="lazy"><span class="photo-count" aria-hidden="true"><span class="count-value"></span></span><button class="like" aria-label="В избранное: ${p.title}" aria-pressed="${!!likes[p.id]}" data-like="${p.id}"><img src="${A}456-5222-imgInterfaceHeartFilled.svg" alt=""></button></div><div class="details"><h3 class="title">${p.title}</h3><div class="meta">${p.weight}${p.vegan?`<img src="${A}456-5222-imgDividerDot.svg" alt=""><span class="vegan">Веган</span>`:''}</div></div><div class="controls" data-controls="${p.id}"></div></article>`;}
catalog.innerHTML=categories.filter(c=>products.some(p=>p.category===c)).map((c,i)=>`<section id="category-${i}" data-section="${c}"><h2>${c}</h2><div class="grid">${products.filter(p=>p.category===c).map(card).join('')}</div></section>`).join('');
function save(){try{localStorage.setItem('combo-selection-v3',JSON.stringify({quantities,likes,selectionOrder}));}catch{}}
let comboActionMotion=null;
function moveComboAction(show){
 const button=document.querySelector('#combo-action');
 if(button.dataset.visible===String(show))return;
 button.dataset.visible=String(show);
 const from=button.hidden?'translate(-50%, 100%)':getComputedStyle(button).transform;
 comboActionMotion?.cancel();
 button.inert=!show;
 if(matchMedia('(prefers-reduced-motion: reduce)').matches){button.hidden=!show;return;}
 if(!show&&button.hidden)return;
 button.hidden=false;
 const motion=button.animate([{transform:from},{transform:show?'translate(-50%, 0)':'translate(-50%, 100%)'}],{duration:show?300:220,easing:'cubic-bezier(.2,.75,.25,1)',fill:'forwards'});
 comboActionMotion=motion;
 motion.finished.then(()=>{if(button.dataset.visible==='false')button.hidden=true;}).catch(()=>{});
}
// Local adaptations of Price Flow and NumberFlow for the comparison cards.
function animatePriceDigits(label,previous,price,rolling,singleStep=false){
 label.replaceChildren();
 label.setAttribute('aria-label',price+' ₽');
 const wrapper=document.createElement('span');
 wrapper.style.display='inline-flex';
 wrapper.style.verticalAlign='top';
 wrapper.setAttribute('aria-hidden','true');
 label.append(wrapper);
 const before=String(previous),after=String(price);
 const height=parseFloat(getComputedStyle(label).lineHeight)||18;
 [...after].forEach((digit,index)=>{
  const old=before[index];
  const cell=document.createElement('span');
  Object.assign(cell.style,{display:'inline-block',position:'relative',height:height+'px',overflow:'hidden'});
  const final=document.createElement('span');
  final.textContent=digit;
  cell.append(final);wrapper.append(cell);
  if(old===digit)return;
  final.style.visibility='hidden';
  const reel=document.createElement('span');
  Object.assign(reel.style,{position:'absolute',left:'0',top:'0',width:'100%',textAlign:'center'});
  let values;
  const up=rolling?price>previous:price<previous;
  if(rolling&&!singleStep){
   values=[Number(old)];
   while(values[values.length-1]!==Number(digit))values.push((values[values.length-1]+(up?1:9))%10);
  }else values=[Number(old),Number(digit)];
  if(!up)values.reverse();
  for(const value of values){
   const row=document.createElement('span');row.textContent=value;
   Object.assign(row.style,{display:'block',height:height+'px',lineHeight:height+'px'});reel.append(row);
  }
  cell.append(reel);
  if(rolling)cell.style.maskImage='linear-gradient(transparent,#000 15%,#000 85%,transparent)';
  const travel=(values.length-1)*height;
  const animation=reel.animate([{transform:`translateY(${up?0:-travel}px)`},{transform:`translateY(${up?-travel:0}px)`}],{duration:rolling?750:360,easing:rolling?'cubic-bezier(.16,1,.3,1)':'cubic-bezier(.2,.75,.25,1)'});
  animation.finished.then(()=>{final.style.visibility='';reel.remove();}).catch(()=>{});
 });
 const currency=document.createElement('span');currency.textContent='\u00a0₽';wrapper.append(currency);
}
// Animate every card price when the combo discount tier changes.
const displayedProductPrices=new Map();
function updateProductPrices(count){
 for(const product of products){
  const price=count>=4?Math.round(product.old*.8):product.price;
  const label=document.querySelector(`[data-controls="${product.id}"] > :first-child > span`);
  if(!label)continue;
  const previous=displayedProductPrices.get(product.id);
  displayedProductPrices.set(product.id,price);
  if(previous===price&&label.dataset.price===String(price))continue;
  label.getAnimations({subtree:true}).forEach(animation=>animation.cancel());
  label.replaceChildren();
  label.removeAttribute('aria-label');
  label.classList.add('animated-product-price');
  label.dataset.price=price;
  const incoming=document.createElement('span');
  incoming.textContent=price+' ₽';
  incoming.style.display='block';
  label.append(incoming);
  if(previous===undefined||previous===price||matchMedia('(prefers-reduced-motion: reduce)').matches)continue;
  const useDigitSwap=!rollPriceAnimation;
  const useDigitRoll=rollPriceAnimation;
  if(useDigitSwap||useDigitRoll){
   animatePriceDigits(label,previous,price,useDigitRoll);
   continue;
  }
  const outgoing=document.createElement('span');
  outgoing.textContent=previous+' ₽';
  outgoing.setAttribute('aria-hidden','true');
  Object.assign(outgoing.style,{position:'absolute',left:'0',top:'0',whiteSpace:'nowrap'});
  label.append(outgoing);
  const direction=price<previous?1:-1;
  const options={duration:360,easing:'cubic-bezier(.2,.75,.25,1)'};
  outgoing.animate([{transform:'translateY(0)',opacity:1},{transform:`translateY(${-direction*32}px)`,opacity:product.id===0?0:1}],options).finished.then(()=>outgoing.remove()).catch(()=>outgoing.remove());
  incoming.animate([{transform:`translateY(${direction*32}px)`,opacity:product.id===0?0:1},{transform:'translateY(0)',opacity:1}],options);
 }
}
function animateCardQuantity(article,number,previous,q){
 const overlay=number.parentElement;
 overlay.getAnimations().forEach(a=>a.cancel());
 number.getAnimations().forEach(a=>a.cancel());
 overlay.querySelectorAll('.departing-count').forEach(el=>el.remove());
 const duration=360,easing='cubic-bezier(.22,1,.36,1)';
 const travel=article.querySelector('.photo').clientHeight/2+36;
 const removing=Number(q)<Number(previous);
 const outgoingY=removing?travel:-travel;
 const incomingY=removing?-travel:travel;
 if(previous>0){
  const old=document.createElement('span');old.className='departing-count';old.textContent=previous;
  old.setAttribute('aria-hidden','true');overlay.append(old);
  old.animate([{transform:'translateY(0)'},{transform:`translateY(${outgoingY}px)`}],{duration,easing,fill:'forwards'}).finished.then(()=>old.remove()).catch(()=>old.remove());
 }
 if(q>0){
  number.animate([{transform:`translateY(${incomingY}px)`},{transform:'translateY(0)'}],{duration,easing});
 }else{
  number.textContent='';
  overlay.animate([{opacity:1,offset:0},{opacity:1,offset:.8},{opacity:0,offset:1}],{duration,easing:'linear'});
 }
}
function update(){let count=0;const selected=[];for(const p of products){const q=Number(quantities[p.id])||0;count+=q;for(let i=0;i<Math.min(q,5);i++)selected.push(p);const el=document.querySelector(`[data-controls="${p.id}"]`);const article=document.querySelector(`[data-id="${p.id}"]`);const previous=el.dataset.quantity===undefined?null:Number(el.dataset.quantity);
article.classList.toggle('selected',q>0);
article.classList.toggle('reference-count',p.id<4);
const soldOut=stockLimits[p.id]!==undefined&&q>=stockLimits[p.id];
article.classList.toggle('stock-exhausted',soldOut);
const number=article.querySelector('.count-value');
if(q>0)number.textContent=q;
if(stockLimits[p.id]!==undefined){
 let note=article.querySelector('.stock-note');
 if(!note){note=document.createElement('span');note.className='stock-note';note.textContent='Больше нет';number.parentElement.append(note);}
 note.hidden=!soldOut;
}
if(previous!==q){
const outgoing=el.firstElementChild;
const oldWidth=outgoing?.getBoundingClientRect().width;
el.innerHTML=q?`<div class="counter"><button data-change="-1" data-product="${p.id}" aria-label="Убрать один товар">−</button><span>${p.price} ₽</span><button data-change="1" data-product="${p.id}" aria-label="Добавить один товар">+</button></div>`:`<button class="purchase" data-change="1" data-product="${p.id}" aria-label="Добавить: ${p.title}">${p.old>p.price?`<s>${new Intl.NumberFormat('ru-RU',{maximumFractionDigits:2}).format(p.old)}</s>`:''}<span>${p.price} ₽</span><img src="${A}456-5222-imgInterface16Plus.svg" alt=""></button>`;
el.dataset.quantity=q;
if(previous!==null&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
const ease='cubic-bezier(.2,.75,.25,1)';
if(p.id<4){animateCardQuantity(article,number,previous,q);}else{
number.getAnimations().forEach(a=>a.cancel());
number.animate(q>0?[
{opacity:0,transform:`translateY(${previous>0?24:article.querySelector('.photo').clientHeight*.32}px) scale(.92)`},
{opacity:1,transform:'translateY(0) scale(1)'}
]:[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-24px)'}],{duration:q>0?280:180,easing:ease});
}
const incoming=el.firstElementChild;
const newWidth=incoming.getBoundingClientRect().width;
incoming.animate([{width:oldWidth+'px',backgroundColor:previous>0?'#ff2d64':'#ffebef'},{width:newWidth+'px',backgroundColor:q>0?'#ff2d64':'#ffebef'}],{duration:240,easing:ease});
for(const child of incoming.children)child.animate([{opacity:0,transform:'translateY(3px)'},{opacity:1,transform:'translateY(0)'}],{duration:200,easing:ease});
if(outgoing){
outgoing.classList.add('control-outgoing');outgoing.setAttribute('aria-hidden','true');outgoing.inert=true;el.append(outgoing);
outgoing.animate([{opacity:1},{opacity:0}],{duration:130,easing:'ease-out',fill:'forwards'}).finished.then(()=>outgoing.remove()).catch(()=>outgoing.remove());
}
}
}}

for(const p of products){
 const plus=document.querySelector(`[data-controls="${p.id}"] > .counter > [data-change="1"]`);
 if(plus)plus.disabled=stockLimits[p.id]!==undefined&&(quantities[p.id]||0)>=stockLimits[p.id];
}
updateProductPrices(count);
selectionOrder=selectionOrder.filter(id=>quantities[id]>0);
for(const p of products)if(quantities[p.id]>0&&!selectionOrder.includes(p.id))selectionOrder.push(p.id);
selected.sort((a,b)=>selectionOrder.indexOf(a.id)-selectionOrder.indexOf(b.id));
const discount=count>=4?20:count>=2?15:0;
animateProgress(count,discount);
document.querySelector('.promo').classList.toggle('is-full',count>=5);
const capsuleCopy=[
 'Выберите от 2 товаров<br>и\u00a0получите скидку 15%',
 'Выберите ещё товар<br>и\u00a0получите скидку 15%',
 'Выберите ещё 2 товара<br>и\u00a0получите скидку 20%',
 'Выберите ещё товар<br>и\u00a0получите скидку 20%',
 'Можно взять ещё один<br>товар со скидкой',
 'Вы собрали комбо!<br>Добавьте его в корзину'
];
document.querySelector('#offer').innerHTML=capsuleCopy[Math.max(0,Math.min(5,count))];
document.querySelector('#selection').innerHTML=Array.from({length:5},(_,i)=>`<span class="slot">${selected[i]?`<img src="${A+selected[i].asset}" alt="${selected[i].title}">`:''}</span>`).join('');
const pricing=comboTotals(quantities);const total=pricing.total;
const action=document.querySelector('#combo-action');const showAction=count>=2&&count<=5;moveComboAction(showAction);
document.querySelector('.app').classList.toggle('has-combo-action',showAction);
document.querySelector('#combo-price').textContent=total+' ₽';
document.querySelector('#combo-original').textContent=pricing.original;
action.setAttribute('aria-label','Стоимость комбо: '+count+' товара, '+total+' рублей');
if(basket.open)renderBasket();
save();}
function toast(text){const el=document.querySelector('#toast');el.textContent=text;el.classList.add('visible');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove('visible'),2200);}
document.addEventListener('click',e=>{const change=e.target.closest('[data-change]');if(change){const id=Number(change.dataset.product);const delta=Number(change.dataset.change);if(delta>0&&stockLimits[id]!==undefined&&(Number(quantities[id])||0)>=stockLimits[id])return;const count=Object.values(quantities).reduce((sum,q)=>sum+(Number(q)||0),0);if(delta>0&&count>=5){toast('В комбо можно выбрать до 5 товаров');return;}quantities[id]=Math.max(0,(Number(quantities[id])||0)+delta);if(delta>0){selectionOrder=selectionOrder.filter(item=>item!==id);selectionOrder.unshift(id);}update();checkResearchSuccess(count);}const like=e.target.closest('[data-like]');if(like){const id=like.dataset.like;likes[id]=!likes[id];like.setAttribute('aria-pressed',String(likes[id]));save();}const cat=e.target.closest('[data-category]');if(cat){const section=[...document.querySelectorAll('[data-section]')].find(s=>s.dataset.section===cat.dataset.category);if(section){section.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});activeCategory=cat.dataset.category;nav.querySelectorAll('[data-category]').forEach(b=>b.classList.toggle('active',nav.classList.contains('compact')&&b===cat));}else toast('В этой категории пока нет товаров');}});
document.querySelector('.back').onclick=()=>{quantities={};selectionOrder=[];save();location.href='index.html';};
const basket=document.querySelector('#basket');
function renderBasket(){
 const {rows:selected,count,discount}=comboTotals(quantities);
 document.querySelector('#basket-subtitle').textContent=discount?`Вместе на ${discount}% дешевле`:'Выберите от 2 товаров для скидки';
 document.querySelector('#basket-items').innerHTML=selected.length?selected.map(p=>`<div class="basket-row"><button class="basket-remove" data-remove="${p.id}" aria-label="Удалить ${p.title}">×</button><div class="basket-card"><img src="${A+p.asset}" alt=""><div class="basket-info"><h3>${p.title}</h3><p>${p.weight}</p><div class="basket-count"><button data-change="-1" data-product="${p.id}" aria-label="Уменьшить количество: ${p.title}">−</button><span>${quantities[p.id]}</span><button data-change="1" data-product="${p.id}" aria-label="Увеличить количество: ${p.title}">+</button></div></div><div class="basket-price"><s>${p.original}</s> ${p.total} ₽</div></div></div>`).join(''):'<p class="basket-empty">Вы пока не выбрали товары</p>';
 document.querySelector('#basket-return').textContent=count>=3?'Вернуться в комбо':'Выбрать что-нибудь ещё';
}
let basketClosing=false,previousOverflow='';
function openBasket(){
 if(basket.open)return;
 renderBasket();previousOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';basket.showModal();
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches)basket.animate([{transform:'translate(-50%,100%)'},{transform:'translate(-50%,0)'}],{duration:320,easing:'cubic-bezier(.2,.75,.25,1)'});
}
async function closeBasket(){
 if(basketClosing||!basket.open)return;basketClosing=true;
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches)await basket.animate([{transform:'translate(-50%,0)'},{transform:'translate(-50%,100%)'}],{duration:220,easing:'ease-in',fill:'forwards'}).finished.catch(()=>{});
 basket.close();basket.getAnimations().forEach(a=>a.cancel());basketClosing=false;
}
document.querySelector('#close-basket').onclick=closeBasket;
document.querySelector('#basket-return').onclick=closeBasket;
basket.addEventListener('cancel',e=>{e.preventDefault();closeBasket();});
basket.addEventListener('close',()=>{document.documentElement.style.overflow=previousOverflow;});
basket.addEventListener('click',e=>{const remove=e.target.closest('[data-remove]');if(remove){delete quantities[remove.dataset.remove];update();checkResearchSuccess(5);}if(e.target===basket){const r=basket.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeBasket();}});
let basketSwipe=null;
basket.addEventListener('pointerdown',e=>{const row=e.target.closest('.basket-row');if(row&&!e.target.closest('button'))basketSwipe={row,x:e.clientX,y:e.clientY};});
basket.addEventListener('pointerup',e=>{if(!basketSwipe)return;const {row,x,y}=basketSwipe;basketSwipe=null;if(Math.abs(e.clientY-y)<45&&Math.abs(e.clientX-x)>40)row.classList.toggle('reveal-remove',e.clientX<x);});
basket.addEventListener('pointercancel',()=>{basketSwipe=null;});
update();

// Keep layout space while the promo detaches into its floating capsule.
const promo=document.querySelector('.promo');
promo.addEventListener('click',openBasket);
promo.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openBasket();}});
const promoAnchor=document.createElement('div');promoAnchor.className='promo-anchor';promo.before(promoAnchor);promoAnchor.append(promo);
const navAnchor=document.createElement('div');navAnchor.className='nav-anchor';nav.before(navAnchor);navAnchor.append(nav);
function syncCloudHeight(){
 if(!nav.classList.contains('compact'))navAnchor.style.height=nav.getBoundingClientRect().height+'px';
}
syncCloudHeight();
new ResizeObserver(syncCloudHeight).observe(nav);

let capsuleFrame=0;
function syncCapsule(){
 capsuleFrame=0;
 syncCloudHeight();
 const pinnedBottom=88;
 const floating=promoAnchor.getBoundingClientRect().bottom<=pinnedBottom;
 nav.classList.toggle('compact',floating);
 if(floating){
  // Keep the category until its last card has left the unobscured viewport.
  const activationLine=192;
  const sections=[...document.querySelectorAll('[data-section]')];
  const visible=sections.find(section=>section.querySelector('.grid').getBoundingClientRect().bottom>activationLine)||sections.at(-1);
  const visibleCategory=visible.dataset.section;
  if(activeCategory!==visibleCategory||!nav.querySelector('.active')){
   activeCategory=visibleCategory;
   const chip=[...nav.querySelectorAll('[data-category]')].find(b=>b.dataset.category===activeCategory);
   if(chip){
    const left=chip.offsetLeft,right=left+chip.offsetWidth;
    if(left<nav.scrollLeft+64||right>nav.scrollLeft+nav.clientWidth-12)
     nav.scrollTo({left:Math.max(0,left-64),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
   }
  }
 }
 nav.querySelectorAll('[data-category]').forEach(b=>b.classList.toggle('active',floating&&b.dataset.category===activeCategory));
 if(promo.classList.contains('floating')!==floating){
  promo.classList.toggle('floating',floating);
  if(floating&&!nav.querySelector('.active'))nav.querySelector('[data-category]').classList.add('active');
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
   promo.getAnimations().forEach(a=>a.cancel());
   // Jitter trial: simultaneous linear grow-in and move, 150 ms.
   // Version 21 keeps the previous fade/move for a possible rollback.
   promo.animate(floating?[
    {transform:'translateX(-50%) translateY(-14px) scale(0)'},
    {transform:'translateX(-50%) translateY(0) scale(1)'}
   ]:[{opacity:0},{opacity:1}],{duration:floating?150:380,easing:floating?'cubic-bezier(0,0,1,1)':'cubic-bezier(.2,.75,.25,1)'});
  }
 }
}
function scheduleCapsule(){if(!capsuleFrame)capsuleFrame=requestAnimationFrame(syncCapsule);}
window.addEventListener('scroll',scheduleCapsule,{passive:true});
window.addEventListener('resize',scheduleCapsule);
syncCapsule();

// Native touch panning plus mouse dragging for the pinned category strip.
let chipDrag=null,blockChipClick=false;
nav.addEventListener('pointerdown',event=>{
 if(event.target.closest('.sort-trigger')||!nav.classList.contains('compact')||event.pointerType!=='mouse'||event.button!==0)return;
 blockChipClick=false;chipDrag={id:event.pointerId,x:event.clientX,start:nav.scrollLeft,dragging:false};
});
nav.addEventListener('pointermove',event=>{
 if(!chipDrag||event.pointerId!==chipDrag.id)return;
 const distance=event.clientX-chipDrag.x;
 if(!chipDrag.dragging&&Math.abs(distance)>5){chipDrag.dragging=true;nav.setPointerCapture(event.pointerId);nav.classList.add('dragging');}
 if(chipDrag.dragging){event.preventDefault();nav.scrollLeft=chipDrag.start-distance;}
});
function endChipDrag(event){if(!chipDrag||event.pointerId!==chipDrag.id)return;blockChipClick=chipDrag.dragging;nav.classList.remove('dragging');if(nav.hasPointerCapture(event.pointerId))nav.releasePointerCapture(event.pointerId);chipDrag=null;}
nav.addEventListener('pointerup',endChipDrag);nav.addEventListener('pointercancel',endChipDrag);
nav.addEventListener('pointerleave',event=>{if(chipDrag&&!chipDrag.dragging)endChipDrag(event);});
nav.addEventListener('click',event=>{if(blockChipClick){event.preventDefault();event.stopPropagation();blockChipClick=false;}},true);
nav.addEventListener('wheel',event=>{
 if(!nav.classList.contains('compact')||event.ctrlKey||Math.abs(event.deltaX)>=Math.abs(event.deltaY))return;
 const before=nav.scrollLeft;nav.scrollLeft+=event.deltaY;if(nav.scrollLeft!==before)event.preventDefault();
},{passive:false});

// The sort trigger remains pinned while its sibling category chips pan underneath it.
const sortSheet=document.createElement('dialog');
sortSheet.className='sort-sheet';sortSheet.setAttribute('aria-labelledby','sort-heading');
sortSheet.innerHTML=`<div class="sort-grip" aria-hidden="true"></div><h2 id="sort-heading">Расположить</h2><div role="radiogroup" aria-label="Порядок товаров"><button class="sort-option" data-sort="original" role="radio" aria-checked="true"><span><strong>На своём месте</strong><small>Покажем, как придумали сами</small></span><i aria-hidden="true"></i></button><button class="sort-option" data-sort="price" role="radio" aria-checked="false"><span><strong>По цене</strong><small>Сначала подешевле</small></span><i aria-hidden="true"></i></button></div>`;
document.body.append(sortSheet);
let sortMode='original',sortClosing=false;
const sortTrigger=nav.querySelector('.sort-trigger');
function showSort(){
 if(sortSheet.open)return;
 sortClosing=false;sortSheet.showModal();document.documentElement.style.overflow='hidden';sortTrigger.setAttribute('aria-expanded','true');
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches)sortSheet.animate([{transform:'translate(-50%,100%)'},{transform:'translate(-50%,0)'}],{duration:320,easing:'cubic-bezier(.2,.75,.25,1)'});
 sortSheet.querySelector('[aria-checked="true"]').focus({preventScroll:true});
}
async function closeSort(){
 if(!sortSheet.open||sortClosing)return;sortClosing=true;
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches)await sortSheet.animate([{transform:'translate(-50%,0)'},{transform:'translate(-50%,100%)'}],{duration:220,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'}).finished.catch(()=>{});
 sortSheet.close();sortSheet.getAnimations().forEach(a=>a.cancel());document.documentElement.style.overflow='';sortTrigger.setAttribute('aria-expanded','false');sortClosing=false;
}
function applySort(mode){
 sortMode=mode;
 for(const section of document.querySelectorAll('[data-section]')){
  const grid=section.querySelector('.grid');
  const items=products.filter(p=>p.category===section.dataset.section);
  if(mode==='price')items.sort((a,b)=>a.price-b.price||a.id-b.id);
  for(const p of items)grid.append(document.querySelector(`[data-id="${p.id}"]`));
 }
 sortSheet.querySelectorAll('[data-sort]').forEach(b=>b.setAttribute('aria-checked',String(b.dataset.sort===mode)));
 sortTrigger.classList.toggle('sorted',mode==='price');
}
sortTrigger.addEventListener('click',showSort);
sortSheet.addEventListener('click',event=>{
 const option=event.target.closest('[data-sort]');if(option){applySort(option.dataset.sort);closeSort();return;}
 if(event.target===sortSheet){const r=sortSheet.getBoundingClientRect();if(event.clientY<r.top||event.clientX<r.left||event.clientX>r.right)closeSort();}
});
sortSheet.addEventListener('cancel',event=>{event.preventDefault();closeSort();});
sortSheet.querySelector('[role="radiogroup"]').addEventListener('keydown',event=>{
 if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key))return;
 event.preventDefault();const buttons=[...sortSheet.querySelectorAll('[data-sort]')];const index=buttons.indexOf(document.activeElement);buttons[(index+1)%buttons.length].focus();
});

// Restore current selection after a browser Back/Forward cache return.
window.addEventListener('pageshow',event=>{
 if(!event.persisted)return;
 try{const saved=JSON.parse(localStorage.getItem('combo-selection-v3')||'{}');quantities=saved.quantities||{};selectionOrder=saved.selectionOrder||[];}catch{quantities={};selectionOrder=[];}
 update();
});

// Keep the floating capsule at the natural width of its empty-state copy.
function sizePromo(){
 const promo=document.querySelector('.promo'),offer=document.querySelector('#offer');
 const measure=offer.cloneNode(false);measure.removeAttribute('id');
 measure.innerHTML='Выберите от 2 товаров<br>и получите скидку 15%';
 const font=getComputedStyle(offer);
 Object.assign(measure.style,{position:'fixed',visibility:'hidden',width:'max-content',whiteSpace:'nowrap',fontFamily:font.fontFamily,fontSize:'11px',fontWeight:'600',lineHeight:'13px',letterSpacing:'-.11px',margin:'0'});
 document.body.append(measure);promo.style.setProperty('--promo-width',(measure.getBoundingClientRect().width+204)+'px');measure.remove();
}
sizePromo();document.fonts.ready.then(sizePromo);window.addEventListener('resize',sizePromo);
