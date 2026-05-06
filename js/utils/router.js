
import { renderHome }        from '../pages/home.js';
import { renderSearch }      from '../pages/search.js';
import { renderReadingList } from '../pages/reading.js';
import { renderContact }     from '../pages/contact.js';
import { renderPrivacy }     from '../pages/privacy.js';

const routes = {
  '/':         renderHome,
  '/search':   renderSearch,
  '/reading':  renderReadingList,
  '/contact':  renderContact,
  '/privacy':  renderPrivacy,
};

const main = document.getElementById('main-content');

function getPath() {
  const hash = window.location.hash.slice(1);
  return hash || '/';
}

export function navigate(path) {
  window.location.hash = path;
}

function render() {
  const path     = getPath();
  const renderer = routes[path] || routes['/'];

  
  document.querySelectorAll('.nav__link').forEach(link => {
    const linkPath = link.getAttribute('href').replace('#', '') || '/';
    link.classList.toggle('active', linkPath === path);
  });

  
  main.innerHTML = '';
  renderer(main);

  
  window.scrollTo({ top: 0, behavior: 'instant' });

  
  main.focus();
}

export function initRouter() {
  window.addEventListener('hashchange', render);
  render();
}
