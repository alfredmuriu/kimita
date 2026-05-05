import { Metadata } from 'next';
import Layout from '@/components/Layout';

export const metadata: Metadata = {
  title: 'Downloads — Agrikima Resources for Farmers',
  description:
    'Download free Agrikima resources — product brochures, vaccination schedules, supplementation programs and product posters for African farmers.',
  alternates: {
    canonical: 'https://www.agrikima.co.ke/downloads',
  },
  openGraph: {
    title: 'Downloads — Agrikima Resources for Farmers',
    description:
      'Free brochures, vaccination schedules and supplementation programs for poultry and livestock farmers.',
    url: 'https://www.agrikima.co.ke/downloads',
    siteName: 'Agrikima',
  },
};

type Resource = {
  title: string;
  description?: string;
  file: string;
  size: string;
  type: 'PDF' | 'Image';
};

type Group = {
  name: string;
  description: string;
  items: Resource[];
};

const GROUPS: Group[] = [
  {
    name: 'Brochures',
    description: 'Full product catalogues — browse the Agrikima range.',
    items: [
      {
        title: 'Large Animals Brochure 2025 (A5)',
        description: 'Full 2025 product brochure for large animals.',
        file: '/downloads/Brochure 2025 A5 version Large Animals.pdf',
        size: '10 MB',
        type: 'PDF',
      },
      {
        title: 'Large Animals Brochure — Slim Version',
        description: 'Lighter, portable version of the large-animals brochure.',
        file: '/downloads/Brochure Slim Version - Large animals (1).pdf',
        size: '9 MB',
        type: 'PDF',
      },
    ],
  },
  {
    name: 'Programs & Schedules',
    description: 'Practical, follow-along guides for the farm.',
    items: [
      {
        title: 'Layers Supplementation Program (A4)',
        description: 'Supplementation program for layer hens.',
        file: '/downloads/Supplementation Program A4 - LAYERS.pdf',
        size: '1.5 MB',
        type: 'PDF',
      },
      {
        title: 'Vaccination Cards',
        description: 'Printable vaccination schedule cards.',
        file: '/downloads/Vaccination Cards.pdf',
        size: '2.6 MB',
        type: 'PDF',
      },
    ],
  },
  {
    name: 'Product Posters',
    description: 'Single-product information posters.',
    items: [
      {
        title: 'All Products — Large Animals',
        description: 'Combined display of the full large-animal product range.',
        file: '/downloads/ALL PRODUCT DISPLAY- LARGER ANIMALS.jpeg',
        size: '380 KB',
        type: 'Image',
      },
      { title: 'Advice', file: '/downloads/ADVICE - DANGLER POSTER.jpeg', size: '230 KB', type: 'Image' },
      { title: 'Agritonic', file: '/downloads/AGRITONIC - DANGLER POSTER.jpeg', size: '225 KB', type: 'Image' },
      { title: 'Agrivitam', file: '/downloads/AGRIVITAM - DANGLER POSTER.jpeg', size: '215 KB', type: 'Image' },
      { title: 'Biogar', file: '/downloads/BIOGAR DANGLER POSTER.jpeg', size: '225 KB', type: 'Image' },
      { title: 'Mix 5', file: '/downloads/MIX 5 - DANGLER POSTER.jpeg', size: '240 KB', type: 'Image' },
    ],
  },
];

export default function DownloadsPage() {
  return (
    <Layout>
      <style dangerouslySetInnerHTML={{ __html: `
        body, .s-header, .s-header__inner, .s-header__nav, .s-header__menu-links, .s-header__social, #page, .s-pagewrap, .s-content, main {
            background-color: #ffffff !important;
            color: #111111 !important;
        }
        .s-header__menu-links a, .email { color: #111111 !important; }
        .s-header__menu-links li.current > a { color: #014d4b !important; }
        .s-header__social svg path { fill: #111111 !important; }
        .s-header__menu-links > .dropdown > .dropdown-menu { background-color: #ffffff !important; }
        .s-header__menu-links > .dropdown > .dropdown-menu a { color: #111111 !important; }
        .s-header__menu-links > .dropdown > .dropdown-menu a:hover { color: #014d4b !important; }
        .page-title { color: #111111 !important; }
        .page-subtitle { color: #444444 !important; }

        .dl-wrap {
          max-width: 920px;
          margin: 0 auto;
          padding: 40px 24px 80px;
        }
        .dl-group { margin-top: 40px; }
        .dl-group:first-of-type { margin-top: 16px; }
        .dl-group-heading {
          font-weight: 600;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: #014d4b !important;
          margin: 0 0 4px;
        }
        .dl-group-desc {
          color: #666;
          font-size: 13px;
          margin: 0 0 12px;
        }
        .dl-list {
          list-style: none;
          margin: 0;
          padding: 0;
          border-top: 1px solid #eee;
        }
        .dl-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        .dl-item-info { min-width: 0; display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; }
        .dl-item-title {
          font-size: 14px;
          font-weight: 600;
          color: #111 !important;
          margin: 0;
        }
        .dl-item-desc {
          font-size: 13px;
          color: #666 !important;
          margin: 0;
        }
        .dl-item-meta {
          font-size: 11px;
          color: #999 !important;
          margin: 0;
        }
        .dl-actions {
          flex-shrink: 0;
          display: inline-flex;
          gap: 6px;
        }
        .dl-btn {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 11px;
          font-weight: 600;
          color: #014d4b !important;
          text-decoration: none;
          padding: 3px 8px;
          border: 1px solid #014d4b;
          border-radius: 2px;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
          line-height: 1.4;
        }
        .dl-btn:hover {
          background: #014d4b;
          color: #fff !important;
        }
        .dl-btn--ghost {
          color: #555 !important;
          border-color: #ccc;
        }
        .dl-btn--ghost:hover {
          background: #555;
          color: #fff !important;
          border-color: #555;
        }
        @media (max-width: 600px) {
          .dl-item { flex-direction: column; align-items: flex-start; gap: 6px; }
          .dl-actions { align-self: flex-end; }
        }
      `}} />

      <main>
        <div className="products-hero">
          <div style={{ flex: 1 }}>
            <h1 className="s-intro__content-title page-title">Downloads</h1>
            <p className="page-subtitle" style={{ maxWidth: 640 }}>
              Free brochures, vaccination schedules, supplementation programs and
              product posters — for African farmers to save, print and share.
            </p>
          </div>
        </div>

        <div className="dl-wrap">
          {GROUPS.map((group) => (
            <section key={group.name} className="dl-group">
              <h2 className="dl-group-heading">{group.name}</h2>
              <p className="dl-group-desc">{group.description}</p>
              <ul className="dl-list">
                {group.items.map((item) => (
                  <li key={item.file} className="dl-item">
                    <div className="dl-item-info">
                      <p className="dl-item-title">{item.title}</p>
                      {item.description && <p className="dl-item-desc">{item.description}</p>}
                      <p className="dl-item-meta">{item.type} · {item.size}</p>
                    </div>
                    <div className="dl-actions">
                      <a
                        href={item.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="dl-btn dl-btn--ghost"
                        aria-label={`View ${item.title}`}
                      >
                        View
                      </a>
                      <a
                        href={item.file}
                        download
                        className="dl-btn"
                        aria-label={`Download ${item.title}`}
                      >
                        ↓ Download
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </Layout>
  );
}
