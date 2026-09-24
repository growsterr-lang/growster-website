import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'

const SUPABASE_URL = 'https://agrctbhbmusxtjstfvst.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFncmN0YmhibXVzeHRqc3RmdnN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NTcwODgsImV4cCI6MjA4OTMzMzA4OH0.4hXxsswtPE7PUnKNBWEOpiDRT8T2kMO0HaPUQ8fn2pQ'

const VOLUME_TIERS = ['30 – 50 videos', '50 – 100 videos', '100 – 150 videos', '150 – 200 videos']

const LOGOS = [
  { name: 'Snitch', color: '#ff0080' },
  { name: 'Zouk', color: '#f59e0b' },
  { name: 'RWDY', color: '#0050ff' },
  { name: 'Virgio', color: '#8b5cf6' },
  { name: 'Skyhigh', color: '#10b981' },
  { name: 'Ugees', color: '#f59e0b' },
  { name: 'Kalamandir', color: '#06b6d4' },
]

export default function CreativeVolumePage() {
  const [form, setForm] = useState({ name: '', brand: '', phone: '', volume: '', spend: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 })
  const formRef = useRef<HTMLDivElement>(null)

  const f = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }))
  const [utmData, setUtmData] = useState<Record<string, string>>({})

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const utm: Record<string, string> = {}
    ;['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((key) => {
      if (params.get(key)) utm[key] = params.get(key)!
    })
    setUtmData(utm)
  }, [])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    onResize()
    window.addEventListener('resize', onResize)
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    const onMove = (e: MouseEvent) => setLightPos({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 })
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.phone || !form.volume) return
    setStatus('loading')
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}`, Prefer: 'return=minimal' },
        body: JSON.stringify({
          name: form.name,
          brand: form.brand,
          phone: form.phone,
          message: [
            'Source: Predictable Creative Volume',
            form.volume && `Volume needed: ${form.volume}`,
            form.spend && `Monthly ad spend: ${form.spend}`,
          ]
            .filter(Boolean)
            .join(' | '),
          utm_data: Object.keys(utmData).length ? utmData : null,
        }),
      })
      setStatus('success')
      if (typeof window !== 'undefined' && (window as any).fbq) {
        ;(window as any).fbq('track', 'Lead', { content_name: 'Predictable Creative Volume', content_category: form.volume })
      }
    } catch {
      setStatus('error')
    }
  }

  const grad: any = { background: 'linear-gradient(135deg,#ff0080,#0050ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }
  const inp: any = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '11px 14px', fontSize: 14, color: '#fff', fontFamily: 'Montserrat,sans-serif', outline: 'none' }
  const lbl: any = { fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 5 }

  return (
    <>
      <Head>
        <title>Predictable Creative Volume | Growster</title>
        <meta name="description" content="D2C brands don't have a marketing problem — they have an ad sourcing problem. Growster delivers 30 to 200 ready-to-run creatives a month, on a predictable schedule." />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta property="og:title" content="Predictable Creative Volume — Growster" />
        <meta property="og:description" content="30–200 high-performing UGC & brand videos a month. Rs.15,000 per video. No creative bottlenecks." />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <style>{`
          *{box-sizing:border-box;margin:0;padding:0}
          html{scroll-behavior:smooth}
          body{font-family:'Montserrat',sans-serif;background:#050508;color:#fff;overflow-x:hidden}
          ::-webkit-scrollbar{width:2px}
          ::-webkit-scrollbar-thumb{background:linear-gradient(#ff0080,#0050ff)}
          input,select,textarea{color:#fff!important}
          input::placeholder{color:rgba(255,255,255,0.2)!important}
          input:focus,select:focus{border-color:rgba(255,0,128,0.5)!important;outline:none}
          @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
          @keyframes glow{0%,100%{opacity:.5}50%{opacity:1}}
          @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
          .fu0{animation:fadeUp .6s cubic-bezier(.16,1,.3,1) both}
          .fu1{animation:fadeUp .6s cubic-bezier(.16,1,.3,1) .1s both}
          .fu2{animation:fadeUp .6s cubic-bezier(.16,1,.3,1) .2s both}
          .fu3{animation:fadeUp .6s cubic-bezier(.16,1,.3,1) .3s both}
          .fu4{animation:fadeUp .6s cubic-bezier(.16,1,.3,1) .4s both}
          .btn-primary{padding:13px 28px;border-radius:99px;border:none;background:linear-gradient(135deg,#ff0080,#cc0055);color:#fff;font-size:14px;font-weight:700;cursor:pointer;font-family:'Montserrat',sans-serif;box-shadow:0 0 28px rgba(255,0,128,.25);transition:all .25s cubic-bezier(.16,1,.3,1)}
          .btn-primary:hover{transform:translateY(-2px);box-shadow:0 0 44px rgba(255,0,128,.4)}
          .card-hover{transition:all .25s ease}
          .card-hover:hover{transform:translateY(-4px);border-color:rgba(255,255,255,.14)!important}
          .vol-opt{padding:9px 12px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);font-size:12px;color:rgba(255,255,255,.5);font-weight:600;cursor:pointer;text-align:center;transition:all .2s;user-select:none;font-family:'Montserrat',sans-serif}
          .vol-opt:hover{border-color:rgba(255,0,128,.3);background:rgba(255,0,128,.06);color:rgba(255,0,128,.8)}
          .vol-opt.active{border-color:rgba(255,0,128,.5);background:rgba(255,0,128,.12);color:#ff0080}
          @media(max-width:768px){.hero-grid{grid-template-columns:1fr!important}.problem-grid{grid-template-columns:1fr!important}.pricing-grid{grid-template-columns:1fr!important}.samples-grid{grid-template-columns:1fr!important}}
        `}</style>
      </Head>

      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', background: scrolled ? 'rgba(5,5,8,0.95)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none', transition: 'all .3s' }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/Growster-Favicon.png" alt="Growster" style={{ height: 24, width: 24, objectFit: 'contain' }} />
          <span style={{ fontSize: 15, fontWeight: 900, letterSpacing: '-0.5px', color: '#fff' }}>Growster<span style={{ color: '#ff0080' }}>.</span></span>
        </a>
        <button className="btn-primary" onClick={scrollToForm} style={{ padding: '8px 20px', fontSize: 12 }}>Get my volume plan →</button>
      </nav>

      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, background: `radial-gradient(600px circle at ${lightPos.x}% ${lightPos.y}%, rgba(255,0,128,0.04), transparent 70%)`, transition: 'background .1s' }} />

      {/* HERO */}
      <section style={{ minHeight: '100vh', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', padding: isMobile ? '6rem 1.5rem 3rem' : '5rem 0 0' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '70vw', height: '70vw', background: 'radial-gradient(circle,rgba(255,0,128,0.1) 0%,transparent 70%)', pointerEvents: 'none', animation: 'glow 4s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle,rgba(0,80,255,0.08) 0%,transparent 70%)', pointerEvents: 'none', animation: 'glow 5s ease-in-out infinite 1s' }} />

        <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 440px', width: '100%', maxWidth: 1200, margin: '0 auto', padding: '0 2rem', gap: 40, alignItems: 'center' }}>
          <div>
            <div className="fu0" style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 99, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'rgba(255,0,128,0.1)', color: '#ff0080', border: '1px solid rgba(255,0,128,0.2)', marginBottom: 20 }}>
              For D2C Advertisers
            </div>
            <h1 className="fu1" style={{ fontSize: isMobile ? 'clamp(30px,8vw,42px)' : 'clamp(34px,4vw,54px)', fontWeight: 900, letterSpacing: '-2.5px', lineHeight: 1.08, marginBottom: 16 }}>
              You don't have a <span style={grad}>marketing problem.</span><br />You have an <span style={grad}>ad sourcing</span> problem.
            </h1>
            <p className="fu2" style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, maxWidth: 480, marginBottom: 24 }}>
              Every D2C brand scaling on Meta and YouTube hits the same wall — not budget, not targeting. Creative supply. You run out of fresh ads faster than any team can produce them. We built Predictable Creative Volume to fix exactly that.
            </p>

            <div className="fu3" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
              {[['✓', '30 to 200 videos, every month'], ['✓', 'Rs.15,000 per video, flat'], ['✓', 'Built for performance, not just polish']].map(([icon, t]) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>{icon}</span>{t}
                </div>
              ))}
            </div>

            <div className="fu4" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, maxWidth: 420 }}>
              {[['200', 'Max videos/month'], ['30', 'Min order quantity'], ['15K', 'Per video, flat']].map(([v, l]) => (
                <div key={l} className="card-hover" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '12px 14px' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, ...grad, marginBottom: 3 }}>{v}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div ref={formRef} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: '2rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,#ff0080,transparent)' }} />

            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
                <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 8 }}>You're in.</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>We'll reach out within 24 hours with a volume plan tailored to your ad account.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 4 }}>Get your volume plan</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 20, lineHeight: 1.6 }}>Tell us how many creatives you need a month.<br />We'll map it to a delivery schedule and quote.</div>

                <div style={{ display: 'grid', gap: 12 }}>
                  <div>
                    <label style={lbl}>Your name *</label>
                    <input style={inp} value={form.name} onChange={(e) => f('name', e.target.value)} placeholder="Harshit Arora" required />
                  </div>
                  <div>
                    <label style={lbl}>Brand name</label>
                    <input style={inp} value={form.brand} onChange={(e) => f('brand', e.target.value)} placeholder="Your brand" />
                  </div>
                  <div>
                    <label style={lbl}>Phone number *</label>
                    <input style={inp} type="tel" value={form.phone} onChange={(e) => f('phone', e.target.value)} placeholder="+91 98765 43210" required />
                  </div>

                  <div style={{ background: 'rgba(255,0,128,0.04)', border: '1px solid rgba(255,0,128,0.15)', borderRadius: 12, padding: '12px 14px' }}>
                    <label style={{ ...lbl, color: '#ff0080', marginBottom: 10 }}>Videos needed per month *</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                      {VOLUME_TIERS.map((v) => (
                        <button type="button" key={v} className={`vol-opt${form.volume === v ? ' active' : ''}`} onClick={() => f('volume', v)}>{v}</button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={lbl}>Current monthly ad spend</label>
                    <select style={{ ...inp, appearance: 'none' }} value={form.spend} onChange={(e) => f('spend', e.target.value)}>
                      <option value="">Select range</option>
                      <option>Under Rs.10L</option>
                      <option>Rs.10L – Rs.50L</option>
                      <option>Rs.50L – Rs.1Cr</option>
                      <option>Rs.1Cr+</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn-primary" disabled={status === 'loading' || !form.volume} style={{ width: '100%', marginTop: 18, fontSize: 14, padding: '13px', borderRadius: 12 }}>
                  {status === 'loading' ? 'Submitting...' : 'Get my volume plan →'}
                </button>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: 10, lineHeight: 1.7 }}>
                  We respond within 24 hrs. No agency pitch, no fluff.
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* LOGO ROLL */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', padding: '16px 0', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 10 }}>
          We've fixed the ad-sourcing problem for
        </div>
        <div style={{ display: 'flex', gap: 0, animation: 'marquee 20s linear infinite', width: '200%' }}>
          {[...LOGOS, ...LOGOS].map((l, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 40px', whiteSpace: 'nowrap', flexShrink: 0 }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: l.color, opacity: 0.6 }} />
              <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.3)', fontFamily: 'Montserrat,sans-serif', letterSpacing: '0.18em', textTransform: 'uppercase' }}>{l.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PROBLEM */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: isMobile ? '4rem 1.5rem' : '5rem 2rem', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 99, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'rgba(220,38,38,0.1)', color: '#fca5a5', border: '1px solid rgba(220,38,38,0.2)', marginBottom: 14 }}>The real bottleneck</div>
          <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 10 }}>It's never the targeting.<br /><span style={grad}>It's the creative supply.</span></h2>
        </div>
        <div className="problem-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          {[
            { icon: '📉', t: 'Ad fatigue hits fast', d: 'Your best-performing ad dies in 2-3 weeks. Without fresh creative behind it, CPMs climb and ROAS erodes.' },
            { icon: '🐌', t: 'In-house teams can\'t scale', d: 'A 2-person creative team can ship maybe 8-10 videos a month. Your media buyer needs 50+ to keep testing.' },
            { icon: '🎲', t: 'Freelancers are unpredictable', d: 'Quality swings, deadlines slip, and you\'re back to firefighting instead of scaling spend.' },
          ].map((x) => (
            <div key={x.t} className="card-hover" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1.5rem' }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>{x.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{x.t}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>{x.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SAMPLES */}
      <section style={{ background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: isMobile ? '4rem 1.5rem' : '5rem 2rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 99, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'rgba(0,80,255,0.1)', color: '#60a5fa', border: '1px solid rgba(0,80,255,0.2)', marginBottom: 14 }}>Sample output</div>
            <h2 style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 8 }}>Brand films and <span style={grad}>UGC, at volume.</span></h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', maxWidth: 460, margin: '0 auto', lineHeight: 1.7 }}>A sample of the polish and performance-first thinking behind every asset we ship.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20, marginBottom: 20 }}>
            {[
              { id: 'eZdbXBqgqn4', title: 'We Are MORE Than That', client: 'Growster × Brand Film' },
              { id: 'rxr6q2wLbx8', title: 'The Devil Wears Virgio', client: 'Virgio × Brand Film' },
            ].map((v) => (
              <div key={v.id} style={{ borderRadius: 18, overflow: 'hidden', background: '#000', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ position: 'relative', paddingBottom: '56.25%' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}?autoplay=1&mute=1&loop=1&playlist=${v.id}&controls=0&modestbranding=1&playsinline=1&rel=0`}
                    title={v.title}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  />
                </div>
                <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.85)' }}>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>{v.client}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{v.title}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="samples-grid" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4,1fr)', gap: 14 }}>
            {[
              { name: 'Snitch', color: '#ff0080', tag: 'Performance UGC', img: '/growster-website/Snitch Thumbnail.png', logo: '/growster-website/Snitch Logo.png', stat: '100 ads/mo', stat2: 'consistent volume' },
              { name: 'Zouk', color: '#f59e0b', tag: 'Vertical Assets', img: '/growster-website/Zouk Thumbnail.png', logo: '/growster-website/Zouk Logo.png', stat: '2x Revenue', stat2: 'ROAS growth' },
              { name: 'RWDY', color: '#0050ff', tag: 'Full Mandate', img: '/growster-website/RWDY Thumbnail.png', logo: '/growster-website/RWDY logo.png', stat: '5x Growth', stat2: '2 years running' },
              { name: 'Virgio', color: '#8b5cf6', tag: 'Brand + UGC', img: '/growster-website/Virgio Thumbnail.png', logo: '/growster-website/Virgio Thumbnail.png', stat: '30% ↓ CAC', stat2: '60% brand lift' },
            ].map((c) => (
              <div key={c.name} className="card-hover" style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ position: 'relative', paddingBottom: '110%', overflow: 'hidden' }}>
                  <img src={c.img} alt={c.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(5,5,8,0.95) 0%, rgba(5,5,8,0.3) 55%, transparent 100%)' }} />
                  <div style={{ position: 'absolute', top: 10, left: 10 }}>
                    <span style={{ fontSize: 8, padding: '2px 8px', borderRadius: 99, background: `${c.color}20`, color: c.color, fontWeight: 700, border: `1px solid ${c.color}30`, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{c.tag}</span>
                  </div>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 14px' }}>
                    <img src={c.logo} alt={c.name} style={{ height: 18, objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.85, marginBottom: 6, display: 'block' }} />
                    <div style={{ background: `${c.color}18`, border: `1px solid ${c.color}25`, borderRadius: 8, padding: '5px 8px', display: 'inline-block' }}>
                      <div style={{ fontSize: 11, fontWeight: 900, color: c.color }}>{c.stat}</div>
                      <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{c.stat2}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: isMobile ? '4rem 1.5rem' : '5rem 2rem', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 99, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)', marginBottom: 14 }}>Straightforward pricing</div>
          <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 900, letterSpacing: '-1.5px' }}>No decks. No retainers.<br /><span style={grad}>Just a rate card.</span></h2>
        </div>

        <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 20 }}>
          {[
            { v: 'Rs.15,000', l: 'Per video, flat', d: 'No hidden production fees. What you see is what you pay, at any volume tier.' },
            { v: '30 videos', l: 'Minimum order quantity', d: 'The floor that lets us guarantee quality and turnaround — not a upsell tactic.' },
            { v: '200 videos', l: 'Maximum per month', d: 'Our current production ceiling per client, so quality never gets diluted for volume.' },
          ].map((p) => (
            <div key={p.l} className="card-hover" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '1.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: 30, fontWeight: 900, ...grad, marginBottom: 6 }}>{p.v}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{p.l}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>{p.d}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'rgba(255,0,128,0.04)', border: '1px solid rgba(255,0,128,0.15)', borderRadius: 16, padding: '1.25rem 1.5rem', textAlign: 'center' }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
            Example: <strong style={{ color: '#fff' }}>50 videos/month = Rs.7,50,000</strong> — scripted, shot, edited, and delivered ready to upload to Ads Manager.
          </span>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: isMobile ? '4rem 1.5rem' : '6rem 2rem', textAlign: 'center', position: 'relative', zIndex: 1, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '80vw', height: '80vw', maxWidth: 700, background: `radial-gradient(circle at ${lightPos.x}% ${lightPos.y}%, rgba(255,0,128,0.08), transparent 70%)`, pointerEvents: 'none', transition: 'background .1s' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>Limited production slots per month</div>
          <h2 style={{ fontSize: 'clamp(28px,5vw,52px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.1, marginBottom: 14 }}>
            Stop losing ROAS<br />to a <span style={grad}>creative shortage.</span>
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', maxWidth: 420, margin: '0 auto 32px', lineHeight: 1.8 }}>
            Tell us your monthly ad spend and current creative output. We'll tell you exactly how many videos you need to keep scaling — and what it costs.
          </p>
          <button className="btn-primary" onClick={scrollToForm} style={{ fontSize: 15, padding: '14px 36px' }}>
            Get my volume plan →
          </button>
          <div style={{ marginTop: 20, fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>harshit@growster.in · growster.in</div>
        </div>
      </section>

      <div style={{ textAlign: 'center', padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: 11, color: 'rgba(255,255,255,0.2)', position: 'relative', zIndex: 1 }}>
        © {new Date().getFullYear()} Growster. All rights reserved.
      </div>
    </>
  )
}
