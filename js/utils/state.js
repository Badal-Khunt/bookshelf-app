
const state = {
  
  readingList: JSON.parse(localStorage.getItem('bs_reading_list') || '[]'),

  
  cookieConsent: localStorage.getItem('bs_cookie_consent') || null,

  
  search: {
    query:   '',
    subject: '',
    sort:    'relevance',
    page:    1,
  },
};


const listeners = {};

export function on(event, fn) {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(fn);
}

export function emit(event, data) {
  (listeners[event] || []).forEach(fn => fn(data));
}


export function getReadingList() {
  return [...state.readingList];
}

export function isInReadingList(key) {
  return state.readingList.some(b => b.key === key);
}

export function toggleReadingList(book) {
  if (isInReadingList(book.key)) {
    state.readingList = state.readingList.filter(b => b.key !== book.key);
  } else {
    
    state.readingList = [...state.readingList, {
      key:     book.key,
      title:   book.title,
      author:  book.author_name?.[0] ?? 'Unknown author',
      year:    book.first_publish_year ?? '',
      coverId: book.cover_i ?? null,
    }];
  }
  localStorage.setItem('bs_reading_list', JSON.stringify(state.readingList));
  emit('readingList:change', state.readingList);
}


export function getCookieConsent() { return state.cookieConsent; }

export function setCookieConsent(value) {
  state.cookieConsent = value;
  localStorage.setItem('bs_cookie_consent', value);
  emit('cookie:change', value);
}


export function getSearchFilters() { return { ...state.search }; }

export function setSearchFilters(updates) {
  state.search = { ...state.search, ...updates };
  emit('search:change', state.search);
}

export function resetSearchFilters() {
  state.search = { query: '', subject: '', sort: 'relevance', page: 1 };
  emit('search:change', state.search);
}
