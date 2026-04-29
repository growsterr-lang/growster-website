import Head from 'next/head'
import { useState, useEffect, useRef, useCallback } from 'react'

const CASE_STUDIES = [
  {
    client: 'Snitch', slug: 'snitch', tag: 'Performance Content',
    tagline: '100 Ads a Month.',
    desc: "India's fastest growing fashion brand and highest advertising spender in their category came to us with one problem — creative fatigue at scale. We solved it.",
    metrics: [{ value:'100', label:'Performance ads monthly' }, { value:'#1', label:'Lowest Cost per App Install' }, { value:'0', label:'Creative fatigue incidents' }],
    color: '#ff0080', logo: '/growster-website/Snitch Logo.png', thumbnail: '/growster-website/Snitch Thumbnail.png',
    services: ['Performance Content','UGC Production','Creative Strategy'],
  },
  {
    client: 'Zouk', slug: 'zouk', tag: 'Performance Assets',
    tagline: '2x Revenue. Vertical Performance.',
    desc: 'A high-spending brand that came to us for vertical performance assets that actually convert. We delivered a 2x jump in revenue through precision creative and media strategy.',
    metrics: [{ value:'2x', label:'Jump in revenue' }, { value:'↑', label:'Consistent ROAS improvement' }, { value:'100%', label:'Vertical performance assets' }],
    color: '#f59e0b', logo: '/growster-website/Zouk Logo.png', thumbnail: '/growster-website/Zouk Thumbnail.png',
    services: ['Performance Content','Vertical Assets','Media Buying'],
  },
  {
    client: 'RWDY', slug: 'rwdy', tag: 'Full Digital Mandate',
    tagline: '5x Growth in 2 Years.',
    desc: "Vijay Deverakonda's fashion brand. We handled all digital and revenue mandates — strategy, content, performance, social — and grew the company 5x in 2 years.",
    metrics: [{ value:'5x', label:'Company growth in 2 years' }, { value:'100%', label:'Full digital mandate' }, { value:'∞', label:'Celebrity-backed brand reach' }],
    color: '#0050ff', logo: '/growster-website/RWDY logo.png', thumbnail: '/growster-website/RWDY Thumbnail.png',
    services: ['Full Digital Mandate','Performance Marketing','Social Media'],
  },
  {
    client: 'Virgio', slug: 'virgio', tag: 'Brand Films',
    tagline: 'Brand Films That Perform.',
    desc: 'A global fashion powerhouse led by the ex-CEO of Myntra. We produced brand films and performance assets that moved the needle on brand equity and acquisition cost.',
    metrics: [{ value:'30%', label:'Decrease in CAC' }, { value:'60%', label:'Higher brand lift within D30' }, { value:'0', label:'Frequency fatigue' }],
    color: '#8b5cf6', logo: '/growster-website/Virgio Thumbnail.png', thumbnail: '/growster-website/Virgio Thumbnail.png',
    services: ['Brand Films','Performance Marketing','Creative Production'],
  },
]

const SERVICES = [
  { icon:'🎬', title:'Brand Films', desc:'Cinematic content that builds recall and earns attention in paid and organic environments.' },
  { icon:'📈', title:'Performance Marketing', desc:'Media buying, campaign management, and paid social engineered for acquisition.' },
  { icon:'📱', title:'Social Media', desc:'Community building, channel management, and organic growth that compounds.' },
  { icon:'🎯', title:'Influencer Marketing', desc:'Activations that drive real results — not just reach.' },
  { icon:'🗺️', title:'Go-To-Market', desc:'Roadmaps and startup consultation for brands launching into new territory.' },
  { icon:'🎥', title:'UGC & Content Production', desc:'Performance creatives at scale — built for fatigue-proof advertising.' },
]

export default function Portfolio() {
  const [activeCase, setActiveCase] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [cursorPos, setCursorPos] = useState({ x: -200, y: -200 })
  const [cursorHover, setCursorHover] = useState(false)
  const [wheelAngle, setWheelAngle] = useState(0)
  const [mouseSpeed, setMouseSpeed] = useState(0)
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 })
  const targetCursor = useRef({ x: -200, y: -200 })
  const lastPos = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)
  const angleRef = useRef(0)

  const animateCursor = useCallback(() => {
    setCursorPos(prev => {
      const dx = targetCursor.current.x - prev.x
      const dy = targetCursor.current.y - prev.y
      return { x: prev.x + dx * 0.12, y: prev.y + dy * 0.12 }
    })
    rafRef.current = requestAnimationFrame(animateCursor)
  }, [])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    onResize()
    window.addEventListener('resize', onResize)

    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })

    let lastX = 0, lastY = 0, lastTime = Date.now()
    const onMove = (e: MouseEvent) => {
      targetCursor.current = { x: e.clientX, y: e.clientY }
      // Light position (normalised 0-100)
      setLightPos({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 })
      // Speed for wheel spin
      const now = Date.now()
      const dt = now - lastTime || 1
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY)
      const speed = Math.min(dist / dt * 20, 40)
      setMouseSpeed(speed)
      angleRef.current += speed
      setWheelAngle(angleRef.current)
      lastX = e.clientX; lastY = e.clientY; lastTime = now
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    // Magnetic buttons
    const magnets = document.querySelectorAll('[data-magnet]')
    const handlers: Array<{ el: Element, move: (e: MouseEvent) => void, leave: EventListener }> = []
    magnets.forEach(el => {
      const move = (e: MouseEvent) => {
        const r = el.getBoundingClientRect()
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2
        const dx = e.clientX - cx, dy = e.clientY - cy
        const dist = Math.hypot(dx, dy)
        if (dist < 140) {
          const pull = (1 - dist / 140) * 0.45
          ;(el as HTMLElement).style.transform = `translate(${dx * pull}px, ${dy * pull}px)`
        } else {
          ;(el as HTMLElement).style.transform = ''
        }
      }
      const leave = () => { (el as HTMLElement).style.transform = '' }
      window.addEventListener('mousemove', move, { passive: true })
      el.addEventListener('mouseleave', leave)
      handlers.push({ el, move, leave })
    })

    // Cursor hover detection
    const interactives = document.querySelectorAll('a, button, [data-hover]')
    const enterH = () => setCursorHover(true)
    const leaveH = () => setCursorHover(false)
    interactives.forEach(el => { el.addEventListener('mouseenter', enterH); el.addEventListener('mouseleave', leaveH) })

    rafRef.current = requestAnimationFrame(animateCursor)

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
      handlers.forEach(({ el, move, leave }) => {
        window.removeEventListener('mousemove', move)
        el.removeEventListener('mouseleave', leave)
      })
      interactives.forEach(el => { el.removeEventListener('mouseenter', enterH); el.removeEventListener('mouseleave', leaveH) })
    }
  }, [animateCursor])

  return (
    <>
      <Head>
        <title>Portfolio — Growster</title>
        <meta name="description" content="Case studies and brand films from Growster." />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          html { scroll-behavior: smooth; }
          body { font-family: 'Montserrat', sans-serif; background: #050508; color: #fff; overflow-x: hidden; cursor: none; }
          ::-webkit-scrollbar { width: 2px; }
          ::-webkit-scrollbar-thumb { background: linear-gradient(#ff0080, #0050ff); }
          a, button { cursor: none; }
          .grad { background: linear-gradient(135deg, #ff0080, #0050ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

          /* Hamster cursor */
          .ham-cursor {
            position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999;
            width: 44px; height: 44px; transform-origin: center;
            transition: width 0.2s, height 0.2s;
          }
          .ham-cursor.hover { width: 56px; height: 56px; }
          .ham-wheel {
            width: 100%; height: 100%;
            border-radius: 50%;
            border: 2px solid rgba(255,0,128,0.6);
            display: flex; align-items: center; justify-content: center;
            background: rgba(5,5,8,0.85);
            backdrop-filter: blur(4px);
            box-shadow: 0 0 20px rgba(255,0,128,0.25);
            overflow: hidden;
          }
          .ham-trail {
            position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9998;
            width: 6px; height: 6px; border-radius: 50%;
            background: #ff0080;
          }

          /* Card light effect */
          .light-card {
            position: relative; overflow: hidden;
            transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s;
          }
          .light-card::before {
            content: '';
            position: absolute; inset: 0; pointer-events: none; z-index: 1;
            opacity: 0; transition: opacity 0.3s;
            border-radius: inherit;
          }
          .light-card:hover::before { opacity: 1; }
          .light-card:hover { transform: translateY(-6px) scale(1.01); box-shadow: 0 32px 80px rgba(0,0,0,0.4); }

          .pill { display: inline-block; padding: 4px 14px; border-radius: 99px; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
          .mag-btn { transition: all 0.3s cubic-bezier(0.16,1,0.3,1); display: inline-flex; align-items: center; }

          @keyframes fadeUp { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
          @keyframes hamsterBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
          @keyframes glow { 0%,100%{opacity:0.5} 50%{opacity:1} }

          .fade-up-0 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0s both; }
          .fade-up-1 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
          .fade-up-2 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
          .fade-up-3 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
          .fade-up-4 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s both; }

          @media (max-width: 768px) {
            body { cursor: auto; }
            .ham-cursor, .ham-trail { display: none; }
            a, button { cursor: pointer; }
          }
        `}</style>
      </Head>

      {/* Hamster cursor */}
      {!isMobile && (
        <>
          <div className={`ham-cursor${cursorHover?' hover':''}`}
            style={{ transform:`translate(${cursorPos.x - 22}px, ${cursorPos.y - 22}px)` }}>
            <div className="ham-wheel" style={{ transform:`rotate(${wheelAngle}deg)` }}>
              <img src="/Growster-Favicon.png" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} />
            </div>
          </div>
          <div className="ham-trail"
            style={{ transform:`translate(${targetCursor.current.x - 3}px, ${targetCursor.current.y - 3}px)`, transition:'transform 0.05s', background:'#ff0080', opacity:0.5 }} />
        </>
      )}

      {/* Nav */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:50, padding:'0 2rem', height:56, display:'flex', alignItems:'center', justifyContent:'space-between', background:scrolled?'rgba(5,5,8,0.95)':'transparent', backdropFilter:scrolled?'blur(20px)':'none', borderBottom:scrolled?'1px solid rgba(255,255,255,0.07)':'none', transition:'all 0.3s' }}>
        <a href="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:8 }}>
          <img src="/Growster-Favicon.png" alt="Growster" style={{ height:26, width:26, objectFit:'contain' }} />
          <span style={{ fontSize:15, fontWeight:900, color:'#fff', letterSpacing:'-0.5px' }}>Growster<span style={{ color:'#ff0080' }}>.</span></span>
        </a>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <a href="/" style={{ fontSize:12, color:'rgba(255,255,255,0.5)', textDecoration:'none', fontWeight:600 }}>← Back</a>
          <a href="mailto:harshit@growster.in" data-magnet
            style={{ padding:'8px 18px', borderRadius:99, border:'none', background:'linear-gradient(135deg,#ff0080,#cc0055)', color:'#fff', fontSize:12, fontWeight:700, textDecoration:'none', boxShadow:'0 0 20px rgba(255,0,128,0.25)', transition:'all 0.3s cubic-bezier(0.16,1,0.3,1)' }}>
            Get in touch →
          </a>
        </div>
      </nav>

      {/* Ambient light that follows mouse */}
      <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, pointerEvents:'none', zIndex:0,
        background:`radial-gradient(600px circle at ${lightPos.x}% ${lightPos.y}%, rgba(255,0,128,0.04) 0%, transparent 70%)`,
        transition:'background 0.1s' }} />

      {/* Hero */}
      <div style={{ minHeight:'90vh', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', padding:'8rem 2rem 4rem', zIndex:1 }}>
        <div style={{ position:'absolute', top:'-20%', left:'-10%', width:'60vw', height:'60vw', background:'radial-gradient(circle, rgba(255,0,128,0.12) 0%, transparent 70%)', pointerEvents:'none', animation:'glow 4s ease-in-out infinite' }} />
        <div style={{ position:'absolute', bottom:'-20%', right:'-10%', width:'50vw', height:'50vw', background:'radial-gradient(circle, rgba(0,80,255,0.1) 0%, transparent 70%)', pointerEvents:'none', animation:'glow 5s ease-in-out infinite 1s' }} />
        <div style={{ maxWidth:900, width:'100%', textAlign:'center', position:'relative', zIndex:1 }}>
          <div className="pill fade-up-0" style={{ background:'rgba(255,0,128,0.1)', color:'#ff0080', border:'1px solid rgba(255,0,128,0.2)', marginBottom:24 }}>Our Work</div>
          <h1 className="fade-up-1" style={{ fontSize:'clamp(36px,6vw,88px)', fontWeight:900, lineHeight:1.05, letterSpacing:'-3px', marginBottom:24 }}>
            We build brands<br /><span className="grad">that earn attention.</span>
          </h1>
          <p className="fade-up-2" style={{ fontSize:'clamp(15px,2vw,18px)', color:'rgba(255,255,255,0.45)', lineHeight:1.8, maxWidth:560, margin:'0 auto 40px' }}>
            50 Cr+ in revenue generated. 10M+ views. Work that speaks louder than any pitch.
          </p>
          <div className="fade-up-3" style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <a href="#work" data-magnet data-hover
              style={{ padding:'12px 28px', borderRadius:99, border:'none', background:'linear-gradient(135deg,#ff0080,#cc0055)', color:'#fff', fontSize:14, fontWeight:700, textDecoration:'none', boxShadow:'0 0 32px rgba(255,0,128,0.3)', transition:'all 0.3s cubic-bezier(0.16,1,0.3,1)' }}>
              See our work ↓
            </a>
            <a href="https://instagram.com/growster.in" target="_blank" rel="noreferrer" data-magnet data-hover
              style={{ padding:'12px 28px', borderRadius:99, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.7)', fontSize:14, fontWeight:700, textDecoration:'none', transition:'all 0.3s cubic-bezier(0.16,1,0.3,1)' }}>
              @growster.in ↗
            </a>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', borderBottom:'1px solid rgba(255,255,255,0.06)', background:'rgba(255,255,255,0.02)', padding:'2.5rem 2rem', position:'relative', zIndex:1 }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))', gap:24 }}>
          {[
            { value:'50Cr+', label:'Revenue generated' },
            { value:'10M+', label:'Influencer views' },
            { value:'5x', label:'RWDY growth in 2 years' },
            { value:'30%', label:'Avg CAC reduction' },
            { value:'60%', label:'Brand lift D30' },
          ].map((s, i) => (
            <div key={s.label} className={`fade-up-${i}`} style={{ textAlign:'center' }}>
              <div style={{ fontSize:'clamp(22px,3vw,36px)', fontWeight:900, background:'linear-gradient(135deg,#ff0080,#0050ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:6 }}>{s.value}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Studies */}
      <div id="work" style={{ maxWidth:1200, margin:'0 auto', padding:'6rem 2rem', position:'relative', zIndex:1 }}>
        <div style={{ marginBottom:48 }} className="fade-up-1">
          <div className="pill" style={{ background:'rgba(255,0,128,0.1)', color:'#ff0080', border:'1px solid rgba(255,0,128,0.2)', marginBottom:16 }}>Case Studies</div>
          <h2 style={{ fontSize:'clamp(28px,4vw,56px)', fontWeight:900, letterSpacing:'-2px' }}>The work.</h2>
        </div>

        {/* Folder stack */}
        <div style={{ position:'relative', minHeight: isMobile ? 'auto' : 520 }}>
          {/* Stacked closed folders */}
          {activeCase === null && (
            <div style={{ position: isMobile ? 'relative' : 'relative', display:'flex', flexDirection:'column', gap: isMobile ? 16 : 0 }}>
              {CASE_STUDIES.map((c, ci) => {
                const offset = ci * (isMobile ? 0 : 18)
                return (
                  <div key={c.slug} data-hover
                    onClick={() => setActiveCase(c.slug)}
                    style={{
                      position: isMobile ? 'relative' : 'absolute',
                      top: isMobile ? 'auto' : offset,
                      left: isMobile ? 'auto' : offset * 0.5,
                      right: isMobile ? 'auto' : 0,
                      zIndex: CASE_STUDIES.length - ci,
                      width: isMobile ? '100%' : `calc(100% - ${offset * 0.5}px)`,
                      borderRadius: 24,
                      background: `rgba(12,12,20,0.95)`,
                      border: `1px solid ${c.color}30`,
                      backdropFilter: 'blur(20px)',
                      cursor: 'none',
                      transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                      boxShadow: `0 ${8 + ci * 4}px ${32 + ci * 8}px rgba(0,0,0,0.4), 0 0 0 1px ${c.color}15`,
                      overflow: 'hidden',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = `translateY(-8px) translateX(-${ci*2}px)`
                      e.currentTarget.style.boxShadow = `0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px ${c.color}40, 0 0 40px ${c.color}15`
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = ''
                      e.currentTarget.style.boxShadow = `0 ${8 + ci * 4}px ${32 + ci * 8}px rgba(0,0,0,0.4), 0 0 0 1px ${c.color}15`
                    }}>

                    {/* Folder tab */}
                    <div style={{ height: 6, background: `linear-gradient(90deg, ${c.color}, ${c.color}80)`, width: '40%', borderRadius: '0 0 8px 0' }} />

                    <div style={{ display:'flex', alignItems:'center', gap:20, padding: isMobile ? '1.25rem' : '1.5rem 2rem' }}>
                      {/* Logo peek */}
                      <div style={{ width: isMobile ? 56 : 72, height: isMobile ? 56 : 72, borderRadius:16, background:`${c.color}12`, border:`1px solid ${c.color}25`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, overflow:'hidden' }}>
                        <img src={c.logo} alt={c.client} style={{ width:'80%', height:'80%', objectFit:'contain', filter:'brightness(0) invert(1)', opacity:0.9 }} />
                      </div>

                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:6, flexWrap:'wrap' }}>
                          <span className="pill" style={{ background:`${c.color}18`, color:c.color, border:`1px solid ${c.color}30` }}>{c.tag}</span>
                        </div>
                        <div style={{ fontSize: isMobile ? 18 : 22, fontWeight:900, letterSpacing:'-0.5px', color:'#fff', marginBottom:4 }}>{c.client}</div>
                        <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:500 }}>{c.tagline}</div>
                      </div>

                      {/* Metrics preview */}
                      {!isMobile && (
                        <div style={{ display:'flex', gap:20, flexShrink:0 }}>
                          {c.metrics.slice(0,2).map(m => (
                            <div key={m.label} style={{ textAlign:'right' }}>
                              <div style={{ fontSize:22, fontWeight:900, color:c.color }}>{m.value}</div>
                              <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', fontWeight:600, maxWidth:100 }}>{m.label}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div style={{ fontSize:18, color:`${c.color}`, flexShrink:0, marginLeft:8 }}>→</div>
                    </div>

                    {/* Light shimmer */}
                    <div style={{ position:'absolute', inset:0, pointerEvents:'none', background:`radial-gradient(400px circle at ${lightPos.x}% ${lightPos.y}%, ${c.color}06 0%, transparent 70%)`, transition:'background 0.15s' }} />
                  </div>
                )
              })}
              {/* Spacer for stacked positioning */}
              {!isMobile && <div style={{ height: 18 * CASE_STUDIES.length + 80 }} />}
            </div>
          )}

          {/* Expanded folder view */}
          {activeCase !== null && (() => {
            const c = CASE_STUDIES.find(x => x.slug === activeCase)!
            return (
              <div>
                {/* Back button */}
                <button onClick={() => setActiveCase(null)} data-hover
                  style={{ display:'flex', alignItems:'center', gap:8, marginBottom:24, padding:'8px 16px', borderRadius:99, border:`1px solid ${c.color}30`, background:`${c.color}10`, color:c.color, fontSize:13, fontWeight:700, cursor:'none', fontFamily:'inherit' }}>
                  ← Back to all work
                </button>

                {/* Open folder */}
                <div style={{ borderRadius:28, overflow:'hidden', border:`1px solid ${c.color}30`, background:'rgba(10,10,18,0.98)', boxShadow:`0 40px 100px rgba(0,0,0,0.6), 0 0 60px ${c.color}10` }}>
                  {/* Folder tab */}
                  <div style={{ height:8, background:`linear-gradient(90deg, ${c.color}, ${c.color}60)`, width:'50%', borderRadius:'0 0 12px 0' }} />

                  {/* Hero image */}
                  <div style={{ position:'relative', height: isMobile ? 240 : 380, overflow:'hidden' }}>
                    <img src={c.thumbnail} alt={c.client} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center' }} />
                    <div style={{ position:'absolute', inset:0, background:`linear-gradient(0deg, rgba(10,10,18,1) 0%, rgba(10,10,18,0.3) 50%, transparent 100%)` }} />
                    {/* Logo overlay */}
                    <div style={{ position:'absolute', bottom:24, left:28 }}>
                      <img src={c.logo} alt={c.client} style={{ height:32, objectFit:'contain', filter:'brightness(0) invert(1)', opacity:0.95 }} />
                    </div>
                    <div style={{ position:'absolute', top:20, right:20 }}>
                      <span className="pill" style={{ background:`${c.color}25`, color:c.color, border:`1px solid ${c.color}40` }}>{c.tag}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: isMobile ? '1.5rem' : '2.5rem 3rem' }}>
                    <h3 style={{ fontSize:'clamp(24px,3vw,44px)', fontWeight:900, letterSpacing:'-1.5px', marginBottom:16, lineHeight:1.1 }}>{c.tagline}</h3>
                    <p style={{ fontSize:15, color:'rgba(255,255,255,0.55)', lineHeight:1.85, maxWidth:640, marginBottom:32 }}>{c.desc}</p>

                    {/* Services pills */}
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:32 }}>
                      {c.services.map(s => (
                        <span key={s} className="pill" style={{ background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.6)', border:'1px solid rgba(255,255,255,0.1)', padding:'6px 14px' }}>{s}</span>
                      ))}
                    </div>

                    {/* Metrics */}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
                      {c.metrics.map((m, mi) => (
                        <div key={m.label} style={{ background:`${c.color}08`, border:`1px solid ${c.color}20`, borderRadius:16, padding:'1.25rem 1.5rem' }}>
                          <div style={{ fontSize:'clamp(24px,3vw,40px)', fontWeight:900, color:c.color, marginBottom:6 }}>{m.value}</div>
                          <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', lineHeight:1.5 }}>{m.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Other clients mini row */}
                <div style={{ marginTop:20 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:12 }}>Other work</div>
                  <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                    {CASE_STUDIES.filter(x=>x.slug!==activeCase).map(x => (
                      <div key={x.slug} onClick={() => setActiveCase(x.slug)} data-hover
                        style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 16px', borderRadius:14, border:`1px solid ${x.color}25`, background:`${x.color}08`, cursor:'none', transition:'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.borderColor=`${x.color}50` }}
                        onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.borderColor=`${x.color}25` }}>
                        <img src={x.logo} alt={x.client} style={{ height:18, objectFit:'contain', filter:'brightness(0) invert(1)', opacity:0.7 }} />
                        <span style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.6)' }}>{x.client}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      </div>

      {/* Brand Films */}
      <div style={{ background:'rgba(255,255,255,0.015)', borderTop:'1px solid rgba(255,255,255,0.06)', borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'6rem 2rem', position:'relative', zIndex:1 }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ marginBottom:48, textAlign:'center' }}>
            <div className="pill" style={{ background:'rgba(0,80,255,0.1)', color:'#60a5fa', border:'1px solid rgba(0,80,255,0.2)', marginBottom:16 }}>Brand Films</div>
            <h2 style={{ fontSize:'clamp(28px,4vw,52px)', fontWeight:900, letterSpacing:'-2px', marginBottom:14 }}>Content people <span className="grad">actually watch.</span></h2>
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.4)', maxWidth:480, margin:'0 auto' }}>A quick look at the standard we hold ourselves to — presence, polish, and clarity.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:20, marginBottom:40 }}>
            {[
              { id:'eZdbXBqgqn4', title:'We Are MORE Than That', client:'Growster × Brand Film' },
              { id:'rxr6q2wLbx8', title:'The Devil Wears Virgio', client:'Virgio × Brand Film' },
            ].map(v => (
              <div key={v.id} className="light-card" data-hover style={{ borderRadius:20, overflow:'hidden', background:'#000', boxShadow:'0 24px 60px rgba(0,0,0,0.5)', border:'1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ position:'relative', paddingBottom:'56.25%' }}>
                  <iframe src={`https://www.youtube.com/embed/${v.id}?autoplay=1&mute=1&loop=1&playlist=${v.id}&controls=0&modestbranding=1&playsinline=1&rel=0`}
                    title={v.title} allow="autoplay; encrypted-media" allowFullScreen
                    style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', border:'none' }} />
                </div>
                <div style={{ padding:'14px 18px', background:'rgba(0,0,0,0.85)' }}>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>{v.client}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:'#fff' }}>{v.title}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center' }}>
            <a href="https://instagram.com/growster.in" target="_blank" rel="noreferrer" data-magnet data-hover
              style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'12px 28px', borderRadius:99, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.7)', fontSize:14, fontWeight:700, textDecoration:'none', transition:'all 0.3s' }}>
              📸 See more on @growster.in
            </a>
          </div>
        </div>
      </div>

      {/* Services */}
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'6rem 2rem', position:'relative', zIndex:1 }}>
        <div style={{ marginBottom:48 }}>
          <div className="pill" style={{ background:'rgba(139,92,246,0.1)', color:'#8b5cf6', border:'1px solid rgba(139,92,246,0.2)', marginBottom:16 }}>What We Do</div>
          <h2 style={{ fontSize:'clamp(28px,4vw,52px)', fontWeight:900, letterSpacing:'-2px' }}>The full stack.</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:14 }}>
          {SERVICES.map((s, si) => (
            <div key={s.title} data-hover className={`light-card fade-up-${si % 4}`}
              style={{ borderRadius:20, padding:'1.5rem', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ position:'absolute', inset:0, borderRadius:20, pointerEvents:'none',
                background:`radial-gradient(300px circle at ${lightPos.x}% ${lightPos.y}%, rgba(255,0,128,0.06) 0%, transparent 70%)`,
                transition:'background 0.15s' }} />
              <div style={{ fontSize:28, marginBottom:12, position:'relative' }}>{s.icon}</div>
              <div style={{ fontSize:16, fontWeight:800, marginBottom:8, position:'relative' }}>{s.title}</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.45)', lineHeight:1.7, position:'relative' }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', padding:'6rem 2rem', textAlign:'center', position:'relative', overflow:'hidden', zIndex:1 }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'80vw', height:'80vw', maxWidth:700,
          background:`radial-gradient(circle at ${lightPos.x}% ${lightPos.y}%, rgba(255,0,128,0.08) 0%, transparent 70%)`,
          pointerEvents:'none', transition:'background 0.1s' }} />
        <div style={{ position:'relative', zIndex:1 }}>
          <div className="pill" style={{ background:'rgba(255,0,128,0.1)', color:'#ff0080', border:'1px solid rgba(255,0,128,0.2)', marginBottom:24 }}>We don't take every client</div>
          <h2 style={{ fontSize:'clamp(28px,5vw,64px)', fontWeight:900, letterSpacing:'-2px', marginBottom:16, lineHeight:1.1 }}>
            We take<br /><span className="grad">the right ones.</span>
          </h2>
          <p style={{ fontSize:16, color:'rgba(255,255,255,0.4)', maxWidth:420, margin:'0 auto 40px', lineHeight:1.8 }}>
            If you're building something that deserves to be seen — let's talk.
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <a href="mailto:harshit@growster.in" data-magnet data-hover
              style={{ padding:'14px 32px', borderRadius:99, border:'none', background:'linear-gradient(135deg,#ff0080,#cc0055)', color:'#fff', fontSize:14, fontWeight:700, textDecoration:'none', boxShadow:'0 0 40px rgba(255,0,128,0.3)', transition:'all 0.3s cubic-bezier(0.16,1,0.3,1)' }}>
              harshit@growster.in →
            </a>
            <a href="tel:+917017251443" data-magnet data-hover
              style={{ padding:'14px 32px', borderRadius:99, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.7)', fontSize:14, fontWeight:700, textDecoration:'none', transition:'all 0.3s cubic-bezier(0.16,1,0.3,1)' }}>
              +91 70172 51443
            </a>
          </div>
        </div>
      </div>

      <div style={{ textAlign:'center', padding:'2rem', borderTop:'1px solid rgba(255,255,255,0.05)', fontSize:12, color:'rgba(255,255,255,0.2)', position:'relative', zIndex:1 }}>
        © {new Date().getFullYear()} Growster. All rights reserved.
      </div>
    </>
  )
}
