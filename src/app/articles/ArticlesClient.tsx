'use client';

import { useRouter } from 'next/navigation';
import BlogCard from './BlogCard';
import { BlogPost } from '@/lib/supabase';

const CATEGORIES = ['All', 'Poultry', 'Dairy', 'Pigs', 'Livestock', 'Pets', 'Feed Milling'];

interface ArticlesClientProps {
  posts: BlogPost[];
  activeCategory: string;
  counts: Record<string, number>;
}

export default function ArticlesClient({ posts, activeCategory, counts }: ArticlesClientProps) {
  const router = useRouter();

  const handleFilter = (category: string) => {
    if (category === 'All') {
      router.push('/articles');
    } else {
      router.push(`/articles?category=${encodeURIComponent(category)}`);
    }
  };

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
            <div className="blog-listing">
              {posts.length === 0 ? (
                <p className="articles-empty">
                  No posts in this category yet. Check back soon!
                </p>
              ) : (
                posts.map((post) => <BlogCard key={post.id} post={post} />)
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
