'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    basicLightbox: any;
  }
}

export default function LightboxInit() {
  useEffect(() => {
    const initLightbox = () => {
      if (typeof window === 'undefined' || !window.basicLightbox) return;

      const folioLinks = document.querySelectorAll('.brick .entry__link');
      if (!folioLinks.length) return;

      // Store modal HTML strings before basicLightbox moves the DOM elements
      const modalData: { html: string; link: Element }[] = [];

      folioLinks.forEach(function (link) {
        const modalId = link.getAttribute('href');
        if (!modalId) return;

        const modalEl = document.querySelector(modalId);
        if (!modalEl) return;

        // Use innerHTML so basicLightbox creates a fresh copy each time
        modalData.push({ html: modalEl.innerHTML, link });
      });

      modalData.forEach(function ({ html, link }) {
        // Remove existing listeners by cloning
        const newLink = link.cloneNode(true) as Element;
        link.parentNode?.replaceChild(newLink, link);

        newLink.addEventListener('click', function (event) {
          event.preventDefault();
          // Create a fresh lightbox instance each time from the HTML string
          const instance = window.basicLightbox.create(html, {
            onShow: function (inst: any) {
              document.addEventListener('keydown', function handler(e: KeyboardEvent) {
                if (e.key === 'Escape') {
                  inst.close();
                  document.removeEventListener('keydown', handler);
                }
              });
            },
          });
          instance.show();
        });
      });
    };

    // Retry until basicLightbox is loaded
    const interval = setInterval(() => {
      if (window.basicLightbox) {
        clearInterval(interval);
        initLightbox();
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return null;
}

