import ProductPageLayout from '@/components/ProductPageLayout';

export default function Optimum24Product() {
  return (
    <ProductPageLayout
      productName="OPTIMUM24"
      productImage="/products/Optimum-24.png"
      productImageAlt="OPTIMUM24 nutritional feed supplement to relieve heat stress in poultry and livestock"
      description="OPTIMUM24 is a nutritional feed supplement formulated to relieve symptoms and health problems associated with heat stress. It reduces mortality and productivity losses in animals suffering from heat stress due to high ambient temperatures and high relative humidity. Paracetamol provides symptomatic treatment of fever in the context of respiratory diseases in combination with appropriate anti-infective therapy."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Reduces mortality and productivity losses from heat stress</li>
              <li>Betaine prevents dehydration and retains water in gut mucosal cells</li>
              <li>Vitamin C relieves heat stress symptoms and health problems</li>
              <li>Antipyretic — reduces high temperature</li>
              <li>Used as painkiller and for colic</li>
              <li>Improves nutrient absorption</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <ul>
              <li><strong>Poultry:</strong> 250 gm per 1000 litres of drinking water for 3–5 days</li>
              <li><strong>Calves, Goats, Sheep, Cattle &amp; Horse:</strong> 1 gm per 50 kg bodyweight for 3–5 days</li>
            </ul>
          ),
        },
        {
          title: 'Packing',
          content: <p>Available in 500 gm and 1 KG jars. Form: Powder — Code: AKF41</p>,
        },
      ]}
    />
  );
}
