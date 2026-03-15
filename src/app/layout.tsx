import type { Metadata } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Agrikima',
  description: 'Kenya\'s leading provider of Agriculture and Veterinary products',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="js ss-loaded">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-H7FKY9RHLN"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-H7FKY9RHLN');
          `}
        </Script>
      </head>
      <body id="top" className="ss-show">
        {children}
        <Analytics />
        <Script src="/js/plugins.js" strategy="beforeInteractive" />
        <Script src="/js/main.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
