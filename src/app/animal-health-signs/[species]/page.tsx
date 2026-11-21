import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Layout from '@/components/Layout'
import { getConditions, getPublishedSpecies, getSpecies, toCard, URGENCY_ORDER } from '@/lib/animal-health'
import ConditionGrid from '../ConditionGrid'
import { ConditionImage, LightTheme, PageHero, UrgencyLabels } from '../shared'
import styles from '../signs.module.css'

export const dynamicParams = false

export function generateStaticParams() {
  return getPublishedSpecies().map((s) => ({ species: s.id }))
}

export function generateMetadata({ params }: { params: { species: string } }): Metadata {
  const s = getSpecies(params.species)
  if (!s) return {}
  const url = `https://www.agrikima.co.ke/animal-health-signs/${s.id}`
  const title = `${s.label} Health — Signs of Disease and What to Do`
  const description = `Spot the signs of illness in ${s.label.toLowerCase()}: ${s.intro} Causes, treatment, prevention and when to call a vet.`.slice(0, 300)
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'Agrikima' },
  }
}

export default function SpeciesPage({ params }: { params: { species: string } }) {
  const species = getSpecies(params.species)
  if (!species) notFound()
  const conditions = getConditions(species.id)
  // The healthy baseline gets its own block under the intro; the grid holds the
  // problems, most urgent first, keeping list order within a level.
  const healthy = conditions.find((c) => c.urgency === 'normal')
  const cards = conditions
    .filter((c) => c.urgency !== 'normal')
    .sort((a, b) => URGENCY_ORDER.indexOf(a.urgency) - URGENCY_ORDER.indexOf(b.urgency))
    .map(toCard)
  const count = cards.length

  return (
    <Layout>
      <LightTheme />
      <PageHero light>
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link href="/animal-health-signs">Spot the Signs</Link>
          <span>/</span>
          <span>{species.label}</span>
        </nav>
        <h1 className={styles.heroTitle}>{species.label} health: spot the signs.</h1>
        <p className={styles.heroDesc}>{species.intro}</p>
        <p className={styles.heroNote}>
          <strong>{count} conditions.</strong> Start with what healthy looks like, then the signs that need action — sorted
          from emergencies to problems you can watch. Tap any card for the full guide.
        </p>
      </PageHero>

      {healthy && (
        <section className={styles.healthyFeature}>
          <div className="row">
            <div className="column lg-12">
              <div className={styles.heroGrid}>
                <div>
                  <UrgencyLabels c={healthy} />
                  <h2 className={styles.healthyTitle}>{healthy.name}</h2>
                  {healthy.detail.aka.length > 0 && (
                    <p className={styles.heroAka}>Also called: {healthy.detail.aka.join(', ')}</p>
                  )}
                  <p className={styles.heroDesc}>{healthy.detail.summary}</p>
                  <Link href={`/animal-health-signs/${species.id}/${healthy.id}`} className={styles.cardMore}>
                    Read the full health-check guide
                  </Link>
                </div>
                <Link href={`/animal-health-signs/${species.id}/${healthy.id}`} className={styles.heroMedia} aria-label={healthy.name}>
                  <ConditionImage c={healthy} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className={styles.libraryBody}>
        <div className={styles.libraryWrap}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarSticky}>
              <div className={styles.sidebarTitle}>Animals</div>
              <ul className={styles.sidebarMenu}>
                {getPublishedSpecies().map((s) => {
                  const active = s.id === species.id
                  return (
                    <li key={s.id}>
                      <Link
                        href={`/animal-health-signs/${s.id}`}
                        className={`${styles.sidebarLink} ${active ? styles.sidebarActive : ''}`}
                        aria-current={active ? 'page' : undefined}
                      >
                        <span>{s.label}</span>
                        <span className={styles.sidebarCount}>
                          {getConditions(s.id).filter((c) => c.urgency !== 'normal').length}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </aside>

          <div className={styles.libraryMain}>
            <ConditionGrid cards={cards} />
            <p className={styles.creditLine}>
              <Link href="/animal-health-signs/photo-credits">Photo credits</Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
