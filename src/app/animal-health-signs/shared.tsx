// Pieces shared by the hub, animal and condition pages of /animal-health-signs.
// Section markup copies the homepage (src/app/page.tsx) so the theme styles apply.

import Link from 'next/link'
import type { ReactNode } from 'react'
import { URGENCY, type ConditionCard } from '@/lib/animal-health-client'
import styles from './signs.module.css'


/**
 * Turns the site header (and page background) white, the same override the
 * What's New pages use (src/app/articles). Render once on a light page.
 */
export function LightTheme() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
        body, #page, .s-pagewrap, .s-content, main,
        .s-header, .s-header__inner, .s-header__nav, .s-header__menu-links, .s-header__social, .dropdown-menu {
            background-color: #ffffff !important;
            color: #111111 !important;
        }
        .s-header__menu-links a, .s-header__social .email { color: #111111 !important; }
        .s-header__menu-links li.current > a { color: #014d4b !important; }
        .s-header__social svg path { fill: #111111 !important; }
        .s-header__menu-toggle span, .s-header__menu-toggle span::before, .s-header__menu-toggle span::after { background-color: #111111 !important; }
        .s-header__menu-links > .dropdown > .dropdown-menu { background-color: #ffffff !important; }
        .s-header__menu-links > .dropdown > .dropdown-menu a { color: #111111 !important; }
        .s-header__menu-links > .dropdown > .dropdown-menu a:hover { color: #014d4b !important; }
      `,
      }}
    />
  )
}

/** Page hero in the homepage's intro style — dark by default, white with `light`. */
export function PageHero({ children, aside, light = false }: { children: ReactNode; aside?: ReactNode; light?: boolean }) {
  return (
    <section className={`${styles.hero} ${light ? styles.heroLight : ''}`}>
      <div className="row">
        <div className="column lg-12">
          <div className={`${styles.heroGrid} ${aside ? '' : styles.heroSingle}`}>
            <div>{children}</div>
            {aside}
          </div>
        </div>
      </div>
    </section>
  )
}

/** The homepage's two-column section header. */
export function SectionHeader({ pretitle, title, desc, dark = false }: { pretitle: string; title: ReactNode; desc?: ReactNode; dark?: boolean }) {
  return (
    <div className={`row section-header${dark ? ' light-on-dark' : ''}`}>
      <h3 className="column lg-12 section-header__pretitle text-pretitle" style={dark ? { color: '#5ecfcd' } : undefined}>
        {pretitle}
      </h3>
      <div className="column lg-6 stack-on-1100 section-header__primary">
        <h2 className="title text-display-1">{title}</h2>
      </div>
      {desc && (
        <div className="column lg-6 stack-on-1100 section-header__secondary">
          <p className="desc">{desc}</p>
        </div>
      )}
    </div>
  )
}

/** Wraps a block in the theme's grid so it lines up with section headers. */
export function Row({ children }: { children: ReactNode }) {
  return (
    <div className="row">
      <div className="column lg-12">{children}</div>
    </div>
  )
}

export function ConditionImage({ c, eager = false }: { c: Pick<ConditionCard, 'photo' | 'image' | 'name' | 'look' | 'credit'>; eager?: boolean }) {
  if (c.photo === 'pending') {
    return (
      <div className={styles.pending}>
        <span className={styles.pendingTitle}>Photo coming soon</span>
        <span>Look for: {c.look}</span>
      </div>
    )
  }
  return (
    <>
      <img src={c.image} alt={`${c.name}: ${c.look}`} loading={eager ? 'eager' : 'lazy'} width={960} height={720} />
    </>
  )
}

/** Full credit with links, shown under the photo on a condition page. */
export function PhotoCreditLine({ c }: { c: Pick<ConditionCard, 'credit'> }) {
  const cr = c.credit
  if (!cr) return null
  return (
    <p className={styles.creditLine}>
      Photo: <a href={cr.source} target="_blank" rel="noopener noreferrer">{cr.author}</a>, via Wikimedia Commons,{' '}
      {cr.licenseUrl ? (
        <a href={cr.licenseUrl} target="_blank" rel="noopener noreferrer license">{cr.license}</a>
      ) : (
        cr.license
      )}
      . Resized and cropped. <Link href="/animal-health-signs/photo-credits">All photo credits</Link>
    </p>
  )
}

export function UrgencyLabels({ c, dark = false }: { c: Pick<ConditionCard, 'urgency' | 'report'>; dark?: boolean }) {
  return (
    <div className={`${styles.labels} ${dark ? styles.onDark : ''}`}>
      <span className={`${styles.urgency} ${styles[`u_${c.urgency}`]}`} title={URGENCY[c.urgency].hint}>
        {URGENCY[c.urgency].label}
      </span>
      {c.report && (
        <span className={styles.report} title="Notifiable disease — report to the County Veterinary Officer">
          Must report
        </span>
      )}
    </div>
  )
}

export function ConditionCardView({ c }: { c: ConditionCard }) {
  return (
    <Link href={c.href} className={styles.card}>
      <div className={styles.cardMedia}>
        <ConditionImage c={c} />
      </div>
      <div className={styles.cardBody}>
        <UrgencyLabels c={c} />
        <h3 className={styles.cardTitle}>{c.name}</h3>
        <p className={styles.cardText}>{c.urgency === 'normal' ? c.look : c.headline}</p>
        <span className={styles.cardMore}>{c.urgency === 'normal' ? 'Health check guide' : 'Read the full guide'}</span>
      </div>
    </Link>
  )
}
