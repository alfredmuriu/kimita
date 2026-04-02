import { Metadata } from 'next';
import ProductPageLayout from '@/components/ProductPageLayout';

export const metadata: Metadata = {
  title: 'BIOGARD-99 — Herbal Immunity Booster & Antiviral Supplement | Agrikima',
  description: 'BIOGARD-99 is a herbal liquid supplement with medicinal plant extracts that enhances immunity and protects livestock against viral and microbial diseases naturally.',
  alternates: { canonical: 'https://www.agrikima.co.ke/products/biogard-99' },
  openGraph: {
    title: 'BIOGARD-99 — Herbal Immunity Booster & Antiviral Supplement | Agrikima',
    description: 'BIOGARD-99 is a herbal liquid supplement with medicinal plant extracts that enhances immunity and protects livestock against viral and microbial diseases naturally.',
    url: 'https://www.agrikima.co.ke/products/biogard-99',
    siteName: 'Agrikima',
  },
};

export default function Biogard99Product() {
  return (
    <ProductPageLayout
      productName="BIOGARD-99"
      productImage="/products/biogar99.png"
      productImageAlt="BIOGARD 99 herbal immunity booster viral disease prevention livestock Kenya"
      description="BIOGARD99 is a powerful herbal liquid supplement designed to enhance immunity and protect livestock against a range of viral and microbial diseases. Formulated with a concentrated blend of medicinal plant extracts, this product provides comprehensive immune support for poultry and other animals. Trusted by farmers across Kenya and East Africa for natural disease prevention and immunity boosting."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Enhances natural immunity in livestock</li>
              <li>Protects against viral diseases</li>
              <li>Provides antimicrobial protection</li>
              <li>Supports faster recovery from illness</li>
              <li>Reduces disease-related mortality</li>
              <li>Natural and safe for all animals</li>
              <li>No withdrawal period required</li>
              <li>Improves overall flock health</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <><p><strong>For Prevention:</strong></p><ul><li>Mix 1ml per 2 liters of drinking water</li><li>Administer for 3-5 days weekly</li></ul><p><strong>During Disease Outbreaks:</strong></p><ul><li>Mix 1ml per 1 liter of drinking water</li><li>Administer for 7-10 consecutive days</li></ul><p className="note">Note: Combine with proper biosecurity measures. Consult a veterinarian for severe disease outbreaks.</p></>
          ),
        },
        {
          title: 'Indication',
          content: (
            <ul>
              <li>Viral disease prevention in poultry and livestock</li>
              <li>Microbial infections and weakened immune response</li>
              <li>Disease outbreaks requiring natural immune support</li>
              <li>Post-disease recovery and convalescence</li>
              <li>General immunity boosting for all animals</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
