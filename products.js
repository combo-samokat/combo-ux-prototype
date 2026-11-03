const categories=['Завтраки','Супы','Второе','Салаты','Роллы','Выпечка','Десерты','Закуски'];
const products=[];
function add(category,title,weight,asset,options={}){products.push({id:products.length,category,title,weight,asset,price:164,old:188,...options});}
add('Завтраки','Сырники Шоколадница','180 г','syrniki.png',{price:119,old:140,like:true});
add('Завтраки','Творожная запеканка Самокат','100 г','456-5231-imgImage.png',{price:153,old:180,like:true});
add('Завтраки','Овсяная каша Самокат, с клубникой и кешью','120 г','456-5231-imgImage1.png',{price:112,old:132,like:true});
add('Завтраки','Омлет Самокат, с индейкой','','category/4af9f.png',{price:163,old:192,like:true});
add('Супы','Вегетарианский борщ Самокат','300 г','456-5183-imgRectangle229.png',{price:153,old:180});
add('Супы','Куриный суп-лапша','300 г','456-5183-imgRectangle223.png',{price:170,old:200});
add('Супы','Мясная солянка','300 г','solyanka.png',{price:204,old:240});
add('Супы','Сырный суп Самокат, с курицей','270 г','cheese-soup.png',{price:187,old:220});
add('Второе','Вок с курицей и овощами','250 г','456-5193-imgRectangle223.png',{price:255,old:300});
add('Второе','Традиционный плов','250 г','456-5193-imgRectangle224.png',{price:221,old:260});
add('Второе','Гречневая лапша Самокат, с куриной грудкой','250 г','buckwheat-noodles.png',{price:238,old:280});
add('Второе','Котлета в соусе с фасолью','250 г','cutlet-beans.png',{price:204,old:240});
add('Салаты','Цезарь с курицей','190 г','456-5202-imgImage.png',{price:255,old:300});
add('Салаты','Салат Микс с соусом','180 г','456-5202-imgImage1.png',{price:187,old:220});
add('Роллы','Чёрный ролл Самокат, с куриными стрипсами','170 г','456-5209-img.png',{price:255,old:300});
add('Роллы','Рулетик с филе сёмги','150 г','456-5209-img202601271505381.png',{price:323,old:380,crop:true});



// Products and photos from the user-saved Samokat pages.
add("Выпечка","Круассан Самокат, на сливочном масле, без начинки","50 г","catalog/2199588000002_1.jpg",{"price": 118, "old": 139, "id": 20});
add("Выпечка","Круассан Самокат, с миндалём и вишней","120 г","catalog/4630388525169_1.jpg",{"price": 144, "old": 169, "id": 21});
add("Выпечка","Круассан Самокат, с малиной","100 г","catalog/4630388444293_1.jpg",{"price": 183, "old": 215, "id": 22});
add("Выпечка","Улитка Самокат, с корицей и попкорном","125 г","catalog/4630388525688_2.jpg",{"price": 161, "old": 189, "id": 23});
add("Десерты","Чизкейк Самокат","100 г","catalog/4680662768065_1.jpg",{"price": 179, "old": 211, "id": 24});
add("Десерты","Медовик Самокат, с варёным сгущённым молоком","100 г","catalog/4680068870669_1.jpg",{"price": 201, "old": 237, "id": 25});
add("Десерты","Пирожное картошка Самокат, с варёным сгущённым молоком","150 г","catalog/4660301708522_1.jpg",{"price": 275, "old": 323, "id": 26});
add("Десерты","Малиновый чизкейк Самокат, с печеньем","110 г","catalog/4630388522984_1.jpg",{"price": 201, "old": 237, "id": 27});
add("Закуски","Круассан Самокат, с куриной грудкой и плавленым сыром","115 г","catalog/4660301756370_1.jpg",{"price": 239, "old": 281, "id": 28});
add("Закуски","Круассан Самокат, с ветчиной и сыром","115 г","catalog/4660301756363-1.jpg",{"price": 239, "old": 281, "id": 29});
add("Закуски","Круассан Самокат, с курицей и салатом цезарь","115 г","catalog/4680662783976_1.jpg",{"price": 201, "old": 237, "id": 30});
add("Закуски","Конвертики Самокат, с говядиной в соусе «кимчи»","140 г","catalog/4630388393256_1.jpg",{"price": 238, "old": 280, "id": 31});

function comboTotals(quantities){
 const rows=products.filter(p=>Number(quantities[p.id])>0).map(p=>({...p,quantity:Math.max(0,Math.floor(Number(quantities[p.id])))}));
 const count=rows.reduce((n,p)=>n+p.quantity,0),discount=count>=4?20:count>=2?15:0;
 let running=0,discounted=0;
 for(const p of rows){p.original=p.price*p.quantity;running+=p.original;const next=Math.round(running*(100-discount)/100);p.total=next-discounted;discounted=next;}
 return {rows,count,discount,original:running,total:discounted};
}
