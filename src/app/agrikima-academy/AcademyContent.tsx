'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Layout from '@/components/Layout';
import VideoModal from '@/components/VideoModal';
import ScrollDownButton from '@/components/ScrollDownButton';

interface Video {
  id: string;
  title: string;
}

interface CategorySection {
  name: string;
  anchor: string;
  videos: Video[];
}

const POULTRY_SECTIONS: CategorySection[] = [
  {
    name: 'Getting Started',
    anchor: 'getting-started',
    videos: [
      { id: '-m51mnGrLEU', title: 'Introduction to Poultry Farming' },
      { id: 'MXrLWo4xd68', title: 'Inside Out' },
    ],
  },
  {
    name: 'Brooding & Early Chick Care',
    anchor: 'brooding',
    videos: [
      { id: 'TaL6EPbtPkQ', title: 'Brooding' },
      { id: 'nQj7g_DFWIU', title: 'Growing and Transition' },
      { id: 'XEcSxfxqCww', title: 'Incubation' },
    ],
  },
  {
    name: 'Poultry Feeding',
    anchor: 'poultry-feeding',
    videos: [
      { id: '2I3kSMEcXKY', title: 'Feed Types, Forms and Practical Feeding Tips' },
      { id: '4HHYibFMkYc', title: 'Broiler Feeding' },
      { id: 'Xio1Ys6od7U', title: 'Layer Feeding' },
      { id: 'pQzfwHm8VD0', title: 'Poultry Feeding' },
      { id: 'iYTJsl8Ggj0', title: 'Poultry Supplementing' },
    ],
  },
  {
    name: 'Poultry Housing & Farm Setup',
    anchor: 'poultry-housing',
    videos: [
      { id: 'QkucCuQs4D0', title: 'Building the Perfect Poultry House' },
      { id: 'Vam23oykzd4', title: 'Inside the Poultry House' },
      { id: 'yqxmpNmKOBo', title: 'Poultry Housing' },
      { id: 'svwduDniE4o', title: 'Poultry Lighting' },
    ],
  },
  {
    name: 'Poultry Health & Disease',
    anchor: 'poultry-health',
    videos: [
      { id: 'mYjMDoP5rQE', title: 'Anti Microbial Resistance' },
      { id: 'L0iE79JJGnM', title: 'Nutritional Deficiency' },
      { id: 'Cz94nOBYuDg', title: 'Behavioural Abnormalities' },
      { id: 'mViMyFUUikY', title: 'Poultry Vaccination' },
      { id: 'hWWo1bpb_uw', title: 'Poultry Diseases' },
    ],
  },
  {
    name: 'Poultry Welfare & Biosecurity',
    anchor: 'poultry-welfare',
    videos: [
      { id: 'mVyLbzEBlgU', title: 'Poultry Welfare' },
      { id: '5Z2lv3cia0M', title: 'Poultry Biosecurity Guide' },
    ],
  },
  {
    name: 'Farm Management & Records',
    anchor: 'poultry-management',
    videos: [
      { id: 'cSuL_AN9OmQ', title: 'Poultry Record Keeping' },
    ],
  },
];

const LARGER_ANIMAL_SECTIONS: CategorySection[] = [
  {
    name: 'Housing & Farm Setup',
    anchor: 'large-animal-housing',
    videos: [
      { id: 'UxhKRZK4KgI', title: 'Large Animal Housing' },
    ],
  },
  {
    name: 'Feeding & Supplementing',
    anchor: 'large-animal-feeding',
    videos: [
      { id: 'uNpJjeUrbFg', title: 'Large Animal Feeding' },
      { id: 'ZZ2ZobpI_z0', title: 'Supplementing' },
    ],
  },
  {
    name: 'Production',
    anchor: 'large-animal-production',
    videos: [
      { id: 'HSJi_eEBXb0', title: 'Milking and Meat Production' },
    ],
  },
  {
    name: 'Breeding & Reproduction',
    anchor: 'large-animal-breeding',
    videos: [
      { id: '5_gmI60MgXY', title: 'Breeding and Reproduction' },
    ],
  },
  {
    name: 'Health Management',
    anchor: 'large-animal-health',
    videos: [
      { id: 'oOQjk5dsfu0', title: 'Health Management' },
    ],
  },
  {
    name: 'Sustainability & Natural Practices',
    anchor: 'large-animal-sustainability',
    videos: [
      { id: 'PpOrLwIHwRU', title: 'Sustainability and Natural Practices' },
    ],
  },
  {
    name: 'Business & Marketing',
    anchor: 'large-animal-business',
    videos: [
      { id: 'EuiljNR8FOw', title: 'Marketing and Revenue Addition' },
    ],
  },
];

const ACADEMY_DATA: Record<string, CategorySection[]> = {
  'Poultry Farming': POULTRY_SECTIONS,
  'Large Animals': LARGER_ANIMAL_SECTIONS,
};

function AcademyInner() {
  const searchParams = useSearchParams();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam) {
      setActiveFilter(filterParam);
      for (const [groupName, sections] of Object.entries(ACADEMY_DATA)) {
        if (groupName === filterParam) {
          setOpenDropdown(groupName);
          break;
        }
        if (sections.some(s => s.anchor === filterParam)) {
          setOpenDropdown(groupName);
          break;
        }
      }
    }
  }, [searchParams]);

  const handleGroupClick = (groupName: string) => {
    setOpenDropdown(prev => prev === groupName ? null : groupName);
    setActiveFilter(groupName);
  };

  const handleSubcategoryClick = (anchor: string, groupName: string) => {
    setActiveFilter(anchor);
    setOpenDropdown(groupName);
  };

  const handleAllClick = () => {
    setActiveFilter('All');
    setOpenDropdown(null);
  };

  const allVideos = Object.values(ACADEMY_DATA).flatMap(sections =>
    sections.flatMap(section =>
      section.videos.map(video => ({
        '@type': 'VideoObject',
        name: video.title,
        description: `Learn about ${video.title} in this Agrikima Academy farming video guide.`,
        thumbnailUrl: `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`,
        embedUrl: `https://www.youtube.com/embed/${video.id}`,
        publisher: {
          '@type': 'Organization',
          name: 'Agrikima',
          url: 'https://www.agrikima.co.ke',
        },
      }))
    )
  );

  const videoSchema = {
    '@context': 'https://schema.org',
    '@graph': allVideos,
  };

  return (
    <Layout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />
      <style dangerouslySetInnerHTML={{
        __html: `
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
        .page-title { color: #111111 !important; }
        .page-subtitle { color: #444444 !important; }
        .section-header__pretitle { color: #014d4b !important; }
        .academy-content-wrapper {
            display: flex;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            gap: 40px;
            align-items: stretch;
        }
        .academy-sidebar {
            width: 250px;
            flex-shrink: 0;
            padding-right: 20px;
            border-right: 1px solid #eee;
        }
        .academy-sidebar-sticky { position: sticky; top: 100px; }
        .sidebar-title {
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 1.5px;
            margin-bottom: 20px;
            border-bottom: 1px solid #eee;
            padding-bottom: 15px;
        }
        .sidebar-menu { list-style: none; margin: 0; padding: 0; }
        .sidebar-item { margin-bottom: 12px; padding: 0; }
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
        .sidebar-link:hover, .sidebar-link:hover span {
            color: #014d4b !important;
        }
        .sidebar-item.active > .sidebar-link, .sidebar-item.active > .sidebar-link span,
        .sidebar-subitem.active > .sidebar-link, .sidebar-subitem.active > .sidebar-link span {
            color: #166534 !important;
            font-size: 15px !important;
            font-weight: 700 !important;
            text-decoration: underline;
            text-underline-offset: 4px;
            text-decoration-thickness: 2px;
        }
        .sidebar-item-count { font-size: 12px; color: #888888 !important; font-weight: 400; transition: color 0.3s; }
        .sidebar-chevron { width: 16px; height: 16px; margin-left: 6px; flex-shrink: 0; transition: transform 0.3s ease; color: #888888; }
        .sidebar-chevron.open { transform: rotate(180deg); }
        .sidebar-link:hover .sidebar-chevron { color: #014d4b; }
        .sidebar-submenu {
            list-style: none;
            margin: 0;
            padding-left: 15px;
            background: transparent;
            max-height: 0;
            opacity: 0;
            overflow: hidden;
            padding-top: 0;
            transition: max-height 0.35s ease, opacity 0.3s ease, padding-top 0.3s ease;
        }
        .sidebar-submenu.open { max-height: 500px; opacity: 1; padding-top: 10px; }
        .sidebar-subitem { margin-bottom: 8px; }
        .academy-main-column { flex: 1; min-width: 0; }
        @media screen and (max-width: 800px) {
            .academy-content-wrapper { flex-direction: column; }
            .academy-sidebar { width: 100%; border-right: none; border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
            .academy-sidebar-sticky { position: static; }
        }
      `}} />
      <main>
        <div className="products-hero">
          <div style={{ flex: 1 }}>
            <h1 className="s-intro__content-title page-title">
              Free Poultry &amp; Livestock Farming Video Courses
            </h1>
            <p className="page-subtitle" style={{ maxWidth: 640 }}>
              Learn from our experts — practical video guides on poultry feeding,
              brooding, housing, health, welfare, biosecurity, and more to help you succeed.
            </p>
            <div className="hero-badges">
              <span className="hero-badge">✓ Learn at Your Own Pace</span>
              <span className="hero-badge">✓ Poultry &amp; Livestock</span>
              <span className="hero-badge">✓ Expert-Led Training</span>
            </div>
          </div>
          <img src="/images/agrikima-academy.png" alt="Agrikima Academy — Poultry and Livestock Farming Video Courses" className="intro-image-slide-in products-hero-image" />
        </div>

        <ScrollDownButton targetId="academy-content" />

        <div id="academy-content" style={{ backgroundColor: '#f9fafb', paddingTop: '60px', paddingBottom: '80px', borderTop: '1px solid #f3f4f6' }}>
          <div className="academy-content-wrapper">
            <aside className="academy-sidebar">
              <div className="academy-sidebar-sticky">
                <div className="sidebar-title">CATEGORIES</div>
                <ul className="sidebar-menu">
                  <li className={`sidebar-item ${activeFilter === 'All' ? 'active' : ''}`}>
                    <div className="sidebar-link" onClick={handleAllClick}>
                      <span>ALL SECTIONS</span>
                    </div>
                  </li>
                  {Object.keys(ACADEMY_DATA).map((groupName) => {
                    const isDropdownOpen = openDropdown === groupName;
                    const isGroupActive = activeFilter === groupName ||
                      ACADEMY_DATA[groupName].some(s => s.anchor === activeFilter);
                    return (
                      <li key={groupName} className={`sidebar-item ${isGroupActive ? 'active' : ''}`}>
                        <div className="sidebar-link" onClick={() => handleGroupClick(groupName)}>
                          <span>{groupName.toUpperCase()}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span className="sidebar-item-count">
                              {ACADEMY_DATA[groupName].reduce((acc, section) => acc + section.videos.length, 0)}
                            </span>
                            {ACADEMY_DATA[groupName].length > 0 && (
                              <svg
                                className={`sidebar-chevron ${isDropdownOpen ? 'open' : ''}`}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            )}
                          </span>
                        </div>
                        {ACADEMY_DATA[groupName].length > 0 && (
                          <ul className={`sidebar-submenu ${isDropdownOpen ? 'open' : ''}`}>
                            {ACADEMY_DATA[groupName].map((section) => (
                              <li key={`nav-${section.anchor}`} className={`sidebar-subitem ${activeFilter === section.anchor ? 'active' : ''}`}>
                                <div
                                  className="sidebar-link"
                                  style={{ fontSize: '13px', paddingLeft: '10px' }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSubcategoryClick(section.anchor, groupName);
                                  }}
                                >
                                  <span>{section.name}</span>
                                  <span className="sidebar-item-count">{section.videos.length}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>

            <div className="academy-main-column">
              {Object.keys(ACADEMY_DATA).map((groupName) => {
                const renderSection = (section: CategorySection) => (
                  <section key={section.anchor} id={section.anchor} className="academy-section">
                    <h2 className="column lg-12 section-header__pretitle pretitle text-pretitle">
                      {section.name}
                    </h2>
                    <div className="academy-table">
                      {section.videos.map((video) => (
                        <div
                          key={video.id}
                          className="academy-row"
                          onClick={() => setSelectedVideo(video)}
                          id={`video-${video.id}`}
                        >
                          <div className="academy-row__info">
                            <div className="academy-row__play-icon">
                              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                            <span className="academy-row__title">{video.title}</span>
                          </div>
                          <div className="academy-row__thumb">
                            <img
                              src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                              alt={video.title}
                              loading="lazy"
                            />
                            <div className="academy-row__watch">
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                              Watch
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                );

                if (activeFilter === 'All' || activeFilter === groupName) {
                  return ACADEMY_DATA[groupName].map(renderSection);
                }
                const matchingSection = ACADEMY_DATA[groupName].find(s => s.anchor === activeFilter);
                if (matchingSection) return renderSection(matchingSection);
                return null;
              })}

              {activeFilter !== 'All' && ACADEMY_DATA[activeFilter] && ACADEMY_DATA[activeFilter].length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
                  <p>Videos for this category will be added soon.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <VideoModal
        videoId={selectedVideo?.id || ''}
        title={selectedVideo?.title || ''}
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </Layout>
  );
}

export default function AcademyContent() {
  return (
    <Suspense>
      <AcademyInner />
    </Suspense>
  );
}
