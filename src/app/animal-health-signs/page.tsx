import { Metadata } from 'next'
import Link from 'next/link'
import Layout from '@/components/Layout'
import ScrollDownButton from '@/components/ScrollDownButton'
import { getConditions, getPublishedSpecies, toCard, URGENCY_ORDER } from '@/lib/animal-health'
import HubLibrary, { type HubGroup } from './HubLibrary'
import { LightTheme, PageHero } from './shared'
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
  // Each animal's healthy guide first, then its conditions from emergencies down.
  const rank = (u: (typeof all)[number]['urgency']) => (u === 'normal' ? -1 : URGENCY_ORDER.indexOf(u))
  const groups: HubGroup[] = species.map((s) => ({
    id: s.id,
    label: s.label,
    intro: s.intro,
    cards: all
      .filter((c) => c.species === s.id)
      .sort((a, b) => rank(a.urgency) - rank(b.urgency))
      .map(toCard),
  }))

  return (
    <Layout>
      <LightTheme />
      <PageHero
        light
        className={styles.hubHero}
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
          What healthy looks like, the signs to watch for and what to do next — {conditionCount}{' '}
          conditions across {species.length} animals.
        </p>
        <p className={styles.heroNote}>
          <strong>A guide, not a diagnosis.</strong> Always confirm with a vet before treating.
        </p>
      </PageHero>

      {/* Sits on the line between hero and library so the library shows above the fold. */}
      <div className={styles.hubScroll}>
        <ScrollDownButton targetId="library" />
      </div>

      <div id="library" className={`${styles.libraryBody} ${styles.hubBody}`}>
        <HubLibrary groups={groups} />
        <div className={styles.libraryWrap}>
          <p className={styles.creditLine}>
            <Link href="/animal-health-signs/photo-credits">Photo credits</Link>
          </p>
        </div>
      </div>
    </Layout>
  )
}
