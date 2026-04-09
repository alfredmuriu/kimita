import { Metadata } from 'next';
import ProductPageLayout from '@/components/ProductPageLayout';
import { getRelatedProducts } from '@/lib/related-products';

export const metadata: Metadata = {
  title: 'AGRITONIC — Liquid Poultry Health & Productivity Supplement | Agrikima',
  description: 'AGRITONIC is a powerful liquid feed supplement that boosts broiler weight gain, improves feed conversion, and enhances layer productivity with essential vitamins and minerals.',
  alternates: { canonical: 'https://www.agrikima.co.ke/products/agritonic' },
  openGraph: {
    title: 'AGRITONIC — Liquid Poultry Health & Productivity Supplement | Agrikima',
    description: 'AGRITONIC is a powerful liquid feed supplement that boosts broiler weight gain, improves feed conversion, and enhances layer productivity with essential vitamins and minerals.',
    url: 'https://www.agrikima.co.ke/products/agritonic',
    siteName: 'Agrikima',
  },
};

export default function AgritonicProduct() {
  return (
    <ProductPageLayout
      productName="AGRITONIC"
      productImage="/products/agritonic_1l.png"
      productImageAlt="AGRITONIC broiler weight gain feed supplement poultry productivity Kenya"
      description="Agritonic is a powerful liquid feed supplement formulated to support optimal poultry health and productivity. This comprehensive tonic provides essential nutrients, vitamins, and minerals needed for healthy growth, improved feed conversion, and enhanced production performance. Trusted by farmers across Kenya and East Africa for boosting broiler weight gain and layer productivity."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Supports optimal poultry health</li>
              <li>Boosts broiler weight gain</li>
              <li>Improves feed conversion ratio</li>
              <li>Enhances egg production in layers</li>
              <li>Provides essential nutrients</li>
              <li>Reduces stress effects</li>
              <li>Improves overall flock vitality</li>
              <li>Suitable for all poultry types</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <><p><strong>For Maintenance:</strong></p><ul><li>Mix 1ml per 1 liter of drinking water</li><li>Administer for 3-5 days weekly</li></ul><p><strong>For Performance Boost:</strong></p><ul><li>Mix 2ml per 1 liter of drinking water</li><li>Administer during growth phases</li></ul><p className="note">Note: Shake well before use. Store in a cool, dry place.</p></>
          ),
        },
        {
          title: 'Indication',
          content: (
            <ul>
              <li>Poor weight gain and slow growth in broilers</li>
              <li>Low egg production in layers</li>
              <li>Nutrient deficiency and poor feed conversion</li>
              <li>Stress-related production drops</li>
              <li>General flock vitality issues</li>
            </ul>
          ),
        },
      ]}
      relatedProducts={getRelatedProducts('agritonic')}
    />
  );
}
