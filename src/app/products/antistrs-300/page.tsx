import { Metadata } from 'next';
import ProductPageLayout from '@/components/ProductPageLayout';
import { getRelatedProducts } from '@/lib/related-products';

export const metadata: Metadata = {
  title: 'ANTISTRS-300 — Pain Relief, Fever Reduction & Disease Resistance | Agrikima',
  description: 'ANTISTRS-300 relieves pain, reduces fever, and increases resistance to bacterial and viral diseases in poultry, pigeons, and parrots. Includes Vitamin C and Paracetamol.',
  alternates: { canonical: 'https://www.agrikima.co.ke/products/antistrs-300' },
  openGraph: {
    title: 'ANTISTRS-300 — Pain Relief, Fever Reduction & Disease Resistance | Agrikima',
    description: 'ANTISTRS-300 relieves pain, reduces fever, and increases resistance to bacterial and viral diseases in poultry, pigeons, and parrots. Includes Vitamin C and Paracetamol.',
    url: 'https://www.agrikima.co.ke/products/antistrs-300',
    siteName: 'Agrikima',
  },
};

export default function Antistrs300Product() {
  return (
    <ProductPageLayout
      productName="ANTISTRS-300"
      productImage="/products/antistrs-300.png"
      productImageAlt="ANTISTRS-300 soluble powder to relieve pain, reduce fever and increase disease resistance"
      description="ANTISTRS-300 works to relieve pain and reduce fever, and increase resistance against bacterial and viral diseases in pigeons, canaries, parrots, and poultry. Vitamin C plays an important role in maintaining the activity and vitality of the animals' body and increases their resistance, especially after stress and fatigue. Paracetamol is a common antipyretic and painkiller used to treat aches and pain. It is used as a secondary treatment for bacterial and viral infections and to increase resistance against diseases such as Gumboro in poultry."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Relieves pain and reduces fever</li>
              <li>Increases resistance against bacterial and viral diseases</li>
              <li>Reduces stress reaction caused by vaccinations</li>
              <li>Attenuates mortality caused by temperature</li>
              <li>Supports recovery after stress and fatigue</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <ul>
              <li><strong>Poultry:</strong> 500 gm per 1000 litres of drinking water for 3–5 days</li>
              <li><strong>Cattle:</strong> 8 g per animal, per day</li>
              <li><strong>Calves:</strong> 2 g per animal, per day</li>
              <li><strong>Pigs:</strong> 150 g per 1,000 litres of drinking water</li>
            </ul>
          ),
        },
        {
          title: 'Packing',
          content: <p>Available in 500 gm jars. Form: Powder — Code: AKS040</p>,
        },
      ]}
      relatedProducts={getRelatedProducts('antistrs-300')}
    />
  );
}
