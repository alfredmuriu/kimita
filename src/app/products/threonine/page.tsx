import ProductPageLayout from '@/components/ProductPageLayout';

export default function ThreonineProduct() {
  return (
    <ProductPageLayout
      productName="THREONINE 65%"
      productImage="/products/therionine.png"
      productImageAlt="THREONINE 65% essential amino acid supplement for poultry and livestock"
      description="Threonine is a crucial component of a healthy diet and plays an important role in maintaining optimal health and wellness. Since it cannot be produced by the body, it is important to obtain enough Threonine through the diet or supplementation to meet the body's needs as an energy source. Threonine is the third limiting essential amino acid after Methionine and Lysine in corn-soybean based diets of broilers."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Essential amino acid that cannot be produced by the body</li>
              <li>Crucial for maintaining optimal health and wellness</li>
              <li>Third limiting essential amino acid in broiler diets</li>
              <li>Supports protein synthesis and overall growth</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <ul>
              <li><strong>Poultry:</strong> 1 ml per 6 litres of drinking water</li>
            </ul>
          ),
        },
        {
          title: 'Packing',
          content: <p>Available in 1L bottles. Form: Liquid — 65%</p>,
        },
      ]}
    />
  );
}
