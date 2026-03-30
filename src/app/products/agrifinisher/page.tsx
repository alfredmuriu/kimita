import ProductPageLayout from '@/components/ProductPageLayout';

export default function AgrifinisherProduct() {
  return (
    <ProductPageLayout
      productName="AGRIFINISHER"
      productImage="/products/agrifinisher.png"
      productImageAlt="AGRIFINISHER broiler finisher feed additive weight gain meat production Kenya"
      description="AGRIFINISHER is a premium broiler finisher feed additive specifically formulated to maximize weight gain and meat quality during the final growth phase. This comprehensive formula provides optimal nutrition for finishing broilers, enhancing feed conversion and promoting superior carcass quality. Designed for the critical 28-42 day period. Trusted by farmers across Kenya and East Africa for premium broiler production."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Maximizes final weight gain</li>
              <li>Improves feed conversion ratio</li>
              <li>Enhances meat quality and texture</li>
              <li>Promotes uniform flock finishing</li>
              <li>Supports optimal carcass yield</li>
              <li>Reduces finishing period mortality</li>
              <li>Improves breast meat development</li>
              <li>Cost-effective finishing solution</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <><p><strong>For Broiler Finishers (28-42 days):</strong></p><ul><li>Mix 2.5-5kg per ton of feed</li><li>Use continuously through finishing phase</li></ul><p><strong>For Extended Finishing:</strong></p><ul><li>Mix 3-5kg per ton of feed</li><li>Adjust based on target market weight</li></ul><p className="note">Note: Ensure clean water access. Store in a cool, dry place away from sunlight.</p></>
          ),
        },
        {
          title: 'Indication',
          content: (
            <ul>
              <li>Poor weight gain in finishing broilers</li>
              <li>Low feed conversion during the 28-42 day growth phase</li>
              <li>Uneven flock finishing and poor carcass uniformity</li>
              <li>Suboptimal meat quality and breast development</li>
              <li>High finishing period mortality</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
