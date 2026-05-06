
import { searchBooks, SUBJECT_OPTIONS, SORT_OPTIONS } from '../utils/api.js';
import { getSearchFilters, setSearchFilters, resetSearchFilters } from '../utils/state.js';
import { createCard } from '../components/card.js';

let debounceTimer = null;
let pageContainer = null;

export async function renderSearch(container) {
  pageContainer = container;
  const f = getSearchFilters();

  
  const subjectOpts = SUBJECT_OPTIONS.map(o =>
    `<option value="${o.value}" ${o.value === f.subject ? 'selected' : ''}>${o.label}</option>`
  ).join('');

  
  const sortOpts = SORT_OPTIONS.map(o =>
    `<option value="${o.value}" ${o.value === f.sort ? 'selected' : ''}>${o.label}</option>`
  ).join('');

  container.innerHTML = `
    <div class="page container">
      <header class="page__header">
        <h1 class="page__title">Search Books</h1>
        <p class="page__subtitle">Find books by title, author, or subject</p>
      </header>

      <!-- Controls -->
      <div class="search-controls" role="search" aria-label="Book search and filters">
        <div class="search-controls__row">
          <div class="search-bar" style="flex:1;min-width:200px">
            <label for="search-input" class="sr-only">Search books</label>
            <input
              type="search" id="search-input"
              placeholder="Title, author, keyword…"
              autocomplete="off"
              value="${esc(f.query)}"
              aria-label="Search books"
            />
            <button class="btn btn--accent btn--sm" id="search-btn" aria-label="Search">Search</button>
          </div>
        </div>
        <div class="search-controls__row" role="group" aria-label="Filter and sort options">
          <label class="sr-only" for="subject-select">Filter by subject</label>
          <select class="filter-select" id="subject-select" aria-label="Filter by subject">
            ${subjectOpts}
          </select>

          <label class="sr-only" for="sort-select">Sort results</label>
          <select class="filter-select" id="sort-select" aria-label="Sort results">
            ${sortOpts}
          </select>

          <button class="btn btn--outline btn--sm" id="reset-btn">✕ Clear filters</button>
        </div>
      </div>

      <!-- Results -->
      <p class="results-info" id="results-info" aria-live="polite" aria-atomic="true"></p>
      <div id="results-grid" class="book-grid" role="list" aria-label="Search results"></div>
      <div id="pagination" class="pagination" style="margin-top:var(--sp-10)" role="navigation" aria-label="Page navigation"></div>
    </div>
  `;

  
  const searchInput  = container.querySelector('#search-input');
  const searchBtn    = container.querySelector('#search-btn');
  const subjectSel   = container.querySelector('#subject-select');
  const sortSel      = container.querySelector('#sort-select');
  const resetBtn     = container.querySelector('#reset-btn');

  
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      setSearchFilters({ query: searchInput.value.trim(), page: 1 });
      loadResults();
    }, 500);
  });

  searchBtn.addEventListener('click', () => {
    setSearchFilters({ query: searchInput.value.trim(), page: 1 });
    loadResults();
  });

  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      setSearchFilters({ query: searchInput.value.trim(), page: 1 });
      loadResults();
    }
  });

  subjectSel.addEventListener('change', () => {
    setSearchFilters({ subject: subjectSel.value, page: 1 });
    loadResults();
  });

  sortSel.addEventListener('change', () => {
    setSearchFilters({ sort: sortSel.value, page: 1 });
    loadResults();
  });

  resetBtn.addEventListener('click', () => {
    resetSearchFilters();
    searchInput.value  = '';
    subjectSel.value   = '';
    sortSel.value      = 'relevance';
    loadResults();
  });

  
  loadResults();
}


async function loadResults() {
  if (!pageContainer) return;
  const grid  = pageContainer.querySelector('#results-grid');
  const info  = pageContainer.querySelector('#results-info');
  const pages = pageContainer.querySelector('#pagination');
  if (!grid) return;

  grid.innerHTML  = `<div class="loader"><div class="loader__spinner"></div></div>`;
  pages.innerHTML = '';
  info.textContent = '';

  const f = getSearchFilters();
  
  const query = f.query || 'the';

  try {
    const data = await searchBooks({ query, subject: f.subject, sort: f.sort, page: f.page, limit: 20 });
    grid.innerHTML = '';

    if (!data.docs?.length) {
      grid.innerHTML = `
        <div class="state-msg">
          <h3>No books found</h3>
          <p>Try a different search term or clear the filters.</p>
        </div>`;
      info.textContent = '0 results';
      return;
    }

    const total = data.numFound?.toLocaleString() ?? data.docs.length;
    info.innerHTML = `Showing <span>${data.docs.length}</span> of <span>${total}</span> results`;

    data.docs.forEach(book => {
      const card = createCard(book);
      card.setAttribute('role', 'listitem');
      grid.appendChild(card);
    });

    buildPagination(pages, f.page, Math.min(Math.ceil(data.numFound / 20), 100));

  } catch (err) {
    grid.innerHTML = `
      <div class="state-msg">
        <h3>Something went wrong</h3>
        <p>Could not reach Open Library. Check your connection.</p>
      </div>`;
  }
}


function buildPagination(container, current, total) {
  if (total <= 1) return;
  const pages = getPageNums(current, total);
  container.innerHTML = '';

  const prev = document.createElement('button');
  prev.className = 'pagination__btn';
  prev.textContent = '← Prev';
  prev.disabled = current <= 1;
  prev.setAttribute('aria-label', 'Previous page');
  prev.addEventListener('click', () => changePage(current - 1));
  container.appendChild(prev);

  pages.forEach(p => {
    const btn = document.createElement('button');
    btn.className = `pagination__btn${p === current ? ' active' : ''}`;
    btn.textContent = p === '…' ? '…' : p;
    if (p === current) btn.setAttribute('aria-current', 'page');
    btn.setAttribute('aria-label', p === '…' ? 'More pages' : `Page ${p}`);
    if (p !== '…') btn.addEventListener('click', () => changePage(p));
    else btn.disabled = true;
    container.appendChild(btn);
  });

  const next = document.createElement('button');
  next.className = 'pagination__btn';
  next.textContent = 'Next →';
  next.disabled = current >= total;
  next.setAttribute('aria-label', 'Next page');
  next.addEventListener('click', () => changePage(current + 1));
  container.appendChild(next);
}

function changePage(page) {
  setSearchFilters({ page });
  loadResults();
  pageContainer?.querySelector('.page')?.scrollIntoView({ behavior: 'smooth' });
}

function getPageNums(cur, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (cur <= 4)   return [1, 2, 3, 4, 5, '…', total];
  if (cur >= total - 3) return [1, '…', total-4, total-3, total-2, total-1, total];
  return [1, '…', cur-1, cur, cur+1, '…', total];
}

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
