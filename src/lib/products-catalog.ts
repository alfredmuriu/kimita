// Curated product catalog — used by both the WhatsApp bot brain (server)
// and the website chat widget (client) to keep slug → name mapping in sync.

export interface CatalogEntry {
  name: string;
  slug: string;
  purpose: string;
}

export const PRODUCT_CATALOG: CatalogEntry[] = [
  { name: 'ADVICE', slug: 'advice', purpose: 'Natural viral protection for poultry — Newcastle, IB, IBD' },
  { name: 'BIO-GAR', slug: 'bio-gar', purpose: 'Probiotic for gut health and natural coccidiosis prevention' },
  { name: 'AGRITONIC', slug: 'agritonic', purpose: 'Liquid tonic — appetite, growth, general poultry performance' },
  { name: 'AGRIVITAM', slug: 'agrivitam', purpose: 'Liquid vitamin + mineral supplement for stress recovery and layer productivity' },
  { name: 'IMMUSOL', slug: 'immusol', purpose: 'Herbal immunity booster for ND, IB, IBD and coccidia' },
  { name: 'BIOGARD-99', slug: 'biogard-99', purpose: 'Herbal antiviral/antimicrobial liquid — immune support' },
  { name: 'GONAT', slug: 'gonat', purpose: 'Garlic/onion extract — natural antimicrobial, antioxidant' },
  { name: 'K-DIGEST', slug: 'k-digest', purpose: 'Liver function and digestive stress support' },
  { name: 'RE-COVER', slug: 're-cover', purpose: 'Rehydration + heat-stress relief oral solution' },
  { name: 'OPTIMUM24', slug: 'optimum-24', purpose: 'Heat-stress supplement with paracetamol for fever' },
  { name: 'ANTISTRS-300', slug: 'antistrs-300', purpose: 'Anti-stress supplement for transport/vaccination/heat' },
  { name: 'MIX5', slug: 'mix-5', purpose: 'Multi-vitamin/mineral pre-mix for poultry' },
  { name: 'AGRISTARTER', slug: 'agristarter', purpose: 'Chick starter additive (first 14 days)' },
  { name: 'AGRIGROWER', slug: 'agrigrower', purpose: 'Grower phase additive (14–28 days)' },
  { name: 'AGRIFINISHER', slug: 'agrifinisher', purpose: 'Broiler finisher additive (28–42 days) — weight + meat quality' },
  { name: 'AGRILAYER', slug: 'agrilayer', purpose: 'Layer feed additive — egg production + shell quality' },
  { name: 'AGRIPIG-SOW', slug: 'agripig-sow', purpose: 'Breeding sow supplement — fertility, lactation' },
  { name: 'AGRITOXINILSTOP', slug: 'agritoxinilstop', purpose: 'Mycotoxin binder — aflatoxin / ochratoxin protection' },
  { name: 'TOXINIL', slug: 'toxinil', purpose: 'Acidifier for gut pH and mineral absorption' },
  { name: 'AD3E 100/20/20', slug: 'ade-3', purpose: 'Vitamins A/D3/E — deficiency, hatchability, stiff lamb' },
  { name: 'DCP-18', slug: 'dcp-18', purpose: 'Dicalcium phosphate — calcium/phosphorus for bones' },
  { name: 'BETAINE 50%', slug: 'betaine', purpose: 'Osmolyte — hydration, methyl donor, heat stress' },
  { name: 'CHOLINE CHLORIDE 70%', slug: 'choline-chloride', purpose: 'Fatty liver prevention, growth, fertility' },
  { name: 'DL-METHIONINE', slug: 'dl-methionine', purpose: 'Essential amino acid — meat quality, feed efficiency' },
  { name: 'METHIONINE', slug: 'methionine', purpose: 'Amino acid — protein metabolism, feather development' },
  { name: 'LYSINE', slug: 'lysine', purpose: 'Amino acid — muscle growth, feed efficiency' },
  { name: 'THREONINE 65%', slug: 'threonine', purpose: 'Third limiting amino acid — gut mucosa, immunity' },
  { name: 'NUTRITIC', slug: 'nitritic', purpose: 'Nutritional supplement for balanced performance' },
];

export function getProductBySlug(slug: string): CatalogEntry | undefined {
  return PRODUCT_CATALOG.find((p) => p.slug === slug);
}

// ─────────────────────────────────────────────────────────────────────────────
// CATALOGUE MESSAGE
//
// What the WhatsApp bot sends when a customer makes a general inquiry
// (e.g. taps the WhatsApp bubble on the website, or asks "what products
// do you have?"). The bot will send this verbatim, then offer to help
// the customer narrow down.
//
// EDIT THIS STRING with the final catalogue copy whenever you're ready.
// Keep it under ~4000 characters (WhatsApp's message limit).
// Plain text + URLs render as tappable links; markdown is NOT rendered.
// ─────────────────────────────────────────────────────────────────────────────
export const CATALOGUE_MESSAGE = `Karibu Agrikima! Here's a quick look at our natural animal-health range:

*POULTRY HEALTH*
• ADVICE — natural viral protection (Newcastle, IB, IBD)
• BIO-GAR — probiotic for gut health & coccidiosis prevention
• IMMUSOL — herbal immunity booster
• BIOGARD-99 — antiviral/antimicrobial liquid
• GONAT — garlic/onion natural antimicrobial

*TONICS & VITAMINS*
• AGRITONIC — liquid tonic for appetite & growth
• AGRIVITAM — vitamin + mineral supplement
• MIX5 — multi-vitamin/mineral pre-mix
• AD3E 100/20/20 — vitamin A/D3/E deficiency fix

*GROWTH-STAGE FEEDS*
• AGRISTARTER (0–14 days) · AGRIGROWER (14–28) · AGRIFINISHER (28–42) · AGRILAYER (layers) · AGRIPIG-SOW (breeding pigs)

*AMINO ACIDS & MINERALS*
• DL-METHIONINE · METHIONINE · LYSINE · THREONINE 65%
• DCP-18 (calcium/phosphorus) · CHOLINE CHLORIDE 70% · BETAINE 50%

*STRESS, HEAT & TOXIN CONTROL*
• RE-COVER · OPTIMUM24 · ANTISTRS-300 · AGRITOXINILSTOP · TOXINIL

Full details: https://www.agrikima.co.ke/products

Tell me what you're raising (poultry, pigs, cattle) or the problem you're solving, and I'll point you to the right product.`

