import sharp from 'sharp'

// Compress a generated image to WebP before it's uploaded to Supabase Storage.
// Blog/marketing PNGs come out of the image models at 1–3 MB; served full-size
// on every public page + crawler hit they were the main driver of Supabase
// "Cached Egress". Resizing to a sensible width and re-encoding as WebP cuts each
// image ~10–20× (to ~80–150 KB) with no visible quality loss, so the same views
// cost a fraction of the egress.
//
// Returns the compressed WebP buffer, or the original buffer untouched if
// compression fails for any reason (never block image publishing on this).
export async function compressToWebp(
  input: Buffer,
  maxWidth = 1200
): Promise<{ buffer: Buffer; contentType: string; ext: string }> {
  try {
    const buffer = await sharp(input)
      .rotate() // respect EXIF orientation before dropping metadata
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toBuffer()
    return { buffer, contentType: 'image/webp', ext: 'webp' }
  } catch (err) {
    console.error('[image-compress] Falling back to original image:', err)
    return { buffer: input, contentType: 'image/png', ext: 'png' }
  }
}
