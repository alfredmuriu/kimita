import { Metadata } from 'next';
import ProductPageLayout from '@/components/ProductPageLayout';

export const metadata: Metadata = {
  title: 'MIX5 — 5-in-1 Respiratory Supplement for Poultry & Livestock | Agrikima',
  description: 'MIX5 contains 5 plant extracts with antibacterial, antiviral, antifungal, and anti-inflammatory effects. Relieves respiratory problems, reduces heat stress, and eases post-vaccination reactions.',
  alternates: { canonical: 'https://www.agrikima.co.ke/products/mix-5' },
  openGraph: {
    title: 'MIX5 — 5-in-1 Respiratory Supplement for Poultry & Livestock | Agrikima',
    description: 'MIX5 contains 5 plant extracts with antibacterial, antiviral, antifungal, and anti-inflammatory effects. Relieves respiratory problems, reduces heat stress, and eases post-vaccination reactions.',
    url: 'https://www.agrikima.co.ke/products/mix-5',
    siteName: 'Agrikima',
  },
};

export default function Mix5Product() {
  return (
    <ProductPageLayout
      productName="MIX5"
      productImage="/products/mix.png"
      productImageAlt="MIX5 5-in-1 respiratory supplement for poultry and livestock"
      description="MIX5 is recommended for prevention and help in the treatment of respiratory problems of different etiology. It helps in stages of difficult respiration caused by respiratory illness, hot and dusty air on farm, and animal overpopulation. MIX5 solution contains 5 extracts known for antibacterial, antiviral, antifungal, and anti-inflammatory effects, with the strongest effect on the respiratory system. It helps for better and easier respiration and alleviates content from the respiratory system. It also reduces undesirable effects of post-vaccination reactions, diminishes contamination of drinking water, and alleviates heat stress."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Relieves respiratory symptoms: mucus secretion, cough, throat inflammation, bronchitis, and fever</li>
              <li>Antibacterial, antiviral, antifungal, and anti-inflammatory action</li>
              <li>Reduces undesirable effects of post-vaccination reactions</li>
              <li>Diminishes contamination of drinking water</li>
              <li>Alleviates heat stress and increases terminal sensation of freshness</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <ul>
              <li><strong>Poultry:</strong> 250 ml per 1000 litres of drinking water, 3–4 days</li>
              <li><strong>Pigeon:</strong> 1 ml per 5 litres of drinking water, 3–4 days</li>
              <li><strong>Sheep, Cattle, Cows:</strong> 100–200 ml per 10 litres of drinking water, 2–4 times per day</li>
            </ul>
          ),
        },
        {
          title: 'Packing',
          content: <p>Available in 1L bottles and 5L cans. Form: Liquid — Code: AKS031</p>,
        },
      ]}
    />
  );
}
