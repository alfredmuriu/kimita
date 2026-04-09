import { Metadata } from 'next';
import ProductPageLayout from '@/components/ProductPageLayout';
import { getRelatedProducts } from '@/lib/related-products';

export const metadata: Metadata = {
  title: 'LYSINE — Essential Amino Acid for Muscle Development & Growth | Agrikima',
  description: 'Lysine is an essential amino acid critical for protein synthesis, muscle development, and growth in poultry and swine. The second limiting amino acid in poultry nutrition.',
  alternates: { canonical: 'https://www.agrikima.co.ke/products/lysine' },
  openGraph: {
    title: 'LYSINE — Essential Amino Acid for Muscle Development & Growth | Agrikima',
    description: 'Lysine is an essential amino acid critical for protein synthesis, muscle development, and growth in poultry and swine. The second limiting amino acid in poultry nutrition.',
    url: 'https://www.agrikima.co.ke/products/lysine',
    siteName: 'Agrikima',
  },
};

export default function LysineProduct() {
  return (
    <ProductPageLayout
      productName="LYSINE"
      productImage="/products/lysine.png"
      productImageAlt="LYSINE amino acid muscle development broiler growth feed efficiency Kenya"
      description="Lysine is an essential amino acid critical for protein synthesis, muscle development, and overall growth in livestock. This vital nutrient enhances feed efficiency and supports optimal production performance. The second limiting amino acid in poultry after methionine. Trusted by farmers across Kenya and East Africa for amino acid supplementation and improved growth."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Critical for protein synthesis</li>
              <li>Supports muscle development</li>
              <li>Enhances overall growth</li>
              <li>Improves feed efficiency</li>
              <li>Optimizes production performance</li>
              <li>Essential for broiler growth</li>
              <li>Supports lean meat production</li>
              <li>Second limiting amino acid in poultry</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <><p><strong>For Broilers:</strong></p><ul><li>Mix 1-3kg per ton of feed</li><li>Higher rates for starter phase</li></ul><p><strong>For Swine:</strong></p><ul><li>Mix 2-4kg per ton of feed</li><li>Adjust based on growth stage</li></ul><p className="note">Note: Consult nutritionist for precise formulation. Store in a cool, dry place.</p></>
          ),
        },
        {
          title: 'Indication',
          content: (
            <ul>
              <li>Lysine deficiency in poultry and swine diets</li>
              <li>Poor muscle development and slow growth</li>
              <li>Low feed efficiency and poor protein synthesis</li>
              <li>Suboptimal lean meat production in broilers</li>
              <li>Amino acid imbalance in feed formulation</li>
            </ul>
          ),
        },
      ]}
      relatedProducts={getRelatedProducts('lysine')}
    />
  );
}
