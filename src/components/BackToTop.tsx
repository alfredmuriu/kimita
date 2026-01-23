'use client';

export default function BackToTop() {
  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="ss-go-top">
      <a
        className="smoothscroll"
        title="Back to Top"
        href="#top"
        aria-label="Back to top of page"
        onClick={scrollToTop}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          style={{fill: 'rgba(0, 0, 0, 1)'}}
        >
          <path d="M6 4h12v2H6zm5 10v6h2v-6h5l-6-6-6 6z"></path>
        </svg>
        <span className="u-screen-reader-text">Back to Top</span>
      </a>
    </div>
  );
}
