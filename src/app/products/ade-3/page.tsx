import ProductPageLayout from '@/components/ProductPageLayout';

export default function ADE3Product() {
  return (
    <ProductPageLayout
      productName="ADE-3"
      productImage="/products/AD3E.png"
      productImageAlt="ADE-3 poultry vitamins A D3 E for egg production hatchability Kenya"
      description="ADE-3 is a premium vitamin supplement effective for treating vitamin deficiencies in farm animals. This powerful formulation promotes growth rate, enhances performance, and improves feed efficiency. ADE-3 supports poultry health by preventing vitamin deficiencies, boosting disease resistance, and improving egg production and hatchability. Trusted by farmers across Kenya and East Africa for optimal poultry nutrition."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Promotes optimal growth rate</li>
              <li>Enhances overall animal performance</li>
              <li>Improves feed efficiency</li>
              <li>Boosts disease resistance</li>
              <li>Improves egg production in layers</li>
              <li>Enhances hatchability rates</li>
              <li>Supports bone development</li>
              <li>Prevents vitamin deficiency symptoms</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <>
              <p><strong>For Maintenance:</strong></p>
              <ul>
                <li>Mix 0.5ml per 1 liter of drinking water</li>
                <li>Administer for 3-5 days monthly</li>
              </ul>
              <p><strong>For Deficiency Treatment:</strong></p>
              <ul>
                <li>Mix 1ml per 1 liter of drinking water</li>
                <li>Administer for 5-7 consecutive days</li>
              </ul>
              <p className="note">Note: Store in a cool, dark place. Protect from direct sunlight.</p>
            </>
          ),
        },
        {
          title: 'Indication',
          content: (
            <ul>
              <li>Vitamin A, D3, and E deficiencies in poultry and livestock</li>
              <li>Poor egg production and low hatchability in layers</li>
              <li>Weak bone development and rickets</li>
              <li>Reduced growth rate and poor feed conversion</li>
              <li>Lowered disease resistance and immunity</li>
              <li>Post-vaccination stress recovery</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
