import ProductPageLayout from '@/components/ProductPageLayout';

export default function Optimum24Product() {
  return (
    <ProductPageLayout
      productName="OPTIMUM-24"
      productImage="/products/Optimum-24.png"
      productImageAlt="OPTIMUM-24 energy booster poultry performance enhancer broiler production Kenya"
      description="OPTIMUM-24 is a 24-hour energy and performance booster that provides sustained support for animals during periods of high demand. This advanced formulation ensures optimal productivity by delivering essential nutrients around the clock. Perfect for peak production periods, hot weather, and challenging conditions. Trusted by farmers across Kenya and East Africa for maximum poultry performance."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Provides 24-hour energy support</li>
              <li>Boosts overall performance</li>
              <li>Maintains productivity during stress</li>
              <li>Improves feed conversion</li>
              <li>Supports peak egg production</li>
              <li>Enhances broiler weight gain</li>
              <li>Reduces production dips</li>
              <li>Suitable for all production stages</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <><p><strong>For Performance Boost:</strong></p><ul><li>Mix 1ml per 1 liter of drinking water</li><li>Administer continuously during high-demand periods</li></ul><p><strong>For Peak Production:</strong></p><ul><li>Mix 1ml per 2 liters of drinking water</li><li>Use daily during production peak</li></ul><p className="note">Note: Ensure adequate water intake. Store in a cool, dry place.</p></>
          ),
        },
        {
          title: 'Indication',
          content: (
            <ul>
              <li>Low energy and poor performance during peak production</li>
              <li>Production drops during hot weather or stress</li>
              <li>Poor feed conversion in broilers and layers</li>
              <li>Decreased egg production during peak laying</li>
              <li>General performance decline in all production stages</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
