'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const ACADEMY_CATEGORIES = [
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
    name: 'Dairy Farming',
    filter: 'Dairy Farming',
    subcategories: [],
  },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [openAcademyGroup, setOpenAcademyGroup] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLLIElement>(null);

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenAcademyGroup(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryClick = (e: React.MouseEvent, groupName: string, filter: string) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenAcademyGroup(prev => prev === groupName ? null : groupName);
  };

  const handleSubcategoryClick = (e: React.MouseEvent, anchor: string) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenAcademyGroup(null);
    router.push(`/agrikima-academy?filter=${anchor}`);
  };

  const handleGroupNavigate = (e: React.MouseEvent, filter: string) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenAcademyGroup(null);
    router.push(`/agrikima-academy?filter=${encodeURIComponent(filter)}`);
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
        /* Academy nested dropdown styles */
        .academy-dropdown-menu {
          width: 240px !important;
          overflow: visible !important;
        }
        .academy-dropdown-menu .academy-group {
          position: relative;
        }
        .academy-dropdown-menu .academy-group-header {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          cursor: pointer !important;
          padding: 10px 14px !important;
          font-weight: 400 !important;
          font-size: 14px !important;
          transition: color 0.2s !important;
          color: rgba(255, 255, 255, 0.75) !important;
        }
        .academy-dropdown-menu .academy-group-header:hover {
          color: white !important;
        }
        .academy-dropdown-menu .academy-group-chevron {
          width: 12px;
          height: 12px;
          margin-left: 8px;
          transition: transform 0.3s ease;
          flex-shrink: 0;
          opacity: 0.5;
        }
        .academy-dropdown-menu .academy-group-chevron.open {
          transform: rotate(180deg);
        }
        .academy-dropdown-menu .academy-group-header:hover .academy-group-chevron {
          opacity: 1;
        }
        .academy-dropdown-menu .academy-subcategories {
          list-style: none !important;
          margin: 0 !important;
          padding: 0 0 0 12px !important;
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          transition: max-height 0.35s ease, opacity 0.25s ease, padding 0.25s ease;
        }
        .academy-dropdown-menu .academy-subcategories.open {
          max-height: 400px;
          opacity: 1;
          padding-bottom: 6px !important;
        }
        .academy-dropdown-menu .academy-subcategories li {
          list-style: none !important;
        }
        .academy-dropdown-menu .academy-subcategories a {
          display: block !important;
          padding: 6px 10px !important;
          font-size: 12.5px !important;
          font-weight: 400 !important;
          color: rgba(255, 255, 255, 0.45) !important;
          transition: color 0.2s !important;
          cursor: pointer !important;
          text-decoration: none !important;
        }
        .academy-dropdown-menu .academy-subcategories a:hover {
          color: white !important;
          transform: none !important;
        }
        .academy-dropdown-menu .academy-group-nav {
          display: inline-block;
          font-size: 11px;
          color: rgba(255,255,255,0.35) !important;
          margin-left: 6px;
          cursor: pointer;
          transition: color 0.2s;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .academy-dropdown-menu .academy-group-nav:hover {
          color: white !important;
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
          .academy-dropdown-menu .academy-group-header {
            color: rgba(0, 0, 0, 0.75) !important;
          }
          .academy-dropdown-menu .academy-group-header:hover {
            color: #014d4b !important;
          }
          .academy-dropdown-menu .academy-subcategories a {
            color: rgba(0, 0, 0, 0.55) !important;
          }
          .academy-dropdown-menu .academy-subcategories a:hover {
            color: #014d4b !important;
          }
          .academy-dropdown-menu .academy-group-nav {
            color: rgba(0, 0, 0, 0.4) !important;
          }
          .academy-dropdown-menu .academy-group-nav:hover {
            color: #014d4b !important;
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
              <li ref={dropdownRef} className={`dropdown ${isActive('/agrikima-academy') ? 'current' : ''}`}>
                <Link href="/agrikima-academy">Academy</Link>
                <ul className="dropdown-menu academy-dropdown-menu">
                  {ACADEMY_CATEGORIES.map((group) => (
                    <li key={group.name} className="academy-group">
                      <div
                        className="academy-group-header"
                        onClick={(e) => handleCategoryClick(e, group.name, group.filter)}
                      >
                        <span>
                          {group.name}
                          {group.subcategories.length === 0 && (
                            <span
                              className="academy-group-nav"
                              onClick={(e) => handleGroupNavigate(e, group.filter)}
                            >
                              view →
                            </span>
                          )}
                        </span>
                        {group.subcategories.length > 0 && (
                          <svg
                            className={`academy-group-chevron ${openAcademyGroup === group.name ? 'open' : ''}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        )}
                      </div>
                      {group.subcategories.length > 0 && (
                        <ul className={`academy-subcategories ${openAcademyGroup === group.name ? 'open' : ''}`}>
                          {group.subcategories.map((sub) => (
                            <li key={sub.anchor}>
                              <a
                                href={`/agrikima-academy?filter=${sub.anchor}`}
                                onClick={(e) => handleSubcategoryClick(e, sub.anchor)}
                              >
                                {sub.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
              <li className={`dropdown ${isActive('/articles') ? 'current' : ''}`}>
                <Link href="/articles">What&apos;s New</Link>
                <ul className="dropdown-menu">
                  <li><a href="/articles?category=Poultry">&nbsp;Poultry</a></li>
                  <li><a href="/articles?category=Dairy">&nbsp;Dairy</a></li>
                  <li><a href="/articles?category=Pigs">&nbsp;Pigs</a></li>
                </ul>
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
