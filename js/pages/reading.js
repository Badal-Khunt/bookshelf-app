
import { getCoverUrl }                         from '../utils/api.js';
import { getReadingList, toggleReadingList,
         isInReadingList, on }                  from '../utils/state.js';
import { openModal }                            from '../components/modal.js';

export function renderReadingList(container) {
  container.innerHTML = `
    <div class="page container">
      <header class="page__header">
        <h1 class="page__title">Reading List</h1>
        <p class="page__subtitle" id="rl-subtitle"></p>
      </header>
      <div id="rl-grid" class="book-grid" role="list" aria-label="Your reading list"></div>
    </div>
  `;

  const grid     = container.querySelector('#rl-grid');
  const subtitle = container.querySelector('#rl-subtitle');

  function renderGrid() {
    const list = getReadingList();
    grid.innerHTML = '';

    if (!list.length) {
      subtitle.textContent = '';
      grid.innerHTML = `
        <div class="reading-empty" style="grid-column:1/-1">
          <div class="big-icon" aria-hidden="true">📚</div>
          <h2>Your reading list is empty</h2>
          <p style="color:var(--clr-text-muted);margin-bottom:var(--sp-6)">
            Search for books and tap <strong>+</strong> to add them here.
          </p>
          <a href="#/search" class="btn btn--accent">Find Books</a>
        </div>
      `;
      return;
    }

    subtitle.textContent = `${list.length} book${list.length !== 1 ? 's' : ''} saved`;

    list.forEach(book => {
      const coverUrl = getCoverUrl(book.coverId, 'M');
      const article  = document.createElement('article');
      article.className = 'card';
      article.setAttribute('role', 'listitem');
      article.setAttribute('tabindex', '0');
      article.setAttribute('aria-label', `${book.title} by ${book.author}`);

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
            class="card__save-btn saved"
            aria-label="Remove from reading list"
            aria-pressed="true"
            data-key="${esc(book.key)}"
          >🔖</button>
        </div>
        <div class="card__body">
          <h3 class="card__title">${esc(book.title)}</h3>
          <p class="card__author">${esc(book.author)}</p>
          ${book.year ? `<span class="card__year">${book.year}</span>` : ''}
        </div>
      `;

      
      const clickHandler = (e) => {
        if (e.target.closest('.card__save-btn')) return;
        openModal(book);
      };
      article.addEventListener('click', clickHandler);
      article.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); clickHandler(e); }
      });

      
      const saveBtn = article.querySelector('.card__save-btn');
      saveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleReadingList(book);
        
      });

      grid.appendChild(article);
    });
  }

  
  on('readingList:change', () => renderGrid());

  renderGrid();
}

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
