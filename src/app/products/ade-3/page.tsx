import ProductPageLayout from '@/components/ProductPageLayout';

export default function ADE3Product() {
  return (
    <ProductPageLayout
      productName="AD3E 100/20/20"
      productImage="/products/AD3E.png"
      productImageAlt="AD3E 100/20/20 vitamins A, D3 and E supplement for poultry and livestock"
      description="AD3E 100/20/20 is effective for vitamin deficiencies in farm animals, for growth rate promotion, enhancement of performance and feed efficiency. It is indicated for Vitamin E and/or Selenium deficiency, encephalomalacia (Crazy Chick Disease), muscular dystrophy (White Muscle Disease, Stiff Lamb Disease), exudative diathesis (Generalised Oedematous Condition), and decreased hatchability of egg production."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Prevention of vitamin insufficiencies in poultry</li>
              <li>Strengthens resistance to diseases</li>
              <li>Improvement of egg production and hatchability</li>
              <li>Promotion of growth rates and improves feed efficiency</li>
              <li>Helps for weakness and lack of growth in animals</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <>
              <ul>
                <li><strong>Poultry:</strong> 1 ml per 4 litres of drinking water or as advised by a veterinarian</li>
                <li><strong>Horses, cattle:</strong> 5–10 ml per animal during 2–3 days</li>
                <li><strong>Foals, calves:</strong> 5 ml per animal during 2–3 days</li>
                <li><strong>Pigs, sheep, goats:</strong> 2–3 ml per animal during 2–3 days</li>
              </ul>
              <p>Medicated drinking water should be used within 24 hours.</p>
            </>
          ),
        },
        {
          title: 'Packing',
          content: <p>Available in 1L bottles and 5L cans. Form: Liquid — Code: AKS43</p>,
        },
      ]}
    />
  );
}
