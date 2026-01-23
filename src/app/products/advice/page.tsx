import Layout from '@/components/Layout';

export default function AdviceProduct() {
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0",
              marginBottom: "80px",
            }}
          >                      
            {/* CENTER IMAGE */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flex: 1,
                marginLeft: '320px'
              }}
            >
              <img
                src="/images/folio/advice.png"
                alt="ADVICE natural treatment for Newcastle disease and viral infections in poultry Kenya"
                style={{
                  maxWidth: "420px",
                  width: "100%",
                  height: "450px",
                }}
              />
            </div>
          </div>

          {/* Description Section */}
          <section style={{marginBottom: '50px'}}>
            <h3 className="column lg-12 section-header__pretitle pretitle text-pretitle">DESCRIPTION</h3>
            <div style={{backgroundColor: 'transparent', padding: '30px', marginTop: '20px'}}>
              <p style={{fontSize: '17px', lineHeight: '1.8', color: 'white'}}>
                ADVICE is a premium natural additive formulated to be mixed with drinking water for poultry and livestock. 
                Produced with carefully selected natural extracts including Cinnamon, Garlic, Echinacea, Astragalus, 
                Aloe vera, and citric compounds, plus Lectin and Amantadine. This powerful formulation effectively 
                treats and prevents virus diseases including common cold, influenza, Newcastle disease (ND), 
                infectious bronchitis, and other respiratory viral infections. Trusted by farmers across Kenya 
                and East Africa for reliable disease control without antibiotics.
              </p>
            </div>
          </section>

          {/* Composition Section */}
          <section style={{marginBottom: '50px'}}>
            <h3 className="column lg-12 section-header__pretitle pretitle text-pretitle">COMPOSITION</h3>
            <div style={{backgroundColor: 'transparent', padding: '30px', borderRadius: '8px', marginTop: '20px'}}>
              <ul style={{fontSize: '17px', lineHeight: '2', color: 'white', paddingLeft: '20px'}}>
                <li>Cinnamon Extract (Cinnamomum verum)</li>
                <li>Garlic Extract (Allium sativum)</li>
                <li>Echinacea Extract (Echinacea purpurea)</li>
                <li>Astragalus Extract (Astragalus membranaceus)</li>
                <li>Aloe Vera Extract (Aloe barbadensis)</li>
                <li>Citric Acid Compounds</li>
                <li>Lectin</li>
                <li>Amantadine</li>
              </ul>
            </div>
          </section>

          {/* Benefits Section */}
          <section style={{marginBottom: '50px'}}>
            <h3 className="column lg-12 section-header__pretitle pretitle text-pretitle">BENEFITS</h3>
            <div style={{backgroundColor: 'transparent', padding: '30px', borderRadius: '8px', marginTop: '5px'}}>
              <ul style={{fontSize: '17px', lineHeight: '2', color: 'white', paddingLeft: '20px'}}>
                <li>Treats and prevents Newcastle disease (ND) naturally</li>
                <li>Effective against infectious bronchitis and respiratory viruses</li>
                <li>Boosts natural immunity in poultry</li>
                <li>Reduces mortality during disease outbreaks</li>
                <li>Safe antibiotic alternative for viral infections</li>
                <li>Supports faster recovery after illness</li>
                <li>Easy administration through drinking water</li>
                <li>Suitable for layers, broilers, and indigenous chickens</li>
              </ul>
            </div>
          </section>

          {/* Dosage Section */}
          <section style={{marginBottom: '50px'}}>
            <h3 className="column lg-12 section-header__pretitle pretitle text-pretitle">DOSAGE</h3>
            <div style={{backgroundColor: 'transparent', padding: '30px',  marginTop: '5px'}}>
              <div style={{fontSize: '17px', lineHeight: '1.8', color: 'white'}}>
                <p style={{marginBottom: '20px'}}><strong>For Prevention:</strong></p>
                <ul style={{paddingLeft: '20px', marginBottom: '20px'}}>
                  <li>Mix 1ml per 1 liter of drinking water</li>
                  <li>Administer for 3-5 consecutive days</li>
                  <li>Repeat monthly or during stress periods</li>
                </ul>
                
                <p style={{marginBottom: '20px'}}><strong>For Treatment:</strong></p>
                <ul style={{paddingLeft: '20px', marginBottom: '20px'}}>
                  <li>Mix 2ml per 1 liter of drinking water</li>
                  <li>Administer for 5-7 consecutive days</li>
                  <li>Continue until symptoms subside</li>
                </ul>
                <p style={{fontStyle: 'italic', color: '#666', marginTop: '20px'}}>
                  Note: Consult with a veterinarian for severe cases. Store in a cool, dry place away from direct sunlight.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section style={{textAlign: 'center', marginTop: '60px'}}>            
            <a 
              href="tel:+254723405204" 
              className="btn btn--primary"
              style={{backgroundColor: 'rgb(2, 108, 106)', color: 'white', fontSize: '10px', width: '250px', height: '60px', justifyContent: 'center', textAlign: 'center', display: 'inline-flex', alignItems: 'center'}}
            >
              Contact Us
            </a>
          </section>
        </div>
      </main>
    </Layout>
  );
}

