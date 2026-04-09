import { Metadata } from 'next';
import ProductPageLayout from '@/components/ProductPageLayout';
import { getRelatedProducts } from '@/lib/related-products';

export const metadata: Metadata = {
  title: 'AGRIVITAM — Liquid Vitamin & Mineral Supplement for Poultry | Agrikima',
  description: 'AGRIVITAM provides all essential vitamins and minerals in highly bioavailable forms to support poultry health, stress recovery, and enhanced layer egg production.',
  alternates: { canonical: 'https://www.agrikima.co.ke/products/agrivitam' },
  openGraph: {
    title: 'AGRIVITAM — Liquid Vitamin & Mineral Supplement for Poultry | Agrikima',
    description: 'AGRIVITAM provides all essential vitamins and minerals in highly bioavailable forms to support poultry health, stress recovery, and enhanced layer egg production.',
    url: 'https://www.agrikima.co.ke/products/agrivitam',
    siteName: 'Agrikima',
  },
};

export default function AgrivitamProduct() {
  return (
    <ProductPageLayout
      productName="AGRIVITAM"
      productImage="/products/agrivitam_1l.png"
      productImageAlt="AGRIVITAM poultry vitamins stress recovery layer egg production Kenya"
      description="AGRIVITAM is a premium liquid vitamin and mineral supplement designed to support the overall health and productivity of poultry. This comprehensive formulation provides all essential vitamins and minerals in highly bioavailable forms, ensuring optimal absorption and utilization. Trusted by farmers across Kenya and East Africa for stress recovery and enhanced layer egg production."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Supports overall poultry health</li>
              <li>Enhances egg production in layers</li>
              <li>Improves egg shell quality</li>
              <li>Promotes faster stress recovery</li>
              <li>Boosts immune function</li>
              <li>Improves feathering quality</li>
              <li>Supports healthy growth</li>
              <li>Suitable for all poultry ages</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <><p><strong>For Maintenance:</strong></p><ul><li>Mix 1ml per 2 liters of drinking water</li><li>Administer for 3-5 days weekly</li></ul><p><strong>During Stress Periods:</strong></p><ul><li>Mix 1ml per 1 liter of drinking water</li><li>Administer daily during stress period</li></ul><p className="note">Note: Store in a cool, dark place. Keep away from direct sunlight.</p></>
          ),
        },
        {
          title: 'Indication',
          content: (
            <ul>
              <li>Vitamin and mineral deficiency in poultry</li>
              <li>Stress recovery after disease, vaccination, or transportation</li>
              <li>Poor egg production and weak eggshells in layers</li>
              <li>Weak immune function and poor feathering</li>
              <li>General nutritional support for all poultry ages</li>
            </ul>
          ),
        },
      ]}
      relatedProducts={getRelatedProducts('agrivitam')}
    />
  );
}
