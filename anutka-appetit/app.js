const products=[
{id:1,name:'Пельмени домашние',cat:'dumplings',price:690,unit:'1 кг',desc:'Свинина и говядина, тонкое тесто',img:'assets/pelmeni.png',badge:'Хит'},
{id:2,name:'Пельмени из индейки',cat:'dumplings',price:760,unit:'1 кг',desc:'Нежная индейка и ароматный бульон',img:'assets/pelmeni.png'},
{id:3,name:'Вареники с картофелем',cat:'dumplings',price:520,unit:'1 кг',desc:'Картофель, жареный лук, сливочное масло',img:'assets/pelmeni.png'},
{id:4,name:'Вареники с творогом',cat:'dumplings',price:590,unit:'1 кг',desc:'Натуральный творог и тонкое тесто',img:'assets/pelmeni.png'},
{id:5,name:'Сырники',cat:'breakfast',price:490,unit:'600 г',desc:'Много творога, минимум муки',img:'assets/breakfast.png',badge:'Любимые'},
{id:6,name:'Блинчики с мясом',cat:'breakfast',price:560,unit:'700 г',desc:'Тонкие блины и сочная мясная начинка',img:'assets/breakfast.png'},
{id:7,name:'Блинчики с творогом',cat:'breakfast',price:520,unit:'700 г',desc:'Сливочная начинка и ваниль',img:'assets/breakfast.png'},
{id:8,name:'Котлеты домашние',cat:'meat',price:650,unit:'800 г',desc:'Свинина и говядина, ручная лепка',img:'assets/hero.png'},
{id:9,name:'Тефтели',cat:'meat',price:630,unit:'800 г',desc:'Для быстрого семейного ужина',img:'assets/hero.png'},
{id:10,name:'Зразы с грибами',cat:'meat',price:690,unit:'800 г',desc:'Мясная оболочка и грибная начинка',img:'assets/hero.png'},
{id:11,name:'Набор «Семейный»',cat:'sets',price:2190,unit:'4 кг',desc:'Пельмени, вареники, сырники и котлеты',img:'assets/hero.png',badge:'Выгодно'},
{id:12,name:'Набор «Неделя без хлопот»',cat:'sets',price:3290,unit:'6 кг',desc:'Шесть домашних блюд для всей семьи',img:'assets/hero.png'}];
let cart=JSON.parse(localStorage.getItem('anutka-cart')||'[]');
const money=n=>new Intl.NumberFormat('ru-RU').format(n)+' ₽';
function card(p){return `<article class="product" data-cat="${p.cat}"><div class="product-img"><img src="${p.img}" alt="${p.name}" loading="lazy">${p.badge?`<span class="badge">${p.badge}</span>`:''}</div><div class="product-body"><h3>${p.name}</h3><p>${p.desc}</p><div class="price-row"><div><span class="price">${money(p.price)}</span><small> / ${p.unit}</small></div><button class="add" data-add="${p.id}" aria-label="Добавить ${p.name} в корзину">+</button></div></div></article>`}
function renderProducts(limit){const root=document.querySelector('[data-products]');if(root)root.innerHTML=products.slice(0,limit||products.length).map(card).join('')}
function renderCart(){document.querySelectorAll('.count').forEach(x=>x.textContent=cart.length);const root=document.querySelector('.cart-items');if(!root)return;if(!cart.length){root.innerHTML='<div class="empty">Корзина пока пуста.<br>Добавьте что-нибудь вкусное.</div>'}else root.innerHTML=cart.map((id,i)=>{const p=products.find(x=>x.id===id);return `<div class="cart-item"><div><b>${p.name}</b><br><small>${p.unit}</small></div><div><b>${money(p.price)}</b><br><button class="remove" data-remove="${i}">убрать</button></div></div>`}).join('');const total=cart.reduce((s,id)=>s+products.find(x=>x.id===id).price,0);document.querySelector('[data-total]').textContent=money(total);localStorage.setItem('anutka-cart',JSON.stringify(cart))}
function toggleCart(open){document.querySelector('.cart')?.classList.toggle('open',open);document.querySelector('.overlay')?.classList.toggle('show',open);document.body.classList.toggle('lock',open)}
document.addEventListener('click',e=>{const add=e.target.closest('[data-add]');if(add){cart.push(+add.dataset.add);renderCart();toggleCart(true)}const rem=e.target.closest('[data-remove]');if(rem){cart.splice(+rem.dataset.remove,1);renderCart()}if(e.target.closest('[data-cart]'))toggleCart(true);if(e.target.closest('[data-close],.overlay')){toggleCart(false);document.querySelector('.mobile-nav')?.classList.remove('open')}if(e.target.closest('[data-menu]'))document.querySelector('.mobile-nav')?.classList.add('open')});
document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));btn.classList.add('active');document.querySelectorAll('.product').forEach(x=>x.hidden=btn.dataset.filter!=='all'&&x.dataset.cat!==btn.dataset.filter)}));
renderProducts(document.body.dataset.home?8:undefined);renderCart();
document.querySelector('[data-checkout]')?.addEventListener('click',()=>alert('Демонстрационный магазин: оформление заказа будет подключено после согласования проекта.'));
