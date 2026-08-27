import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const SB_URL = 'https://agrctbhbmusxtjstfvst.supabase.co'
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFncmN0YmhibXVzeHRqc3RmdnN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NTcwODgsImV4cCI6MjA4OTMzMzA4OH0.4hXxsswtPE7PUnKNBWEOpiDRT8T2kMO0HaPUQ8fn2pQ'

type Brand = { id: string; name: string; slug: string; category: string; color: string }
type Ref = {
  id: number; brand_id: string; ref_no: number; product: string | null; link: string
  script: string | null; bucket: string; approval_status: string; client_comment: string | null
  edited: boolean; edit_note: string | null
  language: string | null; translation: string | null; batch: number | null
}

const LANG_COLORS: Record<string, string> = {
  Hindi: '#ff0080',
  Telugu: '#0050ff',
  Kannada: '#10b981',
  English: '#8b5cf6',
  'Non-Script': 'rgba(255,255,255,0.3)',
  'N/A': 'rgba(255,255,255,0.2)',
}

export default function BrandDeck() {
  const router = useRouter()
  const { slug } = router.query
  const [brand, setBrand] = useState<Brand | null>(null)
  const [refs, setRefs] = useState<Ref[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [prod, setProd] = useState('all')
  const [batch, setBatch] = useState('all')
  const [lang, setLang] = useState('all')
  const [view, setView] = useState<'card' | 'list'>('card')
  const [idx, setIdx] = useState(0)
  const [saving, setSaving] = useState<Record<number, boolean>>({})
  const [fb, setFb] = useState<Record<number, string>>({})
  const [timers, setTimers] = useState<Record<number, any>>({})
  const [exp, setExp] = useState<Record<number, boolean>>({})
  const [expTrans, setExpTrans] = useState<Record<number, boolean>>({})

  useEffect(() => { if (slug) load(slug as string) }, [slug])

  async function load(s: string) {
    const br = await fetch(`${SB_URL}/rest/v1/preproduction_brands?slug=eq.${s}&select=*`, {
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }
    })
    const bd = await br.json()
    if (!bd || bd.length === 0) { setNotFound(true); setLoading(false); return }
    const b = bd[0]
    setBrand(b)
    const rr = await fetch(`${SB_URL}/rest/v1/brand_refs?brand_id=eq.${b.id}&select=*&order=batch,product,ref_no`, {
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }
    })
    const rd = await rr.json()
    setRefs(rd)
    const f: Record<number, string> = {}
    rd.forEach((x: Ref) => { if (x.client_comment) f[x.id] = x.client_comment })
    setFb(f)
    setLoading(false)
  }

  const products = Array.from(new Set(refs.map(r => r.product).filter(Boolean))) as string[]
  const batches = Array.from(new Set(refs.map(r => r.batch || 1))).sort()
  const languages = Array.from(new Set(refs.map(r => r.language).filter(Boolean))) as string[]

  const filtered = refs.filter(r => {
    if (prod !== 'all' && r.product !== prod) return false
    if (batch !== 'all' && String(r.batch || 1) !== batch) return false
    if (lang !== 'all' && r.language !== lang) return false
    return true
  })
  useEffect(() => { setIdx(0) }, [prod, batch, lang])

  async function setApproval(id: number, status: string) {
    const cur = refs.find(r => r.id === id)?.approval_status
    const next = cur === status ? 'pending' : status
    setSaving(p => ({ ...p, [id]: true }))
    await fetch(`${SB_URL}/rest/v1/brand_refs?id=eq.${id}`, {
      method: 'PATCH',
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ approval_status: next, reviewed_at: new Date().toISOString() })
    })
    setRefs(p => p.map(r => r.id === id ? { ...r, approval_status: next } : r))
    setSaving(p => ({ ...p, [id]: false }))
    if (view === 'card' && (next === 'approved' || next === 'rejected')) {
      setTimeout(() => { setIdx(i => Math.min(filtered.length - 1, i + 1)) }, 500)
    }
  }

  function onFb(id: number, val: string) {
    setFb(p => ({ ...p, [id]: val }))
    if (timers[id]) clearTimeout(timers[id])
    const t = setTimeout(async () => {
      await fetch(`${SB_URL}/rest/v1/brand_refs?id=eq.${id}`, {
        method: 'PATCH',
        headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ client_comment: val })
      })
      setRefs(p => p.map(r => r.id === id ? { ...r, client_comment: val } : r))
    }, 800)
    setTimers(p => ({ ...p, [id]: t }))
  }

  const approved = refs.filter(r => r.approval_status === 'approved').length
  const rejected = refs.filter(r => r.approval_status === 'rejected').length
  const pending = refs.length - approved - rejected
  const pct = refs.length ? Math.round(((approved + rejected) / refs.length) * 100) : 0
  const isPint = (u: string) => u.includes('pin.it')
  const isReq = (s: string | null) => s && s.includes('SCRIPT REQ')
  const ac = brand?.color || '#ff0080'
  const pill = (active: boolean, c = ac) => ({ padding: '6px 14px', borderRadius: 99, border: `1px solid ${active ? c + '50' : 'rgba(255,255,255,0.1)'}`, background: active ? c + '15' : 'transparent', color: active ? c : 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 700, cursor: 'pointer' as const, fontFamily: 'Montserrat,sans-serif', transition: 'all .2s' })

  function LangBadge({ language }: { language: string | null }) {
    if (!language || language === 'N/A') return null
    const c = LANG_COLORS[language] || '#888'
    return (
      <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: c + '18', border: `1px solid ${c}35`, color: c, whiteSpace: 'nowrap' as const }}>
        {language}
      </span>
    )
  }

  function RefCard({ r }: { r: Ref }) {
    const status = r.approval_status || 'pending'
    const isApp = status === 'approved', isRej = status === 'rejected'
    const req = isReq(r.script)
    return (
      <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${isApp ? 'rgba(16,185,129,0.25)' : isRej ? 'rgba(255,0,128,0.25)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {r.product && <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.25)' }}>{r.product.replace(/_/g, ' ')} · #{r.ref_no}</span>}
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>{r.bucket}</span>
              <LangBadge language={r.language} />
              {r.batch && r.batch > 1 && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', color: '#8b5cf6' }}>Batch {r.batch}</span>}
              {r.edited && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b' }}>✏ Updated — please re-review</span>}
            </div>
            {isApp && <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981', padding: '4px 10px', borderRadius: 99, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>✓ Approved</span>}
            {isRej && <span style={{ fontSize: 11, fontWeight: 700, color: '#ff0080', padding: '4px 10px', borderRadius: 99, background: 'rgba(255,0,128,0.08)', border: '1px solid rgba(255,0,128,0.2)' }}>✕ Rejected</span>}
          </div>
          <a href={r.link} target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, textDecoration: 'none', fontSize: 12, fontWeight: 700, color: isPint(r.link) ? '#f43f5e' : '#60a5fa', border: '1px solid rgba(255,255,255,0.07)' }}>
            <span>{isPint(r.link) ? '📌' : '▶'}</span>
            {isPint(r.link) ? 'View Pinterest ref' : 'Watch Instagram Reel'}
            <span style={{ marginLeft: 'auto', opacity: 0.35, fontSize: 10 }}>↗</span>
          </a>
        </div>

        <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>
              {req ? '✏️ Script needed' : `📝 Script${r.language && r.language !== 'N/A' && r.language !== 'Non-Script' ? ` (${r.language})` : ''}`}
            </div>
          </div>
          <div style={{ padding: '12px 14px', background: req ? 'rgba(139,92,246,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid ${req ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 10, fontSize: 12, color: req ? '#a78bfa' : 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxHeight: exp[r.id] ? 'none' : '90px', overflow: 'hidden', position: 'relative' }}>
            {req ? 'Script to be written by Growster — visual ref only' : r.script || 'No script for this ref.'}
            {!req && r.script && !exp[r.id] && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 32, background: 'linear-gradient(transparent,rgba(5,5,8,0.95))' }} />}
          </div>
          {!req && r.script && (
            <button onClick={() => setExp(p => ({ ...p, [r.id]: !p[r.id] }))} style={{ background: 'none', border: 'none', fontFamily: 'Montserrat,sans-serif', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.25)', cursor: 'pointer', padding: '6px 0' }}>
              {exp[r.id] ? '▲ Show less' : '▼ Read full script'}
            </button>
          )}
          {r.translation && (
            <div style={{ marginTop: 8 }}>
              <button onClick={() => setExpTrans(p => ({ ...p, [r.id]: !p[r.id] }))}
                style={{ background: 'none', border: 'none', fontFamily: 'Montserrat,sans-serif', fontSize: 11, fontWeight: 700, color: '#60a5fa', cursor: 'pointer', padding: '4px 0', display: 'flex', alignItems: 'center', gap: 4 }}>
                🌐 {expTrans[r.id] ? '▲ Hide' : '▼ Show'} English/Hindi reference translation
              </button>
              {expTrans[r.id] && (
                <div style={{ padding: '10px 12px', background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.15)', borderRadius: 8, fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginTop: 6 }}>
                  {r.translation}
                </div>
              )}
            </div>
          )}
          {r.edit_note && <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, fontSize: 11, color: '#f59e0b' }}>Note from Growster: {r.edit_note}</div>}
        </div>

        <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 10 }}>
          <button onClick={() => setApproval(r.id, 'approved')} disabled={saving[r.id]}
            style={{ flex: 1, padding: '12px', borderRadius: 10, border: `1px solid ${isApp ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.1)'}`, background: isApp ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.03)', color: isApp ? '#10b981' : 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', transition: 'all .2s' }}>
            {saving[r.id] ? '…' : '✓ Approve'}
          </button>
          <button onClick={() => setApproval(r.id, 'rejected')} disabled={saving[r.id]}
            style={{ flex: 1, padding: '12px', borderRadius: 10, border: `1px solid ${isRej ? 'rgba(255,0,128,0.4)' : 'rgba(255,255,255,0.1)'}`, background: isRej ? 'rgba(255,0,128,0.1)' : 'rgba(255,255,255,0.03)', color: isRej ? '#ff0080' : 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', transition: 'all .2s' }}>
            {saving[r.id] ? '…' : '✕ Reject'}
          </button>
        </div>

        <div style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 6 }}>Your comment</div>
          <textarea value={fb[r.id] || ''} onChange={e => onFb(r.id, e.target.value)}
            placeholder="Leave a note, question or feedback... saves automatically" rows={2}
            style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 12px', fontSize: 12, color: '#fff', fontFamily: 'Montserrat,sans-serif', outline: 'none', resize: 'none' as const, lineHeight: 1.6, colorScheme: 'dark' as const }} />
        </div>
      </div>
    )
  }

  if (loading) return (
    <div style={{ background: '#050508', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat,sans-serif', color: 'rgba(255,255,255,0.3)', fontSize: 13, gap: 10 }}>
      <div style={{ width: 18, height: 18, border: '2px solid rgba(255,0,128,0.3)', borderTop: '2px solid #ff0080', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      Loading...
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (notFound) return (
    <div style={{ background: '#050508', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat,sans-serif', textAlign: 'center' as const }}>
      <div><div style={{ fontSize: 48, marginBottom: 12, color: 'rgba(255,255,255,0.1)' }}>404</div><div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>This deck doesn&apos;t exist.</div></div>
    </div>
  )

  return (<>
    <Head>
      <title>{brand?.name} × Growster — Ref Deck</title>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Montserrat',sans-serif;background:#050508;color:#fff;min-height:100vh}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:${ac};border-radius:99px}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </Head>

    <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(5,5,8,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 17, fontWeight: 900, letterSpacing: '-0.5px' }}>Growster<span style={{ color: ac }}>.</span></span>
        <span style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.15)', display: 'block' }} />
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>{brand?.name} · Ref Deck</span>
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        {[{ k: 'approved', v: approved, c: '#10b981' }, { k: 'rejected', v: rejected, c: '#ff0080' }, { k: 'pending', v: pending, c: 'rgba(255,255,255,0.3)' }].map(s => (
          <div key={s.k} style={{ textAlign: 'center' as const }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: s.c, lineHeight: 1 }}>{s.v}</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' as const, letterSpacing: '0.12em', marginTop: 2, fontWeight: 700 }}>{s.k}</div>
          </div>
        ))}
      </div>
    </nav>

    <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: ac, letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: 6 }}>Reference & Script Approval</div>
      <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-1px', marginBottom: 4 }}>{brand?.name} — Ref Deck</h1>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>Review each reference and let us know what you think. Your feedback saves automatically.</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg,${ac},#0050ff)`, borderRadius: 99, transition: 'width .5s' }} />
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' as const }}>{pct}% reviewed</span>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
          <button onClick={() => setProd('all')} style={pill(prod === 'all')}>All products</button>
          {products.map(p => (<button key={p} onClick={() => setProd(p)} style={pill(prod === p)}>{p.replace(/_/g, ' ')}</button>))}
          {batches.length > 1 && <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />}
          {batches.length > 1 && (
            <>
              <button onClick={() => setBatch('all')} style={pill(batch === 'all')}>All batches</button>
              {batches.map(b => (<button key={b} onClick={() => setBatch(String(b))} style={pill(batch === String(b))}>Batch {b}</button>))}
            </>
          )}
          {languages.length > 1 && <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />}
          {languages.length > 1 && (
            <>
              <button onClick={() => setLang('all')} style={pill(lang === 'all')}>All languages</button>
              {languages.map(l => (<button key={l} onClick={() => setLang(l)} style={pill(lang === l, LANG_COLORS[l] || ac)}>{l}</button>))}
            </>
          )}
        </div>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 99, padding: 3, border: '1px solid rgba(255,255,255,0.08)' }}>
          {[{ v: 'card', l: '🃏 One by one' }, { v: 'list', l: '☰ List' }].map(({ v, l }) => (
            <button key={v} onClick={() => setView(v as any)}
              style={{ padding: '5px 14px', borderRadius: 99, border: 'none', background: view === v ? 'rgba(255,255,255,0.1)' : 'transparent', color: view === v ? '#fff' : 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', transition: 'all .2s' }}>
              {l}
            </button>
          ))}
        </div>
      </div>
    </div>

    {view === 'card' ? (
      <div style={{ maxWidth: 580, margin: '24px auto', padding: '0 24px 80px' }}>
        {filtered.length === 0 ? <div style={{ textAlign: 'center' as const, padding: '60px', color: 'rgba(255,255,255,0.2)' }}>No refs here.</div> : (<>
          <RefCard r={filtered[idx]} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}
              style={{ padding: '9px 20px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: idx === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 700, cursor: idx === 0 ? 'default' : 'pointer', fontFamily: 'Montserrat,sans-serif' }}>
              ← Prev
            </button>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.2)' }}>{idx + 1} of {filtered.length}</span>
            <button onClick={() => setIdx(i => Math.min(filtered.length - 1, i + 1))} disabled={idx === filtered.length - 1}
              style={{ padding: '9px 20px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: idx === filtered.length - 1 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 700, cursor: idx === filtered.length - 1 ? 'default' : 'pointer', fontFamily: 'Montserrat,sans-serif' }}>
              Next →
            </button>
          </div>
        </>)}
      </div>
    ) : (
      <div style={{ padding: '16px 24px 80px' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontWeight: 600, marginBottom: 12 }}>{filtered.length} refs</div>
        <div style={{ display: 'grid', gap: 8 }}>
          {filtered.map(r => {
            const status = r.approval_status || 'pending'
            const isApp = status === 'approved', isRej = status === 'rejected'
            return (
              <div key={r.id} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${isApp ? 'rgba(16,185,129,0.2)' : isRej ? 'rgba(255,0,128,0.2)' : 'rgba(255,255,255,0.07)'}`, borderLeft: `3px solid ${isApp ? '#10b981' : isRej ? '#ff0080' : 'rgba(255,255,255,0.06)'}`, borderRadius: 12, padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' as const, marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.25)' }}>{r.product?.replace(/_/g, ' ') || 'Ref'} #{r.ref_no}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>{r.bucket}</span>
                  <LangBadge language={r.language} />
                  {r.batch && r.batch > 1 && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', color: '#8b5cf6' }}>Batch {r.batch}</span>}
                  {r.edited && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#f59e0b' }}>✏ Updated</span>}
                  <a href={r.link} target="_blank" rel="noreferrer" style={{ fontSize: 11, fontWeight: 700, color: '#60a5fa', textDecoration: 'none' }}>▶ {r.link.includes('pin.it') ? 'Pinterest' : 'Reel'} ↗</a>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                    <button onClick={() => setApproval(r.id, 'approved')} style={{ padding: '6px 14px', borderRadius: 99, border: `1px solid ${isApp ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.1)'}`, background: isApp ? 'rgba(16,185,129,0.1)' : 'transparent', color: isApp ? '#10b981' : 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat,sans-serif' }}>✓</button>
                    <button onClick={() => setApproval(r.id, 'rejected')} style={{ padding: '6px 14px', borderRadius: 99, border: `1px solid ${isRej ? 'rgba(255,0,128,0.35)' : 'rgba(255,255,255,0.1)'}`, background: isRej ? 'rgba(255,0,128,0.08)' : 'transparent', color: isRej ? '#ff0080' : 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat,sans-serif' }}>✕</button>
                  </div>
                </div>
                <textarea value={fb[r.id] || ''} onChange={e => onFb(r.id, e.target.value)}
                  placeholder="Comment..." rows={1}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '8px 10px', fontSize: 11, color: '#fff', fontFamily: 'Montserrat,sans-serif', outline: 'none', resize: 'none' as const, lineHeight: 1.5, colorScheme: 'dark' as const }} />
              </div>
            )
          })}
        </div>
      </div>
    )}

    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(5,5,8,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '11px 24px', display: 'flex', gap: 20, alignItems: 'center' }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981' }}>✓ {approved} approved</span>
      <span style={{ fontSize: 12, fontWeight: 700, color: '#ff0080' }}>✕ {rejected} rejected</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.25)' }}>{pending} pending</span>
      <span style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,0.15)' }}>Saves automatically</span>
    </div>
  </>)
}
