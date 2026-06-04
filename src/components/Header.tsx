'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const VIDEO_CATEGORIES = [
  {
    name: 'Poultry Farming',
    filter: 'Poultry Farming',
    subcategories: [
      { name: 'Getting Started', anchor: 'getting-started' },
      { name: 'Brooding & Early Chick Care', anchor: 'brooding' },
      { name: 'Poultry Feeding', anchor: 'poultry-feeding' },
      { name: 'Poultry Housing & Farm Setup', anchor: 'poultry-housing' },
      { name: 'Poultry Health & Disease', anchor: 'poultry-health' },
      { name: 'Poultry Welfare & Biosecurity', anchor: 'poultry-welfare' },
    ],
  },
  {
    name: 'Large Animals',
    filter: 'Large Animals',
    subcategories: [
      { name: 'Getting Started', anchor: 'large-animal-getting-started' },
      { name: 'Housing & Farm Setup', anchor: 'large-animal-housing' },
      { name: 'Feeding & Supplementing', anchor: 'large-animal-feeding' },
      { name: 'Production', anchor: 'large-animal-production' },
      { name: 'Breeding & Reproduction', anchor: 'large-animal-breeding' },
      { name: 'Health Management', anchor: 'large-animal-health' },
      { name: 'Sustainability & Natural Practices', anchor: 'large-animal-sustainability' },
      { name: 'Business & Marketing', anchor: 'large-animal-business' },
    ],
  },
  {
    name: 'Biogar Series',
    filter: 'Biogar Series',
    subcategories: [
      { name: 'Milk and Meat Quality', anchor: 'biogar-series' },
      { name: 'Gut Health & Rumen Modulation', anchor: 'biogar-series' },
      { name: 'Feed Protection', anchor: 'biogar-series' },
      { name: 'Environmental Benefits', anchor: 'biogar-series' },
      { name: 'Disease Control & Immunity', anchor: 'biogar-series' },
      { name: 'Ascites Support', anchor: 'biogar-series' },
      { name: 'Antibiotic Challenge', anchor: 'biogar-series' },
      { name: 'Growth & Feed Conversion', anchor: 'biogar-series' },
      { name: 'Mastitis Support', anchor: 'biogar-series' },
    ],
  },
];

const ARTICLE_CATEGORIES = [
  { name: 'Poultry', query: 'Poultry' },
  { name: 'Dairy', query: 'Dairy' },
  { name: 'Pigs', query: 'Pigs' },
  { name: 'Goats and Sheep', query: 'Livestock' },
  { name: 'Pets', query: 'Pets' },
  { name: 'Feed Milling', query: 'Feed+Milling' },
  { name: 'AMR', query: 'AMR' },
];

export default function Header() {
  const pathname = usePathname();

  useEffect(() => {
    const toggle = document.querySelector('.s-header__menu-toggle');
    const body = document.body;
    if (!toggle) return;
    const onClick = (e: Event) => {
      e.preventDefault();
      toggle.classList.toggle('is-clicked');
      body.classList.toggle('menu-is-open');
    };
    toggle.addEventListener('click', onClick);
    const navLinks = document.querySelectorAll('.s-header__nav a');
    const onLinkClick = () => {
      if (window.matchMedia('(max-width: 800px)').matches) {
        toggle.classList.remove('is-clicked');
        body.classList.remove('menu-is-open');
      }
    };
    navLinks.forEach((l) => l.addEventListener('click', onLinkClick));
    return () => {
      toggle.removeEventListener('click', onClick);
      navLinks.forEach((l) => l.removeEventListener('click', onLinkClick));
    };
  }, [pathname]);

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        /* Clean dropdown panel styles */
        .s-header__menu-links .dropdown-menu {
          border-radius: 0 !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12) !important;
          padding: 6px 0 !important;
          margin-top: 6px !important;
          min-width: 180px !important;
        }
        .s-header__menu-links .dropdown-menu li {
          list-style: none !important;
          margin: 0 !important;
        }
        .s-header__menu-links .dropdown-menu li a {
          display: block !important;
          padding: 8px 16px !important;
          font-size: 13.5px !important;
          font-weight: 400 !important;
          transition: color 0.15s !important;
          white-space: nowrap !important;
        }
        /* Academy dropdown with side flyouts */
        .academy-dropdown-menu {
          width: 200px !important;
          overflow: visible !important;
        }
        .academy-dropdown-menu .academy-group {
          position: relative;
        }
        .academy-dropdown-menu .academy-group-header-link {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          padding: 10px 16px !important;
          font-size: 13.5px !important;
          font-weight: 400 !important;
          text-decoration: none !important;
          transform-origin: left center;
          transition: transform 0.3s ease, color 0.2s !important;
        }
        .academy-dropdown-menu .academy-group-header-link:hover {
          transform: scale(1.05);
          color: white !important;
          background: none !important;
        }
        .academy-dropdown-menu .academy-group-chevron-side {
          width: 11px;
          height: 11px;
          opacity: 0.5;
          flex-shrink: 0;
          margin-left: 8px;
        }
        .academy-dropdown-menu .academy-group:hover > .academy-group-header-link .academy-group-chevron-side {
          opacity: 1;
        }
        .academy-flyout {
          position: absolute;
          top: -6px;
          left: 100%;
          min-width: 240px;
          padding: 12px 8px !important;
          margin: 0 0 0 2px !important;
          list-style: none !important;
          background: inherit;
          background-color: #1C1C28;
          box-shadow: 0 4px 16px rgba(0,0,0,0.18);
          display: flex;
          flex-direction: column;
          gap: 4px;
          opacity: 0;
          visibility: hidden;
          transform: translateX(-6px);
          transition: opacity 0.18s ease, transform 0.18s ease, visibility 0.18s;
          pointer-events: none;
        }
        .academy-flyout-cascade {
          min-width: 200px;
          padding: 6px 0 !important;
        }
        .academy-cascade-item {
          position: relative;
          list-style: none !important;
          margin: 0 !important;
        }
        .academy-cascade-link {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          padding: 8px 16px !important;
          font-size: 13.5px !important;
          font-weight: 400 !important;
          color: rgba(255,255,255,0.78) !important;
          text-decoration: none !important;
          white-space: nowrap !important;
          transform-origin: left center;
          transition: transform 0.3s ease, color 0.2s !important;
        }
        .academy-cascade-link:hover {
          transform: scale(1.05);
          color: #ffffff !important;
          background: none !important;
        }
        .academy-cascade-item:hover > .academy-cascade-link .academy-group-chevron-side {
          opacity: 1;
        }
        .academy-subflyout {
          position: absolute;
          top: -6px;
          left: 100%;
          min-width: 240px;
          padding: 8px 0 !important;
          margin: 0 0 0 2px !important;
          list-style: none !important;
          background-color: #1C1C28;
          box-shadow: 0 4px 16px rgba(0,0,0,0.18);
          opacity: 0;
          visibility: hidden;
          transform: translateX(-6px);
          transition: opacity 0.18s ease, transform 0.18s ease, visibility 0.18s;
          pointer-events: none;
        }
        .academy-cascade-item:hover > .academy-subflyout {
          opacity: 1;
          visibility: visible;
          transform: translateX(0);
          pointer-events: auto;
        }
        .academy-subflyout li {
          list-style: none !important;
          margin: 0 !important;
        }
        .academy-subflyout a {
          display: block !important;
          padding: 7px 16px !important;
          font-size: 13px !important;
          font-weight: 400 !important;
          color: rgba(255,255,255,0.78) !important;
          text-decoration: none !important;
          white-space: nowrap !important;
          transform-origin: left center;
          transition: transform 0.3s ease, color 0.2s !important;
        }
        .academy-subflyout a:hover {
          transform: scale(1.05);
          color: #ffffff !important;
          background: none !important;
        }
        .academy-dropdown-menu .academy-group:hover > .academy-flyout {
          opacity: 1;
          visibility: visible;
          transform: translateX(0);
          pointer-events: auto;
        }
        .academy-flyout-group {
          list-style: none !important;
          padding: 6px 0;
          flex: 1;
          min-width: 0;
        }
        .academy-flyout:not(.academy-flyout-grid) .academy-flyout-group + .academy-flyout-group {
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .academy-flyout-grid .academy-flyout-group + .academy-flyout-group {
          border-left: 1px solid rgba(255,255,255,0.08);
          padding-left: 8px;
        }
        .academy-flyout-group-title {
          display: block !important;
          padding: 6px 16px !important;
          font-size: 11px !important;
          font-weight: 700 !important;
          letter-spacing: 1px !important;
          text-transform: uppercase !important;
          color: rgba(255,255,255,0.5) !important;
          text-decoration: none !important;
          transform-origin: left center;
          transition: transform 0.3s ease, color 0.2s !important;
        }
        .academy-flyout-group-title:hover {
          transform: scale(1.05);
          color: #ffffff !important;
          background: none !important;
        }
        .academy-flyout-group ul {
          list-style: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        .academy-flyout li {
          list-style: none !important;
          margin: 0 !important;
        }
        .academy-flyout a {
          display: block !important;
          padding: 7px 16px !important;
          font-size: 13px !important;
          font-weight: 400 !important;
          color: rgba(255,255,255,0.78) !important;
          text-decoration: none !important;
          white-space: nowrap !important;
          transform-origin: left center;
          transition: transform 0.3s ease, color 0.2s !important;
        }
        .academy-flyout a:hover {
          transform: scale(1.05);
          color: #ffffff !important;
          background: none !important;
        }
        .academy-flyout-simple {
          min-width: 200px;
        }
        .s-header__social {
          flex-direction: column !important;
          align-items: flex-start !important;
          gap: 8px !important;
        }
        .s-header__social li {
          margin: 0 !important;
        }
        .s-header__social .email {
          font-size: 1.4rem !important;
        }
        .s-header__social svg {
          width: 18px !important;
          height: 18px !important;
        }
      `}} />
      {pathname !== '/' && (
        <style dangerouslySetInnerHTML={{ __html: `
          .s-header__menu-links .dropdown-menu {
            background-color: #ffffff !important;
          }
          .s-header__menu-links .dropdown-menu li a {
            color: #111111 !important;
          }
          .s-header__menu-links .dropdown-menu li a:hover {
            color: #014d4b !important;
          }
          .academy-dropdown-menu .academy-group-header-link {
            color: #111111 !important;
          }
          .academy-dropdown-menu .academy-group-header-link:hover {
            color: #014d4b !important;
            background: none !important;
          }
          .academy-flyout {
            background-color: #ffffff !important;
            box-shadow: 0 4px 16px rgba(0,0,0,0.12) !important;
          }
          .academy-flyout-group + .academy-flyout-group {
            border-top: 1px solid #f0f0f0 !important;
          }
          .academy-flyout-group-title {
            color: rgba(0,0,0,0.5) !important;
          }
          .academy-flyout-group-title:hover {
            color: #014d4b !important;
          }
          .academy-flyout a {
            color: #333333 !important;
          }
          .academy-flyout a:hover {
            color: #014d4b !important;
            background: none !important;
          }
          .academy-cascade-link {
            color: #333333 !important;
          }
          .academy-cascade-link:hover {
            color: #014d4b !important;
            background: none !important;
          }
          .academy-subflyout {
            background-color: #ffffff !important;
            box-shadow: 0 4px 16px rgba(0,0,0,0.12) !important;
          }
          .academy-subflyout a {
            color: #333333 !important;
          }
          .academy-subflyout a:hover {
            color: #014d4b !important;
            background: none !important;
          }
        `}} />
      )}
      <header className="s-header">
        <div className="row s-header__inner">
          <div className="s-header__block">
            <div className="s-header__logo">
              <Link className="logo" href="/">
                <img src="/logo.png" alt="Homepage" />
              </Link>
            </div>
            <a className="s-header__menu-toggle" href="#0"><span>Menu</span></a>
          </div>

          <nav className="s-header__nav">
            <ul className="s-header__menu-links">
              <li className={isActive('/') && pathname === '/' ? 'current' : ''}>
                <a href="/#intro" className="smoothscroll">Home</a>
              </li>
              <li>
                <a href="/#about" className="smoothscroll">About</a>
              </li>
              <li className={`dropdown ${isActive('/products') ? 'current' : ''}`}>
                <Link href="/products">Products</Link>
                <ul className="dropdown-menu">
                  <li><a href="/products#natural">&nbsp;Natural Solutions</a></li>
                  <li><a href="/products#supplements">&nbsp;Supplements</a></li>
                  <li><a href="/products#feed-additives">&nbsp;Feed-Additives</a></li>
                </ul>
              </li>
              <li className={`dropdown ${(isActive('/education') || isActive('/agrikima-academy') || isActive('/articles')) ? 'current' : ''}`}>
                <Link href="/education">Academy</Link>
                <ul className="dropdown-menu academy-dropdown-menu">
                  <li className="academy-group">
                    <Link href="/agrikima-academy" className="academy-group-header academy-group-header-link">
                      <span>Videos</span>
                      <svg className="academy-group-chevron-side" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 6 15 12 9 18" />
                      </svg>
                    </Link>
                    <ul className="academy-flyout academy-flyout-cascade">
                      {VIDEO_CATEGORIES.map((group) => (
                        <li key={group.name} className="academy-cascade-item">
                          <a
                            href={`/agrikima-academy?filter=${encodeURIComponent(group.filter)}`}
                            className="academy-cascade-link"
                          >
                            <span>{group.name}</span>
                            {group.subcategories.length > 0 && (
                              <svg className="academy-group-chevron-side" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 6 15 12 9 18" />
                              </svg>
                            )}
                          </a>
                          {group.subcategories.length > 0 && (
                            <ul className="academy-subflyout">
                              {group.subcategories.map((sub) => (
                                <li key={`${group.name}-${sub.name}`}>
                                  <a href={`/agrikima-academy?filter=${sub.anchor}`}>{sub.name}</a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li className="academy-group">
                    <Link href="/articles" className="academy-group-header academy-group-header-link">
                      <span>Articles</span>
                      <svg className="academy-group-chevron-side" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 6 15 12 9 18" />
                      </svg>
                    </Link>
                    <ul className="academy-flyout academy-flyout-simple">
                      {ARTICLE_CATEGORIES.map((cat) => (
                        <li key={cat.query}>
                          <a href={`/articles?category=${cat.query}`}>{cat.name}</a>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </li>
              <li className={`dropdown ${isActive('/articles') ? 'current' : ''}`}>
                <Link href="/articles">What&apos;s New</Link>
                <ul className="dropdown-menu">
                  {ARTICLE_CATEGORIES.map((cat) => (
                    <li key={cat.query}><a href={`/articles?category=${cat.query}`}>&nbsp;{cat.name}</a></li>
                  ))}
                </ul>
              </li>
              <li className={isActive('/downloads') ? 'current' : ''}>
                <Link href="/downloads">Downloads</Link>
              </li>
              <li className={isActive('/contact') ? 'current' : ''}>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>

            <ul className="s-header__social">
              <li>
                <a href="mailto:info@agrikima.co.ke">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{fill: 'rgba(0,0,0,1)'}}>
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zm0 12H4V8.99l8 6.99 8-6.99V18z"/>
                  </svg>
                  <span className="email"> info@agrikima.co.ke</span>
                </a>
              </li>
              <li>
                <a href="tel:+254202089181">
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{fill: 'rgba(0,0,0,1)', marginRight: '8px'}}>
                      <path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.07 21 3 13.93 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.24 1.01l-2.2 2.2z"/>
                    </svg>
                    <span className="email"> +254 20 2089181</span>
                  </div>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
