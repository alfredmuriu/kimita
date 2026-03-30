import ProductPageLayout from '@/components/ProductPageLayout';

export default function GonatProduct() {
  return (
    <ProductPageLayout
      productName="GONAT"
      productImage="/products/gonat.png"
      productImageAlt="GONAT garlic onion extract poultry immunity booster natural supplement Kenya"
      description="GONAT is a unique immune-boosting oral supplement derived from garlic and onion extracts. This liquid formulation is specially created to strengthen animals\' natural defenses against disease while promoting better overall performance. The powerful combination of allicin and quercetin provides natural antimicrobial and antioxidant properties. Trusted by farmers across Kenya and East Africa for natural immunity enhancement."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Strengthens natural immune defenses</li>
              <li>Natural antimicrobial properties</li>
              <li>Powerful antioxidant protection</li>
              <li>Improves overall animal performance</li>
              <li>Supports respiratory health</li>
              <li>Enhances disease resistance</li>
              <li>Promotes healthy gut flora</li>
              <li>Safe for all poultry types</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <><p><strong>For Prevention:</strong></p><ul><li>Mix 0.5ml per 1 liter of drinking water</li><li>Administer for 3-5 days weekly</li></ul><p><strong>For Immune Boosting:</strong></p><ul><li>Mix 1ml per 1 liter of drinking water</li><li>Administer during stress periods</li><li>Use before and after vaccination</li></ul><p className="note">Note: Store in a cool, dry place. Shake well before use.</p></>
          ),
        },
        {
          title: 'Indication',
          content: (
            <ul>
              <li>Weakened immune system in poultry</li>
              <li>Respiratory infections and disease susceptibility</li>
              <li>Microbial gut infections</li>
              <li>Pre and post-vaccination immune support</li>
              <li>General disease prevention in all poultry types</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
