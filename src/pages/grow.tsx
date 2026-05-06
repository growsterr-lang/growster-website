import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'

const SUPABASE_URL = 'https://agrctbhbmusxtjstfvst.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFncmN0YmhibXVzeHRqc3RmdnN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NTcwODgsImV4cCI6MjA4OTMzMzA4OH0.4hXxsswtPE7PUnKNBWEOpiDRT8T2kMO0HaPUQ8fn2pQ'

const BUDGETS = ['Under ₹5L', '₹5L – ₹10L', '₹10L – ₹20L', '₹20L – ₹50L', '₹50L+']
const SERVICES = ['Brand Films & Content', 'Performance Marketing', 'Social Media Management', 'Full mandate — all three']
const LOGOS = [
  { name:'Snitch', img:'/growster-website/Snitch Logo.png', color:'#ff0080' },
  { name:'Zouk', img:'/growster-website/Zouk Logo.png', color:'#f59e0b' },
  { name:'RWDY', img:'/growster-website/RWDY logo.png', color:'#0050ff' },
  { name:'Virgio', img:'/growster-website/Virgio Thumbnail.png', color:'#8b5cf6' },
  { name:'Skyhigh', img:'', color:'#10b981' },
  { name:'Ugees', img:'', color:'#f59e0b' },
  { name:'Kalamandir', img:'', color:'#06b6d4' },
]
const LOGO_COLORS: Record<string,string> = { Snitch:'#ff0080', Virgio:'#8b5cf6', RWDY:'#0050ff', Skyhigh:'#10b981', Ugees:'#f59e0b', Kalamandir:'#06b6d4' }

export default function GrowPage() {
  const [form, setForm] = useState({ name:'', brand:'', phone:'', budget:'', service:'' })
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [lightPos, setLightPos] = useState({ x:50, y:50 })
  const formRef = useRef<HTMLDivElement>(null)

  const f = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    onResize()
    window.addEventListener('resize', onResize)
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    const onMove = (e: MouseEvent) => setLightPos({ x:(e.clientX/window.innerWidth)*100, y:(e.clientY/window.innerHeight)*100 })
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior:'smooth', block:'center' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.phone || !form.budget) return
    setStatus('loading')
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method:'POST',
        headers:{ 'Content-Type':'application/json', apikey:SUPABASE_ANON, Authorization:`Bearer ${SUPABASE_ANON}`, Prefer:'return=minimal' },
        body: JSON.stringify({ name:form.name, brand:form.brand, phone:form.phone, message:`Budget: ${form.budget} | Service: ${form.service}` })
      })
      setStatus('success')
      // Fire Meta Pixel Lead event
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', { content_name: form.service, content_category: form.budget })
      }
    } catch {
      setStatus('error')
    }
  }

  const grad: any = { background:'linear-gradient(135deg,#ff0080,#0050ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }
  const inp: any = { width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'11px 14px', fontSize:14, color:'#fff', fontFamily:'Montserrat,sans-serif', outline:'none' }
  const lbl: any = { fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.1em', display:'block', marginBottom:5 }

  return (
    <>
      <Head>
        <title>Book a Discovery Call — Growster</title>
        <meta name="description" content="Work with India's leading growth marketing partner. Brand films, performance marketing, and social media — results not retainers." />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta property="og:title" content="Break free of the Hamster Wheel — Growster" />
        <meta property="og:description" content="100 Cr+ revenue impacted. 500M+ views on content we've produced." />
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
          .budget-opt{padding:9px 12px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);font-size:12px;color:rgba(255,255,255,.5);font-weight:600;cursor:pointer;text-align:center;transition:all .2s;user-select:none;font-family:'Montserrat',sans-serif}
          .budget-opt:hover{border-color:rgba(255,0,128,.3);background:rgba(255,0,128,.06);color:rgba(255,0,128,.8)}
          .budget-opt.active{border-color:rgba(255,0,128,.5);background:rgba(255,0,128,.12);color:#ff0080}
          @media(max-width:768px){.hero-grid{grid-template-columns:1fr!important}.who-grid{grid-template-columns:1fr!important}.services-grid{grid-template-columns:1fr!important}}
        `}</style>
      </Head>

      {/* Sticky nav */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, height:52, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 2rem', background:scrolled?'rgba(5,5,8,0.95)':'transparent', backdropFilter:scrolled?'blur(20px)':'none', borderBottom:scrolled?'1px solid rgba(255,255,255,0.06)':'none', transition:'all .3s' }}>
        <a href="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:8 }}>
          <img src="/Growster-Favicon.png" alt="Growster" style={{ height:24, width:24, objectFit:'contain' }} />
          <span style={{ fontSize:15, fontWeight:900, letterSpacing:'-0.5px', color:'#fff' }}>Growster<span style={{ color:'#ff0080' }}>.</span></span>
        </a>
        <button className="btn-primary" onClick={scrollToForm} style={{ padding:'8px 20px', fontSize:12 }}>Book a call →</button>
      </nav>

      {/* Ambient light */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, background:`radial-gradient(600px circle at ${lightPos.x}% ${lightPos.y}%, rgba(255,0,128,0.04), transparent 70%)`, transition:'background .1s' }} />

      {/* ── HERO ── */}
      <section style={{ minHeight:'100vh', position:'relative', zIndex:1, display:'flex', alignItems:'center', padding: isMobile?'6rem 1.5rem 3rem':'5rem 0 0' }}>
        <div style={{ position:'absolute', top:'-20%', left:'-10%', width:'70vw', height:'70vw', background:'radial-gradient(circle,rgba(255,0,128,0.1) 0%,transparent 70%)', pointerEvents:'none', animation:'glow 4s ease-in-out infinite' }} />
        <div style={{ position:'absolute', bottom:'-10%', right:'-10%', width:'60vw', height:'60vw', background:'radial-gradient(circle,rgba(0,80,255,0.08) 0%,transparent 70%)', pointerEvents:'none', animation:'glow 5s ease-in-out infinite 1s' }} />

        <div className="hero-grid" style={{ display:'grid', gridTemplateColumns:'1fr 440px', width:'100%', maxWidth:1200, margin:'0 auto', padding:'0 2rem', gap:40, alignItems:'center' }}>

          {/* Left */}
          <div>
            <div className="fu0" style={{ display:'inline-block', padding:'4px 14px', borderRadius:99, fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', background:'rgba(255,0,128,0.1)', color:'#ff0080', border:'1px solid rgba(255,0,128,0.2)', marginBottom:20 }}>
              Growth Marketing Partner
            </div>
            <h1 className="fu1" style={{ fontSize: isMobile?'clamp(32px,8vw,44px)':'clamp(36px,4vw,58px)', fontWeight:900, letterSpacing:'-2.5px', lineHeight:1.05, marginBottom:16 }}>
              We don't run ads.<br/>We <span style={grad}>build brands</span><br/>that earn attention.
            </h1>
            <p className="fu2" style={{ fontSize:15, color:'rgba(255,255,255,0.5)', lineHeight:1.8, maxWidth:480, marginBottom:28 }}>
              The brands you see spending heavily on Meta and YouTube — Snitch, Virgio, RWDY — trusted us with their full marketing mandate. We don't pitch decks. We deliver results. 100 Cr+ impacted last FY.
            </p>

            {/* Trust signals */}
            <div className="fu3" style={{ display:'flex', flexWrap:'wrap', gap:16, marginBottom:32 }}>
              {[['✓','100 Cr+ revenue impacted (last FY)'],['✓','Founder-led team'],['✓','No lock-in contracts']].map(([icon,t]) => (
                <div key={t} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'rgba(255,255,255,0.5)', fontWeight:600 }}>
                  <span style={{ color:'#10b981', fontWeight:700 }}>{icon}</span>{t}
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="fu4" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, maxWidth:420 }}>
              {[['100Cr+','Revenue impacted (last FY)'],['500M+','Content views produced'],['30%','Avg CAC reduction']].map(([v,l]) => (
                <div key={l} className="card-hover" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'12px 14px' }}>
                  <div style={{ fontSize:22, fontWeight:900, ...grad, marginBottom:3 }}>{v}</div>
                  <div style={{ fontSize:9, color:'rgba(255,255,255,0.35)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div ref={formRef} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:24, padding:'2rem', position:'relative', overflow:'hidden' }}>
            {/* Pink top glow */}
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,#ff0080,transparent)' }} />

            {status === 'success' ? (
              <div style={{ textAlign:'center', padding:'2rem 0' }}>
                <div style={{ fontSize:48, marginBottom:16 }}>🐹</div>
                <div style={{ fontSize:22, fontWeight:900, letterSpacing:'-0.5px', marginBottom:8 }}>You're in.</div>
                <div style={{ fontSize:14, color:'rgba(255,255,255,0.5)', lineHeight:1.7 }}>We'll reach out within 24 hours.<br/>Check your WhatsApp.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ padding:'10px 14px', borderRadius:10, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', marginBottom:16 }}>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', lineHeight:1.7, fontStyle:'italic' }}>"Growster is the only agency we've worked with that actually thinks like founders. They've been instrumental in our growth."</div>
                  <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.3)', marginTop:6, textTransform:'uppercase', letterSpacing:'0.08em' }}>— Snitch Team</div>
                </div>
                <div style={{ fontSize:20, fontWeight:900, letterSpacing:'-0.5px', marginBottom:4 }}>Book a discovery call</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginBottom:20, lineHeight:1.6 }}>We're selective. 3–4 new clients per quarter.<br/>If you're serious about growth — let's talk.</div>

                <div style={{ display:'grid', gap:12 }}>
                  <div>
                    <label style={lbl}>Your name *</label>
                    <input style={inp} value={form.name} onChange={e => f('name', e.target.value)} placeholder="Harshit Arora" required />
                  </div>
                  <div>
                    <label style={lbl}>Brand name</label>
                    <input style={inp} value={form.brand} onChange={e => f('brand', e.target.value)} placeholder="Your brand" />
                  </div>
                  <div>
                    <label style={lbl}>Phone number *</label>
                    <input style={inp} type="tel" value={form.phone} onChange={e => f('phone', e.target.value)} placeholder="+91 98765 43210" required />
                  </div>

                  {/* Budget qualifier */}
                  <div style={{ background:'rgba(255,0,128,0.04)', border:'1px solid rgba(255,0,128,0.15)', borderRadius:12, padding:'12px 14px' }}>
                    <label style={{ ...lbl, color:'#ff0080', marginBottom:10 }}>Monthly ad spend *</label>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6 }}>
                      {BUDGETS.map(b => (
                        <button type="button" key={b} className={`budget-opt${form.budget===b?' active':''}`} onClick={() => f('budget', b)}>{b}</button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={lbl}>What do you need most?</label>
                    <select style={{ ...inp, appearance:'none' }} value={form.service} onChange={e => f('service', e.target.value)}>
                      <option value="">Select a service</option>
                      {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn-primary" disabled={status==='loading'} style={{ width:'100%', marginTop:16, fontSize:14, padding:'13px', borderRadius:12 }}>
                  {status==='loading' ? 'Submitting...' : 'Book my discovery call →'}
                </button>
                <div style={{ fontSize:10, color:'rgba(255,255,255,0.2)', textAlign:'center', marginTop:10, lineHeight:1.7 }}>
                  We respond within 24 hrs. No agency pitch, no fluff.<br/>Just an honest conversation about what's possible.
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── LOGO MARQUEE ── */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', borderBottom:'1px solid rgba(255,255,255,0.06)', background:'rgba(255,255,255,0.02)', padding:'16px 0', overflow:'hidden', position:'relative', zIndex:1 }}>
        <div style={{ display:'flex', gap:0, animation:'marquee 20s linear infinite', width:'200%' }}>
          {[...LOGOS,...LOGOS].map((l,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'0 40px', whiteSpace:'nowrap', flexShrink:0 }}>
              <div style={{ width:4, height:4, borderRadius:'50%', background:l.color, opacity:0.6 }} />
              <span style={{ fontSize:14, fontWeight:500, color:'rgba(255,255,255,0.3)', fontFamily:'Montserrat,sans-serif', letterSpacing:'0.18em', textTransform:'uppercase' }}>{l.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── SERVICES ── */}
      <section style={{ maxWidth:1100, margin:'0 auto', padding: isMobile?'4rem 1.5rem':'5rem 2rem', position:'relative', zIndex:1 }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ display:'inline-block', padding:'4px 14px', borderRadius:99, fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', background:'rgba(255,0,128,0.1)', color:'#ff0080', border:'1px solid rgba(255,0,128,0.2)', marginBottom:14 }}>What we do</div>
          <h2 style={{ fontSize:'clamp(26px,4vw,42px)', fontWeight:900, letterSpacing:'-1.5px', marginBottom:10 }}>Three wings. <span style={grad}>One goal.</span></h2>
          <p style={{ fontSize:14, color:'rgba(255,255,255,0.4)', maxWidth:480, margin:'0 auto', lineHeight:1.7 }}>We operate as your internal marketing team — not an agency that disappears after onboarding.</p>
        </div>
        <div className="services-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
          {[
            { icon:'🎬', color:'#ff0080', label:'Growster Production', title:'Brand Films & Content', desc:'Cinematic content people actually watch — and that actually converts. UGC, product shoots, brand films, and motion assets at scale.' },
            { icon:'📈', color:'#0050ff', label:'Growster Growth', title:'Performance Marketing', desc:'Media buying, paid social, and performance campaigns engineered for acquisition. We\'ve driven 50 Cr+ in revenue for our clients.' },
            { icon:'📱', color:'#8b5cf6', label:'Growster Core', title:'Social Media Management', desc:'Own the cultural pulse of your category. Channel management, community building, and organic growth that compounds.' },
          ].map(s => (
            <div key={s.title} className="card-hover" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderTop:`2px solid ${s.color}`, borderRadius:'0 0 16px 16px', padding:'1.5rem' }}>
              <div style={{ fontSize:24, marginBottom:12 }}>{s.icon}</div>
              <div style={{ fontSize:9, fontWeight:700, color:s.color, textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:6 }}>{s.label}</div>
              <div style={{ fontSize:14, fontWeight:800, color:'#fff', marginBottom:8 }}>{s.title}</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)', lineHeight:1.7 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHO WE WORK WITH ── */}
      <section style={{ background:'rgba(255,255,255,0.02)', borderTop:'1px solid rgba(255,255,255,0.06)', borderBottom:'1px solid rgba(255,255,255,0.06)', padding: isMobile?'4rem 1.5rem':'5rem 2rem', position:'relative', zIndex:1 }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <div style={{ display:'inline-block', padding:'4px 14px', borderRadius:99, fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', background:'rgba(16,185,129,0.1)', color:'#34d399', border:'1px solid rgba(16,185,129,0.2)', marginBottom:14 }}>Who we work with</div>
          <h2 style={{ fontSize:'clamp(24px,4vw,38px)', fontWeight:900, letterSpacing:'-1.5px', marginBottom:32 }}>We're the right fit <span style={grad}>if...</span></h2>
          <div className="who-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {[
              { c:'#10b981', bg:'rgba(16,185,129,0.05)', border:'rgba(16,185,129,0.15)', t:'You have a real budget', d:'We work with brands spending Rs.5L+ monthly on ads. Not the cheapest option out there — the most effective one.' },
              { c:'#10b981', bg:'rgba(16,185,129,0.05)', border:'rgba(16,185,129,0.15)', t:'You want a true partner', d:'You need someone as invested in your numbers as you are — not a vendor who disappears after onboarding.' },
              { c:'#fca5a5', bg:'rgba(220,38,38,0.05)', border:'rgba(220,38,38,0.15)', t:'Not a fit if...', d:'You\'re looking for the cheapest option or a team that just executes without thinking.' },
              { c:'#fca5a5', bg:'rgba(220,38,38,0.05)', border:'rgba(220,38,38,0.15)', t:'Not a fit if...', d:'You need 3-month onboarding timelines. We move fast and expect the same from our clients.' },
            ].map((i,idx) => (
              <div key={idx} style={{ padding:'1.25rem', borderRadius:16, background:i.bg, border:`1px solid ${i.border}` }}>
                <div style={{ fontSize:13, fontWeight:800, color:i.c, marginBottom:6 }}>{i.t}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', lineHeight:1.7 }}>{i.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CASE STUDIES ── */}
      <section style={{ maxWidth:1100, margin:'0 auto', padding: isMobile?'4rem 1.5rem':'5rem 2rem', position:'relative', zIndex:1 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:32, flexWrap:'wrap', gap:12 }}>
          <div>
            <div style={{ display:'inline-block', padding:'4px 14px', borderRadius:99, fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', background:'rgba(0,80,255,0.1)', color:'#60a5fa', border:'1px solid rgba(0,80,255,0.2)', marginBottom:12 }}>Case Studies</div>
            <h2 style={{ fontSize:'clamp(24px,4vw,38px)', fontWeight:900, letterSpacing:'-1.5px' }}>Work that speaks<br/><span style={grad}>louder than any pitch.</span></h2>
          </div>
          <a href="/portfolio" data-hover style={{ padding:'10px 22px', borderRadius:99, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.6)', fontSize:13, fontWeight:700, textDecoration:'none', whiteSpace:'nowrap', transition:'all .2s', display:'inline-block' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,0,128,0.4)'; e.currentTarget.style.color='#ff0080' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.12)'; e.currentTarget.style.color='rgba(255,255,255,0.6)' }}>
            View full portfolio →
          </a>
        </div>
        <div style={{ display:'grid', gridTemplateColumns: isMobile?'1fr':'repeat(4,1fr)', gap:14 }}>
          {[
            { name:'Snitch', color:'#ff0080', tag:'Performance', img:'/growster-website/Snitch Thumbnail.png', logo:'/growster-website/Snitch Logo.png', stat:'#1 Lowest CPI', stat2:'100 ads/mo' },
            { name:'Zouk', color:'#f59e0b', tag:'Vertical Assets', img:'/growster-website/Zouk Thumbnail.png', logo:'/growster-website/Zouk Logo.png', stat:'2x Revenue', stat2:'ROAS growth' },
            { name:'RWDY', color:'#0050ff', tag:'Full Mandate', img:'/growster-website/RWDY Thumbnail.png', logo:'/growster-website/RWDY logo.png', stat:'5x Growth', stat2:'2 years' },
            { name:'Virgio', color:'#8b5cf6', tag:'Brand Films', img:'/growster-website/Virgio Thumbnail.png', logo:'/growster-website/Virgio Thumbnail.png', stat:'30% ↓ CAC', stat2:'60% brand lift' },
          ].map(c => (
            <a key={c.name} href="/portfolio" data-hover style={{ textDecoration:'none', display:'block', borderRadius:20, overflow:'hidden', border:`1px solid rgba(255,255,255,0.07)`, background:'rgba(255,255,255,0.02)', transition:'all .35s cubic-bezier(.16,1,.3,1)' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.borderColor=`${c.color}40`; e.currentTarget.style.boxShadow=`0 20px 50px ${c.color}18` }}
              onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow='' }}>
              <div style={{ position:'relative', paddingBottom:'110%', overflow:'hidden' }}>
                <img src={c.img} alt={c.name} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center', display:'block', transition:'transform .5s cubic-bezier(.16,1,.3,1)' }}
                  onMouseEnter={e => e.currentTarget.style.transform='scale(1.06)'}
                  onMouseLeave={e => e.currentTarget.style.transform=''} />
                <div style={{ position:'absolute', inset:0, background:`linear-gradient(0deg, rgba(5,5,8,0.95) 0%, rgba(5,5,8,0.3) 55%, transparent 100%)` }} />
                <div style={{ position:'absolute', top:10, left:10 }}>
                  <span style={{ fontSize:8, padding:'2px 8px', borderRadius:99, background:`${c.color}20`, color:c.color, fontWeight:700, border:`1px solid ${c.color}30`, textTransform:'uppercase', letterSpacing:'0.08em' }}>{c.tag}</span>
                </div>
                <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'12px 14px' }}>
                  <img src={c.logo} alt={c.name} style={{ height:18, objectFit:'contain', filter:'brightness(0) invert(1)', opacity:.85, marginBottom:6, display:'block' }} />
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                    <div style={{ background:`${c.color}18`, border:`1px solid ${c.color}25`, borderRadius:8, padding:'5px 8px' }}>
                      <div style={{ fontSize:11, fontWeight:900, color:c.color }}>{c.stat}</div>
                      <div style={{ fontSize:8, color:'rgba(255,255,255,0.4)', fontWeight:600 }}>{c.stat2}</div>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── BRAND FILMS ── */}
      <section style={{ background:'rgba(255,255,255,0.015)', borderTop:'1px solid rgba(255,255,255,0.06)', borderBottom:'1px solid rgba(255,255,255,0.06)', padding: isMobile?'4rem 1.5rem':'5rem 2rem', position:'relative', zIndex:1 }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:36, flexWrap:'wrap', gap:12 }}>
            <div>
              <div style={{ display:'inline-block', padding:'4px 14px', borderRadius:99, fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', background:'rgba(0,80,255,0.1)', color:'#60a5fa', border:'1px solid rgba(0,80,255,0.2)', marginBottom:14 }}>Brand Films</div>
              <h2 style={{ fontSize:'clamp(24px,4vw,40px)', fontWeight:900, letterSpacing:'-1.5px', marginBottom:8 }}>Content people <span style={grad}>actually watch.</span></h2>
              <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)', maxWidth:440, lineHeight:1.7 }}>A quick look at the standard we hold ourselves to — presence, polish, and clarity. This is what we bring to every client.</p>
            </div>
            <a href="/portfolio" data-hover style={{ padding:'10px 22px', borderRadius:99, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.6)', fontSize:13, fontWeight:700, textDecoration:'none', whiteSpace:'nowrap', transition:'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,0,128,0.4)'; e.currentTarget.style.color='#ff0080' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.12)'; e.currentTarget.style.color='rgba(255,255,255,0.6)' }}>
              See all our work →
            </a>
          </div>
          <div style={{ display:'grid', gridTemplateColumns: isMobile?'1fr':'1fr 1fr', gap:20 }}>
            {[
              { id:'eZdbXBqgqn4', title:'We Are MORE Than That', client:'Growster × Brand Film' },
              { id:'rxr6q2wLbx8', title:'The Devil Wears Virgio', client:'Virgio × Brand Film' },
            ].map(v => (
              <div key={v.id} style={{ borderRadius:18, overflow:'hidden', background:'#000', boxShadow:'0 20px 60px rgba(0,0,0,0.5)', border:'1px solid rgba(255,255,255,0.08)', transition:'transform .3s cubic-bezier(.16,1,.3,1)' }}
                onMouseEnter={e => e.currentTarget.style.transform='translateY(-6px)'}
                onMouseLeave={e => e.currentTarget.style.transform=''}>
                <div style={{ position:'relative', paddingBottom:'56.25%' }}>
                  <iframe src={`https://www.youtube.com/embed/${v.id}?autoplay=1&mute=1&loop=1&playlist=${v.id}&controls=0&modestbranding=1&playsinline=1&rel=0`}
                    title={v.title} allow="autoplay; encrypted-media" allowFullScreen
                    style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', border:'none' }} />
                </div>
                <div style={{ padding:'12px 16px', background:'rgba(0,0,0,0.85)' }}>
                  <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:4 }}>{v.client}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:'#fff' }}>{v.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: isMobile?'4rem 1.5rem':'6rem 2rem', textAlign:'center', position:'relative', zIndex:1, overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'80vw', height:'80vw', maxWidth:700, background:`radial-gradient(circle at ${lightPos.x}% ${lightPos.y}%, rgba(255,0,128,0.08), transparent 70%)`, pointerEvents:'none', transition:'background .1s' }} />
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.25)', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:16 }}>3–4 clients per quarter</div>
          <h2 style={{ fontSize:'clamp(28px,5vw,56px)', fontWeight:900, letterSpacing:'-2px', lineHeight:1.1, marginBottom:14 }}>
            Ready to break free<br/>of the <span style={grad}>hamster wheel?</span>
          </h2>
          <p style={{ fontSize:14, color:'rgba(255,255,255,0.4)', maxWidth:420, margin:'0 auto 32px', lineHeight:1.8 }}>
            30 minutes. We'll tell you exactly what's broken in your current marketing and what it would take to fix it. No pitch deck. No BS.
          </p>
          <button className="btn-primary" onClick={scrollToForm} style={{ fontSize:15, padding:'14px 36px' }}>
            Book my discovery call →
          </button>
          <div style={{ marginTop:20, fontSize:11, color:'rgba(255,255,255,0.2)' }}>harshit@growster.in · growster.in</div>
        </div>
      </section>

      <div style={{ textAlign:'center', padding:'1.5rem', borderTop:'1px solid rgba(255,255,255,0.05)', fontSize:11, color:'rgba(255,255,255,0.2)', position:'relative', zIndex:1 }}>
        © {new Date().getFullYear()} Growster. All rights reserved.
      </div>
    </>
  )
}
