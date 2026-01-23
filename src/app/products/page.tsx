import Layout from '@/components/Layout';

export default function Products() {
  return (
    <Layout>
      <div className="intro-flex" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div>
          <h1 className="s-intro__content-title" style={{marginTop: '150px', marginLeft: '60px', fontSize: '50px'}}>
            Natural Animal Health <br />
            Products That Work
          </h1>
          <h2 className="title text-display-1 animate-slide-in-left" style={{color: 'grey', fontSize: '25px', marginLeft: '60px', fontFamily: 'Inter, sans-serif'}}>
            Prevent Newcastle disease, coccidiosis &amp; respiratory infections. <br />
            Boost broiler weight gain &amp; layer egg production naturally. <br />
            Trusted by dairy, poultry &amp; livestock farmers across Africa.
          </h2>
        </div>
        <img src="/products/wheatfarmlogo.jpg" alt="Natural poultry health products and livestock supplements Kenya" className="intro-image-slide-in" style={{width: '400px', height: '375px', marginTop: '100px', marginRight: '60px', borderRadius: '2px', boxShadow: '0 4px 24px rgba(0,0,0,0.12)'}} />
      </div>

      <div className="go-to-natural-btn animate-slide-in-up" style={{display: 'flex', justifyContent: 'center', marginTop: '-10px', marginBottom: '30px'}}>
        <a className="smoothscroll" title="Go to Natural Solutions" href="#natural" aria-label="Go to Natural Solutions" style={{background: '#026c6a', borderRadius: '50%', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', transition: 'background 0.2s'}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" style={{fill: '#fff'}}>
            <path d="M12 16l-6-6h12z"/>
          </svg>
          <span className="u-screen-reader-text">Go to Natural Solutions</span>
        </a>
      </div>

      <main>
        <section id="folio" className="s-folio target-section">
          <h2 id="natural" className="column lg-12 section-header__pretitle pretitle text-pretitle">NATURAL SOLUTIONS</h2>
          <div id="bricks" className="row bricks">
            <div className="column lg-12 masonry">
              <div className="bricks-wrapper">
                <div className="grid-sizer"></div>

                <article className="brick brick--double entry">
                  <a href="/products/advice" className="entry__page-link">
                    <div className="entry__thumb">
                      <img src="/images/folio/advice.png" alt="ADVICE natural treatment for Newcastle disease and viral infections in poultry Kenya" />
                      <h4 className="entry__title" style={{marginLeft: '110px'}}>ADVICE</h4>
                    </div>
                    <div className="entry__info">
                      <div className="entry__cat">NATURAL SOLUTION</div>
                      <h4 className="entry__title">ADVICE</h4>
                    </div>
                  </a>
                </article>

                <article className="brick brick--double entry">
                  <a href="/products/mix-5" className="entry__page-link">
                    <div className="entry__thumb">
                      <img src="/products/mix.png" style={{height: '375px'}} alt="MIX-5 respiratory disease treatment for poultry infectious bronchitis Kenya" />
                      <h4 className="entry__title" style={{marginLeft: '110px'}}>MIX-5</h4>
                    </div>
                    <div className="entry__info">
                      <div className="entry__cat">NATURAL SOLUTION</div>
                      <h4 className="entry__title">MIX-5</h4>
                    </div>
                  </a>
                </article>

                <article className="brick brick--double entry">
                  <a href="/products/bio-gar" className="entry__page-link">
                    <div className="entry__thumb">
                      <img src="/products/Bio-Gar_1kg.png" alt="BIO-GAR natural coccidiosis treatment gut health poultry Kenya" />
                      <h4 className="entry__title" style={{marginLeft: '110px'}}>BIO-GAR</h4>
                    </div>
                    <div className="entry__info">
                      <div className="entry__cat">NATURAL SOLUTION</div>
                      <h4 className="entry__title">BIO-GAR</h4>
                    </div>
                  </a>
                </article>

                <article className="brick brick--double entry">
                  <a href="/products/immusol" className="entry__page-link">
                    <div className="entry__thumb">
                      <img src="/products/immusol.png" style={{height: '375px'}} alt="IMMUSOL poultry immunity booster Gumboro Newcastle disease prevention Kenya" />
                      <h4 className="entry__title" style={{marginLeft: '110px'}}>IMMUSOL</h4>
                    </div>
                    <div className="entry__info">
                      <div className="entry__cat">NATURAL SOLUTION</div>
                      <h4 className="entry__title">IMMUSOL</h4>
                    </div>
                  </a>
                </article>

                <article className="brick brick--double entry">
                  <a href="/products/k-digest" className="entry__page-link">
                    <div className="entry__thumb">
                      <img src="/products/k-digest.png" style={{height: '375px'}} alt="K-DIGEST liver health fatty liver treatment poultry digestive supplement Kenya" />
                      <h4 className="entry__title" style={{marginLeft: '110px'}}>K-DIGEST</h4>
                    </div>
                    <div className="entry__info">
                      <div className="entry__cat">NATURAL SOLUTION</div>
                      <h4 className="entry__title">K-DIGEST</h4>
                    </div>
                  </a>
                </article>

                <article className="brick brick--double entry">
                  <a href="/products/nitritic" className="entry__page-link">
                    <div className="entry__thumb">
                      <img src="/products/nitritic.png" style={{height: '375px'}} alt="NITRITIC natural antibiotic alternative E.coli Salmonella treatment poultry Kenya" />
                      <h4 className="entry__title" style={{marginLeft: '110px'}}>NITRITIC</h4>
                    </div>
                    <div className="entry__info">
                      <div className="entry__cat">NATURAL SOLUTION</div>
                      <h4 className="entry__title">NITRITIC</h4>
                    </div>
                  </a>
                </article>

                <article className="brick brick--double entry">
                  <a href="/products/gonat" className="entry__page-link">
                    <div className="entry__thumb">
                      <img src="/products/gonat.png" style={{height: '375px'}} alt="GONAT garlic onion extract poultry immunity booster natural supplement Kenya" />
                      <h4 className="entry__title" style={{marginLeft: '110px'}}>GONAT</h4>
                    </div>
                    <div className="entry__info">
                      <div className="entry__cat">NATURAL SOLUTION</div>
                      <h4 className="entry__title">GONAT</h4>
                    </div>
                  </a>
                </article>

                <article className="brick brick--double entry">
                  <a href="/products/biogard-99" className="entry__page-link">
                    <div className="entry__thumb">
                      <img src="/products/biogar99.png" style={{height: '375px'}} alt="BIOGARD 99 herbal immunity booster viral disease prevention livestock Kenya" />
                      <h4 className="entry__title" style={{marginLeft: '110px'}}>BIOGARD 99</h4>
                    </div>
                    <div className="entry__info">
                      <div className="entry__cat">NATURAL SOLUTION</div>
                      <h4 className="entry__title">BIOGARD 99</h4>
                    </div>
                  </a>
                </article>
              </div>
            </div>
          </div>

          {/* Modal Templates */}
          <div id="modal-01" hidden>
            <div className="modal-popup" style={{display: 'flex', alignItems: 'center', gap: '32px', maxWidth: '700px'}}>
              <img src="/images/folio/advice.png" alt="ADVICE supplement product" style={{width: '250px', height: 'auto', borderRadius: '8px', objectFit: 'cover'}} />
              <div className="modal-popup__desc">
                <h5>ADVICE</h5>
                <p>ADVICE is an additive formulated to be mixed with drinking water. It is produced with natural extracts (Cinnamon, Garlic, Echinacea, Astargalus, Aloe vera, citric) plus Lectin, and Amantadine.<br />Treats virus diseases of common cold, influenza, Newcastle disease (ND), etc.</p>
              </div>
            </div>
          </div>

          <div id="modal-02" hidden>
            <div className="modal-popup" style={{display: 'flex', alignItems: 'center', gap: '32px', maxWidth: '700px'}}>
              <img src="/products/mix.png" alt="MIX-5 supplement product" style={{width: '250px', height: 'auto', borderRadius: '8px', objectFit: 'cover'}} />
              <div className="modal-popup__desc">
                <h5>MIX-5</h5>
                <p>Relieves Respiratory Symptoms<br /><br />MIX5 is recommended for prevention and help in the treatment of respiratory problems of different etiology.<br /><br />MIX5 reduces the undesirable effects of post-vaccination reaction, diminish contamination of drinking water, and alleviate heat stress.</p>
              </div>
            </div>
          </div>

          <div id="modal-03" hidden>
            <div className="modal-popup" style={{display: 'flex', alignItems: 'center', gap: '32px', maxWidth: '700px'}}>
              <img src="/products/Bio-Gar_1kg.png" alt="BIO-GAR supplement product" style={{width: '250px', height: 'auto', borderRadius: '8px', objectFit: 'cover'}} />
              <div className="modal-popup__desc">
                <h5>BIO-GAR</h5>
                <p>BIO-GAR is a natural feed supplement designed to enhance gut health and overall well-being in poultry. Formulated with a unique blend of probiotics, prebiotics, and essential nutrients.</p>
              </div>
            </div>
          </div>

          <div id="modal-04" hidden>
            <div className="modal-popup" style={{display: 'flex', alignItems: 'center', gap: '32px', maxWidth: '700px'}}>
              <img src="/products/immusol.png" alt="IMMUSOL supplement product" style={{width: '250px', height: 'auto', borderRadius: '8px', objectFit: 'cover'}} />
              <div className="modal-popup__desc">
                <h5>IMMUSOL</h5>
                <p>IMMUSOL contains a combination Mixed extract of medicinal plants is better for immunomodulatory response against ND, IB, and IBD and to reduce coccidial oocysts burden, without affecting growth of the broilers.</p>
              </div>
            </div>
          </div>

          <div id="modal-05" hidden>
            <div className="modal-popup" style={{display: 'flex', alignItems: 'center', gap: '32px', maxWidth: '700px'}}>
              <img src="/products/k-digest.png" alt="K-DIGEST supplement product" style={{width: '250px', height: 'auto', borderRadius: '8px', objectFit: 'cover'}} />
              <div className="modal-popup__desc">
                <h5>K-DIGEST</h5>
                <p>K-Digest is a dietetic liquid supplement formulated to correct fatty liver conditions, prevent liver dysfunctions and correct digestive disturbances in animals when fed a lithogenic diet (high in oil, fat, cholesterol, and cholic acid), leading to an increased supply of free fatty acids to hepatic cells.</p>
              </div>
            </div>
          </div>

          <div id="modal-06" hidden>
            <div className="modal-popup" style={{display: 'flex', alignItems: 'center', gap: '32px', maxWidth: '700px'}}>
              <img src="/products/nitritic.png" alt="NITRITIC supplement product" style={{width: '250px', height: 'auto', borderRadius: '8px', objectFit: 'cover'}} />
              <div className="modal-popup__desc">
                <h5>NITRITIC</h5>
                <p>Nitritic is a natural antibiotic that kills harmful germs like E. coli and Salmonella, detoxifying heavy metals, boosting animal health and immunity, stimulating appetite and growth, and preventing mold and pests—making it an effective, long-term alternative to antibiotics.</p>
              </div>
            </div>
          </div>

          <div id="modal-27" hidden>
            <div className="modal-popup" style={{display: 'flex', alignItems: 'center', gap: '32px', maxWidth: '700px'}}>
              <img src="/products/gonat.png" alt="GONAT supplement product" style={{width: '250px', height: 'auto', borderRadius: '8px', objectFit: 'cover'}} />
              <div className="modal-popup__desc">
                <h5>GONAT</h5>
                <p>GONAT is a unique immune-boosting oral supplement derived from garlic and onion extracts. This liquid formulation is specially created to strengthen animals&apos; natural defenses against disease while promoting better overall performance.</p>
              </div>
            </div>
          </div>

          <div id="modal-28" hidden>
            <div className="modal-popup" style={{display: 'flex', alignItems: 'center', gap: '32px', maxWidth: '700px'}}>
              <img src="/products/biogar99.png" alt="BIOGARD 99 supplement product" style={{width: '250px', height: 'auto', borderRadius: '8px', objectFit: 'cover'}} />
              <div className="modal-popup__desc">
                <h5>BIOGARD 99</h5>
                <p>BIOGARD99 is a powerful herbal liquid supplement designed to enhance immunity and protect livestock against a range of viral and microbial diseases.</p>
              </div>
            </div>
          </div>

          <h3 id="supplements" className="column lg-12 section-header__pretitle pretitle text-pretitle">SUPPLEMENTS</h3>
          <div id="bricks-supplements" className="row bricks">
            <div className="column lg-12 masonry">
              <div className="bricks-wrapper">
                <div className="grid-sizer"></div>

                <article className="brick brick--double entry">
                  <a href="/products/ade-3" className="entry__page-link">
                    <div className="entry__thumb">
                      <img src="/products/AD3E.png" alt="ADE-3 poultry vitamins A D3 E for egg production hatchability Kenya" />
                      <h4 className="entry__title" style={{marginLeft: '110px'}}>ADE-3</h4>
                    </div>
                    <div className="entry__info">
                      <div className="entry__cat">SUPPLEMENT</div>
                      <h4 className="entry__title">ADE-3</h4>
                    </div>
                  </a>
                </article>

                <article className="brick brick--double entry">
                  <a href="/products/agritonic" className="entry__page-link">
                    <div className="entry__thumb">
                      <img src="/products/agritonic_1l.png" style={{height: '375px'}} alt="AGRITONIC broiler weight gain feed supplement poultry productivity Kenya" />
                      <h4 className="entry__title" style={{marginLeft: '90px'}}>AGRITONIC</h4>
                    </div>
                    <div className="entry__info">
                      <div className="entry__cat">SUPPLEMENT</div>
                      <h4 className="entry__title">AGRITONIC</h4>
                    </div>
                  </a>
                </article>

                <article className="brick brick--double entry">
                  <a href="/products/agrivitam" className="entry__page-link">
                    <div className="entry__thumb">
                      <img src="/products/agrivitam_1l.png" style={{height: '375px'}} alt="AGRIVITAM poultry vitamins stress recovery layer egg production Kenya" />
                      <h4 className="entry__title" style={{marginLeft: '90px'}}>AGRIVITAM</h4>
                    </div>
                    <div className="entry__info">
                      <div className="entry__cat">SUPPLEMENT</div>
                      <h4 className="entry__title">AGRIVITAM</h4>
                    </div>
                  </a>
                </article>

                <article className="brick brick--double entry">
                  <a href="/products/antistrs-300" className="entry__page-link">
                    <div className="entry__thumb">
                      <img src="/products/antistrs-300.png" style={{height: '375px'}} alt="ANTISTRS-300 anti-stress formula poultry heat stress vaccination recovery Kenya" />
                      <h4 className="entry__title" style={{marginLeft: '70px'}}>ANTISTRS-300</h4>
                    </div>
                    <div className="entry__info">
                      <div className="entry__cat">SUPPLEMENT</div>
                      <h4 className="entry__title">ANTISTRS-300</h4>
                    </div>
                  </a>
                </article>

                <article className="brick brick--double entry">
                  <a href="/products/toxinil" className="entry__page-link">
                    <div className="entry__thumb">
                      <img src="/products/toxinil.png" style={{height: '375px'}} alt="TOXINIL mycotoxin binder aflatoxin prevention poultry feed safety Kenya" />
                      <h4 className="entry__title" style={{marginLeft: '90px'}}>TOXINIL</h4>
                    </div>
                    <div className="entry__info">
                      <div className="entry__cat">SUPPLEMENT</div>
                      <h4 className="entry__title">TOXINIL</h4>
                    </div>
                  </a>
                </article>

                <article className="brick brick--double entry">
                  <a href="/products/re-cover" className="entry__page-link">
                    <div className="entry__thumb">
                      <img src="/products/re-cover.png" style={{height: '375px'}} alt="RE-COVER disease recovery supplement poultry livestock rapid healing Kenya" />
                      <h4 className="entry__title" style={{marginLeft: '90px'}}>RE-COVER</h4>
                    </div>
                    <div className="entry__info">
                      <div className="entry__cat">SUPPLEMENT</div>
                      <h4 className="entry__title">RE-COVER</h4>
                    </div>
                  </a>
                </article>

                <article className="brick brick--double entry">
                  <a href="/products/optimum-24" className="entry__page-link">
                    <div className="entry__thumb">
                      <img src="/products/Optimum-24.png" style={{height: '375px'}} alt="OPTIMUM-24 energy booster poultry performance enhancer broiler production Kenya" />
                      <h4 className="entry__title" style={{marginLeft: '80px'}}>OPTIMUM-24</h4>
                    </div>
                    <div className="entry__info">
                      <div className="entry__cat">SUPPLEMENT</div>
                      <h4 className="entry__title">OPTIMUM-24</h4>
                    </div>
                  </a>
                </article>

                <article className="brick brick--double entry">
                  <a href="/products/threonine" className="entry__page-link">
                    <div className="entry__thumb">
                      <img src="/products/therionine.png" style={{height: '375px'}} alt="THREONINE amino acid poultry gut health immune function supplement Kenya" />
                      <h4 className="entry__title" style={{marginLeft: '80px'}}>THREONINE</h4>
                    </div>
                    <div className="entry__info">
                      <div className="entry__cat">SUPPLEMENT</div>
                      <h4 className="entry__title">THREONINE</h4>
                    </div>
                  </a>
                </article>

                <article className="brick brick--double entry">
                  <a href="/products/betaine" className="entry__page-link">
                    <div className="entry__thumb">
                      <img src="/products/betaine.png" style={{height: '375px'}} alt="BETAINE heat stress relief poultry feed efficiency liver health Kenya" />
                      <h4 className="entry__title" style={{marginLeft: '90px'}}>BETAINE</h4>
                    </div>
                    <div className="entry__info">
                      <div className="entry__cat">SUPPLEMENT</div>
                      <h4 className="entry__title">BETAINE</h4>
                    </div>
                  </a>
                </article>

                <article className="brick brick--double entry">
                  <a href="/products/choline-chloride" className="entry__page-link">
                    <div className="entry__thumb">
                      <img src="/products/chlorine-chloride.png" style={{height: '375px'}} alt="CHOLINE CHLORIDE fatty liver prevention egg production poultry supplement Kenya" />
                      <h4 className="entry__title" style={{marginLeft: '50px'}}>CHOLINE CHLORIDE</h4>
                    </div>
                    <div className="entry__info">
                      <div className="entry__cat">SUPPLEMENT</div>
                      <h4 className="entry__title">CHOLINE CHLORIDE</h4>
                    </div>
                  </a>
                </article>

                <article className="brick brick--double entry">
                  <a href="/products/dl-methionine" className="entry__page-link">
                    <div className="entry__thumb">
                      <img src="/products/Dl-Methionine.png" style={{height: '375px'}} alt="DL-METHIONINE amino acid feather development poultry growth supplement Kenya" />
                      <h4 className="entry__title" style={{marginLeft: '50px'}}>DL-METHIONINE</h4>
                    </div>
                    <div className="entry__info">
                      <div className="entry__cat">SUPPLEMENT</div>
                      <h4 className="entry__title">DL-METHIONINE</h4>
                    </div>
                  </a>
                </article>
              </div>
            </div>
          </div>

          <div id="modal-23" hidden>
            <div className="modal-popup" style={{display: 'flex', alignItems: 'center', gap: '32px', maxWidth: '700px'}}>
              <img src="/products/AD3E.png" alt="ADE-3 supplement product" style={{width: '250px', height: 'auto', borderRadius: '8px', objectFit: 'cover'}} />
              <div className="modal-popup__desc">
                <h5>ADE-3</h5>
                <p>Effective for vitamin deficiencies in farm animals for growth rate promotion, enhancement of performance and feed efficiency.<br /><br />Supports poultry health by preventing vitamin deficiencies, boosting disease resistance, and improving egg production and hatchability.</p>
              </div>
            </div>
          </div>

          <div id="modal-25" hidden>
            <div className="modal-popup" style={{display: 'flex', alignItems: 'center', gap: '32px', maxWidth: '700px'}}>
              <img src="/products/agritonic_1l.png" alt="AGRITONIC supplement product" style={{width: '250px', height: 'auto', borderRadius: '8px', objectFit: 'cover'}} />
              <div className="modal-popup__desc">
                <h5>AGRITONIC</h5>
                <p>Agritonic is a powerful liquid feed supplement formulated to support optimal poultry health and productivity.</p>
              </div>
            </div>
          </div>

          <div id="modal-26" hidden>
            <div className="modal-popup" style={{display: 'flex', alignItems: 'center', gap: '32px', maxWidth: '700px'}}>
              <img src="/products/agrivitam_1l.png" alt="AGRIVITAM supplement product" style={{width: '250px', height: 'auto', borderRadius: '8px', objectFit: 'cover'}} />
              <div className="modal-popup__desc">
                <h5>AGRIVITAM</h5>
                <p>AGRIVITAM is a premium liquid vitamin and mineral supplement designed to support the overall health and productivity of poultry.</p>
              </div>
            </div>
          </div>

          <div id="modal-29" hidden>
            <div className="modal-popup" style={{display: 'flex', alignItems: 'center', gap: '32px', maxWidth: '700px'}}>
              <img src="/products/agritoxinil.png" alt="AGRITOXINIL supplement product" style={{width: '250px', height: 'auto', borderRadius: '8px', objectFit: 'cover'}} />
              <div className="modal-popup__desc">
                <h5>AGRITOXINIL</h5>
                <p>AGRITOXINIL is a powerful mycotoxin binder formulated to protect livestock from the harmful effects of mycotoxins in contaminated feed, improving animal health and performance.</p>
              </div>
            </div>
          </div>

          <div id="modal-30" hidden>
            <div className="modal-popup" style={{display: 'flex', alignItems: 'center', gap: '32px', maxWidth: '700px'}}>
              <img src="/products/antistrs-300.png" alt="ANTISTRS-300 supplement product" style={{width: '250px', height: 'auto', borderRadius: '8px', objectFit: 'cover'}} />
              <div className="modal-popup__desc">
                <h5>ANTISTRS-300</h5>
                <p>ANTISTRS-300 is an advanced anti-stress formula that helps animals cope with environmental, nutritional, and physiological stress, promoting better performance and recovery.</p>
              </div>
            </div>
          </div>

          <div id="modal-31" hidden>
            <div className="modal-popup" style={{display: 'flex', alignItems: 'center', gap: '32px', maxWidth: '700px'}}>
              <img src="/products/toxinil.png" alt="TOXINIL supplement product" style={{width: '250px', height: 'auto', borderRadius: '8px', objectFit: 'cover'}} />
              <div className="modal-popup__desc">
                <h5>TOXINIL</h5>
                <p>TOXINIL is a comprehensive toxin binder that effectively neutralizes mycotoxins and other harmful substances in feed, protecting animal health and enhancing productivity.</p>
              </div>
            </div>
          </div>

          <div id="modal-32" hidden>
            <div className="modal-popup" style={{display: 'flex', alignItems: 'center', gap: '32px', maxWidth: '700px'}}>
              <img src="/products/re-cover.png" alt="RE-COVER supplement product" style={{width: '250px', height: 'auto', borderRadius: '8px', objectFit: 'cover'}} />
              <div className="modal-popup__desc">
                <h5>RE-COVER</h5>
                <p>RE-COVER is a specialized recovery formula designed to help animals bounce back quickly from disease, stress, or treatment, restoring energy and promoting rapid recovery.</p>
              </div>
            </div>
          </div>

          <div id="modal-33" hidden>
            <div className="modal-popup" style={{display: 'flex', alignItems: 'center', gap: '32px', maxWidth: '700px'}}>
              <img src="/products/Optimum-24.png" alt="OPTIMUM-24 supplement product" style={{width: '250px', height: 'auto', borderRadius: '8px', objectFit: 'cover'}} />
              <div className="modal-popup__desc">
                <h5>OPTIMUM-24</h5>
                <p>OPTIMUM-24 is a 24-hour energy and performance booster that provides sustained support for animals during periods of high demand, ensuring optimal productivity.</p>
              </div>
            </div>
          </div>

          <h3 id="feed-additives" className="column lg-12 section-header__pretitle pretitle text-pretitle">FEED ADDITIVES</h3>
          <div id="bricks" className="row bricks">
            <div className="column lg-12 masonry">
              <div className="bricks-wrapper">
                <div className="grid-sizer"></div>

                <article className="brick brick--double entry">
                  <a href="/products/dcp-18" className="entry__page-link">
                    <div className="entry__thumb">
                      <img src="/products/dcp18.png" style={{height: '375px'}} alt="DCP 18 dicalcium phosphate calcium phosphorus strong bones poultry Kenya" />
                      <h4 className="entry__title" style={{marginLeft: '90px'}}>DCP 18</h4>
                    </div>
                    <div className="entry__info">
                      <div className="entry__cat">FEED ADDITIVE</div>
                      <h4 className="entry__title">DCP 18</h4>
                    </div>
                  </a>
                </article>

                <article className="brick brick--double entry">
                  <a href="/products/agritoxinilstop" className="entry__page-link">
                    <div className="entry__thumb">
                      <img src="/products/agritoxinil.png" style={{height: '375px'}} alt="AGRITOXINILSTOP mycotoxin binder aflatoxin prevention feed safety poultry Kenya" />
                      <h4 className="entry__title" style={{marginLeft: '80px'}}>AGRITOXINILSTOP</h4>
                    </div>
                    <div className="entry__info">
                      <div className="entry__cat">FEED ADDITIVE</div>
                      <h4 className="entry__title">AGRITOXINILSTOP</h4>
                    </div>
                  </a>
                </article>

                <article className="brick brick--double entry">
                  <a href="/products/lysine" className="entry__page-link">
                    <div className="entry__thumb">
                      <img src="/products/lysine.png" style={{height: '375px'}} alt="LYSINE amino acid muscle development broiler growth feed efficiency Kenya" />
                      <h4 className="entry__title" style={{marginLeft: '100px'}}>LYSINE</h4>
                    </div>
                    <div className="entry__info">
                      <div className="entry__cat">FEED ADDITIVE</div>
                      <h4 className="entry__title">LYSINE</h4>
                    </div>
                  </a>
                </article>

                <article className="brick brick--double entry">
                  <a href="/products/methionine" className="entry__page-link">
                    <div className="entry__thumb">
                      <img src="/products/methionine.png" style={{height: '375px'}} alt="METHIONINE amino acid feather development protein metabolism poultry Kenya" />
                      <h4 className="entry__title" style={{marginLeft: '80px'}}>METHIONINE</h4>
                    </div>
                    <div className="entry__info">
                      <div className="entry__cat">FEED ADDITIVE</div>
                      <h4 className="entry__title">METHIONINE</h4>
                    </div>
                  </a>
                </article>

                <article className="brick brick--double entry">
                  <a href="/products/agrifinisher" className="entry__page-link">
                    <div className="entry__thumb">
                      <img src="/products/agrifinisher.png" style={{height: '375px'}} alt="AGRIFINISHER broiler finisher feed additive weight gain meat production Kenya" />
                      <h4 className="entry__title" style={{marginLeft: '80px'}}>AGRIFINISHER</h4>
                    </div>
                    <div className="entry__info">
                      <div className="entry__cat">FEED ADDITIVE</div>
                      <h4 className="entry__title">AGRIFINISHER</h4>
                    </div>
                  </a>
                </article>

                <article className="brick brick--double entry">
                  <a href="/products/agrigrower" className="entry__page-link">
                    <div className="entry__thumb">
                      <img src="/products/agrigrower.png" style={{height: '375px'}} alt="AGRIGROWER poultry grower feed additive optimal growth development Kenya" />
                      <h4 className="entry__title" style={{marginLeft: '80px'}}>AGRIGROWER</h4>
                    </div>
                    <div className="entry__info">
                      <div className="entry__cat">FEED ADDITIVE</div>
                      <h4 className="entry__title">AGRIGROWER</h4>
                    </div>
                  </a>
                </article>

                <article className="brick brick--double entry">
                  <a href="/products/agripig-sow" className="entry__page-link">
                    <div className="entry__thumb">
                      <img src="/products/agripig-sow.png" style={{height: '375px'}} alt="AGRIPIG-SOW pig sow feed supplement reproduction lactation performance Kenya" />
                      <h4 className="entry__title" style={{marginLeft: '80px'}}>AGRIPIG-SOW</h4>
                    </div>
                    <div className="entry__info">
                      <div className="entry__cat">FEED ADDITIVE</div>
                      <h4 className="entry__title">AGRIPIG-SOW</h4>
                    </div>
                  </a>
                </article>

                <article className="brick brick--double entry">
                  <a href="/products/agristarter" className="entry__page-link">
                    <div className="entry__thumb">
                      <img src="/products/agristarter.png" style={{height: '375px'}} alt="AGRISTARTER chick starter feed additive early growth development poultry Kenya" />
                      <h4 className="entry__title" style={{marginLeft: '80px'}}>AGRISTARTER</h4>
                    </div>
                    <div className="entry__info">
                      <div className="entry__cat">FEED ADDITIVE</div>
                      <h4 className="entry__title">AGRISTARTER</h4>
                    </div>
                  </a>
                </article>

                <article className="brick brick--double entry">
                  <a href="/products/agrilayer" className="entry__page-link">
                    <div className="entry__thumb">
                      <img src="/products/agrilayer.png" style={{height: '375px'}} alt="AGRILAYER layer feed supplement egg production strong eggshells poultry Kenya" />
                      <h4 className="entry__title" style={{marginLeft: '80px'}}>AGRILAYER</h4>
                    </div>
                    <div className="entry__info">
                      <div className="entry__cat">FEED ADDITIVE</div>
                      <h4 className="entry__title">AGRILAYER</h4>
                    </div>
                  </a>
                </article>
              </div>
            </div>
          </div>

          <div id="modal-17" hidden>
            <div className="modal-popup" style={{display: 'flex', alignItems: 'center', gap: '32px', maxWidth: '700px'}}>
              <img src="/products/dcp18.png" alt="DCP 18 supplement product" style={{width: '250px', height: 'auto', borderRadius: '8px', objectFit: 'cover'}} />
              <div className="modal-popup__desc">
                <h5>DCP 18</h5>
                <p>DCP 18 is a feed-grade dicalcium phosphate supplement containing 18% phosphorus and 21% calcium in highly absorbable forms. It supports strong bones, growth, and overall development in poultry, swine, cattle, and other livestock.</p>
              </div>
            </div>
          </div>

          <div id="modal-34" hidden>
            <div className="modal-popup" style={{display: 'flex', alignItems: 'center', gap: '32px', maxWidth: '700px'}}>
              <img src="/products/lysine.png" alt="LYSINE feed additive product" style={{width: '250px', height: 'auto', borderRadius: '8px', objectFit: 'cover'}} />
              <div className="modal-popup__desc">
                <h5>LYSINE</h5>
                <p>Lysine is an essential amino acid critical for protein synthesis, muscle development, and overall growth in livestock. It enhances feed efficiency and supports optimal production performance.</p>
              </div>
            </div>
          </div>

          <div id="modal-35" hidden>
            <div className="modal-popup" style={{display: 'flex', alignItems: 'center', gap: '32px', maxWidth: '700px'}}>
              <img src="/products/methionine.png" alt="METHIONINE feed additive product" style={{width: '250px', height: 'auto', borderRadius: '8px', objectFit: 'cover'}} />
              <div className="modal-popup__desc">
                <h5>METHIONINE</h5>
                <p>Methionine is a vital amino acid that supports protein metabolism, feather development in poultry, and optimal liver function. It improves feed conversion and promotes healthy growth.</p>
              </div>
            </div>
          </div>

          <div id="modal-36" hidden>
            <div className="modal-popup" style={{display: 'flex', alignItems: 'center', gap: '32px', maxWidth: '700px'}}>
              <img src="/products/therionine.png" alt="THREONINE feed additive product" style={{width: '250px', height: 'auto', borderRadius: '8px', objectFit: 'cover'}} />
              <div className="modal-popup__desc">
                <h5>THREONINE</h5>
                <p>Threonine is an essential amino acid that supports immune function, intestinal health, and protein balance in livestock. It enhances nutrient absorption and overall animal welfare.</p>
              </div>
            </div>
          </div>

          <div id="modal-37" hidden>
            <div className="modal-popup" style={{display: 'flex', alignItems: 'center', gap: '32px', maxWidth: '700px'}}>
              <img src="/products/betaine.png" alt="BETAINE feed additive product" style={{width: '250px', height: 'auto', borderRadius: '8px', objectFit: 'cover'}} />
              <div className="modal-popup__desc">
                <h5>BETAINE</h5>
                <p>Betaine is a natural compound that improves nutrient utilization, supports liver health, and helps animals cope with heat stress. It enhances feed efficiency and promotes consistent performance.</p>
              </div>
            </div>
          </div>

          <div id="modal-38" hidden>
            <div className="modal-popup" style={{display: 'flex', alignItems: 'center', gap: '32px', maxWidth: '700px'}}>
              <img src="/products/chlorine-chloride.png" alt="CHOLINE CHLORIDE feed additive product" style={{width: '250px', height: 'auto', borderRadius: '8px', objectFit: 'cover'}} />
              <div className="modal-popup__desc">
                <h5>CHOLINE CHLORIDE</h5>
                <p>Choline Chloride is essential for fat metabolism, liver function, and nerve transmission in animals. It prevents fatty liver disease and supports optimal growth and egg production.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}