'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';

interface AccordionSection {
  title: string;
  content: React.ReactNode;
}

import { RelatedProduct } from '@/lib/related-products';

interface ProductPageLayoutProps {
  productName: string;
  productImage: string;
  productImageAlt: string;
  description: string;
  sections: AccordionSection[];
  relatedProducts?: RelatedProduct[];
}

export default function ProductPageLayout({
  productName,
  productImage,
  productImageAlt,
  description,
  sections,
  relatedProducts = [],
}: ProductPageLayoutProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    description: description,
    image: `https://www.agrikima.co.ke${productImage}`,
    brand: {
      '@type': 'Brand',
      name: 'Agrikima',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Agrikima',
      url: 'https://www.agrikima.co.ke',
    },
  };

  return (
    <Layout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <style dangerouslySetInnerHTML={{
        __html: `
        body, .s-header, .s-header__inner, .s-header__nav, .s-header__menu-links, .s-header__social, .dropdown-menu {
            background-color: #ffffff !important;
        }
        .s-header__menu-links a, .s-header__social .email {
            color: #111111 !important;
        }
        .s-header__menu-links li.current > a {
            color: #014d4b !important;
        }
        
        .s-header__social svg path {
            fill: #111111 !important;
        }
        .s-header__menu-toggle span, .s-header__menu-toggle span::before, .s-header__menu-toggle span::after { background-color: #111111 !important; }
        .s-header__menu-links > .dropdown > .dropdown-menu {
            background-color: #ffffff !important;
        }
        .s-header__menu-links > .dropdown > .dropdown-menu a {
            color: #111111 !important;
        }
        .s-header__menu-links > .dropdown > .dropdown-menu a:hover {
            color: #014d4b !important;
        }
        .related-products { padding: 60px 0 80px; border-top: 1px solid #f0f0f0; max-width: 960px; margin: 0 auto; }
        .related-products__title { font-size: 22px; font-weight: 700; color: #111; margin-bottom: 32px; }
        .related-products__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .related-product-card { border: 1px solid #ebebeb; border-radius: 12px; overflow: hidden; text-decoration: none; display: block; transition: transform 0.2s, box-shadow 0.2s; background: #f9f9f9; position: relative; }
        .related-product-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
        .related-product-card__img { width: 100%; height: 280px; object-fit: contain; padding: 28px 28px 80px; display: block; }
        .related-product-card__body { position: absolute; bottom: 0; left: 0; right: 0; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; background: #fff; border-top: 1px solid #ebebeb; }
        .related-product-card__name { font-size: 14px; font-weight: 600; color: #111 !important; }
        .related-product-card__arrow { width: 36px; height: 36px; border-radius: 50%; background: #014d4b; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        @media (max-width: 700px) { .related-products__grid { grid-template-columns: 1fr; } }
        `
      }} />
      <main className="product-detail-main">
        <div className="product-detail-container">
          
          {/* Back Navigation */}
          <div className="product-detail-back">
            <a href="/products" className="product-detail-back__link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back
            </a>
          </div>

          {/* Two Column Layout */}
          <div className="product-detail-layout">
            
            {/* Left Column - Fixed Image */}
            <div className="product-detail-image">
              <div className="product-detail-image__sticky">
                <img src={productImage} alt={productImageAlt} />
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="product-detail-info">
              <h1 className="product-detail-info__name">{productName}</h1>
              
              <p className="product-detail-info__description">{description}</p>

              {/* Accordion Sections */}
              <div className="product-accordion">
                {sections.map((section, index) => (
                  <div
                    key={index}
                    className={`product-accordion__item ${openIndex === index ? 'product-accordion__item--open' : ''}`}
                  >
                    <button
                      className="product-accordion__header"
                      onClick={() => toggleSection(index)}
                      aria-expanded={openIndex === index}
                    >
                      <span className="product-accordion__title">{section.title}</span>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`product-accordion__chevron ${openIndex === index ? 'product-accordion__chevron--rotated' : ''}`}
                      >
                        <path
                          d="M5 7.5L10 12.5L15 7.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <div className={`product-accordion__content ${openIndex === index ? 'product-accordion__content--visible' : ''}`}>
                      <div className="product-accordion__body">
                        {section.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Section */}
              <div className="product-detail-cta">
                <a href="tel:+254723405204" className="btn btn--primary product-detail-cta__btn">
                  Contact Us
                </a>
              </div>
            </div>
          </div>

        </div>

        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h2 className="related-products__title">Related products</h2>
            <div className="related-products__grid">
              {relatedProducts.map((p) => (
                <a key={p.slug} href={`/products/${p.slug}`} className="related-product-card">
                  <img src={p.image} alt={p.name} className="related-product-card__img" />
                  <div className="related-product-card__body">
                    <span className="related-product-card__name">{p.name}</span>
                    <span className="related-product-card__arrow">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
}
