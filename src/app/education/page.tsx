import { Metadata } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';

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
            color: #000000 !important;
        }
        .page-subtitle {
            color: #444444 !important;
        }
        .edu-hero { background: #ffffff; }
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
        .edu-card-image {
          width: 100%;
          height: 240px;
          object-fit: cover;
          display: block;
          background: #eef2ef;
        }
        .edu-card-body {
          padding: 24px 24px 28px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }
        .edu-card-tag {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #014d4b;
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
        @media screen and (max-width: 800px) {
          .edu-cards-grid { grid-template-columns: 1fr; gap: 20px; }
          .edu-cards-heading { font-size: 26px; }
          .edu-card-image { height: 200px; }
        }
      `}} />

      <main>
        <div className="edu-hero">
        <div className="products-hero">
          <div style={{ flex: 1 }}>
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
        </div>
        </div>

        <div className="edu-cards-wrap">
          <div className="edu-cards-inner">
            <h2 className="edu-cards-heading">Explore the Academy</h2>
            <p className="edu-cards-sub">
              Choose how you&apos;d like to learn. Watch the videos, read the resources — or use both.
            </p>

            <div className="edu-cards-grid">
              <Link href="/agrikima-academy" className="edu-card">
                <img
                  src="/images/videos.jpg"
                  alt="Training videos from Agrikima Academy"
                  className="edu-card-image"
                />
                <div className="edu-card-body">
                  <span className="edu-card-tag">Farm Videos</span>
                  <h3 className="edu-card-title">Watch &amp; Learn</h3>
                  <p className="edu-card-desc">
                    Expert-led video courses on poultry feeding, brooding, housing, health,
                    welfare and biosecurity, plus training for dairy, beef, pigs and more.
                  </p>
                  <span className="edu-card-cta">Open Farm Videos</span>
                </div>
              </Link>

              <Link href="/articles" className="edu-card">
                <img
                  src="/images/guides.jpg"
                  alt="Training articles and resources from Agrikima"
                  className="edu-card-image"
                />
                <div className="edu-card-body">
                  <span className="edu-card-tag">Farm Guides</span>
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
