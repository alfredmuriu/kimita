import { Metadata } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';
import HeroCarousel from './HeroCarousel';

export const metadata: Metadata = {
  title: 'Education — Agrikima Academy & Training Resources',
  description:
    'Agrikima Academy gives African farmers free, practical training on poultry and livestock — through expert-led video courses and written resources.',
  alternates: {
    canonical: 'https://www.agrikima.co.ke/education',
  },
  openGraph: {
    title: 'Education — Agrikima Academy & Training Resources',
    description:
      'Agrikima Academy gives African farmers free, practical training on poultry and livestock — through expert-led video courses and written resources.',
    url: 'https://www.agrikima.co.ke/education',
    siteName: 'Agrikima',
  },
};

export default function EducationPage() {
  return (
    <Layout>
      <style dangerouslySetInnerHTML={{ __html: `
        body, .s-header, .s-header__inner, .s-header__nav, .s-header__menu-links, .s-header__social, #page, .s-pagewrap, .s-content, main {
            background-color: #ffffff !important;
            color: #111111 !important;
        }
        body, #page, .s-pagewrap, .s-content, main {
            overflow: visible !important;
            overflow-x: clip !important;
        }
        .s-header__menu-links a, .email {
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
        .products-hero {
          min-height: calc(100vh - 120px);
          padding-top: 100px;
          padding-bottom: 80px;
          align-items: center;
        }
        .edu-hero-text {
          margin-top: -80px;
        }
        .edu-cards-wrap {
          background: #f9fafb;
          border-top: 1px solid #f3f4f6;
          padding: 60px 20px 80px;
        }
        .edu-cards-inner {
          max-width: 860px;
          margin: 0 auto;
        }
        .edu-cards-heading {
          text-align: center;
          font-size: 32px;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 12px;
        }
        .edu-cards-sub {
          text-align: center;
          color: #666;
          font-size: 16px;
          margin: 0 auto 40px;
          max-width: 620px;
        }
        .edu-cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .edu-card {
          display: flex;
          flex-direction: column;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
        }
        .edu-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 28px rgba(0,0,0,0.08);
          border-color: #014d4b;
        }
        .edu-card-image-wrap {
          position: relative;
          width: 100%;
          height: 240px;
          overflow: hidden;
          background: #eef2ef;
        }
        .edu-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform .4s ease;
        }
        .edu-card:hover .edu-card-image {
          transform: scale(1.04);
        }
        .edu-card-image-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%);
          pointer-events: none;
        }
        .edu-card-body {
          padding: 24px 24px 28px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }
        .edu-card-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #014d4b;
        }
        .edu-card-tag-icon {
          font-size: 13px;
          line-height: 1;
        }
        .edu-card-title {
          font-size: 22px;
          font-weight: 800;
          margin: 0;
          color: #1a1a1a;
        }
        .edu-card-desc {
          font-size: 15px;
          color: #555;
          line-height: 1.55;
          margin: 0;
        }
        .edu-card-cta {
          margin-top: 14px;
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 700;
          color: #014d4b;
          letter-spacing: 0.3px;
        }
        .edu-card-cta::after {
          content: '→';
          transition: transform .2s ease;
        }
        .edu-card:hover .edu-card-cta::after {
          transform: translateX(4px);
        }
        .edu-carousel-fan {
          position: relative;
          width: 360px;
          height: 270px;
          margin-right: 60px;
          flex-shrink: 0;
        }
        .edu-fan-card {
          position: absolute;
          top: 0;
          left: 50%;
          width: 78%;
          height: 100%;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
          transition: transform 700ms cubic-bezier(.22,.61,.36,1), opacity 700ms ease, filter 700ms ease;
          transform-origin: center center;
        }
        .edu-fan-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .edu-fan-slot-center {
          transform: translate(-50%, 0) rotate(0deg) scale(1.18);
          opacity: 1;
          z-index: 3;
          filter: none;
        }
        .edu-fan-slot-left {
          transform: translate(-105%, 28px) rotate(-8deg) scale(0.65);
          opacity: 0.8;
          z-index: 2;
          filter: brightness(0.9);
        }
        .edu-fan-slot-right {
          transform: translate(5%, 28px) rotate(8deg) scale(0.65);
          opacity: 0.8;
          z-index: 2;
          filter: brightness(0.9);
        }
        .edu-fan-slot-back {
          transform: translate(-50%, 0) rotate(0deg) scale(0.55);
          opacity: 0;
          z-index: 1;
          filter: brightness(0.8);
        }
        @media (prefers-reduced-motion: reduce) {
          .edu-fan-card { transition: none; }
        }
        @media screen and (max-width: 900px) {
          .edu-carousel-fan {
            width: 360px;
            height: 270px;
            margin-right: 20px;
          }
        }
        @media screen and (max-width: 800px) {
          .edu-cards-grid { grid-template-columns: 1fr; gap: 20px; }
          .edu-cards-heading { font-size: 26px; }
          .edu-card-image { height: 200px; }
        }
      `}} />

      <main>
        <div className="products-hero">
          <div className="edu-hero-text" style={{ flex: 1 }}>
            <h1 className="s-intro__content-title page-title">
              Agrikima Academy
            </h1>
            <p className="page-subtitle" style={{ maxWidth: 640 }}>
              Practical, expert-led training for African farmers. Learn how to raise
              healthier animals and run more profitable farms — through free videos and
              written guides built around real, on-the-ground experience.
            </p>
            <div className="hero-badges">
              <span className="hero-badge">✓ Free for Farmers</span>
              <span className="hero-badge">✓ Expert-Led</span>
              <span className="hero-badge">✓ Poultry &amp; Livestock</span>
            </div>
          </div>
          <HeroCarousel />
        </div>

        <div className="edu-cards-wrap">
          <div className="edu-cards-inner">
            <h2 className="edu-cards-heading">Explore the Academy</h2>
            <p className="edu-cards-sub">
              Choose how you&apos;d like to learn. Watch the videos, read the resources — or use both.
            </p>

            <div className="edu-cards-grid">
              <Link href="/agrikima-academy" className="edu-card">
                <div className="edu-card-image-wrap">
                  <img
                    src="/images/videos.jpg"
                    alt="Training videos from Agrikima Academy"
                    className="edu-card-image"
                  />
                </div>
                <div className="edu-card-body">
                  <span className="edu-card-tag">
                    <span className="edu-card-tag-icon" aria-hidden="true">▶</span>
                    Farm Videos
                  </span>
                  <h3 className="edu-card-title">Watch &amp; Learn</h3>
                  <p className="edu-card-desc">
                    Expert-led video courses on poultry feeding, brooding, housing, health,
                    welfare and biosecurity, plus training for dairy, beef, pigs and more.
                  </p>
                  <span className="edu-card-cta">Open Farm Videos</span>
                </div>
              </Link>

              <Link href="/articles" className="edu-card">
                <div className="edu-card-image-wrap">
                  <img
                    src="/images/education.jpg"
                    alt="Training articles and resources from Agrikima"
                    className="edu-card-image"
                  />
                </div>
                <div className="edu-card-body">
                  <span className="edu-card-tag">                    
                    Farm Guides
                  </span>
                  <h3 className="edu-card-title">Read the Guides</h3>
                  <p className="edu-card-desc">
                    Written articles covering agricultural insights, farming tips, poultry
                    health, livestock management and feed milling — updated regularly.
                  </p>
                  <span className="edu-card-cta">Open Farm Guides</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
