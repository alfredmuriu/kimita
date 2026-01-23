import Layout from '@/components/Layout';

export default function ADE3Product() {
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
              <img src="/products/AD3E.png" alt="ADE-3 poultry vitamins A D3 E for egg production hatchability Kenya" style={{maxWidth: "420px", width: "100%", height: "450px"}} />
            </div>
          </div>

          {/* Description Section */}
          <section style={{marginBottom: '50px'}}>
            <h3 className="column lg-12 section-header__pretitle pretitle text-pretitle">DESCRIPTION</h3>
            <div style={{backgroundColor: 'transparent', padding: '30px', marginTop: '20px'}}>
              <p style={{fontSize: '17px', lineHeight: '1.8', color: 'white'}}>
                ADE-3 is a premium vitamin supplement effective for treating vitamin deficiencies in farm animals. This powerful formulation promotes growth rate, enhances performance, and improves feed efficiency. ADE-3 supports poultry health by preventing vitamin deficiencies, boosting disease resistance, and improving egg production and hatchability. Trusted by farmers across Kenya and East Africa for optimal poultry nutrition.
              </p>
            </div>
          </section>

          {/* Composition Section */}
          <section style={{marginBottom: '50px'}}>
            <h3 className="column lg-12 section-header__pretitle pretitle text-pretitle">COMPOSITION</h3>
            <div style={{backgroundColor: 'transparent', padding: '30px', borderRadius: '8px', marginTop: '20px'}}>
              <ul style={{fontSize: '17px', lineHeight: '2', color: 'white', paddingLeft: '20px'}}>
                <li>Vitamin A (Retinol)</li>
                <li>Vitamin D3 (Cholecalciferol)</li>
                <li>Vitamin E (Tocopherol)</li>
                <li>Stabilizers and Carriers</li>
              </ul>
            </div>
          </section>

          {/* Benefits Section */}
          <section style={{marginBottom: '50px'}}>
            <h3 className="column lg-12 section-header__pretitle pretitle text-pretitle">BENEFITS</h3>
            <div style={{backgroundColor: 'transparent', padding: '30px', borderRadius: '8px', marginTop: '5px'}}>
              <ul style={{fontSize: '17px', lineHeight: '2', color: 'white', paddingLeft: '20px'}}>
                <li>Promotes optimal growth rate</li>
                <li>Enhances overall animal performance</li>
                <li>Improves feed efficiency</li>
                <li>Boosts disease resistance</li>
                <li>Improves egg production in layers</li>
                <li>Enhances hatchability rates</li>
                <li>Supports bone development</li>
                <li>Prevents vitamin deficiency symptoms</li>
              </ul>
            </div>
          </section>

          {/* Dosage Section */}
          <section style={{marginBottom: '50px'}}>
            <h3 className="column lg-12 section-header__pretitle pretitle text-pretitle">DOSAGE</h3>
            <div style={{backgroundColor: 'transparent', padding: '30px', marginTop: '5px'}}>
              <div style={{fontSize: '17px', lineHeight: '1.8', color: 'white'}}>
                <p style={{marginBottom: '20px'}}><strong>For Maintenance:</strong></p>
                <ul style={{paddingLeft: '20px', marginBottom: '20px'}}>
                  <li>Mix 0.5ml per 1 liter of drinking water</li>
                  <li>Administer for 3-5 days monthly</li>
                </ul>
                
                <p style={{marginBottom: '20px'}}><strong>For Deficiency Treatment:</strong></p>
                <ul style={{paddingLeft: '20px', marginBottom: '20px'}}>
                  <li>Mix 1ml per 1 liter of drinking water</li>
                  <li>Administer for 5-7 consecutive days</li>
                </ul>
                <p style={{fontStyle: 'italic', color: '#666', marginTop: '20px'}}>
                  Note: Store in a cool, dark place. Protect from direct sunlight.
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

