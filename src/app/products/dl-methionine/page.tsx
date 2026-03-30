import ProductPageLayout from '@/components/ProductPageLayout';

export default function DLMethionineProduct() {
  return (
    <ProductPageLayout
      productName="DL-METHIONINE"
      productImage="/products/Dl-Methionine.png"
      productImageAlt="DL-METHIONINE amino acid feather development poultry growth supplement Kenya"
      description="DL-Methionine is an essential amino acid critical for protein synthesis, feather development in poultry, and optimal liver function. This vital nutrient supports healthy growth, improves feed conversion, and is the first limiting amino acid in poultry nutrition. Trusted by farmers across Kenya and East Africa for amino acid supplementation and improved production performance."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Essential for protein synthesis</li>
              <li>Promotes healthy feather development</li>
              <li>Supports optimal liver function</li>
              <li>Improves feed conversion ratio</li>
              <li>Enhances growth performance</li>
              <li>First limiting amino acid in poultry</li>
              <li>Supports egg production</li>
              <li>Essential for all poultry diets</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <><p><strong>For Broilers:</strong></p><ul><li>Mix 1-2.5kg per ton of feed</li><li>Higher rates for starter diets</li></ul><p><strong>For Layers:</strong></p><ul><li>Mix 1-1.5kg per ton of feed</li><li>Adjust based on production stage</li></ul><p className="note">Note: Consult nutritionist for precise formulation. Store in a dry, cool place.</p></>
          ),
        },
        {
          title: 'Indication',
          content: (
            <ul>
              <li>Methionine deficiency in poultry diets</li>
              <li>Poor feather development and feather picking</li>
              <li>Liver dysfunction and poor protein metabolism</li>
              <li>Low growth rate and poor feed conversion</li>
              <li>Reduced egg production from amino acid imbalance</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
