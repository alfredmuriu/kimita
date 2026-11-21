// Client-safe parts of the animal-health library: types and urgency labels.
// Kept separate from animal-health.ts so client components don't pull the
// generated content JSON into the browser bundle.

import type { Urgency, Photo } from '@/content/animal-health/conditions'
import type { SpeciesId } from '@/content/animal-health/species'

export type { Urgency, SpeciesId }

/** Who took a real photo and the licence it is used under (photo-credits.json). */
export interface PhotoCredit {
  author: string
  license: string
  licenseUrl?: string
  /** Page the photo came from, e.g. its Wikimedia Commons file page. */
  source: string
}

/** Everything a card needs — small enough to pass to client components. */
export interface ConditionCard {
  credit?: PhotoCredit
  species: SpeciesId
  id: string
  name: string
  urgency: Urgency
  report: boolean
  photo: Photo
  image: string
  href: string
  headline: string
  look: string
  action: string
  aka: string[]
}

export const URGENCY: Record<Urgency, { label: string; hint: string }> = {
  normal: { label: 'Healthy', hint: 'What normal looks like — compare against this' },
  watch: { label: 'Watch', hint: 'Monitor closely and correct feeding, housing or parasite control' },
  vet: { label: 'Call a vet', hint: 'Get a vet or animal health worker within a day' },
  emergency: { label: 'Emergency', hint: 'Call a vet now — the animal or herd is at serious risk' },
}

export const URGENCY_ORDER: Urgency[] = ['emergency', 'vet', 'watch', 'normal']
