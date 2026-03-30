import ProductPageLayout from '@/components/ProductPageLayout';

export default function Antistrs300Product() {
  return (
    <ProductPageLayout
      productName="ANTISTRS-300"
      productImage="/products/antistrs-300.png"
      productImageAlt="ANTISTRS-300 anti-stress formula poultry heat stress vaccination recovery Kenya"
      description="ANTISTRS-300 is an advanced anti-stress formula that helps animals cope with environmental, nutritional, and physiological stress. This powerful formulation promotes better performance and faster recovery during challenging conditions such as heat stress, transportation, vaccination, and disease recovery. Trusted by farmers across Kenya and East Africa for comprehensive stress management in poultry."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Helps animals cope with heat stress</li>
              <li>Reduces transportation stress effects</li>
              <li>Supports post-vaccination recovery</li>
              <li>Promotes faster disease recovery</li>
              <li>Maintains production during stress</li>
              <li>Restores electrolyte balance</li>
              <li>Improves appetite during stress</li>
              <li>Suitable for all stress conditions</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <><p><strong>During Heat Stress:</strong></p><ul><li>Mix 1ml per 1 liter of drinking water</li><li>Administer during hot hours of the day</li></ul><p><strong>Post-Vaccination/Transportation:</strong></p><ul><li>Mix 1ml per 1 liter of drinking water</li><li>Administer for 2-3 days before and after event</li></ul><p className="note">Note: Increase water availability during stress periods. Store in a cool place.</p></>
          ),
        },
        {
          title: 'Indication',
          content: (
            <ul>
              <li>Heat stress in poultry during hot seasons</li>
              <li>Transportation stress and handling trauma</li>
              <li>Post-vaccination reactions and recovery</li>
              <li>Disease recovery and convalescence</li>
              <li>Electrolyte imbalance and appetite loss during stress</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
