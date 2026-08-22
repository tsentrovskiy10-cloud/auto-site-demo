const selected=new Set();
const count=document.querySelector('#selectedCount');
const names=document.querySelector('#selectedNames');
document.querySelectorAll('.service').forEach(card=>card.addEventListener('click',()=>{
 const service=card.dataset.service;
 if(selected.has(service)){selected.delete(service);card.classList.remove('selected');card.querySelector('b').textContent='Выбрать +'}
 else{selected.add(service);card.classList.add('selected');card.querySelector('b').textContent='Выбрано ✓'}
 count.textContent=selected.size;
 names.textContent=selected.size?[...selected].join(' · '):'Можно выбрать в разделе выше';
}));

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
 if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}
}),{threshold:.12,rootMargin:'0px 0px -6%'});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const glow=document.querySelector('.cursor-glow');
window.addEventListener('pointermove',event=>{glow.style.left=event.clientX+'px';glow.style.top=event.clientY+'px'});

document.querySelector('#leadForm').addEventListener('submit',event=>{
 event.preventDefault();
 const data=new FormData(event.currentTarget);
 const message=[
  'Здравствуйте! Хочу получить расчёт работ в «НА БРОНЕ».',
  `Имя: ${data.get('name')}`,
  `Телефон: ${data.get('phone')}`,
  data.get('car')?`Автомобиль: ${data.get('car')}`:'',
  selected.size?`Услуги: ${[...selected].join(', ')}`:'',
  data.get('task')?`Задача: ${data.get('task')}`:''
 ].filter(Boolean).join('\n');
 window.open(`https://wa.me/79030707090?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer');
});

document.querySelector('.menu').addEventListener('click',()=>document.querySelector('#services').scrollIntoView({behavior:'smooth'}));
