document.documentElement.classList.add('js');
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const VK = 'https://vk.me/vera_permanent1';

/* header */
(function(){
  const h = $('header.top'); if(!h) return;
  let last = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    if (y > 240 && y > last + 6 && !$('#mnav.open')) h.classList.add('hide');
    else if (y < last - 6 || y < 120) h.classList.remove('hide');
    last = y;
  }, {passive:true});
  const b = $('#burger'), m = $('#mnav');
  if (b && m) {
    b.addEventListener('click', () => { m.classList.toggle('open'); b.classList.toggle('open'); document.body.classList.toggle('lock', m.classList.contains('open')); });
    m.addEventListener('click', e => { if (e.target.closest('a,button')) { m.classList.remove('open'); b.classList.remove('open'); document.body.classList.remove('lock'); } });
  }
})();

/* reveal */
(function(){
  const els = $$('.rv');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), {threshold:.1, rootMargin:'0px 0px -40px 0px'});
  els.forEach(e => io.observe(e));
})();

/* counters */
(function(){
  const els = $$('[data-count]'); if (!els.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return; io.unobserve(en.target);
    const el = en.target, to = +el.dataset.count, suf = el.dataset.suf || '', dur = 1400, t0 = performance.now();
    const fmt = n => n.toLocaleString('ru-RU').replace(/ /g, ' ');
    (function tick(t){ const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(Math.round(to * e)) + suf; if (p < 1) requestAnimationFrame(tick); })(t0);
  }), {threshold:.6});
  els.forEach(e => io.observe(e));
})();

/* cursor */
(function(){
  if (matchMedia('(hover:none)').matches || innerWidth < 981) return;
  const c = document.createElement('div'); c.className = 'cur'; document.body.appendChild(c);
  let x = 0, y = 0, cx = 0, cy = 0;
  addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; c.classList.add('on'); });
  (function loop(){ cx += (x - cx) * .18; cy += (y - cy) * .18; c.style.transform = `translate(${cx - 17}px,${cy - 17}px)`; requestAnimationFrame(loop); })();
  document.addEventListener('mouseover', e => { c.classList.toggle('big', !!e.target.closest('a,button,.gi,.jcard,.svc')); });
})();

/* booking modal */
(function(){
  const veil = $('#book'); if (!veil) return;
  const sel = $('#bkService');
  function open(topic){
    if (topic && sel) { const o = [...sel.options].find(o => o.value === topic); if (o) sel.value = topic; }
    veil.classList.add('on'); document.body.classList.add('lock');
    setTimeout(() => { const f = $('#bkName', veil); f && f.focus({preventScroll:true}); }, 80);
  }
  function close(){ veil.classList.remove('on'); document.body.classList.remove('lock'); }
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-book]');
    if (t) { e.preventDefault(); const m = $('#mnav'); if (m) { m.classList.remove('open'); $('#burger').classList.remove('open'); } open(t.dataset.book); return; }
    if (e.target === veil || e.target.closest('#bookX')) close();
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();
function sendForm(prefix){
  const g = id => { const el = document.getElementById(prefix + id); return el ? el.value.trim() : ''; };
  let text = 'Здравствуйте! Хочу записаться на консультацию.';
  if (g('Service')) text += ` Интересует: ${g('Service')}.`;
  if (g('Name')) text += ` Меня зовут ${g('Name')}.`;
  if (g('Phone')) text += ` Телефон: ${g('Phone')}.`;
  if (g('Time')) text += ` Удобное время: ${g('Time')}.`;
  if (g('Note')) text += ` Комментарий: ${g('Note')}`;
  window.open(VK + '?text=' + encodeURIComponent(text), '_blank');
}
window.sendForm = sendForm;

/* faq */
$$('.fq button').forEach(b => b.addEventListener('click', () => {
  const p = b.parentElement, was = p.classList.contains('open');
  $$('.fq').forEach(x => x.classList.remove('open')); if (!was) p.classList.add('open');
  b.setAttribute('aria-expanded', !was);
}));

/* portfolio */
(function(){
  const gal = $('#gal'); if (!gal) return;
  const items = $$('.gi', gal);
  const btns = $$('.fbtn');
  btns.forEach(b => b.addEventListener('click', () => {
    btns.forEach(x => x.classList.remove('on')); b.classList.add('on');
    const c = b.dataset.f;
    items.forEach(i => i.classList.toggle('hide', c !== 'all' && i.dataset.cat !== c));
  }));
  const lb = $('#lb'), im = $('#lbImg'), cap = $('#lbCap');
  let list = [], idx = 0;
  function show(){ const it = list[idx]; im.src = it.dataset.src; im.alt = it.dataset.cap; cap.textContent = it.dataset.cap + '  ·  ' + (idx + 1) + ' / ' + list.length; }
  function open(el){ list = items.filter(i => !i.classList.contains('hide')); idx = list.indexOf(el); show(); lb.classList.add('on'); document.body.classList.add('lock'); }
  function close(){ lb.classList.remove('on'); document.body.classList.remove('lock'); }
  const step = d => { idx = (idx + d + list.length) % list.length; show(); };
  items.forEach(i => i.addEventListener('click', () => open(i)));
  $('#lbX').addEventListener('click', close); $('#lbP').addEventListener('click', () => step(-1)); $('#lbN').addEventListener('click', () => step(1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  addEventListener('keydown', e => { if (!lb.classList.contains('on')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1); });
  let sx = 0; lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, {passive:true});
  lb.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); }, {passive:true});
  const hash = location.hash.replace('#', ''); if (hash) { const b = btns.find(x => x.dataset.f === hash); if (b) b.click(); }
})();

/* articles */
(function(){
  const box = $('#art'); if (!box) return;
  const body = $('#artBody');
  function open(id){ const t = document.getElementById('a-' + id); if (!t) return; body.innerHTML = t.innerHTML; box.classList.add('on'); document.body.classList.add('lock'); box.scrollTop = 0; history.replaceState(null, '', '#' + id); }
  function close(){ box.classList.remove('on'); document.body.classList.remove('lock'); history.replaceState(null, '', location.pathname); }
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-article]'); if (t) { open(t.dataset.article); return; }
    if (e.target.closest('#artX') || e.target === box) close();
  });
  addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('on')) close(); });
  const h = location.hash.replace('#', ''); if (h && document.getElementById('a-' + h)) open(h);
})();

/* quiz */
(function(){
  const root = $('#quiz'); if (!root) return;
  const Q = [
    {q:'Как кожа реагирует на солнце?', o:['Быстро розовеет или краснеет', 'Загорает ровно, с золотистым оттенком', 'По-разному, сложно сказать']},
    {q:'Какого цвета вены на запястье при дневном свете?', o:['Скорее синие или фиолетовые', 'Скорее зелёные или оливковые', 'Не могу понять, смесь']},
    {q:'Какое украшение вам идёт больше?', o:['Серебро и белое золото', 'Жёлтое золото и медь', 'Подходит и то, и другое']}
  ];
  const R = {
    cool:{t:'Скорее холодный подтон', p:'Розовые и голубоватые нотки в коже требуют особого внимания к цвету пигмента: слишком холодный оттенок со временем может «проседать» и давать серо-синий или пепельный тон. Мастер подберёт пигмент с учётом вашего подтона, чтобы результат выглядел благородно и естественно.'},
    warm:{t:'Скорее тёплый подтон', p:'Персиковые и золотистые нотки в коже хорошо дружат с мягкими тёплыми оттенками. Но даже у тёплого подтона важно учитывать цвет волос, глаз и желаемый образ, поэтому пигмент подбирается индивидуально.'},
    neutral:{t:'Скорее нейтральный подтон', p:'У вас сбалансированная кожа, к которой подходит широкий спектр оттенков. Главное — подобрать пигмент под цвет волос, глаз и желаемый образ: от максимально естественного до более выразительного.'}
  };
  let step = 0, score = {cool:0, warm:0, neutral:0};
  const box = $('#qbox', root);
  function render(){
    if (step < Q.length){
      const q = Q[step];
      box.innerHTML = `<div class="qprog">${Q.map((_, i) => `<i class="${i <= step ? 'on' : ''}"></i>`).join('')}</div><h3>${q.q}</h3><div class="qopts">${q.o.map((o, i) => `<button class="qopt" data-i="${i}"><span>${i + 1}</span>${o}</button>`).join('')}</div>`;
    } else {
      const k = Object.entries(score).sort((a, b) => b[1] - a[1])[0][0], r = R[k];
      box.innerHTML = `<div class="qres"><h3>${r.t}</h3><p>${r.p}</p><div class="row"><button class="btn btn-gold" data-book="Консультация и подбор оттенка">Уточнить на консультации</button><button class="btn btn-line" id="qagain">Пройти заново</button></div><p class="qnote">Это ориентир, а не диагноз: точный подтон определяет мастер при личной консультации.</p></div>`;
    }
  }
  box.addEventListener('click', e => {
    const o = e.target.closest('.qopt'); if (o){ score[['cool', 'warm', 'neutral'][+o.dataset.i]]++; step++; render(); return; }
    if (e.target.id === 'qagain'){ step = 0; score = {cool:0, warm:0, neutral:0}; render(); }
  });
  render();
})();

/* hero parallax */
(function(){
  const a = $('.hero-art'); if (!a || matchMedia('(hover:none)').matches) return;
  const els = $$('.glass, .arch', a);
  a.parentElement.addEventListener('mousemove', e => {
    const r = a.getBoundingClientRect(), dx = (e.clientX - r.left - r.width / 2) / r.width, dy = (e.clientY - r.top - r.height / 2) / r.height;
    els.forEach((el, i) => { const k = el.classList.contains('arch') ? 8 : 16 + i * 4; el.style.translate = `${dx * k}px ${dy * k}px`; });
  });
})();

$$('[data-year]').forEach(e => e.textContent = new Date().getFullYear());
