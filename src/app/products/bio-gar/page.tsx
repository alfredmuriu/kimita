import Layout from '@/components/Layout';

export default function BioGarProduct() {
  return (
    <Layout>
      <main style={{backgroundColor: 'rgba(0, 0, 0, .08)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px'}}>
        <div className="row" style={{maxWidth: '1200px', margin: '0 auto', padding: '0 40px'}}>
          
          {/* Back Navigation */}
          <div style={{marginBottom: '30px'}}>
            <a href="/products" style={{color: '#026c6a', textDecoration: 'none', fontSize: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back
            </a>
          </div>

          {/* Product Image */}
          <div style={{display: "flex", alignItems: "center", justifyContent: "center", gap: "0", marginBottom: "80px"}}>                      
            <div style={{display: "flex", justifyContent: "center", flex: 1, marginLeft: '320px'}}>
              <img src="/products/Bio-Gar_1kg.png" alt="BIO-GAR natural coccidiosis treatment gut health poultry Kenya" style={{maxWidth: "420px", width: "100%", height: "450px"}} />
            </div>
          </div>

          {/* Description Section */}
          <section style={{marginBottom: '50px'}}>
            <h3 className="column lg-12 section-header__pretitle pretitle text-pretitle">DESCRIPTION</h3>
            <div style={{backgroundColor: 'transparent', padding: '30px', marginTop: '20px'}}>
              <p style={{fontSize: '17px', lineHeight: '1.8', color: 'white'}}>
                BIO-GAR is a natural feed supplement designed to enhance gut health and overall well-being in poultry. Formulated with a unique blend of probiotics, prebiotics, and essential nutrients, BIO-GAR promotes healthy digestion, improves nutrient absorption, and supports natural immunity. Trusted by farmers across Kenya and East Africa for natural coccidiosis prevention and gut health management.
              </p>
            </div>
          </section>
        

          {/* Benefits Section */}
          <section style={{marginBottom: '50px'}}>
            <h3 className="column lg-12 section-header__pretitle pretitle text-pretitle">BENEFITS</h3>
            <div style={{backgroundColor: 'transparent', padding: '30px', borderRadius: '8px', marginTop: '5px'}}>
              <ul style={{fontSize: '17px', lineHeight: '2', color: 'white', paddingLeft: '20px'}}>
                <li>Promotes growth and improves feed utilization.</li>
                <li>BIO-GAR has a strong garlic, masks the bad smell of the feed.</li>
                <li>Controls animal diarrhea, pneumonia, bronchitis, purulent skin disease, blue ear disease and prevents influenza</li>
                <li>Effective in prevention and control of coccidiosis.</li>
                <li>Has bactericidal effect on Shigella, E. coli, Pseudomonas aeruginosa, Staphylococcus aureus killing effect is certain</li>
                <li>Inhibits aflatoxin poisoning of animals.</li>
                <li>Prevents red skin, enteritis and hemorrhage.</li>
                <li>Suitable for all animal types.</li>
              </ul>
            </div>
          </section>

          {/* Dosage Section */}
          <section style={{marginBottom: '50px'}}>
            <h3 className="column lg-12 section-header__pretitle pretitle text-pretitle">DOSAGE</h3>
            <div style={{backgroundColor: 'transparent', padding: '30px', marginTop: '5px'}}>
              <div style={{fontSize: '17px', lineHeight: '1.8', color: 'white'}}>
                <p style={{marginBottom: '20px'}}><strong>As a Feed Additive:</strong></p>
                <ul style={{paddingLeft: '20px', marginBottom: '20px'}}>
                  <li>100 gm / 1000 Litres of drinking water</li>
                  <li>100 gm / 1 MT finish feed</li>
                </ul>
                
                <p style={{marginBottom: '20px'}}><strong>For Growth Promotion:</strong></p>
                <ul style={{paddingLeft: '20px', marginBottom: '20px'}}>
                  <li>Increase to 250 gm / 1 MT finish feed</li>                  
                </ul>

                <p style={{marginBottom: '20px'}}><strong>For Treatment:</strong></p>
                <ul style={{paddingLeft: '20px', marginBottom: '20px'}}>
                  <li>Increase to 500 gm / 1 MT finish feed</li>                  
                </ul>

                <p style={{fontStyle: 'italic', color: '#666', marginTop: '20px'}}>
                  Note: Store in a cool, dry place. Keep container tightly closed after use.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section style={{textAlign: 'center', marginTop: '10px', marginRight: '200px'}}>            
            <a href="tel:+254723405204" className="btn btn--primary" style={{backgroundColor: 'rgb(2, 108, 106)', color: 'white', fontSize: '10px', width: '250px', height: '60px', justifyContent: 'center', textAlign: 'center', display: 'inline-flex', alignItems: 'center'}}>
              Contact Us
            </a>
          </section>

        </div>
      </main>
    </Layout>
  );
}

