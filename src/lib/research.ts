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

  // Each researchQuery is a slow web-search call (30-90s). Running all 5
  // sequentially blew past the serverless function time limit, so the cycle
  // never reached the strategy/email step. Only 1→2 are dependent (2 consumes
  // 1's competitor list); 3, 4, 5 are independent. Run the 1→2 chain and the
  // other three concurrently so the whole step fits the function budget.
  const competitorChain = (async () => {
    console.log('[Research] Discovering competitors → analysing activity...')
    const competitorList = await discoverCompetitors()
    const competitorActivity = await getCompetitorActivity(competitorList)
    return { competitorList, competitorActivity }
  })()

  const [competitor, hashtagsRaw, industryNews, agrikimaSocialAudit] = await Promise.all([
    competitorChain,
    getTrendingHashtags(),
    getIndustryNews(),
    auditAgrikimaSocial(),
  ])

  const { competitorList, competitorActivity } = competitor

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
