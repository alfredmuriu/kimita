// LP formulation engine.
// Takes a profile, a list of selected ingredient ids (+ any custom ones)
// and a Bio-Gar %. Bio-Gar is fixed: we subtract its share from 100,
// run the LP on remaining ingredients, then re-insert Bio-Gar.

// eslint-disable-next-line @typescript-eslint/no-var-requires
const solver = require('javascript-lp-solver')

import { AnimalProfile, NutrientTargets } from './profiles'
import { Ingredient } from './ingredients'

export type FormulateInput = {
  profile: AnimalProfile
  ingredients: Ingredient[]
  biogarPercent: number
  biogarLabel: string
  biogarGramsPerTonne: number
  batchSizeKg: number
}

export type FormulaRow = {
  ingredient: Ingredient
  qtyKg: number
  percent: number
  isBiogar?: boolean
}

export type NutrientResult = {
  key: keyof NutrientTargets | 'dm'
  label: string
  unit: string
  achieved: number
  min?: number
  max?: number
  ok: boolean
}

export type FormulateResult =
  | {
      ok: true
      rows: FormulaRow[]
      nutrients: NutrientResult[]
      totalKg: number
      hasPrices: boolean
      costPerKg: number
      costPerBatch: number
      costPerTonne: number
    }
  | {
      ok: false
      message: string
      hint?: string
    }

function buildModel(
  targets: NutrientTargets,
  pool: Ingredient[],
  sharePct: number,
  needLysine: boolean,
  needMethionine: boolean,
) {
  // LP is done on percentages that sum to sharePct (e.g. 99.975).
  // Nutrient contribution per unit = nutrient% / 100. So when a variable
  // value is x (%-points), the nutrient delivered to the formula is
  // (x * nutrient%) / 100. Constraint becomes:
  //   sum(x_i * nutrient_i / 100) >= target_min
  //   i.e. sum(x_i * nutrient_i) >= target_min * 100
  //
  // For total-share: sum(x_i) = sharePct (already in %-points).

  const constraints: Record<string, { min?: number; max?: number; equal?: number }> = {
    total:      { equal: sharePct },
    cp:         { min: targets.cp_min * 100, max: targets.cp_max * 100 },
    me:         { min: targets.me_min * 100 },
    ca:         { min: targets.ca_min * 100, max: targets.ca_max * 100 },
    p:          { min: targets.p_min  * 100, max: targets.p_max  * 100 },
    fibre:      { max: targets.fibre_max * 100 },
    moisture:   { max: targets.moisture_max * 100 },
  }
  if (needLysine && targets.lysine_min !== undefined) {
    constraints.lysine = { min: targets.lysine_min * 100 }
  }
  if (needMethionine && targets.methionine_min !== undefined) {
    constraints.methionine = { min: targets.methionine_min * 100 }
  }

  const variables: Record<string, Record<string, number>> = {}
  for (const ing of pool) {
    variables[ing.id] = {
      total: 1,
      cp: ing.cp,
      me: ing.me,
      ca: ing.ca,
      p: ing.p,
      fibre: ing.fibre,
      moisture: ing.moisture,
      lysine: ing.lysine,
      methionine: ing.methionine,
      // objective: minimise total cost. If a price is provided, the LP
      // returns the cheapest feasible mix. Missing prices default to 1
      // so the solver still finds a feasible mix without distortion.
      _cost: ing.pricePerKg ?? 1,
    }
    // Ceiling per ingredient: can't exceed its maxInclusion (or sharePct).
    const ceiling = Math.min(ing.maxInclusion, sharePct)
    constraints[`max_${ing.id}`] = { max: ceiling }
    variables[ing.id][`max_${ing.id}`] = 1
  }

  return {
    optimize: '_cost',
    opType: 'min',
    constraints,
    variables,
  }
}

export function formulate(input: FormulateInput): FormulateResult {
  const { profile, ingredients, biogarPercent, batchSizeKg } = input
  const targets = profile.targets
  const sharePct = 100 - biogarPercent

  const pool = ingredients
  if (pool.length === 0) {
    return { ok: false, message: 'Please select at least one ingredient.' }
  }

  const needLysine = !!profile.isPoultry || !!profile.isPig
  const needMethionine = !!profile.isPoultry

  const model = buildModel(targets, pool, sharePct, needLysine, needMethionine)
  const result = solver.Solve(model)

  if (!result || result.feasible === false) {
    const hint = diagnose(targets, pool, needLysine, needMethionine)
    return {
      ok: false,
      message: 'A balanced formula cannot be built from the ingredients you selected.',
      hint,
    }
  }

  const rows: FormulaRow[] = []
  let totalPct = 0
  for (const ing of pool) {
    const pct = Number(result[ing.id] ?? 0)
    if (pct < 0.001) continue
    totalPct += pct
    rows.push({
      ingredient: ing,
      qtyKg: (pct / 100) * batchSizeKg,
      percent: pct,
    })
  }

  // Nutrient achieved values (sum x_i * n_i / 100, then / 100 again to
  // get a % of the formula — matches columns on a mill sheet).
  const achieved = {
    cp: sumN(rows, 'cp'),
    me: sumN(rows, 'me'),
    ca: sumN(rows, 'ca'),
    p: sumN(rows, 'p'),
    fibre: sumN(rows, 'fibre'),
    lysine: sumN(rows, 'lysine'),
    methionine: sumN(rows, 'methionine'),
    moisture: sumN(rows, 'moisture'),
  }
  const dm = 100 - achieved.moisture

  const nutrients: NutrientResult[] = [
    { key: 'dm',         label: 'Dry Matter',   unit: '%',       achieved: dm,                 min: 87,            ok: dm >= 87 },
    { key: 'cp_min',     label: 'Crude Protein', unit: '%',      achieved: achieved.cp,        min: targets.cp_min, max: targets.cp_max, ok: achieved.cp >= targets.cp_min - 0.01 && achieved.cp <= targets.cp_max + 0.5 },
    { key: 'fibre_max',  label: 'Crude Fibre',   unit: '%',      achieved: achieved.fibre,     max: targets.fibre_max, ok: achieved.fibre <= targets.fibre_max + 0.1 },
    { key: 'ca_min',     label: 'Calcium',       unit: '%',      achieved: achieved.ca,        min: targets.ca_min, max: targets.ca_max, ok: achieved.ca >= targets.ca_min - 0.01 && achieved.ca <= targets.ca_max + 0.2 },
    { key: 'p_min',      label: 'Phosphorus',    unit: '%',      achieved: achieved.p,         min: targets.p_min, max: targets.p_max, ok: achieved.p >= targets.p_min - 0.01 && achieved.p <= targets.p_max + 0.2 },
    { key: 'me_min',     label: 'Energy',        unit: 'kcal/kg', achieved: achieved.me,       min: targets.me_min, ok: achieved.me >= targets.me_min - 10 },
  ]
  if (needLysine && targets.lysine_min !== undefined) {
    nutrients.push({ key: 'lysine_min', label: 'Lysine', unit: '%', achieved: achieved.lysine, min: targets.lysine_min, ok: achieved.lysine >= targets.lysine_min - 0.01 })
  }
  if (needMethionine && targets.methionine_min !== undefined) {
    nutrients.push({ key: 'methionine_min', label: 'Methionine', unit: '%', achieved: achieved.methionine, min: targets.methionine_min, ok: achieved.methionine >= targets.methionine_min - 0.01 })
  }

  // Bio-Gar row inserted at the end.
  const biogarQty = (biogarPercent / 100) * batchSizeKg
  rows.push({
    ingredient: {
      id: 'biogar',
      name: 'BIO-GAR (Agrikima)',
      category: 'additive',
      cp: 0, me: 0, ca: 0, p: 0, fibre: 0, lysine: 0, methionine: 0, moisture: 8, maxInclusion: 0.05,
    },
    qtyKg: biogarQty,
    percent: biogarPercent,
    isBiogar: true,
  })

  // Cost calculation: only count rows that have a real price.
  // Bio-Gar has no price so it's excluded.
  const hasPrices = rows.some((r) => !r.isBiogar && typeof r.ingredient.pricePerKg === 'number' && r.ingredient.pricePerKg > 0)
  const costPerBatch = rows.reduce((s, r) => {
    const price = r.ingredient.pricePerKg
    if (!price || r.isBiogar) return s
    return s + r.qtyKg * price
  }, 0)
  const costPerKg = batchSizeKg > 0 ? costPerBatch / batchSizeKg : 0
  const costPerTonne = costPerKg * 1000

  return {
    ok: true,
    rows,
    nutrients,
    totalKg: batchSizeKg,
    hasPrices,
    costPerKg,
    costPerBatch,
    costPerTonne,
  }
}

function sumN(rows: FormulaRow[], key: keyof Ingredient): number {
  let s = 0
  for (const r of rows) {
    const v = r.ingredient[key] as number
    s += (r.percent / 100) * v
  }
  return s
}

// Lightweight infeasibility explainer: which single nutrient constraint
// can't be hit even with the best ingredient in the pool?
function diagnose(
  t: NutrientTargets,
  pool: Ingredient[],
  needLys: boolean,
  needMeth: boolean,
): string | undefined {
  const bestOf = (k: keyof Ingredient) => pool.reduce((m, i) => Math.max(m, i[k] as number), 0)
  if (bestOf('cp') < t.cp_min) return 'Add a protein source such as Soybean Meal, Fish Meal, Omena, or Sunflower Cake.'
  if (bestOf('me') < t.me_min) return 'Add an energy source such as Maize, Maize Germ, or Soybean Oil.'
  if (bestOf('ca') < t.ca_min) return 'Add a calcium source such as Limestone or Bone Meal.'
  if (bestOf('p')  < t.p_min)  return 'Add a phosphorus source such as Dicalcium Phosphate (DCP) or Bone Meal.'
  if (needLys && t.lysine_min && bestOf('lysine') < t.lysine_min) return 'Add L-Lysine HCl or more Soybean Meal.'
  if (needMeth && t.methionine_min && bestOf('methionine') < t.methionine_min) return 'Add DL-Methionine or Fish Meal.'
  return 'Try adding a premix and one more protein or energy source.'
}
