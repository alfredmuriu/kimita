// Bio-Gar — Agrikima garlic powder additive (Allicin).
// Mandatory in every formula. Fixed percentage (subtracted before LP runs).

export type BioGarPurpose = 'additive' | 'growth' | 'antibiotic'

export const BIOGAR_RATES: Record<BioGarPurpose, { grams_per_tonne: number; percent: number; label: string }> = {
  additive:   { grams_per_tonne: 100, percent: 0.01,  label: 'Feed Additive' },
  growth:     { grams_per_tonne: 250, percent: 0.025, label: 'Growth Promotion' },
  antibiotic: { grams_per_tonne: 500, percent: 0.05,  label: 'Antibiotic Replacement' },
}

export const BIOGAR_DEFAULT_PURPOSE: BioGarPurpose = 'growth'
export const BIOGAR_RUMINANT_DEFAULT: BioGarPurpose = 'additive'
export const BIOGAR_RUMINANT_NOTE =
  'Note: Bio-Gar is most effective in poultry, pigs, and young animals. In adult ruminants it provides rumen microbiome and mastitis benefits.'
