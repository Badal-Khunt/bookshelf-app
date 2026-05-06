
import { initRouter }                         from './utils/router.js';
import { getCookieConsent, setCookieConsent } from './utils/state.js';

document.addEventListener('DOMContentLoaded', () => {
  initRouter();
  initNav();
  initCookieBanner();
  initScrollHeader();
});


function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    menu.classList.toggle('open', !open);
  });

  
  menu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
    });
  });

  
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav') && menu.classList.contains('open')) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
    }
  });
}


function initScrollHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;height:1px;width:100%;pointer-events:none;';
  document.body.prepend(sentinel);

  new IntersectionObserver(
    ([e]) => header.classList.toggle('scrolled', !e.isIntersecting),
    { rootMargin: '-68px 0px 0px 0px' }
  ).observe(sentinel);
}


function initCookieBanner() {
  const banner     = document.getElementById('cookie-banner');
  const acceptBtn  = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');
  if (!banner) return;

  
  if (getCookieConsent()) {
    banner.classList.add('hidden');
    return;
  }

  acceptBtn?.addEventListener('click', () => {
    setCookieConsent('accepted');
    banner.classList.add('hidden');
  });

  declineBtn?.addEventListener('click', () => {
    setCookieConsent('declined');
    banner.classList.add('hidden');
  });
}
