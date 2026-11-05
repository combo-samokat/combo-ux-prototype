const categories=['Завтраки','Супы','Второе','Салаты','Роллы','Выпечка','Десерты','Закуски'];
const products=[];
function add(category,title,weight,asset,options={}){products.push({id:products.length,category,title,weight,asset,price:164,old:188,...options});}
add('Завтраки','Сырники Шоколадница','180 г','optimized/6017f61f6689edac.webp',{price:119,old:140,like:true});
add('Завтраки','Творожная запеканка Самокат','100 г','optimized/ac370644346bc31a.webp',{price:153,old:180,like:true});
add('Завтраки','Овсяная каша Самокат, с клубникой и кешью','120 г','optimized/eaf62129a93011ab.webp',{price:112,old:132,like:true});
add('Завтраки','Омлет Самокат, с индейкой','','optimized/6bb7f6a2ae00a956.webp',{price:163,old:192,like:true});
add('Супы','Вегетарианский борщ Самокат','300 г','optimized/323bf6712955e91c.webp',{price:153,old:180});
add('Супы','Куриный суп-лапша','300 г','optimized/044438eed787ecb7.webp',{price:170,old:200});
add('Супы','Мясная солянка','300 г','optimized/199782e18b63c3c3.webp',{price:204,old:240});
add('Супы','Сырный суп Самокат, с курицей','270 г','optimized/636b6e0321391bf9.webp',{price:187,old:220});
add('Второе','Вок с курицей и овощами','250 г','optimized/4bb3b68ae26d1bcf.webp',{price:255,old:300});
add('Второе','Традиционный плов','250 г','optimized/ffb2040d5ebf6cfc.webp',{price:221,old:260});
add('Второе','Гречневая лапша Самокат, с куриной грудкой','250 г','optimized/583357b8cfa361ad.webp',{price:238,old:280});
add('Второе','Котлета в соусе с фасолью','250 г','optimized/6bdfd94c3f1874f6.webp',{price:204,old:240});
add('Салаты','Цезарь с курицей','190 г','optimized/6f42379a478acc1a.webp',{price:255,old:300});
add('Салаты','Салат Микс с соусом','180 г','optimized/3656c099bd6fe1d0.webp',{price:187,old:220});
add('Роллы','Чёрный ролл Самокат, с куриными стрипсами','170 г','optimized/a53ce2263b904deb.webp',{price:255,old:300});
add('Роллы','Рулетик с филе сёмги','150 г','optimized/0cd3127c943969a5.webp',{price:323,old:380,crop:true});



// Products and photos from the user-saved Samokat pages.
add("Выпечка","Круассан Самокат, на сливочном масле, без начинки","50 г","optimized/e30f9a2f7033de89.webp",{"price": 118, "old": 139, "id": 20});
add("Выпечка","Круассан Самокат, с миндалём и вишней","120 г","optimized/8d056a150c48d6b0.webp",{"price": 144, "old": 169, "id": 21});
add("Выпечка","Круассан Самокат, с малиной","100 г","optimized/9724e8aa6884716d.webp",{"price": 183, "old": 215, "id": 22});
add("Выпечка","Улитка Самокат, с корицей и попкорном","125 г","optimized/e528f62721ed0b6e.webp",{"price": 161, "old": 189, "id": 23});
add("Десерты","Чизкейк Самокат","100 г","optimized/1c60faa28f2cc111.webp",{"price": 179, "old": 211, "id": 24});
add("Десерты","Медовик Самокат, с варёным сгущённым молоком","100 г","optimized/38e17d8468a2344c.webp",{"price": 201, "old": 237, "id": 25});
add("Десерты","Пирожное картошка Самокат, с варёным сгущённым молоком","150 г","optimized/28801a8455586252.webp",{"price": 275, "old": 323, "id": 26});
add("Десерты","Малиновый чизкейк Самокат, с печеньем","110 г","optimized/7dca1304a539ec85.webp",{"price": 201, "old": 237, "id": 27});
add("Закуски","Круассан Самокат, с куриной грудкой и плавленым сыром","115 г","optimized/6cf94d42b4951dac.webp",{"price": 239, "old": 281, "id": 28});
add("Закуски","Круассан Самокат, с ветчиной и сыром","115 г","optimized/9012f7bc4015b0f9.webp",{"price": 239, "old": 281, "id": 29});
add("Закуски","Круассан Самокат, с курицей и салатом цезарь","115 г","optimized/00f88bf44a1fa1af.webp",{"price": 201, "old": 237, "id": 30});
add("Закуски","Конвертики Самокат, с говядиной в соусе «кимчи»","140 г","optimized/0a40d494e82d4df3.webp",{"price": 238, "old": 280, "id": 31});

function comboTotals(quantities){
 const rows=products.filter(p=>Number(quantities[p.id])>0).map(p=>({...p,quantity:Math.max(0,Math.floor(Number(quantities[p.id])))}));
 const count=rows.reduce((n,p)=>n+p.quantity,0),discount=count>=4?20:count>=2?15:0;
 let running=0,discounted=0;
 for(const p of rows){p.original=p.price*p.quantity;running+=p.original;const next=Math.round(running*(100-discount)/100);p.total=next-discounted;discounted=next;}
 return {rows,count,discount,original:running,total:discounted};
}
