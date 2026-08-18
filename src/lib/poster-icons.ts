// Line-glyph icon set for the branded poster (src/lib/poster.ts).
//
// satori cannot render inline <svg> children reliably, so each icon is emitted
// as a standalone SVG document and embedded as a data URI on an <img>. Stroke
// colour is baked in at build time because CSS `currentColor` does not cross the
// <img> boundary.
//
// The glyphs are deliberately geometric and single-weight so a row of them reads
// as one designed set rather than clip-art.

const PATHS: Record<string, string> = {
  // generic
  check: '<path d="M4 12.5l5 5L20 6.5"/>',
  phone:
    '<path d="M6 3h4l2 5-2.5 1.8a12.5 12.5 0 004.7 4.7L16 12l5 2v4a2 2 0 01-2.2 2A17 17 0 013 5.2 2 2 0 015 3h1z"/>',
  // subject glyphs
  leaf: '<path d="M4 20C4 11 10 5 21 4c0 11-6 16-14 16H4z"/><path d="M4 20c3.5-4.5 7.5-7.5 12-9"/>',
  shield: '<path d="M12 3l7 3v6c0 4.2-3 7.4-7 9-4-1.6-7-4.8-7-9V6l7-3z"/><path d="M9 12l2.2 2.2L15.5 10"/>',
  droplet: '<path d="M12 3.2c3.8 4.8 6 8 6 10.8a6 6 0 11-12 0c0-2.8 2.2-6 6-10.8z"/>',
  sprout:
    '<path d="M12 21v-7"/><path d="M12 14c0-3-2.2-5-5.2-5C6.8 12 9 14 12 14z"/><path d="M12 14c0-3.8 2.6-6 6-6 0 3.8-2.6 6-6 6z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.5 1.5M17.6 17.6l1.5 1.5M19.1 4.9l-1.5 1.5M6.4 17.6l-1.5 1.5"/>',
  chart: '<path d="M4 4v16h16"/><path d="M7.5 15l3.5-3.8 3 2.8 5-6"/>',
  heart: '<path d="M12 20.5S4.5 16 4.5 10.8A4.3 4.3 0 0112 8a4.3 4.3 0 017.5 2.8c0 5.2-7.5 9.7-7.5 9.7z"/>',
  bolt: '<path d="M13.5 2L4.5 14H11l-1 8 9-12h-6.5l1-8z"/>',
  scale: '<path d="M12 4v16"/><path d="M6 20h12"/><path d="M4 9h16"/><path d="M4 9l-2 5a3.2 3.2 0 004 0L4 9z"/><path d="M20 9l-2 5a3.2 3.2 0 004 0L20 9z"/>',
}

// Keyword → glyph + strip label. First match wins, so order encodes priority: a
// bullet about "disease prevention in dairy" should read as health, not as dairy.
// The label is carried per keyword rather than per glyph because one glyph serves
// several meanings — a droplet is "Clean Water" for poultry and "Dairy Care" for
// a milk-yield bullet.
const KEYWORD_MAP: [RegExp, string, string][] = [
  [/\b(disease|health|vaccin|immun|prevent|protect|biosecur|parasit|worm|mastitis|amr|antibiotic)/i, 'shield', 'Animal Health'],
  [/\b(feed|nutrition|ration|mineral|vitamin|supplement|forage|silage|graz)/i, 'sprout', 'Nutrition'],
  [/\b(water|hydrat|drink|clean)/i, 'droplet', 'Clean Water'],
  [/\b(milk|dairy|litre|liter|udder)/i, 'droplet', 'Dairy Care'],
  [/\b(yield|profit|income|return|growth|grow|production|output|margin|market)/i, 'chart', 'Better Yields'],
  [/\b(natural|organic|herbal|plant|green|leaf|crop|pasture|soil)/i, 'leaf', 'Natural Inputs'],
  [/\b(heat|climate|season|dry|drought|sun|weather|rain)/i, 'sun', 'Climate Ready'],
  [/\b(care|welfare|comfort|calm|stress)/i, 'heart', 'Animal Welfare'],
  [/\b(breed|calv|kid|lamb|chick|genetic)/i, 'heart', 'Better Breeding'],
  [/\b(fast|quick|rapid|boost|energy|instant|speed)/i, 'bolt', 'Fast Results'],
  [/\b(dose|dosage|weigh|measur|balance|ratio|record)/i, 'scale', 'Right Dosage'],
]

const FALLBACKS: [string, string][] = [
  ['leaf', 'Natural Inputs'],
  ['sprout', 'Nutrition'],
  ['shield', 'Animal Health'],
  ['chart', 'Better Yields'],
]

// Pick the glyph + label that best fit a line of copy.
function matchIcon(text: string, index: number): { glyph: string; label: string } {
  for (const [re, glyph, label] of KEYWORD_MAP) {
    if (re.test(text)) return { glyph, label }
  }
  const [glyph, label] = FALLBACKS[index % FALLBACKS.length]
  return { glyph, label }
}

// Resolve a whole bullet list at once so the pictogram strip never shows the same
// glyph twice — two bullets that both mention feed ("Proper Feeding", "Lower Feed
// Costs") would otherwise render as two identical "Nutrition" tiles, which reads
// as a bug rather than a design.
export function iconsForBullets(bullets: string[]): { glyph: string; label: string }[] {
  const used = new Set<string>()
  return bullets.map((text, i) => {
    const first = matchIcon(text, i)
    if (!used.has(first.glyph)) {
      used.add(first.glyph)
      return first
    }
    // Prefer another keyword the bullet also matches, then an unused fallback.
    const alt =
      KEYWORD_MAP.find(([re, glyph]) => re.test(text) && !used.has(glyph)) ||
      FALLBACKS.map(([glyph, label]) => [null, glyph, label] as const).find(([, glyph]) => !used.has(glyph))
    if (alt) {
      used.add(alt[1])
      return { glyph: alt[1], label: alt[2] }
    }
    return first // more bullets than distinct glyphs — accept the repeat
  })
}

const cache = new Map<string, string>()

// Render a glyph as a data URI. `size` only sets the SVG viewport; the poster
// controls display size via CSS, but resvg rasterises from the intrinsic size,
// so it is passed through to keep the strokes crisp at large display sizes.
export function iconDataUri(name: string, color: string, strokeWidth = 2, size = 96): string {
  const key = `${name}|${color}|${strokeWidth}|${size}`
  const hit = cache.get(key)
  if (hit) return hit

  const body = PATHS[name] || PATHS.leaf
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" ` +
    `fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">` +
    `${body}</svg>`
  const uri = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
  cache.set(key, uri)
  return uri
}
