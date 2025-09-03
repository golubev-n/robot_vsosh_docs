// ===== Меню =====
const nav    = document.getElementById('siteNav');
const burger = document.getElementById('burger');
const menu   = document.getElementById('menu');
const isMobile = () => window.matchMedia('(max-width: 960px)').matches;

function setExpanded(li, val){
  li?.querySelector('.submenu-toggle')?.setAttribute('aria-expanded', String(val));
}
function closeAllSubmenus(except=null){
  menu?.querySelectorAll('.has-sub').forEach(li => {
    if (li !== except) {
      li.classList.remove('open');
      setExpanded(li, false);
    }
  });
}
function closeNav(){
  nav?.classList.remove('open');
  burger?.setAttribute('aria-expanded','false');
  closeAllSubmenus();
}

// Бургер
burger?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(open));
});

// Подменю: кликом управляем ТОЛЬКО на мобиле; на десктопе показ через :hover/:focus-within
menu?.querySelectorAll('.submenu-toggle').forEach(btn => {
  btn.addEventListener('click', (e) => {
    if (!isMobile()) return;
    e.preventDefault();
    e.stopPropagation();
    const li = btn.closest('.has-sub');
    const nowOpen = !li.classList.contains('open');
    closeAllSubmenus(li);                  // держим открытым только текущее
    li.classList.toggle('open', nowOpen);
    setExpanded(li, nowOpen);
  });
});

// ФОКУС: держать открытым только то, где сейчас фокус; вне меню — всё закрыть
document.addEventListener('focusin', (e) => {
  if (!menu) return;
  const target = e.target;
  if (!nav.contains(target)) {             // фокус ушёл из навигации
    closeAllSubmenus();
    return;
  }
  const li = target.closest('.has-sub');
  closeAllSubmenus(li);
  if (isMobile() && li) {                  // на мобиле раскрываем текущее и по фокусу
    li.classList.add('open');
    setExpanded(li, true);
  }
});

// Клик-вне: закрыть меню/подменю (надёжнее, чем contains, учитывает псевдооверлей)
document.addEventListener('click', (e) => {
  const inside = e.target.closest('#menu, #burger');
  if (!inside) closeNav();
});

// ESC — закрыть
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeNav();
});

// После перехода по ссылке на мобиле — закрыть меню
menu?.addEventListener('click', (e) => {
  const isLink = e.target.closest('a[role="menuitem"]');
  if (isLink && isMobile()) closeNav();
});

// Сохраняем «откуда пришли» для кнопки Назад
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href]');
  if (!a) return;
  if (a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.hasAttribute('download')) return;
  const to = new URL(a.getAttribute('href'), location.href);
  if (to.origin === location.origin) {
    try { sessionStorage.setItem('backTarget', location.href); } catch(_) {}
  }
});

// Кнопка Назад
(function(){
  const backBtn = document.getElementById('goBack');
  if (!backBtn) return;
  backBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (document.referrer) {
      try { const ref = new URL(document.referrer);
        if (ref.origin === location.origin) { history.back(); return; }
      } catch(_) {}
    }
    const saved = (()=>{ try { return sessionStorage.getItem('backTarget'); } catch(_) { return null; } })();
    if (saved) { location.href = saved; return; }
    const fallback = backBtn.getAttribute('data-fallback') || '/';
    location.href = fallback;
  });
})();

// При переходе с мобилы на десктоп — очистить мобильное состояние
window.addEventListener('resize', () => {
  if (!isMobile()) closeNav();
});

