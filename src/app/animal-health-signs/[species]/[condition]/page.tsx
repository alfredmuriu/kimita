import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Layout from '@/components/Layout'
import { getCondition, getConditions, getRelated, getSpecies, toCard } from '@/lib/animal-health'
import ArticleToc from '../../ArticleToc'
import { ConditionCardView, ConditionImage, LightTheme, PhotoCreditLine, Row, SectionHeader } from '../../shared'
import styles from '../../signs.module.css'

export const dynamicParams = false

export function generateStaticParams() {
  return getConditions().map((c) => ({ species: c.species, condition: c.id }))
}

type Params = { params: { species: string; condition: string } }

export function generateMetadata({ params }: Params): Metadata {
  const c = getCondition(params.species, params.condition)
  const s = getSpecies(params.species)
  if (!c || !s) return {}
  const url = `https://www.agrikima.co.ke${c.href}`
  const title = c.urgency === 'normal' ? `${c.name} — ${s.label} Health Check` : `${c.name} in ${s.label} — Signs, Treatment & Prevention`
  return {
    title,
    description: c.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: c.seoDescription,
      url,
      siteName: 'Agrikima',
      type: 'article',
      images: c.photo === 'pending' ? undefined : [{ url: `https://www.agrikima.co.ke${c.image}` }],
    },
  }
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className={styles.bullets}>
      {items.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  )
}

export default function ConditionPage({ params }: Params) {
  const c = getCondition(params.species, params.condition)
  const species = getSpecies(params.species)
  if (!c || !species) notFound()
  const d = c.detail
  const healthy = c.urgency === 'normal'

  // Section list drives both the article and the "On this page" nav.
  const sections: { id: string; title: string; show: boolean }[] = [
    { id: 'overview', title: healthy ? 'What keeps them healthy' : 'What it is', show: true },
    { id: 'signs', title: healthy ? 'Normal vs warning signs' : 'Signs to look for', show: true },
    { id: 'first-steps', title: healthy ? 'Daily routine' : 'What to do right now', show: d.firstSteps.length > 0 },
    { id: 'spread', title: healthy ? 'Common risks' : 'How it spreads', show: d.spread.length > 0 },
    { id: 'lookalikes', title: healthy ? 'Often mistaken for illness' : 'Could it be something else?', show: d.lookalikes.length > 0 },
    { id: 'diagnosis', title: healthy ? 'Doing a health check' : 'How it is diagnosed', show: !!d.diagnosis },
    { id: 'treatment', title: healthy ? 'Routine vet care' : 'Treatment', show: !!d.vetTreatment },
    { id: 'products', title: 'How Agrikima products can help', show: c.products.length > 0 },
    { id: 'prevention', title: healthy ? 'Keeping them healthy' : 'Prevention', show: d.prevention.length > 0 },
    { id: 'human-health', title: 'Risk to people', show: !!d.humanHealth.trim() },
    { id: 'impact', title: 'Impact on your farm', show: !!d.impact },
    { id: 'outlook', title: healthy ? 'Long-term health' : 'Outlook and recovery', show: !!d.outlook },
    { id: 'faqs', title: 'Common questions', show: d.faqs.length > 0 },
  ].filter((s) => s.show)

  const related = getRelated(c).slice(0, 3).map(toCard)

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Spot the Signs', item: 'https://www.agrikima.co.ke/animal-health-signs' },
        { '@type': 'ListItem', position: 2, name: species.label, item: `https://www.agrikima.co.ke/animal-health-signs/${species.id}` },
        { '@type': 'ListItem', position: 3, name: c.name, item: `https://www.agrikima.co.ke${c.href}` },
      ],
    },
    d.faqs.length > 0 && {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: d.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ].filter(Boolean)

  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <LightTheme />
      {/* The "On this page" list stays fixed on the left from the top of the page;
          the introduction is its first entry. */}
      <section className={`${styles.hero} ${styles.heroLight} ${styles.articlePage}`}>
        <Row>
          <div className={styles.detail}>
            <header id="introduction" className={styles.articleIntro}>
              <nav className={styles.crumbs} aria-label="Breadcrumb">
                <Link href="/animal-health-signs">Spot the Signs</Link>
                <span>/</span>
                <Link href={`/animal-health-signs/${species.id}`}>{species.label}</Link>
              </nav>
              <h1 className={styles.heroTitle}>{c.name}</h1>
              {d.aka.length > 0 && <p className={styles.heroAka}>Also called: {d.aka.join(', ')}</p>}
              <p className={styles.heroDesc}>{d.summary}</p>
              <div className={styles.heroMedia}>
                <ConditionImage c={c} eager />
              </div>
              {!healthy && (
                <div className={styles.heroFacts}>
                  <div>
                    <span className={styles.pretitle}>Key sign</span>
                    <ul className={styles.factList}>
                      {[c.headline, ...c.look.split(/(?<=[.!?])\s+/)].filter(Boolean).map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>
                  <div className={c.report ? styles.factReport : undefined}>
                    <span className={styles.pretitle}>{c.report ? 'Report it' : 'First step'}</span>
                    <p>{c.action}</p>
                  </div>
                </div>
              )}
            </header>

            <ArticleToc sections={sections.map(({ id, title }) => ({ id, title }))} />

            <article className={styles.article}>
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} className={styles.section}>
                  <span className={styles.secNum}>{String(i + 1).padStart(2, '0')}.</span>
                  <h2>{s.title}</h2>
                  {s.id === 'overview' && (
                    <>
                      <p>{d.cause}</p>
                      {d.atRisk && (
                        <>
                          <h3>{healthy ? 'What to keep an eye on' : 'Which animals are most at risk'}</h3>
                          <p>{d.atRisk}</p>
                        </>
                      )}
                    </>
                  )}
                  {s.id === 'signs' && (
                    <div className={styles.signCols}>
                      <div>
                        <h3>{healthy ? 'Signs of good health' : 'Early signs'}</h3>
                        <Bullets items={d.signs.early} />
                      </div>
                      <div>
                        <h3>{healthy ? 'First signs something is wrong' : 'As it gets worse'}</h3>
                        <Bullets items={d.signs.advanced} />
                      </div>
                    </div>
                  )}
                  {s.id === 'first-steps' && (
                    <ol className={styles.steps}>
                      {d.firstSteps.map((t, j) => (
                        <li key={j}>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                  {s.id === 'spread' && <Bullets items={d.spread} />}
                  {s.id === 'lookalikes' &&
                    d.lookalikes.map((l) => (
                      <div key={l.name} className={styles.lookalike}>
                        <h3 className={styles.lookName}>{l.name}</h3>
                        <p>{l.howToTell}</p>
                      </div>
                    ))}
                  {s.id === 'diagnosis' && <p>{d.diagnosis}</p>}
                  {s.id === 'treatment' && (
                    <>
                      <p>{d.vetTreatment}</p>
                      {!healthy && (
                        <p className={styles.caution}>
                          Medicines must be prescribed and dosed by a vet. Always respect milk and
                          meat withdrawal periods, and finish the full course of any antibiotic.
                        </p>
                      )}
                    </>
                  )}
                  {s.id === 'products' && (
                    <>
                      <p>
                        These support the animal alongside — never instead of — your vet&apos;s
                        treatment, vaccination and good management.
                      </p>
                      <div className={styles.productGrid}>
                        {c.products.map((p) => (
                          <Link key={p.slug} href={`/products/${p.slug}`} className={styles.product}>
                            <div className={styles.productImg}>
                              <img src={p.image} alt={p.name} loading="lazy" />
                            </div>
                            <p className={styles.productName}>{p.name}</p>
                            <p className={styles.productRole}>{p.role}</p>
                            <span className={styles.cardMore}>View product</span>
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                  {s.id === 'prevention' && <Bullets items={d.prevention} />}
                  {s.id === 'human-health' && (
                    <div className={styles.humanBox}>
                      <p>{d.humanHealth}</p>
                    </div>
                  )}
                  {s.id === 'impact' && <p>{d.impact}</p>}
                  {s.id === 'outlook' && <p>{d.outlook}</p>}
                  {s.id === 'faqs' &&
                    d.faqs.map((f) => (
                      <details key={f.q} className={styles.faq}>
                        <summary>{f.q}</summary>
                        <p>{f.a}</p>
                      </details>
                    ))}
                </section>
              ))}

              <p className={styles.notice}>
                <strong>A guide, not a diagnosis.</strong> This page is general information to
                help you recognise problems early. Always confirm with a vet or animal health
                worker before treating.
              </p>
              <PhotoCreditLine c={c} />
            </article>
          </div>
        </Row>
      </section>

      {related.length > 0 && (
        <section className="s-services">
          <SectionHeader
            pretitle={`More ${species.label.toLowerCase()} conditions`}
            title="Other problems that can look similar or strike the same animals."
          />
          <Row>
            <div className={styles.cards}>
              {related.map((r) => (
                <ConditionCardView key={r.id} c={r} />
              ))}
            </div>
          </Row>
        </section>
      )}

    </Layout>
  )
}
