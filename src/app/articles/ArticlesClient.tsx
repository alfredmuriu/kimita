'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import BlogCard from './BlogCard';
import type { ListBlogPost } from './page';

const CATEGORIES = ['All', 'Poultry', 'Dairy', 'Pigs', 'Livestock', 'Pets', 'Feed Milling', 'AMR'];

interface ArticlesClientProps {
  posts: ListBlogPost[];
  activeCategory: string;
  counts: Record<string, number>;
}

// Normalise text for tolerant matching: lowercase, strip punctuation, collapse spaces.
function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Score a post against the search terms. Higher = more relevant; 0 = no match.
// Matches across title, keywords, category and excerpt so loose, out-of-order
// queries ("chick disease") still find the right article.
function scorePost(post: ListBlogPost, terms: string[]): number {
  const title = normalise(post.title || '');
  const excerpt = normalise(post.excerpt || '');
  const category = normalise(post.category || '');
  const keywords = normalise((post.keywords || []).join(' '));

  let score = 0;
  for (const term of terms) {
    let termHit = 0;
    if (title.includes(term)) termHit += 10;
    if (keywords.includes(term)) termHit += 6;
    if (category.includes(term)) termHit += 4;
    if (excerpt.includes(term)) termHit += 2;
    // Every term must match somewhere, otherwise the post is not a result.
    if (termHit === 0) return 0;
    score += termHit;
  }
  return score;
}

export default function ArticlesClient({ posts, activeCategory, counts }: ArticlesClientProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  // Ordered list of post IDs from the AI semantic search; null = no AI result yet
  // (use keyword fallback). Empty array = AI ran and found nothing.
  const [semanticIds, setSemanticIds] = useState<string[] | null>(null);
  const [searching, setSearching] = useState(false);

  const handleFilter = (category: string) => {
    if (category === 'All') {
      router.push('/articles');
    } else {
      router.push(`/articles?category=${encodeURIComponent(category)}`);
    }
  };

  // Instant keyword ranking — used as the immediate result and as a fallback when
  // the AI search is unavailable or hasn't responded yet.
  const keywordResults = useMemo(() => {
    const terms = normalise(query).split(' ').filter(Boolean);
    if (terms.length === 0) return posts;
    return posts
      .map((post) => ({ post, score: scorePost(post, terms) }))
      .filter((p) => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((p) => p.post);
  }, [posts, query]);

  // Debounced AI semantic search: understands natural-language questions
  // ("how do I increase milk production") by meaning, not just keywords.
  const reqId = useRef(0);
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setSemanticIds(null);
      setSearching(false);
      return;
    }

    setSearching(true);
    const myReq = ++reqId.current;
    const handle = setTimeout(async () => {
      try {
        const res = await fetch('/api/articles/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q }),
        });
        const data = await res.json();
        // Ignore responses from superseded keystrokes.
        if (myReq !== reqId.current) return;
        setSemanticIds(Array.isArray(data?.ids) ? data.ids : null);
      } catch {
        if (myReq === reqId.current) setSemanticIds(null); // fall back to keyword
      } finally {
        if (myReq === reqId.current) setSearching(false);
      }
    }, 350);

    return () => clearTimeout(handle);
  }, [query]);

  const isSearching = query.trim().length > 0;

  // Final list: prefer AI semantic order (filtered to this category's posts);
  // fall back to keyword ranking if AI returned nothing usable.
  const visiblePosts = useMemo(() => {
    if (!isSearching) return posts;

    if (semanticIds && semanticIds.length > 0) {
      const byId = new Map(posts.map((p) => [p.id, p]));
      const ordered = semanticIds
        .map((id) => byId.get(id))
        .filter((p): p is ListBlogPost => Boolean(p));
      if (ordered.length > 0) return ordered;
    }

    return keywordResults;
  }, [isSearching, semanticIds, posts, keywordResults]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        body, .s-header, .s-header__inner, .s-header__nav, .s-header__menu-links, .s-header__social, #page, .s-pagewrap, .s-content, main {
            background-color: #ffffff !important;
            color: #111111 !important;
        }
        body, #page, .s-pagewrap, .s-content, main {
            overflow: visible !important;
            overflow-x: clip !important;
        }
        .s-header__menu-links a, .email, h1, h2, h3, h4, h5, p, span {
            color: #111111 !important;
        }
        .s-header__menu-links li.current > a {
            color: #014d4b !important;
        }
        .s-header__social svg path {
            fill: #111111 !important;
        }
        .s-header__menu-toggle span, .s-header__menu-toggle span::before, .s-header__menu-toggle span::after { background-color: #111111 !important; }
        .s-header__menu-links > .dropdown > .dropdown-menu {
            background-color: #ffffff !important;
        }
        .s-header__menu-links > .dropdown > .dropdown-menu a {
            color: #111111 !important;
        }
        .s-header__menu-links > .dropdown > .dropdown-menu a:hover {
            color: #014d4b !important;
        }
        .page-title {
            color: #111111 !important;
        }
        .page-subtitle {
            color: #444444 !important;
        }
        .section-header__pretitle {
            color: #014d4b !important;
        }
        /* Sidebar Styles */
        .articles-content-wrapper {
            display: flex;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            gap: 40px;
            align-items: stretch;
        }
        .articles-sidebar {
            width: 250px;
            flex-shrink: 0;
            padding-right: 20px;
            border-right: 1px solid #eee;
        }
        .articles-sidebar-sticky {
            position: sticky;
            top: 100px;
        }
        .sidebar-title {
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 1.5px;
            margin-bottom: 20px;
            border-bottom: 1px solid #eee;
            padding-bottom: 15px;
        }
        .sidebar-menu {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        .sidebar-item {
            margin-bottom: 12px;
            padding: 0;
        }
        .sidebar-link {
            color: #111111;
            font-weight: 600;
            font-size: 15px;
            cursor: pointer;
            transition: color 0.3s;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .sidebar-link:hover,
        .sidebar-link:hover span {
            color: #014d4b !important;
        }
        .sidebar-item.active > .sidebar-link,
        .sidebar-item.active > .sidebar-link span {
            color: #166534 !important;
            font-size: 15px !important;
            font-weight: 700 !important;
            text-decoration: underline;
            text-underline-offset: 4px;
            text-decoration-thickness: 2px;
        }
        .sidebar-item-count {
            font-size: 12px;
            color: #888888 !important;
            font-weight: 400;
            transition: color 0.3s;
        }
        .sidebar-link:hover .sidebar-item-count,
        .sidebar-item.active > .sidebar-link .sidebar-item-count {
            color: #014d4b !important;
        }
        .articles-main-column {
            flex: 1;
            min-width: 0;
        }
        .articles-bg-wrapper {
            background-color: #f9fafb;
            padding-top: 60px;
            padding-bottom: 80px;
            border-top: 1px solid #f3f4f6;
        }
        .articles-empty {
            color: #666666;
            font-size: 16px;
        }
        /* Search bar */
        .articles-search {
            position: relative;
            display: block;
            width: 100%;
            max-width: 600px;
            margin: 0 auto 32px;
        }
        .articles-search-icon {
            position: absolute;
            top: 50%;
            left: 18px;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            color: #9ca3af !important;
            stroke: #9ca3af !important;
            pointer-events: none;
            z-index: 1;
        }
        input.articles-search-input {
            box-sizing: border-box;
            display: block;
            width: 625px;
            height: 35px;
            margin: 0;
            padding: 0 48px 0 50px;
            font-size: 16px;
            line-height: 56px;
            color: #111111 !important;
            background-color: #ffffff !important;
            background-image: none !important;
            border: 1px solid #e5e7eb !important;
            border-radius: 24px !important;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04) !important;
            outline: none !important;
            appearance: none;
            -webkit-appearance: none;
            transition: border-color 0.2s, box-shadow 0.2s;
            
        }
        input.articles-search-input::placeholder {
            color: #9ca3af !important;
            opacity: 1;
        }
        input.articles-search-input:focus,
        input.articles-search-input:focus-visible,
        input.articles-search-input:active {
            border-color: #166534 !important;
            outline: none !important;
            box-shadow: none !important;
        }
        .articles-search-clear {
            position: absolute;
            top: 50%;
            right: 14px;
            transform: translateY(-50%);
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            font-size: 22px;
            line-height: 1;
            color: #9ca3af;
            background: transparent;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            z-index: 1;
            transition: color 0.2s, background-color 0.2s;
        }
        .articles-search-clear:hover {
            color: #111111;
            background-color: #f3f4f6;
        }
        @media screen and (max-width: 800px) {
            .articles-content-wrapper {
                flex-direction: column;
            }
            .articles-sidebar {
                width: 100%;
                border-right: none;
                border-bottom: 1px solid #eee;
                padding-bottom: 20px;
                margin-bottom: 20px;
            }
            .articles-sidebar-sticky {
                position: static;
            }
        }
      `}} />

      <h1 className="s-intro__content-title page-title">Farming Tips &amp; Agricultural Insights</h1>
      <p className="page-subtitle">Practical guides and expert advice for poultry, dairy, and livestock farmers across Africa</p>

      <div className="articles-bg-wrapper">
        <div className="articles-content-wrapper">

          {/* Sidebar */}
          <aside className="articles-sidebar">
            <div className="articles-sidebar-sticky">
              <div className="sidebar-title">CATEGORIES</div>
              <ul className="sidebar-menu">
                {CATEGORIES.map((cat) => (
                  <li
                    key={cat}
                    className={`sidebar-item ${activeCategory === cat ? 'active' : ''}`}
                  >
                    <div className="sidebar-link" onClick={() => handleFilter(cat)}>
                      <span>{cat === 'All' ? 'ALL POSTS' : cat === 'Livestock' ? 'GOATS AND SHEEP' : cat === 'Feed Milling' ? 'FEED MILLING' : cat.toUpperCase()}</span>
                      <span className="sidebar-item-count">{counts[cat] ?? 0}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Posts Grid */}
          <div className="articles-main-column">
            {/* Search bar */}
            <div className="articles-search">
              <svg className="articles-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="articles-search-input"
                placeholder="Search articles — e.g. chick disease, dairy feed, pig farming"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search articles"
              />
              {isSearching && (
                <button
                  type="button"
                  className="articles-search-clear"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                >
                  &times;
                </button>
              )}
            </div>

            <div className="blog-listing">
              {visiblePosts.length === 0 ? (
                <p className="articles-empty">
                  {searching
                    ? 'Searching…'
                    : isSearching
                    ? `No articles match “${query.trim()}”. Try rephrasing your search.`
                    : 'No posts in this category yet. Check back soon!'}
                </p>
              ) : (
                visiblePosts.map((post) => <BlogCard key={post.id} post={post} />)
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
