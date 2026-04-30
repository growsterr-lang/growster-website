import Head from 'next/head'
import { useState, useEffect } from 'react'

const SLIDES = [
  { id: 'logo' },
  { id: 'about' },
  { id: 'vision' },
  { id: 'ips' },
  { id: 'signature' },
  { id: 'propose' },
  { id: 'why' },
  { id: 'close' },
]

export default function ISSProposal() {
  const [cur, setCur] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640)
    onResize()
    window.addEventListener('resize', onResize)
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setCur(c => Math.min(c+1, SLIDES.length-1))
      if (e.key === 'ArrowLeft') setCur(c => Math.max(c-1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  const go = (n: number) => setCur(Math.max(0, Math.min(SLIDES.length-1, n)))

  const s: any = {
    slide: { position:'absolute' as const, inset:0, display:'flex', flexDirection:'column' as const, justifyContent:'center', padding: isMobile ? '2rem 1.5rem' : '3.5rem 4rem', transition:'all 0.5s cubic-bezier(0.16,1,0.3,1)', zIndex:1 },
    pill: { display:'inline-block', padding:'4px 14px', borderRadius:99, fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase' as const, marginBottom:16 },
    h1: { fontSize: isMobile ? 28 : 44, fontWeight:900, letterSpacing:'-1.5px', lineHeight:1.1, marginBottom:14, color:'#fff' },
    h2: { fontSize: isMobile ? 22 : 32, fontWeight:900, letterSpacing:'-1px', lineHeight:1.15, marginBottom:14, color:'#fff' },
    body: { fontSize:13, color:'rgba(255,255,255,0.45)', lineHeight:1.8, marginBottom:20 },
    card: { background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding: isMobile ? '1rem' : '1.25rem' },
    grad: { background:'linear-gradient(135deg,#ff0080,#0050ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' as const },
  }

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
          @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
          @keyframes glow{0%,100%{opacity:0.5}50%{opacity:1}}
          .fade-up{animation:fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both}
          .fade-up-1{animation:fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both}
          .fade-up-2{animation:fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s both}
          .fade-up-3{animation:fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.3s both}
          .fade-up-4{animation:fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.4s both}
          .card-hover{transition:all 0.25s ease}
          .card-hover:hover{transform:translateY(-3px);border-color:rgba(255,255,255,0.15) !important}
          @media print{
            nav,.nav-bar{display:none !important}
            body,html{overflow:visible !important;height:auto !important}
            .slide-wrap{position:relative !important;height:100vh !important;page-break-after:always}
            .slide-container{position:relative !important;height:100vh}
          }
          @media(max-width:640px){
            .two-col{grid-template-columns:1fr !important}
            .three-col{grid-template-columns:1fr !important}
          }
        `}</style>
      </Head>

      {/* Top nav */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, height:52, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 1.5rem', background:'rgba(5,5,8,0.9)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <img src="/Growster-Favicon.png" alt="Growster" style={{ height:24, width:24, objectFit:'contain' }} />
          <span style={{ fontSize:14, fontWeight:900, letterSpacing:'-0.5px' }}>Growster<span style={{ color:'#ff0080' }}>.</span></span>
          <span style={{ fontSize:12, color:'rgba(255,255,255,0.25)', margin:'0 6px' }}>×</span>
          <span style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.5)' }}>Indian Startup School</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:600 }}>{cur+1} / {SLIDES.length}</span>
          <button onClick={() => go(cur-1)} disabled={cur===0}
            style={{ padding:'5px 12px', borderRadius:99, border:'1px solid rgba(255,255,255,0.12)', background:'transparent', color:'rgba(255,255,255,0.5)', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'inherit', opacity:cur===0?0.3:1 }}>←</button>
          <button onClick={() => go(cur+1)} disabled={cur===SLIDES.length-1}
            style={{ padding:'5px 12px', borderRadius:99, border:'1px solid rgba(255,255,255,0.12)', background:'transparent', color:'rgba(255,255,255,0.5)', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'inherit', opacity:cur===SLIDES.length-1?0.3:1 }}>→</button>
          <button onClick={() => window.print()}
            style={{ padding:'5px 14px', borderRadius:99, border:'none', background:'linear-gradient(135deg,#ff0080,#cc0055)', color:'#fff', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>↓ PDF</button>
        </div>
      </nav>

      {/* Slide container */}
      <div style={{ position:'fixed', top:52, left:0, right:0, bottom:0, overflow:'hidden' }}>

        {/* Slide dots */}
        <div style={{ position:'absolute', bottom:20, left:'50%', transform:'translateX(-50%)', display:'flex', gap:6, zIndex:50 }}>
          {SLIDES.map((_, i) => (
            <div key={i} onClick={() => go(i)}
              style={{ width: cur===i ? 20 : 6, height:6, borderRadius:99, background: cur===i ? '#ff0080' : 'rgba(255,255,255,0.2)', cursor:'pointer', transition:'all 0.3s' }} />
          ))}
        </div>

        {/* SLIDE 1 — Logo */}
        {cur === 0 && (
          <div key="logo" style={{ ...s.slide }}>
            <div style={{ position:'absolute', top:'-20%', left:'-10%', width:'70vw', height:'70vw', background:'radial-gradient(circle,rgba(255,0,128,0.13) 0%,transparent 70%)', pointerEvents:'none', animation:'glow 4s ease-in-out infinite' }} />
            <div style={{ position:'absolute', bottom:'-20%', right:'-10%', width:'60vw', height:'60vw', background:'radial-gradient(circle,rgba(0,80,255,0.1) 0%,transparent 70%)', pointerEvents:'none', animation:'glow 5s ease-in-out infinite 1s' }} />
            <div style={{ textAlign:'center', position:'relative', zIndex:1 }}>
              <div className="fade-up" style={{ marginBottom:24 }}>
                <img src="/Growster-Favicon.png" alt="Growster" style={{ width:72, height:72, borderRadius:'50%', objectFit:'cover', border:'2px solid rgba(255,0,128,0.3)', boxShadow:'0 0 40px rgba(255,0,128,0.2)' }} />
              </div>
              <div className="fade-up-1" style={{ fontSize: isMobile ? 48 : 80, fontWeight:900, letterSpacing:'-3px', lineHeight:1, marginBottom:10 }}>
                Growster<span style={{ color:'#ff0080' }}>.</span>
              </div>
              <div className="fade-up-2" style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700, letterSpacing:'0.25em', textTransform:'uppercase', marginBottom:36 }}>Growth Marketing</div>
              <div className="fade-up-3" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16 }}>
                <div style={{ height:1, width:60, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.2))' }} />
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.3)', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase' }}>× Indian Startup School</span>
                <div style={{ height:1, width:60, background:'linear-gradient(90deg,rgba(255,255,255,0.2),transparent)' }} />
              </div>
              <div className="fade-up-4" style={{ marginTop:32, fontSize:12, color:'rgba(255,255,255,0.2)', fontWeight:600 }}>A Growth Proposal · Confidential</div>
            </div>
          </div>
        )}

        {/* SLIDE 2 — About Growster */}
        {cur === 1 && (
          <div key="about" style={{ ...s.slide, overflowY:'auto' }}>
            <div style={{ position:'absolute', top:'-10%', right:'-5%', width:'50vw', height:'50vw', background:'radial-gradient(circle,rgba(0,80,255,0.08) 0%,transparent 70%)', pointerEvents:'none' }} />
            <div style={{ position:'relative', zIndex:1, maxWidth:900 }}>
              <div className="fade-up" style={{ ...s.pill, background:'rgba(255,0,128,0.1)', color:'#ff0080', border:'1px solid rgba(255,0,128,0.2)' }}>Who we are</div>
              <h2 className="fade-up-1" style={s.h2}>Not an agency.<br/><span style={s.grad}>A growth partner.</span></h2>
              <p className="fade-up-2" style={{ ...s.body, maxWidth:560 }}>We operate as your internal marketing team — founder-led, brand-first, performance-aware. We push solutions that benefit you, not us.</p>
              <div className="three-col fade-up-3" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
                {[
                  { label:'Growster Core', color:'#ff0080', title:'Social Media Marketing', desc:'Community, channel management, and organic growth that compounds over time.' },
                  { label:'Growster Production', color:'#0050ff', title:'Content at Scale', desc:'Brand films, performance assets, and BAU content built for fatigue-proof advertising.' },
                  { label:'Growster Growth', color:'#8b5cf6', title:'Performance Marketing', desc:'Media buying, paid social, and campaigns engineered for acquisition and brand lift.' },
                ].map(c => (
                  <div key={c.label} className="card-hover" style={{ ...s.card, borderTop:`2px solid ${c.color}` }}>
                    <div style={{ fontSize:10, fontWeight:700, color:c.color, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>{c.label}</div>
                    <div style={{ fontSize:13, fontWeight:800, color:'#fff', marginBottom:6 }}>{c.title}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', lineHeight:1.65 }}>{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 3 — Vision for ISS */}
        {cur === 2 && (
          <div key="vision" style={{ ...s.slide }}>
            <div style={{ position:'absolute', top:'-10%', left:'-10%', width:'60vw', height:'60vw', background:'radial-gradient(circle,rgba(255,0,128,0.1) 0%,transparent 70%)', pointerEvents:'none' }} />
            <div style={{ position:'relative', zIndex:1, maxWidth:860 }}>
              <div className="fade-up" style={{ ...s.pill, background:'rgba(139,92,246,0.1)', color:'#a78bfa', border:'1px solid rgba(139,92,246,0.2)' }}>Our vision for ISS</div>
              <h2 className="fade-up-1" style={s.h2}>Position Shivang as<br/><span style={s.grad}>the ecosystem's voice.</span></h2>
              <p className="fade-up-2" style={{ ...s.body, maxWidth:580 }}>Make ISS the go-to place for founders to find their tribe, their calling, and their edge. Shivang leads as the domain expert — not just a school head, but the startup ecosystem's defining authority.</p>
              <div className="two-col fade-up-3" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {[
                  { num:'01', color:'#ff0080', title:'Cultural Relevance', desc:'ISS content should feel like it\'s at the pulse of what startup India is talking about — not behind it. We own the conversation.' },
                  { num:'02', color:'#0050ff', title:'Hero Proximity', desc:'Make founders feel their heroes are at arm\'s reach. ISS = access to the ecosystem\'s best minds, directly and authentically.' },
                ].map(c => (
                  <div key={c.num} className="card-hover" style={s.card}>
                    <div style={{ fontSize:28, fontWeight:900, color:c.color, marginBottom:6 }}>{c.num}</div>
                    <div style={{ fontSize:14, fontWeight:800, color:'#fff', marginBottom:6 }}>{c.title}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)', lineHeight:1.7 }}>{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 4 — Content IPs */}
        {cur === 3 && (
          <div key="ips" style={{ ...s.slide, overflowY:'auto' }}>
            <div style={{ position:'absolute', bottom:'-10%', right:'-5%', width:'50vw', height:'50vw', background:'radial-gradient(circle,rgba(245,158,11,0.07) 0%,transparent 70%)', pointerEvents:'none' }} />
            <div style={{ position:'relative', zIndex:1, maxWidth:900 }}>
              <div className="fade-up" style={{ ...s.pill, background:'rgba(245,158,11,0.1)', color:'#fcd34d', border:'1px solid rgba(245,158,11,0.2)' }}>Content IPs</div>
              <h2 className="fade-up-1" style={s.h2}>Recurring formats that<br/><span style={s.grad}>build a universe.</span></h2>
              <div className="fade-up-2" style={{ display:'grid', gap:10 }}>
                {[
                  { icon:'🎬', color:'#ff0080', title:'Mockumentary Series', desc:'Recurring characters. Jokes on what investors say, new vs veteran founders, ecosystem debates. Think The Office meets startup India — culture-first, deeply relatable.' },
                  { icon:'💡', color:'#0050ff', title:'Tips, Audits & Huddles', desc:'Real business audits, quick fire-side chats, and live huddles where founders describe a problem and ISS faculty finds solutions in real time. Actual value, on camera.' },
                  { icon:'🎙️', color:'#8b5cf6', title:'Podcasts & Event Coverage', desc:'Full event documentation and podcast distribution. Every ISS moment becomes evergreen content. Every speaker becomes a reason to follow.' },
                ].map(c => (
                  <div key={c.title} className="card-hover" style={{ ...s.card, display:'flex', gap:14, alignItems:'flex-start' }}>
                    <div style={{ width:40, height:40, borderRadius:12, background:`${c.color}15`, border:`1px solid ${c.color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{c.icon}</div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:800, color:'#fff', marginBottom:4 }}>{c.title}</div>
                      <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)', lineHeight:1.7 }}>{c.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 5 — Signature IPs */}
        {cur === 4 && (
          <div key="signature" style={{ ...s.slide }}>
            <div style={{ position:'absolute', top:'-10%', right:'-5%', width:'55vw', height:'55vw', background:'radial-gradient(circle,rgba(255,0,128,0.1) 0%,transparent 70%)', pointerEvents:'none' }} />
            <div style={{ position:'relative', zIndex:1, maxWidth:900 }}>
              <div className="fade-up" style={{ ...s.pill, background:'rgba(255,0,128,0.1)', color:'#ff0080', border:'1px solid rgba(255,0,128,0.2)' }}>Signature IPs</div>
              <h2 className="fade-up-1" style={s.h2}>Two formats that become<br/><span style={s.grad}>unmissable.</span></h2>
              <div className="two-col fade-up-2" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                <div className="card-hover" style={{ ...s.card, border:'1px solid rgba(255,0,128,0.25)', background:'rgba(255,0,128,0.04)' }}>
                  <div style={{ fontSize:10, fontWeight:700, color:'#ff0080', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:10 }}>🍵 Chai Pe Funding</div>
                  <div style={{ fontSize: isMobile ? 16 : 20, fontWeight:900, color:'#fff', lineHeight:1.25, marginBottom:12 }}>Pitch before<br/>the tea boils.</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', lineHeight:1.75, marginBottom:14 }}>A founder walks into the ISS tea stall. They pitch. The clock is the kettle — when the tea boils, time's up. Shivang decides to invest or not. Quick gratification, mass entertainment, deeply shareable.</div>
                  <div style={{ fontSize:10, color:'rgba(255,0,128,0.6)', fontWeight:700, padding:'4px 10px', borderRadius:99, background:'rgba(255,0,128,0.08)', display:'inline-block' }}>Think: Pickle & Pitch format</div>
                </div>
                <div className="card-hover" style={{ ...s.card, border:'1px solid rgba(0,80,255,0.25)', background:'rgba(0,80,255,0.04)' }}>
                  <div style={{ fontSize:10, fontWeight:700, color:'#60a5fa', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:10 }}>🎙️ State of the Ecosystem</div>
                  <div style={{ fontSize: isMobile ? 16 : 20, fontWeight:900, color:'#fff', lineHeight:1.25, marginBottom:12 }}>Shivang's podcast<br/>on what's next.</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', lineHeight:1.75, marginBottom:14 }}>Industries, opportunities, and where India is lacking. Founders get a unique edge before they even start. Shivang as the oracle every founder — and investor — listens to each week.</div>
                  <div style={{ fontSize:10, color:'rgba(0,80,255,0.7)', fontWeight:700, padding:'4px 10px', borderRadius:99, background:'rgba(0,80,255,0.1)', display:'inline-block' }}>Think: Tim Ferriss meets startup India</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 6 — What we propose */}
        {cur === 5 && (
          <div key="propose" style={{ ...s.slide, overflowY:'auto' }}>
            <div style={{ position:'absolute', bottom:'-10%', left:'-5%', width:'50vw', height:'50vw', background:'radial-gradient(circle,rgba(0,80,255,0.1) 0%,transparent 70%)', pointerEvents:'none' }} />
            <div style={{ position:'relative', zIndex:1, maxWidth:900 }}>
              <div className="fade-up" style={{ ...s.pill, background:'rgba(16,185,129,0.1)', color:'#34d399', border:'1px solid rgba(16,185,129,0.2)' }}>What we propose</div>
              <h2 className="fade-up-1" style={s.h2}>A full mandate.<br/><span style={s.grad}>Four pillars.</span></h2>
              <div className="two-col fade-up-2" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {[
                  { num:'01', color:'#ff0080', title:'Social Media Management', desc:'We take over ISS accounts and make them grab the cultural pulse of the org. Strategy, content calendar, community management, growth.' },
                  { num:'02', color:'#0050ff', title:'Performance Marketing', desc:'Generate leads for cohorts, increase brand lift nationwide. Paid social, media buying, and retargeting — all engineered for enrollment.' },
                  { num:'03', color:'#8b5cf6', title:'Brand Film', desc:'A cinematic 90-second brand film for e-brochures, websites, and social. What ISS is — told in a way that makes founders want in.' },
                  { num:'04', color:'#10b981', title:'BAU + IP Shoot Days', desc:'Earmarked shoot dates. Bulk produce all BAU content and recurring IP formats needed to scale the ISS content engine consistently.' },
                ].map(c => (
                  <div key={c.num} className="card-hover" style={s.card}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                      <div style={{ fontSize:11, fontWeight:700, color:c.color, textTransform:'uppercase', letterSpacing:'0.1em' }}>{c.num}</div>
                      <div style={{ height:1, flex:1, background:`${c.color}30` }} />
                    </div>
                    <div style={{ fontSize:14, fontWeight:800, color:'#fff', marginBottom:6 }}>{c.title}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)', lineHeight:1.7 }}>{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 7 — Why Growster */}
        {cur === 6 && (
          <div key="why" style={{ ...s.slide }}>
            <div style={{ position:'absolute', top:'-10%', right:'-5%', width:'60vw', height:'60vw', background:'radial-gradient(circle,rgba(255,0,128,0.1) 0%,transparent 70%)', pointerEvents:'none' }} />
            <div style={{ position:'relative', zIndex:1, maxWidth:800 }}>
              <div className="fade-up" style={{ ...s.pill, background:'rgba(255,0,128,0.1)', color:'#ff0080', border:'1px solid rgba(255,0,128,0.2)' }}>Why Growster</div>
              <h2 className="fade-up-1" style={s.h2}>We don't take<br/><span style={s.grad}>every client.</span></h2>
              <div className="fade-up-2" style={{ display:'grid', gap:10, maxWidth:580, marginBottom:24 }}>
                {[
                  { c:'#ff0080', t:'50 Cr+ revenue generated for clients in a single quarter' },
                  { c:'#ff0080', t:'Snitch, Virgio, RWDY, Skyhigh India, Ugees, Kalamandir — brands that needed real partners' },
                  { c:'#0050ff', t:'We operate as your internal team — founder-led, obsessed with your growth' },
                  { c:'#0050ff', t:'We understand the startup ecosystem — this is a cause, not just a client' },
                  { c:'#8b5cf6', t:'Non-conformist, agile, and allergic to cookie-cutter retainers' },
                ].map((item, i) => (
                  <div key={i} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                    <div style={{ width:5, height:5, borderRadius:'50%', background:item.c, marginTop:7, flexShrink:0 }} />
                    <div style={{ fontSize:13, color:'rgba(255,255,255,0.65)', lineHeight:1.7 }}>{item.t}</div>
                  </div>
                ))}
              </div>
              <div className="fade-up-3" style={{ padding:'16px 20px', borderRadius:14, background:'rgba(255,0,128,0.05)', border:'1px solid rgba(255,0,128,0.2)', maxWidth:520, fontSize:13, color:'rgba(255,255,255,0.65)', fontStyle:'italic', lineHeight:1.7 }}>
                "Marketing agencies are dead. We are brand partners. We push solutions that benefit you — not us."
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 8 — Close */}
        {cur === 7 && (
          <div key="close" style={{ ...s.slide }}>
            <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'80vw', height:'80vw', background:'radial-gradient(circle,rgba(255,0,128,0.08) 0%,transparent 70%)', pointerEvents:'none' }} />
            <div style={{ position:'relative', zIndex:1, textAlign:'center' }}>
              <div className="fade-up" style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.25)', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:20 }}>We don't take every client.</div>
              <h1 className="fade-up-1" style={{ ...s.h1, fontSize: isMobile ? 36 : 64, letterSpacing:'-2px', marginBottom:14 }}>
                Let's build<br/><span style={s.grad}>something real.</span>
              </h1>
              <p className="fade-up-2" style={{ fontSize:14, color:'rgba(255,255,255,0.4)', lineHeight:1.8, maxWidth:500, margin:'0 auto 36px' }}>
                If ISS is serious about owning the startup ecosystem's cultural conversation — we're the team that makes it happen.
              </p>
              <div className="fade-up-3" style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
                <a href="mailto:harshit@growster.in"
                  style={{ padding:'13px 28px', borderRadius:99, border:'none', background:'linear-gradient(135deg,#ff0080,#cc0055)', color:'#fff', fontSize:13, fontWeight:700, textDecoration:'none', boxShadow:'0 0 32px rgba(255,0,128,0.3)' }}>
                  harshit@growster.in →
                </a>
                <a href="tel:+917017251443"
                  style={{ padding:'13px 28px', borderRadius:99, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.6)', fontSize:13, fontWeight:700, textDecoration:'none' }}>
                  +91 70172 51443
                </a>
              </div>
              <div className="fade-up-4" style={{ marginTop:28, fontSize:11, color:'rgba(255,255,255,0.15)' }}>growster.in · Confidential</div>
            </div>
          </div>
        )}

      </div>
    </>
  )
}
