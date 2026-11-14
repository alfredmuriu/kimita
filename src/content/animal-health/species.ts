// Animal categories for the "Spot the Signs" animal-health library
// (/animal-health-signs). Kept import-free so Node scripts can load it directly.

export type SpeciesId =
  | 'cattle'
  | 'goats'
  | 'sheep'
  | 'poultry'
  | 'pigs'
  | 'rabbits'
  | 'fish'
  | 'camels'
  | 'donkeys'

export interface Species {
  id: SpeciesId
  label: string
  /** Singular noun used in prose ("a healthy cow"). */
  singular: string
  intro: string
  /** Condition id whose image represents the species on the hub page. */
  coverImage: string
  /**
   * Agrikima products whose label covers this species. The content generator
   * may only recommend from this list, and the loader drops anything else.
   */
  products: string[]
}

const RUMINANT_PRODUCTS = ['ade-3', 'k-digest', 're-cover', 'optimum-24', 'mix-5', 'dcp-18', 'agritoxinilstop', 'toxinil']

export const SPECIES: Species[] = [
  {
    id: 'poultry',
    label: 'Poultry',
    singular: 'chicken',
    intro: 'Layers, broilers and kienyeji chickens — viral killers, gut and breathing problems, nutrition, parasites and egg quality.',
    coverImage: 'healthy',
    products: [
      'advice', 'bio-gar', 'immusol', 'biogard-99', 'gonat', 'agritonic', 'agrivitam', 'mix-5',
      'k-digest', 're-cover', 'optimum-24', 'antistrs-300', 'agristarter', 'agrigrower', 'agrifinisher',
      'agrilayer', 'agritoxinilstop', 'toxinil', 'ade-3', 'dcp-18', 'betaine', 'choline-chloride',
      'dl-methionine', 'methionine', 'lysine', 'threonine', 'nitritic',
    ],
  },
  {
    id: 'cattle',
    label: 'Cattle',
    singular: 'cow',
    intro: 'Dairy and beef cattle — tick-borne fevers, udder health, digestive upsets, lameness and the big notifiable diseases.',
    coverImage: 'healthy',
    products: RUMINANT_PRODUCTS,
  },
  {
    id: 'goats',
    label: 'Goats',
    singular: 'goat',
    intro: 'Dairy and meat goats — worms and anaemia, PPR, pneumonia, skin and foot problems, and kidding troubles.',
    coverImage: 'healthy',
    products: RUMINANT_PRODUCTS,
  },
  {
    id: 'sheep',
    label: 'Sheep',
    singular: 'sheep',
    intro: 'Wool and meat sheep — worms, liver fluke, foot rot, pox, bluetongue and lambing problems.',
    coverImage: 'healthy',
    products: RUMINANT_PRODUCTS,
  },
  {
    id: 'pigs',
    label: 'Pigs',
    singular: 'pig',
    intro: 'Sows, piglets and growers — African swine fever, scours, pneumonia, skin problems and sow fertility.',
    coverImage: 'healthy',
    products: ['ade-3', 'k-digest', 're-cover', 'dcp-18', 'agritoxinilstop', 'toxinil', 'agripig-sow', 'lysine'],
  },
  {
    id: 'rabbits',
    label: 'Rabbits',
    singular: 'rabbit',
    intro: 'Meat and breeding rabbits — coccidiosis, snuffles, ear mites, sore hocks, gut stasis and heat stress.',
    coverImage: 'healthy',
    products: ['ade-3'],
  },
  {
    id: 'fish',
    label: 'Fish',
    singular: 'fish',
    intro: 'Pond tilapia and catfish — water quality, oxygen, bacterial and fungal infections, and parasites.',
    coverImage: 'healthy',
    products: [],
  },
  {
    id: 'camels',
    label: 'Camels',
    singular: 'camel',
    intro: 'Dromedary camels in pastoral areas — surra, camel pox, mange, skin necrosis, ticks and udder health.',
    coverImage: 'healthy',
    products: ['ade-3', 'k-digest', 're-cover', 'optimum-24', 'agritoxinilstop'],
  },
  {
    id: 'donkeys',
    label: 'Donkeys',
    singular: 'donkey',
    intro: 'Working donkeys — colic, hoof care, harness wounds, worms, tetanus and breathing infections.',
    coverImage: 'healthy',
    products: ['ade-3', 'k-digest', 're-cover', 'optimum-24'],
  },
]

export function getSpecies(id: string): Species | undefined {
  return SPECIES.find((s) => s.id === id)
}
