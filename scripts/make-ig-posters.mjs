// Pads the four pre-made product posters onto a 1080x1350 (4:5) canvas so
// Instagram accepts them (it rejects anything taller than 0.75:1). The poster
// is centered over a blurred, darkened cover-fill of itself so the padding
// looks intentional, not like bars. Output: "<name> ig.jpeg" next to each
// original in public/images. Run: node scripts/make-ig-posters.mjs
import sharp from 'sharp'
import path from 'node:path'

const dir = path.resolve(process.cwd(), 'public', 'images')
const W = 1080
const H = 1350

const files = [
  'Advice poster.jpeg',
  'Biogar poster.jpeg',
  'Mix-5 poster.jpeg',
  'agrivitam poster.jpeg',
]

for (const file of files) {
  const src = path.join(dir, file)
  const out = path.join(dir, file.replace(/\.jpeg$/i, ' ig.jpeg'))

  const bg = await sharp(src)
    .resize(W, H, { fit: 'cover' })
    .blur(30)
    .modulate({ brightness: 0.75 })
    .toBuffer()

  const fg = await sharp(src)
    .resize(W, H, { fit: 'inside' })
    .toBuffer()

  const meta = await sharp(fg).metadata()

  await sharp(bg)
    .composite([{ input: fg, left: Math.round((W - meta.width) / 2), top: Math.round((H - meta.height) / 2) }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(out)

  const check = await sharp(out).metadata()
  console.log(`${path.basename(out)}: ${check.width}x${check.height} ratio=${(check.width / check.height).toFixed(2)}`)
}
