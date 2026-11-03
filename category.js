// Arriving at the cover page ends the current constructor selection.
window.addEventListener('pageshow',()=>{
 try{
  const saved=JSON.parse(localStorage.getItem('combo-selection-v3')||'{}');
  localStorage.setItem('combo-selection-v3',JSON.stringify({...saved,quantities:{},selectionOrder:[]}));
 }catch{}
});

document.addEventListener('click',event=>{
 const like=event.target.closest('.food-like');if(like)like.setAttribute('aria-pressed',String(like.getAttribute('aria-pressed')!=='true'));
 const add=event.target.closest('.food-add');if(add){const count=Number(add.dataset.count||0)+1;add.dataset.count=count;add.firstChild.textContent=count+' шт. '; }
});
