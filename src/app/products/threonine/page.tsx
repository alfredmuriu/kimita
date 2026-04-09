import { Metadata } from 'next';
import ProductPageLayout from '@/components/ProductPageLayout';
import { getRelatedProducts } from '@/lib/related-products';

export const metadata: Metadata = {
  title: 'THREONINE 65% — Third Limiting Amino Acid for Broilers & Livestock | Agrikima',
  description: 'Threonine 65% is the third limiting essential amino acid in corn-soybean broiler diets. Supports optimal health, wellness, and protein utilization in poultry and livestock.',
  alternates: { canonical: 'https://www.agrikima.co.ke/products/threonine' },
  openGraph: {
    title: 'THREONINE 65% — Third Limiting Amino Acid for Broilers & Livestock | Agrikima',
    description: 'Threonine 65% is the third limiting essential amino acid in corn-soybean broiler diets. Supports optimal health, wellness, and protein utilization in poultry and livestock.',
    url: 'https://www.agrikima.co.ke/products/threonine',
    siteName: 'Agrikima',
  },
};

export default function ThreonineProduct() {
  return (
    <ProductPageLayout
      productName="THREONINE 65%"
      productImage="/products/therionine.png"
      productImageAlt="THREONINE 65% essential amino acid supplement for poultry and livestock"
      description="Threonine is a crucial component of a healthy diet and plays an important role in maintaining optimal health and wellness. Since it cannot be produced by the body, it is important to obtain enough Threonine through the diet or supplementation to meet the body's needs as an energy source. Threonine is the third limiting essential amino acid after Methionine and Lysine in corn-soybean based diets of broilers."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Essential amino acid that cannot be produced by the body</li>
              <li>Crucial for maintaining optimal health and wellness</li>
              <li>Third limiting essential amino acid in broiler diets</li>
              <li>Supports protein synthesis and overall growth</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <ul>
              <li><strong>Poultry:</strong> 1 ml per 6 litres of drinking water</li>
            </ul>
          ),
        },
        {
          title: 'Packing',
          content: <p>Available in 1L bottles. Form: Liquid — 65%</p>,
        },
      ]}
      relatedProducts={getRelatedProducts('threonine')}
    />
  );
}
