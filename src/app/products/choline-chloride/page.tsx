import { Metadata } from 'next';
import ProductPageLayout from '@/components/ProductPageLayout';

export const metadata: Metadata = {
  title: 'CHOLINE CHLORIDE 70% — Liver Health & Growth Rate Feed Additive | Agrikima',
  description: 'Choline Chloride 70% increases growth rate, strengthens immunity, reduces fatty liver syndrome, improves egg quality, and ensures proper nutrient metabolism in poultry.',
  alternates: { canonical: 'https://www.agrikima.co.ke/products/choline-chloride' },
  openGraph: {
    title: 'CHOLINE CHLORIDE 70% — Liver Health & Growth Rate Feed Additive | Agrikima',
    description: 'Choline Chloride 70% increases growth rate, strengthens immunity, reduces fatty liver syndrome, improves egg quality, and ensures proper nutrient metabolism in poultry.',
    url: 'https://www.agrikima.co.ke/products/choline-chloride',
    siteName: 'Agrikima',
  },
};

export default function CholineChlorideProduct() {
  return (
    <ProductPageLayout
      productName="CHOLINE CHLORIDE 70%"
      productImage="/products/chlorine-chloride.png"
      productImageAlt="CHOLINE CHLORIDE 70% feed additive to increase growth rate and reduce fatty liver syndrome"
      description="Choline Chloride plays a significant role in nutrition and is used in the feed to increase growth rate, strengthen immunity, and reduce fatty liver syndrome of poultry. Choline Chloride supports the immune system of animals. It is also known for its ability to increase fertility, accelerate weight gain, and improve the quality of litter eggs. Choline prevents abnormal storage of fat in the liver, which ensures proper body metabolism and efficient utilization of nutrients."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Increases growth rate</li>
              <li>Strengthens immunity</li>
              <li>Reduces fatty liver syndrome in poultry</li>
              <li>Increases fertility</li>
              <li>Accelerates weight gain</li>
              <li>Improves the quality of litter eggs</li>
              <li>Prevents abnormal storage of fat in the liver</li>
              <li>Ensures proper body metabolism and nutrient utilization</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <ul>
              <li><strong>Poultry:</strong> 1 ml per 8 litres of drinking water</li>
            </ul>
          ),
        },
        {
          title: 'Packing',
          content: <p>Available in 1L bottles. Form: Liquid — 70%</p>,
        },
      ]}
    />
  );
}
