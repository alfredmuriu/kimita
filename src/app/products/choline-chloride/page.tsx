import ProductPageLayout from '@/components/ProductPageLayout';

export default function CholineChlorideProduct() {
  return (
    <ProductPageLayout
      productName="CHOLINE CHLORIDE"
      productImage="/products/chlorine-chloride.png"
      productImageAlt="CHOLINE CHLORIDE fatty liver prevention egg production poultry supplement Kenya"
      description="Choline Chloride is essential for fat metabolism, liver function, and nerve transmission in animals. This vital nutrient prevents fatty liver disease and supports optimal growth and egg production. An indispensable component of modern poultry nutrition. Trusted by farmers across Kenya and East Africa for liver health and enhanced production performance."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Prevents fatty liver disease</li>
              <li>Essential for fat metabolism</li>
              <li>Supports liver function</li>
              <li>Improves nerve transmission</li>
              <li>Enhances egg production</li>
              <li>Supports optimal growth</li>
              <li>Improves feed conversion</li>
              <li>Essential for all poultry diets</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <><p><strong>For Layers:</strong></p><ul><li>Mix 0.5-1kg per ton of feed</li><li>Use continuously throughout production</li></ul><p><strong>For Broilers:</strong></p><ul><li>Mix 0.75-1.5kg per ton of feed</li><li>Higher rates for rapid growth phase</li></ul><p className="note">Note: Adjust based on other choline sources in diet. Store in a dry place.</p></>
          ),
        },
        {
          title: 'Indication',
          content: (
            <ul>
              <li>Fatty liver disease (hepatic lipidosis) in poultry</li>
              <li>Poor fat metabolism and liver dysfunction</li>
              <li>Low egg production in layers</li>
              <li>Nerve transmission problems</li>
              <li>Choline deficiency in poultry diets</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
