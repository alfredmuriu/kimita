import ProductPageLayout from '@/components/ProductPageLayout';

export default function AdviceProduct() {
  return (
    <ProductPageLayout
      productName="ADVICE"
      productImage="/images/folio/advice.png"
      productImageAlt="ADVICE natural treatment for Newcastle disease and viral infections in poultry in Kenya and Africa"
      description="ADVICE is a premium natural additive formulated to be mixed with drinking water for poultry and livestock. Produced with carefully selected natural extracts including Cinnamon, Garlic, Echinacea, Astragalus, Aloe vera, and citric compounds, plus Lectin and Amantadine. This powerful formulation effectively treats and prevents virus diseases including common cold, influenza, Newcastle disease (ND), infectious bronchitis, and other respiratory viral infections. Trusted by farmers across Kenya and East Africa for reliable disease control without antibiotics."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Treats and prevents Newcastle disease (ND) naturally</li>
              <li>Effective against infectious bronchitis and respiratory viruses</li>
              <li>Boosts natural immunity in poultry</li>
              <li>Reduces mortality during disease outbreaks</li>
              <li>Safe antibiotic alternative for viral infections</li>
              <li>Supports faster recovery after illness</li>
              <li>Easy administration through drinking water</li>
              <li>Suitable for layers, broilers, and indigenous chickens</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <><p><strong>For Prevention:</strong></p><ul><li>Mix 1ml per 1 liter of drinking water</li><li>Administer for 3-5 consecutive days</li><li>Repeat monthly or during stress periods</li></ul><p><strong>For Treatment:</strong></p><ul><li>Mix 2ml per 1 liter of drinking water</li><li>Administer for 5-7 consecutive days</li><li>Continue until symptoms subside</li></ul><p className="note">Note: Consult with a veterinarian for severe cases. Store in a cool, dry place away from direct sunlight.</p></>
          ),
        },
        {
          title: 'Indication',
          content: (
            <ul>
              <li>Newcastle disease (ND) in poultry</li>
              <li>Infectious bronchitis and respiratory viral infections</li>
              <li>Common cold and influenza in chickens</li>
              <li>Post-vaccination immune support</li>
              <li>General viral disease prevention in layers, broilers, and indigenous chickens</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
