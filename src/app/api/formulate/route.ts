import { NextResponse } from 'next/server'
import { getProfile } from '@/lib/formulate/profiles'
import { INGREDIENTS, Ingredient, getIngredient } from '@/lib/formulate/ingredients'
import { BIOGAR_RATES, BioGarPurpose } from '@/lib/formulate/biogar'
import { formulate } from '@/lib/formulate/solver'

export const runtime = 'nodejs'

// Future Supabase schema (when persistence is added):
//
//   create table feed_formulas (
//     id uuid primary key default gen_random_uuid(),
//     created_at timestamptz default now(),
//     profile_id text not null,
//     ingredient_ids text[] not null,
//     biogar_purpose text not null,
//     batch_kg numeric not null,
//     rows jsonb not null,
//     nutrients jsonb not null
//   );

type CustomIngredient = Partial<Ingredient> & { id: string; name: string }

type ReqBody = {
  profileId: string
  ingredientIds: string[]
  customIngredients?: CustomIngredient[]
  biogarPurpose: BioGarPurpose
  batchSizeKg?: number
  prices?: Record<string, number>
}

export async function POST(req: Request) {
  let body: ReqBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid request body.' }, { status: 400 })
  }

  const profile = getProfile(body.profileId)
  if (!profile) {
    return NextResponse.json({ ok: false, message: 'Please choose an animal stage.' }, { status: 400 })
  }

  const prices = body.prices || {}
  const pool: Ingredient[] = []
  for (const id of body.ingredientIds || []) {
    const ing = getIngredient(id)
    if (ing) {
      const userPrice = prices[id]
      pool.push(typeof userPrice === 'number' && userPrice > 0 ? { ...ing, pricePerKg: userPrice } : ing)
    }
  }
  for (const c of body.customIngredients || []) {
    const userPrice = prices[c.id]
    pool.push({
      id: c.id,
      name: c.name,
      category: 'energy',
      cp: num(c.cp), me: num(c.me), ca: num(c.ca), p: num(c.p),
      fibre: num(c.fibre), lysine: num(c.lysine), methionine: num(c.methionine),
      moisture: num(c.moisture, 12),
      maxInclusion: num(c.maxInclusion, 60),
      pricePerKg: typeof userPrice === 'number' && userPrice > 0 ? userPrice : undefined,
    })
  }

  if (pool.length === 0) {
    return NextResponse.json({
      ok: false,
      message: 'Please select at least one ingredient before running the formula.',
    }, { status: 400 })
  }

  const purpose: BioGarPurpose = body.biogarPurpose || 'growth'
  const rate = BIOGAR_RATES[purpose] || BIOGAR_RATES.growth

  const result = formulate({
    profile,
    ingredients: pool,
    biogarPercent: rate.percent,
    biogarLabel: rate.label,
    biogarGramsPerTonne: rate.grams_per_tonne,
    batchSizeKg: body.batchSizeKg && body.batchSizeKg > 0 ? body.batchSizeKg : 100,
  })

  if (result.ok === false) {
    return NextResponse.json({ ok: false, message: result.message, hint: result.hint }, { status: 200 })
  }

  return NextResponse.json({
    ok: true,
    profile: { id: profile.id, name: profile.name, targets: profile.targets },
    biogar: { purpose, label: rate.label, grams_per_tonne: rate.grams_per_tonne, percent: rate.percent },
    batchSizeKg: body.batchSizeKg && body.batchSizeKg > 0 ? body.batchSizeKg : 100,
    rows: result.rows,
    nutrients: result.nutrients,
    cost: {
      hasPrices: result.hasPrices,
      perKg: result.costPerKg,
      perBatch: result.costPerBatch,
      perTonne: result.costPerTonne,
    },
  })
}

function num(v: unknown, fallback = 0): number {
  const n = typeof v === 'number' ? v : parseFloat(String(v))
  return Number.isFinite(n) ? n : fallback
}

// Ensure static analysis keeps this ingredient import referenced.
void INGREDIENTS
