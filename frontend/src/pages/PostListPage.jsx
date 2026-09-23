import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchCategories, fetchPosts } from '../api';
import CategoryTree from '../components/CategoryTree';
import { LoadingState, EmptyState, ErrorState } from '../components/States';
import { Search, Compass, Clock, ArrowRight, X } from 'lucide-react';

export default function PostListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category');
  const currentSearchQuery = searchParams.get('search') || '';

  const [categories, setCategories] = useState([]);
  const [postsData, setPostsData] = useState({ results: [], next: null, previous: null });
  const [page, setPage] = useState(1);

  // Search UI state
  const [isSearchOpen, setIsSearchOpen] = useState(!!currentSearchQuery);
  const [searchInput, setSearchInput] = useState(currentSearchQuery);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch categories ONCE on mount
  useEffect(() => {
    let isMounted = true;
    fetchCategories()
      .then((data) => {
        if (isMounted) setCategories(Array.isArray(data) ? data : data.results || []);
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoadingCategories(false);
      });

    return () => { isMounted = false; };
  }, []);

  // 2. Fetch posts whenever category, page, OR search query changes
  useEffect(() => {
    let isMounted = true;
    setLoadingPosts(true);
    setError(null);

    fetchPosts(selectedCategory, page, currentSearchQuery)
      .then((data) => {
        if (isMounted) {
          if (Array.isArray(data)) {
            setPostsData({ results: data, next: null, previous: null });
          } else {
            setPostsData({
              results: data.results || [],
              next: data.next || null,
              previous: data.previous || null,
            });
          }
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoadingPosts(false);
      });

    return () => { isMounted = false; };
  }, [selectedCategory, page, currentSearchQuery]);

  const handleCategorySelect = (slug) => {
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (slug) {
      newParams.set('category', slug);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set('search', searchInput.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setIsSearchOpen(false);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    setSearchParams(newParams);
  };

  const postList = postsData.results || [];

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#2D312E] selection:bg-[#EADECA]">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-[#FAF9F5]/80 border-b border-[#E8E5DF]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#2D312E] text-[#FAF9F5] flex items-center justify-center font-serif font-bold text-lg shadow-sm">
              M
            </div>
            <Link to="/" className="font-semibold text-lg tracking-tight text-[#2D312E]">
              Microblog
            </Link>
          </div>

          {/* Expandable Search Input */}
          <div className="flex items-center gap-2">
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search articles..."
                  autoFocus
                  className="w-48 sm:w-64 pl-9 pr-8 py-1.5 text-sm bg-[#F5F3EF] border border-[#E8E5DF] rounded-full focus:outline-none focus:ring-2 focus:ring-[#2D312E]/20 transition-all"
                />
                <Search size={15} className="absolute left-3 text-[#718096]" />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-2.5 text-[#718096] hover:text-[#2D312E]"
                  >
                    <X size={14} />
                  </button>
                )}
              </form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full hover:bg-[#F2EFE9] text-[#718096] transition"
                title="Search posts"
              >
                <Search size={18} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Sidebar */}
        <aside className="md:col-span-4 lg:col-span-3">
          <div className="sticky top-24 bg-[#F5F3EF] border border-[#E8E5DF] p-5 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E8E5DF]">
              <h2 className="text-base font-semibold text-[#2D312E] flex items-center gap-2">
                <Compass size={18} className="text-[#8C9A8E]" /> Topics
              </h2>
              {selectedCategory && (
                <button
                  onClick={() => handleCategorySelect(null)}
                  className="text-xs text-[#8C9A8E] hover:underline font-medium"
                >
                  Clear filter
                </button>
              )}
            </div>

            {loadingCategories ? (
              <LoadingState message="Organizing categories..." />
            ) : (
              <div>
                <button
                  onClick={() => handleCategorySelect(null)}
                  className={`w-full text-left px-3 py-2.5 mb-2 rounded-full text-sm font-medium transition-all ${
                    !selectedCategory
                      ? 'bg-[#2D312E] text-white shadow-sm'
                      : 'text-[#4A5568] hover:bg-[#F2EFE9]'
                  }`}
                >
                  All Articles
                </button>

                <CategoryTree
                  categories={categories}
                  selectedSlug={selectedCategory}
                  onSelectCategory={handleCategorySelect}
                />
              </div>
            )}
          </div>
        </aside>

        {/* Content Feed */}
        <section className="md:col-span-8 lg:col-span-9">
          {/* Active Search Filter Banner */}
          {currentSearchQuery && (
            <div className="flex items-center justify-between bg-[#EADECA]/40 border border-[#EADECA] px-4 py-2.5 rounded-full mb-6 text-sm">
              <span className="text-[#2C3531]">
                Showing results for: <strong className="font-semibold">"{currentSearchQuery}"</strong>
              </span>
              <button
                onClick={handleClearSearch}
                className="text-xs font-semibold text-[#2C3531] underline hover:opacity-80"
              >
                Clear Search
              </button>
            </div>
          )}

          {error && <ErrorState message={error} onRetry={() => window.location.reload()} />}

          {!error && loadingPosts && <LoadingState message="Searching calm perspectives..." />}

          {!error && !loadingPosts && postList.length === 0 && (
            <EmptyState message={currentSearchQuery ? `No articles matched "${currentSearchQuery}"` : undefined} />
          )}

          {!error && !loadingPosts && postList.length > 0 && (
            <div className="space-y-6">
              {postList.map((post) => (
                <article
                  key={post.id}
                  className="group bg-[#F5F3EF] border border-[#E8E5DF] rounded-3xl p-6 sm:p-8 hover:shadow-md hover:border-[#DCD8D0] transition-all duration-300"
                >
                  <div className="flex items-center gap-3 text-xs font-medium text-[#718096] mb-3">
                    <span className="flex items-center gap-1">
                      <Clock size={13} />
                      {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    {post.category && (
                      <>
                        <span>•</span>
                        <span className="bg-[#EADECA] text-[#2C3531] px-3 py-0.5 rounded-full font-medium">
                          {post.category.name}
                        </span>
                      </>
                    )}
                  </div>

                  <h2 className="text-2xl font-bold text-[#2D312E] tracking-tight group-hover:text-[#8C9A8E] transition-colors mb-3">
                    <Link to={`/posts/${post.slug}`}>{post.title}</Link>
                  </h2>

                  <p className="text-[#4A5568] text-sm leading-relaxed line-clamp-3 mb-6">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <Link
                      to={`/posts/${post.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#2D312E] hover:text-[#8C9A8E] transition"
                    >
                      Read story <ArrowRight size={15} />
                    </Link>
                  </div>
                </article>
              ))}

              {(postsData.next || postsData.previous) && (
                <div className="flex items-center justify-between pt-6">
                  <button
                    disabled={!postsData.previous}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className="px-5 py-2.5 rounded-full text-sm font-medium bg-[#F5F3EF] border border-[#E8E5DF] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#EADECA] transition"
                  >
                    Previous
                  </button>
                  <span className="text-xs font-medium text-[#718096]">Page {page}</span>
                  <button
                    disabled={!postsData.next}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="px-5 py-2.5 rounded-full text-sm font-medium bg-[#2D312E] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#4A5568] transition"
                  >
                    Next Page
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
