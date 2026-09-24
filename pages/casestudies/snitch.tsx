import Head from 'next/head'
import { useState, useEffect, useRef, useCallback } from 'react'

export default function SnitchCaseStudy() {
  const [scrollY, setScrollY] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [cursorPos, setCursorPos] = useState({ x:-200, y:-200 })
  const [cursorHover, setCursorHover] = useState(false)
  const [wheelAngle, setWheelAngle] = useState(0)
  const [lightPos, setLightPos] = useState({ x:50, y:50 })
  const [hoveredAd, setHoveredAd] = useState<number|null>(null)
  const [flCount, setFlCount] = useState(0)
  const [activeSection, setActiveSection] = useState(0)
  const targetCursor = useRef({ x:-200, y:-200 })
  const angleRef = useRef(0)
  const rafRef = useRef<number>(0)
  const floorRef = useRef<HTMLCanvasElement>(null)
  const flCountRef = useRef(0)

  const animCursor = useCallback(() => {
    setCursorPos(prev => ({ x:prev.x+(targetCursor.current.x-prev.x)*0.12, y:prev.y+(targetCursor.current.y-prev.y)*0.12 }))
    rafRef.current = requestAnimationFrame(animCursor)
  }, [])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    onResize()
    window.addEventListener('resize', onResize)
    const onScroll = () => {
      setScrollY(window.scrollY)
      const sections = document.querySelectorAll('[data-section]')
      sections.forEach((s, i) => {
        const r = s.getBoundingClientRect()
        if (r.top < window.innerHeight*0.5) setActiveSection(i)
      })
    }
    window.addEventListener('scroll', onScroll, { passive:true })
    const onMove = (e: MouseEvent) => {
      targetCursor.current = { x:e.clientX, y:e.clientY }
      setLightPos({ x:(e.clientX/window.innerWidth)*100, y:(e.clientY/window.innerHeight)*100 })
      const speed = Math.min(Math.hypot(e.movementX, e.movementY)*2, 35)
      angleRef.current += speed; setWheelAngle(angleRef.current)
    }
    window.addEventListener('mousemove', onMove, { passive:true })
    const onEnter = () => setCursorHover(true), onLeave = () => setCursorHover(false)
    setTimeout(() => { document.querySelectorAll('a,button,[data-hover]').forEach(el => { el.addEventListener('mouseenter',onEnter); el.addEventListener('mouseleave',onLeave) }) }, 500)
    rafRef.current = requestAnimationFrame(animCursor)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [animCursor])

  // Canvas shoot floor animation
  useEffect(() => {
    const canvas = floorRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    const W = canvas.width, H = canvas.height
    const ZONES = [
      { label:'Set 01 — Tops', color:'#ff0080', x:0, w:W/3 },
      { label:'Set 02 — Bottoms', color:'#0050ff', x:W/3, w:W/3 },
      { label:'Set 03 — Full Looks', color:'#8b5cf6', x:W*2/3, w:W/3 },
    ]
    type Dot = { x:number; y:number; vx:number; vy:number; zone:number; timer:number; done:boolean; alpha:number }
    const dots: Dot[] = []
    for (let i=0; i<60; i++) {
      const zone = i % 3
      dots.push({ x: ZONES[zone].x + Math.random()*ZONES[zone].w*0.8 + ZONES[zone].w*0.1, y: 40+Math.random()*(H-80), vx:(Math.random()-.5)*1.2, vy:(Math.random()-.5)*1.2, zone, timer:50+Math.floor(Math.random()*200), done:false, alpha:0.7 })
    }
    let raf: number
    function draw() {
      ctx.clearRect(0,0,W,H)
      // Zone backgrounds
      ZONES.forEach((z,i) => {
        ctx.fillStyle = z.color+'10'
        ctx.fillRect(z.x, 0, z.w, H)
        ctx.strokeStyle = z.color+'20'
        ctx.lineWidth = 1
        ctx.strokeRect(z.x, 0, z.w, H)
        ctx.fillStyle = z.color+'80'
        ctx.font = '700 9px Montserrat,sans-serif'
        ctx.fillText(z.label, z.x+8, 14)
        // Crew tags
        const crewTags = ['Model','DOP','Cam']
        for (let ti=0; ti<crewTags.length; ti++) {
          const tag = crewTags[ti]
          const tx = z.x + 6 + ti*48, ty = H-8
          ctx.fillStyle = z.color+'20'
          ctx.beginPath(); ctx.rect(tx, ty-10, 44, 14); ctx.fill()
          ctx.fillStyle = z.color+'90'
          ctx.font = '600 7px Montserrat,sans-serif'
          ctx.fillText(tag, tx+4, ty)
        }
      })
      // Dividers
      ctx.strokeStyle = 'rgba(255,255,255,0.06)'
      ctx.lineWidth = 1
      ctx.setLineDash([3,3])
      ctx.beginPath(); ctx.moveTo(W/3,0); ctx.lineTo(W/3,H); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(W*2/3,0); ctx.lineTo(W*2/3,H); ctx.stroke()
      ctx.setLineDash([])
      // Dots
      dots.forEach(d => {
        if (d.done) return
        d.timer--
        const z = ZONES[d.zone]
        if (d.timer <= 0) {
          d.done = true; d.alpha = 0
          flCountRef.current = Math.min(flCountRef.current+1, 33)
          setFlCount(flCountRef.current)
          setTimeout(() => {
            d.x = z.x + Math.random()*z.w*0.8 + z.w*0.1
            d.y = 40+Math.random()*(H-80)
            d.vx = (Math.random()-.5)*1.2; d.vy = (Math.random()-.5)*1.2
            d.timer = 80+Math.floor(Math.random()*180); d.done=false; d.alpha=0.7
          }, 400+Math.random()*400)
          return
        }
        d.x += d.vx; d.y += d.vy
        if (d.x < z.x+4 || d.x > z.x+z.w-4) d.vx*=-1
        if (d.y < 20 || d.y > H-20) d.vy*=-1
        // Pulse on low timer
        const pulse = d.timer < 30 ? 0.5+Math.sin(Date.now()/100)*0.3 : 0
        const r = 4 + pulse*2
        ctx.beginPath(); ctx.arc(d.x, d.y, r, 0, Math.PI*2)
        ctx.fillStyle = ZONES[d.zone].color
        ctx.globalAlpha = d.alpha
        ctx.fill()
        ctx.globalAlpha = 1
        if (pulse > 0.3) {
          ctx.beginPath(); ctx.arc(d.x, d.y, r*2, 0, Math.PI*2)
          ctx.strokeStyle = ZONES[d.zone].color
          ctx.lineWidth = 0.5; ctx.globalAlpha = pulse*0.3; ctx.stroke(); ctx.globalAlpha = 1
        }
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])

  const AD_SETS = [
    { status:'win', label:'Ad Set 01', ctr:'2.4%', spend:'₹12K', note:'Winner — scaling hard, new creative fresh' },
    { status:'burn', label:'Ad Set 02', ctr:'0.3%', spend:'₹18K', note:'Frequency 8+ — audience is burnt out' },
    { status:'fatigue', label:'Ad Set 03', ctr:'0.1%', spend:'₹22K', note:'CTR collapsed day 4 — creative fatigue hit' },
    { status:'fatigue', label:'Ad Set 04', ctr:'0.2%', spend:'₹15K', note:'Same creative recycled — audience exhausted' },
    { status:'burn', label:'Ad Set 05', ctr:'0.4%', spend:'₹20K', note:'High CPM — creative not resonating' },
    { status:'fatigue', label:'Ad Set 06', ctr:'0.1%', spend:'₹14K', note:'Killed day 3 — no fresh replacement ready' },
    { status:'fatigue', label:'Ad Set 07', ctr:'0.2%', spend:'₹11K', note:'UGC hook failed — no system to iterate' },
    { status:'win', label:'Ad Set 08', ctr:'1.9%', spend:'₹8K', note:'New creative — early winner, promising signals' },
    { status:'burn', label:'Ad Set 09', ctr:'0.3%', spend:'₹16K', note:'Waiting on new creatives — stuck and spending' },
    { status:'fatigue', label:'Ad Set 10', ctr:'0.1%', spend:'₹19K', note:'Fatigue day 2 — no system to replace fast enough' },
  ]
  const STATUS_STYLES: Record<string,any> = {
    win: { bg:'rgba(16,185,129,0.08)', border:'rgba(16,185,129,0.3)', color:'#10b981', label:'Winning' },
    fatigue: { bg:'rgba(239,68,68,0.08)', border:'rgba(239,68,68,0.3)', color:'#ef4444', label:'Fatigue' },
    burn: { bg:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.25)', color:'#f59e0b', label:'Burning' },
  }

  const SECTIONS = ['The Problem','Our Analysis','The Data','The Solution','The Impact']
  const grad: any = { background:'linear-gradient(135deg,#ff0080,#0050ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }

  return (
    <>
      <Head>
        <title>Snitch × Growster — Case Study</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <style>{`
          *{box-sizing:border-box;margin:0;padding:0}
          html{scroll-behavior:smooth}
          body{font-family:'Montserrat',sans-serif;background:#050508;color:#fff;overflow-x:hidden}
          ::-webkit-scrollbar{width:2px}
          ::-webkit-scrollbar-thumb{background:linear-gradient(#ff0080,#0050ff)}
          @media(min-width:769px){body{cursor:none}a,button{cursor:none}}
          .ham-cursor{position:fixed;top:0;left:0;pointer-events:none;z-index:9999;width:44px;height:44px;transition:width .2s,height .2s}
          .ham-cursor.hover{width:54px;height:54px}
          .ham-wheel{width:100%;height:100%;border-radius:50%;border:2px solid rgba(255,0,128,0.5);display:flex;align-items:center;justify-content:center;background:rgba(5,5,8,0.85);backdrop-filter:blur(4px);box-shadow:0 0 20px rgba(255,0,128,0.2);overflow:hidden}
          .ham-wheel img{width:100%;height:100%;object-fit:cover;border-radius:50%}
          @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
          @keyframes glow{0%,100%{opacity:.5}50%{opacity:1}}
          @keyframes countUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
          .fu{animation:fadeUp .7s cubic-bezier(.16,1,.3,1) both}
          .fu1{animation:fadeUp .7s cubic-bezier(.16,1,.3,1) .1s both}
          .fu2{animation:fadeUp .7s cubic-bezier(.16,1,.3,1) .2s both}
          .fu3{animation:fadeUp .7s cubic-bezier(.16,1,.3,1) .3s both}
          .section{min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:6rem 0;position:relative}
          .container{max-width:1100px;margin:0 auto;padding:0 2rem;position:relative;z-index:1}
          .sec-num{font-size:10px;font-weight:700;color:#ff0080;letter-spacing:.2em;text-transform:uppercase;margin-bottom:12px}
          .sec-h{font-size:clamp(28px,5vw,60px);font-weight:900;letter-spacing:-2px;line-height:1.05;margin-bottom:16px}
          .body{font-size:15px;color:rgba(255,255,255,.5);line-height:1.85;max-width:580px;margin-bottom:32px}
          .pill{display:inline-block;padding:4px 14px;border-radius:99px;font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase}
          .card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:1.25rem}
          .card-h{transition:all .25s ease}
          .card-h:hover{transform:translateY(-3px);border-color:rgba(255,255,255,.14)!important}
          .ad-set{border-radius:12px;padding:10px 10px;text-align:center;border:1px solid;cursor:default;transition:all .25s;position:relative}
          .ad-set:hover{transform:scale(1.04) translateY(-2px)}
          @media(max-width:768px){.two-col{grid-template-columns:1fr!important}.three-col{grid-template-columns:1fr 1fr!important}}
        `}</style>
      </Head>

      {/* Cursor */}
      {!isMobile && (
        <div className={`ham-cursor${cursorHover?' hover':''}`} style={{ transform:`translate(${cursorPos.x-22}px,${cursorPos.y-22}px)` }}>
          <div className="ham-wheel" style={{ transform:`rotate(${wheelAngle}deg)` }}>
            <img src="/Growster-Favicon.png" alt="" />
          </div>
        </div>
      )}

      {/* Ambient */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, background:`radial-gradient(600px circle at ${lightPos.x}% ${lightPos.y}%, rgba(255,0,128,0.04), transparent 70%)`, transition:'background .1s' }} />

      {/* Progress sidebar */}
      {!isMobile && (
        <div style={{ position:'fixed', left:24, top:'50%', transform:'translateY(-50%)', zIndex:50, display:'flex', flexDirection:'column', gap:12 }}>
          {SECTIONS.map((s,i) => (
            <div key={s} style={{ display:'flex', alignItems:'center', gap:8, opacity: activeSection===i?1:0.3, transition:'all .3s' }}>
              <div style={{ width:activeSection===i?20:4, height:4, borderRadius:99, background:activeSection===i?'#ff0080':'rgba(255,255,255,0.3)', transition:'all .3s' }} />
              {activeSection===i && <span style={{ fontSize:9, fontWeight:700, color:'#ff0080', textTransform:'uppercase', letterSpacing:'0.1em', whiteSpace:'nowrap' }}>{s}</span>}
            </div>
          ))}
        </div>
      )}

      {/* Sticky nav */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, height:52, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 2rem', background:scrollY>40?'rgba(5,5,8,0.95)':'transparent', backdropFilter:scrollY>40?'blur(20px)':'none', borderBottom:scrollY>40?'1px solid rgba(255,255,255,0.06)':'none', transition:'all .3s' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <a href="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:8 }}>
            <img src="/Growster-Favicon.png" alt="Growster" style={{ height:22, width:22, objectFit:'contain' }} />
            <span style={{ fontSize:14, fontWeight:900, letterSpacing:'-0.5px', color:'#fff' }}>Growster<span style={{ color:'#ff0080' }}>.</span></span>
          </a>
          <span style={{ fontSize:12, color:'rgba(255,255,255,0.2)', margin:'0 4px' }}>›</span>
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:600 }}>Case Studies</span>
          <span style={{ fontSize:12, color:'rgba(255,255,255,0.2)', margin:'0 4px' }}>›</span>
          <span style={{ fontSize:11, color:'#ff0080', fontWeight:700 }}>Snitch</span>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <a href="/portfolio" style={{ padding:'7px 16px', borderRadius:99, border:'1px solid rgba(255,255,255,0.12)', background:'transparent', color:'rgba(255,255,255,0.5)', fontSize:11, fontWeight:700, textDecoration:'none' }}>← All work</a>
          <a href="/grow" style={{ padding:'7px 16px', borderRadius:99, border:'none', background:'linear-gradient(135deg,#ff0080,#cc0055)', color:'#fff', fontSize:11, fontWeight:700, textDecoration:'none' }}>Work with us →</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight:'100vh', display:'flex', alignItems:'center', padding:'6rem 0 4rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-20%', left:'-10%', width:'70vw', height:'70vw', background:'radial-gradient(circle,rgba(255,0,128,0.12) 0%,transparent 70%)', pointerEvents:'none', animation:'glow 4s ease-in-out infinite' }} />
        <div style={{ position:'absolute', bottom:'-10%', right:'-10%', width:'60vw', height:'60vw', background:'radial-gradient(circle,rgba(0,80,255,0.1) 0%,transparent 70%)', pointerEvents:'none', animation:'glow 5s ease-in-out infinite 1s' }} />
        <div className="container">
          <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center' }}>
            <div>
              <div className="fu" style={{ marginBottom:20 }}>
                <span className="pill" style={{ background:'rgba(255,0,128,0.1)', color:'#ff0080', border:'1px solid rgba(255,0,128,0.2)', marginRight:8 }}>Performance Content</span>
                <span className="pill" style={{ background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.5)', border:'1px solid rgba(255,255,255,0.1)' }}>Case Study</span>
              </div>
              <div className="fu1" style={{ fontSize:'clamp(14px,2vw,18px)', fontWeight:700, color:'rgba(255,255,255,0.3)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:12 }}>Snitch × Growster</div>
              <h1 className="fu2" style={{ fontSize:'clamp(36px,6vw,80px)', fontWeight:900, letterSpacing:'-3px', lineHeight:1.0, marginBottom:20 }}>
                How we built<br />a <span style={grad}>creative machine</span><br />for Snitch.
              </h1>
              <p className="fu3" style={{ fontSize:15, color:'rgba(255,255,255,0.45)', lineHeight:1.8, maxWidth:460, marginBottom:28 }}>
                India's highest ad-spending menswear brand. 100 unique ads. Every single month. Zero creative fatigue.
              </p>
              <div className="fu3" style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                {[['2000+','Unique ads delivered'],['#1','Lowest CPI ever'],['0','Creative fatigue incidents']].map(([v,l]) => (
                  <div key={l} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'12px 16px', textAlign:'center', minWidth:110 }}>
                    <div style={{ fontSize:22, fontWeight:900, ...grad, marginBottom:3 }}>{v}</div>
                    <div style={{ fontSize:9, color:'rgba(255,255,255,0.35)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="fu2" style={{ position:'relative' }}>
              <div style={{ borderRadius:24, overflow:'hidden', border:'1px solid rgba(255,255,255,0.08)', boxShadow:'0 40px 100px rgba(0,0,0,0.6)' }}>
                <img src="/growster-website/Snitch Thumbnail.png" alt="Snitch" style={{ width:'100%', height:480, objectFit:'cover', objectPosition:'top center', display:'block' }} />
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(0deg,rgba(5,5,8,0.7) 0%,transparent 50%)' }} />
              </div>
              <div style={{ position:'absolute', bottom:20, left:20 }}>
                <img src="/growster-website/Snitch Logo.png" alt="Snitch" style={{ height:22, objectFit:'contain', filter:'brightness(0) invert(1)', opacity:0.85 }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM ── */}
      <section className="section" data-section="0" style={{ background:'rgba(255,0,128,0.02)', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <div className="container">
          <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center' }}>
            <div>
              <div className="sec-num">01 — The Problem</div>
              <h2 className="sec-h">Scale was there.<br/><span style={grad}>The creatives weren't.</span></h2>
              <p className="body">Snitch runs one of the highest-velocity ad machines in Indian apparel. Budget? Unlimited. But creative fatigue was hitting every single week — UGC was cheap but unreliable, production was expensive, and neither was scalable at speed.</p>
              <p className="body">They needed a <span style={{ color:'#fff', fontWeight:700 }}>predictable system</span>, not just content. A machine that could feed the algorithm faster than the algorithm could burn through creatives.</p>
              <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginTop:-12 }}>
                {[['🔴','Creative Fatigue','Hitting every week'],['🟡','UGC Hit Rate','Terrible at scale'],['🔵','Production Cost','Too expensive to scale']].map(([e,t,d]) => (
                  <div key={t} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 14px', borderRadius:10, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', fontSize:12 }}>
                    <span style={{ fontSize:14 }}>{e}</span>
                    <div>
                      <div style={{ fontWeight:700, color:'#fff' }}>{t}</div>
                      <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)' }}>{d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive ad sets */}
            <div>
              <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:14 }}>Hover to see what was happening inside their account</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:7 }}>
                {AD_SETS.map((ad, i) => {
                  const st = STATUS_STYLES[ad.status]
                  return (
                    <div key={i} className="ad-set" style={{ background:st.bg, borderColor:st.border }}
                      onMouseEnter={() => setHoveredAd(i)} onMouseLeave={() => setHoveredAd(null)}>
                      <div style={{ fontSize:8, fontWeight:700, color:st.color, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:3 }}>AD {i+1}</div>
                      <div style={{ fontSize:13, fontWeight:900, color:st.color }}>{ad.ctr}</div>
                      <div style={{ fontSize:8, color:'rgba(255,255,255,0.3)', marginTop:2 }}>{ad.spend}</div>
                    </div>
                  )
                })}
              </div>
              <div style={{ marginTop:12, padding:'10px 14px', borderRadius:10, background:'rgba(255,255,255,0.04)', minHeight:44, transition:'all .2s' }}>
                <div style={{ fontSize:12, color: hoveredAd!==null ? STATUS_STYLES[AD_SETS[hoveredAd].status].color : 'rgba(255,255,255,0.25)', fontWeight:600, lineHeight:1.5 }}>
                  {hoveredAd!==null ? `${AD_SETS[hoveredAd].label}: ${AD_SETS[hoveredAd].note}` : 'Hover any ad set to see what was going wrong →'}
                </div>
              </div>
              <div style={{ display:'flex', gap:12, marginTop:10 }}>
                {[['#10b981','Winning (2/10)'],['#ef4444','Fatigue (5/10)'],['#f59e0b','Burning (3/10)']].map(([c,l]) => (
                  <div key={l} style={{ display:'flex', alignItems:'center', gap:5, fontSize:10, color:'rgba(255,255,255,0.4)' }}>
                    <div style={{ width:7, height:7, borderRadius:'50%', background:c }} />{l}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ANALYSIS ── */}
      <section className="section" data-section="1" style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <div className="container">
          <div className="sec-num">02 — Our Analysis</div>
          <h2 className="sec-h" style={{ maxWidth:700 }}>Don't fix the ads.<br/><span style={grad}>Build the system.</span></h2>
          <p className="body">A brand of this stature doesn't need a plug-and-play solution. We built a capability around their specific needs — a dedicated team, a proprietary process, and a system to produce <span style={{ color:'#fff', fontWeight:700 }}>33 unique content pieces in ONE shoot day.</span> Each meticulously crafted based on data. None repeated. Ever.</p>

          {/* Canvas floor */}
          <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, overflow:'hidden', marginBottom:20 }}>
            <div style={{ padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.12em' }}>The shoot floor — live simulation</div>
              <div style={{ display:'flex', gap:16 }}>
                {[['#ff0080','Set 01'],['#0050ff','Set 02'],['#8b5cf6','Set 03']].map(([c,l]) => (
                  <div key={l} style={{ display:'flex', alignItems:'center', gap:5, fontSize:10, color:'rgba(255,255,255,0.4)' }}>
                    <div style={{ width:7, height:7, borderRadius:'50%', background:c }} />{l}
                  </div>
                ))}
              </div>
            </div>
            <canvas ref={floorRef} width={900} height={200} style={{ width:'100%', height:200, display:'block' }} />
            <div style={{ padding:'14px 20px', borderTop:'1px solid rgba(255,255,255,0.06)', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
              <div style={{ textAlign:'center' }}>
                <div key={flCount} style={{ fontSize:28, fontWeight:900, color:'#ff0080', letterSpacing:'-1px', animation:'countUp .3s ease' }}>{flCount}</div>
                <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em' }}>Pieces shot</div>
              </div>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:28, fontWeight:900, color:'#0050ff' }}>3</div>
                <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em' }}>Sets running</div>
              </div>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:28, fontWeight:900, color:'#8b5cf6' }}>1</div>
                <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em' }}>Shoot day</div>
              </div>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:28, fontWeight:900, color:'#10b981' }}>33</div>
                <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em' }}>Target pieces</div>
              </div>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, maxWidth:700 }} className="three-col">
            {[
              { c:'#ff0080', t:'3 Models', d:'Each dedicated to one set — no cross-contamination, no delays' },
              { c:'#0050ff', t:'1 DOP per set', d:'Dedicated Director of Photography ensuring quality at speed' },
              { c:'#8b5cf6', t:'33 pieces / day', d:'Unique, data-driven creatives. Every single one different.' },
            ].map(item => (
              <div key={item.t} className="card card-h" style={{ borderTop:`2px solid ${item.c}` }}>
                <div style={{ fontSize:14, fontWeight:800, color:'#fff', marginBottom:6 }}>{item.t}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)', lineHeight:1.65 }}>{item.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE DATA ── */}
      <section className="section" data-section="2" style={{ background:'rgba(0,80,255,0.02)', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <div className="container">
          <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center' }}>
            <div>
              <div className="sec-num">03 — The Data</div>
              <h2 className="sec-h">We found the<br/><span style={grad}>exact breaking point.</span></h2>
              <p className="body">Snitch was seeing frequency climb and CTR collapse — the classic symptoms of creative fatigue at scale. CPMs spiked. CPI went up. Media buying became inefficient. We reverse-engineered the algorithm and built a system to stay permanently ahead of the fatigue curve.</p>
              <div style={{ padding:'16px 20px', borderRadius:14, background:'rgba(0,80,255,0.06)', border:'1px solid rgba(0,80,255,0.2)', fontSize:13, color:'rgba(255,255,255,0.6)', lineHeight:1.75, fontStyle:'italic' }}>
                "The algorithm rewards freshness. We built a factory for it."
              </div>
            </div>
            <div style={{ display:'grid', gap:12 }}>
              {[
                { label:'CTR', before:'0.4% avg', after:'2.1%+', color:'#10b981', sub:'After system launch', trend:'↑' },
                { label:'Cost per Install', before:'Industry benchmark', after:'All-time low', color:'#10b981', sub:'Lowest ever recorded', trend:'↓' },
                { label:'Creative Frequency', before:'Hitting 8+ (burnt)', after:'Managed & fresh', color:'#10b981', sub:'Never fatigued again', trend:'↓' },
                { label:'CPM Efficiency', before:'Spiking with fatigue', after:'Consistently stable', color:'#10b981', sub:'Media buying unlocked', trend:'↑' },
              ].map(d => (
                <div key={d.label} className="card-h" style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 18px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>{d.label}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', textDecoration:'line-through', marginBottom:3 }}>{d.before}</div>
                    <div style={{ fontSize:15, fontWeight:800, color:d.color }}>{d.trend} {d.after}</div>
                  </div>
                  <div style={{ fontSize:9, color:d.color, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', opacity:0.7 }}>{d.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── THE SOLUTION ── */}
      <section className="section" data-section="3" style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <div className="container">
          <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center' }}>
            <div>
              <div className="sec-num">04 — The Solution</div>
              <h2 className="sec-h">A creative engine<br/><span style={grad}>built for scale.</span></h2>
              <p className="body">We didn't just make ads. We built Snitch's entire content production infrastructure — a system capable of producing high-quality, data-driven creatives faster than any algorithm could burn through them.</p>
              <div style={{ display:'grid', gap:10 }}>
                {[
                  { n:'01', t:'Data-driven briefs', d:'Every shoot brief built from performance data — hooks, formats, and angles that the data said would win.' },
                  { n:'02', t:'3-set shoot system', d:'Parallel production across 3 dedicated sets, each running simultaneously with their own model, DOP, and camera.' },
                  { n:'03', t:'33 pieces per shoot day', d:'A proprietary production system that unlocked scale no agency had delivered before — at an affordable cost.' },
                  { n:'04', t:'Continuous iteration loop', d:'Every week, performance data fed back into the next shoot brief. The system got smarter with every cycle.' },
                ].map(item => (
                  <div key={item.n} className="card-h" style={{ display:'flex', gap:14, alignItems:'flex-start', padding:'12px 16px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:'#ff0080', minWidth:22 }}>{item.n}</div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:'#fff', marginBottom:3 }}>{item.t}</div>
                      <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', lineHeight:1.6 }}>{item.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vertical video */}
            <div style={{ display:'flex', justifyContent:'center' }}>
              <div style={{ width:'min(300px,100%)', borderRadius:24, overflow:'hidden', border:'1px solid rgba(255,255,255,0.1)', boxShadow:'0 40px 100px rgba(0,0,0,0.6)', background:'#000' }}>
                <div style={{ position:'relative', paddingBottom:'177.78%' }}>
                  <iframe
                    src="https://www.youtube.com/embed/DrMFMURZbBM?autoplay=1&mute=1&loop=1&playlist=DrMFMURZbBM&controls=0&modestbranding=1&playsinline=1&rel=0"
                    title="Growster × Snitch"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', border:'none' }}
                  />
                </div>
                <div style={{ padding:'12px 16px', background:'rgba(0,0,0,0.85)', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:3 }}>Growster × Snitch</div>
                  <div style={{ fontSize:12, fontWeight:700, color:'#fff' }}>The kind of content we deliver</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE IMPACT ── */}
      <section className="section" data-section="4" style={{ background:'rgba(255,0,128,0.02)', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <div className="container">
          <div className="sec-num">05 — The Impact</div>
          <h2 className="sec-h" style={{ maxWidth:700 }}>Numbers that speak<br/><span style={grad}>louder than any pitch.</span></h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:14, marginBottom:48 }}>
            {[
              { v:'2000+', l:'Unique ads delivered across the mandate', c:'#ff0080' },
              { v:'#1', l:'Lowest Cost per App Install — all time', c:'#0050ff' },
              { v:'0', l:'Creative fatigue incidents under our system', c:'#10b981' },
              { v:'Beats', l:'Account ROAS average — consistently, every month', c:'#8b5cf6' },
            ].map(i => (
              <div key={i.l} className="card-h" style={{ padding:'1.5rem', borderRadius:18, background:`${i.c}06`, border:`1px solid ${i.c}25`, borderLeft:`3px solid ${i.c}` }}>
                <div style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:900, color:i.c, letterSpacing:'-1px', marginBottom:8 }}>{i.v}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', lineHeight:1.6 }}>{i.l}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ padding:'3rem', borderRadius:24, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', textAlign:'center', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'120%', height:'120%', background:'radial-gradient(circle,rgba(255,0,128,0.06) 0%,transparent 70%)', pointerEvents:'none' }} />
            <div style={{ position:'relative', zIndex:1 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.25)', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:14 }}>Want this for your brand?</div>
              <h3 style={{ fontSize:'clamp(24px,4vw,44px)', fontWeight:900, letterSpacing:'-1.5px', marginBottom:12 }}>
                Ready to <span style={grad}>break free?</span>
              </h3>
              <p style={{ fontSize:14, color:'rgba(255,255,255,0.4)', maxWidth:400, margin:'0 auto 28px', lineHeight:1.8 }}>
                We take 3–4 new clients per quarter. If you're serious about scale — let's talk.
              </p>
              <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
                <a href="/grow" data-hover style={{ padding:'13px 28px', borderRadius:99, border:'none', background:'linear-gradient(135deg,#ff0080,#cc0055)', color:'#fff', fontSize:14, fontWeight:700, textDecoration:'none', boxShadow:'0 0 32px rgba(255,0,128,0.3)' }}>Book a discovery call →</a>
                <a href="/portfolio" data-hover style={{ padding:'13px 28px', borderRadius:99, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.6)', fontSize:14, fontWeight:700, textDecoration:'none' }}>See more work</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div style={{ textAlign:'center', padding:'1.5rem', borderTop:'1px solid rgba(255,255,255,0.05)', fontSize:11, color:'rgba(255,255,255,0.2)' }}>
        © {new Date().getFullYear()} Growster. All rights reserved.
      </div>
    </>
  )
}
