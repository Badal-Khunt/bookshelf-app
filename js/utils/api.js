
const BASE = 'https://openlibrary.org';
export const COVER_BASE = 'https://covers.openlibrary.org/b/id';

export async function searchBooks({ query, subject = '', sort = 'relevance', page = 1, limit = 20 } = {}) {
  const params = new URLSearchParams();

  
  let q = query.trim() || '*';
  if (subject) q += ` subject:${subject}`;
  params.set('q', q);

  if (sort && sort !== 'relevance') params.set('sort', sort);
  params.set('page', page);
  params.set('limit', limit);
  params.set('fields', 'key,title,author_name,first_publish_year,cover_i,subject,number_of_pages_median,ratings_average');

  const res = await fetch(`${BASE}/search.json?${params}`);
  if (!res.ok) throw new Error(`Open Library error: ${res.status}`);
  return res.json();
  
}


export async function getBookDetails(key) {
  const res = await fetch(`${BASE}${key}.json`);
  if (!res.ok) throw new Error(`Open Library error: ${res.status}`);
  return res.json();
}


export function getSubjectBooks(subject, limit = 12) {
  return fetch(`${BASE}/subjects/${encodeURIComponent(subject)}.json?limit=${limit}`)
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); });
}


export function getCoverUrl(coverId, size = 'M') {
  if (!coverId) return null;
  return `${COVER_BASE}/${coverId}-${size}.jpg`;
}


export const FEATURED_SUBJECTS = [
  'fiction', 'science', 'history', 'biography',
  'philosophy', 'mystery', 'romance', 'technology'
];


export const SUBJECT_OPTIONS = [
  { value: '',            label: 'All Subjects' },
  { value: 'fiction',     label: 'Fiction' },
  { value: 'nonfiction',  label: 'Non-Fiction' },
  { value: 'science',     label: 'Science' },
  { value: 'history',     label: 'History' },
  { value: 'biography',   label: 'Biography' },
  { value: 'mystery',     label: 'Mystery' },
  { value: 'romance',     label: 'Romance' },
  { value: 'philosophy',  label: 'Philosophy' },
  { value: 'technology',  label: 'Technology' },
  { value: 'children',    label: "Children's" },
  { value: 'poetry',      label: 'Poetry' },
];


export const SORT_OPTIONS = [
  { value: 'relevance',   label: 'Most Relevant' },
  { value: 'new',         label: 'Newest First' },
  { value: 'old',         label: 'Oldest First' },
  { value: 'rating',      label: 'Highest Rated' },
  { value: 'readinglog',  label: 'Most Read' },
];
