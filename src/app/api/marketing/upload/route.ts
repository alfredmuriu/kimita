import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { compressToWebp } from '@/lib/image-compress'

const BUCKET = 'marketing-media'

export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json({ error: 'Supabase unavailable' }, { status: 500 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const maxSize = 100 * 1024 * 1024 // 100MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'File too large (max 100MB)' }, { status: 400 })
  }

  const original = Buffer.from(await file.arrayBuffer())

  // Compress images to WebP to keep Supabase Cached Egress low; pass videos and
  // other file types through unchanged.
  let ext = file.name.split('.').pop()?.toLowerCase() || 'bin'
  let contentType = file.type
  let buffer: Buffer<ArrayBufferLike> = original
  if (file.type.startsWith('image/')) {
    const compressed = await compressToWebp(original)
    buffer = compressed.buffer
    contentType = compressed.contentType
    ext = compressed.ext
  }

  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, buffer, {
      contentType,
      upsert: false,
    })

  if (error) {
    console.error('[Upload] Supabase storage error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName)

  return NextResponse.json({
    url: urlData.publicUrl,
    name: file.name,
    type: file.type,
    size: file.size,
  })
}
