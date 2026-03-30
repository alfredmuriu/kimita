import ProductPageLayout from '@/components/ProductPageLayout';

export default function NitriticProduct() {
  return (
    <ProductPageLayout
      productName="NITRITIC"
      productImage="/products/nitritic.png"
      productImageAlt="NITRITIC natural antibiotic alternative E.coli Salmonella treatment poultry Kenya"
      description="Nitritic is a powerful natural antibiotic alternative that effectively kills harmful germs including E. coli and Salmonella. This advanced formulation works by detoxifying heavy metals, boosting animal health and immunity, stimulating appetite and growth, and preventing mold and pests. Nitritic provides an effective, long-term alternative to synthetic antibiotics. Trusted by farmers across Kenya and East Africa for natural bacterial disease control."
      sections={[
        {
          title: 'Benefits',
          content: (
            <ul>
              <li>Kills harmful E. coli bacteria naturally</li>
              <li>Eliminates Salmonella infections</li>
              <li>Detoxifies heavy metals from the body</li>
              <li>Boosts animal health and immunity</li>
              <li>Stimulates appetite and promotes growth</li>
              <li>Prevents mold growth in feed</li>
              <li>Long-term effective antibiotic alternative</li>
              <li>No withdrawal period required</li>
            </ul>
          ),
        },
        {
          title: 'Dosage',
          content: (
            <><p><strong>For Prevention:</strong></p><ul><li>Mix 0.5ml per 1 liter of drinking water</li><li>Administer for 3-5 days weekly</li></ul><p><strong>For Treatment:</strong></p><ul><li>Mix 1ml per 1 liter of drinking water</li><li>Administer for 5-7 consecutive days</li><li>Continue until infection clears</li></ul><p className="note">Note: Can be used alongside other treatments. Consult a veterinarian for severe bacterial infections.</p></>
          ),
        },
        {
          title: 'Indication',
          content: (
            <ul>
              <li>E. coli infections in poultry and livestock</li>
              <li>Salmonella contamination and infections</li>
              <li>Heavy metal toxicity in animals</li>
              <li>Mold and pest contamination in feed</li>
              <li>Bacterial disease prevention as an antibiotic alternative</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
