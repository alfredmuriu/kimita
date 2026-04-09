import { Metadata } from 'next';
import ProductPageLayout from '@/components/ProductPageLayout';
import { getRelatedProducts } from '@/lib/related-products';

export const metadata: Metadata = {
  title: 'ADVICE — Herbal Antiviral Supplement for Newcastle Disease & Poultry | Agrikima',
  description: 'ADVICE is a herbal antiviral water supplement with Cinnamon, Garlic, Echinacea, and Aloe vera. Treats Newcastle disease, infectious bronchitis, and viral infections in poultry.',
  alternates: { canonical: 'https://www.agrikima.co.ke/products/advice' },
  openGraph: {
    title: 'ADVICE — Herbal Antiviral Supplement for Newcastle Disease & Poultry | Agrikima',
    description: 'ADVICE is a herbal antiviral water supplement with Cinnamon, Garlic, Echinacea, and Aloe vera. Treats Newcastle disease, infectious bronchitis, and viral infections in poultry.',
    url: 'https://www.agrikima.co.ke/products/advice',
    siteName: 'Agrikima',
  },
};

export default function AdviceProduct() {
  return (
    <ProductPageLayout
      productName="ADVICE"
      productImage="/images/folio/advice.png"
      productImageAlt="ADVICE herbal antiviral supplement for Newcastle disease and viral infections in poultry"
      description="ADVICE is a herbal antiviral supplement formulated to be mixed with drinking water. It is produced with natural extracts — Cinnamon, Garlic, Echinacea, Astragalus, Aloe vera, and citric — plus Lectin and Amantadine. It is used to treat virus diseases including common cold, influenza, Newcastle disease (ND), and infectious bronchitis (IB). It treats cold-pungent diaphoresis, functions as heat-clearing, eliminates disease-causing microorganisms, serves as an anti-inflammation agent, and enhances the immune system."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Mainly used for virus diseases — Newcastle disease (ND), infections and bronchitis (IB)</li>
              <li>Enhances immunity</li>
              <li>Improves digestion and absorption</li>
              <li>Supports growth and development</li>
              <li>Improves production and performance</li>
              <li>Supports overall animal health</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <>
              <ul>
                <li><strong>Enhancing immunity (Poultry &amp; Livestock):</strong> 1000 ml per 1000 litres of drinking water, once a day</li>
                <li><strong>Virus diseases (Poultry &amp; Livestock):</strong> 1000 ml per 1000 litres of drinking water for 5 days</li>
              </ul>
              <p>This product may be used during the whole production period without any risk or side effects. No withdrawal period.</p>
            </>
          ),
        },
        {
          title: 'Packing',
          content: <p>Available in 1L bottles. Form: Liquid — Code: AKS030</p>,
        },
      ]}
      relatedProducts={getRelatedProducts('advice')}
    />
  );
}
