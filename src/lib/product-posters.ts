// Pre-made product posters. For posts about a product that has a professionally
// designed poster (uploaded to public/images), we attach that poster verbatim
// instead of AI-generating one. Everything else falls back to an AI poster.
//
// The files live under public/images and are served at
// https://www.agrikima.co.ke/images/<file>. Filenames contain spaces, so the
// public URL is percent-encoded.

const SITE_URL = 'https://www.agrikima.co.ke'

// Each entry: the catalog slug, the file in public/images, and a matcher that
// spots the product in free text (topic / brief / poster headline). Only the
// four products below currently have a designed poster.
//
// `ambiguous` marks a product name that is also a common English word ("Advice")
// — those only match on Product-pillar posts, so generic use of the word doesn't
// wrongly attach the product poster.
const PRODUCT_POSTERS: { slug: string; file: string; pattern: RegExp; ambiguous?: boolean }[] = [
  { slug: 'advice',    file: 'Advice poster.jpeg',    pattern: /\badvice\b/i, ambiguous: true },
  { slug: 'bio-gar',   file: 'Biogar poster.jpeg',    pattern: /\bbio[-\s]?gar\b/i },
  { slug: 'mix-5',     file: 'Mix-5 poster.jpeg',     pattern: /\bmix[-\s]?5\b/i },
  { slug: 'agrivitam', file: 'agrivitam poster.jpeg', pattern: /\bagrivitam\b/i },
]

export interface ProductPosterMatch {
  slug: string
  url: string
}

// Returns the pre-made poster for the first product mentioned in the given text,
// or null if none of the four poster-backed products are referenced. Pass
// `isProductPost` (pillar === 'Product') so ambiguous names only match when the
// post is genuinely about a product.
export function findProductPoster(text: string, isProductPost = false): ProductPosterMatch | null {
  if (!text) return null
  for (const p of PRODUCT_POSTERS) {
    if (p.ambiguous && !isProductPost) continue
    if (p.pattern.test(text)) {
      return { slug: p.slug, url: `${SITE_URL}/images/${encodeURIComponent(p.file)}` }
    }
  }
  return null
}
