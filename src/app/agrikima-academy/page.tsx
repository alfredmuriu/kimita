'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import VideoModal from '@/components/VideoModal';

interface Video {
  id: string;
  title: string;
}

interface CategorySection {
  name: string;
  anchor: string;
  videos: Video[];
}

const SECTIONS: CategorySection[] = [
  {
    name: 'GETTING STARTED',
    anchor: 'getting-started',
    videos: [
      { id: '-m51mnGrLEU', title: 'Introduction to Poultry Farming' },
      { id: 'MXrLWo4xd68', title: 'Inside Out' },
    ],
  },
  {
    name: 'POULTRY FEEDING',
    anchor: 'poultry-feeding',
    videos: [
      { id: '2I3kSMEcXKY', title: 'Feed Types, Forms and Practical Feeding Tips' },
      { id: '4HHYibFMkYc', title: 'Broiler Feeding' },
      { id: 'Xio1Ys6od7U', title: 'Layer Feeding' },
      { id: 'pQzfwHm8VD0', title: 'Poultry Feeding' },
    ],
  },
  {
    name: 'BROODING & EARLY CHICK CARE',
    anchor: 'brooding',
    videos: [
      { id: 'TaL6EPbtPkQ', title: 'Brooding' },
      { id: 'nQj7g_DFWIU', title: 'Growing and Transition' },
      { id: 'XEcSxfxqCww', title: 'Incubation' },
    ],
  },
  {
    name: 'POULTRY HOUSING & FARM SETUP',
    anchor: 'poultry-housing',
    videos: [
      { id: 'QkucCuQs4D0', title: 'Building the Perfect Poultry House' },
      { id: 'Vam23oykzd4', title: 'Inside the Poultry House' },
      { id: 'yqxmpNmKOBo', title: 'Poultry Housing' },
      { id: 'svwduDniE4o', title: 'Poultry Lighting' },
    ],
  },
  {
    name: 'POULTRY HEALTH & DISEASE',
    anchor: 'poultry-health',
    videos: [
      { id: 'mYjMDoP5rQE', title: 'Anti Microbial Resistance' },
      { id: 'L0iE79JJGnM', title: 'Nutritional Deficiency' },
      { id: 'Cz94nOBYuDg', title: 'Behavioural Abnormalities' },
    ],
  },
  {
    name: 'POULTRY WELFARE & BIOSECURITY',
    anchor: 'poultry-welfare',
    videos: [
      { id: 'mVyLbzEBlgU', title: 'Poultry Welfare' },
      { id: '5Z2lv3cia0M', title: 'Poultry Biosecurity Guide' },
    ],
  },
];

export default function Academy() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  return (
    <Layout>
      <main style={{ backgroundColor: '#ffffff', paddingBottom: '60px' }}>
        {/* Hero */}
        <section className="academy-hero">
          <h1 className="s-intro__content-title page-title" style={{ color: '#000000' }}>
            Agrikima Academy
          </h1>
          <p className="page-subtitle" style={{ maxWidth: 640 }}>
            Learn from our experts — practical video guides on poultry feeding,
            brooding, housing, health, welfare, biosecurity, and more to help you succeed.
          </p>
        </section>

        {/* Category Sections */}
        {SECTIONS.map((section) => (
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
        ))}
      </main>

      {/* Modal */}
      <VideoModal
        videoId={selectedVideo?.id || ''}
        title={selectedVideo?.title || ''}
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </Layout>
  );
}
