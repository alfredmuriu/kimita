import ProductPageLayout from '@/components/ProductPageLayout';

export default function BetaineProduct() {
  return (
    <ProductPageLayout
      productName="BETAINE 50%"
      productImage="/products/betaine.png"
      productImageAlt="BETAINE 50% liquid feed supplement for feed absorption and heat stress in poultry"
      description="Betaine liquid is used as an animal feed supplement which increases the feed absorption efficiency in the animals' digestion system. This helps to optimize nutrient digestibility and reduce their excretion. The addition of betaine supplementation has resulted in improvement in bodyweight, breast meat yield, feed conversion, and decreased abdominal fat pad weights. Betaine has also been shown to assist birds under heat stress conditions — the impact of severe heat stress can partially be overcome by adding betaine."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Increases feed absorption efficiency in the digestive system</li>
              <li>Optimizes nutrient digestibility and reduces excretion</li>
              <li>Improves bodyweight and breast meat yield</li>
              <li>Improves feed conversion ratio</li>
              <li>Decreases abdominal fat pad weights</li>
              <li>Assists birds under heat stress conditions</li>
              <li>Promotes health and growth for animals</li>
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
          content: <p>Available in 1L bottles. Form: Liquid</p>,
        },
      ]}
    />
  );
}
