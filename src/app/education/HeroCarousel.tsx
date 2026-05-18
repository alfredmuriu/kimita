'use client';

import { useEffect, useState } from 'react';

const SLIDES = [
  { src: '/images/carousel2.jpg', alt: 'Dairy cattle in pasture — livestock training at Agrikima Academy' },
  { src: '/images/carousel3.jpg', alt: 'Goats grazing — small ruminant training at Agrikima Academy' },
  { src: '/images/carousel4.jpg', alt: 'Farm imagery — Agrikima Academy training' },
  { src: '/images/carousel5.jpg', alt: 'Farm imagery — Agrikima Academy training' },
  { src: '/images/academy.jpg', alt: 'Agrikima Academy — practical training for African farmers' },
  { src: '/images/guides.jpg', alt: 'Maize silos and feed storage — Agrikima Academy guides' },
];

const INTERVAL_MS = 8000;

// Position slot: -1 = left peek, 0 = active center, 1 = right peek, 2 = hidden behind
function slotFor(slideIndex: number, activeIndex: number, total: number): number {
  const diff = (slideIndex - activeIndex + total) % total;
  if (diff === 0) return 0;
  if (diff === 1) return 1;
  if (diff === total - 1) return -1;
  return 2;
}

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="intro-image-slide-in edu-carousel-fan"
      role="group"
      aria-roledescription="carousel"
      aria-label="Agrikima Academy training imagery"
    >
      {SLIDES.map((slide, i) => {
        const slot = slotFor(i, index, SLIDES.length);
        const className = `edu-fan-card edu-fan-slot-${slot === -1 ? 'left' : slot === 0 ? 'center' : slot === 1 ? 'right' : 'back'}`;
        const hidden: 'true' | 'false' = slot === 0 ? 'false' : 'true';
        return (
          <div key={slide.src} className={className} aria-hidden={hidden}>
            <img
              src={slide.src}
              alt={slide.alt}
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </div>
        );
      })}
    </div>
  );
}
