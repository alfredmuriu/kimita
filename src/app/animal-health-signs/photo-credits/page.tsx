import { Metadata } from 'next'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { getConditions, getSpecies } from '@/lib/animal-health'
import { LightTheme, PageHero, Row } from '../shared'
import styles from '../signs.module.css'

export const metadata: Metadata = {
  title: 'Photo Credits — Spot the Signs | Agrikima',
  description: 'Who took the photos in the Spot the Signs animal health library, and the licences they are used under.',
}

export default function PhotoCredits() {
  const rows = getConditions().filter((c) => c.credit)
  return (
    <Layout>
      <LightTheme />
      <PageHero light>
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link href="/animal-health-signs">Spot the Signs</Link>
        </nav>
        <h1 className={styles.heroTitle}>Photo credits</h1>
        <p className={styles.heroDesc}>
          Real photos in this library come from Wikimedia Commons and are used under the licence shown for each one.
          They have been resized and cropped to fit. Photos not listed here are illustrations made for Agrikima.
        </p>
      </PageHero>
      <section style={{ padding: '24px 0 72px' }}>
        <Row>
          <div style={{ overflowX: 'auto' }}>
            <table className={styles.creditTable}>
              <thead>
                <tr>
                  <th>Condition</th>
                  <th>Photo by</th>
                  <th>Licence</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={`${c.species}/${c.id}`}>
                    <td>
                      <Link href={c.href}>
                        {getSpecies(c.species)?.label}: {c.name}
                      </Link>
                    </td>
                    <td>
                      <a href={c.credit!.source} target="_blank" rel="noopener noreferrer">
                        {c.credit!.author}
                      </a>
                    </td>
                    <td>
                      {c.credit!.licenseUrl ? (
                        <a href={c.credit!.licenseUrl} target="_blank" rel="noopener noreferrer license">
                          {c.credit!.license}
                        </a>
                      ) : (
                        c.credit!.license
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Row>
      </section>
    </Layout>
  )
}
