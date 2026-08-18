// Single source of truth for which content types the social agent is allowed to
// post. Enforced twice: at plan time (/api/marketing/run) so the digest matches
// what ships, and at dispatch time (publish-next, publish-scheduled) so posts
// already sitting pending in the DB from an earlier policy never go out.
// Carousels are disabled because the agent only ever attaches a single poster
// image — the "Slide 1… Slide 2…" caption promised a slideshow that never
// existed. Pending carousels from earlier cycles sit out, same as articles.
export const DISABLED_CONTENT_TYPES = ['article', 'carousel'] as const

export function isDisabledContentType(contentType: string | null | undefined): boolean {
  return !!contentType && (DISABLED_CONTENT_TYPES as readonly string[]).includes(contentType)
}
