import { researchQuery } from '@/lib/claude'

export interface ResearchFindings {
  competitors: CompetitorProfile[]
  trendingHashtags: Record<string, string[]>
  industryNews: string
  agrikimaSocialAudit: string
  researchedAt: string
}

interface CompetitorProfile {
  name: string
  handles: Record<string, string>
  recentActivity: string
  contentGaps: string
}

// ── 1. Competitor Discovery ───────────────────────────────────────────────────
async function discoverCompetitors(): Promise<string> {
  return researchQuery(
    `Search for the top competitors of Agrikima in the organic animal health and agribusiness space in East Africa (Kenya, Uganda, Rwanda, Tanzania).

    Look for companies selling:
    - Animal health products (vaccines, supplements, vitamins)
    - Organic or natural farming inputs
    - Veterinary supplies and solutions
    - Livestock and poultry health products

    For each competitor found, return:
    - Company name
    - Their social media handles (LinkedIn, Twitter, Facebook, Instagram)
    - What they sell
    - What markets they operate in

    Return as a structured list of at least 5 competitors.`
  )
}

// ── 2. Competitor Activity ────────────────────────────────────────────────────
async function getCompetitorActivity(competitorList: string): Promise<string> {
  return researchQuery(
    `Based on these competitors in the East Africa organic animal health space: ${competitorList}

    Search what each of them is currently posting and talking about on LinkedIn, Twitter, Facebook, and their websites.

    For each competitor identify:
    - Main content themes they focus on
    - Recent announcements or campaigns
    - Content gaps — topics they are NOT covering that Agrikima could own
    - Engagement style (educational, promotional, community-focused)

    Return a detailed summary per competitor.`
  )
}

// ── 3. Trending Hashtags ──────────────────────────────────────────────────────
async function getTrendingHashtags(): Promise<string> {
  return researchQuery(
    `Search for the top trending hashtags right now for these topics on social media (LinkedIn, Twitter, Instagram):

    - Organic animal health / natural farming
    - Dairy farming in Kenya and East Africa
    - Poultry farming East Africa
    - Livestock and animal nutrition
    - Agribusiness Kenya
    - Sustainable farming Africa
    - Veterinary / animal health
    - AMR (antimicrobial resistance) in livestock

    Return the top 10 hashtags per topic, and indicate which platforms each hashtag performs best on.`
  )
}

// ── 4. Industry News ──────────────────────────────────────────────────────────
async function getIndustryNews(): Promise<string> {
  return researchQuery(
    `Search for the latest news from the last 24-48 hours in these areas relevant to Agrikima's business in East Africa:

    - Animal disease outbreaks or alerts in Kenya, Uganda, Rwanda, Tanzania
    - New government regulations on livestock, veterinary products, or farming inputs
    - Market shifts in agribusiness or animal health sector in East Africa
    - Sustainable farming or organic agriculture news in Africa
    - Antimicrobial resistance (AMR) developments in livestock sector
    - Dairy, poultry, or livestock market prices or trends

    Summarise the top 5 most relevant news items with source and date.`
  )
}

// ── 5. Agrikima Social Audit ──────────────────────────────────────────────────
async function auditAgrikimaSocial(): Promise<string> {
  return researchQuery(
    `Search for Agrikima's current social media presence on all platforms:

    - Twitter/X: @AgrikimaB
    - LinkedIn: linkedin.com/company/agrikima
    - Facebook: facebook.com/AgriKimaSdnBhd
    - Instagram: search for Agrikima
    - Website: agrikima.co.ke

    For each platform identify:
    - When was the last post published?
    - What topics are they posting about?
    - Which platforms are active vs inactive?
    - What content gaps exist (topics they should be posting about but aren't)?
    - Estimated engagement levels

    Return a platform-by-platform audit summary.`
  )
}

// ── Main research runner ──────────────────────────────────────────────────────
export async function runResearch(): Promise<ResearchFindings> {
  console.log('[Research] Starting intelligence gathering...')

  // Run all research tasks
  console.log('[Research] 1/5 Discovering competitors...')
  const competitorList = await discoverCompetitors()

  console.log('[Research] 2/5 Analysing competitor activity...')
  const competitorActivity = await getCompetitorActivity(competitorList)

  console.log('[Research] 3/5 Finding trending hashtags...')
  const hashtagsRaw = await getTrendingHashtags()

  console.log('[Research] 4/5 Gathering industry news...')
  const industryNews = await getIndustryNews()

  console.log('[Research] 5/5 Auditing Agrikima social presence...')
  const agrikimaSocialAudit = await auditAgrikimaSocial()

  console.log('[Research] Complete.')

  return {
    competitors: [
      {
        name: 'Various East Africa competitors',
        handles: {},
        recentActivity: competitorActivity,
        contentGaps: competitorList,
      },
    ],
    trendingHashtags: {
      raw: [hashtagsRaw],
    } as unknown as Record<string, string[]>,
    industryNews,
    agrikimaSocialAudit,
    researchedAt: new Date().toISOString(),
  }
}
