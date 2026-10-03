document.documentElement.classList.add('js');
const SF = window.SF;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const BY = Object.fromEntries(SF.products.map(p => [p.id, p]));
const fmt = n => n.toLocaleString('ru-RU').replace(/ /g, ' ') + ' ₽';
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const IC = {
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1 12H6L5 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
};
const pdot = k => `<i style="background:${SF.palettes[k].dot}"></i>`;

/* ---------- header / menu ---------- */
(function () {
  const h = $('header.top'); if (!h) return;
  let last = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    if (y > 260 && y > last + 6 && !$('#mnav.open')) h.classList.add('hide');
    else if (y < last - 6 || y < 140) h.classList.remove('hide');
    last = y;
  }, {passive: true});
  const b = $('#burger'), m = $('#mnav');
  if (b && m) {
    b.addEventListener('click', () => { m.classList.toggle('open'); b.classList.toggle('open'); document.body.classList.toggle('lock', m.classList.contains('open')); });
    m.addEventListener('click', e => { if (e.target.closest('a,button')) { m.classList.remove('open'); b.classList.remove('open'); document.body.classList.remove('lock'); } });
  }
})();

/* ---------- reveal / counters / cursor ---------- */
(function () {
  const els = $$('.rv');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); }
  else {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), {threshold: .1, rootMargin: '0px 0px -40px 0px'});
    els.forEach(e => io.observe(e));
    window.__io = io;
  }
  const cs = $$('[data-count]');
  if (cs.length && 'IntersectionObserver' in window) {
    const io2 = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return; io2.unobserve(en.target);
      const el = en.target, to = +el.dataset.count, suf = el.dataset.suf || '', t0 = performance.now();
      (function tick(t) { const p = Math.min(1, (t - t0) / 1300), e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(to * e) + suf; if (p < 1) requestAnimationFrame(tick); })(t0);
    }), {threshold: .6});
    cs.forEach(e => io2.observe(e));
  }
  if (matchMedia('(hover:none)').matches || innerWidth < 981) return;
  const c = document.createElement('div'); c.className = 'cur'; document.body.appendChild(c);
  let x = 0, y = 0, cx = 0, cy = 0;
  addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; c.classList.add('on'); });
  (function loop() { cx += (x - cx) * .2; cy += (y - cy) * .2; c.style.transform = `translate(${cx - 17}px,${cy - 17}px)`; requestAnimationFrame(loop); })();
  document.addEventListener('mouseover', e => c.classList.toggle('big', !!e.target.closest('a,button,.media,.jcard,.occ a,.strip a')));
})();
function observeNew(root) { if (window.__io) $$('.rv:not(.in)', root).forEach(e => window.__io.observe(e)); else $$('.rv', root).forEach(e => e.classList.add('in')); }

/* ---------- toast ---------- */
function toast(msg) { const t = $('#toast'); if (!t) return; t.textContent = msg; t.classList.add('on'); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('on'), 2400); }

/* ---------- open hours widget (Екатеринбург) ---------- */
function ekbMinutes() {
  const p = new Intl.DateTimeFormat('ru-RU', {timeZone: 'Asia/Yekaterinburg', hour: '2-digit', minute: '2-digit', hour12: false}).formatToParts(new Date());
  return (+p.find(x => x.type === 'hour').value % 24) * 60 + +p.find(x => x.type === 'minute').value;
}
const hhmm = m => String(Math.floor(m / 60) % 24).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
function shopStatus() {
  const now = ekbMinutes(), OPEN = 9 * 60, CLOSE = 21 * 60;
  if (now >= OPEN && now < CLOSE) {
    const eta = now + 60;
    if (eta <= CLOSE) return {open: true, now, short: `Открыто до 21:00 · привезём примерно к ${hhmm(eta)}`, big: hhmm(eta), state: 'Магазин открыт', text: `Если оформить заказ прямо сейчас, доставка по Екатеринбургу — от 60 минут: примерно к ${hhmm(eta)}. Точное время согласует флорист.`};
    return {open: true, now, short: 'Открыто до 21:00 · на сегодня доставка уже не успеет', big: '09:00', state: 'Магазин открыт', text: 'На сегодня курьер уже не успеет — но можно оформить заказ на завтра с самого утра или забрать букет самовывозом до 21:00.'};
  }
  if (now < OPEN) return {open: false, now, short: 'Откроемся в 9:00 · ответим с утра', big: '09:00', state: 'Сейчас закрыто', text: 'Магазин работает ежедневно с 9:00 до 21:00. Оставьте заказ — флорист ответит, как только откроется.'};
  return {open: false, now, short: 'Закрыто · работаем с 9:00 до 21:00', big: '09:00', state: 'Сейчас закрыто', text: 'Сегодня магазин уже закрыт. Оформите заказ — флорист ответит утром и согласует доставку на нужное время.'};
}
function renderStatus() {
  const s = shopStatus();
  const chip = $('#openChip'); if (chip) { chip.classList.toggle('off', !s.open); chip.innerHTML = `<span class="dot"></span><span>${s.short}</span>`; }
  const tc = $('#timecard'); if (tc) {
    tc.classList.toggle('off', !s.open);
    const pct = Math.max(0, Math.min(100, (s.now - 540) / 720 * 100));
    tc.innerHTML = `<span class="eyebrow">Успеем сегодня?</span>
      <div class="tc-big">${s.big}<small> ${s.open && s.big !== '09:00' ? 'ориентировочно' : 'ближайшее время'}</small></div>
      <div class="tc-state"><span class="dot"></span>${s.state}</div>
      <p>${s.text}</p>
      <div class="tc-bar"><i style="width:${pct}%"></i></div>
      <div class="tc-scale"><span>9:00</span><span>15:00</span><span>21:00</span></div>
      <button class="btn btn-accent" data-open-cart>Оформить заказ</button>`;
  }
}
renderStatus(); setInterval(renderStatus, 60000);

/* ---------- cards ---------- */
function cardHTML(p) {
  return `<article class="card rv">
    <button class="media" data-qv="${p.id}" aria-label="Подробнее: ${esc(p.name)}"><img src="img/${p.id}.jpg" alt="${esc(p.name)}" width="800" height="1000" loading="lazy" decoding="async"><span class="tag">${SF.cats[p.cat]}</span><span class="view">Быстрый просмотр</span></button>
    <div class="cbody"><h3>${esc(p.name)}</h3><div class="pals">${p.pal.map(pdot).join('')}</div>
      <div class="crow"><span class="price">${fmt(p.price)}</span><button class="add${cart[p.id] ? ' done' : ''}" data-add="${p.id}" aria-label="В корзину: ${esc(p.name)}">${IC.plus}<span class="t">${cart[p.id] ? 'В корзине' : 'В корзину'}</span></button></div></div>
  </article>`;
}

/* ---------- cart ---------- */
let cart = {};
try { cart = JSON.parse(localStorage.getItem('sf_cart_v1') || '{}') || {}; } catch (e) { cart = {}; }
Object.keys(cart).forEach(k => { if (!BY[k]) delete cart[k]; });
const form = {mode: 'delivery', name: '', phone: '', addr: '', when: '', to: '', card: '', note: ''};
try { Object.assign(form, JSON.parse(localStorage.getItem('sf_form_v1') || '{}')); } catch (e) {}
const saveCart = () => { try { localStorage.setItem('sf_cart_v1', JSON.stringify(cart)); } catch (e) {} };
const saveForm = () => { try { localStorage.setItem('sf_form_v1', JSON.stringify(form)); } catch (e) {} };
const totals = () => { let n = 0, s = 0; Object.entries(cart).forEach(([id, q]) => { n += q; s += BY[id].price * q; }); return {n, s}; };
function updateBadge(bump) {
  const {n, s} = totals();
  $$('.cart-count').forEach(c => { c.textContent = n; if (bump) { c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); } });
  $$('[data-cart-sum]').forEach(e => e.textContent = n ? fmt(s) : '');
}
function syncButtons() { $$('[data-add]').forEach(b => { const on = !!cart[b.dataset.add], t = b.querySelector('.t'); b.classList.toggle('done', on); if (t) t.textContent = on ? 'В корзине' : 'В корзину'; }); }
function addToCart(id, silent) { cart[id] = (cart[id] || 0) + 1; saveCart(); updateBadge(true); syncButtons(); if (!silent) toast(`«${BY[id].name}» — в корзине`); if ($('#drawer.on')) renderCart(); }
function orderText() {
  const {s} = totals();
  const lines = Object.entries(cart).map(([id, q]) => `• ${BY[id].name} × ${q} — ${fmt(BY[id].price * q)}`);
  let t = `Здравствуйте! Хочу оформить заказ с сайта:\n${lines.join('\n')}\nИтого: ${fmt(s)} (без стоимости доставки)\nПолучение: ${form.mode === 'delivery' ? 'доставка' : 'самовывоз, Татищева, 90'}`;
  if (form.name) t += `\nИмя: ${form.name}`;
  if (form.phone) t += `\nТелефон: ${form.phone}`;
  if (form.mode === 'delivery' && form.addr) t += `\nАдрес: ${form.addr}`;
  if (form.when) t += `\nКогда: ${form.when}`;
  if (form.to) t += `\nПолучатель: ${form.to}`;
  if (form.card) t += `\nТекст открытки: ${form.card}`;
  if (form.note) t += `\nКомментарий: ${form.note}`;
  return t;
}
function renderCart() {
  const sc = $('#drScroll'), ft = $('#drFoot'); if (!sc) return;
  const ids = Object.keys(cart);
  if (!ids.length) {
    sc.innerHTML = `<div class="dr-empty"><img src="img/mark.png" alt="" width="90" height="71" style="margin:0 auto 18px"><b>Корзина пока пуста</b>Выберите букет в каталоге — и он появится здесь.</div>`;
    ft.innerHTML = `<a class="btn btn-primary" style="width:100%" href="catalog.html">Перейти в каталог</a>`; return;
  }
  sc.innerHTML = ids.map(id => { const p = BY[id]; return `<div class="line"><img src="img/${id}.jpg" alt="" width="70" height="88"><div><h4>${esc(p.name)}</h4><div class="lp">${fmt(p.price)}</div><div class="qty"><button data-dec="${id}" aria-label="Меньше">−</button><span>${cart[id]}</span><button data-inc="${id}" aria-label="Больше">+</button></div></div><button class="rm" data-rm="${id}">Удалить</button></div>`; }).join('') + `
    <p class="dnote">Стоимость доставки и итоговый состав согласует флорист. Перед отправкой пришлём фото готового букета.</p>
    <div class="seg"><button data-mode="delivery" class="${form.mode === 'delivery' ? 'on' : ''}">Доставка</button><button data-mode="pickup" class="${form.mode === 'pickup' ? 'on' : ''}">Самовывоз</button></div>
    <div class="dform">
      <div class="two"><div><label for="fName">Ваше имя</label><input id="fName" data-f="name" autocomplete="name" value="${esc(form.name)}" placeholder="Как к вам обращаться"></div>
      <div><label for="fPhone">Телефон</label><input id="fPhone" data-f="phone" type="tel" autocomplete="tel" value="${esc(form.phone)}" placeholder="+7 ___ ___-__-__"></div></div>
      ${form.mode === 'delivery' ? `<div><label for="fAddr">Адрес доставки</label><input id="fAddr" data-f="addr" autocomplete="street-address" value="${esc(form.addr)}" placeholder="Улица, дом, квартира"></div>` : `<p style="font-size:14px;color:var(--soft)">Заберёте на ул. Татищева, 90 — ежедневно с 9:00 до 21:00.</p>`}
      <div class="two"><div><label for="fWhen">Дата и время</label><input id="fWhen" data-f="when" value="${esc(form.when)}" placeholder="Сегодня к 18:00"></div>
      <div><label for="fTo">Получатель</label><input id="fTo" data-f="to" value="${esc(form.to)}" placeholder="Имя получателя"></div></div>
      <div><label for="fCard">Текст открытки</label><input id="fCard" data-f="card" value="${esc(form.card)}" placeholder="Необязательно"></div>
      <div><label for="fNote">Комментарий</label><textarea id="fNote" data-f="note" rows="2" placeholder="Пожелания к составу и оттенкам">${esc(form.note)}</textarea></div>
    </div>`;
  const {s, n} = totals();
  ft.innerHTML = `<div class="tot"><span>Итого, ${n} шт.</span><b>${fmt(s)}</b></div>    <div class="send"><button class="btn btn-primary full" data-send="vk">Отправить во ВКонтакте</button><button class="btn btn-line" data-send="wa">WhatsApp</button><button class="btn btn-line" data-send="tg">Telegram</button><a class="btn btn-line" href="tel:${SF.tel}">Позвонить</a><button class="btn btn-line" data-send="copy">Скопировать</button></div>`;
}
function openCart() { renderCart(); $('#drawer').classList.add('on'); $('#veil').classList.add('on'); document.body.classList.add('lock'); }
function closeAll() { $('#drawer')?.classList.remove('on'); $('#qv')?.classList.remove('on'); $('#veil')?.classList.remove('on'); document.body.classList.remove('lock'); }
async function copyText(t) { try { await navigator.clipboard.writeText(t); return true; } catch (e) { const a = document.createElement('textarea'); a.value = t; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); } catch (_) {} a.remove(); return true; } }
async function send(kind) {
  const t = orderText(), enc = encodeURIComponent(t);
  if (kind === 'vk') window.open(`${SF.vk}?text=${enc}`, '_blank');
  else if (kind === 'wa') window.open(`${SF.wa}?text=${enc}`, '_blank');
  else if (kind === 'tg') { await copyText(t); toast('Текст заказа скопирован — вставьте его в чат'); window.open(SF.tg, '_blank'); }
  else { await copyText(t); toast('Текст заказа скопирован'); }
}

/* ---------- quick view ---------- */
function openQV(id) {
  const p = BY[id], box = $('#qvBox');
  box.innerHTML = `<button class="x" data-close aria-label="Закрыть">✕</button>
    <div class="qv-img"><img src="img/${id}.jpg" alt="${esc(p.name)}" width="800" height="1000"></div>
    <div class="qv-info"><span class="eyebrow">${SF.cats[p.cat]}</span><h3>${esc(p.name)}</h3><div class="qp">${fmt(p.price)}</div><p>${esc(p.desc)}</p>
      <div class="tagrow">${p.pal.map(k => `<span>${SF.palettes[k].name}</span>`).join('')}${p.occ.map(k => `<span>${SF.occ[k]}</span>`).join('')}</div>
      <p class="note">Каждый букет собирается индивидуально — состав и оттенки могут незначительно отличаться. Цена актуальна на момент публикации в сообществе.</p>
      <div class="acts"><button class="btn btn-primary" data-qadd="${id}">Добавить в корзину</button>
      <a class="btn btn-line" target="_blank" rel="noopener" href="${SF.wa}?text=${encodeURIComponent('Здравствуйте! Хочу заказать «' + p.name + '» (' + fmt(p.price) + ').')}">Заказать в WhatsApp</a></div></div>`;
  $('#qv').classList.add('on'); $('#veil').classList.add('on'); document.body.classList.add('lock');
}

/* ---------- global events ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest('button,a,[data-qv]'); if (!t) return;
  if (t.dataset.add) { addToCart(t.dataset.add); return; }
  if (t.dataset.qv) { openQV(t.dataset.qv); return; }
  if (t.dataset.qadd) { addToCart(t.dataset.qadd, true); closeAll(); openCart(); return; }
  if (t.dataset.inc) { cart[t.dataset.inc]++; saveCart(); updateBadge(); renderCart(); return; }
  if (t.dataset.dec) { const id = t.dataset.dec; cart[id]--; if (cart[id] <= 0) delete cart[id]; saveCart(); updateBadge(); renderCart(); syncButtons(); return; }
  if (t.dataset.rm) { delete cart[t.dataset.rm]; saveCart(); updateBadge(); renderCart(); syncButtons(); return; }
  if (t.dataset.mode) { form.mode = t.dataset.mode; saveForm(); renderCart(); return; }
  if (t.dataset.send) { send(t.dataset.send); return; }
  if (t.hasAttribute('data-open-cart')) { openCart(); return; }
  if (t.dataset.close !== undefined || t.id === 'drClose') { closeAll(); return; }
  if (t.dataset.ask) { window.open(`${SF.vk}?text=${encodeURIComponent(t.dataset.ask)}`, '_blank'); return; }
});
document.addEventListener('input', e => { const f = e.target.dataset && e.target.dataset.f; if (f) { form[f] = e.target.value; saveForm(); } });
addEventListener('keydown', e => { if (e.key === 'Escape') { closeAll(); $('#art')?.classList.remove('on'); } });
$('#veil')?.addEventListener('click', closeAll);
$('#qv')?.addEventListener('click', e => { if (e.target.id === 'qv') closeAll(); });
$$('.cart-btn').forEach(b => b.addEventListener('click', openCart));
updateBadge();

/* ---------- featured / mini / vitrina renders ---------- */
$$('[data-featured]').forEach(box => { box.innerHTML = box.dataset.featured.split(',').map(id => cardHTML(BY[id])).join(''); observeNew(box); });
$$('[data-mini]').forEach(box => {
  const k = box.dataset.mini;
  const list = SF.products.filter(p => p.occ.includes(k)).slice(0, 3);
  box.innerHTML = list.map(p => `<button data-qv="${p.id}"><img src="img/${p.id}.jpg" alt="${esc(p.name)}" width="800" height="1000" loading="lazy"><b>${esc(p.name)}</b><span>${fmt(p.price)}</span></button>`).join('');
});
(function () {
  const g = $('#vgrid'); if (!g) return;
  g.innerHTML = SF.vitrina.map(v => `<article class="card vcard rv"><div class="media" style="cursor:default"><img src="img/${v.id}.jpg" alt="${esc(v.name)}" width="800" height="1000" loading="lazy"><span class="tag">В онлайн-витрине</span></div>
    <div class="cbody"><h3>${esc(v.name)}</h3><p style="font-size:14px;color:var(--soft);line-height:1.55">${esc(v.note)}</p><div class="ask"><span class="price" style="font-size:15px;color:var(--soft);font-weight:600">цена — по запросу</span>
    <button class="btn btn-primary btn-sm" data-ask="Здравствуйте! Хочу уточнить наличие и цену букета из онлайн-витрины: «${esc(v.name)}».">Узнать цену</button></div></div></article>`).join('');
  observeNew(g);
})();

/* ---------- catalog ---------- */
(function () {
  const grid = $('#catalogGrid'); if (!grid) return;
  const P = SF.products, maxP = Math.max(...P.map(p => p.price)), minP = Math.min(...P.map(p => p.price));
  const st = {cat: 'all', pal: 'all', occ: 'all', max: maxP, sort: 'def', q: ''};
  const qs = new URLSearchParams(location.search);
  if (SF.cats[qs.get('cat')] || qs.get('cat') === 'all') st.cat = qs.get('cat');
  if (SF.palettes[qs.get('pal')]) st.pal = qs.get('pal');
  if (SF.occ[qs.get('occ')]) st.occ = qs.get('occ');
  const counts = {all: P.length}; P.forEach(p => counts[p.cat] = (counts[p.cat] || 0) + 1);
  $('#chips').innerHTML = ['all', 'author', 'mono', 'comp'].map(k => `<button class="chip" data-cat="${k}">${k === 'all' ? 'Все' : SF.cats[k]}<sup>${counts[k]}</sup></button>`).join('');
  $('#swatches').innerHTML = `<button class="sw" data-pal="all" title="Все оттенки" style="background:conic-gradient(#f58a2c,#e0629a,#6e4fa0,#4fb0e3,#4fb39a,#f6c82f,#f58a2c)"></button>` + Object.entries(SF.palettes).map(([k, v]) => `<button class="sw" data-pal="${k}" title="${v.name}" aria-label="${v.name}" style="background:${v.dot}"></button>`).join('');
  $('#occSel').innerHTML = `<option value="all">Любой повод</option>` + Object.entries(SF.occ).map(([k, v]) => `<option value="${k}">${v}</option>`).join('');
  const rg = $('#rng'); rg.min = Math.floor(minP / 100) * 100; rg.max = Math.ceil(maxP / 100) * 100; rg.step = 100; rg.value = rg.max; st.max = +rg.max;
  function apply() {
    $$('#chips .chip').forEach(c => c.classList.toggle('on', c.dataset.cat === st.cat));
    $$('#swatches .sw').forEach(c => c.classList.toggle('on', c.dataset.pal === st.pal));
    $('#occSel').value = st.occ; $('#rngVal').textContent = st.max >= +rg.max ? 'любой' : 'до ' + fmt(st.max);
    let l = P.filter(p => (st.cat === 'all' || p.cat === st.cat) && (st.pal === 'all' || p.pal.includes(st.pal)) && (st.occ === 'all' || p.occ.includes(st.occ)) && p.price <= st.max && (!st.q || p.name.toLowerCase().includes(st.q)));
    if (st.sort === 'asc') l.sort((a, b) => a.price - b.price); if (st.sort === 'desc') l.sort((a, b) => b.price - a.price);
    $('#resCount').textContent = l.length ? `Найдено: ${l.length} из ${P.length}` : 'Ничего не найдено';
    grid.innerHTML = l.length ? l.map(cardHTML).join('') : `<div class="empty"><h3>По этим условиям пока пусто</h3><p>Измените фильтры — или напишите флористу: соберём букет под ваш запрос и бюджет.</p><button class="btn btn-primary" data-ask="Здравствуйте! Не нашла подходящий букет в каталоге, помогите подобрать.">Попросить подобрать</button></div>`;
    observeNew(grid); syncButtons();
  }
  document.addEventListener('click', e => {
    const c = e.target.closest('[data-cat],[data-pal]'); if (!c || !c.closest('.toolbar')) return;
    if (c.dataset.cat) st.cat = c.dataset.cat; if (c.dataset.pal) st.pal = c.dataset.pal; apply();
  });
  $('#occSel').addEventListener('change', e => { st.occ = e.target.value; apply(); });
  $('#sortSel').addEventListener('change', e => { st.sort = e.target.value; apply(); });
  rg.addEventListener('input', e => { st.max = +e.target.value; apply(); });
  $('#q').addEventListener('input', e => { st.q = e.target.value.trim().toLowerCase(); apply(); });
  $('#reset').addEventListener('click', () => { Object.assign(st, {cat: 'all', pal: 'all', occ: 'all', max: +rg.max, sort: 'def', q: ''}); rg.value = rg.max; $('#sortSel').value = 'def'; $('#q').value = ''; apply(); });
  apply();
})();

/* ---------- hero ---------- */
(function () {
  const hero = $('#hero'); if (!hero) return;
  const set = SF.heroSet, ro = $('#rosetteImgs'), dots = $('#heroDots'), card = $('#heroCard');
  ro.innerHTML = set.map((s, i) => `<img src="img/${s.img}.jpg" alt="${esc(BY[s.id].name)}" width="900" height="900" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}>`).join('');
  dots.innerHTML = set.map((s, i) => `<button class="dot-b" data-i="${i}" title="${SF.palettes[s.pal].name}" aria-label="${SF.palettes[s.pal].name}" style="background:${SF.palettes[s.pal].dot}"></button>`).join('');
  const imgs = $$('img', ro), db = $$('.dot-b', dots);
  let cur = -1, timer = null;
  function show(i) {
    cur = (i + set.length) % set.length; const s = set[cur], p = BY[s.id], pal = SF.palettes[s.pal];
    imgs.forEach((im, k) => im.classList.toggle('on', k === cur)); db.forEach((d, k) => d.classList.toggle('on', k === cur));
    document.documentElement.style.setProperty('--accent', pal.accent);
    card.innerHTML = `<button data-qv="${p.id}" style="text-align:left;min-width:0"><b>${esc(p.name)}</b><span>${pal.name} · ${fmt(p.price)}</span></button><button class="add-mini" data-add="${p.id}" aria-label="В корзину">${IC.plus}</button>`;
    $('#heroMood').textContent = pal.mood;
  }
  function auto() { clearInterval(timer); if (matchMedia('(prefers-reduced-motion:reduce)').matches) return; timer = setInterval(() => show(cur + 1), 4800); }
  dots.addEventListener('click', e => { const b = e.target.closest('.dot-b'); if (b) { show(+b.dataset.i); auto(); } });
  hero.addEventListener('mouseenter', () => clearInterval(timer)); hero.addEventListener('mouseleave', auto);
  show(2); auto();
  if (!matchMedia('(prefers-reduced-motion:reduce)').matches) {
    const cols = ['#f58a2c', '#e0629a', '#6e4fa0', '#4fb39a', '#f6c82f', '#5a9a2c', '#4fb0e3'];
    hero.insertAdjacentHTML('afterbegin', Array.from({length: 9}, (_, i) => `<i class="pt" style="left:${(i * 11.3 + 4) % 96}%;background:${cols[i % 7]};animation-duration:${14 + (i * 3) % 9}s;animation-delay:${-(i * 2.3)}s;width:${12 + (i * 5) % 12}px;height:${16 + (i * 7) % 14}px"></i>`).join(''));
  }
})();

/* ---------- quiz ---------- */
(function () {
  const root = $('#quiz'); if (!root) return;
  const Q = [
    {k: 'occ', q: 'Какой повод?', o: [['bday', 'День рождения'], ['love', 'Свидание или признание'], ['thanks', 'Благодарность'], ['big', 'Свадьба, юбилей, событие'], ['any', 'Просто так']]},
    {k: 'who', q: 'Кому дарим?', o: [['love', 'Любимой или жене'], ['soft', 'Маме или бабушке'], ['fun', 'Подруге или коллеге'], ['self', 'Себе — просто порадовать']]},
    {k: 'bud', q: 'Какой бюджет?', o: [['1', 'до 2 500 ₽'], ['2', '2 500 – 3 500 ₽'], ['3', 'от 3 500 ₽'], ['0', 'Не важно']]}
  ];
  const WHO = {love: ['red', 'pink'], soft: ['peach', 'white', 'pink'], fun: ['mix', 'sun', 'blue'], self: ['peach', 'mix', 'pink']};
  const ans = {}; let step = 0;
  const box = $('#qbox'), cols = ['var(--orange)', 'var(--pink)', 'var(--purple)', 'var(--teal)', 'var(--yellow)'];
  function render() {
    if (step < Q.length) {
      const q = Q[step];
      box.innerHTML = `<div class="qprog">${Q.map((_, i) => `<i class="${i <= step ? 'on' : ''}"></i>`).join('')}</div><h3>${q.q}</h3><div class="qopts">${q.o.map((o, i) => `<button class="qopt" data-v="${o[0]}" style="--c:${cols[i % 5]}"><i></i>${o[1]}</button>`).join('')}</div>${step ? '<button class="qback" data-back>← Назад</button>' : ''}`;
      return;
    }
    const lim = {'1': [0, 2500], '2': [2500, 3500], '3': [3500, 99999], '0': [0, 99999]}[ans.bud];
    const sc = SF.products.map(p => {
      let s = 0, why = [];
      if (p.occ.includes(ans.occ)) { s += 3; why.push('подходит для повода «' + SF.occ[ans.occ].toLowerCase() + '»'); }
      const pm = WHO[ans.who].find(k => p.pal.includes(k)); if (pm) { s += 2; why.push('оттенок «' + SF.palettes[pm].name.toLowerCase() + '» — ' + SF.palettes[pm].mood); }
      if (p.price >= lim[0] && p.price <= lim[1]) { s += 3; why.push('в вашем бюджете'); } else { const d = Math.min(Math.abs(p.price - lim[0]), Math.abs(p.price - lim[1])); s -= d / 800; why.push('чуть вне бюджета'); }
      return {p, s, why};
    }).sort((a, b) => b.s - a.s).slice(0, 3);
    box.innerHTML = `<div class="qres"><h3>Вам подойдёт</h3>${sc.map(r => `<div class="qpick"><img src="img/${r.p.id}.jpg" alt="" width="78" height="96"><div><b>${esc(r.p.name)} · ${fmt(r.p.price)}</b><small>${r.why.join(', ')}</small></div><button class="btn btn-cream" data-add="${r.p.id}">В корзину</button></div>`).join('')}<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:6px"><a class="btn btn-line btn-sm" href="catalog.html">Весь каталог</a><button class="btn btn-line btn-sm" data-redo>Пройти заново</button></div></div>`;
    syncButtons();
  }
  box.addEventListener('click', e => {
    const o = e.target.closest('.qopt'); if (o) { ans[Q[step].k] = o.dataset.v; step++; render(); return; }
    if (e.target.closest('[data-back]')) { step = Math.max(0, step - 1); render(); return; }
    if (e.target.closest('[data-redo]')) { step = 0; render(); }
  });
  render();
})();

/* ---------- stepper ---------- */
(function () {
  const root = $('#steps'); if (!root) return;
  const items = $$('.step', root), prog = $('.prog', root); if (!('IntersectionObserver' in window)) { items.forEach(i => i.classList.add('act')); return; }
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('act'); const last = items.filter(i => i.classList.contains('act')).length; const lastEl = items[last - 1]; prog.style.height = (lastEl.offsetTop + 26) + 'px'; } }), {threshold: .6});
  items.forEach(i => io.observe(i));
})();

/* ---------- faq / articles / forms ---------- */
$$('.fq button').forEach(b => b.addEventListener('click', () => { const p = b.parentElement, was = p.classList.contains('open'); $$('.fq').forEach(x => x.classList.remove('open')); if (!was) p.classList.add('open'); b.setAttribute('aria-expanded', !was); }));
(function () {
  const box = $('#art'); if (!box) return; const body = $('#artBody');
  const open = id => { const t = document.getElementById('a-' + id); if (!t) return; body.innerHTML = t.innerHTML; box.classList.add('on'); document.body.classList.add('lock'); box.scrollTop = 0; history.replaceState(null, '', '#' + id); };
  const close = () => { box.classList.remove('on'); document.body.classList.remove('lock'); history.replaceState(null, '', location.pathname + location.search); };
  document.addEventListener('click', e => { const t = e.target.closest('[data-article]'); if (t) { open(t.dataset.article); return; } if (e.target.closest('#artX') || e.target === box) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('on')) close(); });
  const h = location.hash.replace('#', ''); if (h && document.getElementById('a-' + h)) open(h);
})();
window.sendContact = function () {
  const g = id => (document.getElementById(id)?.value || '').trim();
  let t = `Здравствуйте! ${g('ctTopic') || 'Хочу сделать заказ'}.`;
  if (g('ctName')) t += ` Меня зовут ${g('ctName')}.`;
  if (g('ctPhone')) t += ` Телефон: ${g('ctPhone')}.`;
  if (g('ctWhen')) t += ` Когда нужно: ${g('ctWhen')}.`;
  if (g('ctMsg')) t += ` ${g('ctMsg')}`;
  window.open(`${SF.vk}?text=${encodeURIComponent(t)}`, '_blank');
};
$$('[data-year]').forEach(e => e.textContent = new Date().getFullYear());
