'use client';

import { useEffect, useCallback } from 'react';

interface Video {
  id: string;
  title: string;
}

interface VideoModalProps {
  videos: Video[];
  index: number;
  isOpen: boolean;
  onClose: () => void;
  onChangeIndex: (next: number) => void;
}

export default function VideoModal({ videos, index, isOpen, onClose, onChangeIndex }: VideoModalProps) {
  const hasPrev = index > 0;
  const hasNext = index >= 0 && index < videos.length - 1;
  const current = index >= 0 ? videos[index] : undefined;

  const goPrev = useCallback(() => {
    if (hasPrev) onChangeIndex(index - 1);
  }, [hasPrev, index, onChangeIndex]);

  const goNext = useCallback(() => {
    if (hasNext) onChangeIndex(index + 1);
  }, [hasNext, index, onChangeIndex]);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    else if (e.key === 'ArrowLeft') goPrev();
    else if (e.key === 'ArrowRight') goNext();
  }, [onClose, goPrev, goNext]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKey]);

  if (!isOpen || !current) return null;

  return (
    <div className="video-modal-overlay" onClick={onClose}>
      <button
        type="button"
        className="video-modal-nav video-modal-nav--prev"
        onClick={(e) => { e.stopPropagation(); goPrev(); }}
        disabled={!hasPrev}
        aria-label="Previous video"
        style={{ color: '#ffffff' }}
      >
        <span aria-hidden="true" style={{ fontSize: 32, lineHeight: 1, fontWeight: 700, color: '#ffffff', display: 'block' }}>‹</span>
      </button>

      <div className="video-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="video-modal-close" onClick={onClose} aria-label="Close video">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="video-modal-player">
          <iframe
            key={current.id}
            src={`https://www.youtube.com/embed/${current.id}?autoplay=1&rel=0`}
            title={current.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <h3 className="video-modal-title">{current.title}</h3>
      </div>

      <button
        type="button"
        className="video-modal-nav video-modal-nav--next"
        onClick={(e) => { e.stopPropagation(); goNext(); }}
        disabled={!hasNext}
        aria-label="Next video"
        style={{ color: '#ffffff' }}
      >
        <span aria-hidden="true" style={{ fontSize: 32, lineHeight: 1, fontWeight: 700, color: '#ffffff', display: 'block' }}>›</span>
      </button>
    </div>
  );
}
