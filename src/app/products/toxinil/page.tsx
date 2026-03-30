import ProductPageLayout from '@/components/ProductPageLayout';

export default function ToxinilProduct() {
  return (
    <ProductPageLayout
      productName="TOXINIL"
      productImage="/products/toxinil.png"
      productImageAlt="TOXINIL mycotoxin binder aflatoxin prevention poultry feed safety Kenya"
      description="TOXINIL is a comprehensive toxin binder that effectively neutralizes mycotoxins and other harmful substances in feed. This powerful formulation protects animal health and enhances productivity by preventing the damaging effects of aflatoxins, ochratoxins, and other feed contaminants. Trusted by farmers across Kenya and East Africa for complete mycotoxin management and feed safety."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Binds and neutralizes aflatoxins</li>
              <li>Protects against ochratoxins</li>
              <li>Prevents mycotoxin absorption</li>
              <li>Protects liver function</li>
              <li>Maintains animal productivity</li>
              <li>Improves feed conversion</li>
              <li>Safe for continuous use</li>
              <li>Suitable for all poultry and livestock</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <><p><strong>For Prevention:</strong></p><ul><li>Mix 0.5-1kg per ton of feed</li><li>Use continuously in feed</li></ul><p><strong>For High Contamination:</strong></p><ul><li>Mix 1-2kg per ton of feed</li><li>Increase during rainy season</li></ul><p className="note">Note: Best results when added during feed mixing. Store in a dry place.</p></>
          ),
        },
        {
          title: 'Indication',
          content: (
            <ul>
              <li>Mycotoxin contamination in animal feed</li>
              <li>Aflatoxin and ochratoxin exposure</li>
              <li>Liver damage from toxin ingestion</li>
              <li>Reduced productivity due to feed contaminants</li>
              <li>Feed safety management during humid/rainy seasons</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
