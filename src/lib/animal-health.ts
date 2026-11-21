// Loader for the animal-health library (/animal-health-signs). Merges the
// condition list (conditions.ts), the generated long-form content
// (generated/<species>.json) and product details into page-ready objects.

import { CONDITIONS, type ConditionSpec } from '@/content/animal-health/conditions'
import { SPECIES, getSpecies, type Species, type SpeciesId } from '@/content/animal-health/species'
import { PRODUCT_CATALOG } from '@/lib/products-catalog'
import { ALL_PRODUCTS } from '@/lib/related-products'
import cattle from '@/content/animal-health/generated/cattle.json'
import goats from '@/content/animal-health/generated/goats.json'
import sheep from '@/content/animal-health/generated/sheep.json'
import poultry from '@/content/animal-health/generated/poultry.json'
import pigs from '@/content/animal-health/generated/pigs.json'
import rabbits from '@/content/animal-health/generated/rabbits.json'
import fish from '@/content/animal-health/generated/fish.json'
import camels from '@/content/animal-health/generated/camels.json'
import donkeys from '@/content/animal-health/generated/donkeys.json'
import photoCredits from '@/content/animal-health/photo-credits.json'

import { URGENCY, URGENCY_ORDER, type ConditionCard, type PhotoCredit, type Urgency } from '@/lib/animal-health-client'

export { SPECIES, getSpecies, URGENCY, URGENCY_ORDER }
export type { Species, SpeciesId, Urgency, ConditionCard, PhotoCredit }

const CREDITS = photoCredits as Record<string, PhotoCredit>

export interface ConditionDetail {
  aka: string[]
  summary: string
  cause: string
  spread: string[]
  atRisk: string
  signs: { early: string[]; advanced: string[] }
  lookalikes: { name: string; howToTell: string }[]
  diagnosis: string
  firstSteps: string[]
  vetTreatment: string
  prevention: string[]
  impact: string
  humanHealth: string
  outlook: string
  faqs: { q: string; a: string }[]
}

interface Generated {
  card: { headline: string; look: string; action: string }
  detail: ConditionDetail
  products: { slug: string; role: string }[]
  imagePrompt: string
  seoDescription: string
}

export interface ProductLink {
  slug: string
  name: string
  image: string
  purpose: string
  role: string
}

export interface Condition extends ConditionCard {
  detail: ConditionDetail
  products: ProductLink[]
  seoDescription: string
}

const GENERATED: Record<string, Record<string, Generated>> = {
  cattle, goats, sheep, poultry, pigs, rabbits, fish, camels, donkeys,
} as unknown as Record<string, Record<string, Generated>>

function productLink(slug: string, role: string): ProductLink | null {
  const catalog = PRODUCT_CATALOG.find((p) => p.slug === slug)
  const meta = ALL_PRODUCTS.find((p) => p.slug === slug)
  if (!catalog || !meta) return null
  return { slug, name: catalog.name, image: meta.image, purpose: catalog.purpose, role }
}

function build(spec: ConditionSpec): Condition | null {
  const gen = GENERATED[spec.species]?.[spec.id]
  // Conditions without generated content aren't published yet.
  if (!gen) return null
  const species = getSpecies(spec.species)!
  const allowed = new Set(species.products)
  return {
    species: species.id,
    id: spec.id,
    name: spec.name,
    urgency: spec.urgency,
    report: spec.report,
    photo: spec.photo,
    credit: spec.photo === 'real' ? CREDITS[`${spec.species}/${spec.id}`] : undefined,
    image: `/images/animal-health/${spec.species}/${spec.id}.webp`,
    href: `/animal-health-signs/${spec.species}/${spec.id}`,
    headline: gen.card.headline,
    look: gen.card.look,
    action: gen.card.action,
    aka: gen.detail.aka,
    detail: gen.detail,
    // Belt-and-braces: only label-approved products, never on notifiable diseases.
    products: spec.report
      ? []
      : gen.products
          .filter((p) => allowed.has(p.slug))
          .map((p) => productLink(p.slug, p.role))
          .filter((p): p is ProductLink => p !== null),
    seoDescription: gen.seoDescription,
  }
}

const ALL: Condition[] = CONDITIONS.map(build).filter((c): c is Condition => c !== null)

export function toCard(c: Condition): ConditionCard {
  const { detail, products, seoDescription, ...card } = c
  void detail; void products; void seoDescription
  return card
}

export function getConditions(species?: string): Condition[] {
  return species ? ALL.filter((c) => c.species === species) : ALL
}

export function getCondition(species: string, id: string): Condition | undefined {
  return ALL.find((c) => c.species === species && c.id === id)
}

/** Species that have at least one published condition. */
export function getPublishedSpecies(): Species[] {
  return SPECIES.filter((s) => ALL.some((c) => c.species === s.id))
}

/** A few neighbouring conditions for the "related" strip on a detail page. */
export function getRelated(c: Condition, count = 4): Condition[] {
  const same = ALL.filter((x) => x.species === c.species && x.id !== c.id && x.urgency !== 'normal')
  const i = Math.max(0, same.findIndex((x) => CONDITIONS.findIndex((s) => s.species === x.species && s.id === x.id) > CONDITIONS.findIndex((s) => s.species === c.species && s.id === c.id)))
  return [...same.slice(i), ...same.slice(0, i)].slice(0, count)
}
