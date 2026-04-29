// Ingredient library for feed formulation.
// Nutrient columns are percentages (%) except me which is kcal/kg.
// maxInclusion is the ceiling % of the total ration to prevent
// toxicity or palatability problems.

export type Ingredient = {
  id: string
  name: string
  category: 'energy' | 'protein' | 'mineral' | 'fat' | 'amino' | 'additive' | 'premix' | 'ruminant'
  cp: number
  me: number
  ca: number
  p: number
  fibre: number
  lysine: number
  methionine: number
  moisture: number
  maxInclusion: number
  ruminantOnly?: boolean
  pricePerKg?: number
  note?: string
}

export const INGREDIENTS: Ingredient[] = [
  // ── Energy ──
  { id: 'maize',        name: 'Maize',                    category: 'energy',  cp: 8.5,  me: 3350, ca: 0.02, p: 0.28, fibre: 2.5, lysine: 0.26, methionine: 0.18, moisture: 11, maxInclusion: 70 },
  { id: 'maize-germ',   name: 'Maize Germ',               category: 'energy',  cp: 10,   me: 3000, ca: 0.05, p: 0.50, fibre: 8,   lysine: 0.35, methionine: 0.20, moisture: 11, maxInclusion: 40 },
  { id: 'wheat-bran',   name: 'Wheat Bran',               category: 'energy',  cp: 15,   me: 1900, ca: 0.13, p: 1.15, fibre: 11,  lysine: 0.60, methionine: 0.22, moisture: 12, maxInclusion: 30 },
  { id: 'wheat-pollard', name: 'Wheat Pollard',           category: 'energy',  cp: 17,   me: 2100, ca: 0.12, p: 1.0,  fibre: 9,   lysine: 0.65, methionine: 0.25, moisture: 12, maxInclusion: 30 },
  { id: 'rice-bran',    name: 'Rice Bran',                category: 'energy',  cp: 12,   me: 2600, ca: 0.07, p: 1.5,  fibre: 13,  lysine: 0.55, methionine: 0.25, moisture: 11, maxInclusion: 25 },
  { id: 'molasses',     name: 'Molasses',                 category: 'energy',  cp: 4,    me: 2000, ca: 1.0,  p: 0.1,  fibre: 0,   lysine: 0,    methionine: 0,    moisture: 25, maxInclusion: 5  },

  // ── Protein ──
  { id: 'soybean-44',   name: 'Soybean Meal (44% CP)',    category: 'protein', cp: 44,   me: 2450, ca: 0.3,  p: 0.65, fibre: 7,   lysine: 2.75, methionine: 0.60, moisture: 11, maxInclusion: 35 },
  { id: 'soybean-48',   name: 'Soybean Meal (48% CP)',    category: 'protein', cp: 48,   me: 2550, ca: 0.3,  p: 0.65, fibre: 4,   lysine: 3.0,  methionine: 0.65, moisture: 11, maxInclusion: 35 },
  { id: 'fish-meal',    name: 'Fish Meal (65% CP)',       category: 'protein', cp: 65,   me: 2800, ca: 5.0,  p: 2.9,  fibre: 1,   lysine: 5.0,  methionine: 1.8,  moisture: 10, maxInclusion: 10 },
  { id: 'sunflower-cake', name: 'Sunflower Cake',         category: 'protein', cp: 34,   me: 2200, ca: 0.35, p: 0.9,  fibre: 13,  lysine: 1.2,  methionine: 0.75, moisture: 11, maxInclusion: 20 },
  { id: 'cottonseed-cake', name: 'Cottonseed Cake',       category: 'protein', cp: 36,   me: 2100, ca: 0.17, p: 1.0,  fibre: 13,  lysine: 1.5,  methionine: 0.55, moisture: 11, maxInclusion: 15 },
  { id: 'omena',        name: 'Omena (dried dagaa)',      category: 'protein', cp: 55,   me: 2600, ca: 4.5,  p: 2.5,  fibre: 2,   lysine: 4.3,  methionine: 1.5,  moisture: 12, maxInclusion: 10 },
  { id: 'blood-meal',   name: 'Blood Meal',               category: 'protein', cp: 80,   me: 2900, ca: 0.3,  p: 0.25, fibre: 1,   lysine: 6.9,  methionine: 1.0,  moisture: 10, maxInclusion: 5  },
  { id: 'lucerne-meal', name: 'Lucerne Meal',             category: 'protein', cp: 17,   me: 1900, ca: 1.4,  p: 0.25, fibre: 25,  lysine: 0.8,  methionine: 0.25, moisture: 11, maxInclusion: 15 },
  { id: 'soya-meal',    name: 'Soya Meal',                category: 'protein', cp: 44,   me: 2450, ca: 0.3,  p: 0.65, fibre: 7,   lysine: 2.75, methionine: 0.60, moisture: 11, maxInclusion: 35 },

  // ── Minerals ──
  { id: 'limestone',    name: 'Limestone',                category: 'mineral', cp: 0,    me: 0,    ca: 38,   p: 0.02, fibre: 0,   lysine: 0,    methionine: 0,    moisture: 1,  maxInclusion: 10 },
  { id: 'dcp',          name: 'Dicalcium Phosphate (DCP)', category: 'mineral', cp: 0,   me: 0,    ca: 22,   p: 18,   fibre: 0,   lysine: 0,    methionine: 0,    moisture: 2,  maxInclusion: 3, note: 'Typical dose: 500 g/tonne' },
  { id: 'bone-meal',    name: 'Bone Meal',                category: 'mineral', cp: 10,   me: 0,    ca: 24,   p: 12,   fibre: 0,   lysine: 0.3,  methionine: 0.1,  moisture: 5,  maxInclusion: 4  },
  { id: 'salt',         name: 'Salt (NaCl)',              category: 'mineral', cp: 0,    me: 0,    ca: 0,    p: 0,    fibre: 0,   lysine: 0,    methionine: 0,    moisture: 1,  maxInclusion: 0.5 },
  { id: 'red-salt',     name: 'Red Salt',                 category: 'mineral', cp: 0,    me: 0,    ca: 0,    p: 0,    fibre: 0,   lysine: 0,    methionine: 0,    moisture: 1,  maxInclusion: 0.5 },
  { id: 'grits',        name: 'Grits',                    category: 'mineral', cp: 0,    me: 0,    ca: 35,   p: 0,    fibre: 0,   lysine: 0,    methionine: 0,    moisture: 1,  maxInclusion: 2  },

  // ── Fats ──
  { id: 'soybean-oil',  name: 'Soybean Oil',              category: 'fat',     cp: 0,    me: 8800, ca: 0,    p: 0,    fibre: 0,   lysine: 0,    methionine: 0,    moisture: 0,  maxInclusion: 4  },
  { id: 'tallow',       name: 'Tallow / Animal Fat',      category: 'fat',     cp: 0,    me: 8400, ca: 0,    p: 0,    fibre: 0,   lysine: 0,    methionine: 0,    moisture: 0,  maxInclusion: 4  },

  // ── Amino acids ──
  { id: 'dl-methionine', name: 'DL-Methionine',           category: 'amino',   cp: 58,   me: 3900, ca: 0,    p: 0,    fibre: 0,   lysine: 0,    methionine: 99,   moisture: 1,  maxInclusion: 0.4, note: 'Typical dose: 500 g/tonne' },
  { id: 'l-lysine',     name: 'L-Lysine HCl',             category: 'amino',   cp: 95,   me: 3800, ca: 0,    p: 0,    fibre: 0,   lysine: 78,   methionine: 0,    moisture: 1,  maxInclusion: 0.5, note: 'Typical dose: 500 g/tonne' },
  { id: 'l-threonine',  name: 'L-Threonine',              category: 'amino',   cp: 74,   me: 3500, ca: 0,    p: 0,    fibre: 0,   lysine: 0,    methionine: 0,    moisture: 1,  maxInclusion: 0.3 },

  // ── Ruminant-only ──
  { id: 'urea',         name: 'Urea',                     category: 'ruminant', cp: 281, me: 0,    ca: 0,    p: 0,    fibre: 0,   lysine: 0,    methionine: 0,    moisture: 1,  maxInclusion: 1, ruminantOnly: true },

  // ── Premixes / additives (fixed small inclusions) ──
  { id: 'premix-broiler', name: 'Premix (Broiler)',       category: 'premix',  cp: 0,    me: 0,    ca: 4,    p: 2,    fibre: 0,   lysine: 0,    methionine: 0,    moisture: 3,  maxInclusion: 0.5 },
  { id: 'premix-layer',   name: 'Premix (Layer)',         category: 'premix',  cp: 0,    me: 0,    ca: 6,    p: 2,    fibre: 0,   lysine: 0,    methionine: 0,    moisture: 3,  maxInclusion: 0.5 },
  { id: 'premix-dairy',   name: 'Premix (Dairy)',         category: 'premix',  cp: 0,    me: 0,    ca: 8,    p: 4,    fibre: 0,   lysine: 0,    methionine: 0,    moisture: 3,  maxInclusion: 0.5 },
  { id: 'premix-pig',     name: 'Premix (Pig)',           category: 'premix',  cp: 0,    me: 0,    ca: 5,    p: 3,    fibre: 0,   lysine: 0,    methionine: 0,    moisture: 3,  maxInclusion: 0.5 },
  { id: 'premix-general', name: 'Premix (Layers/Growers)', category: 'premix', cp: 0,    me: 0,    ca: 5,    p: 2,    fibre: 0,   lysine: 0,    methionine: 0,    moisture: 3,  maxInclusion: 0.5 },

  { id: 'toxin-binder', name: 'Toxin Binder',             category: 'additive', cp: 0,   me: 0,    ca: 0,    p: 0,    fibre: 0,   lysine: 0,    methionine: 0,    moisture: 3,  maxInclusion: 0.25, note: 'Typical dose: 500 g/tonne' },
  { id: 'coccidiostat', name: 'Coccidiostat (Bio-Gar)', category: 'additive', cp: 0, me: 0,    ca: 0,    p: 0,    fibre: 0,   lysine: 0,    methionine: 0,    moisture: 3,  maxInclusion: 0.1  },
  { id: 'egg-colour',   name: 'Egg Colour',               category: 'additive', cp: 0,   me: 0,    ca: 0,    p: 0,    fibre: 0,   lysine: 0,    methionine: 0,    moisture: 3,  maxInclusion: 0.05 },
  { id: 'yeast-culture', name: 'Yeast Culture',           category: 'additive', cp: 40,  me: 2500, ca: 0.15, p: 1.3,  fibre: 3,   lysine: 3.0,  methionine: 0.6,  moisture: 7,  maxInclusion: 2   },
  { id: 'niacin',       name: 'Niacin',                   category: 'additive', cp: 0,   me: 0,    ca: 0,    p: 0,    fibre: 0,   lysine: 0,    methionine: 0,    moisture: 1,  maxInclusion: 0.05 },
  { id: 'diamond-v',    name: 'Diamond V',                category: 'additive', cp: 18,  me: 2200, ca: 0.2,  p: 0.5,  fibre: 3,   lysine: 1.0, methionine: 0.3,   moisture: 7,  maxInclusion: 1   },
  { id: 'phytase',      name: 'Phytase',                  category: 'additive', cp: 0,   me: 0,    ca: 0,    p: 0,    fibre: 0,   lysine: 0,    methionine: 0,    moisture: 3,  maxInclusion: 0.05 },
]

export function getIngredient(id: string): Ingredient | undefined {
  return INGREDIENTS.find((i) => i.id === id)
}
