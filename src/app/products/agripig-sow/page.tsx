import { Metadata } from 'next';
import ProductPageLayout from '@/components/ProductPageLayout';

export const metadata: Metadata = {
  title: 'AGRIPIG-SOW — Sow Feed Supplement for Reproduction & Lactation | Agrikima',
  description: 'AGRIPIG-SOW supports breeding sows through all stages of reproduction and lactation. Improves conception rates, milk production, and piglet vitality.',
  alternates: { canonical: 'https://www.agrikima.co.ke/products/agripig-sow' },
  openGraph: {
    title: 'AGRIPIG-SOW — Sow Feed Supplement for Reproduction & Lactation | Agrikima',
    description: 'AGRIPIG-SOW supports breeding sows through all stages of reproduction and lactation. Improves conception rates, milk production, and piglet vitality.',
    url: 'https://www.agrikima.co.ke/products/agripig-sow',
    siteName: 'Agrikima',
  },
};

export default function AgripigSowProduct() {
  return (
    <ProductPageLayout
      productName="AGRIPIG-SOW"
      productImage="/products/agripig-sow.png"
      productImageAlt="AGRIPIG-SOW pig sow feed supplement reproduction lactation performance Kenya"
      description="AGRIPIG-SOW is a specialized feed supplement formulated for breeding sows and gilts to support optimal reproduction and lactation performance. This comprehensive formula provides essential nutrients for fertility, healthy pregnancies, milk production, and piglet vitality. Designed for all stages of the sow production cycle. Trusted by pig farmers across Kenya and East Africa for improved breeding outcomes."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Improves conception rates</li>
              <li>Supports healthy litter sizes</li>
              <li>Enhances milk production</li>
              <li>Reduces stillbirths and mummified piglets</li>
              <li>Supports piglet birth weight</li>
              <li>Maintains sow body condition</li>
              <li>Shortens wean-to-service interval</li>
              <li>Improves overall breeding efficiency</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <><p><strong>For Breeding Sows:</strong></p><ul><li>Mix 3-5kg per ton of feed</li><li>Use throughout gestation and lactation</li></ul><p><strong>For Gilts:</strong></p><ul><li>Mix 2.5-4kg per ton of feed</li><li>Start 2-3 weeks before breeding</li></ul><p className="note">Note: Increase rates during lactation. Store in a cool, dry place.</p></>
          ),
        },
        {
          title: 'Indication',
          content: (
            <ul>
              <li>Poor conception rates and low fertility in sows</li>
              <li>Small litter sizes and high stillbirth rates</li>
              <li>Inadequate milk production during lactation</li>
              <li>Low piglet birth weight and poor vitality</li>
              <li>Extended wean-to-service intervals</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
