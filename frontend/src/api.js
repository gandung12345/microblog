const API_BASE_URL = 'http://localhost:8000/api';

export async function fetchCategories() {
  const res = await fetch(`${API_BASE_URL}/categories/`);
  if (!res.ok) throw new Error('Failed to load categories');
  const data = await res.json();
  return Array.isArray(data) ? data : data.results || [];
}

export async function fetchPosts(categorySlug = null, page = 1, searchQuery = '') {
  let url = `${API_BASE_URL}/posts/?page=${page}`;

  if (categorySlug) {
    url += `&category=${encodeURIComponent(categorySlug)}`;
  }

  if (searchQuery) {
    url += `&search=${encodeURIComponent(searchQuery)}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load posts');
  return res.json();
}

export async function fetchPostBySlug(slug) {
  const res = await fetch(`${API_BASE_URL}/posts/${encodeURIComponent(slug)}/`);
  if (!res.ok) {
    if (res.status === 404) throw new Error('Post not found');
    throw new Error('Failed to load post');
  }
  return res.json();
}
