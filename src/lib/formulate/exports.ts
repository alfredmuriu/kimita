'use client'

import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'

type Row = {
  ingredient: { id: string; name: string }
  qtyKg: number
  percent: number
  isBiogar?: boolean
}
type Nutrient = {
  label: string
  unit: string
  achieved: number
  min?: number
  max?: number
  ok: boolean
}
type ExportData = {
  profileName: string
  batchSizeKg: number
  biogarLabel: string
  biogarGrams: number
  rows: Row[]
  nutrients: Nutrient[]
  createdAt: Date
}

function fmtDate(d: Date) {
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function exportPdf(data: ExportData) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 32
  let y = margin

  // Header
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor('#2D6A4F')
  doc.text('AGRIKIMA', margin, y + 6)
  doc.setTextColor('#1a1a1a')
  doc.setFontSize(12)
  doc.text(data.profileName.toUpperCase(), pageW / 2, y + 6, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(fmtDate(data.createdAt), pageW - margin, y + 6, { align: 'right' })
  y += 22
  doc.setDrawColor('#d0d0d0')
  doc.line(margin, y, pageW - margin, y)
  y += 14

  // Formula table
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('FORMULA', margin, y); y += 12

  const cols = [
    { label: 'Ingredient', w: 300, align: 'left' as const },
    { label: 'QTY (kg)',   w: 120, align: 'right' as const },
    { label: '% in Ration', w: 120, align: 'right' as const },
  ]
  y = drawTableHeader(doc, margin, y, cols)

  let totalKg = 0, totalPct = 0
  for (const r of data.rows) {
    if (y > pageH - 80) { doc.addPage(); y = margin }
    y = drawTableRow(doc, margin, y, cols, [
      r.ingredient.name,
      r.qtyKg.toFixed(2),
      r.percent.toFixed(2),
    ])
    totalKg += r.qtyKg
    totalPct += r.percent
  }
  y = drawTableRow(doc, margin, y, cols, ['TOTAL', totalKg.toFixed(2), totalPct.toFixed(2)], '#f7f7f7', true)
  y += 14

  // Nutrient analysis
  if (y > pageH - 160) { doc.addPage(); y = margin }
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('NUTRIENT ANALYSIS', margin, y); y += 12

  const nCols = [
    { label: 'Nutrient', w: 200, align: 'left'  as const },
    { label: 'Achieved', w: 110, align: 'right' as const },
    { label: 'Target',   w: 160, align: 'left'  as const },
    { label: 'Status',   w: 80,  align: 'left'  as const },
  ]
  y = drawTableHeader(doc, margin, y, nCols)
  for (const n of data.nutrients) {
    if (y > pageH - 80) { doc.addPage(); y = margin }
    const target = [n.min !== undefined ? 'min ' + n.min : '', n.max !== undefined ? 'max ' + n.max : ''].filter(Boolean).join(' · ')
    y = drawTableRow(doc, margin, y, nCols, [
      n.label + ' (' + n.unit + ')',
      n.achieved.toFixed(2),
      target || '—',
      n.ok ? 'OK' : 'OUT',
    ])
  }
  y += 14

  // Footer
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor('#666666')
  doc.text(
    'agrikima.co.ke  |  Info@agrikima.co.ke  |  +254 20 208 9181  |  Making Growth Happen',
    pageW / 2, pageH - 20, { align: 'center' },
  )

  const filename = `Agrikima-${slug(data.profileName)}-${fmtDate(data.createdAt).replace(/ /g, '')}.pdf`
  doc.save(filename)
}

function drawTableHeader(doc: jsPDF, x: number, y: number, cols: { label: string; w: number; align?: 'left' | 'right' }[]) {
  const h = 20
  let cx = x
  doc.setFillColor('#f7f7f7')
  doc.setDrawColor('#d0d0d0')
  const totalW = cols.reduce((s, c) => s + c.w, 0)
  doc.rect(x, y, totalW, h, 'FD')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor('#1a1a1a')
  for (const c of cols) {
    if (c.align === 'right') {
      doc.text(c.label.toUpperCase(), cx + c.w - 6, y + 13, { align: 'right' })
    } else {
      doc.text(c.label.toUpperCase(), cx + 6, y + 13)
    }
    cx += c.w
  }
  return y + h
}
function drawTableRow(
  doc: jsPDF, x: number, y: number,
  cols: { label: string; w: number; align: 'left' | 'right' }[],
  cells: string[], bg?: string, bold?: boolean,
) {
  const h = 18
  let cx = x
  const totalW = cols.reduce((s, c) => s + c.w, 0)
  if (bg) {
    doc.setFillColor(bg)
    doc.setDrawColor('#d0d0d0')
    doc.rect(x, y, totalW, h, 'FD')
  } else {
    doc.setDrawColor('#d0d0d0')
    doc.rect(x, y, totalW, h, 'S')
  }
  doc.setFont('helvetica', bold ? 'bold' : 'normal')
  doc.setFontSize(9)
  doc.setTextColor('#1a1a1a')
  for (let i = 0; i < cols.length; i++) {
    const c = cols[i]
    const txt = cells[i] ?? ''
    if (c.align === 'right') {
      doc.text(txt, cx + c.w - 6, y + 12, { align: 'right' })
    } else {
      doc.text(txt, cx + 6, y + 12)
    }
    cx += c.w
  }
  return y + h
}
function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function exportExcel(data: ExportData) {
  const wb = XLSX.utils.book_new()

  // ── Sheet 1: Formula ─────────────────────────────────────────────
  const formulaRows: (string | number)[][] = [
    ['AGRIKIMA — Feed Formulation'],
    [data.profileName],
    [`Date: ${fmtDate(data.createdAt)}`],
    [`Batch size: ${data.batchSizeKg} kg`],
    [`Bio-Gar: ${data.biogarLabel} (${data.biogarGrams} g/tonne)`],
    [],
    ['Ingredient', 'QTY (kg)', '% in Ration'],
    ...data.rows.map((r) => [
      r.ingredient.name,
      Number(r.qtyKg.toFixed(3)),
      Number(r.percent.toFixed(3)),
    ]),
    ['TOTAL',
      Number(data.rows.reduce((s, r) => s + r.qtyKg, 0).toFixed(3)),
      Number(data.rows.reduce((s, r) => s + r.percent, 0).toFixed(3)),
    ],
  ]
  const formulaSheet = XLSX.utils.aoa_to_sheet(formulaRows)
  formulaSheet['!cols'] = [{ wch: 36 }, { wch: 14 }, { wch: 14 }]
  formulaSheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }, // title row
    { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } }, // profile name row
  ]
  XLSX.utils.book_append_sheet(wb, formulaSheet, 'Formula')

  // ── Sheet 2: Nutrients ───────────────────────────────────────────
  const nutrientRows: (string | number)[][] = [
    ['AGRIKIMA — Nutrient Analysis'],
    [data.profileName],
    [`Date: ${fmtDate(data.createdAt)}`],
    [],
    ['Nutrient', 'Unit', 'Achieved', 'Min', 'Max', 'Status'],
    ...data.nutrients.map((n) => [
      n.label,
      n.unit,
      Number(n.achieved.toFixed(3)),
      n.min ?? '',
      n.max ?? '',
      n.ok ? 'OK' : 'OUT',
    ]),
  ]
  const nutrientSheet = XLSX.utils.aoa_to_sheet(nutrientRows)
  nutrientSheet['!cols'] = [{ wch: 22 }, { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 10 }]
  nutrientSheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } },
  ]
  XLSX.utils.book_append_sheet(wb, nutrientSheet, 'Nutrients')

  const filename = `Agrikima-${slug(data.profileName)}-${fmtDate(data.createdAt).replace(/ /g, '')}.xlsx`
  XLSX.writeFile(wb, filename)
}
