import Layout from '@/components/Layout';

export default function AgripigSowProduct() {
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
              <img src="/products/agripig-sow.png" alt="AGRIPIG-SOW pig sow feed supplement reproduction lactation performance Kenya" style={{maxWidth: "420px", width: "100%", height: "450px"}} />
            </div>
          </div>

          {/* Description Section */}
          <section style={{marginBottom: '50px'}}>
            <h3 className="column lg-12 section-header__pretitle pretitle text-pretitle">DESCRIPTION</h3>
            <div style={{backgroundColor: 'transparent', padding: '30px', marginTop: '20px'}}>
              <p style={{fontSize: '17px', lineHeight: '1.8', color: 'white'}}>
                AGRIPIG-SOW is a specialized feed supplement formulated for breeding sows and gilts to support optimal reproduction and lactation performance. This comprehensive formula provides essential nutrients for fertility, healthy pregnancies, milk production, and piglet vitality. Designed for all stages of the sow production cycle. Trusted by pig farmers across Kenya and East Africa for improved breeding outcomes.
              </p>
            </div>
          </section>

          {/* Composition Section */}
          <section style={{marginBottom: '50px'}}>
            <h3 className="column lg-12 section-header__pretitle pretitle text-pretitle">COMPOSITION</h3>
            <div style={{backgroundColor: 'transparent', padding: '30px', borderRadius: '8px', marginTop: '20px'}}>
              <ul style={{fontSize: '17px', lineHeight: '2', color: 'white', paddingLeft: '20px'}}>
                <li>Folic Acid and Biotin</li>
                <li>Vitamins (A, D3, E, B12)</li>
                <li>Chelated Minerals (Iron, Zinc, Manganese)</li>
                <li>Omega-3 Fatty Acids</li>
                <li>Lysine and Methionine</li>
                <li>Calcium and Phosphorus</li>
              </ul>
            </div>
          </section>

          {/* Benefits Section */}
          <section style={{marginBottom: '50px'}}>
            <h3 className="column lg-12 section-header__pretitle pretitle text-pretitle">BENEFITS</h3>
            <div style={{backgroundColor: 'transparent', padding: '30px', borderRadius: '8px', marginTop: '5px'}}>
              <ul style={{fontSize: '17px', lineHeight: '2', color: 'white', paddingLeft: '20px'}}>
                <li>Improves conception rates</li>
                <li>Supports healthy litter sizes</li>
                <li>Enhances milk production</li>
                <li>Reduces stillbirths and mummified piglets</li>
                <li>Supports piglet birth weight</li>
                <li>Maintains sow body condition</li>
                <li>Shortens wean-to-service interval</li>
                <li>Improves overall breeding efficiency</li>
              </ul>
            </div>
          </section>

          {/* Dosage Section */}
          <section style={{marginBottom: '50px'}}>
            <h3 className="column lg-12 section-header__pretitle pretitle text-pretitle">DOSAGE</h3>
            <div style={{backgroundColor: 'transparent', padding: '30px', marginTop: '5px'}}>
              <div style={{fontSize: '17px', lineHeight: '1.8', color: 'white'}}>
                <p style={{marginBottom: '20px'}}><strong>For Breeding Sows:</strong></p>
                <ul style={{paddingLeft: '20px', marginBottom: '20px'}}>
                  <li>Mix 3-5kg per ton of feed</li>
                  <li>Use throughout gestation and lactation</li>
                </ul>
                
                <p style={{marginBottom: '20px'}}><strong>For Gilts:</strong></p>
                <ul style={{paddingLeft: '20px', marginBottom: '20px'}}>
                  <li>Mix 2.5-4kg per ton of feed</li>
                  <li>Start 2-3 weeks before breeding</li>
                </ul>
                <p style={{fontStyle: 'italic', color: '#666', marginTop: '20px'}}>
                  Note: Increase rates during lactation. Store in a cool, dry place.
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

