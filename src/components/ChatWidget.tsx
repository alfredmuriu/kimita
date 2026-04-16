'use client';

import styles from './ChatWidget.module.css';

// Agrikima WhatsApp number in E.164 form, no leading "+".
// Override per-environment with NEXT_PUBLIC_WHATSAPP_NUMBER if needed.
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254111410639';

const INTRO_MESSAGE = "Hi Agrikima, I'd like to inquire about your products.";

const HREF = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(INTRO_MESSAGE)}`;

export default function ChatWidget() {
  return (
    <a
      className={styles.launcher}
      href={HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Agrikima on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.495-1.318.143-.33.244-.7.244-1.075 0-.058 0-.13-.014-.187-.06-.302-2.18-1.318-2.71-1.318zm-2.943 7.234c-1.39 0-2.766-.42-3.94-1.137l-2.825.917.916-2.708a7.358 7.358 0 0 1-1.319-4.215c0-4.124 3.4-7.484 7.568-7.484 4.169 0 7.568 3.36 7.568 7.484 0 4.124-3.4 7.143-7.568 7.143zm0-16.371c-5.075 0-9.215 4.067-9.215 9.075 0 1.713.483 3.376 1.402 4.823L4 27.205l5.43-1.748a9.158 9.158 0 0 0 4.737 1.291c5.075 0 9.215-4.066 9.215-9.075 0-2.421-.954-4.703-2.69-6.418-1.738-1.713-4.045-2.687-6.525-2.687z" />
      </svg>
    </a>
  );
}
