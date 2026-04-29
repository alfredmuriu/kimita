'use client'

import { useMemo, useState, useEffect } from 'react'
import styles from '@/styles/formulate.module.css'
import { ANIMAL_GROUPS, PROFILES, profilesByAnimal, getProfile } from '@/lib/formulate/profiles'
import { INGREDIENTS } from '@/lib/formulate/ingredients'
import { BIOGAR_DEFAULT_PURPOSE, BIOGAR_RUMINANT_DEFAULT } from '@/lib/formulate/biogar'
import { exportPdf, exportExcel } from '@/lib/formulate/exports'

const STEPS = [
  '1. Animal',
  '2. Stage',
  '3. Ingredients',
  '4. Formulate',
]

const CATEGORY_LABELS = {
  energy: 'Energy sources',
  protein: 'Protein sources',
  mineral: 'Minerals',
  fat: 'Fats',
  amino: 'Amino acids',
  ruminant: 'Ruminant-only',
  premix: 'Premixes',
  additive: 'Additives',
}

const HISTORY_KEY = 'agrikima_formula_history_v1'
const PRICES_KEY  = 'agrikima_formula_prices_v1'

export default function FormulatePage() {
  const [animal, setAnimal]           = useState('poultry')
  const [profileId, setProfileId]     = useState('broiler-starter')
  const [selected, setSelected]       = useState(() => defaultIngredients('broiler-starter'))
  const [purpose, setPurpose]         = useState(BIOGAR_DEFAULT_PURPOSE)
  const [batchKg, setBatchKg]         = useState(100)
  const [running, setRunning]         = useState(false)
  const [result, setResult]           = useState(null)
  const [error, setError]             = useState(null)
  const [progress, setProgress]       = useState(0)
  const [history, setHistory]         = useState([])
  const [prices, setPrices]           = useState({})    // { ingredientId: kshPerKg }

  const advanceTo = (n) => setProgress((p) => Math.max(p, n))

  const profile = useMemo(() => getProfile(profileId), [profileId])

  // Adjust defaults when profile switches (ruminants default to 'additive')
  useEffect(() => {
    if (profile?.isRuminantAdult) setPurpose(BIOGAR_RUMINANT_DEFAULT)
    else setPurpose(BIOGAR_DEFAULT_PURPOSE)
  }, [profileId]) // eslint-disable-line react-hooks/exhaustive-deps

  // When animal changes, jump profile to first of that animal + reset picks
  useEffect(() => {
    const list = profilesByAnimal(animal)
    if (list.length && !list.find((p) => p.id === profileId)) {
      setProfileId(list[0].id)
      setSelected(defaultIngredients(list[0].id))
      setResult(null); setError(null)
    }
  }, [animal]) // eslint-disable-line react-hooks/exhaustive-deps

  // Load history once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY)
      if (raw) setHistory(JSON.parse(raw).slice(0, 10))
    } catch {}
  }, [])

  // Load saved prices once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PRICES_KEY)
      if (raw) setPrices(JSON.parse(raw) || {})
    } catch {}
  }, [])

  // Persist prices on every change
  useEffect(() => {
    try { localStorage.setItem(PRICES_KEY, JSON.stringify(prices)) } catch {}
  }, [prices])

  function setPrice(id, value) {
    setPrices((p) => {
      const next = { ...p }
      const n = parseFloat(value)
      if (Number.isFinite(n) && n > 0) next[id] = n
      else delete next[id]
      return next
    })
  }

  // ── Compact grid state ──
  const [catFilter, setCatFilter]     = useState('all')      // 'all' | category id

  const visibleIngredients = useMemo(() => {
    return INGREDIENTS.filter((ing) => {
      if (ing.ruminantOnly && !(profile?.animal === 'dairy' || profile?.animal === 'beef' || profile?.animal === 'smallrum')) return false
      if (catFilter !== 'all' && ing.category !== catFilter) return false
      return true
    })
  }, [catFilter, profile])

  const availableCategories = useMemo(() => {
    const cats = new Set()
    for (const ing of INGREDIENTS) {
      if (ing.ruminantOnly && !(profile?.animal === 'dairy' || profile?.animal === 'beef' || profile?.animal === 'smallrum')) continue
      cats.add(ing.category)
    }
    return Array.from(cats)
  }, [profile])

  function toggleIngredient(id) {
    advanceTo(3)
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id])
  }

  async function formulate() {
    setRunning(true); setError(null); setResult(null)
    try {
      const res = await fetch('/api/formulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId,
          ingredientIds: selected,
          biogarPurpose: purpose,
          batchSizeKg: Number(batchKg) || 100,
          prices,
        }),
      })
      const data = await res.json()
      if (!data.ok) {
        setError({ message: data.message, hint: data.hint })
      } else {
        setResult(data)
        saveHistory({
          profileId, profileName: data.profile.name,
          selected, purpose, batchKg: data.batchSizeKg,
          when: new Date().toISOString(),
        })
      }
    } catch (err) {
      setError({ message: 'Something went wrong while building the formula. Please try again.' })
    } finally {
      setRunning(false)
    }
  }

  function saveHistory(entry) {
    try {
      const next = [entry, ...history].slice(0, 10)
      setHistory(next)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
    } catch {}
  }

  function loadFromHistory(entry) {
    const p = getProfile(entry.profileId); if (!p) return
    setAnimal(p.animal)
    setProfileId(entry.profileId)
    setSelected(entry.selected)
    setPurpose(entry.purpose)
    setBatchKg(entry.batchKg || 100)
    setResult(null); setError(null)
  }

  function resetAll() {
    setResult(null); setError(null)
    setAnimal('poultry')
    setProfileId('broiler-starter')
    setSelected(defaultIngredients('broiler-starter'))
    setPurpose(BIOGAR_DEFAULT_PURPOSE)
    setBatchKg(100)
    setProgress(0)
  }

  // ───── Step indicator state ─────
  const stepIndex = result ? 3 : progress

  return (
    <div className={styles.page} translate="no">
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <img src="/logo.png" alt="Agrikima" className={styles.logoImg} />
          </div>
          <a href="/" className={styles.inlineBtn}>Home</a>
        </div>
      </div>

      <div className={styles.container}>
        {/* Step tabs */}
        <div className={styles.stepRow}>
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={
                styles.stepCell + ' ' +
                (i === stepIndex ? styles.stepCellActive : i < stepIndex ? styles.stepCellDone : '')
              }
            >
              {s}
            </div>
          ))}
        </div>

        {!result && (
          <>
            {/* Step 1 — Animal type */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Step 1 — Animal Type</h2>
              <p className={styles.sectionSub}>Pick the animal you are making feed for.</p>
              <div className={styles.animalGrid}>
                {ANIMAL_GROUPS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    className={styles.animalBtn + ' ' + (animal === g.id ? styles.animalBtnActive : '')}
                    onClick={() => { setAnimal(g.id); advanceTo(1) }}
                  >
                    <span>{g.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2 — Production stage */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Step 2 — Production Stage</h2>
              <p className={styles.sectionSub}>Choose the age or production stage.</p>
              <label className={styles.label}>Stage</label>
              <select
                className={styles.select}
                value={profileId}
                onChange={(e) => { setProfileId(e.target.value); setSelected(defaultIngredients(e.target.value)); setResult(null); advanceTo(2) }}
              >
                {profilesByAnimal(animal).map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <div style={{ height: 8 }} />
              <label className={styles.label}>Batch size (kg)</label>
              <input
                className={styles.input}
                type="number"
                min="1"
                value={batchKg}
                onChange={(e) => setBatchKg(e.target.value)}
              />
            </div>

            {/* Step 3 — Ingredients (compact grid) */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Step 3 — Available Ingredients</h2>
              <p className={styles.sectionSub}>
                Tick every ingredient you have in stock. The formula will only use what you select.
              </p>

              <div className={styles.gridToolbar}>
                <div className={styles.catChips}>
                  <button
                    type="button"
                    className={styles.catChip + ' ' + (catFilter === 'all' ? styles.catChipActive : '')}
                    onClick={() => setCatFilter('all')}
                  >
                    All
                  </button>
                  {availableCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={styles.catChip + ' ' + (catFilter === cat ? styles.catChipActive : '')}
                      onClick={() => setCatFilter(cat)}
                    >
                      {CATEGORY_LABELS[cat] || cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.gridScroll} suppressHydrationWarning>
                <table className={styles.ingTable} suppressHydrationWarning>
                  <thead>
                    <tr>
                      <th className={styles.thCheck}>✓</th>
                      <th className={styles.thLeft}>Ingredient</th>
                      <th>CP %</th>
                      <th>ME (kcal/kg)</th>
                      <th>Ca %</th>
                      <th>P %</th>
                      <th>Fibre %</th>
                      <th>Lys %</th>
                      <th>Met %</th>
                      <th>Moist %</th>
                      <th>Max %</th>
                      <th>Price (KSh/kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleIngredients.length === 0 && (
                      <tr>
                        <td colSpan={12} className={styles.gridEmpty}>
                          No ingredients match your filter.
                        </td>
                      </tr>
                    )}
                    {visibleIngredients.map((ing) => {
                      const active = selected.includes(ing.id)
                      return (
                        <tr
                          key={ing.id}
                          className={active ? styles.rowSelected : ''}
                          onClick={() => toggleIngredient(ing.id)}
                        >
                          <td className={styles.tdCheck} onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={active}
                              onChange={() => toggleIngredient(ing.id)}
                            />
                          </td>
                          <td className={styles.tdLeft}>
                            <span className={styles.catTag}>{ing.category}</span>
                            {ing.name}
                            {ing.note && (
                              <span className={styles.ingNote}> · {ing.note}</span>
                            )}
                          </td>
                          <td>{ing.cp}</td>
                          <td>{ing.me}</td>
                          <td>{ing.ca}</td>
                          <td>{ing.p}</td>
                          <td>{ing.fibre}</td>
                          <td>{ing.lysine}</td>
                          <td>{ing.methionine}</td>
                          <td>{ing.moisture}</td>
                          <td>{ing.maxInclusion}</td>
                          <td onClick={(e) => e.stopPropagation()}>
                            <input
                              className={styles.cellInput}
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="—"
                              value={prices[ing.id] ?? ''}
                              onChange={(e) => setPrice(ing.id, e.target.value)}
                              data-gramm="false"
                              data-gramm_editor="false"
                              data-enable-grammarly="false"
                              autoComplete="off"
                              spellCheck={false}
                            />
                          </td>
                        </tr>
                      )
                    })}

                  </tbody>
                </table>
              </div>

              <div className={styles.gridFooter}>
                <div>
                  Showing {visibleIngredients.length} of {INGREDIENTS.length} ingredients
                </div>
              </div>
            </div>

            {/* Step 4 — Formulate */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Step 4 — Run the Formula</h2>
              <p className={styles.sectionSub}>
                Click the button below to build the least-cost balanced formula from your selected ingredients.
              </p>
              {error && (
                <div className={styles.banner + ' ' + styles.bannerError} style={{ marginBottom: 14 }}>
                  <div><strong>{error.message}</strong></div>
                  {error.hint && <div style={{ marginTop: 4 }}>{error.hint}</div>}
                </div>
              )}
              <button
                type="button"
                className={styles.primaryBtn}
                style={{ width: 'auto', minWidth: 180 }}
                disabled={running || selected.length === 0}
                onClick={formulate}
              >
                {running ? 'Building formula…' : 'Run Formula'}
              </button>
            </div>

          </>
        )}

        {result && <Results data={result} onBack={resetAll} />}
      </div>

      <div className={styles.footer}>
        agrikima.co.ke &nbsp;·&nbsp; Info@agrikima.co.ke &nbsp;·&nbsp; +254 20 208 9181 &nbsp;·&nbsp; Making Growth Happen
      </div>
    </div>
  )
}

function Results({ data, onBack }) {
  const totalKg = data.rows.reduce((s, r) => s + r.qtyKg, 0)
  const totalPct = data.rows.reduce((s, r) => s + r.percent, 0)
  const mainRows = data.rows.filter((r) => !isAdditive(r))
  const addRows  = data.rows.filter((r) =>  isAdditive(r))

  function handlePdf() {
    exportPdf({
      profileName: data.profile.name,
      batchSizeKg: data.batchSizeKg,
      biogarLabel: data.biogar.label,
      biogarGrams: data.biogar.grams_per_tonne,
      rows: data.rows,
      nutrients: data.nutrients,
      createdAt: new Date(),
    })
  }
  function handleXlsx() {
    exportExcel({
      profileName: data.profile.name,
      batchSizeKg: data.batchSizeKg,
      biogarLabel: data.biogar.label,
      biogarGrams: data.biogar.grams_per_tonne,
      rows: data.rows,
      nutrients: data.nutrients,
      createdAt: new Date(),
    })
  }

  return (
    <>
      <div className={styles.resultHeader}>
        <div className={styles.resultTitle}>{data.profile.name}</div>
        <div className={styles.resultMeta}>
          Batch size: {data.batchSizeKg} kg &nbsp;·&nbsp;
          Bio-Gar: {data.biogar.label} ({data.biogar.grams_per_tonne} g/t)
        </div>
        {data.cost?.hasPrices && (
          <div className={styles.costStrip}>
            <div className={styles.costItem}>
              <div className={styles.costLabel}>Cost / kg</div>
              <div className={styles.costValue}>KSh {data.cost.perKg.toFixed(2)}</div>
            </div>
            <div className={styles.costItem}>
              <div className={styles.costLabel}>Batch ({data.batchSizeKg} kg)</div>
              <div className={styles.costValue}>KSh {data.cost.perBatch.toFixed(2)}</div>
            </div>
            <div className={styles.costItem}>
              <div className={styles.costLabel}>Cost / tonne</div>
              <div className={styles.costValue}>KSh {data.cost.perTonne.toFixed(0)}</div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.banner + ' ' + styles.bannerSuccess}>
        Formula built successfully. Review the ingredients and nutrient analysis below.
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Formula</h2>
        <table className={styles.table}>
          <thead>
            <tr><th>Ingredient</th><th className={styles.tdNum}>QTY (kg)</th><th className={styles.tdNum}>% in Ration</th></tr>
          </thead>
          <tbody>
            {mainRows.map((r, i) => (
              <tr key={i}>
                <td>{r.ingredient.name}</td>
                <td className={styles.tdNum}>{r.qtyKg.toFixed(2)}</td>
                <td className={styles.tdNum}>{r.percent.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>TOTAL</td>
              <td className={styles.tdNum}>{totalKg.toFixed(2)}</td>
              <td className={styles.tdNum}>{totalPct.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Nutrient Analysis</h2>
        <table className={styles.table}>
          <thead>
            <tr><th>Nutrient</th><th className={styles.tdNum}>Achieved</th><th>Target</th><th>Status</th></tr>
          </thead>
          <tbody>
            {data.nutrients.map((n, i) => (
              <tr key={i}>
                <td>{n.label} <span style={{ color: '#666' }}>({n.unit})</span></td>
                <td className={styles.tdNum}>{n.achieved.toFixed(2)}</td>
                <td>
                  {n.min !== undefined && <>min {n.min}</>}
                  {n.min !== undefined && n.max !== undefined && <> · </>}
                  {n.max !== undefined && <>max {n.max}</>}
                  {n.min === undefined && n.max === undefined && <>—</>}
                </td>
                <td className={n.ok ? styles.tick : styles.warn}>{n.ok ? '✓ OK' : '⚠ Out of range'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {addRows.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Feed Additives</h2>
          <table className={styles.table}>
            <thead>
              <tr><th>Additive</th><th className={styles.tdNum}>QTY (kg)</th><th className={styles.tdNum}>% in Ration</th></tr>
            </thead>
            <tbody>
              {addRows.map((r, i) => (
                <tr key={i} className={r.isBiogar ? styles.rowBiogar : ''}>
                  <td>{r.ingredient.name}</td>
                  <td className={styles.tdNum}>{r.qtyKg.toFixed(3)}</td>
                  <td className={styles.tdNum}>{r.percent.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className={styles.actions}>
        <button type="button" className={styles.primaryBtn} style={{ width: 'auto', minWidth: 180 }} onClick={handlePdf}>
          Download PDF
        </button>
        <button type="button" className={styles.primaryBtn} style={{ width: 'auto', minWidth: 180 }} onClick={handleXlsx}>Download Excel</button>
        <button type="button" className={styles.primaryBtn} style={{ width: 'auto', minWidth: 180 }} onClick={onBack}>Make another formula</button>
      </div>
    </>
  )
}

// ───── helpers ─────
// Stage-specific best-practice starter sets. Each list is what an
// experienced miller would put on the bag for that stage — energy +
// protein + minerals + premix + the right limiting amino acid where
// poultry/pigs need it. The LP can then drop anything that isn't
// cheapest while still hitting targets.
function defaultIngredients(profileId) {
  const p = PROFILES.find((x) => x.id === profileId)
  if (!p) return []

  // ── Poultry ──
  if (p.animal === 'poultry') {
    switch (p.id) {
      case 'chick-crumbs':
      case 'broiler-starter':
        return ['maize', 'soybean-48', 'fish-meal', 'wheat-bran', 'limestone', 'dcp', 'salt', 'premix-broiler', 'dl-methionine', 'l-lysine', 'soybean-oil']
      case 'broiler-finisher':
        return ['maize', 'soybean-44', 'fish-meal', 'wheat-bran', 'limestone', 'dcp', 'salt', 'premix-broiler', 'dl-methionine', 'soybean-oil']
      case 'pullet-grower':
        return ['maize', 'soybean-44', 'wheat-bran', 'sunflower-cake', 'limestone', 'dcp', 'salt', 'premix-general']
      case 'pre-lay':
      case 'layer-mash':
        return ['maize', 'soybean-44', 'sunflower-cake', 'omena', 'wheat-bran', 'limestone', 'dcp', 'salt', 'premix-layer', 'dl-methionine']
      case 'kienyeji-grower':
        return ['maize', 'maize-germ', 'soybean-44', 'wheat-bran', 'sunflower-cake', 'limestone', 'dcp', 'salt', 'premix-general']
      default:
        return ['maize', 'soybean-44', 'wheat-bran', 'limestone', 'dcp', 'salt', 'premix-broiler']
    }
  }

  // ── Dairy Cattle ──
  if (p.animal === 'dairy') {
    switch (p.id) {
      case 'calf-starter':
        return ['maize', 'soybean-44', 'wheat-bran', 'molasses', 'limestone', 'dcp', 'salt', 'premix-dairy']
      case 'heifer-grower':
        return ['maize-germ', 'wheat-bran', 'sunflower-cake', 'molasses', 'limestone', 'dcp', 'salt', 'premix-dairy']
      case 'dairy-high':
        return ['maize', 'maize-germ', 'soybean-44', 'sunflower-cake', 'cottonseed-cake', 'wheat-bran', 'molasses', 'limestone', 'dcp', 'salt', 'premix-dairy']
      case 'dairy-mid':
        return ['maize-germ', 'wheat-bran', 'sunflower-cake', 'cottonseed-cake', 'molasses', 'limestone', 'dcp', 'salt', 'premix-dairy']
      default:
        return ['maize', 'maize-germ', 'wheat-bran', 'soybean-44', 'sunflower-cake', 'limestone', 'dcp', 'salt', 'premix-dairy', 'molasses']
    }
  }

  // ── Beef Cattle ──
  if (p.animal === 'beef') {
    if (p.id === 'beef-finisher') {
      return ['maize', 'maize-germ', 'wheat-bran', 'cottonseed-cake', 'molasses', 'limestone', 'dcp', 'salt', 'urea']
    }
    return ['maize', 'maize-germ', 'wheat-bran', 'soybean-44', 'sunflower-cake', 'molasses', 'limestone', 'dcp', 'salt']
  }

  // ── Pigs ──
  if (p.animal === 'pig') {
    switch (p.id) {
      case 'creep-feed':
      case 'piglet-weaner':
        return ['maize', 'soybean-48', 'fish-meal', 'wheat-pollard', 'limestone', 'dcp', 'salt', 'premix-pig', 'l-lysine', 'soybean-oil']
      case 'pig-grower':
        return ['maize', 'soybean-44', 'wheat-pollard', 'wheat-bran', 'limestone', 'dcp', 'salt', 'premix-pig', 'l-lysine']
      case 'pig-finisher':
        return ['maize', 'maize-germ', 'soybean-44', 'wheat-bran', 'sunflower-cake', 'limestone', 'dcp', 'salt', 'premix-pig']
      default:
        return ['maize', 'soybean-44', 'wheat-pollard', 'fish-meal', 'limestone', 'dcp', 'salt', 'premix-pig']
    }
  }

  // ── Goats & Sheep ──
  if (p.animal === 'smallrum') {
    if (p.id === 'kid-lamb') {
      return ['maize', 'soybean-44', 'wheat-bran', 'lucerne-meal', 'molasses', 'limestone', 'dcp', 'salt']
    }
    if (p.id === 'dairy-goat') {
      return ['maize-germ', 'wheat-bran', 'sunflower-cake', 'cottonseed-cake', 'lucerne-meal', 'molasses', 'limestone', 'dcp', 'salt', 'premix-dairy']
    }
    return ['maize-germ', 'wheat-bran', 'sunflower-cake', 'lucerne-meal', 'molasses', 'limestone', 'dcp', 'salt']
  }

  // ── Rabbits ──
  if (p.animal === 'rabbit') {
    return ['maize', 'wheat-bran', 'soybean-44', 'sunflower-cake', 'lucerne-meal', 'limestone', 'dcp', 'salt']
  }

  // ── Fish ──
  if (p.animal === 'fish') {
    switch (p.id) {
      case 'tilapia-fingerling':
      case 'catfish-grower':
        return ['maize', 'soybean-48', 'fish-meal', 'omena', 'wheat-bran', 'blood-meal', 'limestone', 'dcp', 'salt', 'soybean-oil']
      case 'tilapia-grower':
        return ['maize', 'soybean-48', 'fish-meal', 'omena', 'wheat-bran', 'sunflower-cake', 'limestone', 'dcp', 'salt']
      default:
        return ['maize', 'soybean-48', 'fish-meal', 'omena', 'wheat-bran', 'limestone', 'dcp', 'salt']
    }
  }

  return []
}

function isAdditive(row) {
  if (row.isBiogar) return false
  const c = row.ingredient?.category
  return c === 'additive' || c === 'premix' || c === 'amino'
}

