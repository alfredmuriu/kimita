import fs from 'node:fs'
import path from 'node:path'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import sharp from 'sharp'

// Composes a branded social "poster" from an AI-generated background photo:
// the photo is laid full-bleed, a dark-green gradient scrim anchors a readable
// headline + subtitle, and the Agrikima logo + tagline lock up in the footer.
// Text is rendered by satori with embedded Poppins fonts (crisp + correctly
// spelled on Vercel's serverless runtime, unlike image models or system-font
// SVG), then rasterised by resvg and compressed to WebP by sharp.

const BRAND = {
  green: '#2D6A4F',
  greenDark: '#143D2B',
  accent: '#F2B705', // warm gold — high contrast against green
  // Footer uses the site URL (a CTA) rather than the tagline — the logo already
  // carries "Making Growth Happen", so repeating it would be redundant.
  url: 'www.agrikima.co.ke',
}

export interface PosterInput {
  photo: Buffer // raw AI background image (PNG/JPEG)
  headline: string
  subtitle?: string
  eyebrow?: string // small label, e.g. content pillar ("Education")
  platform: string
}

// ── Fonts (loaded once) ───────────────────────────────────────────────────────
let fontCache: { name: string; data: Buffer; weight: 400 | 600 | 700; style: 'normal' }[] | null = null
function loadFonts() {
  if (fontCache) return fontCache
  const dir = path.join(process.cwd(), 'public', 'fonts')
  fontCache = [
    { name: 'Poppins', data: fs.readFileSync(path.join(dir, 'Poppins-Regular.ttf')), weight: 400, style: 'normal' },
    { name: 'Poppins', data: fs.readFileSync(path.join(dir, 'Poppins-SemiBold.ttf')), weight: 600, style: 'normal' },
    { name: 'Poppins', data: fs.readFileSync(path.join(dir, 'Poppins-Bold.ttf')), weight: 700, style: 'normal' },
  ]
  return fontCache
}

let logoCache: string | null = null
function logoDataUri(): string | null {
  if (logoCache) return logoCache
  try {
    const buf = fs.readFileSync(path.join(process.cwd(), 'public', 'logo.png'))
    logoCache = `data:image/png;base64,${buf.toString('base64')}`
    return logoCache
  } catch {
    return null
  }
}

// Poster canvas per platform (portrait for IG, landscape 16:9 elsewhere, square default).
function canvasFor(platform: string): { w: number; h: number } {
  if (platform === 'Instagram') return { w: 1080, h: 1350 }
  if (platform === 'LinkedIn' || platform === 'Twitter' || platform === 'Facebook') return { w: 1200, h: 675 }
  return { w: 1080, h: 1080 }
}

// Minimal hyperscript for satori (avoids needing JSX/React in a .ts lib file).
type El = { type: string; props: Record<string, unknown> }
function el(type: string, style: Record<string, unknown>, children?: unknown, extra?: Record<string, unknown>): El {
  return { type, props: { style, children, ...extra } }
}

export async function composePoster(input: PosterInput): Promise<Buffer> {
  const { w, h } = canvasFor(input.platform)
  const pad = Math.round(w * 0.06)
  const headlineSize = Math.round(w * 0.068)
  const subSize = Math.round(w * 0.032)
  const eyebrowSize = Math.round(w * 0.024)
  const logoH = Math.round(h * 0.055)

  const photoUri = `data:image/png;base64,${input.photo.toString('base64')}`
  const logo = logoDataUri()

  const contentChildren: El[] = []

  if (input.eyebrow) {
    contentChildren.push(
      el(
        'div',
        {
          display: 'flex',
          alignSelf: 'flex-start',
          backgroundColor: BRAND.accent,
          color: BRAND.greenDark,
          fontSize: eyebrowSize,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: 'uppercase',
          padding: `${Math.round(eyebrowSize * 0.5)}px ${Math.round(eyebrowSize * 0.9)}px`,
          borderRadius: 6,
          marginBottom: Math.round(h * 0.03),
        },
        input.eyebrow
      )
    )
  }

  contentChildren.push(
    el(
      'div',
      { display: 'flex', fontSize: headlineSize, fontWeight: 700, color: '#ffffff', lineHeight: 1.06, marginBottom: Math.round(h * 0.02) },
      input.headline
    )
  )

  if (input.subtitle) {
    contentChildren.push(
      el(
        'div',
        { display: 'flex', fontSize: subSize, fontWeight: 400, color: 'rgba(255,255,255,0.92)', lineHeight: 1.3, marginBottom: Math.round(h * 0.035) },
        input.subtitle
      )
    )
  }

  // Accent underline
  contentChildren.push(
    el('div', { display: 'flex', width: Math.round(w * 0.13), height: 6, backgroundColor: BRAND.accent, borderRadius: 3, marginBottom: Math.round(h * 0.03) })
  )

  // Footer: logo + tagline
  const footerChildren: El[] = []
  if (logo) {
    footerChildren.push(el('img', { height: logoH, objectFit: 'contain' }, undefined, { src: logo }))
  }
  footerChildren.push(
    el('div', { display: 'flex', marginLeft: logo ? Math.round(w * 0.03) : 0, fontSize: Math.round(w * 0.026), fontWeight: 600, color: BRAND.accent }, BRAND.url)
  )
  contentChildren.push(el('div', { display: 'flex', alignItems: 'center' }, footerChildren))

  const tree = el('div', { display: 'flex', position: 'relative', width: w, height: h, fontFamily: 'Poppins' }, [
    // Background photo
    el('img', { position: 'absolute', top: 0, left: 0, width: w, height: h, objectFit: 'cover' }, undefined, { src: photoUri }),
    // Gradient scrim for legibility
    el('div', {
      position: 'absolute', top: 0, left: 0, width: w, height: h, display: 'flex',
      backgroundImage: `linear-gradient(to top, ${BRAND.greenDark}f2 0%, ${BRAND.greenDark}b3 30%, ${BRAND.greenDark}00 62%)`,
    }),
    // Content column, anchored to bottom
    el('div', {
      position: 'absolute', top: 0, left: 0, width: w, height: h,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      padding: pad,
    }, contentChildren),
  ])

  // satori's element shape matches our {type, props}; cast through unknown.
  const svg = await satori(tree as unknown as React.ReactNode, { width: w, height: h, fonts: loadFonts() })

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: w } }).render().asPng()
  // Output JPEG, not WebP: Instagram (via Zernio/Meta) rejects WebP uploads
  // ("Instagram only supports JPG and PNG"). JPEG is accepted by every platform
  // and stays small, so it's the safe universal choice for published posters.
  return sharp(png).jpeg({ quality: 85, mozjpeg: true }).toBuffer()
}
