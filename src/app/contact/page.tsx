import { Metadata } from 'next';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Agrikima — Get Expert Farm Support',
  description: 'Have questions about poultry or livestock supplements? Contact the Agrikima team for personalized farm support and product guidance.',
  alternates: {
    canonical: 'https://www.agrikima.co.ke/contact',
  },
  openGraph: {
    title: 'Contact Agrikima — Get Expert Farm Support',
    description: 'Have questions about poultry or livestock supplements? Contact the Agrikima team for personalized farm support and product guidance.',
    url: 'https://www.agrikima.co.ke/contact',
    siteName: 'Agrikima',
  },
};

export default function ContactPage() {
  return <ContactForm />;
}
