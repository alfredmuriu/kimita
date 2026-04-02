import { Metadata } from 'next';
import ProductPageLayout from '@/components/ProductPageLayout';

export const metadata: Metadata = {
  title: 'DCP-18 — Dicalcium Phosphate for Strong Bones in Poultry & Livestock | Agrikima',
  description: 'DCP-18 is a feed-grade dicalcium phosphate with 18% phosphorus and 21% calcium. Supports strong bone development, healthy growth, and balanced mineral nutrition in all livestock.',
  alternates: { canonical: 'https://www.agrikima.co.ke/products/dcp-18' },
  openGraph: {
    title: 'DCP-18 — Dicalcium Phosphate for Strong Bones in Poultry & Livestock | Agrikima',
    description: 'DCP-18 is a feed-grade dicalcium phosphate with 18% phosphorus and 21% calcium. Supports strong bone development, healthy growth, and balanced mineral nutrition in all livestock.',
    url: 'https://www.agrikima.co.ke/products/dcp-18',
    siteName: 'Agrikima',
  },
};

export default function DCP18Product() {
  return (
    <ProductPageLayout
      productName="DCP-18"
      productImage="/products/dcp18.png"
      productImageAlt="DCP 18 dicalcium phosphate calcium phosphorus strong bones poultry Kenya"
      description="DCP 18 is a feed-grade dicalcium phosphate supplement containing 18% phosphorus and 21% calcium in highly absorbable forms. This essential mineral supplement supports strong bones, healthy growth, and overall development in poultry, swine, cattle, and other livestock. An indispensable component of balanced animal nutrition. Trusted by farmers across Kenya and East Africa for mineral supplementation."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Supports strong bone development</li>
              <li>Highly bioavailable calcium and phosphorus</li>
              <li>Improves eggshell quality in layers</li>
              <li>Prevents leg problems in broilers</li>
              <li>Essential for teeth and skeletal health</li>
              <li>Supports muscle function</li>
              <li>Improves overall growth</li>
              <li>Suitable for all livestock species</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <><p><strong>For Poultry:</strong></p><ul><li>Mix 10-20kg per ton of feed</li><li>Higher rates for layers during production</li></ul><p><strong>For Cattle/Swine:</strong></p><ul><li>Mix 15-25kg per ton of feed</li><li>Adjust based on diet formulation</li></ul><p className="note">Note: Balance with calcium sources. Consult nutritionist for precise inclusion rates.</p></>
          ),
        },
        {
          title: 'Indication',
          content: (
            <ul>
              <li>Calcium and phosphorus deficiency in livestock</li>
              <li>Weak bones, leg problems, and rickets in poultry</li>
              <li>Thin eggshells and poor egg quality in layers</li>
              <li>Poor skeletal development in growing animals</li>
              <li>Mineral imbalance in all livestock species</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
