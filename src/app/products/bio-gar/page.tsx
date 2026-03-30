import ProductPageLayout from '@/components/ProductPageLayout';

export default function BioGarProduct() {
  return (
    <ProductPageLayout
      productName="BIO-GAR"
      productImage="/products/Bio-Gar_1kg.png"
      productImageAlt="BIO-GAR natural coccidiosis treatment gut health poultry Kenya"
      description="BIO-GAR is a natural feed supplement designed to enhance gut health and overall well-being in poultry. Formulated with a unique blend of probiotics, prebiotics, and essential nutrients, BIO-GAR promotes healthy digestion, improves nutrient absorption, and supports natural immunity. Trusted by farmers across Kenya and East Africa for natural coccidiosis prevention and gut health management."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Promotes growth and improves feed utilization</li>
              <li>Strong garlic scent masks bad feed smell</li>
              <li>Controls diarrhea, pneumonia, bronchitis, and purulent skin disease</li>
              <li>Effective in prevention and control of coccidiosis</li>
              <li>Bactericidal effect on Shigella, E. coli, Pseudomonas, and Staphylococcus</li>
              <li>Inhibits aflatoxin poisoning of animals</li>
              <li>Prevents red skin, enteritis and hemorrhage</li>
              <li>Suitable for all animal types</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <><p><strong>As a Feed Additive:</strong></p><ul><li>100 gm / 1000 Litres of drinking water</li><li>100 gm / 1 MT finish feed</li></ul><p><strong>For Growth Promotion:</strong></p><ul><li>Increase to 250 gm / 1 MT finish feed</li></ul><p><strong>For Treatment:</strong></p><ul><li>Increase to 500 gm / 1 MT finish feed</li></ul><p className="note">Note: Store in a cool, dry place. Keep container tightly closed after use.</p></>
          ),
        },
        {
          title: 'Indication',
          content: (
            <ul>
              <li>Coccidiosis prevention and treatment in poultry</li>
              <li>Bacterial infections (E. coli, Salmonella, Staphylococcus)</li>
              <li>Diarrhea, pneumonia, and bronchitis in livestock</li>
              <li>Aflatoxin contamination in feed</li>
              <li>Poor gut health and digestive disorders</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
