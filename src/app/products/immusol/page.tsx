import ProductPageLayout from '@/components/ProductPageLayout';

export default function ImmusolProduct() {
  return (
    <ProductPageLayout
      productName="IMMUSOL"
      productImage="/products/immusol.png"
      productImageAlt="IMMUSOL combination of medicinal plant extracts for immunity in poultry"
      description="IMMUSOL contains a combination of mixed extracts of medicinal plants that is better for immunomodulatory response against ND, IB, and IBD, and to reduce coccidial oocysts burden without affecting the growth of broilers. Black Seed bears excellent potential as an alternative to antibiotics and vaccines to improve immunity and the ability to defend and fight against foreign bodies or pathogens."
      sections={[
        {
          title: 'Indications',
          content: (
            <ul>
              <li>Control and protection against viral, bacterial, or fungal infections</li>
              <li>During incidence of diseases to improve health, immunity, and bird performance</li>
              <li>Before, during, or after vaccination to stimulate immunity and maximise vaccine results</li>
              <li>After antibiotics use to strengthen immunity and intestinal function</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <ul>
              <li><strong>Poultry:</strong> 250 ml per 1000 litres of drinking water for 5–7 days (oral via drinking water)</li>
            </ul>
          ),
        },
        {
          title: 'Packing',
          content: <p>Available in 1L bottles. Form: Liquid</p>,
        },
      ]}
    />
  );
}
