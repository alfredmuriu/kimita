import { Metadata } from 'next';
import ProductPageLayout from '@/components/ProductPageLayout';

export const metadata: Metadata = {
  title: 'TOXINIL — Acidifying Gut Health & Microflora Balancing Supplement | Agrikima',
  description: 'TOXINIL is a concentrated acidifying formulation that optimizes gut pH, promotes digestion, facilitates nutrient absorption, and restores gut health after antibiotic use in livestock.',
  alternates: { canonical: 'https://www.agrikima.co.ke/products/toxinil' },
  openGraph: {
    title: 'TOXINIL — Acidifying Gut Health & Microflora Balancing Supplement | Agrikima',
    description: 'TOXINIL is a concentrated acidifying formulation that optimizes gut pH, promotes digestion, facilitates nutrient absorption, and restores gut health after antibiotic use in livestock.',
    url: 'https://www.agrikima.co.ke/products/toxinil',
    siteName: 'Agrikima',
  },
};

export default function ToxinilProduct() {
  return (
    <ProductPageLayout
      productName="TOXINIL"
      productImage="/products/toxinil.png"
      productImageAlt="TOXINIL concentrated acidifying formulation with beneficial acids for poultry and livestock"
      description="TOXINIL is a concentrated acidifying formulation containing mixtures of the most beneficial acids. It optimizes pH for balanced microflora in the gut, promotes digestion by activating digestive enzymes, and facilitates nutrient absorption by promoting a healthy gastrointestinal tract. It favors mineral absorption through acidification of the gut and helps normalization of the gut environment after chemotherapy, antibiotic use, and stressful events."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Strong effect against mold</li>
              <li>Broad-spectrum of activity</li>
              <li>Adsorption of mycotoxins</li>
              <li>Helps maintain high resistance in animals</li>
              <li>Optimizes gut pH for balanced microflora</li>
              <li>Promotes digestion by activating digestive enzymes</li>
              <li>Improves overall production and performance</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <ul>
              <li><strong>Recommended dosage:</strong> 500 ml per 1000 litres of drinking water (can be increased to 1000 ml/1000 L if needed)</li>
              <li><strong>Cleaning &amp; disinfection of watering systems:</strong> 1000 ml per 200 litres of water</li>
            </ul>
          ),
        },
        {
          title: 'Packing',
          content: <p>Available in 1L bottles. Form: Liquid — Code: AKF029</p>,
        },
      ]}
    />
  );
}
