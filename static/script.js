// ===== Меню =====
const nav    = document.getElementById('siteNav');
const burger = document.getElementById('burger');
const menu   = document.getElementById('menu');

burger?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(open));
});

menu?.querySelectorAll('.submenu-toggle').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const li = btn.closest('.has-sub');
    const nowOpen = !li.classList.contains('open');
    menu.querySelectorAll('.has-sub.open').forEach(n => { if (n!==li) n.classList.remove('open'); });
    li.classList.toggle('open', nowOpen);
    btn.setAttribute('aria-expanded', String(nowOpen));
  });
});

document.addEventListener('click', (e) => {
  if (!nav.contains(e.target)) {
    nav.classList.remove('open');
    burger?.setAttribute('aria-expanded', 'false');
    menu?.querySelectorAll('.has-sub.open').forEach(li => li.classList.remove('open'));
    menu?.querySelectorAll('.submenu-toggle').forEach(b => b.setAttribute('aria-expanded','false'));
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    nav.classList.remove('open');
    burger?.setAttribute('aria-expanded','false');
    menu?.querySelectorAll('.has-sub.open').forEach(li => li.classList.remove('open'));
    menu?.querySelectorAll('.submenu-toggle').forEach(b => b.setAttribute('aria-expanded','false'));
  }
});

menu?.addEventListener('click', (e) => {
  const isLink = e.target.closest('a[role="menuitem"]');
  if (isLink && window.matchMedia('(max-width: 960px)').matches) {
    nav.classList.remove('open');
    burger?.setAttribute('aria-expanded','false');
    menu.querySelectorAll('.has-sub.open').forEach(li => li.classList.remove('open'));
    menu.querySelectorAll('.submenu-toggle').forEach(b => b.setAttribute('aria-expanded','false'));
  }
});


document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href]');
  if (!a) return;
  if (a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.hasAttribute('download')) return;
  const to = new URL(a.getAttribute('href'), location.href);
  if (to.origin === location.origin) {
    try { sessionStorage.setItem('backTarget', location.href); } catch(_) {}
  }
});

(function(){
  const backBtn = document.getElementById('goBack');
  if (!backBtn) return;
  backBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (document.referrer) {
      try {
        const ref = new URL(document.referrer);
        if (ref.origin === location.origin) { history.back(); return; }
      } catch(_) {}
    }
    const saved = (()=>{ try { return sessionStorage.getItem('backTarget'); } catch(_) { return null; } })();
    if (saved) { location.href = saved; return; }

    const fallback = backBtn.getAttribute('data-fallback') || '/';
    location.href = fallback;
  });
})();

