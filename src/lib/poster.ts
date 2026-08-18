import fs from 'node:fs'
import path from 'node:path'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import sharp from 'sharp'
import { iconDataUri, iconsForBullets } from './poster-icons'

// Composes a branded, designed social "poster" from an AI-generated photo.
//
// The layout is deliberately structured rather than "photo + caption": a photo
// band carries the logo lock-up, a round quality badge and a two-tone display
// headline; a cream content panel below it carries checkmark benefit bullets and
// a pictogram strip; a tagline rule and a green contact bar close it out. That
// zoning is what separates a designed poster from a stock image with words on it.
//
// Text is rendered by satori with embedded Poppins fonts (crisp + correctly
// spelled on Vercel's serverless runtime, unlike image models or system-font
// SVG), rasterised by resvg, and compressed to JPEG by sharp.

const BRAND = {
  green: '#2D6A4F',
  greenDark: '#143D2B',
  greenDeep: '#0E2C1E',
  accent: '#F2B705', // warm gold — high contrast against green
  cream: '#F6F1E4',
  creamLine: '#E2D9C2',
  ink: '#1B2A20',
  url: 'www.agrikima.co.ke',
  phone: '+254 111 410 639',
  tagline: 'Healthy livestock. Better yields. Stronger farms.',
}

// Used when the generator supplied no bullets. Three brand-true service lines keep
// the content panel looking designed — an empty or paragraph-filled panel is what
// made the old poster read as plain.
const DEFAULT_BULLETS = ['Proper Animal Nutrition', 'Consistent Animal Health', 'Modern Farm Management']

// Display headline bounds, as a fraction of the canvas width. The upper bound is
// the design size; the lower bound stops a long headline shrinking to caption size
// — past it the headline is allowed to wrap to a third line instead, which the
// bottom-anchored block absorbs by growing upward into the photo.
const HEADLINE_MAX = 0.082
const HEADLINE_MIN = 0.044
// Measured average advance of uppercase Poppins Bold, in em. Used to size the
// headline so each line fits its column without satori having to wrap it.
const CAP_ADVANCE = 0.68

export interface PosterInput {
  photo: Buffer // raw AI background image (PNG/JPEG)
  headline: string
  subtitle?: string
  eyebrow?: string // small label, e.g. content pillar ("Education")
  bullets?: string[] // 2–3 short benefit phrases for the content panel
  badge?: string // 2–4 words for the round seal, e.g. "Quality Livestock"
  tagline?: string
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

// Aspect ratio to request from the image model. This is the ratio of the poster's
// PHOTO BAND, not of the poster — the band is a landscape strip on the stacked
// layouts and a near-square column on the split one, so asking for the canvas
// ratio (e.g. 4:5 for Instagram) would get the subject cover-cropped away.
export function posterPhotoAspect(platform: string): '1:1' | '16:9' | '4:5' {
  const { w, h } = canvasFor(platform)
  if (w > h) return '1:1' // split layout: photo column is roughly square
  if (h > w) return '1:1' // portrait: band is ~1.38:1, closest to square
  return '16:9' // square canvas: band is a ~1.8:1 strip
}

// The photo buffer comes from whichever image provider answered first, so its
// format varies. resvg silently drops an <img> whose data URI declares the wrong
// mime type, which would render the poster with an empty photo band — so sniff
// the real format from the magic bytes rather than assuming PNG.
function photoDataUri(buf: Buffer): string {
  let mime = 'image/png'
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) mime = 'image/jpeg'
  else if (buf.length > 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP')
    mime = 'image/webp'
  return `data:${mime};base64,${buf.toString('base64')}`
}

// Minimal hyperscript for satori (avoids needing JSX/React in a .ts lib file).
type El = { type: string; props: Record<string, unknown> }
function el(type: string, style: Record<string, unknown>, children?: unknown, extra?: Record<string, unknown>): El {
  return { type, props: { style, children, ...extra } }
}

// ── Copy shaping ──────────────────────────────────────────────────────────────

// Break the headline into two balanced lines so the second can take the gold
// accent. Balanced (rather than greedy) wrapping is what makes a stacked display
// headline look set rather than overflowed.
function splitHeadline(text: string): [string, string] {
  const words = text.replace(/\s+/g, ' ').trim().split(' ')
  if (words.length < 2) return [text, '']
  let best = 1
  let bestDiff = Infinity
  for (let i = 1; i < words.length; i++) {
    const diff = Math.abs(words.slice(0, i).join(' ').length - words.slice(i).join(' ').length)
    if (diff < bestDiff) {
      bestDiff = diff
      best = i
    }
  }
  return [words.slice(0, best).join(' '), words.slice(best).join(' ')]
}

function clamp(text: string, max: number): string {
  const t = text.replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  const cut = t.slice(0, max)
  const sp = cut.lastIndexOf(' ')
  return (sp > max * 0.6 ? cut.slice(0, sp) : cut).replace(/[,;:.\-]$/, '') + '…'
}

// 64 chars is generous for the specified "max 7 words" headline, so a slightly
// long one shrinks to fit rather than losing its last word to an ellipsis.
const HEADLINE_MAX_CHARS = 64

// Pick the largest display size at which both headline lines fit `available` px,
// bounded by the design size and a readability floor. `refWidth` is the dimension
// the bounds scale from (canvas width when stacked, a height-derived value when split).
function fitHeadline(headline: string, available: number, refWidth: number): number {
  const [l1, l2] = splitHeadline(clamp(headline, HEADLINE_MAX_CHARS))
  const longest = Math.max(l1.length, l2.length, 1)
  const ideal = available / (longest * CAP_ADVANCE)
  return Math.round(Math.max(refWidth * HEADLINE_MIN, Math.min(refWidth * HEADLINE_MAX, ideal)))
}

// Normalise the panel bullets: trim, cap the count, shorten to fit one line each,
// and substitute the brand defaults when the generator gave us nothing usable.
function posterBullets(bullets: string[] | undefined, max: number): string[] {
  const cleaned = (bullets || [])
    .filter((b) => typeof b === 'string' && b.trim().length > 2)
    .slice(0, max)
    .map((b) => clamp(b, 34))
  return cleaned.length ? cleaned : DEFAULT_BULLETS.slice(0, max)
}

// Two or three words for the round seal; falls back to a brand-safe default so
// the badge is never missing (an empty corner reads as a layout bug).
function badgeLines(badge: string | undefined, eyebrow: string | undefined): [string, string] {
  const raw = (badge || (eyebrow ? `${eyebrow} First` : '') || 'Quality Livestock').replace(/\s+/g, ' ').trim()
  const words = raw.split(' ').slice(0, 4)
  if (words.length === 1) return [words[0], '']
  const mid = Math.ceil(words.length / 2)
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
}

// ── Shared pieces ─────────────────────────────────────────────────────────────

function logoCard(logoH: number, padX: number, padY: number, radius: number): El | null {
  const logo = logoDataUri()
  if (!logo) return null
  return el(
    'div',
    {
      display: 'flex',
      backgroundColor: '#ffffff',
      borderRadius: radius,
      padding: `${padY}px ${padX}px`,
      boxShadow: '0 6px 24px rgba(0,0,0,0.28)',
    },
    [el('img', { height: logoH, objectFit: 'contain' }, undefined, { src: logo })]
  )
}

function badgeSeal(size: number, lines: [string, string], fontSize: number): El {
  const children: El[] = [
    el(
      'div',
      { display: 'flex', color: '#ffffff', fontSize, fontWeight: 700, letterSpacing: 0.5, textAlign: 'center' },
      lines[0].toUpperCase()
    ),
  ]
  if (lines[1]) {
    children.push(
      el(
        'div',
        { display: 'flex', color: BRAND.accent, fontSize, fontWeight: 700, letterSpacing: 0.5, textAlign: 'center' },
        lines[1].toUpperCase()
      )
    )
  }
  return el(
    'div',
    {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      flexShrink: 0,
      borderRadius: size,
      backgroundColor: BRAND.green,
      border: `${Math.max(2, Math.round(size * 0.022))}px solid ${BRAND.accent}`,
      boxShadow: '0 8px 28px rgba(0,0,0,0.3)',
      padding: Math.round(size * 0.12),
      textAlign: 'center',
    },
    children
  )
}

// Checkmark bullet: a gold disc with a dark tick, then the copy.
function bulletRow(text: string, fontSize: number, discSize: number, gap: number, marginBottom: number): El {
  return el('div', { display: 'flex', alignItems: 'center', marginBottom }, [
    el(
      'div',
      {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: discSize,
        height: discSize,
        flexShrink: 0,
        borderRadius: discSize,
        backgroundColor: BRAND.accent,
        marginRight: gap,
      },
      [
        el('img', { width: Math.round(discSize * 0.58), height: Math.round(discSize * 0.58) }, undefined, {
          src: iconDataUri('check', BRAND.greenDeep, 3.4),
        }),
      ]
    ),
    el('div', { display: 'flex', fontSize, fontWeight: 600, color: BRAND.ink, lineHeight: 1.25 }, text),
  ])
}

// Pictogram tile: outlined green disc with a glyph, short label beneath.
function iconTile(
  icon: { glyph: string; label: string },
  discSize: number,
  fontSize: number,
  labelWidth: number
): El {
  const { glyph, label } = icon
  return el(
    'div',
    { display: 'flex', flexDirection: 'column', alignItems: 'center', width: labelWidth, flexShrink: 0 },
    [
      el(
        'div',
        {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: discSize,
          height: discSize,
          borderRadius: discSize,
          backgroundColor: BRAND.green,
          marginBottom: Math.round(discSize * 0.18),
        },
        [
          el('img', { width: Math.round(discSize * 0.52), height: Math.round(discSize * 0.52) }, undefined, {
            src: iconDataUri(glyph, '#ffffff', 2.1),
          }),
        ]
      ),
      el(
        'div',
        {
          display: 'flex',
          fontSize,
          fontWeight: 600,
          color: BRAND.green,
          textAlign: 'center',
          lineHeight: 1.15,
        },
        label
      ),
    ]
  )
}

// `showUrl` is off in the split layout, where the bar sits in a narrow column
// and the URL would collide with the phone number.
function contactBar(w: number, barH: number, padX: number, showUrl = true): El {
  const discSize = Math.round(barH * 0.52)
  const phoneSize = Math.round(barH * 0.3)
  const smallSize = Math.round(barH * 0.13)
  const urlNode = showUrl
    ? [
        el(
          'div',
          { display: 'flex', fontSize: Math.round(barH * 0.17), fontWeight: 600, color: 'rgba(255,255,255,0.9)' },
          BRAND.url
        ),
      ]
    : []
  return el(
    'div',
    {
      display: 'flex',
      alignItems: 'center',
      width: w,
      height: barH,
      flexShrink: 0,
      backgroundColor: BRAND.greenDark,
      paddingLeft: padX,
      paddingRight: padX,
    },
    [
      el(
        'div',
        {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: discSize,
          height: discSize,
          flexShrink: 0,
          borderRadius: discSize,
          backgroundColor: BRAND.accent,
          marginRight: Math.round(padX * 0.55),
        },
        [
          el('img', { width: Math.round(discSize * 0.55), height: Math.round(discSize * 0.55) }, undefined, {
            src: iconDataUri('phone', BRAND.greenDeep, 2.2),
          }),
        ]
      ),
      el('div', { display: 'flex', flexDirection: 'column', flexGrow: 1 }, [
        el(
          'div',
          { display: 'flex', fontSize: phoneSize, fontWeight: 700, color: '#ffffff', letterSpacing: 0.5 },
          BRAND.phone
        ),
        el(
          'div',
          { display: 'flex', fontSize: smallSize, fontWeight: 600, color: BRAND.accent, letterSpacing: 2.5 },
          'CALL / WHATSAPP'
        ),
      ]),
      ...urlNode,
    ]
  )
}

function taglineStrip(w: number, padX: number, height: number, text: string): El {
  return el(
    'div',
    {
      display: 'flex',
      alignItems: 'center',
      width: w,
      height,
      flexShrink: 0,
      backgroundColor: 'rgba(242,183,5,0.16)',
      borderTop: `1px solid ${BRAND.creamLine}`,
      paddingLeft: padX,
      paddingRight: padX,
    },
    [
      el('div', {
        display: 'flex',
        width: Math.round(height * 0.16),
        height: Math.round(height * 0.5),
        borderRadius: 4,
        backgroundColor: BRAND.accent,
        marginRight: Math.round(padX * 0.5),
        flexShrink: 0,
      }),
      el(
        'div',
        { display: 'flex', fontSize: Math.round(height * 0.31), fontWeight: 700, color: BRAND.greenDark },
        text
      ),
    ]
  )
}

// Headline lock-up: eyebrow pill, two-tone stacked display lines, subtitle card.
function headlineBlock(
  input: PosterInput,
  opts: { w: number; headlineSize: number; subSize: number; eyebrowSize: number; gapUnit: number; subMaxWidth: number }
): El[] {
  // Must use the same clamp as fitHeadline, or the size is computed for a
  // different line break than the one actually rendered.
  const [l1, l2] = splitHeadline(clamp(input.headline, HEADLINE_MAX_CHARS))
  const out: El[] = []

  if (input.eyebrow) {
    out.push(
      el(
        'div',
        {
          display: 'flex',
          alignSelf: 'flex-start',
          backgroundColor: BRAND.accent,
          color: BRAND.greenDeep,
          fontSize: opts.eyebrowSize,
          fontWeight: 700,
          letterSpacing: 2.4,
          padding: `${Math.round(opts.eyebrowSize * 0.45)}px ${Math.round(opts.eyebrowSize * 0.9)}px`,
          borderRadius: 6,
          marginBottom: Math.round(opts.gapUnit * 0.9),
        },
        input.eyebrow.toUpperCase()
      )
    )
  }

  const lineStyle = {
    display: 'flex',
    fontSize: opts.headlineSize,
    fontWeight: 700,
    lineHeight: 1.0,
    letterSpacing: -1,
  }
  out.push(el('div', { ...lineStyle, color: '#ffffff' }, l1.toUpperCase()))
  if (l2) out.push(el('div', { ...lineStyle, color: BRAND.accent }, l2.toUpperCase()))

  if (input.subtitle) {
    out.push(
      el(
        'div',
        {
          display: 'flex',
          maxWidth: opts.subMaxWidth,
          marginTop: opts.gapUnit,
          backgroundColor: 'rgba(20,61,43,0.78)',
          borderLeft: `4px solid ${BRAND.accent}`,
          borderRadius: 10,
          padding: `${Math.round(opts.subSize * 0.7)}px ${Math.round(opts.subSize * 0.85)}px`,
          fontSize: opts.subSize,
          fontWeight: 400,
          color: 'rgba(255,255,255,0.95)',
          lineHeight: 1.3,
        },
        clamp(input.subtitle, 92)
      )
    )
  }

  return out
}

// ── Portrait / square layout ──────────────────────────────────────────────────
// Photo band on top, cream content panel beneath, contact bar at the foot.
function buildStacked(input: PosterInput, w: number, h: number): El {
  const pad = Math.round(w * 0.055)
  const isPortrait = h > w
  const photoH = Math.round(h * (isPortrait ? 0.58 : 0.55))
  const barH = Math.round(h * (isPortrait ? 0.088 : 0.1))
  const stripH = Math.round(h * (isPortrait ? 0.055 : 0.06))
  const panelH = h - photoH - barH - stripH

  const bullets = posterBullets(input.bullets, 3)
  const headlineSize = fitHeadline(input.headline, w - pad * 2, w)

  const photoUri = photoDataUri(input.photo)

  // Photo band ---------------------------------------------------------------
  const topRow: El[] = []
  const card = logoCard(Math.round(photoH * 0.1), Math.round(pad * 0.55), Math.round(pad * 0.42), 14)
  topRow.push(card || el('div', { display: 'flex' }))
  topRow.push(
    badgeSeal(Math.round(w * 0.19), badgeLines(input.badge, input.eyebrow), Math.round(w * 0.0195))
  )

  const band = el('div', { display: 'flex', position: 'relative', width: w, height: photoH, flexShrink: 0 }, [
    el('img', { position: 'absolute', top: 0, left: 0, width: w, height: photoH, objectFit: 'cover' }, undefined, {
      src: photoUri,
    }),
    el('div', {
      position: 'absolute',
      top: 0,
      left: 0,
      width: w,
      height: photoH,
      display: 'flex',
      backgroundImage: `linear-gradient(to top, ${BRAND.greenDeep}f7 0%, ${BRAND.greenDeep}c4 26%, ${BRAND.greenDeep}00 58%)`,
    }),
    el(
      'div',
      {
        position: 'absolute',
        top: 0,
        left: 0,
        width: w,
        height: photoH,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: pad,
      },
      [
        el('div', { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: w - pad * 2 }, topRow),
        el(
          'div',
          { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' },
          headlineBlock(input, {
            w,
            headlineSize,
            subSize: Math.round(w * 0.028),
            eyebrowSize: Math.round(w * 0.021),
            gapUnit: Math.round(h * 0.018),
            subMaxWidth: Math.round(w * 0.74),
          })
        ),
      ]
    ),
  ])

  // Cream content panel ------------------------------------------------------
  const bulletFont = Math.round(w * 0.027)
  const bulletDisc = Math.round(w * 0.042)
  const panelChildren: El[] = []

  const bulletCol = el(
    'div',
    { display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center' },
    bullets.map((b, i) =>
      bulletRow(b, bulletFont, bulletDisc, Math.round(w * 0.02), i === bullets.length - 1 ? 0 : Math.round(panelH * 0.11))
    )
  )
  panelChildren.push(bulletCol)

  const tileDisc = Math.round(w * 0.078)
  const tileWidth = Math.round(w * 0.115)
  panelChildren.push(
    el('div', {
      display: 'flex',
      width: 1,
      height: Math.round(panelH * 0.62),
      backgroundColor: BRAND.creamLine,
      marginLeft: Math.round(pad * 0.85),
      marginRight: Math.round(pad * 0.85),
      flexShrink: 0,
    })
  )
  panelChildren.push(
    el(
      'div',
      { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexShrink: 0 },
      iconsForBullets(bullets).map((icon, i) =>
        el('div', { display: 'flex', marginLeft: i === 0 ? 0 : Math.round(w * 0.018) }, [
          iconTile(icon, tileDisc, Math.round(w * 0.0185), tileWidth),
        ])
      )
    )
  )

  const panel = el(
    'div',
    {
      display: 'flex',
      alignItems: 'center',
      width: w,
      height: panelH,
      flexShrink: 0,
      backgroundColor: BRAND.cream,
      paddingLeft: pad,
      paddingRight: pad,
    },
    panelChildren
  )

  return el('div', { display: 'flex', flexDirection: 'column', width: w, height: h, fontFamily: 'Poppins', backgroundColor: BRAND.cream }, [
    band,
    panel,
    taglineStrip(w, pad, stripH, clamp(input.tagline || BRAND.tagline, 58)),
    contactBar(w, barH, pad),
  ])
}

// ── Landscape layout ──────────────────────────────────────────────────────────
// 16:9 has no room to stack, so the poster splits: photo + headline on the left,
// a cream information column on the right with the contact bar pinned to its foot.
function buildSplit(input: PosterInput, w: number, h: number): El {
  const pad = Math.round(h * 0.07)
  const photoW = Math.round(w * 0.58)
  const colW = w - photoW
  const barH = Math.round(h * 0.16)

  const bullets = posterBullets(input.bullets, 3)
  // The split layout sizes off height (the photo column is tall, not wide), so the
  // shared fitter is given h-derived bounds via a scaled reference width.
  const headlineSize = fitHeadline(input.headline, photoW - pad * 2, h * 1.28)

  const photoUri = photoDataUri(input.photo)

  const band = el('div', { display: 'flex', position: 'relative', width: photoW, height: h, flexShrink: 0 }, [
    el('img', { position: 'absolute', top: 0, left: 0, width: photoW, height: h, objectFit: 'cover' }, undefined, {
      src: photoUri,
    }),
    el('div', {
      position: 'absolute',
      top: 0,
      left: 0,
      width: photoW,
      height: h,
      display: 'flex',
      backgroundImage: `linear-gradient(to top, ${BRAND.greenDeep}f7 0%, ${BRAND.greenDeep}bb 32%, ${BRAND.greenDeep}00 66%)`,
    }),
    el(
      'div',
      {
        position: 'absolute',
        top: 0,
        left: 0,
        width: photoW,
        height: h,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: pad,
      },
      [
        el('div', { display: 'flex' }, [
          logoCard(Math.round(h * 0.11), Math.round(pad * 0.5), Math.round(pad * 0.38), 12) || el('div', { display: 'flex' }),
        ]),
        el(
          'div',
          { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' },
          headlineBlock(input, {
            w: photoW,
            headlineSize,
            subSize: Math.round(h * 0.038),
            eyebrowSize: Math.round(h * 0.028),
            gapUnit: Math.round(h * 0.026),
            subMaxWidth: Math.round(photoW - pad * 2),
          })
        ),
      ]
    ),
  ])

  const colBody: El[] = [
    badgeSeal(Math.round(colW * 0.34), badgeLines(input.badge, input.eyebrow), Math.round(colW * 0.036)),
  ]
  const bulletFont = Math.round(colW * 0.058)
  const bulletDisc = Math.round(colW * 0.088)
  colBody.push(
    el(
      'div',
      { display: 'flex', flexDirection: 'column', marginTop: Math.round(pad * 0.9) },
      bullets.map((b, i) =>
        bulletRow(b, bulletFont, bulletDisc, Math.round(colW * 0.045), i === bullets.length - 1 ? 0 : Math.round(h * 0.045))
      )
    )
  )
  colBody.push(
    el(
      'div',
      {
        display: 'flex',
        marginTop: Math.round(pad * 0.9),
        fontSize: Math.round(colW * 0.05),
        fontWeight: 700,
        color: BRAND.green,
        lineHeight: 1.25,
      },
      clamp(input.tagline || BRAND.tagline, 52)
    )
  )
  // The contact bar drops the URL in this layout, so it lands here instead.
  colBody.push(
    el(
      'div',
      {
        display: 'flex',
        marginTop: Math.round(pad * 0.35),
        fontSize: Math.round(colW * 0.042),
        fontWeight: 600,
        color: BRAND.ink,
      },
      BRAND.url
    )
  )

  const column = el(
    'div',
    {
      display: 'flex',
      flexDirection: 'column',
      width: colW,
      height: h,
      flexShrink: 0,
      backgroundColor: BRAND.cream,
    },
    [
      el(
        'div',
        {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flexGrow: 1,
          paddingLeft: pad,
          paddingRight: pad,
        },
        colBody
      ),
      contactBar(colW, barH, Math.round(pad * 0.8), false),
    ]
  )

  return el('div', { display: 'flex', width: w, height: h, fontFamily: 'Poppins', backgroundColor: BRAND.cream }, [band, column])
}

export async function composePoster(input: PosterInput): Promise<Buffer> {
  const { w, h } = canvasFor(input.platform)
  const tree = w > h ? buildSplit(input, w, h) : buildStacked(input, w, h)

  // satori's element shape matches our {type, props}; cast through unknown.
  const svg = await satori(tree as unknown as React.ReactNode, { width: w, height: h, fonts: loadFonts() })

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: w } }).render().asPng()
  // Output JPEG, not WebP: Instagram (via Zernio/Meta) rejects WebP uploads
  // ("Instagram only supports JPG and PNG"). JPEG is accepted by every platform
  // and stays small, so it's the safe universal choice for published posters.
  return sharp(png).jpeg({ quality: 88, mozjpeg: true }).toBuffer()
}
