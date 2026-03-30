import ProductPageLayout from '@/components/ProductPageLayout';

export default function ThreonineProduct() {
  return (
    <ProductPageLayout
      productName="THREONINE"
      productImage="/products/therionine.png"
      productImageAlt="THREONINE amino acid poultry gut health immune function supplement Kenya"
      description="Threonine is an essential amino acid that supports immune function, intestinal health, and protein balance in livestock. This vital nutrient enhances nutrient absorption, promotes gut integrity, and contributes to overall animal welfare. Essential for optimal growth and production. Trusted by farmers across Kenya and East Africa for amino acid supplementation."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Supports immune system function</li>
              <li>Promotes intestinal health</li>
              <li>Enhances gut barrier integrity</li>
              <li>Improves protein balance</li>
              <li>Enhances nutrient absorption</li>
              <li>Supports mucin production</li>
              <li>Improves feed conversion</li>
              <li>Essential for optimal growth</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <><p><strong>For Poultry:</strong></p><ul><li>Mix 0.5-1kg per ton of feed</li><li>Adjust based on diet formulation</li></ul><p><strong>For Swine:</strong></p><ul><li>Mix 1-2kg per ton of feed</li><li>Based on growth stage requirements</li></ul><p className="note">Note: Consult nutritionist for precise inclusion rates. Store in a dry place.</p></>
          ),
        },
        {
          title: 'Indication',
          content: (
            <ul>
              <li>Threonine deficiency in poultry and swine diets</li>
              <li>Poor gut health and intestinal integrity</li>
              <li>Weakened immune function</li>
              <li>Low mucin production and poor gut barrier</li>
              <li>Suboptimal growth and feed conversion</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
