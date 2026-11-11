/* ═══════════════════════════════════════════════════════════════
   ANDRÉ DEVESA — v2 · logique
   Pas de dépendance, pas de build : un script classique.

   01 Réglages          05 Menu principal (sélecteur)
   02 Scènes & routeur  06 Video Editing (onglets, filtres, liste)
   03 Volet de transition 07 Contact
   04 Parallaxe         08 Curseur, étoile, ticker, clavier
═══════════════════════════════════════════════════════════════ */
(() => {
  'use strict';

  /* ───────── 01 · RÉGLAGES ───────── */
  const EMAIL  = 'hello@andredevesa.com';
  const ORDER  = ['intro', 'main', 'video', 'contact'];
  const LABELS = { intro: '', main: 'Home', video: 'Video Editing', contact: 'Contact' };
  const TITLE  = 'André Devesa — Video Editor';

  const PARALLAX_EASE = 0.075;   // 0 = figé · 1 = colle au pointeur
  const WIPE = { cover: 300, stagger: 55, hold: 70, reveal: 340 };

  const doc  = document;
  const root = doc.documentElement;
  const body = doc.body;
  const $  = (sel, ctx = doc) => ctx.querySelector(sel);
  const $$ = (sel, ctx = doc) => Array.from(ctx.querySelectorAll(sel));

  const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
  const mqFine   = matchMedia('(hover: hover) and (pointer: fine)');
  const calm = () => mqReduce.matches;

  const wait  = (ms) => new Promise((r) => setTimeout(r, ms));
  const frame = () => new Promise((r) => requestAnimationFrame(() => r()));
  const esc   = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ───────── 02 · SCÈNES & ROUTEUR ─────────
     L'URL porte la scène (#main, #video, #contact) : le bouton « précédent »
     du navigateur fonctionne et on peut partager un lien direct.            */
  const scenes   = Object.fromEntries(ORDER.map((n) => [n, $('#scene-' + n)]));
  const cams     = Object.fromEntries(ORDER.map((n) => [n, $('.cam', scenes[n])]));
  const hudLogo  = $('#hudLogo');
  const hudLabel = $('#hudLabel');

  const state = { scene: null, busy: false, queued: null, keyboard: false };

  const sceneFromHash = () => {
    const h = location.hash.replace('#', '');
    return ORDER.includes(h) ? h : 'intro';
  };
  const nav = (name) => {
    if (name === 'intro') history.pushState(null, '', location.pathname + location.search), go('intro');
    else if (location.hash === '#' + name) go(name);
    else location.hash = name;
  };

  function show(next, dir) {
    const prev = state.scene;
    if (prev) {
      scenes[prev].classList.remove('is-active', 'is-leaving');
      scenes[prev].inert = true;
    }
    const el = scenes[next];
    el.style.setProperty('--dir', dir);
    el.inert = false;
    el.classList.add('is-active');

    state.scene = next;
    body.dataset.scene = next;
    const n = ORDER.indexOf(next);
    hudLabel.innerHTML = LABELS[next] ? `<b>0${n}</b>${esc(LABELS[next])}` : '';
    doc.title = LABELS[next] && next !== 'main' ? `${LABELS[next]} — André Devesa` : TITLE;

    // au clavier, le focus arrive sur l'entrée sélectionnée ; à la souris / au doigt, sur la scène
    if (next === 'main') placeBeam();
    (next === 'main' && state.keyboard ? items[sel] : el).focus({ preventScroll: true });
    if (next === 'video') renderVideo(false);
    kick();
  }

  async function go(next) {
    if (next === state.scene) return;
    if (state.busy) { state.queued = next; return; }
    const prev = state.scene;
    const dir  = ORDER.indexOf(next) > ORDER.indexOf(prev) ? 1 : -1;

    if (!prev || calm()) { show(next, dir); return; }

    state.busy = true;
    body.classList.add('is-wiping');
    scenes[prev].style.setProperty('--dir', dir);
    scenes[prev].classList.add('is-leaving');
    if (prev === 'intro') flyLogo();

    await wipeCover(dir);
    show(next, dir);
    await wait(WIPE.hold);
    await wipeReveal(dir);

    body.classList.remove('is-wiping');
    state.busy = false;
    if (state.queued) { const q = state.queued; state.queued = null; if (q !== state.scene) go(q); }
  }

  /* Le logo de l'intro « vole » jusqu'à sa place dans le HUD (technique FLIP). */
  function flyLogo() {
    const src = $('.intro-logo img');
    const a = src.getBoundingClientRect();
    hudLogo.classList.add('is-flying');
    const b = hudLogo.getBoundingClientRect();
    if (!a.width || !b.width) { hudLogo.classList.remove('is-flying'); return; }
    src.style.visibility = 'hidden';
    hudLogo.animate(
      [
        { transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width})` },
        { transform: 'none' },
      ],
      { duration: 760, easing: 'cubic-bezier(.76, 0, .18, 1)' }
    ).finished.catch(() => {}).then(() => {
      hudLogo.classList.remove('is-flying');
      src.style.visibility = '';
    });
  }

  /* ───────── 03 · VOLET DE TRANSITION ─────────
     Trois lames (vert, blanc, noir) balayent l'écran en biais ; la scène
     change quand tout est couvert, puis les lames repartent dans le même sens. */
  const bands = $$('#wipe i');
  const star  = $('.wipe-star');
  const EASE  = 'cubic-bezier(.76, 0, .24, 1)';
  const bandAt = (x, dir) => `translateX(${x}%) skewX(${-16 * dir}deg)`;

  function wipeCover(dir) {
    return Promise.all(bands.map((b, i) =>
      b.animate([{ transform: bandAt(-140 * dir, dir) }, { transform: bandAt(0, dir) }],
        { duration: WIPE.cover, delay: i * WIPE.stagger, easing: EASE, fill: 'both' }).finished));
  }
  function wipeReveal(dir) {
    star.animate(
      [
        { opacity: 1, transform: 'scale(.2) rotate(0deg)' },
        { opacity: 1, transform: 'scale(1.15) rotate(90deg)', offset: .5 },
        { opacity: 0, transform: 'scale(1.9) rotate(150deg)' },
      ],
      { duration: 260, easing: 'steps(6)' });
    const last = bands.length - 1;
    return Promise.all(bands.map((b, i) =>
      b.animate([{ transform: bandAt(0, dir) }, { transform: bandAt(140 * dir, dir) }],
        { duration: WIPE.reveal, delay: (last - i) * WIPE.stagger, easing: EASE, fill: 'both' }).finished));
  }

  /* ───────── 04 · PARALLAXE ─────────
     Souris : la caméra suit le pointeur. Tactile : la caméra dérive toute seule
     (et suit le gyroscope quand le navigateur le donne sans demander).
     La boucle s'arrête dès que la caméra est au repos.                        */
  const cam = { tx: 0, ty: 0, x: 0, y: 0, raf: 0, lastInput: -1e9, gyro: false };

  function kick() { if (!cam.raf && !calm()) cam.raf = requestAnimationFrame(tick); }

  function tick(t) {
    const drifting = !mqFine.matches && !cam.gyro && t - cam.lastInput > 1400;
    if (drifting) {
      cam.tx = Math.sin(t / 2900) * 0.6;
      cam.ty = Math.cos(t / 3700) * 0.45;
    }
    cam.x += (cam.tx - cam.x) * PARALLAX_EASE;
    cam.y += (cam.ty - cam.y) * PARALLAX_EASE;

    const el = cams[state.scene];
    if (el) {
      el.style.setProperty('--px', cam.x.toFixed(4));
      el.style.setProperty('--py', cam.y.toFixed(4));
    }
    const settled = Math.abs(cam.tx - cam.x) + Math.abs(cam.ty - cam.y) < 0.0006;
    cam.raf = (!settled || !mqFine.matches) && !doc.hidden ? requestAnimationFrame(tick) : 0;
  }

  function aim(clientX, clientY) {
    cam.tx = (clientX / innerWidth - 0.5) * 2;
    cam.ty = (clientY / innerHeight - 0.5) * 2;
    cam.lastInput = performance.now();
    kick();
  }

  addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') aim(e.clientX, e.clientY); }, { passive: true });
  doc.addEventListener('mouseleave', () => { cam.tx = 0; cam.ty = 0; kick(); });
  doc.addEventListener('visibilitychange', () => { if (!doc.hidden) kick(); });

  if ('DeviceOrientationEvent' in window && typeof DeviceOrientationEvent.requestPermission !== 'function') {
    let base = null;
    addEventListener('deviceorientation', (e) => {
      if (e.gamma == null || e.beta == null || mqFine.matches) return;
      if (!base) base = { g: e.gamma, b: e.beta };
      cam.gyro = true;
      cam.tx = Math.max(-1, Math.min(1, (e.gamma - base.g) / 22));
      cam.ty = Math.max(-1, Math.min(1, (e.beta - base.b) / 22));
      kick();
    }, { passive: true });
  }

  /* ───────── 05 · MENU PRINCIPAL ─────────
     Le faisceau vert se cale sur l'entrée sélectionnée (survol, flèches, Tab). */
  const menu  = $('#menu');
  const items = $$('.menu-item', menu);
  const beam  = $('#beam');
  let sel = 0;

  function placeBeam() {
    const it = items[sel];
    beam.style.setProperty('--y', (menu.offsetTop + it.offsetTop + it.offsetHeight / 2) + 'px');
  }
  function select(i, focus) {
    sel = (i + items.length) % items.length;
    items.forEach((el, k) => el.classList.toggle('is-selected', k === sel));
    placeBeam();
    if (focus) items[sel].focus({ preventScroll: true });
  }
  items.forEach((el, i) => {
    el.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') select(i); });
    el.addEventListener('focus', () => select(i));
    el.addEventListener('click', () => {
      select(i);
      el.classList.remove('is-go'); void el.offsetWidth; el.classList.add('is-go');
    });
  });

  /* ───────── 06 · VIDEO EDITING ───────── */
  const DATA   = window.PROJECTS || { reels: [], youtube: [] };
  const tabs   = $$('.tab');
  const chips  = $('#chips');
  const rows   = $('#rows');
  const box    = $('#videoBox');
  const video  = { tab: 'reels', client: 'all', drawn: false };

  const platform = (u) => /youtu\.?be/.test(u) ? 'YouTube' : /tiktok/.test(u) ? 'TikTok' : /instagram/.test(u) ? 'Instagram' : 'Lien';
  const ytId = (u) => (u.match(/(?:youtu\.be\/|[?&]v=|\/shorts\/)([\w-]{11})/) || [])[1];

  function renderChips() {
    const list = DATA[video.tab];
    const count = new Map();
    list.forEach((p) => count.set(p.c, (count.get(p.c) || 0) + 1));
    const clients = [...count.entries()].sort((a, b) => b[1] - a[1]);
    chips.innerHTML = [['all', list.length], ...clients].map(([c, n]) =>
      `<button class="chip" type="button" data-client="${esc(c)}" aria-pressed="${c === video.client}">` +
      `<span>${c === 'all' ? 'Tous' : esc(c)}<small>${n}</small></span></button>`).join('');
  }

  function renderRows() {
    const list = DATA[video.tab].filter((p) => video.client === 'all' || p.c === video.client);
    rows.innerHTML = list.map((p, i) => {
      const where = platform(p.u);
      const id = where === 'YouTube' ? ytId(p.u) : null;
      const thumb = id
        ? `<img class="row-thumb" src="https://i.ytimg.com/vi/${id}/mqdefault.jpg" alt="" width="160" height="90" loading="lazy" decoding="async" referrerpolicy="no-referrer">`
        : '';
      return `<li><a class="row" href="${esc(p.u)}" target="_blank" rel="noopener noreferrer" style="--i:${Math.min(i, 12)}">` +
        `<span class="row-n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>${thumb}` +
        `<span class="row-main"><span class="row-t">${esc(p.t)}</span>` +
        `<span class="row-m">${esc(p.c)} · ${p.y}${video.tab === 'reels' ? ' · ' + where : ''}</span></span>` +
        `<span class="row-go" aria-hidden="true"></span><span class="sr"> (nouvel onglet)</span></a></li>`;
    }).join('');
    rows.scrollTop = 0;
  }

  function renderVideo(force) {
    if (video.drawn && !force) return;
    video.drawn = true;
    renderChips();
    renderRows();
  }

  function setTab(name, focus) {
    if (name === video.tab) return;
    video.tab = name;
    video.client = 'all';
    tabs.forEach((t) => {
      const on = t.dataset.tab === name;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      if (on) {
        rows.setAttribute('aria-labelledby', t.id);
        t.classList.remove('is-pop'); void t.offsetWidth; t.classList.add('is-pop');
        if (focus) t.focus();
      }
    });
    box.classList.remove('is-stretch'); void box.offsetWidth; box.classList.add('is-stretch');
    renderVideo(true);
  }

  tabs.forEach((t, i) => {
    t.addEventListener('click', () => setTab(t.dataset.tab));
    t.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault(); e.stopPropagation();
      const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      setTab(n.dataset.tab, true);
    });
  });
  chips.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    video.client = chip.dataset.client;
    $$('.chip', chips).forEach((c) => c.setAttribute('aria-pressed', c === chip));
    renderRows();
  });
  // miniature YouTube introuvable → on la retire, la ligne reste propre
  rows.addEventListener('error', (e) => { if (e.target.matches('.row-thumb')) e.target.remove(); }, true);

  const subVideo = $('#subVideo');
  if (subVideo && DATA.reels.length) subVideo.textContent = `${DATA.reels.length} reels · ${DATA.youtube.length} vidéos YouTube`;

  /* ───────── 07 · CONTACT ───────── */
  const form = $('#contactForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const subject = encodeURIComponent('Contact — Portfolio André Devesa');
    const text = encodeURIComponent(`Nom : ${f.get('name').trim()}\nEmail : ${f.get('email').trim()}\n\n${f.get('message').trim()}`);
    location.href = `mailto:${EMAIL}?subject=${subject}&body=${text}`;
  });

  const copyBtn = $('#copyMail');
  copyBtn.addEventListener('click', async () => {
    const label = $('span', copyBtn);
    let ok = true;
    try { await navigator.clipboard.writeText(EMAIL); }
    catch { ok = false; }
    if (!ok) {
      const r = doc.createRange(); r.selectNodeContents($('#mail'));
      const s = getSelection(); s.removeAllRanges(); s.addRange(r);
    }
    label.textContent = ok ? 'Copié !' : 'Sélectionné — Ctrl/⌘ + C';
    copyBtn.classList.add('is-done');
    setTimeout(() => { label.textContent = "Copier l'adresse"; copyBtn.classList.remove('is-done'); }, 1800);
  });

  /* ───────── 08 · CURSEUR, ÉTOILE, TICKER, CLAVIER ───────── */
  const cursor = $('#cursor');
  const HOT = 'a, button, [role="tab"], label';

  function initCursor() {
    if (!mqFine.matches) return;
    addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      root.classList.add('has-cursor');
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      cursor.classList.remove('is-out');
    }, { passive: true });
    doc.addEventListener('pointerover', (e) => {
      const t = e.target;
      cursor.classList.toggle('is-text', !!t.closest('input, textarea'));
      cursor.classList.toggle('is-hover', !!t.closest(HOT) || (state.scene === 'intro' && !!t.closest('.scene--intro')));
    });
    doc.addEventListener('mouseleave', () => cursor.classList.add('is-out'));
    addEventListener('pointerdown', () => cursor.classList.add('is-down'));
    addEventListener('pointerup',   () => cursor.classList.remove('is-down'));
  }

  // une étoile éclate là où on clique / touche
  addEventListener('pointerdown', (e) => {
    if (calm() || e.button > 0 || e.target.closest('input, textarea')) return;
    const s = new Image();
    s.src = 'assets/svg/etoile.svg'; s.alt = ''; s.className = 'burst';
    s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px';
    body.appendChild(s);
    const turn = Math.random() * 60 - 30;
    s.animate(
      [
        { transform: `scale(.1) rotate(${turn}deg)`, opacity: 1 },
        { transform: `scale(1.05) rotate(${turn + 50}deg)`, opacity: 1, offset: .55 },
        { transform: `scale(1.5) rotate(${turn + 80}deg)`, opacity: 0 },
      ],
      { duration: 380, easing: 'steps(7)' }
    ).finished.catch(() => {}).then(() => s.remove());
  }, { passive: true });

  // ticker : on duplique la phrase jusqu'à remplir deux largeurs d'écran
  function initTicker() {
    const track = $('#tickerTrack');
    const one = track.firstElementChild;
    const need = Math.max(2, Math.ceil((innerWidth * 1.2) / Math.max(one.offsetWidth, 1)));
    const half = Array.from({ length: need }, () => one.outerHTML).join('');
    track.innerHTML = half + half;
  }

  // intro : clic n'importe où ou n'importe quelle touche
  scenes.intro.addEventListener('click', () => { if (state.scene === 'intro') nav('main'); });

  addEventListener('pointerdown', () => { state.keyboard = false; }, true);
  doc.addEventListener('keydown', (e) => {
    state.keyboard = true;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const typing = /^(INPUT|TEXTAREA)$/.test(e.target.tagName);

    if (state.scene === 'intro') {
      if (e.key === 'Enter' || e.key === ' ' || e.key.startsWith('Arrow') || e.key.length === 1) { e.preventDefault(); nav('main'); }
      return;
    }
    if (e.key === 'Escape') {
      if (state.scene === 'video' || state.scene === 'contact') { e.preventDefault(); nav('main'); }
      return;
    }
    if (typing || state.scene !== 'main') return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); select(sel + 1, true); }
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); select(sel - 1, true); }
    else if (e.key === 'Enter' && !e.target.closest('a, button')) { e.preventDefault(); items[sel].click(); }
  });

  let resizeRaf = 0;
  addEventListener('resize', () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(placeBeam);
  });
  addEventListener('hashchange', () => go(sceneFromHash()));
  addEventListener('popstate',   () => go(sceneFromHash()));

  /* ───────── DÉMARRAGE ───────── */
  ORDER.forEach((n) => { scenes[n].inert = true; });
  initCursor();
  initTicker();
  show(sceneFromHash(), 1);
  frame().then(placeBeam);
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(placeBeam);
  addEventListener('load', placeBeam);
})();
