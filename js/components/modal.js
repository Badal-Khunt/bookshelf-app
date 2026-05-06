
import { getBookDetails, getCoverUrl }         from '../utils/api.js';
import { isInReadingList, toggleReadingList }   from '../utils/state.js';

let activeModal = null;

export async function openModal(book) {
  
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', `Details for ${book.title}`);
  overlay.innerHTML = `<div class="modal"><div class="loader"><div class="loader__spinner"></div></div></div>`;
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  activeModal = overlay;

  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', onKeydown);

  
  try {
    const details = await getBookDetails(book.key);
    if (activeModal !== overlay) return;
    renderModal(overlay, book, details);
  } catch {
    if (activeModal !== overlay) return;
    const m = overlay.querySelector('.modal');
    m.innerHTML = `
      <button class="modal__close" aria-label="Close">✕</button>
      <div class="state-msg"><h3>Could not load details</h3><p>Please try again.</p></div>
    `;
    m.querySelector('.modal__close').addEventListener('click', closeModal);
  }
}

function renderModal(overlay, book, details) {
  const saved     = isInReadingList(book.key);
  const author    = book.author_name?.[0] ?? 'Unknown author';
  const year      = book.first_publish_year ?? '—';
  const pages     = book.number_of_pages_median ? `${book.number_of_pages_median} pages` : '';
  const rating    = book.ratings_average ? book.ratings_average.toFixed(1) : '';
  const coverUrl  = getCoverUrl(book.cover_i, 'L');
  const subjects  = (details.subjects || []).slice(0, 6);
  const desc      = typeof details.description === 'string'
    ? details.description
    : details.description?.value ?? '';

  const modal = overlay.querySelector('.modal');
  modal.innerHTML = `
    <button class="modal__close" aria-label="Close modal">✕</button>
    <div class="modal__layout">
      ${coverUrl
        ? `<img class="modal__cover" src="${coverUrl}" alt="Cover of ${esc(book.title)}" />`
        : `<div class="modal__cover-placeholder" aria-hidden="true">📖</div>`
      }
      <div class="modal__info">
        <div>
          <h2 class="modal__title">${esc(book.title)}</h2>
          <p class="modal__author">by ${esc(author)}</p>
        </div>
        <div class="modal__tags">
          ${year      ? `<span class="modal__tag">📅 ${year}</span>` : ''}
          ${pages     ? `<span class="modal__tag">📄 ${pages}</span>` : ''}
          ${rating    ? `<span class="modal__tag">⭐ ${rating}/5</span>` : ''}
          ${subjects.map(s => `<span class="modal__tag">${esc(s)}</span>`).join('')}
        </div>
        ${desc ? `<p class="modal__desc">${esc(desc)}</p>` : ''}
        <div class="modal__actions">
          <button class="btn btn--${saved ? 'outline' : 'accent'} modal-save-btn">
            ${saved ? '🔖 In Reading List' : '+ Add to Reading List'}
          </button>
          <a href="https://openlibrary.org${book.key}"
             target="_blank" rel="noopener noreferrer"
             class="btn btn--outline">View on Open Library ↗</a>
        </div>
      </div>
    </div>
  `;

  modal.querySelector('.modal__close').addEventListener('click', closeModal);

  const saveBtn = modal.querySelector('.modal-save-btn');
  saveBtn.addEventListener('click', () => {
    toggleReadingList(book);
    const nowSaved = isInReadingList(book.key);
    saveBtn.textContent = nowSaved ? '🔖 In Reading List' : '+ Add to Reading List';
    saveBtn.className   = `btn btn--${nowSaved ? 'outline' : 'accent'} modal-save-btn`;
  });

  setTimeout(() => modal.querySelector('.modal__close')?.focus(), 50);
}

export function closeModal() {
  if (!activeModal) return;
  activeModal.remove();
  activeModal = null;
  document.body.style.overflow = '';
  document.removeEventListener('keydown', onKeydown);
}

function onKeydown(e) {
  if (e.key === 'Escape') closeModal();
}

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
