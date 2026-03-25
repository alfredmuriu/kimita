import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agrikima Academy | Expert Poultry & Livestock Farming Training',
  description: 'Learn practical poultry and livestock farming from Agrikima experts. Access free video guides on proper feeding, brooding, disease prevention, and biosecurity to run a profitable farm.',
  keywords: 'Poultry farming training Kenya, Broiler feeding guide, Poultry disease prevention videos, How to start poultry farming',
  openGraph: {
    title: 'Agrikima Academy | Expert Poultry & Livestock Farming Training',
    description: 'Learn practical poultry and livestock farming from Agrikima experts. Access free video guides on proper feeding, brooding, disease prevention, and biosecurity to run a profitable farm.',
    url: 'https://www.agrikima.co.ke/agrikima-academy',
    siteName: 'Agrikima',
    images: [
      {
        url: '/images/chicken1.jpg',
        width: 1200,
        height: 630,
        alt: 'Agrikima Academy Training',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Agrikima Academy",
    "url": "https://www.agrikima.co.ke/agrikima-academy",
    "description": "Expert poultry and livestock farming training, video guides, and agricultural resources."
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
