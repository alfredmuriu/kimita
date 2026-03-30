import ProductPageLayout from '@/components/ProductPageLayout';

export default function Mix5Product() {
  return (
    <ProductPageLayout
      productName="MIX-5"
      productImage="/products/mix.png"
      productImageAlt="MIX-5 respiratory disease treatment for poultry infectious bronchitis Kenya"
      description="MIX-5 is a powerful respiratory relief formula recommended for prevention and treatment of respiratory problems of different etiology in poultry. This advanced formulation effectively reduces undesirable effects of post-vaccination reactions, diminishes contamination in drinking water, and alleviates heat stress. Trusted by farmers across Kenya and East Africa for reliable respiratory disease control."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Relieves respiratory symptoms in poultry</li>
              <li>Prevents and treats respiratory problems of different etiology</li>
              <li>Reduces post-vaccination reaction effects</li>
              <li>Diminishes drinking water contamination</li>
              <li>Alleviates heat stress symptoms</li>
              <li>Supports faster recovery from respiratory infections</li>
              <li>Safe for layers, broilers, and indigenous chickens</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <><p><strong>For Prevention:</strong></p><ul><li>Mix 0.5ml per 1 liter of drinking water</li><li>Administer for 3-5 consecutive days</li><li>Repeat during stress periods or post-vaccination</li></ul><p><strong>For Treatment:</strong></p><ul><li>Mix 1ml per 1 liter of drinking water</li><li>Administer for 5-7 consecutive days</li><li>Continue until symptoms improve</li></ul><p className="note">Note: Consult with a veterinarian for severe cases. Store in a cool, dry place away from direct sunlight.</p></>
          ),
        },
        {
          title: 'Indication',
          content: (
            <ul>
              <li>Respiratory infections in poultry (bronchitis, sneezing, gasping)</li>
              <li>Post-vaccination respiratory reactions</li>
              <li>Water contamination-related respiratory issues</li>
              <li>Heat stress-induced respiratory distress</li>
              <li>Chronic respiratory disease (CRD) in chickens</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
