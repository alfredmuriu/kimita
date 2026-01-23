import Layout from '@/components/Layout';

export default function DCP18Product() {
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
              <img src="/products/dcp18.png" alt="DCP 18 dicalcium phosphate calcium phosphorus strong bones poultry Kenya" style={{maxWidth: "420px", width: "100%", height: "450px"}} />
            </div>
          </div>

          {/* Description Section */}
          <section style={{marginBottom: '50px'}}>
            <h3 className="column lg-12 section-header__pretitle pretitle text-pretitle">DESCRIPTION</h3>
            <div style={{backgroundColor: 'transparent', padding: '30px', marginTop: '20px'}}>
              <p style={{fontSize: '17px', lineHeight: '1.8', color: 'white'}}>
                DCP 18 is a feed-grade dicalcium phosphate supplement containing 18% phosphorus and 21% calcium in highly absorbable forms. This essential mineral supplement supports strong bones, healthy growth, and overall development in poultry, swine, cattle, and other livestock. An indispensable component of balanced animal nutrition. Trusted by farmers across Kenya and East Africa for mineral supplementation.
              </p>
            </div>
          </section>

          {/* Composition Section */}
          <section style={{marginBottom: '50px'}}>
            <h3 className="column lg-12 section-header__pretitle pretitle text-pretitle">COMPOSITION</h3>
            <div style={{backgroundColor: 'transparent', padding: '30px', borderRadius: '8px', marginTop: '20px'}}>
              <ul style={{fontSize: '17px', lineHeight: '2', color: 'white', paddingLeft: '20px'}}>
                <li>Phosphorus: 18% minimum</li>
                <li>Calcium: 21% minimum</li>
                <li>Dicalcium Phosphate Dihydrate</li>
                <li>Feed Grade Quality</li>
              </ul>
            </div>
          </section>

          {/* Benefits Section */}
          <section style={{marginBottom: '50px'}}>
            <h3 className="column lg-12 section-header__pretitle pretitle text-pretitle">BENEFITS</h3>
            <div style={{backgroundColor: 'transparent', padding: '30px', borderRadius: '8px', marginTop: '5px'}}>
              <ul style={{fontSize: '17px', lineHeight: '2', color: 'white', paddingLeft: '20px'}}>
                <li>Supports strong bone development</li>
                <li>Highly bioavailable calcium and phosphorus</li>
                <li>Improves eggshell quality in layers</li>
                <li>Prevents leg problems in broilers</li>
                <li>Essential for teeth and skeletal health</li>
                <li>Supports muscle function</li>
                <li>Improves overall growth</li>
                <li>Suitable for all livestock species</li>
              </ul>
            </div>
          </section>

          {/* Dosage Section */}
          <section style={{marginBottom: '50px'}}>
            <h3 className="column lg-12 section-header__pretitle pretitle text-pretitle">DOSAGE</h3>
            <div style={{backgroundColor: 'transparent', padding: '30px', marginTop: '5px'}}>
              <div style={{fontSize: '17px', lineHeight: '1.8', color: 'white'}}>
                <p style={{marginBottom: '20px'}}><strong>For Poultry:</strong></p>
                <ul style={{paddingLeft: '20px', marginBottom: '20px'}}>
                  <li>Mix 10-20kg per ton of feed</li>
                  <li>Higher rates for layers during production</li>
                </ul>
                
                <p style={{marginBottom: '20px'}}><strong>For Cattle/Swine:</strong></p>
                <ul style={{paddingLeft: '20px', marginBottom: '20px'}}>
                  <li>Mix 15-25kg per ton of feed</li>
                  <li>Adjust based on diet formulation</li>
                </ul>
                <p style={{fontStyle: 'italic', color: '#666', marginTop: '20px'}}>
                  Note: Balance with calcium sources. Consult nutritionist for precise inclusion rates.
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

