import { Metadata } from 'next';
import ProductPageLayout from '@/components/ProductPageLayout';

export const metadata: Metadata = {
  title: 'DL-METHIONINE Feed Grade 84% — Essential Amino Acid Supplement | Agrikima',
  description: 'DL-Methionine 84% facilitates efficient production of high-quality poultry meat, reduces nitrogen excretion, and corrects amino acid deficiencies in all farm animal diets.',
  alternates: { canonical: 'https://www.agrikima.co.ke/products/dl-methionine' },
  openGraph: {
    title: 'DL-METHIONINE Feed Grade 84% — Essential Amino Acid Supplement | Agrikima',
    description: 'DL-Methionine 84% facilitates efficient production of high-quality poultry meat, reduces nitrogen excretion, and corrects amino acid deficiencies in all farm animal diets.',
    url: 'https://www.agrikima.co.ke/products/dl-methionine',
    siteName: 'Agrikima',
  },
};

export default function DLMethionineProduct() {
  return (
    <ProductPageLayout
      productName="DL-METHIONINE"
      productImage="/products/Dl-Methionine.png"
      productImageAlt="DL-METHIONINE Feed Grade 84% amino acid supplement for poultry"
      description="DL-Methionine is an essential amino acid that serves as a nutrient facilitating the efficient production of high-quality chick meat. It also reduces the amount of nitrogen excreted by the livestock. Methionine plays an important role in metabolism and is used as an additive in cases of lack of amino acids for all farm animals. Due to its high flowability and good mixability, this preparation is easy to use, safe to handle, and can be used at any stage."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Facilitates efficient production of high-quality chick meat</li>
              <li>Reduces nitrogen excreted by livestock</li>
              <li>Increases egg production</li>
              <li>Increases weight in broilers</li>
              <li>Easy to use due to high flowability and good mixability</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <ul>
              <li><strong>Poultry:</strong> 1 ml per 4 litres of drinking water</li>
            </ul>
          ),
        },
        {
          title: 'Packing',
          content: <p>Available in 1L bottles. Form: Liquid — Feed Grade 84%</p>,
        },
      ]}
    />
  );
}
