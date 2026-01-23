import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div id="page" className="s-pagewrap">
      <Header />
      <section id="content" className="s-content">
        {children}
      </section>
      <Footer />
    </div>
  );
}
