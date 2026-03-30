import ProductPageLayout from '@/components/ProductPageLayout';

export default function KDigestProduct() {
  return (
    <ProductPageLayout
      productName="K-DIGEST"
      productImage="/products/k-digest.png"
      productImageAlt="K-DIGEST liver health fatty liver treatment poultry digestive supplement Kenya"
      description="K-Digest is a dietetic liquid supplement formulated to correct fatty liver conditions, prevent liver dysfunctions, and correct digestive disturbances in animals. Specifically designed for animals fed lithogenic diets (high in oil, fat, cholesterol, and cholic acid), K-Digest helps manage the increased supply of free fatty acids to hepatic cells. Trusted by farmers across Kenya and East Africa for liver health management in poultry and livestock."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Corrects fatty liver conditions in poultry</li>
              <li>Prevents liver dysfunction and damage</li>
              <li>Improves digestive function</li>
              <li>Enhances fat metabolism</li>
              <li>Supports liver detoxification</li>
              <li>Improves feed conversion efficiency</li>
              <li>Reduces mortality from liver problems</li>
              <li>Suitable for layers and broilers</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <><p><strong>For Prevention:</strong></p><ul><li>Mix 0.5ml per 1 liter of drinking water</li><li>Administer for 5 consecutive days per month</li></ul><p><strong>For Treatment:</strong></p><ul><li>Mix 1ml per 1 liter of drinking water</li><li>Administer for 7-14 consecutive days</li><li>Continue until liver function improves</li></ul><p className="note">Note: Recommended for flocks on high-energy diets. Consult a veterinarian for severe liver conditions.</p></>
          ),
        },
        {
          title: 'Indication',
          content: (
            <ul>
              <li>Fatty liver syndrome (hepatic lipidosis) in poultry</li>
              <li>Liver dysfunction from high-fat diets</li>
              <li>Digestive disturbances and poor fat metabolism</li>
              <li>High mortality from liver problems</li>
              <li>Animals on lithogenic diets (high oil/fat/cholesterol)</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
