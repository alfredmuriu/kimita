import Layout from '@/components/Layout';
import FAQ from '@/components/FAQ';

export default function Home() {
  return (
    <Layout>
      <section id="intro" className="s-intro target-section">
        <div className="s-intro__bg"></div>

        <div className="row s-intro__content">
          <div className="s-intro__content-bg"></div>

          <div className="column lg-12 s-intro__content-inner">
            <h1 className="s-intro__content-title">
              Natural Animal Health Solutions, <br />
              Livestock Supplements &amp; <br />
              Disease Prevention for African Farmers.
            </h1>
            <p className="s-intro__content-desc" style={{color: '#fff', fontSize: '1.1rem', marginTop: '1rem', maxWidth: '600px', lineHeight: '1.6'}}>
              Trusted by poultry, dairy, and livestock farmers across Africa.
              Combat Newcastle disease, coccidiosis, and respiratory infections with our natural antibiotic alternatives.
            </p>

            <div className="s-intro__content-buttons">
              <a href="#about" className="btn btn--stroke s-intro__content-btn smoothscroll" style={{fontSize: '10px', width: '250px', height: '60px', justifyContent: 'center', textAlign: 'center', display: 'inline-flex', alignItems: 'center'}}>
                More About Us
              </a>
              <a href="/products" className="btn btn--stroke s-intro__content-btn" style={{marginLeft: '10px', fontSize: '10px', width: '250px', height: '60px', justifyContent: 'center', textAlign: 'center', display: 'inline-flex', alignItems: 'center'}}>
                Explore Products
              </a>              
            </div>
          </div>
        </div>

        <div className="s-intro__scroll-down">
          <a href="#about" className="smoothscroll">
            <span> &gt;&gt;&gt; SCROLL &gt;&gt;&gt;</span>
          </a>
        </div>
      </section>

      <section id="about" className="s-about target-section">
        <div className="row section-header">
          <h3 className="column lg-12 section-header__pretitle pretitle text-pretitle">AGRIKIMA</h3>
          <div className="column lg-6 stack-on-1100 section-header__primary">
            <h2 className="title text-display-1">
              Agrikima is Africa&apos;s trusted provider of natural poultry health solutions, livestock supplements, and veterinary products.
            </h2>
          </div>
          <div className="column lg-6 stack-on-1100 section-header__secondary">
            <p className="desc">
              We empower farmers across Africa with sustainable animal health products that prevent poultry diseases like Newcastle, Gumboro, and coccidiosis — without relying on harmful antibiotics. From broiler farming to layer chicken management and dairy cattle care, Agrikima delivers natural solutions that boost productivity and reduce mortality.
            </p>
          </div>
        </div>

        <div className="row process-list list-block show-ctr block-lg-one-half block-tab-whole">
          <div className="column list-block__item">
            <div className="list-block__title">
              <h3 className="h5">Disease Prevention</h3>
            </div>
            <div className="list-block__text">
              <p style={{ color: "black" }}>
                We help farmers combat common poultry viral diseases including Newcastle disease, infectious bronchitis, Gumboro (IBD), and respiratory infections. Our natural solutions like ADVICE and Mix-5 provide effective prevention without antibiotic resistance concerns.
              </p>
            </div>
          </div>

          <div className="column list-block__item">
            <div className="list-block__title">
              <h3 className="h5">Antibiotic Alternatives</h3>
            </div>
            <div className="list-block__text">
              <p style={{ color: "black" }}>
                Our R&amp;D teams develop science-backed, natural alternatives to conventional chicken antibiotics. Products like Bio-Gar use garlic extract and phytobiotics to improve gut health, treat diarrhea in chickens, and support recovery from coccidiosis treatment.
              </p>
            </div>
          </div>

          <div className="column list-block__item">
            <div className="list-block__title">
              <h3 className="h5">Farmer Training</h3>
            </div>
            <div className="list-block__text">
              <p style={{ color: "black" }}>
                Through workshops, field demos, and partnerships with dairy and poultry cooperatives, we train farmers on broiler vaccination schedules, layer chicken management, proper brooding temperatures, and how to start poultry farming in Kenya successfully.
              </p>
            </div>
          </div>

          <div className="column list-block__item">
            <div className="list-block__title">
              <h3 className="h5">Complete Nutrition</h3>
            </div>
            <div className="list-block__text">
              <p style={{ color: "black" }}>
                We provide essential poultry vitamins, minerals, and feed additives including DCP for calcium and phosphorus, Agrivitam for vitamin deficiencies, and amino acids like lysine and methionine for optimal broiler weight gain and layer egg production.
              </p>
            </div>
          </div>
        </div>

        <div className="row list-block block-lg-one-half block-tab-whole block-stack-on-1000 s-footer__btns" style={{marginTop: '20px'}}>
          <div className="column list-block__item">
            <div className="s-footer__contact-btn">
              <a href="https://wa.me/254111410639" className="btn btn--primary u-fullwidth" style={{fontSize: '10px', width: '250px', height: '60px', justifyContent: 'center', textAlign: 'center', display: 'inline-flex', alignItems: 'center'}}>
                Talk to Our Experts
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="s-image-separator">
        <div className="row">
          <div className="column lg-12">
            <div className="image-grid">
              <div className="image-item">
                <img src="/images/cow1.jpg" alt="Dairy cattle farming Kenya - mastitis prevention and milk production" />
              </div>
              <div className="image-item">
                <img src="/images/goat.jpg" alt="Goat farming Kenya - PPR disease prevention and immunity support" />
              </div>
              <div className="image-item">
                <img src="/images/chicken1.jpg" alt="Poultry farming Kenya - broiler and layer chicken health solutions" />
              </div>
              <div className="image-item">
                <img src="/images/cow.jpg" alt="Livestock farming East Africa - natural veterinary products" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="s-services target-section">
        <div className="row section-header">
          <h3 className="column lg-12 section-header__pretitle text-pretitle">Our Solutions for African Farmers</h3>
          <div className="column lg-6 stack-on-1100 section-header__primary">
            <h2 className="title text-display-1">
              From poultry disease prevention to dairy cattle health — we provide complete livestock solutions.
            </h2>
          </div>
          <div className="column lg-6 stack-on-1100 section-header__secondary">
            <p className="desc">
              Whether you&apos;re starting poultry farming in Kenya, managing a layer or broiler operation,
              or running a dairy farm, Agrikima provides natural animal health products that reduce mortality,
              improve feed conversion, and boost your farm&apos;s profitability — all without harmful antibiotic residues.
            </p>
          </div>
        </div>

        <div className="row services-list list-block block-lg-one-half block-tab-whole">
          <div className="column list-block__item">
            <div className="list-block__title">
              <div className="list-block__icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M8 14s1.5-2 4-2 4 2 4 2"/>
                  <path d="M9 9h.01"/>
                  <path d="M15 9h.01"/>
                  <path d="M12 17v-2"/>
                  <rect x="10.5" y="6" width="3" height="3" rx="1.5"/>
                  <path d="M12 8.5v-2"/>
                </svg>
              </div>
              <h3 className="h5">Poultry Disease Prevention</h3>
            </div>
            <div className="list-block__text">
              <p style={{ color: "black" }}>
                Combat Newcastle disease, Gumboro (IBD), infectious bronchitis, and coccidiosis with our proven natural solutions. ADVICE provides viral protection while Bio-Gar supports gut health and prevents bloody diarrhea in chickens.
              </p>
            </div>
          </div>

          <div className="column list-block__item">
            <div className="list-block__title">
              <div className="list-block__icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="13" rx="2"/>
                  <path d="M16 3l-4 4-4-4"/>
                  <path d="M12 11v2"/>
                  <path d="M9 15h6"/>
                </svg>
              </div>
              <h3 className="h5">Broiler &amp; Layer Farming Support</h3>
            </div>
            <div className="list-block__text">
              <p style={{ color: "black" }}>
                Maximize broiler weight gain per week and improve layer egg production with our complete nutrition programs. From day-old chick management to broiler harvesting and layer peak production, we support your entire farming journey.
              </p>
            </div>
          </div>

          <div className="column list-block__item">
            <div className="list-block__title">
              <div className="list-block__icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="10" rx="2"/>
                  <path d="M2 17h20"/>
                  <path d="M7 17v2a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2"/>
                  <circle cx="12" cy="12" r="2"/>
                </svg>
              </div>
              <h3 className="h5">Dairy Cattle &amp; Ruminant Health</h3>
            </div>
            <div className="list-block__text">
              <p style={{ color: "black" }}>
                Support dairy cow immunity, prevent mastitis naturally, and improve milk quality with our specialized products. We also provide solutions for goats and sheep, including PPR disease prevention and stress management.
              </p>
            </div>
          </div>

          <div className="column list-block__item">
            <div className="list-block__title">
              <div className="list-block__icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21c4.418 0 8-4.03 8-9V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7c0 4.97 3.582 9 8 9z"/>
                  <path d="M12 21V2"/>
                  <path d="M8 14c0-2.21 1.79-4 4-4s4 1.79 4 4"/>
                </svg>
              </div>
              <h3 className="h5">Stress &amp; Recovery Management</h3>
            </div>
            <div className="list-block__text">
              <p style={{ color: "black" }}>
                Reduce post-vaccination stress, support recovery after disease outbreaks, and boost immunity naturally with Agrivitam and our stress-relief formulas. Prevent sudden death in chickens and reduce overall poultry mortality.
              </p>
            </div>
          </div>

          <div className="column list-block__item">
            <div className="list-block__title">
              <div className="list-block__icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20"/>
                  <path d="M5 12c0-3.866 3.134-7 7-7s7 3.134 7 7c0 3.866-3.134 7-7 7s-7-3.134-7-7z"/>
                  <path d="M12 12c-2.21 0-4 1.79-4 4"/>
                  <path d="M12 12c2.21 0 4 1.79 4 4"/>
                </svg>
              </div>
              <h3 className="h5">Feed Additives &amp; Nutrition</h3>
            </div>
            <div className="list-block__text">
              <p style={{ color: "black" }}>
                Prevent vitamin deficiencies, calcium and phosphorus problems, and weak eggshells with DCP 18, amino acids (lysine, methionine, threonine), and our complete poultry feed formulation additives for optimal growth and production.
              </p>
            </div>
          </div>

          <div className="column list-block__item">
            <div className="list-block__title">
              <div className="list-block__icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3 className="h5">Food Safety &amp; Antibiotic-Free Farming</h3>
            </div>
            <div className="list-block__text">
              <p style={{ color: "black" }}>
                Avoid antibiotic residues in eggs and chicken meat. Our natural alternatives help you maintain food safety standards, meet antibiotic withdrawal periods, and combat antimicrobial resistance — keeping your products safe for consumers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="folio" className="s-folio target-section">
        <div className="row section-header light-on-dark">
          <h3 className="column lg-12 section-header__pretitle text-pretitle">Natural Poultry &amp; Livestock Products</h3>
          <div className="column lg-6 stack-on-1100 section-header__primary">
            <h2 className="title text-display-1">
              Proven solutions for Newcastle disease, coccidiosis, respiratory infections, and more — trusted by farmers across Africa.
            </h2>
          </div>
          <div className="column lg-6 stack-on-1100 section-header__secondary">
            <p className="desc">
              From natural antibiotic alternatives to complete poultry vitamins and feed additives,
              our products help you raise healthier broilers, improve layer egg production,
              and reduce poultry mortality — all while avoiding harmful antibiotic residues.
            </p>
          </div>
        </div>

        <div className="row list-block block-lg-one-half block-tab-whole block-stack-on-1000 s-footer__btns" style={{marginTop: '-60px', marginBottom: '30px'}}>
          <div className="column list-block__item">
            <div className="s-footer__contact-btn">
              <a href="/products" className="btn btn--primary u-fullwidth" style={{backgroundColor: 'rgb(2, 108, 106)', fontSize: '10px', width: '250px', height: '60px', justifyContent: 'center', textAlign: 'center', display: 'inline-flex', alignItems: 'center'}}>
                Browse All Products
              </a>
            </div>
          </div>          
        </div>

        <div className="section-title-wrapper" style={{textAlign: 'center', marginBottom: '40px'}}></div>
        <span style={{
          display: 'block',
          fontSize: '40px',
          fontWeight: 900,
          color: '#444',
          letterSpacing: '-2px',
          fontFamily: "'Inter',sans-serif",
          lineHeight: 1,
          marginTop: '100px',
          textAlign: 'center',
        }}>
          FARMER-APPROVED BEST SELLERS
        </span>

        <div id="bricks" className="row bricks">
          <div className="column lg-12 masonry">
            <div className="bricks-wrapper">
              <div className="grid-sizer"></div>
              <article className="brick brick--double entry">
                <a href="#modal-01" className="entry__link">
                  <div className="entry__thumb">
                    <img src="/images/folio/advice.png" alt="ADVICE natural treatment for Newcastle disease and infectious bronchitis in chickens Kenya" />
                    <h4 className="entry__title" style={{marginLeft: '110px'}}>ADVICE</h4>
                  </div>
                  <div className="entry__info">
                    <div className="entry__cat">VIRAL DISEASE PREVENTION</div>
                    <h4 className="entry__title">ADVICE</h4>
                  </div>
                </a>
              </article>

              <article className="brick brick--double entry">
                <a href="#modal-02" className="entry__link">
                  <div className="entry__thumb">
                    <img src="/products/agritonic_1l.png" style={{height: '375px'}} alt="AGRITONIC poultry feed supplement for broiler weight gain Kenya" />
                    <h4 className="entry__title" style={{marginLeft: '110px'}}>AGRITONIC</h4>
                  </div>
                  <div className="entry__info">
                    <div className="entry__cat">GROWTH &amp; PRODUCTIVITY</div>
                    <h4 className="entry__title">AGRITONIC</h4>
                  </div>
                </a>
              </article>

              <article className="brick brick--double entry">
                <a href="#modal-03" className="entry__link">
                  <div className="entry__thumb">
                    <img src="/products/Bio-Gar_1kg.png" alt="BIO-GAR garlic extract for gut health and coccidiosis prevention in poultry Kenya" />
                    <h4 className="entry__title" style={{marginLeft: '110px'}}>BIO-GAR</h4>
                  </div>
                  <div className="entry__info">
                    <div className="entry__cat">GUT HEALTH &amp; IMMUNITY</div>
                    <h4 className="entry__title">BIO-GAR</h4>
                  </div>
                </a>
              </article>

              <article className="brick brick--double entry">
                <a href="#modal-04" className="entry__link">
                  <div className="entry__thumb">
                    <img src="/products/agrivitam_1l.png" style={{height: '375px'}} alt="AGRIVITAM poultry vitamins for stress recovery and egg production Kenya" />
                    <h4 className="entry__title" style={{marginLeft: '110px'}}>AGRIVITAM</h4>
                  </div>
                  <div className="entry__info">
                    <div className="entry__cat">VITAMINS &amp; RECOVERY</div>
                    <h4 className="entry__title">AGRIVITAM</h4>
                  </div>
                </a>
              </article>
            </div>
          </div>
        </div>

        <div id="modal-01" hidden>
          <div className="modal-popup" style={{display: 'flex', alignItems: 'center', gap: '32px', maxWidth: '700px'}}>
            <img src="/images/folio/Advice.png" alt="ADVICE natural Newcastle disease treatment Kenya" style={{width: '250px', height: 'auto', borderRadius: '8px', objectFit: 'cover'}} />
            <div className="modal-popup__desc">
              <h5>ADVICE — Natural Viral Protection</h5>
              <p>ADVICE is formulated with natural extracts (Cinnamon, Garlic, Echinacea, Astragalus, Aloe vera) to boost poultry immunity against Newcastle disease, infectious bronchitis, Gumboro, and other viral diseases. A proven natural alternative to chicken antibiotics — trusted by poultry farmers across Kenya for disease prevention and post-vaccination support.</p>
            </div>
          </div>
        </div>

        <div id="modal-02" hidden>
          <div className="modal-popup" style={{display: 'flex', alignItems: 'center', gap: '32px', maxWidth: '700px'}}>
            <img src="/products/agritonic_1l.png" alt="AGRITONIC broiler feed supplement Kenya" style={{width: '250px', height: 'auto', borderRadius: '8px', objectFit: 'cover'}} />
            <div className="modal-popup__desc">
              <h5>AGRITONIC — Growth &amp; Productivity Booster</h5>
              <p>AGRITONIC is a powerful liquid feed supplement that improves broiler weight gain per week, enhances feed conversion ratio, and supports optimal poultry productivity. Ideal for broiler feeding programs and layer management — helps farmers maximize returns while reducing mortality from poor nutrition.</p>
            </div>
          </div>
        </div>

        <div id="modal-03" hidden>
          <div className="modal-popup" style={{display: 'flex', alignItems: 'center', gap: '32px', maxWidth: '700px'}}>
            <img src="/products/Bio-Gar_1kg.png" alt="BIO-GAR natural coccidiosis treatment and gut health Kenya" style={{width: '250px', height: 'auto', borderRadius: '8px', objectFit: 'cover'}} />
            <div className="modal-popup__desc">
              <h5>BIO-GAR — Gut Health &amp; Natural Antibiotic Alternative</h5>
              <p>BIO-GAR harnesses the power of garlic extract to improve gut health, prevent diarrhea in chickens, and support natural coccidiosis treatment without antibiotics. Effective against ascites (water belly) in broilers, poor feed conversion, and digestive issues. Also supports dairy cattle immunity and helps prevent mastitis naturally.</p>
            </div>
          </div>
        </div>

        <div id="modal-04" hidden>
          <div className="modal-popup" style={{display: 'flex', alignItems: 'center', gap: '32px', maxWidth: '700px'}}>
            <img src="/products/agrivitam_1l.png" alt="AGRIVITAM poultry vitamins for layer egg production Kenya" style={{width: '250px', height: 'auto', borderRadius: '8px', objectFit: 'cover'}} />
            <div className="modal-popup__desc">
              <h5>AGRIVITAM — Complete Vitamin &amp; Mineral Support</h5>
              <p>AGRIVITAM provides essential poultry vitamins to prevent vitamin deficiency symptoms, support recovery after disease outbreaks, and reduce stress in chickens during vaccination, transport, or heat stress. Improves layer egg production, strengthens weak eggshells, and boosts overall flock immunity for healthier, more productive birds.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="folio" className="s-folio target-section" style={{marginTop: '-175px'}}>
        <div className="row section-header light-on-dark">
          <h3 className="column lg-12 section-header__pretitle text-pretitle">Download Center</h3>
          <div className="column lg-6 stack-on-1100 section-header__primary">
            <h2 className="title text-display-1">
              Access trusted guides on poultry and livestock farming, including feeding programs, vaccination schedules and disease prevention.
            </h2>
          </div>
          <div className="column lg-6 stack-on-1100 section-header__secondary">
            <p className="desc">
              Practical poultry and livestock farming resources, made simple to help you make informed decisions at every stage of production.
            </p>
          </div>
        </div>

        <div className="row list-block block-lg-one-half block-tab-whole block-stack-on-1000 s-footer__btns" style={{marginTop: '-60px', marginBottom: '30px'}}>
          <div className="column list-block__item">
            <div className="s-footer__contact-btn">
              <a href="/downloads" className="btn btn--primary u-fullwidth" style={{backgroundColor: 'rgb(2, 108, 106)', fontSize: '10px', width: '250px', height: '60px', justifyContent: 'center', textAlign: 'center', display: 'inline-flex', alignItems: 'center'}}>
                View Resources
              </a>
            </div>
          </div>
        </div>
      </section>

      <FAQ />
    </Layout>
  );
}
