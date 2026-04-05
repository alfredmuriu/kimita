'use client';

interface ScrollDownButtonProps {
  targetId: string;
}

export default function ScrollDownButton({ targetId }: ScrollDownButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-10px', marginBottom: '30px' }}>
      <button type="button" className="scroll-pulse-btn" onClick={handleClick} aria-label="Scroll down">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" style={{ fill: '#fff' }}>
          <path d="M12 16l-6-6h12z" />
        </svg>
      </button>
    </div>
  );
}
