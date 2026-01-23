import BackToTop from './BackToTop';

export default function Footer() {
  return (
    <footer id="footer" className="s-footer target-section">
      <div className="row section-header" style={{marginTop: '-100px'}}>
        <h3 className="column lg-12 section-header__pretitle text-pretitle">Get In Touch</h3>
        <div className="column lg-6 stack-on-1100 section-header__primary">
          <h2 className="title text-display-1">
            We&apos;re just a message away. Email to us at{' '}
            <a href="mailto:info@agrikima.co.ke" title="">info@agrikima.co.ke</a>
          </h2>
        </div>
        <div className="column lg-6 stack-on-1100 section-header__secondary">
          <div className="contact-block">
            <h6>Where To Find Us</h6>
            <p>
              Sky Park Plaza Westlands <br />
              Nairobi, Kenya <br />
              P.O BOX 7773-00200
            </p>
          </div>

          <div className="contact-block">
            <h6>Contact Us</h6>
            <ul className="contact-list">
              <li><a href="tel:+254 20 208 9181">&nbsp;+254 20 208 9181</a></li>
              <li><a href="tel:+254 20 208 9182">&nbsp;+254 20 208 9182</a></li>
              <li><a href="tel:+254 111 410 639">&nbsp;+254 111 410 639</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row list-block block-lg-one-half block-tab-whole block-stack-on-1000 s-footer__btns">
        <div className="column list-block__item">
          <div className="s-footer__contact-btn">
            <a href="https://wa.me/254111410639" className="btn btn--primary u-fullwidth" style={{fontSize: '10px', width: '250px', height: '60px', justifyContent: 'center', textAlign: 'center', display: 'inline-flex', alignItems: 'center'}}>
              Let&apos;s Talk
            </a>
          </div>
        </div>
      </div>

      <div className="row s-footer__bottom">
        <div className="column lg-6 tab-12 s-footer__bottom-left">
          <ul className="s-footer__social">
            <li>
              <a href="https://wa.me/254111410639" target="_blank" rel="noopener">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{fill: '#25D366'}}>
                  <path d="M20.52 3.48A11.77 11.77 0 0 0 12 0C5.37 0 0 5.37 0 12a11.93 11.93 0 0 0 1.64 6L0 24l6.26-1.64A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12a11.77 11.77 0 0 0-3.48-8.52zM12 22a9.93 9.93 0 0 1-5.09-1.39l-.36-.21-3.72.98.99-3.63-.23-.37A9.93 9.93 0 1 1 12 22zm5.47-7.14c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.48 1.07 2.91 1.22 3.11.15.2 2.1 3.21 5.09 4.38.71.31 1.26.5 1.69.64.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.41.25-.7.25-1.3.18-1.41-.07-.11-.27-.18-.57-.33z"/>
                </svg>
                <span className="u-screen-reader-text">WhatsApp</span>
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/AgriKimaSdnBhd/">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{fill: 'rgba(0, 0, 0, 1)'}}>
                  <path d="M20,3H4C3.447,3,3,3.448,3,4v16c0,0.552,0.447,1,1,1h8.615v-6.96h-2.338v-2.725h2.338v-2c0-2.325,1.42-3.592,3.5-3.592 c0.699-0.002,1.399,0.034,2.095,0.107v2.42h-1.435c-1.128,0-1.348,0.538-1.348,1.325v1.735h2.697l-0.35,2.725h-2.348V21H20 c0.553,0,1-0.448,1-1V4C21,3.448,20.553,3,20,3z"></path>
                </svg>
                <span className="u-screen-reader-text">Facebook</span>
              </a>
            </li>
            <li>
              <a href="https://x.com/AgrikimaB">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{fill: 'rgba(0, 0, 0, 1)'}}>
                  <path d="M19.633,7.997c0.013,0.175,0.013,0.349,0.013,0.523c0,5.325-4.053,11.461-11.46,11.461c-2.282,0-4.402-0.661-6.186-1.809 c0.324,0.037,0.636,0.05,0.973,0.05c1.883,0,3.616-0.636,5.001-1.721c-1.771-0.037-3.255-1.197-3.767-2.793 c0.249,0.037,0.499,0.062,0.761,0.062c0.361,0,0.724-0.05,1.061-0.137c-1.847-0.374-3.23-1.995-3.23-3.953v-0.05 c0.537,0.299,1.379,0.486,2.841,0.511C3.534,9.419,2.823,8.184,2.823,6.787c0-0.748,0.199-1.434,0.548-2.032 c1.983,2.443,4.964,4.04,8.306,4.215c-0.062-0.3-0.1-0.611-0.1-0.923c0-2.22,1.796-4.028,4.028-4.028 c1.16,0,2.207,0.486,2.943,1.272c0.91-0.175,1.782-0.512,2.556-0.973c-0.299,0.935-0.936,1.721-1.771,2.22 c0.811-0.088,1.597-0.312,2.319-0.624C21.104,6.712,20.419,7.423,19.633,7.997z"></path>
                </svg>
                <span className="u-screen-reader-text">Twitter</span>
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/company/agrikima/" target="_blank" rel="noopener">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{fill: '#0A66C2'}}>
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/>
                </svg>
                <span className="u-screen-reader-text">LinkedIn</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="column lg-6 tab-12 s-footer__bottom-right">
          <div className="ss-copyright">
            <span>© Copyright Agrikima 2025</span>
          </div>
        </div>
      </div>

      <BackToTop />
    </footer>
  );
}
