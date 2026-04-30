import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'

export default function ISSProposal() {
  const [cur, setCur] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const [camRot, setCamRot] = useState({ x: 0, y: 0 })
  const [hoveredClient, setHoveredClient] = useState<string|null>(null)
  const [teaBoiling, setTeaBoiling] = useState(false)
  const [teaProgress, setTeaProgress] = useState(0)
  const teaRef = useRef<any>(null)
  const TOTAL = 8

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    onResize()
    window.addEventListener('resize', onResize)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setCur(c => Math.min(c+1, TOTAL-1))
      if (e.key === 'ArrowLeft') setCur(c => Math.max(c-1, 0))
    }
    window.addEventListener('keydown', onKey)
    const onMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX/window.innerWidth, y: e.clientY/window.innerHeight })
      setCamRot({ x: (e.clientY/window.innerHeight - 0.5)*30, y: (e.clientX/window.innerWidth - 0.5)*40 })
    }
    window.addEventListener('mousemove', onMouse, { passive: true })
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  // Tea boiling timer
  const startTea = () => {
    if (teaBoiling) return
    setTeaBoiling(true)
    setTeaProgress(0)
    const start = Date.now()
    const duration = 8000
    teaRef.current = setInterval(() => {
      const p = Math.min((Date.now()-start)/duration*100, 100)
      setTeaProgress(p)
      if (p >= 100) { clearInterval(teaRef.current); setTeaBoiling(false) }
    }, 50)
  }
  const resetTea = () => { clearInterval(teaRef.current); setTeaBoiling(false); setTeaProgress(0) }

  const go = (n: number) => { setCur(Math.max(0, Math.min(TOTAL-1, n))); resetTea() }

  const pill = (color: string, label: string) => (
    <div style={{ display:'inline-block', padding:'4px 14px', borderRadius:99, fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase' as const, background:`${color}15`, color, border:`1px solid ${color}30`, marginBottom:16 }}>{label}</div>
  )
  const grad = { background:'linear-gradient(135deg,#ff0080,#0050ff)', WebkitBackgroundClip:'text' as const, WebkitTextFillColor:'transparent', backgroundClip:'text' as const }
  const card = (extra?: any) => ({ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'1.25rem', ...extra })

  const CLIENTS = [
    { name:'Snitch', color:'#ff0080', img:'/growster-website/Snitch Thumbnail.png', tag:'Performance' },
    { name:'RWDY', color:'#0050ff', img:'/growster-website/RWDY Thumbnail.png', tag:'Full Mandate' },
    { name:'Virgio', color:'#8b5cf6', img:'/growster-website/Virgio Thumbnail.png', tag:'Brand Films' },
  ]

  return (
    <>
      <Head>
        <title>Growster × ISS — Proposal</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <style>{`
          *{box-sizing:border-box;margin:0;padding:0}
          html,body{height:100%;font-family:'Montserrat',sans-serif;background:#050508;color:#fff;overflow:hidden}
          ::-webkit-scrollbar{display:none}
          @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
          @keyframes glow{0%,100%{opacity:.5}50%{opacity:1}}
          @keyframes steam{0%{transform:translateY(0) scaleX(1);opacity:.6}100%{transform:translateY(-30px) scaleX(1.5);opacity:0}}
          @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
          @keyframes spin3d{from{transform:rotateY(0deg)}to{transform:rotateY(360deg)}}
          .fu0{animation:fadeUp .6s cubic-bezier(.16,1,.3,1) both}
          .fu1{animation:fadeUp .6s cubic-bezier(.16,1,.3,1) .1s both}
          .fu2{animation:fadeUp .6s cubic-bezier(.16,1,.3,1) .2s both}
          .fu3{animation:fadeUp .6s cubic-bezier(.16,1,.3,1) .3s both}
          .fu4{animation:fadeUp .6s cubic-bezier(.16,1,.3,1) .4s both}
          .card-h{transition:all .25s ease}
          .card-h:hover{transform:translateY(-3px);border-color:rgba(255,255,255,.14)!important}
          @media(max-width:768px){.split{grid-template-columns:1fr!important}.two-col{grid-template-columns:1fr!important}.three-col{grid-template-columns:1fr!important}}
          @media print{nav,.dots-bar{display:none!important}body,html{overflow:visible!important;height:auto!important}}
        `}</style>
      </Head>

      {/* Nav */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, height:52, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 1.5rem', background:'rgba(5,5,8,0.92)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <img src="/Growster-Favicon.png" alt="Growster" style={{ height:24, width:24, objectFit:'contain' }} />
          <span style={{ fontSize:14, fontWeight:900, letterSpacing:'-0.5px' }}>Growster<span style={{ color:'#ff0080' }}>.</span></span>
          <span style={{ fontSize:12, color:'rgba(255,255,255,0.2)', margin:'0 4px' }}>×</span>
          <span style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.45)' }}>Indian Startup School</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:600 }}>{cur+1} / {TOTAL}</span>
          <button onClick={() => go(cur-1)} disabled={cur===0} style={{ padding:'5px 12px', borderRadius:99, border:'1px solid rgba(255,255,255,0.12)', background:'transparent', color:'rgba(255,255,255,0.5)', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'inherit', opacity:cur===0?0.3:1 }}>←</button>
          <button onClick={() => go(cur+1)} disabled={cur===TOTAL-1} style={{ padding:'5px 12px', borderRadius:99, border:'1px solid rgba(255,255,255,0.12)', background:'transparent', color:'rgba(255,255,255,0.5)', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'inherit', opacity:cur===TOTAL-1?0.3:1 }}>→</button>
          <button onClick={() => window.print()} style={{ padding:'5px 14px', borderRadius:99, border:'none', background:'linear-gradient(135deg,#ff0080,#cc0055)', color:'#fff', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>↓ PDF</button>
        </div>
      </nav>

      {/* Slide area */}
      <div style={{ position:'fixed', top:52, left:0, right:0, bottom:0 }}>

        {/* Dots */}
        <div className="dots-bar" style={{ position:'absolute', bottom:20, left:'50%', transform:'translateX(-50%)', display:'flex', gap:6, zIndex:50 }}>
          {Array.from({length:TOTAL}).map((_,i) => (
            <div key={i} onClick={() => go(i)} style={{ width:cur===i?20:6, height:6, borderRadius:99, background:cur===i?'#ff0080':'rgba(255,255,255,0.2)', cursor:'pointer', transition:'all .3s' }} />
          ))}
        </div>

        {/* Ambient light */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', background:`radial-gradient(500px circle at ${mousePos.x*100}% ${mousePos.y*100}%, rgba(255,0,128,0.04), transparent 70%)`, transition:'background .1s' }} />

        {/* ─── SLIDE 1: Logo ─── */}
        {cur===0 && (
          <div key="s0" style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'center', padding: isMobile?'2rem 1.5rem':'3.5rem 5rem' }}>
            <div style={{ position:'absolute', top:'-20%', left:'-10%', width:'70vw', height:'70vw', background:'radial-gradient(circle,rgba(255,0,128,0.12) 0%,transparent 70%)', pointerEvents:'none', animation:'glow 4s ease-in-out infinite' }} />
            <div style={{ position:'absolute', bottom:'-20%', right:'-10%', width:'60vw', height:'60vw', background:'radial-gradient(circle,rgba(0,80,255,0.1) 0%,transparent 70%)', pointerEvents:'none', animation:'glow 5s ease-in-out infinite 1s' }} />
            <div className="split" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center', position:'relative', zIndex:1 }}>
              <div>
                <div className="fu0" style={{ marginBottom:24 }}>
                  <img src="/Growster-Favicon.png" alt="Growster" style={{ width:64, height:64, borderRadius:'50%', objectFit:'cover', border:'2px solid rgba(255,0,128,0.3)', boxShadow:'0 0 40px rgba(255,0,128,0.2)' }} />
                </div>
                <div className="fu1" style={{ fontSize: isMobile?44:76, fontWeight:900, letterSpacing:'-3px', lineHeight:1, marginBottom:10 }}>Growster<span style={{ color:'#ff0080' }}>.</span></div>
                <div className="fu2" style={{ fontSize:12, color:'rgba(255,255,255,0.35)', fontWeight:700, letterSpacing:'0.25em', textTransform:'uppercase', marginBottom:28 }}>Growth Marketing</div>
                <div className="fu3" style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ height:1, width:40, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.2))' }} />
                  <span style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase' }}>× Indian Startup School</span>
                </div>
                <div className="fu4" style={{ marginTop:20, fontSize:11, color:'rgba(255,255,255,0.18)', fontWeight:600 }}>A Growth Proposal · Confidential</div>
              </div>
              {!isMobile && (
                <div className="fu2" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  {[['50Cr+','Revenue generated'],['10M+','Influencer views'],['5x','Brand growth'],['30%','Avg CAC drop']].map(([v,l]) => (
                    <div key={l} className="card-h" style={{ ...card(), cursor:'default' }}>
                      <div style={{ fontSize:28, fontWeight:900, ...grad, marginBottom:4 }}>{v}</div>
                      <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em' }}>{l}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── SLIDE 2: About ─── */}
        {cur===1 && (
          <div key="s1" style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'center', padding: isMobile?'2rem 1.5rem':'3.5rem 5rem', overflowY:'auto' }}>
            <div style={{ position:'absolute', top:'-10%', right:'-5%', width:'50vw', height:'50vw', background:'radial-gradient(circle,rgba(0,80,255,0.08) 0%,transparent 70%)', pointerEvents:'none' }} />
            <div className="split" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:52, alignItems:'center', position:'relative', zIndex:1, maxWidth:1100 }}>
              <div>
                <div className="fu0">{pill('#ff0080','Who we are')}</div>
                <div className="fu1" style={{ fontSize: isMobile?24:36, fontWeight:900, letterSpacing:'-1px', lineHeight:1.15, marginBottom:12 }}>Not an agency.<br/><span style={grad}>A growth partner.</span></div>
                <div className="fu2" style={{ fontSize:13, color:'rgba(255,255,255,0.45)', lineHeight:1.8, marginBottom:20 }}>We operate as your internal marketing team — founder-led, brand-first, performance-aware. We push solutions that benefit you, not us.</div>
                <div className="fu3 three-col" style={{ display:'grid', gridTemplateColumns:'1fr', gap:10 }}>
                  {[
                    { label:'Growster Core', color:'#ff0080', title:'Social Media Marketing', desc:'Community, channel management, organic growth.' },
                    { label:'Growster Production', color:'#0050ff', title:'Content at Scale', desc:'Brand films, performance assets, BAU content.' },
                    { label:'Growster Growth', color:'#8b5cf6', title:'Performance Marketing', desc:'Media buying, paid social, acquisition campaigns.' },
                  ].map(c => (
                    <div key={c.label} className="card-h" style={{ ...card({ borderLeft:`3px solid ${c.color}` }), display:'flex', gap:12, alignItems:'center' }}>
                      <div>
                        <div style={{ fontSize:9, fontWeight:700, color:c.color, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:2 }}>{c.label}</div>
                        <div style={{ fontSize:12, fontWeight:800, color:'#fff' }}>{c.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {!isMobile && (
                <div className="fu2" style={{ perspective:800 }}>
                  <div style={{ transform:`rotateX(${camRot.x*0.3}deg) rotateY(${camRot.y*0.3}deg)`, transition:'transform .1s', transformStyle:'preserve-3d' }}>
                    <div style={{ background:'rgba(255,0,128,0.05)', border:'1px solid rgba(255,0,128,0.15)', borderRadius:24, padding:'2rem', textAlign:'center' }}>
                      <div style={{ fontSize:48, marginBottom:16, animation:'float 3s ease-in-out infinite' }}>🐹</div>
                      <div style={{ fontSize:18, fontWeight:900, color:'#fff', marginBottom:8 }}>Break free of the<br/><span style={grad}>Hamster Wheel.</span></div>
                      <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', lineHeight:1.7 }}>That's our tagline. And our promise — we help brands escape the loop of mediocre marketing.</div>
                      <div style={{ marginTop:16, padding:'8px 16px', borderRadius:99, background:'rgba(255,0,128,0.1)', border:'1px solid rgba(255,0,128,0.2)', fontSize:10, fontWeight:700, color:'#ff0080', textTransform:'uppercase', letterSpacing:'0.1em', display:'inline-block' }}>Move your mouse ↑</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── SLIDE 3: Vision ─── */}
        {cur===2 && (
          <div key="s2" style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'center', padding: isMobile?'2rem 1.5rem':'3.5rem 5rem' }}>
            <div style={{ position:'absolute', top:'-10%', left:'-10%', width:'60vw', height:'60vw', background:'radial-gradient(circle,rgba(255,0,128,0.1) 0%,transparent 70%)', pointerEvents:'none' }} />
            <div className="split" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:52, alignItems:'center', position:'relative', zIndex:1, maxWidth:1100 }}>
              <div>
                <div className="fu0">{pill('#a78bfa','Our vision for ISS')}</div>
                <div className="fu1" style={{ fontSize: isMobile?24:34, fontWeight:900, letterSpacing:'-1px', lineHeight:1.15, marginBottom:12 }}>Position Shivang as<br/><span style={grad}>the ecosystem's voice.</span></div>
                <div className="fu2" style={{ fontSize:13, color:'rgba(255,255,255,0.45)', lineHeight:1.8, marginBottom:20 }}>Make ISS the go-to place for founders to find their tribe and their calling. Shivang leads not just as a school head — but as the startup ecosystem's defining authority.</div>
                <div className="fu3 two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  {[
                    { n:'01', c:'#ff0080', t:'Cultural Relevance', d:'ISS content at the pulse of startup India — not behind it.' },
                    { n:'02', c:'#0050ff', t:'Hero Proximity', d:'Founders feel their heroes are at arm\'s reach through ISS.' },
                  ].map(i => (
                    <div key={i.n} className="card-h" style={card()}>
                      <div style={{ fontSize:24, fontWeight:900, color:i.c, marginBottom:4 }}>{i.n}</div>
                      <div style={{ fontSize:13, fontWeight:800, color:'#fff', marginBottom:4 }}>{i.t}</div>
                      <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', lineHeight:1.6 }}>{i.d}</div>
                    </div>
                  ))}
                </div>
              </div>
              {!isMobile && (
                <div className="fu2" style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  <div style={{ padding:'1.5rem', borderRadius:20, background:'rgba(139,92,246,0.06)', border:'1px solid rgba(139,92,246,0.2)', textAlign:'center' }}>
                    <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:12 }}>The North Star</div>
                    <div style={{ fontSize:36, fontWeight:900, ...grad, letterSpacing:'-1px', marginBottom:8 }}>ISS = Access</div>
                    <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', lineHeight:1.7 }}>Every founder who follows ISS should feel like they have a seat at the table — with investors, mentors, and operators who've done it.</div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    {[['Founders','Community'],['Investors','Network'],['Operators','Mentors'],['Startups','Ecosystem']].map(([v,l]) => (
                      <div key={v} className="card-h" style={{ ...card({ padding:'10px 14px' }), textAlign:'center', cursor:'default' }}>
                        <div style={{ fontSize:13, fontWeight:800, color:'#fff' }}>{v}</div>
                        <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:600 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── SLIDE 4: Content IPs — 3D Camera ─── */}
        {cur===3 && (
          <div key="s3" style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'center', padding: isMobile?'2rem 1.5rem':'3.5rem 5rem', overflowY:'auto' }}>
            <div style={{ position:'absolute', bottom:'-10%', right:'-5%', width:'50vw', height:'50vw', background:'radial-gradient(circle,rgba(245,158,11,0.07) 0%,transparent 70%)', pointerEvents:'none' }} />
            <div className="split" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:52, alignItems:'center', position:'relative', zIndex:1, maxWidth:1100 }}>
              <div>
                <div className="fu0">{pill('#fcd34d','Content IPs')}</div>
                <div className="fu1" style={{ fontSize: isMobile?22:30, fontWeight:900, letterSpacing:'-1px', lineHeight:1.15, marginBottom:16 }}>Recurring formats that<br/><span style={grad}>build a universe.</span></div>
                <div className="fu2" style={{ display:'grid', gap:10 }}>
                  {[
                    { icon:'🎬', c:'#ff0080', t:'Mockumentary Series', d:'Recurring characters, jokes on investors, veteran vs new founders. The Office meets startup India.' },
                    { icon:'💡', c:'#0050ff', t:'Tips, Audits & Huddles', d:'Real business audits, fire-side chats, and live huddles where ISS faculty solves founder problems on camera.' },
                    { icon:'🎙️', c:'#8b5cf6', t:'Podcasts & Event Coverage', d:'Full event documentation + podcast distribution. Every ISS moment becomes evergreen content.' },
                  ].map(item => (
                    <div key={item.t} className="card-h" style={{ ...card(), display:'flex', gap:12 }}>
                      <div style={{ width:38, height:38, borderRadius:10, background:`${item.c}15`, border:`1px solid ${item.c}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{item.icon}</div>
                      <div>
                        <div style={{ fontSize:12, fontWeight:800, color:'#fff', marginBottom:3 }}>{item.t}</div>
                        <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', lineHeight:1.6 }}>{item.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {!isMobile && (
                <div className="fu2" style={{ display:'flex', alignItems:'center', justifyContent:'center', perspective:1000 }}>
                  <div style={{ transform:`rotateX(${camRot.x*0.5}deg) rotateY(${camRot.y*0.5}deg)`, transition:'transform .08s', transformStyle:'preserve-3d', cursor:'none' }}>
                    {/* 3D Camera body */}
                    <div style={{ position:'relative', width:220, height:160 }}>
                      <div style={{ width:220, height:140, background:'linear-gradient(135deg,#1a1a2e,#2a2a4e)', border:'2px solid rgba(255,255,255,0.12)', borderRadius:16, position:'relative', overflow:'hidden', boxShadow:`0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)` }}>
                        {/* Lens */}
                        <div style={{ position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)', width:80, height:80, borderRadius:'50%', background:'radial-gradient(circle, #0a0a0f 30%, #1a1a3e 60%, #2a2a5e 100%)', border:'3px solid rgba(255,255,255,0.15)', boxShadow:`0 0 30px rgba(255,0,128,0.3), inset 0 0 20px rgba(0,80,255,0.3)` }}>
                          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:40, height:40, borderRadius:'50%', background:'radial-gradient(circle,rgba(0,80,255,0.4),rgba(255,0,128,0.2))', border:'1px solid rgba(255,255,255,0.1)' }} />
                          <div style={{ position:'absolute', top:8, left:8, width:10, height:6, borderRadius:99, background:'rgba(255,255,255,0.3)', transform:'rotate(-30deg)' }} />
                        </div>
                        {/* Top buttons */}
                        <div style={{ position:'absolute', top:8, right:16, display:'flex', gap:6 }}>
                          <div style={{ width:10, height:10, borderRadius:'50%', background:'#ff0080', boxShadow:'0 0 8px rgba(255,0,128,0.5)' }} />
                          <div style={{ width:10, height:10, borderRadius:'50%', background:'rgba(255,255,255,0.15)' }} />
                        </div>
                        {/* REC indicator */}
                        <div style={{ position:'absolute', top:10, left:12, fontSize:9, fontWeight:700, color:'#ff0080', letterSpacing:'0.1em', display:'flex', alignItems:'center', gap:4 }}>
                          <div style={{ width:6, height:6, borderRadius:'50%', background:'#ff0080', animation:'glow 1s ease-in-out infinite' }} />
                          REC
                        </div>
                        {/* Bottom strip */}
                        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:28, background:'rgba(0,0,0,0.4)', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', padding:'0 12px', gap:8 }}>
                          <div style={{ fontSize:9, color:'rgba(255,255,255,0.4)', fontFamily:'monospace' }}>ISS × GROWSTER</div>
                          <div style={{ marginLeft:'auto', fontSize:9, color:'rgba(255,0,128,0.7)', fontFamily:'monospace' }}>4K</div>
                        </div>
                      </div>
                      {/* Hot shoe */}
                      <div style={{ position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)', width:60, height:10, background:'#1a1a2e', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'4px 4px 0 0' }} />
                    </div>
                    <div style={{ textAlign:'center', marginTop:16, fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:600 }}>Move your cursor to rotate ↑</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── SLIDE 5: Signature IPs — Chai Pe Funding interactive ─── */}
        {cur===4 && (
          <div key="s4" style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'center', padding: isMobile?'2rem 1.5rem':'3.5rem 5rem' }}>
            <div style={{ position:'absolute', top:'-10%', right:'-5%', width:'55vw', height:'55vw', background:'radial-gradient(circle,rgba(255,0,128,0.1) 0%,transparent 70%)', pointerEvents:'none' }} />
            <div className="split" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'center', position:'relative', zIndex:1, maxWidth:1100 }}>
              <div>
                <div className="fu0">{pill('#ff0080','Signature IPs')}</div>
                <div className="fu1" style={{ fontSize: isMobile?22:30, fontWeight:900, letterSpacing:'-1px', lineHeight:1.15, marginBottom:16 }}>Two formats that become<br/><span style={grad}>unmissable.</span></div>
                <div className="fu2 two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  <div className="card-h" style={{ ...card({ border:'1px solid rgba(255,0,128,0.25)', background:'rgba(255,0,128,0.04)' }) }}>
                    <div style={{ fontSize:10, fontWeight:700, color:'#ff0080', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:8 }}>🍵 Chai Pe Funding</div>
                    <div style={{ fontSize:16, fontWeight:900, color:'#fff', lineHeight:1.25, marginBottom:8 }}>Pitch before<br/>the tea boils.</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)', lineHeight:1.7, marginBottom:10 }}>A founder walks into the ISS tea stall. They pitch. The clock is the kettle. Shivang decides to invest when tea is ready.</div>
                    <div style={{ fontSize:10, color:'rgba(255,0,128,0.6)', fontWeight:700, padding:'3px 8px', borderRadius:99, background:'rgba(255,0,128,0.08)', border:'1px solid rgba(255,0,128,0.2)', display:'inline-block' }}>Think: Pickle & Pitch</div>
                  </div>
                  <div className="card-h" style={{ ...card({ border:'1px solid rgba(0,80,255,0.25)', background:'rgba(0,80,255,0.04)' }) }}>
                    <div style={{ fontSize:10, fontWeight:700, color:'#60a5fa', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:8 }}>🎙️ State of Ecosystem</div>
                    <div style={{ fontSize:16, fontWeight:900, color:'#fff', lineHeight:1.25, marginBottom:8 }}>Shivang's podcast<br/>on what's next.</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)', lineHeight:1.7, marginBottom:10 }}>Industries, opportunities, where India is lacking. Founders get a unique edge before they even start.</div>
                    <div style={{ fontSize:10, color:'rgba(0,80,255,0.7)', fontWeight:700, padding:'3px 8px', borderRadius:99, background:'rgba(0,80,255,0.1)', border:'1px solid rgba(0,80,255,0.2)', display:'inline-block' }}>Think: Tim Ferriss × India</div>
                  </div>
                </div>
              </div>
              {!isMobile && (
                <div className="fu2" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
                  {/* Interactive kettle */}
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:12 }}>Try it — start pitching</div>
                    <div style={{ position:'relative', display:'inline-block', marginBottom:16 }}>
                      <div style={{ fontSize:72, lineHeight:1, filter: teaProgress>50?'drop-shadow(0 0 16px rgba(245,158,11,0.6))':'none', transition:'filter .3s' }}>🫖</div>
                      {teaBoiling && teaProgress < 100 && [0,1,2].map(i => (
                        <div key={i} style={{ position:'absolute', bottom:'100%', left:`${30+i*15}%`, width:4, height:12, borderRadius:99, background:'rgba(255,255,255,0.3)', animation:`steam ${.8+i*.2}s ease-out ${i*.15}s infinite` }} />
                      ))}
                    </div>
                    <div style={{ width:200, height:8, background:'rgba(255,255,255,0.06)', borderRadius:99, margin:'0 auto 12px', overflow:'hidden', border:'1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ height:'100%', width:`${teaProgress}%`, borderRadius:99, background: teaProgress<50?'linear-gradient(90deg,#f59e0b,#ef9f27)':'linear-gradient(90deg,#ef4444,#dc2626)', transition:'width .1s, background .5s' }} />
                    </div>
                    <div style={{ fontSize:12, fontWeight:700, color: teaProgress>=100?'#ef4444':teaProgress>50?'#f59e0b':'rgba(255,255,255,0.4)', marginBottom:14, transition:'color .3s' }}>
                      {teaProgress>=100?'Tea is ready — time\'s up! ☕':teaProgress>0?`${Math.round(teaProgress)}% boiled...`:'Tea is cold. Ready to pitch?'}
                    </div>
                    <div style={{ display:'flex', gap:8, justifyContent:'center' }}>
                      <button onClick={startTea} disabled={teaBoiling} style={{ padding:'8px 18px', borderRadius:99, border:'none', background:'linear-gradient(135deg,#f59e0b,#d97706)', color:'#fff', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'inherit', opacity:teaBoiling?0.5:1 }}>
                        {teaBoiling?'Boiling...':'Start Pitching →'}
                      </button>
                      <button onClick={resetTea} style={{ padding:'8px 14px', borderRadius:99, border:'1px solid rgba(255,255,255,0.12)', background:'transparent', color:'rgba(255,255,255,0.5)', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>Reset</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── SLIDE 6: What we propose ─── */}
        {cur===5 && (
          <div key="s5" style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'center', padding: isMobile?'2rem 1.5rem':'3.5rem 5rem', overflowY:'auto' }}>
            <div style={{ position:'absolute', bottom:'-10%', left:'-5%', width:'50vw', height:'50vw', background:'radial-gradient(circle,rgba(0,80,255,0.1) 0%,transparent 70%)', pointerEvents:'none' }} />
            <div className="split" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:52, alignItems:'center', position:'relative', zIndex:1, maxWidth:1100 }}>
              <div>
                <div className="fu0">{pill('#34d399','What we propose')}</div>
                <div className="fu1" style={{ fontSize: isMobile?22:30, fontWeight:900, letterSpacing:'-1px', lineHeight:1.15, marginBottom:16 }}>A full mandate.<br/><span style={grad}>Four pillars.</span></div>
                <div className="fu2 two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  {[
                    { n:'01', c:'#ff0080', t:'Social Media', d:'We take over ISS accounts — strategy, content, community, cultural pulse.' },
                    { n:'02', c:'#0050ff', t:'Performance', d:'Generate cohort leads and increase brand lift through paid social.' },
                    { n:'03', c:'#8b5cf6', t:'Brand Film', d:'A cinematic 90-second film for websites, e-brochures, and social.' },
                    { n:'04', c:'#10b981', t:'BAU + IP Shoots', d:'Earmarked shoot dates to bulk produce all content needed to scale.' },
                  ].map(i => (
                    <div key={i.n} className="card-h" style={card()}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                        <div style={{ fontSize:10, fontWeight:700, color:i.c, textTransform:'uppercase', letterSpacing:'0.1em' }}>{i.n}</div>
                        <div style={{ height:1, flex:1, background:`${i.c}25` }} />
                      </div>
                      <div style={{ fontSize:13, fontWeight:800, color:'#fff', marginBottom:4 }}>{i.t}</div>
                      <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', lineHeight:1.6 }}>{i.d}</div>
                    </div>
                  ))}
                </div>
              </div>
              {!isMobile && (
                <div className="fu2">
                  <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:14 }}>Delivery Timeline</div>
                  <div style={{ position:'relative', paddingLeft:24 }}>
                    <div style={{ position:'absolute', left:8, top:6, bottom:6, width:1, background:'rgba(255,255,255,0.08)' }} />
                    {[
                      { w:'Week 1', l:'Strategy & Onboarding', c:'#ff0080' },
                      { w:'Week 2', l:'Brand Film Production', c:'#0050ff' },
                      { w:'Week 3', l:'Social Takeover Begins', c:'#8b5cf6' },
                      { w:'Week 4', l:'Performance Launch', c:'#10b981' },
                      { w:'Month 2', l:'IPs Go Live', c:'#f59e0b' },
                      { w:'Month 3', l:'Scale & Optimise', c:'#06b6d4' },
                    ].map(t => (
                      <div key={t.w} style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:14, position:'relative' }}>
                        <div style={{ width:12, height:12, borderRadius:'50%', background:t.c, flexShrink:0, marginTop:3, boxShadow:`0 0 8px ${t.c}60` }} />
                        <div>
                          <div style={{ fontSize:9, fontWeight:700, color:t.c, textTransform:'uppercase', letterSpacing:'0.1em' }}>{t.w}</div>
                          <div style={{ fontSize:12, color:'rgba(255,255,255,0.55)', fontWeight:600 }}>{t.l}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── SLIDE 7: Why Growster — client thumbnails ─── */}
        {cur===6 && (
          <div key="s6" style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'center', padding: isMobile?'2rem 1.5rem':'3.5rem 5rem' }}>
            <div style={{ position:'absolute', top:'-10%', right:'-5%', width:'60vw', height:'60vw', background:'radial-gradient(circle,rgba(255,0,128,0.1) 0%,transparent 70%)', pointerEvents:'none' }} />
            <div className="split" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:52, alignItems:'center', position:'relative', zIndex:1, maxWidth:1100 }}>
              <div>
                <div className="fu0">{pill('#ff0080','Why Growster')}</div>
                <div className="fu1" style={{ fontSize: isMobile?24:34, fontWeight:900, letterSpacing:'-1px', lineHeight:1.15, marginBottom:12 }}>We don't take<br/><span style={grad}>every client.</span></div>
                <div className="fu2" style={{ display:'grid', gap:10, marginBottom:16 }}>
                  {[
                    { c:'#ff0080', t:'50 Cr+ revenue generated for clients in a single quarter' },
                    { c:'#ff0080', t:'Snitch, Virgio, RWDY, Skyhigh India, Ugees, Kalamandir' },
                    { c:'#0050ff', t:'We operate as your internal team — founder-led, obsessed' },
                    { c:'#0050ff', t:'We understand the startup ecosystem — this is a cause to us' },
                    { c:'#8b5cf6', t:'Non-conformist, agile, allergic to cookie-cutter retainers' },
                  ].map((item, i) => (
                    <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                      <div style={{ width:5, height:5, borderRadius:'50%', background:item.c, marginTop:6, flexShrink:0 }} />
                      <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)', lineHeight:1.7 }}>{item.t}</div>
                    </div>
                  ))}
                </div>
                <div className="fu3" style={{ padding:'14px 18px', borderRadius:14, background:'rgba(255,0,128,0.05)', border:'1px solid rgba(255,0,128,0.2)', fontSize:12, color:'rgba(255,255,255,0.6)', fontStyle:'italic', lineHeight:1.7 }}>
                  "Marketing agencies are dead. We are brand partners."
                </div>
              </div>
              {!isMobile && (
                <div className="fu2" style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>Our work speaks</div>
                  {CLIENTS.map(c => (
                    <div key={c.name}
                      onMouseEnter={() => setHoveredClient(c.name)}
                      onMouseLeave={() => setHoveredClient(null)}
                      style={{ position:'relative', borderRadius:16, overflow:'hidden', border:`1px solid ${hoveredClient===c.name?c.color+'50':'rgba(255,255,255,0.07)'}`, cursor:'default', transition:'all .3s', height: hoveredClient===c.name ? 120 : 60 }}>
                      <img src={c.img} alt={c.name} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center', display:'block', transition:'all .3s' }} />
                      <div style={{ position:'absolute', inset:0, background:`linear-gradient(90deg,rgba(5,5,8,0.8) 0%,rgba(5,5,8,0.3) 100%)` }} />
                      <div style={{ position:'absolute', bottom:10, left:14, display:'flex', alignItems:'center', gap:8 }}>
                        <span style={{ fontSize:13, fontWeight:800, color:'#fff' }}>{c.name}</span>
                        <span style={{ fontSize:9, padding:'2px 8px', borderRadius:99, background:`${c.color}20`, color:c.color, fontWeight:700, border:`1px solid ${c.color}30` }}>{c.tag}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── SLIDE 8: Close ─── */}
        {cur===7 && (
          <div key="s7" style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'center', padding: isMobile?'2rem 1.5rem':'3.5rem 5rem' }}>
            <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'80vw', height:'80vw', background:'radial-gradient(circle,rgba(255,0,128,0.07) 0%,transparent 70%)', pointerEvents:'none' }} />
            <div className="split" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center', position:'relative', zIndex:1, maxWidth:1100 }}>
              <div>
                <div className="fu0" style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.25)', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:20 }}>We don't take every client.</div>
                <div className="fu1" style={{ fontSize: isMobile?32:56, fontWeight:900, letterSpacing:'-2px', lineHeight:1.1, marginBottom:14 }}>Let's build<br/><span style={grad}>something real.</span></div>
                <div className="fu2" style={{ fontSize:14, color:'rgba(255,255,255,0.4)', lineHeight:1.8, maxWidth:440, marginBottom:32 }}>
                  If ISS is serious about owning the startup ecosystem's cultural conversation — we're the team that makes it happen.
                </div>
                <div className="fu3" style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                  <a href="mailto:harshit@growster.in" style={{ padding:'12px 24px', borderRadius:99, border:'none', background:'linear-gradient(135deg,#ff0080,#cc0055)', color:'#fff', fontSize:13, fontWeight:700, textDecoration:'none', boxShadow:'0 0 28px rgba(255,0,128,0.3)' }}>harshit@growster.in →</a>
                  <a href="tel:+917017251443" style={{ padding:'12px 24px', borderRadius:99, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.6)', fontSize:13, fontWeight:700, textDecoration:'none' }}>+91 70172 51443</a>
                </div>
                <div className="fu4" style={{ marginTop:24, fontSize:11, color:'rgba(255,255,255,0.15)' }}>growster.in · Confidential</div>
              </div>
              {!isMobile && (
                <div className="fu2" style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  <div style={{ padding:'1.5rem', borderRadius:20, background:'rgba(255,0,128,0.05)', border:'1px solid rgba(255,0,128,0.15)' }}>
                    <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:12 }}>What happens next</div>
                    {[
                      { n:'01', t:'Discovery call with Shivang' },
                      { n:'02', t:'2-week pilot content sprint' },
                      { n:'03', t:'Full mandate kickoff' },
                    ].map(s => (
                      <div key={s.n} style={{ display:'flex', gap:12, alignItems:'center', marginBottom:12 }}>
                        <div style={{ width:28, height:28, borderRadius:'50%', background:'rgba(255,0,128,0.12)', border:'1px solid rgba(255,0,128,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, color:'#ff0080', flexShrink:0 }}>{s.n}</div>
                        <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)', fontWeight:600 }}>{s.t}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding:'1rem', borderRadius:16, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', gap:12 }}>
                    <img src="/Growster-Favicon.png" alt="" style={{ width:36, height:36, borderRadius:'50%', objectFit:'cover' }} />
                    <div>
                      <div style={{ fontSize:12, fontWeight:800, color:'#fff' }}>Harshit Arora</div>
                      <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)' }}>Founder, Growster</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </>
  )
}
