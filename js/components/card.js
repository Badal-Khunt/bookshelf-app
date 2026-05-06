
import { getCoverUrl }                     from '../utils/api.js';
import { isInReadingList, toggleReadingList } from '../utils/state.js';
import { openModal }                        from './modal.js';

export function createCard(book) {
  const saved   = isInReadingList(book.key);
  const coverUrl = getCoverUrl(book.cover_i, 'M');
  const author  = book.author_name?.[0] ?? 'Unknown author';
  const year    = book.first_publish_year ?? '';

  const article = document.createElement('article');
  article.className = 'card';
  article.setAttribute('role', 'button');
  article.setAttribute('tabindex', '0');
  article.setAttribute('aria-label', `${esc(book.title)} by ${esc(author)}${year ? ', ' + year : ''}`);

  article.innerHTML = `
    <div class="card__cover">
      ${coverUrl
        ? `<img src="${coverUrl}" alt="Cover of ${esc(book.title)}" loading="lazy" />`
        : `<div class="card__cover-placeholder">
             <span aria-hidden="true">📖</span>
             <p>${esc(book.title)}</p>
           </div>`
      }
      <button
        class="card__save-btn ${saved ? 'saved' : ''}"
        aria-label="${saved ? 'Remove from' : 'Add to'} reading list"
        aria-pressed="${saved}"
        data-key="${esc(book.key)}"
      >${saved ? '🔖' : '＋'}</button>
    </div>
    <div class="card__body">
      <h3 class="card__title">${esc(book.title)}</h3>
      <p class="card__author">${esc(author)}</p>
      ${year ? `<span class="card__year">${year}</span>` : ''}
    </div>
  `;

  
  const openDetail = (e) => {
    if (e.target.closest('.card__save-btn')) return;
    openModal(book);
  };
  article.addEventListener('click', openDetail);
  article.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDetail(e); }
  });

  
  const saveBtn = article.querySelector('.card__save-btn');
  saveBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleReadingList(book);
    const nowSaved = isInReadingList(book.key);
    saveBtn.classList.toggle('saved', nowSaved);
    saveBtn.setAttribute('aria-pressed', nowSaved);
    saveBtn.setAttribute('aria-label', `${nowSaved ? 'Remove from' : 'Add to'} reading list`);
    saveBtn.textContent = nowSaved ? '🔖' : '＋';
  });

  return article;
}


function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
