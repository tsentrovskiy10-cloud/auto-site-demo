const brandButtons=document.querySelectorAll('.brand');brandButtons.forEach(b=>b.addEventListener('click',()=>window.location.reload()));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('on')}),{threshold:.12});document.querySelectorAll('.reveal').forEach(e=>io.observe(e));
const cursor=document.querySelector('.cursor');window.addEventListener('pointermove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px'});
document.querySelectorAll('a,button').forEach(e=>{e.addEventListener('mouseenter',()=>{cursor.style.width='46px';cursor.style.height='46px'});e.addEventListener('mouseleave',()=>{cursor.style.width='22px';cursor.style.height='22px'})});
const orbit=document.querySelector('.hero-orbit');window.addEventListener('pointermove',e=>{if(innerWidth<900)return;const x=(e.clientX/innerWidth-.5)*16,y=(e.clientY/innerHeight-.5)*16;orbit.style.marginLeft=x+'px';orbit.style.marginTop=y+'px'});
