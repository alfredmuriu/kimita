import ProductPageLayout from '@/components/ProductPageLayout';

export default function RecoverProduct() {
  return (
    <ProductPageLayout
      productName="RE-COVER"
      productImage="/products/re-cover.png"
      productImageAlt="RE-COVER disease recovery supplement poultry livestock rapid healing Kenya"
      description="RE-COVER is a specialized recovery formula designed to help animals bounce back quickly from disease, stress, or treatment. This powerful formulation restores energy levels, replenishes essential nutrients, and promotes rapid recovery. Ideal for use after illness, antibiotic treatment, or any stressful event. Trusted by farmers across Kenya and East Africa for fast and effective recovery support."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Promotes rapid recovery from illness</li>
              <li>Restores energy and vitality</li>
              <li>Replenishes lost electrolytes</li>
              <li>Supports gut health after antibiotics</li>
              <li>Stimulates appetite</li>
              <li>Reduces recovery time</li>
              <li>Minimizes production losses</li>
              <li>Suitable for all poultry and livestock</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <><p><strong>Post-Disease Recovery:</strong></p><ul><li>Mix 2ml per 1 liter of drinking water</li><li>Administer for 5-7 consecutive days</li></ul><p><strong>Post-Antibiotic Treatment:</strong></p><ul><li>Mix 1ml per 1 liter of drinking water</li><li>Administer for 3-5 days after treatment</li></ul><p className="note">Note: Ensure clean, fresh water is available. Store in a cool place.</p></>
          ),
        },
        {
          title: 'Indication',
          content: (
            <ul>
              <li>Post-disease recovery in poultry and livestock</li>
              <li>Gut health restoration after antibiotic treatment</li>
              <li>Electrolyte imbalance and dehydration after illness</li>
              <li>Appetite loss and weight drop after stress or disease</li>
              <li>General convalescence support for all animals</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
