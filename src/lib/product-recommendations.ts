export interface RecommendedProduct {
  name: string;
  slug: string;
  image: string;
  category: string;
  description: string;
}

const products: RecommendedProduct[] = [
  { name: 'ADVICE', slug: 'advice', image: '/images/folio/advice.png', category: 'Natural Solution', description: 'Natural treatment for Newcastle disease and viral infections' },
  { name: 'MIX-5', slug: 'mix-5', image: '/products/mix.png', category: 'Natural Solution', description: 'Relief for respiratory symptoms and infections in poultry' },
  { name: 'BIO-GAR', slug: 'bio-gar', image: '/products/Bio-Gar_1kg.png', category: 'Natural Solution', description: 'Natural supplement for gut health and coccidiosis prevention' },
  { name: 'IMMUSOL', slug: 'immusol', image: '/products/immusol.png', category: 'Natural Solution', description: 'Immunity booster against Newcastle, Gumboro and coccidiosis' },
  { name: 'K-DIGEST', slug: 'k-digest', image: '/products/k-digest.png', category: 'Natural Solution', description: 'Liver health and digestive support for poultry and livestock' },
  { name: 'NITRITIC', slug: 'nitritic', image: '/products/nitritic.png', category: 'Natural Solution', description: 'Natural antibiotic alternative against E.coli and Salmonella' },
  { name: 'GONAT', slug: 'gonat', image: '/products/gonat.png', category: 'Natural Solution', description: 'Garlic and onion extract immunity booster for animals' },
  { name: 'BIOGARD 99', slug: 'biogard-99', image: '/products/biogar99.png', category: 'Natural Solution', description: 'Herbal immunity booster for viral disease prevention' },
  { name: 'ADE-3', slug: 'ade-3', image: '/products/AD3E.png', category: 'Supplement', description: 'Vitamins A, D3 & E for egg production and growth promotion' },
  { name: 'AGRITONIC', slug: 'agritonic', image: '/products/agritonic_1l.png', category: 'Supplement', description: 'Feed supplement for optimal poultry health and productivity' },
  { name: 'AGRIVITAM', slug: 'agrivitam', image: '/products/agrivitam_1l.png', category: 'Supplement', description: 'Vitamin and mineral supplement for stress recovery' },
  { name: 'ANTISTRS-300', slug: 'antistrs-300', image: '/products/antistrs-300.png', category: 'Supplement', description: 'Anti-stress formula for heat stress and vaccination recovery' },
  { name: 'TOXINIL', slug: 'toxinil', image: '/products/toxinil.png', category: 'Supplement', description: 'Mycotoxin binder for feed safety and animal health' },
  { name: 'RE-COVER', slug: 're-cover', image: '/products/re-cover.png', category: 'Supplement', description: 'Recovery supplement for rapid healing after disease or stress' },
  { name: 'OPTIMUM-24', slug: 'optimum-24', image: '/products/Optimum-24.png', category: 'Supplement', description: 'Energy and performance booster for sustained productivity' },
  { name: 'BETAINE', slug: 'betaine', image: '/products/betaine.png', category: 'Supplement', description: 'Heat stress relief and liver health support' },
  { name: 'CHOLINE CHLORIDE', slug: 'choline-chloride', image: '/products/chlorine-chloride.png', category: 'Supplement', description: 'Prevents fatty liver and supports egg production' },
  { name: 'DL-METHIONINE', slug: 'dl-methionine', image: '/products/Dl-Methionine.png', category: 'Supplement', description: 'Essential amino acid for feather development and growth' },
  { name: 'DCP 18', slug: 'dcp-18', image: '/products/dcp18.png', category: 'Feed Additive', description: 'Calcium and phosphorus supplement for strong bones' },
  { name: 'LYSINE', slug: 'lysine', image: '/products/lysine.png', category: 'Feed Additive', description: 'Essential amino acid for muscle development and growth' },
  { name: 'METHIONINE', slug: 'methionine', image: '/products/methionine.png', category: 'Feed Additive', description: 'Amino acid for feather development and protein metabolism' },
  { name: 'AGRIFINISHER', slug: 'agrifinisher', image: '/products/agrifinisher.png', category: 'Feed Additive', description: 'Broiler finisher for maximum weight gain' },
  { name: 'AGRIGROWER', slug: 'agrigrower', image: '/products/agrigrower.png', category: 'Feed Additive', description: 'Grower feed additive for optimal development' },
  { name: 'AGRIPIG-SOW', slug: 'agripig-sow', image: '/products/agripig-sow.png', category: 'Feed Additive', description: 'Pig and sow feed supplement for reproduction and lactation' },
  { name: 'AGRISTARTER', slug: 'agristarter', image: '/products/agristarter.png', category: 'Feed Additive', description: 'Starter feed additive for chick early growth' },
  { name: 'AGRILAYER', slug: 'agrilayer', image: '/products/agrilayer.png', category: 'Feed Additive', description: 'Layer feed supplement for egg production and strong eggshells' },
];

// Keyword-to-product mapping — priority products: biogar, advice, mix-5, agritonic, agrivitam
const keywordMap: { keywords: string[]; productSlug: string }[] = [
  // ── Priority products ──────────────────────────────────────
  { keywords: ['newcastle', 'newcastle disease', 'viral', 'virus', 'herbal treatment'], productSlug: 'advice' },
  { keywords: ['respiratory', 'breathing', 'bronchitis', 'crd', 'cough', 'sneezing'], productSlug: 'mix-5' },
  { keywords: ['coccidiosis', 'coccidia', 'gut health', 'intestinal', 'diarrhea', 'worm', 'deworm', 'parasite', 'digestion', 'digestive'], productSlug: 'bio-gar' },
  { keywords: ['weight gain', 'broiler weight', 'productivity', 'performance', 'growth', 'feed conversion'], productSlug: 'agritonic' },
  { keywords: ['stress recovery', 'multivitamin', 'deficiency', 'nutritional', 'vitamin supplement', 'mineral supplement'], productSlug: 'agrivitam' },

  // ── Other products ─────────────────────────────────────────
  { keywords: ['gumboro', 'bursal', 'ibd', 'immunity', 'immune', 'vaccination', 'vaccine', 'biosecurity'], productSlug: 'immusol' },
  { keywords: ['liver', 'fatty liver'], productSlug: 'k-digest' },
  { keywords: ['e.coli', 'salmonella', 'bacterial', 'antibiotic'], productSlug: 'nitritic' },
  { keywords: ['mastitis', 'udder', 'milk quality', 'immune system'], productSlug: 'gonat' },
  { keywords: ['herbal', 'viral disease'], productSlug: 'biogard-99' },
  { keywords: ['vitamin a', 'vitamin d', 'vitamin e', 'hatchability', 'egg quality'], productSlug: 'ade-3' },
  { keywords: ['heat stress', 'hot season', 'summer', 'ventilation'], productSlug: 'antistrs-300' },
  { keywords: ['mycotoxin', 'aflatoxin', 'toxin', 'mold', 'feed safety'], productSlug: 'toxinil' },
  { keywords: ['recovery', 'disease recovery', 'healing'], productSlug: 're-cover' },
  { keywords: ['energy', 'performance booster'], productSlug: 'optimum-24' },
  { keywords: ['egg production', 'layer', 'laying hen'], productSlug: 'agrilayer' },
  { keywords: ['pig', 'swine', 'pork', 'sow', 'piggery'], productSlug: 'agripig-sow' },
];

// Category-level fallbacks — all point to priority products
const categoryFallbacks: Record<string, string> = {
  poultry: 'agritonic',
  dairy: 'agrivitam',
  livestock: 'bio-gar',
  nutrition: 'agrivitam',
  business: 'agritonic',
};

export function getRecommendedProduct(
  blogKeywords: string[],
  blogTitle: string,
  blogCategory?: string
): RecommendedProduct {
  const searchText = [...blogKeywords, blogTitle].join(' ').toLowerCase();

  // Score each keyword mapping
  let bestMatch: string | null = null;
  let bestScore = 0;

  for (const mapping of keywordMap) {
    let score = 0;
    for (const kw of mapping.keywords) {
      if (searchText.includes(kw.toLowerCase())) {
        score += kw.length; // Longer keyword matches = more specific = higher score
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = mapping.productSlug;
    }
  }

  // Use category fallback if no keyword match
  if (!bestMatch && blogCategory) {
    bestMatch = categoryFallbacks[blogCategory] || 'agritonic';
  }

  // Final fallback
  if (!bestMatch) {
    bestMatch = 'agritonic';
  }

  return products.find((p) => p.slug === bestMatch) || products[0];
}

