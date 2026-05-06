
import { searchBooks }    from '../utils/api.js';
import { createCard }     from '../components/card.js';
import { navigate }       from '../utils/router.js';
import { setSearchFilters } from '../utils/state.js';

export async function renderHome(container) {
  container.innerHTML = `
    <!-- Hero -->
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero__bg" aria-hidden="true">
        <div class="hero__bg-spines" id="spine-container"></div>
      </div>
      <div class="hero__content">
        <p class="hero__label">Your personal library</p>
        <h1 class="hero__title" id="hero-title">
          Read <em>More,</em><br>Discover <em>More</em>
        </h1>
        <p class="hero__desc">
          Search millions of books from the Open Library.
          Save what you want to read and explore new subjects.
        </p>
        <div class="hero__actions">
          <button class="btn btn--accent btn--lg" id="hero-search-btn">Browse Books</button>
          <a href="#/reading" class="btn btn--outline btn--lg">My Reading List</a>
        </div>
        <div class="hero__search" role="search" aria-label="Quick book search">
          <div class="search-bar">
            <label for="hero-input" class="sr-only">Search books</label>
            <input
              type="search" id="hero-input"
              placeholder="Search for a book or author…"
              autocomplete="off" aria-label="Quick search"
            />
            <button class="btn btn--accent btn--sm" id="hero-go" aria-label="Search">Go</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <div class="container">
      <div class="feature-strip" role="list" aria-label="App features">
        <div class="feature-item" role="listitem">
          <div class="feature-item__icon" aria-hidden="true">🔍</div>
          <div>
            <p class="feature-item__title">Powerful Search</p>
            <p class="feature-item__desc">Search by title, author, or subject across millions of books.</p>
          </div>
        </div>
        <div class="feature-item" role="listitem">
          <div class="feature-item__icon" aria-hidden="true">🔖</div>
          <div>
            <p class="feature-item__title">Reading List</p>
            <p class="feature-item__desc">Save books you want to read. Stored in your browser.</p>
          </div>
        </div>
        <div class="feature-item" role="listitem">
          <div class="feature-item__icon" aria-hidden="true">📚</div>
          <div>
            <p class="feature-item__title">Open Data</p>
            <p class="feature-item__desc">Powered by Open Library — no account or API key required.</p>
          </div>
        </div>
        <div class="feature-item" role="listitem">
          <div class="feature-item__icon" aria-hidden="true">🌐</div>
          <div>
            <p class="feature-item__title">Free Forever</p>
            <p class="feature-item__desc">Open Library is a project of the Internet Archive. Always free.</p>
          </div>
        </div>
      </div>

      <!-- Popular books section -->
      <section class="section" aria-labelledby="popular-title">
        <div class="section-head">
          <h2 class="section-title" id="popular-title">Popular Right Now</h2>
          <a href="#/search" class="section-link">See all →</a>
        </div>
        <div id="popular-row" class="scroll-row" role="list" aria-label="Popular books">
          <div class="loader"><div class="loader__spinner"></div></div>
        </div>
      </section>

      <!-- Fiction section -->
      <section class="section" aria-labelledby="fiction-title">
        <div class="section-head">
          <h2 class="section-title" id="fiction-title">Fiction</h2>
          <a href="#/search" class="section-link" id="fiction-more" data-subject="fiction">Explore →</a>
        </div>
        <div id="fiction-row" class="scroll-row" role="list" aria-label="Fiction books">
          <div class="loader"><div class="loader__spinner"></div></div>
        </div>
      </section>
    </div>
  `;

  
  const spines = container.querySelector('#spine-container');
  const heights = [60, 90, 75, 50, 100, 65, 80, 55, 95, 70, 85, 60, 78, 92];
  heights.forEach(h => {
    const s = document.createElement('div');
    s.className = 'spine';
    s.style.height = h + '%';
    spines.appendChild(s);
  });

  
  container.querySelector('#hero-search-btn').addEventListener('click', () => navigate('/search'));

  const heroInput = container.querySelector('#hero-input');
  const heroGo    = container.querySelector('#hero-go');
  const goSearch  = () => {
    const q = heroInput.value.trim();
    if (q) {
      setSearchFilters({ query: q, page: 1 });
      navigate('/search');
    }
  };
  heroGo.addEventListener('click', goSearch);
  heroInput.addEventListener('keydown', e => { if (e.key === 'Enter') goSearch(); });

  
  container.querySelector('#fiction-more').addEventListener('click', (e) => {
    e.preventDefault();
    setSearchFilters({ subject: 'fiction', query: '', page: 1 });
    navigate('/search');
  });

  
  loadRow(container, '#popular-row', 'the', '');
  loadRow(container, '#fiction-row', 'fiction', 'fiction');
}

async function loadRow(container, selector, query, subject) {
  const row = container.querySelector(selector);
  try {
    const data = await searchBooks({ query, subject, limit: 12 });
    row.innerHTML = '';
    (data.docs || []).slice(0, 12).forEach(book => {
      const card = createCard(book);
      card.setAttribute('role', 'listitem');
      row.appendChild(card);
    });
    if (!row.children.length) {
      row.innerHTML = `<p style="color:var(--clr-text-muted);padding:var(--sp-8)">No books found.</p>`;
    }
  } catch {
    row.innerHTML = `<p style="color:var(--clr-text-muted);padding:var(--sp-8)">Could not load books.</p>`;
  }
}
