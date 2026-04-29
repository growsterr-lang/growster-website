import Head from 'next/head'
import { useState, useEffect, useRef, useCallback } from 'react'

const CLIENTS = [
  {
    key: 'snitch', name: 'Snitch', tag: 'Performance Content', color: '#ff0080',
    folderGrad: 'linear-gradient(180deg,#ff4da6,#cc0055)',
    tabGrad: 'linear-gradient(180deg,#ff6db8,#ff0080)',
    border: '#990040',
    img: '/growster-website/Snitch Thumbnail.png',
    logo: '/growster-website/Snitch Logo.png',
    title: '100 Ads a Month.',
    desc: "India's fastest growing fashion brand and highest advertising spender in their category came to us with one problem — creative fatigue at scale. We solved it.",
    metrics: [['100','Ads monthly'],['#1','Lowest CPI ever'],['0','Creative fatigue']],
    services: ['Performance Content','UGC Production','Creative Strategy'],
  },
  {
    key: 'zouk', name: 'Zouk', tag: 'Vertical Performance', color: '#f59e0b',
    folderGrad: 'linear-gradient(180deg,#fcd34d,#d97706)',
    tabGrad: 'linear-gradient(180deg,#fde68a,#f59e0b)',
    border: '#b45309',
    img: '/growster-website/Zouk Thumbnail.png',
    logo: '/growster-website/Zouk Logo.png',
    title: '2x Revenue Jump.',
    desc: 'A high-spending brand that came to us for vertical performance assets that actually convert. We delivered a 2x jump in revenue through precision creative and media strategy.',
    metrics: [['2x','Revenue jump'],['↑','ROAS growth'],['100%','Vertical assets']],
    services: ['Performance Content','Vertical Assets','Media Buying'],
  },
  {
    key: 'rwdy', name: 'RWDY', tag: 'Full Digital Mandate', color: '#0050ff',
    folderGrad: 'linear-gradient(180deg,#60a5fa,#1d4ed8)',
    tabGrad: 'linear-gradient(180deg,#93c5fd,#0050ff)',
    border: '#1e3a8a',
    img: '/growster-website/RWDY Thumbnail.png',
    logo: '/growster-website/RWDY logo.png',
    title: '5x Growth in 2 Years.',
    desc: "Vijay Deverakonda's fashion brand. We handled all digital and revenue mandates — strategy, content, performance, social — and grew the company 5x in 2 years.",
    metrics: [['5x','Growth in 2yr'],['100%','Full mandate'],['∞','Brand reach']],
    services: ['Full Mandate','Performance Marketing','Social Media'],
  },
  {
    key: 'virgio', name: 'Virgio', tag: 'Brand Films', color: '#8b5cf6',
    folderGrad: 'linear-gradient(180deg,#c4b5fd,#7c3aed)',
    tabGrad: 'linear-gradient(180deg,#ddd6fe,#8b5cf6)',
    border: '#5b21b6',
    img: '/growster-website/Virgio Thumbnail.png',
    logo: '/growster-website/Virgio Thumbnail.png',
    title: 'Brand Films That Perform.',
    desc: 'A global fashion powerhouse led by the ex-CEO of Myntra. We produced brand films and performance assets that moved the needle on both brand equity and acquisition cost.',
    metrics: [['30%','CAC decrease'],['60%','Brand lift D30'],['0','Freq. fatigue']],
    services: ['Brand Films','Performance Marketing','Creative Production'],
  },
]

export default function Portfolio() {
  const [open, setOpen] = useState<string|null>(null)
  const [selected, setSelected] = useState<string|null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [cursorPos, setCursorPos] = useState({ x: -200, y: -200 })
  const [cursorHover, setCursorHover] = useState(false)
  const [wheelAngle, setWheelAngle] = useState(0)
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 })
  const [clock, setClock] = useState('')
  const targetCursor = useRef({ x: -200, y: -200 })
  const angleRef = useRef(0)
  const rafRef = useRef<number>(0)
  const clickTimer = useRef<any>(null)
  const clickCount = useRef(0)

  const animateCursor = useCallback(() => {
    setCursorPos(prev => ({
      x: prev.x + (targetCursor.current.x - prev.x) * 0.12,
      y: prev.y + (targetCursor.current.y - prev.y) * 0.12,
    }))
    rafRef.current = requestAnimationFrame(animateCursor)
  }, [])

  useEffect(() => {
    const tick = () => {
      const n = new Date(), h = n.getHours()%12||12, m = String(n.getMinutes()).padStart(2,'0'), ap = n.getHours()>=12?'PM':'AM'
      setClock(`${h}:${m} ${ap}`)
    }
    tick(); const t = setInterval(tick, 30000)
    const onResize = () => setIsMobile(window.innerWidth < 768)
    onResize(); window.addEventListener('resize', onResize)
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    let lx = 0, lt = Date.now()
    const onMove = (e: MouseEvent) => {
      targetCursor.current = { x: e.clientX, y: e.clientY }
      setLightPos({ x: (e.clientX/window.innerWidth)*100, y: (e.clientY/window.innerHeight)*100 })
      const now = Date.now(), dist = Math.hypot(e.clientX-lx, 0), speed = Math.min(dist/(now-lt||1)*18, 35)
      angleRef.current += speed; setWheelAngle(angleRef.current)
      lx = e.clientX; lt = now
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    const onEnter = () => setCursorHover(true), onLeave = () => setCursorHover(false)
    document.querySelectorAll('a,button,[data-hover]').forEach(el => { el.addEventListener('mouseenter', onEnter); el.addEventListener('mouseleave', onLeave) })
    // Magnetic
    const onMag = (e: MouseEvent) => {
      document.querySelectorAll('[data-magnet]').forEach(el => {
        const r = el.getBoundingClientRect(), cx = r.left+r.width/2, cy = r.top+r.height/2
        const dx = e.clientX-cx, dy = e.clientY-cy, dist = Math.hypot(dx,dy)
        if (dist < 120) { const p=(1-dist/120)*0.4; (el as HTMLElement).style.transform=`translate(${dx*p}px,${dy*p}px)` }
        else (el as HTMLElement).style.transform=''
      })
    }
    window.addEventListener('mousemove', onMag, { passive: true })
    rafRef.current = requestAnimationFrame(animateCursor)
    return () => {
      clearInterval(t); cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize); window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMove); window.removeEventListener('mousemove', onMag)
    }
  }, [animateCursor])

  const handleFolderClick = (key: string) => {
    clickCount.current += 1
    if (clickCount.current === 1) {
      setSelected(key)
      clickTimer.current = setTimeout(() => { clickCount.current = 0 }, 350)
    } else if (clickCount.current === 2) {
      clearTimeout(clickTimer.current); clickCount.current = 0
      setOpen(key)
    }
  }

  const activeClient = CLIENTS.find(c => c.key === open)

  return (
    <>
      <Head>
        <title>Portfolio — Growster</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Press+Start+2P&display=swap" rel="stylesheet" />
        <style>{`
          *{box-sizing:border-box;margin:0;padding:0}
          html{scroll-behavior:smooth}
          body{font-family:'Montserrat',sans-serif;background:#050508;color:#fff;overflow-x:hidden;cursor:none}
          a,button{cursor:none}
          ::-webkit-scrollbar{width:2px}
          ::-webkit-scrollbar-thumb{background:linear-gradient(#ff0080,#0050ff)}
          .grad{background:linear-gradient(135deg,#ff0080,#0050ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
          .pill{display:inline-block;padding:4px 14px;border-radius:99px;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase}

          /* Cursor */
          .ham-cursor{position:fixed;top:0;left:0;pointer-events:none;z-index:9999;width:44px;height:44px;transition:width 0.2s,height 0.2s}
          .ham-cursor.hover{width:54px;height:54px}
          .ham-wheel{width:100%;height:100%;border-radius:50%;border:2px solid rgba(255,0,128,0.5);display:flex;align-items:center;justify-content:center;background:rgba(5,5,8,0.85);backdrop-filter:blur(4px);box-shadow:0 0 20px rgba(255,0,128,0.2);overflow:hidden}
          .ham-wheel img{width:100%;height:100%;object-fit:cover;border-radius:50%}

          /* Animations */
          @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
          @keyframes glow{0%,100%{opacity:0.5}50%{opacity:1}}
          @keyframes scanline{0%{top:-10%}100%{top:110%}}
          .fade-up-0{animation:fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0s both}
          .fade-up-1{animation:fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both}
          .fade-up-2{animation:fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both}
          .mag-btn{transition:all 0.3s cubic-bezier(0.16,1,0.3,1)}

          /* Mac */
          .mac-wrap{border-radius:16px;overflow:hidden;border:3px solid #1a1a2e;box-shadow:0 32px 100px rgba(0,0,0,0.7)}
          .menubar{height:24px;background:linear-gradient(180deg,#e8e8e8,#d0d0d0);border-bottom:1px solid #999;display:flex;align-items:center;padding:0 12px;gap:14px}
          .menubar-logo{font-size:12px;font-weight:900;color:#000}
          .menubar-item{font-size:11px;color:#111;font-weight:500}
          .menubar-right{margin-left:auto;font-size:11px;color:#333;display:flex;gap:10px;align-items:center}
          .desktop{background:#050508;position:relative;overflow:hidden;min-height:520px}

          /* Wallpaper */
          .wallpaper-text{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;pointer-events:none;user-select:none;width:90%}
          .wallpaper-title{font-family:'Press Start 2P',monospace;font-size:clamp(12px,2.5vw,28px);color:rgba(255,0,128,0.12);line-height:2;letter-spacing:3px;margin-bottom:20px}
          .wallpaper-sub{font-family:'Press Start 2P',monospace;font-size:clamp(5px,0.9vw,8px);color:rgba(255,255,255,0.07);letter-spacing:2px}

          /* Folders */
          .folders-col{position:absolute;left:20px;top:20px;display:flex;flex-direction:column;gap:18px}
          .folder-item{display:flex;flex-direction:column;align-items:center;gap:5px;cursor:none;width:76px;user-select:none}
          .folder-item:hover .f-main{filter:brightness(1.2)}
          .folder-item:hover .f-tab{filter:brightness(1.2)}
          .f-body{width:56px;height:44px;position:relative;transition:transform 0.15s}
          .folder-item:hover .f-body{transform:scale(1.08) translateY(-3px)}
          .folder-item.selected .f-body{transform:scale(1.05)}
          .f-tab{position:absolute;top:0;left:4px;width:20px;height:9px;border-radius:3px 3px 0 0;transition:filter 0.15s}
          .f-main{position:absolute;bottom:0;left:0;right:0;height:37px;border-radius:3px 5px 5px 5px;box-shadow:inset 0 1px 0 rgba(255,255,255,0.25);transition:filter 0.15s}
          .f-label{font-size:10px;color:#fff;font-weight:700;text-shadow:0 1px 3px rgba(0,0,0,0.9);text-align:center;line-height:1.3}
          .folder-item.selected .f-label-inner{background:#0a3eb8;color:#fff;padding:1px 5px;border-radius:2px}

          /* Desktop icons */
          .hd-icon{position:absolute;top:16px;right:16px;display:flex;flex-direction:column;align-items:center;gap:4px}
          .hd-body{width:46px;height:34px;background:linear-gradient(180deg,#e0e0e0,#c0c0c0);border:1px solid #888;border-radius:3px;display:flex;align-items:center;justify-content:center}
          .hd-slot{width:28px;height:3px;background:#888;border-radius:1px}
          .icon-lbl{font-size:9px;color:#fff;font-weight:700;text-shadow:0 1px 2px rgba(0,0,0,0.9);text-align:center}
          .trash-icon{position:absolute;bottom:16px;right:16px;display:flex;flex-direction:column;align-items:center;gap:4px}
          .trash-body{width:38px;height:42px;background:linear-gradient(180deg,#ddd,#bbb);border:1px solid #888;border-radius:0 0 6px 6px;display:flex;align-items:center;justify-content:center}
          .trash-lines{width:22px;height:26px;background:repeating-linear-gradient(0deg,#ccc,#ccc 2px,transparent 2px,transparent 5px);border:0.5px solid #aaa}

          /* Mac window */
          .mac-win{position:absolute;inset:0;background:#f0f0f0;display:none;flex-direction:column;z-index:50;animation:fadeUp 0.25s cubic-bezier(0.16,1,0.3,1) both}
          .mac-win.open{display:flex}
          .win-titlebar{height:22px;background:linear-gradient(180deg,#d8d8d8,#b8b8b8);border-bottom:1px solid #888;display:flex;align-items:center;padding:0 10px;gap:7px}
          .wbtn{width:12px;height:12px;border-radius:50%;border:0.5px solid rgba(0,0,0,0.3);cursor:none;flex-shrink:0;transition:filter 0.15s}
          .wbtn:hover{filter:brightness(0.85)}
          .wbtn-r{background:#ff5f57}.wbtn-y{background:#febc2e}.wbtn-g{background:#28c840}
          .win-titlebar-name{font-size:11px;font-weight:700;color:#333;margin:0 auto}
          .win-toolbar{height:28px;background:linear-gradient(180deg,#d4d4d4,#b8b8b8);border-bottom:1px solid #999;display:flex;align-items:center;padding:0 10px;gap:6px}
          .win-nav{width:22px;height:18px;background:linear-gradient(180deg,#e8e8e8,#c8c8c8);border:1px solid #888;border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:11px;color:#444;cursor:none}
          .win-path-txt{font-size:10px;color:#555;flex:1;padding:0 8px}
          .win-close-btn{font-size:10px;background:linear-gradient(180deg,#e8e8e8,#c8c8c8);border:1px solid #888;border-radius:3px;padding:2px 12px;cursor:none;color:#222;font-family:'Montserrat',sans-serif;transition:filter 0.15s}
          .win-close-btn:hover{filter:brightness(0.9)}
          .win-body{display:grid;grid-template-columns:280px 1fr;flex:1;min-height:0}
          .win-thumb{position:relative;overflow:hidden;background:#111}
          .win-thumb img{width:100%;height:100%;object-fit:cover;object-position:top center;display:block}
          .win-thumb-fade{position:absolute;inset:0;background:linear-gradient(90deg,transparent 50%,#f0f0f0 100%)}
          .win-content{padding:22px 26px;overflow-y:auto;background:#f5f5f5}
          .win-tag{display:inline-block;font-size:9px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;padding:3px 10px;border-radius:99px;margin-bottom:12px}
          .win-title{font-size:clamp(18px,2.5vw,28px);font-weight:900;color:#111;letter-spacing:-0.5px;line-height:1.15;margin-bottom:10px}
          .win-desc{font-size:11px;color:#555;line-height:1.8;margin-bottom:16px}
          .win-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px}
          .win-metric{border-radius:10px;padding:12px}
          .win-metric-val{font-size:20px;font-weight:900;margin-bottom:3px}
          .win-metric-lbl{font-size:9px;color:#666;font-weight:600;line-height:1.4}
          .win-pills{display:flex;gap:5px;flex-wrap:wrap}
          .win-pill{font-size:9px;font-weight:700;padding:3px 9px;border-radius:99px;background:rgba(0,0,0,0.07);color:#555;text-transform:uppercase;letter-spacing:0.05em}

          @media(max-width:768px){body{cursor:auto}.ham-cursor{display:none}a,button{cursor:pointer}.win-body{grid-template-columns:1fr}.win-thumb{height:180px}.folders-col{flex-direction:row;left:50%;transform:translateX(-50%);top:auto;bottom:70px;gap:10px}}
        `}</style>
      </Head>

      {/* Hamster cursor */}
      {!isMobile && (
        <div className={`ham-cursor${cursorHover?' hover':''}`} style={{ transform:`translate(${cursorPos.x-22}px,${cursorPos.y-22}px)` }}>
          <div className="ham-wheel" style={{ transform:`rotate(${wheelAngle}deg)` }}>
            <img src="/Growster-Favicon.png" alt="" />
          </div>
        </div>
      )}

      {/* Page nav */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:500, padding:'0 2rem', height:52, display:'flex', alignItems:'center', justifyContent:'space-between', background:scrolled?'rgba(5,5,8,0.95)':'transparent', backdropFilter:scrolled?'blur(20px)':'none', borderBottom:scrolled?'1px solid rgba(255,255,255,0.07)':'none', transition:'all 0.3s' }}>
        <a href="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:8 }}>
          <img src="/Growster-Favicon.png" alt="Growster" style={{ height:26, width:26, objectFit:'contain' }} />
          <span style={{ fontSize:15, fontWeight:900, color:'#fff', letterSpacing:'-0.5px' }}>Growster<span style={{ color:'#ff0080' }}>.</span></span>
        </a>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <a href="/" style={{ fontSize:12, color:'rgba(255,255,255,0.5)', textDecoration:'none', fontWeight:600 }}>← Back</a>
          <a href="mailto:harshit@growster.in" data-magnet className="mag-btn"
            style={{ padding:'8px 18px', borderRadius:99, border:'none', background:'linear-gradient(135deg,#ff0080,#cc0055)', color:'#fff', fontSize:12, fontWeight:700, textDecoration:'none', boxShadow:'0 0 20px rgba(255,0,128,0.25)' }}>
            Get in touch →
          </a>
        </div>
      </nav>

      {/* Ambient light */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, background:`radial-gradient(600px circle at ${lightPos.x}% ${lightPos.y}%, rgba(255,0,128,0.04) 0%, transparent 70%)`, transition:'background 0.1s' }} />

      {/* Hero */}
      <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'8rem 2rem 4rem', position:'relative', zIndex:1 }}>
        <div style={{ position:'absolute', top:'-20%', left:'-10%', width:'60vw', height:'60vw', background:'radial-gradient(circle,rgba(255,0,128,0.1) 0%,transparent 70%)', pointerEvents:'none', animation:'glow 4s ease-in-out infinite' }} />
        <div style={{ position:'absolute', bottom:'-10%', right:'-10%', width:'50vw', height:'50vw', background:'radial-gradient(circle,rgba(0,80,255,0.08) 0%,transparent 70%)', pointerEvents:'none', animation:'glow 5s ease-in-out infinite 1s' }} />
        <div style={{ maxWidth:860, width:'100%', textAlign:'center', position:'relative', zIndex:1 }}>
          <div className="pill fade-up-0" style={{ background:'rgba(255,0,128,0.1)', color:'#ff0080', border:'1px solid rgba(255,0,128,0.2)', marginBottom:24 }}>Our Work</div>
          <h1 className="fade-up-1" style={{ fontSize:'clamp(34px,6vw,84px)', fontWeight:900, lineHeight:1.05, letterSpacing:'-3px', marginBottom:22 }}>
            We build brands<br /><span className="grad">that earn attention.</span>
          </h1>
          <p className="fade-up-2" style={{ fontSize:'clamp(14px,2vw,18px)', color:'rgba(255,255,255,0.45)', lineHeight:1.8, maxWidth:520, margin:'0 auto 40px' }}>
            50 Cr+ in revenue. 10M+ views. Work that speaks louder than any pitch.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', borderBottom:'1px solid rgba(255,255,255,0.06)', background:'rgba(255,255,255,0.02)', padding:'2.5rem 2rem', position:'relative', zIndex:1 }}>
        <div style={{ maxWidth:1000, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:20 }}>
          {[['50Cr+','Revenue generated'],['10M+','Influencer views'],['5x','RWDY growth'],['30%','Avg CAC reduction'],['60%','Brand lift D30']].map(([v,l]) => (
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ fontSize:'clamp(20px,3vw,34px)', fontWeight:900, background:'linear-gradient(135deg,#ff0080,#0050ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:5 }}>{v}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mac section */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'6rem 2rem', position:'relative', zIndex:1 }}>
        <div style={{ marginBottom:40 }}>
          <div className="pill" style={{ background:'rgba(255,0,128,0.1)', color:'#ff0080', border:'1px solid rgba(255,0,128,0.2)', marginBottom:14 }}>Case Studies</div>
          <h2 style={{ fontSize:'clamp(26px,4vw,52px)', fontWeight:900, letterSpacing:'-2px', marginBottom:8 }}>The work.</h2>
          <p style={{ fontSize:13, color:'rgba(255,255,255,0.35)', fontFamily:"'Press Start 2P', monospace" }}>double click a folder to open</p>
        </div>

        <div className="mac-wrap">
          {/* Menu bar */}
          <div className="menubar">
            <span className="menubar-logo">🐹 Growster OS</span>
            <span className="menubar-item">File</span>
            <span className="menubar-item">Edit</span>
            <span className="menubar-item">View</span>
            <span className="menubar-item">Special</span>
            <div className="menubar-right"><span>{clock}</span></div>
          </div>

          {/* Desktop */}
          <div className="desktop">
            {/* Orbs */}
            <div style={{ position:'absolute', top:'-20%', left:'-10%', width:'70%', height:'120%', background:'radial-gradient(circle,rgba(255,0,128,0.06) 0%,transparent 70%)', pointerEvents:'none', animation:'glow 4s ease-in-out infinite' }} />
            <div style={{ position:'absolute', bottom:'-20%', right:'-10%', width:'60%', height:'100%', background:'radial-gradient(circle,rgba(0,80,255,0.05) 0%,transparent 70%)', pointerEvents:'none', animation:'glow 5s ease-in-out infinite 1.5s' }} />

            {/* Wallpaper text */}
            <div className="wallpaper-text">
              <div className="wallpaper-title">OUR WORK</div>
              <div className="wallpaper-sub">DOUBLE CLICK A FOLDER TO SEE OUR WORK</div>
            </div>

            {/* Folders */}
            <div className="folders-col">
              {CLIENTS.map(c => (
                <div key={c.key} className={`folder-item${selected===c.key?' selected':''}`}
                  onClick={() => handleFolderClick(c.key)} data-hover>
                  <div className="f-body">
                    <div className="f-tab" style={{ background:c.tabGrad }} />
                    <div className="f-main" style={{ background:c.folderGrad, border:`1px solid ${c.border}` }} />
                  </div>
                  <div className="f-label"><span className="f-label-inner">{c.name}</span></div>
                </div>
              ))}
            </div>

            {/* HD icon */}
            <div className="hd-icon">
              <div className="hd-body"><div className="hd-slot" /></div>
              <div className="icon-lbl">Growster HD</div>
            </div>

            {/* Trash icon */}
            <div className="trash-icon">
              <div style={{ width:38, height:8, background:'linear-gradient(180deg,#ddd,#bbb)', border:'1px solid #888', borderBottom:'none', borderRadius:'3px 3px 0 0' }} />
              <div className="trash-body"><div className="trash-lines" /></div>
              <div className="icon-lbl">Trash</div>
            </div>

            {/* Window */}
            {activeClient && (
              <div className={`mac-win${open?' open':''}`}>
                <div className="win-titlebar">
                  <div className="wbtn wbtn-r" onClick={() => { setOpen(null); setSelected(null) }} data-hover />
                  <div className="wbtn wbtn-y" />
                  <div className="wbtn wbtn-g" />
                  <div className="win-titlebar-name">{activeClient.name}</div>
                </div>
                <div className="win-toolbar">
                  <div className="win-nav" onClick={() => { setOpen(null); setSelected(null) }} data-hover>←</div>
                  <div className="win-nav">→</div>
                  <div className="win-path-txt">Growster HD › Case Studies › {activeClient.name}</div>
                  <button className="win-close-btn" onClick={() => { setOpen(null); setSelected(null) }}>Close</button>
                </div>
                <div className="win-body">
                  <div className="win-thumb">
                    <img src={activeClient.img} alt={activeClient.name} />
                    <div className="win-thumb-fade" />
                  </div>
                  <div className="win-content">
                    <div className="win-tag" style={{ background:`${activeClient.color}15`, color:activeClient.color, border:`1px solid ${activeClient.color}30` }}>{activeClient.tag}</div>
                    <div className="win-title">{activeClient.title}</div>
                    <div className="win-desc">{activeClient.desc}</div>
                    <div className="win-metrics">
                      {activeClient.metrics.map(([v,l]) => (
                        <div key={l} className="win-metric" style={{ background:`${activeClient.color}10`, border:`1px solid ${activeClient.color}25` }}>
                          <div className="win-metric-val" style={{ color:activeClient.color }}>{v}</div>
                          <div className="win-metric-lbl">{l}</div>
                        </div>
                      ))}
                    </div>
                    <div className="win-pills">
                      {activeClient.services.map(s => <div key={s} className="win-pill">{s}</div>)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Brand Films */}
      <div style={{ background:'rgba(255,255,255,0.015)', borderTop:'1px solid rgba(255,255,255,0.06)', borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'6rem 2rem', position:'relative', zIndex:1 }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ marginBottom:44, textAlign:'center' }}>
            <div className="pill" style={{ background:'rgba(0,80,255,0.1)', color:'#60a5fa', border:'1px solid rgba(0,80,255,0.2)', marginBottom:14 }}>Brand Films</div>
            <h2 style={{ fontSize:'clamp(26px,4vw,48px)', fontWeight:900, letterSpacing:'-2px', marginBottom:12 }}>Content people <span className="grad">actually watch.</span></h2>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)', maxWidth:440, margin:'0 auto' }}>The standard we hold ourselves to — presence, polish, and clarity.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns: isMobile?'1fr':'1fr 1fr', gap:18, marginBottom:36 }}>
            {[
              { id:'eZdbXBqgqn4', title:'We Are MORE Than That', client:'Growster × Brand Film' },
              { id:'rxr6q2wLbx8', title:'The Devil Wears Virgio', client:'Virgio × Brand Film' },
            ].map(v => (
              <div key={v.id} data-hover style={{ borderRadius:18, overflow:'hidden', background:'#000', boxShadow:'0 20px 60px rgba(0,0,0,0.5)', border:'1px solid rgba(255,255,255,0.08)', transition:'transform 0.3s cubic-bezier(0.16,1,0.3,1)' }}
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
          <div style={{ textAlign:'center' }}>
            <a href="https://instagram.com/growster.in" target="_blank" rel="noreferrer" data-magnet className="mag-btn"
              style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'12px 26px', borderRadius:99, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.7)', fontSize:13, fontWeight:700, textDecoration:'none' }}>
              📸 See more on @growster.in
            </a>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', padding:'6rem 2rem', textAlign:'center', position:'relative', overflow:'hidden', zIndex:1 }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'80vw', height:'80vw', maxWidth:700, background:`radial-gradient(circle at ${lightPos.x}% ${lightPos.y}%,rgba(255,0,128,0.07) 0%,transparent 70%)`, pointerEvents:'none', transition:'background 0.1s' }} />
        <div style={{ position:'relative', zIndex:1 }}>
          <div className="pill" style={{ background:'rgba(255,0,128,0.1)', color:'#ff0080', border:'1px solid rgba(255,0,128,0.2)', marginBottom:22 }}>We don't take every client</div>
          <h2 style={{ fontSize:'clamp(26px,5vw,60px)', fontWeight:900, letterSpacing:'-2px', marginBottom:14, lineHeight:1.1 }}>
            We take<br /><span className="grad">the right ones.</span>
          </h2>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.4)', maxWidth:400, margin:'0 auto 36px', lineHeight:1.8 }}>
            If you're building something that deserves to be seen — let's talk.
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <a href="mailto:harshit@growster.in" data-magnet className="mag-btn"
              style={{ padding:'14px 30px', borderRadius:99, border:'none', background:'linear-gradient(135deg,#ff0080,#cc0055)', color:'#fff', fontSize:13, fontWeight:700, textDecoration:'none', boxShadow:'0 0 40px rgba(255,0,128,0.3)' }}>
              harshit@growster.in →
            </a>
            <a href="tel:+917017251443" data-magnet className="mag-btn"
              style={{ padding:'14px 30px', borderRadius:99, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.7)', fontSize:13, fontWeight:700, textDecoration:'none' }}>
              +91 70172 51443
            </a>
          </div>
        </div>
      </div>

      <div style={{ textAlign:'center', padding:'2rem', borderTop:'1px solid rgba(255,255,255,0.05)', fontSize:11, color:'rgba(255,255,255,0.2)', position:'relative', zIndex:1 }}>
        © {new Date().getFullYear()} Growster. All rights reserved.
      </div>
    </>
  )
}
