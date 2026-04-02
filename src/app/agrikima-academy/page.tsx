import { Metadata } from 'next';
import AcademyContent from './AcademyContent';

export const metadata: Metadata = {
  title: 'Agrikima Academy — Free Poultry & Livestock Farming Video Courses',
  description: 'Learn poultry feeding, brooding, housing, health management and biosecurity from experts. Free video training for farmers across Africa.',
  alternates: {
    canonical: 'https://www.agrikima.co.ke/agrikima-academy',
  },
  openGraph: {
    title: 'Agrikima Academy — Free Poultry & Livestock Farming Video Courses',
    description: 'Learn poultry feeding, brooding, housing, health management and biosecurity from experts. Free video training for farmers across Africa.',
    url: 'https://www.agrikima.co.ke/agrikima-academy',
    siteName: 'Agrikima',
  },
};

export default function AcademyPage() {
  return <AcademyContent />;
}
