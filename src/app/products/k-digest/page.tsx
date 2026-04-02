import { Metadata } from 'next';
import ProductPageLayout from '@/components/ProductPageLayout';

export const metadata: Metadata = {
  title: 'K-DIGEST — Liver Health & Digestive Support Supplement for Poultry | Agrikima',
  description: 'K-DIGEST corrects fatty liver conditions, prevents liver dysfunctions, and relieves digestive disturbances in poultry. A refreshing, rehydrating oral solution for stressed birds.',
  alternates: { canonical: 'https://www.agrikima.co.ke/products/k-digest' },
  openGraph: {
    title: 'K-DIGEST — Liver Health & Digestive Support Supplement for Poultry | Agrikima',
    description: 'K-DIGEST corrects fatty liver conditions, prevents liver dysfunctions, and relieves digestive disturbances in poultry. A refreshing, rehydrating oral solution for stressed birds.',
    url: 'https://www.agrikima.co.ke/products/k-digest',
    siteName: 'Agrikima',
  },
};

export default function KDigestProduct() {
  return (
    <ProductPageLayout
      productName="K-DIGEST"
      productImage="/products/k-digest.png"
      productImageAlt="K-DIGEST dietetic liquid supplement for liver health and digestive disorders in poultry"
      description="K-Digest is a dietetic liquid supplement formulated to correct fatty liver conditions, prevent liver dysfunctions, and correct digestive disturbances in animals when fed a lithogenic diet (high in oil, fat, cholesterol, and cholic acid), leading to an increased supply of free fatty acids to hepatic cells. It is a refreshing, rehydrating, and stress-relieving oral solution for poultry."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Corrects fatty liver conditions</li>
              <li>Prevents liver dysfunctions</li>
              <li>Corrects digestive disturbances</li>
              <li>Suitable for animals on lithogenic diets (high in oil, fat, cholesterol, cholic acid)</li>
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
          content: <p>Available in 1L bottles and 5L cans. Form: Liquid — Code: AKS17</p>,
        },
      ]}
    />
  );
}
