// Animal nutrient target profiles for LP solver constraints.
// Units: protein/fibre/Ca/P/lysine/methionine in %, energy in kcal/kg,
// moisture max always 13%. Values are industry-standard targets
// suitable for Kenyan feed milling.

export type NutrientTargets = {
  cp_min: number
  cp_max: number
  me_min: number
  ca_min: number
  ca_max: number
  p_min: number
  p_max: number
  fibre_max: number
  lysine_min?: number
  methionine_min?: number
  moisture_max: number
}

export type AnimalProfile = {
  id: string
  name: string
  animal: string
  isPoultry?: boolean
  isPig?: boolean
  isRuminantAdult?: boolean
  targets: NutrientTargets
}

export const ANIMAL_GROUPS: { id: string; name: string }[] = [
  { id: 'poultry', name: 'Poultry' },
  { id: 'dairy', name: 'Dairy Cattle' },
  { id: 'beef', name: 'Beef Cattle' },
  { id: 'pig', name: 'Pigs' },
  { id: 'smallrum', name: 'Goats & Sheep' },
  { id: 'rabbit', name: 'Rabbits' },
  { id: 'fish', name: 'Fish' },
]

export const PROFILES: AnimalProfile[] = [
  // ── Poultry ──
  {
    id: 'chick-crumbs', animal: 'poultry', isPoultry: true,
    name: 'Day-old Chick / Crumbs (0–2 wks)',
    targets: { cp_min: 22, cp_max: 24, me_min: 2950, ca_min: 0.9, ca_max: 1.1, p_min: 0.45, p_max: 0.75, fibre_max: 4, lysine_min: 1.25, methionine_min: 0.5, moisture_max: 13 },
  },
  {
    id: 'broiler-starter', animal: 'poultry', isPoultry: true,
    name: 'Broiler Starter (2–4 wks)',
    targets: { cp_min: 21, cp_max: 23, me_min: 3000, ca_min: 0.9, ca_max: 1.1, p_min: 0.45, p_max: 0.7, fibre_max: 5, lysine_min: 1.15, methionine_min: 0.48, moisture_max: 13 },
  },
  {
    id: 'broiler-finisher', animal: 'poultry', isPoultry: true,
    name: 'Broiler Finisher (4–6 wks)',
    targets: { cp_min: 18, cp_max: 20, me_min: 3100, ca_min: 0.85, ca_max: 1.05, p_min: 0.42, p_max: 0.7, fibre_max: 5, lysine_min: 1.0, methionine_min: 0.42, moisture_max: 13 },
  },
  {
    id: 'pullet-grower', animal: 'poultry', isPoultry: true,
    name: 'Pullet Grower (8–18 wks)',
    targets: { cp_min: 15, cp_max: 17, me_min: 2750, ca_min: 0.9, ca_max: 1.1, p_min: 0.4, p_max: 0.7, fibre_max: 7, lysine_min: 0.7, methionine_min: 0.3, moisture_max: 13 },
  },
  {
    id: 'pre-lay', animal: 'poultry', isPoultry: true,
    name: 'Pre-Lay (17–20 wks)',
    targets: { cp_min: 16, cp_max: 18, me_min: 2800, ca_min: 2.0, ca_max: 2.5, p_min: 0.42, p_max: 0.7, fibre_max: 6, lysine_min: 0.8, methionine_min: 0.38, moisture_max: 13 },
  },
  {
    id: 'layer-mash', animal: 'poultry', isPoultry: true,
    name: 'Layer Mash (20+ wks)',
    targets: { cp_min: 16, cp_max: 18, me_min: 2750, ca_min: 3.5, ca_max: 4.2, p_min: 0.38, p_max: 0.7, fibre_max: 7, lysine_min: 0.8, methionine_min: 0.38, moisture_max: 13 },
  },
  {
    id: 'kienyeji-grower', animal: 'poultry', isPoultry: true,
    name: 'Kienyeji / Indigenous Chicken Grower',
    targets: { cp_min: 15, cp_max: 17, me_min: 2700, ca_min: 1.0, ca_max: 1.3, p_min: 0.4, p_max: 0.7, fibre_max: 8, lysine_min: 0.7, methionine_min: 0.3, moisture_max: 13 },
  },

  // ── Dairy Cattle ──
  {
    id: 'calf-starter', animal: 'dairy',
    name: 'Calf Starter (3 wks – 3 mo)',
    targets: { cp_min: 20, cp_max: 22, me_min: 2800, ca_min: 0.7, ca_max: 1.1, p_min: 0.45, p_max: 0.75, fibre_max: 8, moisture_max: 13 },
  },
  {
    id: 'heifer-grower', animal: 'dairy',
    name: 'Heifer Grower (3–12 mo)',
    targets: { cp_min: 14, cp_max: 16, me_min: 2500, ca_min: 0.6, ca_max: 1.0, p_min: 0.4, p_max: 0.7, fibre_max: 12, moisture_max: 13 },
  },
  {
    id: 'dairy-high', animal: 'dairy', isRuminantAdult: true,
    name: 'Dairy Cow — High Production (>15 L/day)',
    targets: { cp_min: 18, cp_max: 20, me_min: 2700, ca_min: 0.8, ca_max: 1.1, p_min: 0.45, p_max: 0.75, fibre_max: 12, moisture_max: 13 },
  },
  {
    id: 'dairy-mid', animal: 'dairy', isRuminantAdult: true,
    name: 'Dairy Cow — Medium Production (8–15 L/day)',
    targets: { cp_min: 16, cp_max: 18, me_min: 2600, ca_min: 0.7, ca_max: 1.0, p_min: 0.42, p_max: 0.7, fibre_max: 14, moisture_max: 13 },
  },

  // ── Beef Cattle ──
  {
    id: 'beef-calf-starter', animal: 'beef',
    name: 'Beef Calf Starter',
    targets: { cp_min: 16, cp_max: 18, me_min: 2700, ca_min: 0.6, ca_max: 1.0, p_min: 0.4, p_max: 0.7, fibre_max: 10, moisture_max: 13 },
  },
  {
    id: 'beef-finisher', animal: 'beef', isRuminantAdult: true,
    name: 'Feedlot Grower / Finisher',
    targets: { cp_min: 12, cp_max: 14, me_min: 2800, ca_min: 0.5, ca_max: 0.9, p_min: 0.35, p_max: 0.65, fibre_max: 9, moisture_max: 13 },
  },

  // ── Pigs ──
  {
    id: 'creep-feed', animal: 'pig', isPig: true,
    name: 'Creep Feed',
    targets: { cp_min: 20, cp_max: 22, me_min: 3300, ca_min: 0.8, ca_max: 1.0, p_min: 0.5, p_max: 0.75, fibre_max: 4, lysine_min: 1.35, moisture_max: 13 },
  },
  {
    id: 'piglet-weaner', animal: 'pig', isPig: true,
    name: 'Piglet Weaner',
    targets: { cp_min: 18, cp_max: 20, me_min: 3200, ca_min: 0.75, ca_max: 1.0, p_min: 0.45, p_max: 0.7, fibre_max: 5, lysine_min: 1.2, moisture_max: 13 },
  },
  {
    id: 'pig-grower', animal: 'pig', isPig: true,
    name: 'Pig Grower (10–50 kg)',
    targets: { cp_min: 16, cp_max: 18, me_min: 3100, ca_min: 0.6, ca_max: 0.9, p_min: 0.4, p_max: 0.65, fibre_max: 6, lysine_min: 0.95, moisture_max: 13 },
  },
  {
    id: 'pig-finisher', animal: 'pig', isPig: true,
    name: 'Pig Finisher (50 kg – market)',
    targets: { cp_min: 14, cp_max: 16, me_min: 3100, ca_min: 0.5, ca_max: 0.8, p_min: 0.35, p_max: 0.6, fibre_max: 7, lysine_min: 0.8, moisture_max: 13 },
  },

  // ── Goats & Sheep ──
  {
    id: 'kid-lamb', animal: 'smallrum',
    name: 'Kid / Lamb Starter',
    targets: { cp_min: 18, cp_max: 20, me_min: 2800, ca_min: 0.7, ca_max: 1.0, p_min: 0.4, p_max: 0.7, fibre_max: 8, moisture_max: 13 },
  },
  {
    id: 'goat-grower', animal: 'smallrum', isRuminantAdult: true,
    name: 'Grower / Finisher',
    targets: { cp_min: 14, cp_max: 16, me_min: 2600, ca_min: 0.5, ca_max: 0.9, p_min: 0.35, p_max: 0.65, fibre_max: 12, moisture_max: 13 },
  },
  {
    id: 'dairy-goat', animal: 'smallrum', isRuminantAdult: true,
    name: 'Dairy Goat Lactating',
    targets: { cp_min: 16, cp_max: 18, me_min: 2650, ca_min: 0.75, ca_max: 1.05, p_min: 0.4, p_max: 0.7, fibre_max: 12, moisture_max: 13 },
  },

  // ── Rabbits ──
  {
    id: 'rabbit-weaner', animal: 'rabbit',
    name: 'Weaner',
    targets: { cp_min: 17, cp_max: 19, me_min: 2500, ca_min: 0.7, ca_max: 1.0, p_min: 0.4, p_max: 0.7, fibre_max: 14, moisture_max: 13 },
  },
  {
    id: 'rabbit-grower', animal: 'rabbit',
    name: 'Grower / Finisher',
    targets: { cp_min: 15, cp_max: 17, me_min: 2400, ca_min: 0.6, ca_max: 0.9, p_min: 0.35, p_max: 0.65, fibre_max: 16, moisture_max: 13 },
  },
  {
    id: 'rabbit-doe', animal: 'rabbit',
    name: 'Breeding Doe',
    targets: { cp_min: 17, cp_max: 19, me_min: 2600, ca_min: 0.8, ca_max: 1.1, p_min: 0.45, p_max: 0.7, fibre_max: 14, moisture_max: 13 },
  },

  // ── Fish ──
  {
    id: 'tilapia-fingerling', animal: 'fish',
    name: 'Tilapia Fingerling',
    targets: { cp_min: 32, cp_max: 36, me_min: 3000, ca_min: 0.8, ca_max: 1.5, p_min: 0.6, p_max: 1.2, fibre_max: 6, moisture_max: 13 },
  },
  {
    id: 'tilapia-grower', animal: 'fish',
    name: 'Tilapia Grower',
    targets: { cp_min: 28, cp_max: 32, me_min: 2900, ca_min: 0.8, ca_max: 1.3, p_min: 0.55, p_max: 1.0, fibre_max: 7, moisture_max: 13 },
  },
  {
    id: 'catfish-grower', animal: 'fish',
    name: 'Catfish Grower',
    targets: { cp_min: 30, cp_max: 35, me_min: 3000, ca_min: 0.8, ca_max: 1.3, p_min: 0.6, p_max: 1.0, fibre_max: 6, moisture_max: 13 },
  },
]

export function getProfile(id: string): AnimalProfile | undefined {
  return PROFILES.find((p) => p.id === id)
}

export function profilesByAnimal(animal: string): AnimalProfile[] {
  return PROFILES.filter((p) => p.animal === animal)
}
