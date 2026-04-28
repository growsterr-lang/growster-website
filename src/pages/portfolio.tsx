import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'

const CASE_STUDIES = [
  {
    client: 'Snitch',
    slug: 'snitch',
    tag: 'Performance Content',
    tagline: '100 Ads a Month.',
    desc: "India's fastest growing fashion brand and highest advertising spender in their category came to us with one problem — creative fatigue at scale. We solved it.",
    metrics: [
      { value: '100', label: 'Performance ads delivered monthly' },
      { value: '#1', label: 'Lowest Cost per App Install of all time' },
      { value: '0', label: 'Creative fatigue incidents' },
    ],
    color: '#ff0080',
    logo: '/growster-website/Snitch Logo.png',
    thumbnail: '/growster-website/Snitch Thumbnail.png',
    services: ['Performance Content', 'UGC Production', 'Creative Strategy'],
  },
  {
    client: 'Zouk',
    slug: 'zouk',
    tag: 'Performance Assets',
    tagline: '2x Revenue. Vertical Performance.',
    desc: 'A high-spending brand that came to us for vertical performance assets that actually convert. We delivered a 2x jump in revenue through precision creative and media strategy.',
    metrics: [
      { value: '2x', label: 'Jump in revenue' },
      { value: '↑', label: 'Consistent ROAS improvement' },
      { value: '100%', label: 'Vertical performance assets' },
    ],
    color: '#f59e0b',
    logo: '/growster-website/Zouk Logo.png',
    thumbnail: '/growster-website/Zouk Thumbnail.png',
    services: ['Performance Content', 'Vertical Assets', 'Media Buying'],
  },
  {
    client: 'RWDY',
    slug: 'rwdy',
    tag: 'Full Digital Mandate',
    tagline: '5x Growth in 2 Years.',
    desc: "Vijay Deverakonda's fashion brand. We handled all digital and revenue mandates — strategy, content, performance, social — and grew the company 5x in 2 years.",
    metrics: [
      { value: '5x', label: 'Company growth in 2 years' },
      { value: '100%', label: 'Full digital mandate' },
      { value: '∞', label: 'Celebrity-backed brand reach' },
    ],
    color: '#0050ff',
    logo: '/growster-website/RWDY logo.png',
    thumbnail: '/growster-website/RWDY Thumbnail.png',
    services: ['Full Digital Mandate', 'Performance Marketing', 'Social Media'],
  },
  {
    client: 'Virgio',
    slug: 'virgio',
    tag: 'Brand Films',
    tagline: 'Brand Films That Perform.',
    desc: 'A global fashion powerhouse led by the ex-CEO of Myntra. We produced brand films and performance assets that moved the needle on brand equity and acquisition cost.',
    metrics: [
      { value: '30%', label: 'Decrease in CAC' },
      { value: '60%', label: 'Higher brand lift within D30' },
      { value: '0', label: 'Frequency fatigue' },
    ],
    color: '#8b5cf6',
    logo: '/growster-website/Virgio Thumbnail.png',
    thumbnail: '/growster-website/Virgio Thumbnail.png',
    services: ['Brand Films', 'Performance Marketing', 'Creative Production'],
  },
]

const SERVICES = [
  { icon: '🎬', title: 'Brand Films', desc: 'Cinematic content that builds recall and earns attention in paid and organic environments.' },
  { icon: '📈', title: 'Performance Marketing', desc: 'Media buying, campaign management, and paid social engineered for acquisition.' },
  { icon: '📱', title: 'Social Media', desc: 'Community building, channel management, and organic growth that compounds.' },
  { icon: '🎯', title: 'Influencer Marketing', desc: 'Activations that drive real results — not just reach.' },
  { icon: '🗺️', title: 'Go-To-Market', desc: 'Roadmaps and startup consultation for brands launching into new territory.' },
  { icon: '🎥', title: 'UGC & Content Production', desc: 'Performance creatives at scale — built for fatigue-proof advertising.' },
]

export default function Portfolio() {
  const [activeCase, setActiveCase] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onResize)
    onResize()
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize) }
  }, [])

  return (
    <>
      <Head>
        <title>Portfolio — Growster</title>
        <meta name="description" content="Case studies and brand films from Growster — India's leading brand growth partner." />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          html { scroll-behavior: smooth; }
          body { font-family: 'Montserrat', sans-serif; background: #050508; color: #fff; overflow-x: hidden; }
          ::-webkit-scrollbar { width: 2px; }
          ::-webkit-scrollbar-thumb { background: linear-gradient(#ff0080, #0050ff); }
          .grad { background: linear-gradient(135deg, #ff0080, #0050ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
          .glass { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(20px); }
          @keyframes fadeUp { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
          .fade-up { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }
          .fade-up-1 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
          .fade-up-2 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
          .fade-up-3 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
          .case-card { transition: all 0.3s cubic-bezier(0.16,1,0.3,1); }
          .case-card:hover { transform: translateY(-4px); }
          .service-card { transition: all 0.25s ease; }
          .service-card:hover { transform: translateY(-4px); border-color: rgba(255,0,128,0.25) !important; }
          .pill { display: inline-block; padding: 4px 14px; border-radius: 99px; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
        `}</style>
      </Head>

      {/* Nav */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:50, padding:'0 2rem', height:56, display:'flex', alignItems:'center', justifyContent:'space-between', background:scrolled?'rgba(5,5,8,0.95)':'transparent', backdropFilter:scrolled?'blur(20px)':'none', borderBottom:scrolled?'1px solid rgba(255,255,255,0.07)':'none', transition:'all 0.3s' }}>
        <a href="/" style={{ textDecoration:'none', display:'flex', alignItems:'center' }}><img src="/Growster-Favicon.png" alt="Growster" style={{ height:28, width:28, objectFit:'contain', marginRight:8 }} /><span style={{ fontSize:15, fontWeight:900, color:'#fff', letterSpacing:'-0.5px' }}>Growster<span style={{ color:'#ff0080' }}>.</span></span></a>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <a href="/" style={{ fontSize:12, color:'rgba(255,255,255,0.5)', textDecoration:'none', fontWeight:600 }}>← Back</a>
          <a href="mailto:harshit@growster.in" style={{ padding:'8px 18px', borderRadius:99, border:'none', background:'linear-gradient(135deg,#ff0080,#cc0055)', color:'#fff', fontSize:12, fontWeight:700, textDecoration:'none' }}>Get in touch →</a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ minHeight:'90vh', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', padding:'8rem 2rem 4rem' }}>
        <div style={{ position:'absolute', top:'-20%', left:'-10%', width:'60vw', height:'60vw', background:'radial-gradient(circle, rgba(255,0,128,0.12) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-20%', right:'-10%', width:'50vw', height:'50vw', background:'radial-gradient(circle, rgba(0,80,255,0.1) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div style={{ maxWidth:900, width:'100%', textAlign:'center', position:'relative', zIndex:1 }}>
          <div className="pill fade-up" style={{ background:'rgba(255,0,128,0.1)', color:'#ff0080', border:'1px solid rgba(255,0,128,0.2)', marginBottom:24 }}>Our Work</div>
          <h1 className="fade-up-1" style={{ fontSize:'clamp(36px,6vw,88px)', fontWeight:900, lineHeight:1.05, letterSpacing:'-3px', marginBottom:24 }}>
            We build brands<br /><span className="grad">that earn attention.</span>
          </h1>
          <p className="fade-up-2" style={{ fontSize:'clamp(15px,2vw,18px)', color:'rgba(255,255,255,0.45)', lineHeight:1.8, maxWidth:560, margin:'0 auto 40px' }}>
            50 Cr+ in revenue generated. 10M+ views. Work that speaks louder than any pitch.
          </p>
          <div className="fade-up-3" style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <a href="#work" style={{ padding:'12px 28px', borderRadius:99, border:'none', background:'linear-gradient(135deg,#ff0080,#cc0055)', color:'#fff', fontSize:14, fontWeight:700, textDecoration:'none', boxShadow:'0 0 32px rgba(255,0,128,0.3)' }}>See our work ↓</a>
            <a href="https://instagram.com/growster.in" target="_blank" rel="noreferrer" style={{ padding:'12px 28px', borderRadius:99, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.7)', fontSize:14, fontWeight:700, textDecoration:'none' }}>@growster.in ↗</a>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', borderBottom:'1px solid rgba(255,255,255,0.06)', background:'rgba(255,255,255,0.02)', padding:'2.5rem 2rem' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))', gap:24 }}>
          {[
            { value:'50Cr+', label:'Revenue generated' },
            { value:'10M+', label:'Influencer views' },
            { value:'5x', label:'RWDY growth in 2 years' },
            { value:'30%', label:'Avg CAC reduction' },
            { value:'60%', label:'Brand lift (Virgio D30)' },
          ].map(s => (
            <div key={s.label} style={{ textAlign:'center' }}>
              <div style={{ fontSize:'clamp(22px,3vw,36px)', fontWeight:900, background:'linear-gradient(135deg,#ff0080,#0050ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:6 }}>{s.value}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Studies */}
      <div id="work" style={{ maxWidth:1200, margin:'0 auto', padding:'6rem 2rem' }}>
        <div style={{ marginBottom:48 }}>
          <div className="pill" style={{ background:'rgba(255,0,128,0.1)', color:'#ff0080', border:'1px solid rgba(255,0,128,0.2)', marginBottom:16 }}>Case Studies</div>
          <h2 style={{ fontSize:'clamp(28px,4vw,56px)', fontWeight:900, letterSpacing:'-2px' }}>The work.</h2>
        </div>

        <div style={{ display:'grid', gap:20 }}>
          {CASE_STUDIES.map((c) => (
            <div key={c.slug} className="case-card" onClick={() => setActiveCase(activeCase===c.slug?null:c.slug)}
              style={{ borderRadius:28, overflow:'hidden', border:'1px solid rgba(255,255,255,0.08)', cursor:'pointer', background:'rgba(255,255,255,0.02)' }}>

              {/* Main row */}
              <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '340px 1fr' }}>

                {/* Thumbnail */}
                <div style={{ position:'relative', overflow:'hidden', background:`${c.color}15`, minHeight: isMobile ? 220 : 260 }}>
                  <img src={c.thumbnail} alt={c.client}
                    style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center', position:'absolute', inset:0, transition:'transform 0.5s', transform:activeCase===c.slug?'scale(1.06)':'scale(1)' }} />
                  <div style={{ position:'absolute', inset:0, background: isMobile ? 'linear-gradient(0deg, rgba(5,5,8,0.8) 0%, transparent 60%)' : 'linear-gradient(90deg, transparent 50%, rgba(5,5,8,0.95) 100%)' }} />
                  {/* Logo */}
                  <div style={{ position:'absolute', bottom:16, left:16 }}>
                    <img src={c.logo} alt={`${c.client} logo`}
                      style={{ height:24, objectFit:'contain', filter:'brightness(0) invert(1)', opacity:0.9 }} />
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: isMobile ? '1.5rem' : '2rem 2.5rem', display:'flex', flexDirection:'column', justifyContent:'space-between', borderLeft: isMobile ? 'none' : `3px solid ${c.color}`, borderTop: isMobile ? `3px solid ${c.color}` : 'none' }}>
                  <div>
                    <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:14, flexWrap:'wrap' }}>
                      <span className="pill" style={{ background:`${c.color}18`, color:c.color, border:`1px solid ${c.color}30` }}>{c.tag}</span>
                      {c.services.map(s => (
                        <span key={s} style={{ fontSize:10, color:'rgba(255,255,255,0.28)', fontWeight:600 }}>{s}</span>
                      ))}
                    </div>
                    <h3 style={{ fontSize:'clamp(22px,2.5vw,38px)', fontWeight:900, letterSpacing:'-1px', marginBottom:10, lineHeight:1.15 }}>{c.tagline}</h3>
                    {activeCase === c.slug && (
                      <p style={{ fontSize:14, color:'rgba(255,255,255,0.5)', lineHeight:1.85, maxWidth:540, marginBottom:16, marginTop:8 }}>{c.desc}</p>
                    )}
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:16 }}>
                    <span style={{ fontSize:11, color:'rgba(255,255,255,0.25)', fontWeight:600 }}>{activeCase===c.slug ? 'Collapse ↑' : 'Expand ↓'}</span>
                    <div style={{ fontSize:20, color:c.color, transition:'transform 0.3s', transform:activeCase===c.slug?'rotate(180deg)':'rotate(0)' }}>↓</div>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', borderTop:`1px solid rgba(255,255,255,0.06)` }}>
                {c.metrics.map((m, mi) => (
                  <div key={m.label} style={{ padding:'18px 20px', borderRight:mi<2?'1px solid rgba(255,255,255,0.06)':'none', background:`${c.color}04` }}>
                    <div style={{ fontSize:'clamp(20px,2.5vw,32px)', fontWeight:900, color:c.color, marginBottom:4 }}>{m.value}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.38)', lineHeight:1.4 }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Films */}
      <div style={{ background:'rgba(255,255,255,0.015)', borderTop:'1px solid rgba(255,255,255,0.06)', borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'6rem 2rem' }}>
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
              <div key={v.id} style={{ borderRadius:20, overflow:'hidden', background:'#000', boxShadow:'0 24px 60px rgba(0,0,0,0.5)', border:'1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ position:'relative', paddingBottom:'56.25%' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}?autoplay=1&mute=1&loop=1&playlist=${v.id}&controls=0&modestbranding=1&playsinline=1&rel=0`}
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
            <a href="https://instagram.com/growster.in" target="_blank" rel="noreferrer"
              style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'12px 28px', borderRadius:99, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.7)', fontSize:14, fontWeight:700, textDecoration:'none' }}>
              📸 See more on @growster.in
            </a>
          </div>
        </div>
      </div>

      {/* Services */}
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'6rem 2rem' }}>
        <div style={{ marginBottom:48 }}>
          <div className="pill" style={{ background:'rgba(139,92,246,0.1)', color:'#8b5cf6', border:'1px solid rgba(139,92,246,0.2)', marginBottom:16 }}>What We Do</div>
          <h2 style={{ fontSize:'clamp(28px,4vw,52px)', fontWeight:900, letterSpacing:'-2px' }}>The full stack.</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:14 }}>
          {SERVICES.map(s => (
            <div key={s.title} className="service-card glass" style={{ borderRadius:20, padding:'1.5rem', border:'1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize:28, marginBottom:12 }}>{s.icon}</div>
              <div style={{ fontSize:16, fontWeight:800, marginBottom:8 }}>{s.title}</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.45)', lineHeight:1.7 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', padding:'6rem 2rem', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'80vw', height:'80vw', maxWidth:700, background:'radial-gradient(circle, rgba(255,0,128,0.07) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'relative', zIndex:1 }}>
          <div className="pill" style={{ background:'rgba(255,0,128,0.1)', color:'#ff0080', border:'1px solid rgba(255,0,128,0.2)', marginBottom:24 }}>We don't take every client</div>
          <h2 style={{ fontSize:'clamp(28px,5vw,64px)', fontWeight:900, letterSpacing:'-2px', marginBottom:16, lineHeight:1.1 }}>
            We take<br /><span className="grad">the right ones.</span>
          </h2>
          <p style={{ fontSize:16, color:'rgba(255,255,255,0.4)', maxWidth:420, margin:'0 auto 40px', lineHeight:1.8 }}>
            If you're building something that deserves to be seen — let's talk.
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <a href="mailto:harshit@growster.in" style={{ padding:'14px 32px', borderRadius:99, border:'none', background:'linear-gradient(135deg,#ff0080,#cc0055)', color:'#fff', fontSize:14, fontWeight:700, textDecoration:'none', boxShadow:'0 0 40px rgba(255,0,128,0.3)' }}>
              harshit@growster.in →
            </a>
            <a href="tel:+917017251443" style={{ padding:'14px 32px', borderRadius:99, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.7)', fontSize:14, fontWeight:700, textDecoration:'none' }}>
              +91 70172 51443
            </a>
          </div>
        </div>
      </div>

      <div style={{ textAlign:'center', padding:'2rem', borderTop:'1px solid rgba(255,255,255,0.05)', fontSize:12, color:'rgba(255,255,255,0.2)' }}>
        © {new Date().getFullYear()} Growster. All rights reserved.
      </div>
    </>
  )
}
