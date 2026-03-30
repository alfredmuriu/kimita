import ProductPageLayout from '@/components/ProductPageLayout';

export default function AgritoxinilstopProduct() {
  return (
    <ProductPageLayout
      productName="AGRITOXINILSTOP"
      productImage="/products/agritoxinil.png"
      productImageAlt="AGRITOXINILSTOP mycotoxin binder aflatoxin prevention feed safety poultry Kenya"
      description="AGRITOXINILSTOP is a powerful mycotoxin binder formulated to protect livestock from the harmful effects of mycotoxins in contaminated feed. This comprehensive formulation effectively binds aflatoxins, ochratoxins, and other toxic compounds, improving animal health and performance. Essential for feed safety in tropical climates. Trusted by farmers across Kenya and East Africa for complete mycotoxin management."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Binds multiple mycotoxin types</li>
              <li>Prevents aflatoxin absorption</li>
              <li>Protects liver function</li>
              <li>Maintains animal performance</li>
              <li>Reduces mycotoxicosis risk</li>
              <li>Improves feed safety</li>
              <li>Supports immune function</li>
              <li>Suitable for all livestock</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <><p><strong>For Prevention:</strong></p><ul><li>Mix 1kg per ton of feed</li><li>Use continuously in all feeds</li></ul><p><strong>For High Contamination:</strong></p><ul><li>Mix 2kg per ton of feed</li><li>Increase during rainy/humid seasons</li></ul><p className="note">Note: Add during feed mixing for best distribution. Store in a dry place.</p></>
          ),
        },
        {
          title: 'Indication',
          content: (
            <ul>
              <li>Mycotoxin contamination in animal feed</li>
              <li>Aflatoxin and ochratoxin exposure in poultry and livestock</li>
              <li>Liver damage and mycotoxicosis symptoms</li>
              <li>Reduced performance due to contaminated feed</li>
              <li>Feed safety concerns during rainy and humid seasons</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
