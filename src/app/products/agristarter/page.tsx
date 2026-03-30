import ProductPageLayout from '@/components/ProductPageLayout';

export default function AgristarterProduct() {
  return (
    <ProductPageLayout
      productName="AGRISTARTER"
      productImage="/products/agristarter.png"
      productImageAlt="AGRISTARTER chick starter feed additive early growth development poultry Kenya"
      description="AGRISTARTER is a premium chick starter feed additive specially formulated for the critical first 14 days of life. This highly digestible formula provides essential nutrients for early gut development, immune system activation, and rapid initial growth. Gives your chicks the best possible start for lifelong performance. Trusted by farmers across Kenya and East Africa for reduced early mortality and vigorous chick development."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Promotes rapid early growth</li>
              <li>Develops healthy gut microbiome</li>
              <li>Strengthens immune system</li>
              <li>Reduces first-week mortality</li>
              <li>Improves nutrient absorption</li>
              <li>Supports skeletal development</li>
              <li>Ensures uniform chick growth</li>
              <li>Sets foundation for lifetime performance</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <><p><strong>For Day-Old Chicks (0-14 days):</strong></p><ul><li>Mix 3-5kg per ton of feed</li><li>Use from day one continuously</li></ul><p><strong>For Layer Chicks:</strong></p><ul><li>Mix 2.5-4kg per ton of feed</li><li>Continue for first 2-3 weeks</li></ul><p className="note">Note: Ensure clean, fresh water access. Store in a cool, dry place.</p></>
          ),
        },
        {
          title: 'Indication',
          content: (
            <ul>
              <li>High early chick mortality (first 14 days)</li>
              <li>Poor gut development and nutrient absorption in chicks</li>
              <li>Weak immune system in day-old chicks</li>
              <li>Slow initial growth and uneven chick development</li>
              <li>Insufficient skeletal development in starter phase</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
