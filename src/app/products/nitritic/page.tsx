import { Metadata } from 'next';
import ProductPageLayout from '@/components/ProductPageLayout';
import { getRelatedProducts } from '@/lib/related-products';

export const metadata: Metadata = {
  title: 'NUTRITIC — Garlic Extract & Yeast Culture Natural Feed Additive | Agrikima',
  description: 'NUTRITIC combines garlic extract and Saccharomyces Cerevisiae yeast culture for antimicrobial action against E. coli and Salmonella, improved gut health, and enhanced feed intake.',
  alternates: { canonical: 'https://www.agrikima.co.ke/products/nitritic' },
  openGraph: {
    title: 'NUTRITIC — Garlic Extract & Yeast Culture Natural Feed Additive | Agrikima',
    description: 'NUTRITIC combines garlic extract and Saccharomyces Cerevisiae yeast culture for antimicrobial action against E. coli and Salmonella, improved gut health, and enhanced feed intake.',
    url: 'https://www.agrikima.co.ke/products/nitritic',
    siteName: 'Agrikima',
  },
};

export default function NitriticProduct() {
  return (
    <ProductPageLayout
      productName="NUTRITIC"
      productImage="/products/nitritic.png"
      productImageAlt="NUTRITIC natural feed additives with garlic extract and yeast culture for poultry and livestock"
      description="NUTRITIC is a quality natural feed additive formulated with Garlic Extracts and Saccharomyces Cerevisiae (Yeast Culture). Allicin of Garlic Extract has strong sterilizing, antimicrobial, and antiviral actions and helps in blood circulation. It stimulates gastric mucosa, resulting in promotion of gastric secretion and intestinal regulation. Yeast Culture increases feed intake with its unique flavor, supplies rich amino acids, vitamins, and minerals, and improves intestinal environment and probiotic flora."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Restricts and kills harmful germs — E. coli, Salmonella, Staphylococcus aureus, and dysentery bacillus</li>
              <li>Detoxifies heavy metals such as mercury, cyanide, and nitrite</li>
              <li>Improves animal health — brighter fur, better illness resistance, increased survival rate</li>
              <li>Stimulates appetite through the aromatic of garlic</li>
              <li>Improves gastric juice secretion and intestinal regulation</li>
              <li>Resists molds and kills flies and maggots efficiently</li>
              <li>Effective antibiotic refill and best additive for antibiotic-free fodder</li>
              <li>Improves fertility and hatchability in breeders, increases egg production, reduces post-antibiotic stress</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <ul>
              <li><strong>Poultry:</strong> 500 gm per ton of feed or as advised by a veterinarian</li>
              <li><strong>Horse and livestock:</strong> 20 gm mixed into the daily feed</li>
            </ul>
          ),
        },
        {
          title: 'Packing',
          content: <p>Available in 25 KG pails. Form: Powder — Code: AKF007</p>,
        },
      ]}
      relatedProducts={getRelatedProducts('nitritic')}
    />
  );
}
