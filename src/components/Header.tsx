'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.getElementById('footer');
      const contactLink = document.getElementById('contact-link');
      if (!footer || !contactLink) return;

      const rect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      if (rect.top < windowHeight && rect.bottom > 0) {
        contactLink.parentElement?.classList.add('current');
      } else {
        contactLink.parentElement?.classList.remove('current');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
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
            <li className={`dropdown ${isActive('/downloads') ? 'current' : ''}`}>
              <Link href="/downloads">Download</Link>
              <ul className="dropdown-menu">
                <li><a href="/downloads">&nbsp;Dairy Farming</a></li>
                <li><a href="/downloads">&nbsp;Poultry Farming</a></li>
              </ul>
            </li>
            <li>
              <a href="/#footer" className="smoothscroll" id="contact-link">Contact</a>
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
  );
}
