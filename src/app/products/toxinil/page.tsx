import Layout from '@/components/Layout';

export default function ToxinilProduct() {
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
              <img src="/products/toxinil.png" alt="TOXINIL mycotoxin binder aflatoxin prevention poultry feed safety Kenya" style={{maxWidth: "420px", width: "100%", height: "450px"}} />
            </div>
          </div>

          {/* Description Section */}
          <section style={{marginBottom: '50px'}}>
            <h3 className="column lg-12 section-header__pretitle pretitle text-pretitle">DESCRIPTION</h3>
            <div style={{backgroundColor: 'transparent', padding: '30px', marginTop: '20px'}}>
              <p style={{fontSize: '17px', lineHeight: '1.8', color: 'white'}}>
                TOXINIL is a comprehensive toxin binder that effectively neutralizes mycotoxins and other harmful substances in feed. This powerful formulation protects animal health and enhances productivity by preventing the damaging effects of aflatoxins, ochratoxins, and other feed contaminants. Trusted by farmers across Kenya and East Africa for complete mycotoxin management and feed safety.
              </p>
            </div>
          </section>

          {/* Composition Section */}
          <section style={{marginBottom: '50px'}}>
            <h3 className="column lg-12 section-header__pretitle pretitle text-pretitle">COMPOSITION</h3>
            <div style={{backgroundColor: 'transparent', padding: '30px', borderRadius: '8px', marginTop: '20px'}}>
              <ul style={{fontSize: '17px', lineHeight: '2', color: 'white', paddingLeft: '20px'}}>
                <li>Modified Aluminosilicates</li>
                <li>Activated Carbon</li>
                <li>Yeast Cell Wall Extracts</li>
                <li>Organic Acids</li>
                <li>Liver Protectants</li>
              </ul>
            </div>
          </section>

          {/* Benefits Section */}
          <section style={{marginBottom: '50px'}}>
            <h3 className="column lg-12 section-header__pretitle pretitle text-pretitle">BENEFITS</h3>
            <div style={{backgroundColor: 'transparent', padding: '30px', borderRadius: '8px', marginTop: '5px'}}>
              <ul style={{fontSize: '17px', lineHeight: '2', color: 'white', paddingLeft: '20px'}}>
                <li>Binds and neutralizes aflatoxins</li>
                <li>Protects against ochratoxins</li>
                <li>Prevents mycotoxin absorption</li>
                <li>Protects liver function</li>
                <li>Maintains animal productivity</li>
                <li>Improves feed conversion</li>
                <li>Safe for continuous use</li>
                <li>Suitable for all poultry and livestock</li>
              </ul>
            </div>
          </section>

          {/* Dosage Section */}
          <section style={{marginBottom: '50px'}}>
            <h3 className="column lg-12 section-header__pretitle pretitle text-pretitle">DOSAGE</h3>
            <div style={{backgroundColor: 'transparent', padding: '30px', marginTop: '5px'}}>
              <div style={{fontSize: '17px', lineHeight: '1.8', color: 'white'}}>
                <p style={{marginBottom: '20px'}}><strong>For Prevention:</strong></p>
                <ul style={{paddingLeft: '20px', marginBottom: '20px'}}>
                  <li>Mix 0.5-1kg per ton of feed</li>
                  <li>Use continuously in feed</li>
                </ul>
                
                <p style={{marginBottom: '20px'}}><strong>For High Contamination:</strong></p>
                <ul style={{paddingLeft: '20px', marginBottom: '20px'}}>
                  <li>Mix 1-2kg per ton of feed</li>
                  <li>Increase during rainy season</li>
                </ul>
                <p style={{fontStyle: 'italic', color: '#666', marginTop: '20px'}}>
                  Note: Best results when added during feed mixing. Store in a dry place.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section style={{textAlign: 'center', marginTop: '60px'}}>            
            <a href="tel:+254723405204" className="btn btn--primary" style={{backgroundColor: 'rgb(2, 108, 106)', color: 'white', fontSize: '10px', width: '250px', height: '60px', justifyContent: 'center', textAlign: 'center', display: 'inline-flex', alignItems: 'center'}}>
              Contact Us
            </a>
          </section>

        </div>
      </main>
    </Layout>
  );
}

