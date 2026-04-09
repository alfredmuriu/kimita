import { Metadata } from 'next';
import ProductPageLayout from '@/components/ProductPageLayout';
import { getRelatedProducts } from '@/lib/related-products';

export const metadata: Metadata = {
  title: 'METHIONINE — First Limiting Amino Acid for Poultry Nutrition | Agrikima',
  description: 'Methionine supports protein metabolism, feather development, and liver function in poultry. The first limiting amino acid — critical for feed conversion and healthy growth.',
  alternates: { canonical: 'https://www.agrikima.co.ke/products/methionine' },
  openGraph: {
    title: 'METHIONINE — First Limiting Amino Acid for Poultry Nutrition | Agrikima',
    description: 'Methionine supports protein metabolism, feather development, and liver function in poultry. The first limiting amino acid — critical for feed conversion and healthy growth.',
    url: 'https://www.agrikima.co.ke/products/methionine',
    siteName: 'Agrikima',
  },
};

export default function MethionineProduct() {
  return (
    <ProductPageLayout
      productName="METHIONINE"
      productImage="/products/methionine.png"
      productImageAlt="METHIONINE amino acid feather development protein metabolism poultry Kenya"
      description="Methionine is a vital amino acid that supports protein metabolism, feather development in poultry, and optimal liver function. This essential nutrient improves feed conversion and promotes healthy growth. The first limiting amino acid in poultry nutrition. Trusted by farmers across Kenya and East Africa for amino acid supplementation and improved production performance."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Supports protein metabolism</li>
              <li>Promotes healthy feather development</li>
              <li>Optimizes liver function</li>
              <li>Improves feed conversion</li>
              <li>Promotes healthy growth</li>
              <li>First limiting amino acid in poultry</li>
              <li>Essential for all poultry diets</li>
              <li>Supports egg production in layers</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <><p><strong>For Broilers:</strong></p><ul><li>Mix 1-2.5kg per ton of feed</li><li>Higher rates for starter diets</li></ul><p><strong>For Layers:</strong></p><ul><li>Mix 1-1.5kg per ton of feed</li><li>Adjust based on production stage</li></ul><p className="note">Note: Consult nutritionist for precise formulation. Store in a cool, dry place.</p></>
          ),
        },
        {
          title: 'Indication',
          content: (
            <ul>
              <li>Methionine deficiency in poultry diets</li>
              <li>Poor feather development and feather picking</li>
              <li>Liver dysfunction and poor protein metabolism</li>
              <li>Low feed conversion and slow growth in broilers</li>
              <li>Reduced egg production from amino acid imbalance</li>
            </ul>
          ),
        },
      ]}
      relatedProducts={getRelatedProducts('methionine')}
    />
  );
}
