import ProductPageLayout from '@/components/ProductPageLayout';

export default function BetaineProduct() {
  return (
    <ProductPageLayout
      productName="BETAINE"
      productImage="/products/betaine.png"
      productImageAlt="BETAINE heat stress relief poultry feed efficiency liver health Kenya"
      description="Betaine is a natural compound that improves nutrient utilization, supports liver health, and helps animals cope with heat stress. This versatile feed additive enhances feed efficiency and promotes consistent performance under challenging conditions. An essential supplement for hot climate farming. Trusted by farmers across Kenya and East Africa for heat stress management and improved production."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Helps animals cope with heat stress</li>
              <li>Improves nutrient utilization</li>
              <li>Supports liver health and function</li>
              <li>Enhances feed efficiency</li>
              <li>Maintains consistent performance</li>
              <li>Acts as osmolyte for cell protection</li>
              <li>Reduces methionine requirement</li>
              <li>Suitable for all poultry and livestock</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <><p><strong>For Regular Use:</strong></p><ul><li>Mix 0.5-1kg per ton of feed</li><li>Use continuously in feed</li></ul><p><strong>During Heat Stress:</strong></p><ul><li>Mix 1-1.5kg per ton of feed</li><li>Increase during hot seasons</li></ul><p className="note">Note: Best added during feed formulation. Store in a cool, dry place.</p></>
          ),
        },
        {
          title: 'Indication',
          content: (
            <ul>
              <li>Heat stress in poultry and livestock</li>
              <li>Poor nutrient utilization and feed efficiency</li>
              <li>Liver health concerns and fatty liver risk</li>
              <li>Reduced performance in hot climates</li>
              <li>High methionine requirement in diets</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
