import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'fs'

const supabase = createClient(
  'https://qvuccpuwbmeiqfurxhav.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const { data: topics, error } = await supabase
  .from('blog_topics')
  .select('priority, topic, category, used')
  .order('priority', { ascending: true })

if (error) { console.error(error); process.exit(1) }

// Deduplicate by priority (keep first occurrence)
const seen = new Set()
const unique = topics.filter(t => {
  if (seen.has(t.priority)) return false
  seen.add(t.priority)
  return true
})

const posted = unique.filter(t => t.used)
const pending = unique.filter(t => !t.used)

const html = `
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word">
<head><meta charset="utf-8">
<style>
  body { font-family: Calibri, sans-serif; margin: 40px; }
  h1 { font-size: 22px; color: #014d4b; margin-bottom: 4px; }
  h2 { font-size: 16px; color: #333; margin-top: 30px; margin-bottom: 8px; border-bottom: 2px solid #014d4b; padding-bottom: 4px; }
  table { border-collapse: collapse; width: 100%; margin-bottom: 24px; }
  th { background: #014d4b; color: #fff; text-align: left; padding: 8px 12px; font-size: 12px; }
  td { border: 1px solid #ddd; padding: 6px 12px; font-size: 12px; }
  tr:nth-child(even) { background: #f9f9f9; }
  .summary { font-size: 13px; color: #555; margin-bottom: 20px; }
</style>
</head>
<body>
<h1>Agrikima Blog Topics</h1>
<p class="summary">Total: ${unique.length} topics &nbsp;|&nbsp; Posted: ${posted.length} &nbsp;|&nbsp; Pending: ${pending.length}</p>

<h2>Posted Topics (${posted.length})</h2>
<table>
<tr><th>#</th><th>Topic</th><th>Category</th></tr>
${posted.map((t, i) => `<tr><td>${i + 1}</td><td>${t.topic}</td><td>${t.category || '—'}</td></tr>`).join('\n')}
</table>

<h2>Pending Topics (${pending.length})</h2>
<table>
<tr><th>#</th><th>Topic</th><th>Category</th></tr>
${pending.map((t, i) => `<tr><td>${posted.length + i + 1}</td><td>${t.topic}</td><td>${t.category || '—'}</td></tr>`).join('\n')}
</table>

</body></html>`

const outPath = 'Agrikima_Blog_Topics.doc'
writeFileSync(outPath, html)
console.log(`Saved to ${outPath} — open in Microsoft Word`)
