import { Metadata } from 'next'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { getConditions, getPublishedSpecies } from '@/lib/animal-health'
import { PageHero, Row, SectionHeader } from './shared'
import styles from './signs.module.css'

const URL = 'https://www.agrikima.co.ke/animal-health-signs'
const TITLE = 'Spot the Signs — Animal Health Library for Farmers'
const DESCRIPTION =
  'Recognise illness in cattle, goats, sheep, poultry, pigs, rabbits, fish, camels and donkeys — signs, causes, treatment, prevention and when to call a vet.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: 'Agrikima' },
}

// Healthy-animal covers shown in the hero mosaic.
const MOSAIC = ['cattle', 'poultry', 'goats', 'pigs']

export default function AnimalHealthHub() {
  const species = getPublishedSpecies()
  const all = getConditions()
  const conditionCount = all.filter((c) => c.urgency !== 'normal').length
  const cover = (id: string) => {
    const s = species.find((x) => x.id === id)
    const list = all.filter((c) => c.species === id)
    return list.find((c) => c.id === s?.coverImage) ?? list[0]
  }

  return (
    <Layout>
      <PageHero
        aside={
          <div className={styles.mosaic} aria-hidden="true">
            {MOSAIC.map((id) => {
              const c = cover(id)
              return c && c.photo !== 'pending' ? <img key={id} src={c.image} alt="" loading="eager" width={480} height={480} /> : null
            })}
          </div>
        }
      >
        <span className={styles.pretitle}>Agrikima Academy · Visual Guide</span>
        <h1 className={styles.heroTitle}>Spot the signs before they become a crisis.</h1>
        <p className={styles.heroDesc}>
          Most animal diseases show on the outside first. Learn what healthy looks like, the
          signs to watch for, and what to do next — {conditionCount} conditions across{' '}
          {species.length} animals, each with causes, treatment and prevention.
        </p>
        <p className={styles.heroNote}>
          <strong>A guide, not a diagnosis.</strong> Always confirm with a vet before treating.
        </p>
      </PageHero>

      <section className="s-about">
        <SectionHeader
          pretitle="Choose your animal"
          title="Nine animals. Every common disease, explained the way a vet would explain it."
          desc="Start with the healthy-animal guide for each species, then work through the conditions — sorted from emergencies that need a vet today to problems you can watch and manage on the farm."
        />
        <Row>
          <div className={styles.cards}>
            {species.map((s) => {
              const list = all.filter((c) => c.species === s.id)
              const conditions = list.filter((c) => c.urgency !== 'normal').length
              const emergencies = list.filter((c) => c.urgency === 'emergency').length
              const img = cover(s.id)
              return (
                <Link key={s.id} href={`/animal-health-signs/${s.id}`} className={styles.card}>
                  <div className={styles.cardMedia}>
                    {img && img.photo !== 'pending' && (
                      <img src={img.image} alt={`A healthy ${s.singular}`} loading="lazy" width={960} height={720} />
                    )}
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.labels}>
                      <span className={`${styles.urgency} ${styles.u_normal}`}>
                        {conditions} conditions{emergencies ? ` · ${emergencies} emergencies` : ''}
                      </span>
                    </div>
                    <h3 className={styles.cardTitle}>{s.label}</h3>
                    <p className={styles.cardText}>{s.intro}</p>
                    <span className={styles.cardMore}>Explore {s.label.toLowerCase()}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </Row>
      </section>
    </Layout>
  )
}
