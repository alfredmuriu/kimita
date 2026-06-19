import type { Metadata } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import ChatWidget from '@/components/ChatWidget';
import SiteScripts from '@/components/SiteScripts';
import '../styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.agrikima.co.ke'),
  title: 'Agrikima',
  description: 'Africa\'s leading provider of Agriculture and Veterinary products',
  alternates: {
    canonical: 'https://www.agrikima.co.ke',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Agrikima',
  url: 'https://www.agrikima.co.ke',
  logo: 'https://www.agrikima.co.ke/favicon.png',
  description: "Africa's trusted provider of natural poultry health solutions, livestock supplements, and veterinary products.",
  telephone: '+254111410639',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+254111410639',
    contactType: 'sales',
    areaServed: 'KE',
  },
  sameAs: [
    'https://www.facebook.com/AgriKimaSdnBhd/',
    'https://x.com/AgrikimaB',
    'https://www.linkedin.com/company/agrikima/',
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
        <ChatWidget />
        <Analytics />
        <SiteScripts />
      </body>
    </html>
  );
}
