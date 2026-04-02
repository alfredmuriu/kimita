import { Metadata } from 'next';
import ProductPageLayout from '@/components/ProductPageLayout';

export const metadata: Metadata = {
  title: 'AGRILAYER — Layer Feed Supplement for Egg Production | Agrikima',
  description: 'AGRILAYER maximizes egg production rate, strengthens eggshell quality, and maintains hen health throughout the laying cycle. Ideal for all laying hens from point of lay.',
  alternates: { canonical: 'https://www.agrikima.co.ke/products/agrilayer' },
  openGraph: {
    title: 'AGRILAYER — Layer Feed Supplement for Egg Production | Agrikima',
    description: 'AGRILAYER maximizes egg production rate, strengthens eggshell quality, and maintains hen health throughout the laying cycle. Ideal for all laying hens from point of lay.',
    url: 'https://www.agrikima.co.ke/products/agrilayer',
    siteName: 'Agrikima',
  },
};

export default function AgrilayerProduct() {
  return (
    <ProductPageLayout
      productName="AGRILAYER"
      productImage="/products/agrilayer.png"
      productImageAlt="AGRILAYER layer feed supplement egg production strong eggshells poultry Kenya"
      description="AGRILAYER is a premium layer feed supplement specifically formulated to maximize egg production, enhance eggshell quality, and maintain hen health throughout the laying cycle. This comprehensive formula provides optimal calcium, phosphorus, and essential nutrients for consistent egg production and strong shells. Ideal for all laying hens from point of lay onwards. Trusted by farmers across Kenya and East Africa for peak egg production performance."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Maximizes egg production rate</li>
              <li>Strengthens eggshell quality</li>
              <li>Reduces egg breakage and cracks</li>
              <li>Enhances yolk color</li>
              <li>Maintains peak production longer</li>
              <li>Supports hen bone health</li>
              <li>Improves feed efficiency</li>
              <li>Reduces production cycle mortality</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <><p><strong>For Laying Hens:</strong></p><ul><li>Mix 2.5-5kg per ton of feed</li><li>Use continuously throughout laying cycle</li></ul><p><strong>For Peak Production:</strong></p><ul><li>Mix 3-5kg per ton of feed</li><li>Increase rates during heat stress</li></ul><p className="note">Note: Ensure adequate calcium supply. Store in a cool, dry place.</p></>
          ),
        },
        {
          title: 'Indication',
          content: (
            <ul>
              <li>Low egg production and poor laying performance</li>
              <li>Thin or weak eggshells and frequent egg breakage</li>
              <li>Declining peak production in layers</li>
              <li>Calcium and phosphorus deficiency in laying hens</li>
              <li>Poor yolk color and egg quality</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
