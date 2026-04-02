import { Metadata } from 'next';
import ProductPageLayout from '@/components/ProductPageLayout';

export const metadata: Metadata = {
  title: 'AGRIGROWER — Poultry Grower Feed Additive | Agrikima',
  description: 'AGRIGROWER supports optimal growth and development during the critical 14–28 day growing phase. Builds strong skeletal structure, muscle, and immune system in broilers.',
  alternates: { canonical: 'https://www.agrikima.co.ke/products/agrigrower' },
  openGraph: {
    title: 'AGRIGROWER — Poultry Grower Feed Additive | Agrikima',
    description: 'AGRIGROWER supports optimal growth and development during the critical 14–28 day growing phase. Builds strong skeletal structure, muscle, and immune system in broilers.',
    url: 'https://www.agrikima.co.ke/products/agrigrower',
    siteName: 'Agrikima',
  },
};

export default function AgrigrowerProduct() {
  return (
    <ProductPageLayout
      productName="AGRIGROWER"
      productImage="/products/agrigrower.png"
      productImageAlt="AGRIGROWER poultry grower feed additive optimal growth development Kenya"
      description="AGRIGROWER is a specialized poultry grower feed additive designed to support optimal growth and development during the critical growing phase. This balanced formula provides essential nutrients for building strong skeletal structure, muscle development, and immune system support. Ideal for the 14-28 day growth period. Trusted by farmers across Kenya and East Africa for consistent growth performance."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Supports optimal growth rate</li>
              <li>Builds strong bone structure</li>
              <li>Enhances muscle development</li>
              <li>Improves feed conversion</li>
              <li>Strengthens immune system</li>
              <li>Promotes uniform flock growth</li>
              <li>Prepares birds for finishing phase</li>
              <li>Reduces grower phase mortality</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <><p><strong>For Broiler Growers (14-28 days):</strong></p><ul><li>Mix 2.5-5kg per ton of feed</li><li>Use continuously through grower phase</li></ul><p><strong>For Layer Pullets:</strong></p><ul><li>Mix 2-4kg per ton of feed</li><li>Continue until point of lay</li></ul><p className="note">Note: Transition gradually from starter feed. Store in a cool, dry place.</p></>
          ),
        },
        {
          title: 'Indication',
          content: (
            <ul>
              <li>Slow growth rate in grower-phase poultry (14-28 days)</li>
              <li>Weak skeletal development and poor bone structure</li>
              <li>Poor feed efficiency during the growing phase</li>
              <li>Uneven flock growth and immune weakness</li>
              <li>Preparation for the finishing phase in broilers</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
