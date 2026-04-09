import { Metadata } from 'next';
import ProductPageLayout from '@/components/ProductPageLayout';
import { getRelatedProducts } from '@/lib/related-products';

export const metadata: Metadata = {
  title: 'RE-COVER — Rehydrating & Heat Stress Relief Oral Solution for Poultry | Agrikima',
  description: 'RE-COVER is a refreshing rehydrating oral solution for poultry. Reduces mortality from heat stress, retains gut moisture, and improves faecal consistency with Betaine.',
  alternates: { canonical: 'https://www.agrikima.co.ke/products/re-cover' },
  openGraph: {
    title: 'RE-COVER — Rehydrating & Heat Stress Relief Oral Solution for Poultry | Agrikima',
    description: 'RE-COVER is a refreshing rehydrating oral solution for poultry. Reduces mortality from heat stress, retains gut moisture, and improves faecal consistency with Betaine.',
    url: 'https://www.agrikima.co.ke/products/re-cover',
    siteName: 'Agrikima',
  },
};

export default function RecoverProduct() {
  return (
    <ProductPageLayout
      productName="RE-COVER"
      productImage="/products/re-cover.png"
      productImageAlt="RE-COVER refreshing, rehydrating and stress-relieving oral solution for poultry"
      description="RE-COVER is a refreshing, rehydrating, and stress-relieving oral solution for poultry. It reduces mortality and productivity losses in animals suffering from heat stress due to high ambient temperatures and high relative humidity. Betaine prevents dehydration as it retains water in the mucosal cells of the gut wall, which reduces water loss in faeces and improves faecal consistency."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Reduces mortality and productivity losses from heat stress</li>
              <li>Prevents dehydration — Betaine retains water in gut mucosal cells</li>
              <li>Improves faecal consistency and reduces water loss</li>
              <li>Vitamin C relieves symptoms associated with heat stress</li>
              <li>Broad-spectrum supplement for poultry and livestock</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <ul>
              <li><strong>Poultry:</strong> 1 litre per 4000 litres of drinking water or as advised by a veterinarian</li>
              <li><strong>Cattle, horses:</strong> 10 ml per 100 kg bodyweight for 5–7 days</li>
              <li><strong>Sheep, goats, calves:</strong> 20 ml per 100 kg bodyweight for 5–7 days</li>
              <li><strong>Pigs:</strong> 500 ml per 1,000 litres of drinking water for 5–7 days</li>
            </ul>
          ),
        },
        {
          title: 'Packing',
          content: <p>Available in 1L bottles and 5L cans. Form: Liquid — Code: AKS2017015</p>,
        },
      ]}
      relatedProducts={getRelatedProducts('re-cover')}
    />
  );
}
