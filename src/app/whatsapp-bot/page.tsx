import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WhatsApp Bot Demo',
  robots: { index: false, follow: false },
};

export default function WhatsAppBotDemoPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#ffffff',
      }}
    />
  );
}
