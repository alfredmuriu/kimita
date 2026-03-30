import ProductPageLayout from '@/components/ProductPageLayout';

export default function ImmusolProduct() {
  return (
    <ProductPageLayout
      productName="IMMUSOL"
      productImage="/products/immusol.png"
      productImageAlt="IMMUSOL poultry immunity booster Gumboro Newcastle disease prevention Kenya"
      description="IMMUSOL contains a powerful combination of mixed extracts from medicinal plants specifically formulated for immunomodulatory response against Newcastle Disease (ND), Infectious Bronchitis (IB), and Infectious Bursal Disease (IBD/Gumboro). This natural formula also helps reduce coccidial oocyst burden without affecting broiler growth. Trusted by farmers across Kenya and East Africa for natural disease prevention and immunity boosting."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Boosts natural immunity against Newcastle Disease (ND)</li>
              <li>Provides protection against Infectious Bronchitis (IB)</li>
              <li>Enhances resistance to Gumboro/IBD</li>
              <li>Reduces coccidial oocyst burden naturally</li>
              <li>Does not affect broiler growth performance</li>
              <li>Supports post-vaccination immunity</li>
              <li>Natural alternative to synthetic immunostimulants</li>
              <li>Suitable for all poultry ages</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <><p><strong>For Prevention:</strong></p><ul><li>Mix 1ml per 2 liters of drinking water</li><li>Administer for 5 consecutive days</li><li>Repeat every 2-3 weeks</li></ul><p><strong>During Disease Outbreaks:</strong></p><ul><li>Mix 1ml per 1 liter of drinking water</li><li>Administer for 7-10 consecutive days</li></ul><p className="note">Note: Best used in combination with proper vaccination program. Consult a veterinarian for severe outbreaks.</p></>
          ),
        },
        {
          title: 'Indication',
          content: (
            <ul>
              <li>Newcastle Disease (ND) prevention and immune support</li>
              <li>Infectious Bronchitis (IB) protection</li>
              <li>Infectious Bursal Disease (IBD/Gumboro) resistance</li>
              <li>Coccidiosis oocyst burden reduction</li>
              <li>General immunomodulatory support for all poultry ages</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
