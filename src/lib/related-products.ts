export interface RelatedProduct {
  slug: string;
  name: string;
  image: string;
  category: string;
}

// Master product list
const ALL_PRODUCTS: RelatedProduct[] = [
  { slug: 'advice',         name: 'ADVICE',           image: '/images/folio/advice.png',   category: 'viral' },
  { slug: 'mix-5',          name: 'MIX-5',            image: '/products/mix.png',           category: 'viral' },
  { slug: 'biogard-99',     name: 'BIOGARD-99',       image: '/products/biogar99.png',      category: 'viral' },
  { slug: 'immusol',        name: 'IMMUSOL',          image: '/products/immusol.png',       category: 'viral' },
  { slug: 'bio-gar',        name: 'BIO-GAR',          image: '/products/Bio-Gar_1kg.png',   category: 'gut' },
  { slug: 'k-digest',       name: 'K-DIGEST',         image: '/products/k-digest.png',      category: 'gut' },
  { slug: 'gonat',          name: 'GONAT',            image: '/products/gonat.png',         category: 'gut' },
  { slug: 'agritonic',      name: 'AGRITONIC',        image: '/products/agritonic_1l.png',  category: 'growth' },
  { slug: 'agristarter',    name: 'AGRISTARTER',      image: '/products/agristarter.png',   category: 'growth' },
  { slug: 'agrigrower',     name: 'AGRIGROWER',       image: '/products/agrigrower.png',    category: 'growth' },
  { slug: 'agrifinisher',   name: 'AGRIFINISHER',     image: '/products/agrifinisher.png',  category: 'growth' },
  { slug: 'agrilayer',      name: 'AGRILAYER',        image: '/products/agrilayer.png',     category: 'layer' },
  { slug: 'choline-chloride', name: 'CHOLINE CHLORIDE', image: '/products/chlorine-chloride.png', category: 'layer' },
  { slug: 'dcp-18',         name: 'DCP-18',           image: '/products/dcp18.png',         category: 'layer' },
  { slug: 'agrivitam',      name: 'AGRIVITAM',        image: '/products/agrivitam_1l.png',  category: 'vitamins' },
  { slug: 'ade-3',          name: 'ADE-3',            image: '/products/AD3E.png',          category: 'vitamins' },
  { slug: 'antistrs-300',   name: 'ANTISTRS-300',     image: '/products/antistrs-300.png',  category: 'vitamins' },
  { slug: 're-cover',       name: 'RE-COVER',         image: '/products/re-cover.png',      category: 'vitamins' },
  { slug: 'lysine',         name: 'LYSINE',           image: '/products/lysine.png',        category: 'amino' },
  { slug: 'methionine',     name: 'METHIONINE',       image: '/products/methionine.png',    category: 'amino' },
  { slug: 'dl-methionine',  name: 'DL-METHIONINE',    image: '/products/Dl-Methionine.png', category: 'amino' },
  { slug: 'threonine',      name: 'THREONINE',        image: '/products/therionine.png',    category: 'amino' },
  { slug: 'betaine',        name: 'BETAINE',          image: '/products/betaine.png',       category: 'amino' },
  { slug: 'agritoxinilstop', name: 'AGRITOXINILSTOP', image: '/products/agritoxinil.png',   category: 'myco' },
  { slug: 'toxinil',        name: 'TOXINIL',          image: '/products/toxinil.png',       category: 'myco' },
  { slug: 'agripig-sow',    name: 'AGRIPIG-SOW',      image: '/products/agripig-sow.png',   category: 'pig' },
  { slug: 'nitritic',       name: 'NITRITIC',         image: '/products/nitritic.png',      category: 'specialty' },
  { slug: 'optimum-24',     name: 'OPTIMUM-24',       image: '/products/Optimum-24.png',    category: 'specialty' },
];

// For each product, return 3 related products (same category first, then others)
export function getRelatedProducts(currentSlug: string): RelatedProduct[] {
  const current = ALL_PRODUCTS.find(p => p.slug === currentSlug);
  if (!current) return [];

  const sameCategory = ALL_PRODUCTS.filter(
    p => p.slug !== currentSlug && p.category === current.category
  );
  const otherCategory = ALL_PRODUCTS.filter(
    p => p.slug !== currentSlug && p.category !== current.category
  );

  return [...sameCategory, ...otherCategory].slice(0, 3);
}
