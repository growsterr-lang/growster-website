import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
const SB_URL = 'https://agrctbhbmusxtjstfvst.supabase.co'
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFncmN0YmhibXVzeHRqc3RmdnN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NTcwODgsImV4cCI6MjA4OTMzMzA4OH0.4hXxsswtPE7PUnKNBWEOpiDRT8T2kMO0HaPUQ8fn2pQ'

const CLIENTS = ['Snitch','Bella Vita','Rubans','One Guardian','Think9','Nishorama','Virgio','Bow & Square']
const MEDIA = ['NDTV','Campaign India','Passionate in Marketing','Social Samosa','Media Brief','Ad Gully']
const VIDEO_VOLUMES = ['10–30 videos/month','30–60 videos/month','60–100 videos/month','100+ videos/month']
const BUDGETS = ['Under ₹5L','₹5L–₹10L','₹10L–₹20L','₹20L+']

const WORK = [
  {id:'DV1EFDUD6f1',label:'UGC'},
  {id:'DTicgbajgey',label:'UGC'},
  {id:'DTyQ1dfEjN8',label:'Performance'},
  {id:'DN3LKL_ZLWc',label:'UGC'},
  {id:'DYk-hYstVHp',label:'Performance'},
  {id:'DYSE5GAonDz',label:'UGC'},
  {id:'DaAtmpizLXs',label:'Brand Film'},
  {id:'DZqmVSwRqvJ',label:'Performance'},
  {id:'DV6HlCHEWaA',label:'Brand Film'},
]

export default function PCV() {
  const [floaterOpen, setFloaterOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name:'', brand:'', phone:'', problem:'', volume:'', budget:''
  })
  const F = (k:string, v:string) => setForm(p=>({...p,[k]:v}))

  // Scroll animation
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  const hypothesisRef = useRef<HTMLDivElement>(null)
  const [hypothesisProgress, setHypothesisProgress] = useState(0)
  const [floaterVisible, setFloaterVisible] = useState(false)

  useEffect(()=>{
    const onScroll = () => {
      setScrollY(window.scrollY)
      setFloaterVisible(window.scrollY > 400)
      if(hypothesisRef.current) {
        const rect = hypothesisRef.current.getBoundingClientRect()
        const winH = window.innerHeight
        const progress = Math.max(0, Math.min(1, (winH - rect.top) / (rect.height + winH * 0.5)))
        setHypothesisProgress(progress)
      }
    }
    window.addEventListener('scroll', onScroll, {passive:true})
    return ()=>window.removeEventListener('scroll', onScroll)
  },[])

  // Hypothesis steps
  const steps = [
    {chaos:'100 ads', sub:'sounds simple enough.'},
    {chaos:'100 UGC creators', sub:'to find, vet and brief.'},
    {chaos:'100 briefs', sub:'each one written from scratch.'},
    {chaos:'100 timelines', sub:'all different. all slipping.'},
    {chaos:'100 points of failure.', sub:'this isn\'t a strategy. this is a call centre.'},
  ]
  const totalSteps = steps.length + 3
  const activeStep = Math.floor(hypothesisProgress * totalSteps)

  async function handleSubmit(e:React.FormEvent) {
    e.preventDefault()
    if(!form.name||!form.phone||!form.volume) return
    setSubmitting(true)
    await fetch(SB_URL + '/rest/v1/leads', {
      method: 'POST',
      headers: {
        apikey: SB_KEY,
        Authorization: 'Bearer ' + SB_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({
        name: form.name,
        brand: form.brand,
        phone: form.phone,
        message: 'PCV Lead — Volume: ' + form.volume + ' | Budget: ' + form.budget + ' | Problem: ' + form.problem,
        status: 'new',
        utm_data: { source: 'pcv_page', volume: form.volume, budget: form.budget }
      })
    })
    setSubmitted(true)
    setSubmitting(false)
  }

  const inp:any = {
    background:'rgba(255,255,255,0.07)',
    border:'1px solid rgba(255,255,255,0.12)',
    borderRadius:10,
    padding:'12px 16px',
    fontSize:13,
    color:'#fff',
    fontFamily:'Montserrat,sans-serif',
    outline:'none',
    width:'100%',
  }

  return (
    <>
      <Head>
        <title>Predictable Creative Volume — Growster</title>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
        <style>{`
          *{box-sizing:border-box;margin:0;padding:0}
          html{scroll-behavior:smooth}
          body{font-family:'Montserrat',sans-serif;background:#050508;color:#fff;overflow-x:hidden}
          ::-webkit-scrollbar{width:3px}
          ::-webkit-scrollbar-thumb{background:#ff0080;border-radius:99px}
          @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
          @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
          @keyframes spin{to{transform:rotate(360deg)}}
          @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
          @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
          .fade-up{animation:fadeUp .7s ease both}
          .ticker-wrap{overflow:hidden;width:100%;mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)}
          .ticker-inner{display:flex;width:max-content;animation:ticker 30s linear infinite}
          input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.3)}
          select option{background:#0f0f1a;color:#fff}
        `}</style>
      </Head>

      {/* ── NAV ── */}
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:200,padding:'16px 28px',display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(5,5,8,0.7)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
        <a href="/" style={{fontSize:18,fontWeight:900,letterSpacing:'-0.5px',color:'#fff',textDecoration:'none'}}>
          Growster<span style={{color:'#ff0080'}}>.</span>
        </a>
        <button onClick={()=>setFloaterOpen(true)}
          style={{padding:'9px 22px',borderRadius:99,border:'none',background:'linear-gradient(135deg,#ff0080,#cc0055)',color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'Montserrat,sans-serif',boxShadow:'0 0 24px rgba(255,0,128,0.35)'}}>
          Work with us →
        </button>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'120px 24px 80px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        {/* bg orbs */}
        <div style={{position:'absolute',top:'-20%',left:'-10%',width:'60vw',height:'60vw',background:'radial-gradient(circle,rgba(255,0,128,0.08),transparent 70%)',pointerEvents:'none'}}/>
        <div style={{position:'absolute',bottom:'-10%',right:'-10%',width:'50vw',height:'50vw',background:'radial-gradient(circle,rgba(0,80,255,0.07),transparent 70%)',pointerEvents:'none'}}/>

        <div className="fade-up" style={{fontSize:11,fontWeight:700,color:'#ff0080',letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:20}}>
          Predictable Creative Volume
        </div>

        <h1 className="fade-up" style={{fontSize:'clamp(36px,6vw,80px)',fontWeight:900,letterSpacing:'-3px',lineHeight:1.0,marginBottom:24,animationDelay:'.1s',maxWidth:900}}>
          Your business needs<br/>
          <span style={{background:'linear-gradient(135deg,#ff0080,#8b5cf6,#0050ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
            ads. Fast.
          </span>
        </h1>

        <p className="fade-up" style={{fontSize:'clamp(16px,2vw,22px)',color:'rgba(255,255,255,0.5)',fontWeight:500,marginBottom:16,animationDelay:'.2s',maxWidth:600,lineHeight:1.6}}>
          We are India&apos;s largest producers of UGC content.
        </p>

        <p className="fade-up" style={{fontSize:13,color:'rgba(255,255,255,0.25)',fontWeight:600,marginBottom:48,animationDelay:'.3s',letterSpacing:'0.05em'}}>
          100Cr+ revenue impacted · 500M+ views · 1,000+ ads produced
        </p>

        <div className="fade-up" style={{display:'flex',gap:14,flexWrap:'wrap',justifyContent:'center',animationDelay:'.4s'}}>
          <button onClick={()=>{ const el=document.getElementById('form-section'); el?.scrollIntoView({behavior:'smooth'}) }}
            style={{padding:'14px 32px',borderRadius:99,border:'none',background:'linear-gradient(135deg,#ff0080,#cc0055)',color:'#fff',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'Montserrat,sans-serif',boxShadow:'0 0 32px rgba(255,0,128,0.3)',animation:'pulse 3s ease infinite'}}>
            Get a free content audit →
          </button>
          <button onClick={()=>{ const el=document.getElementById('work'); el?.scrollIntoView({behavior:'smooth'}) }}
            style={{padding:'14px 32px',borderRadius:99,border:'1px solid rgba(255,255,255,0.15)',background:'transparent',color:'rgba(255,255,255,0.7)',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'Montserrat,sans-serif'}}>
            Watch our work ↓
          </button>
        </div>

        <div style={{position:'absolute',bottom:32,left:'50%',transform:'translateX(-50%)',fontSize:11,color:'rgba(255,255,255,0.2)',fontWeight:600,letterSpacing:'0.1em',animation:'float 2s ease infinite'}}>
          scroll ↓
        </div>
      </section>

      {/* ── CLIENT ROLL ── */}
      <section style={{padding:'40px 0',borderTop:'1px solid rgba(255,255,255,0.06)',borderBottom:'1px solid rgba(255,255,255,0.06)',background:'rgba(255,255,255,0.02)'}}>
        <div style={{textAlign:'center',fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.2)',letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:20}}>
          Brands we&apos;ve scaled
        </div>
        <div className="ticker-wrap">
          <div className="ticker-inner">
            {[...CLIENTS,...CLIENTS,...CLIENTS,...CLIENTS].map((c,i)=>(
              <div key={i} style={{padding:'0 48px',fontSize:20,fontWeight:800,color:'rgba(255,255,255,0.12)',letterSpacing:'-0.5px',whiteSpace:'nowrap',transition:'color .2s'}}
                onMouseEnter={e=>(e.currentTarget.style.color='rgba(255,255,255,0.7)')}
                onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.12)')}>
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HYPOTHESIS SCROLL ANIMATION ── */}
      <section ref={hypothesisRef} style={{minHeight:'500vh',position:'relative'}}>
        <div style={{position:'sticky',top:0,height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',padding:'0 24px'}}>
          <div style={{maxWidth:800,width:'100%',textAlign:'center',position:'relative'}}>

            {/* CHAOS PHASE */}
            {activeStep < steps.length && (
              <div key={activeStep} style={{animation:'fadeUp .4s ease both'}}>
                <div style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.25)',letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:32}}>
                  The problem with how brands source content today
                </div>
                <div style={{fontSize:'clamp(48px,8vw,120px)',fontWeight:900,letterSpacing:'-4px',lineHeight:1,color:'#fff',marginBottom:16}}>
                  {steps[activeStep].chaos}
                </div>
                <div style={{fontSize:'clamp(16px,2vw,24px)',color:'rgba(255,255,255,0.35)',fontWeight:500}}>
                  {steps[activeStep].sub}
                </div>
                <div style={{marginTop:48,display:'flex',justifyContent:'center',gap:6}}>
                  {steps.map((_,i)=>(
                    <div key={i} style={{width:i===activeStep?24:6,height:6,borderRadius:99,background:i===activeStep?'#ff0080':'rgba(255,255,255,0.12)',transition:'all .3s'}}/>
                  ))}
                </div>
              </div>
            )}

            {/* PIVOT */}
            {activeStep === steps.length && (
              <div style={{animation:'fadeUp .5s ease both'}}>
                <div style={{fontSize:'clamp(48px,8vw,100px)',fontWeight:900,letterSpacing:'-3px',color:'rgba(255,255,255,0.08)',marginBottom:24}}>
                  or.
                </div>
                <div style={{fontSize:'clamp(20px,3vw,36px)',color:'rgba(255,255,255,0.5)',fontWeight:600,lineHeight:1.5}}>
                  What if you could have predictability?
                </div>
              </div>
            )}

            {/* SOLUTION */}
            {activeStep === steps.length + 1 && (
              <div style={{animation:'fadeUp .5s ease both'}}>
                <div style={{fontSize:11,fontWeight:700,color:'#10b981',letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:32}}>The alternative</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:24,alignItems:'center',marginBottom:32}}>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:'clamp(40px,6vw,80px)',fontWeight:900,letterSpacing:'-3px',color:'rgba(255,0,128,0.4)',textDecoration:'line-through',lineHeight:1}}>100</div>
                    <div style={{fontSize:12,color:'rgba(255,255,255,0.25)',fontWeight:600,marginTop:4}}>vendors</div>
                  </div>
                  <div style={{fontSize:'clamp(20px,3vw,32px)',color:'rgba(255,255,255,0.15)',fontWeight:900}}>→</div>
                  <div style={{textAlign:'left'}}>
                    <div style={{fontSize:'clamp(40px,6vw,80px)',fontWeight:900,letterSpacing:'-3px',color:'#10b981',lineHeight:1}}>1</div>
                    <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',fontWeight:600,marginTop:4}}>partner</div>
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:24,alignItems:'center',marginBottom:32}}>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:'clamp(40px,6vw,80px)',fontWeight:900,letterSpacing:'-3px',color:'rgba(255,0,128,0.4)',textDecoration:'line-through',lineHeight:1}}>100</div>
                    <div style={{fontSize:12,color:'rgba(255,255,255,0.25)',fontWeight:600,marginTop:4}}>timelines</div>
                  </div>
                  <div style={{fontSize:'clamp(20px,3vw,32px)',color:'rgba(255,255,255,0.15)',fontWeight:900}}>→</div>
                  <div style={{textAlign:'left'}}>
                    <div style={{fontSize:'clamp(40px,6vw,80px)',fontWeight:900,letterSpacing:'-3px',color:'#10b981',lineHeight:1}}>1</div>
                    <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',fontWeight:600,marginTop:4}}>timeline</div>
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:24,alignItems:'center'}}>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:'clamp(20px,3vw,32px)',fontWeight:900,letterSpacing:'-1px',color:'rgba(255,0,128,0.4)',textDecoration:'line-through',lineHeight:1}}>unpredictable</div>
                  </div>
                  <div style={{fontSize:'clamp(20px,3vw,32px)',color:'rgba(255,255,255,0.15)',fontWeight:900}}>→</div>
                  <div style={{textAlign:'left'}}>
                    <div style={{fontSize:'clamp(20px,3vw,32px)',fontWeight:900,letterSpacing:'-1px',color:'#10b981',lineHeight:1}}>predictable</div>
                  </div>
                </div>
              </div>
            )}

            {/* PCV INTRO */}
            {activeStep >= steps.length + 2 && (
              <div style={{animation:'fadeUp .5s ease both'}}>
                <div style={{fontSize:11,fontWeight:700,color:'#ff0080',letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:20}}>Introducing</div>
                <div style={{fontSize:'clamp(32px,5vw,72px)',fontWeight:900,letterSpacing:'-3px',lineHeight:1,marginBottom:16}}>
                  Predictable Creative Volume
                </div>
                <div style={{fontSize:'clamp(14px,1.8vw,20px)',color:'rgba(255,255,255,0.4)',fontWeight:500,lineHeight:1.6,maxWidth:520,margin:'0 auto 32px'}}>
                  30 to 100 ads. Every month. Same partner. Same quality. Zero chaos.
                </div>
                <button onClick={()=>{ const el=document.getElementById('form-section'); el?.scrollIntoView({behavior:'smooth'}) }}
                  style={{padding:'14px 32px',borderRadius:99,border:'none',background:'linear-gradient(135deg,#ff0080,#cc0055)',color:'#fff',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'Montserrat,sans-serif',boxShadow:'0 0 32px rgba(255,0,128,0.3)'}}>
                  Get started →
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── HARSHIT VIDEOS ── */}
      <section style={{padding:'80px 24px',maxWidth:1000,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:48}}>
          <div style={{fontSize:11,fontWeight:700,color:'#ff0080',letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:12}}>Hear it from the founder</div>
          <h2 style={{fontSize:'clamp(28px,4vw,48px)',fontWeight:900,letterSpacing:'-2px'}}>What is PCV?</h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
          {['What is Predictable Creative Volume?','Why most brands are scaling ads wrong'].map((title,i)=>(
            <div key={i} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,overflow:'hidden'}}>
              <div style={{aspectRatio:'16/9',background:'rgba(255,255,255,0.04)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
                <div style={{width:56,height:56,borderRadius:'50%',background:'rgba(255,0,128,0.15)',border:'1px solid rgba(255,0,128,0.3)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                  <div style={{fontSize:20,marginLeft:4}}>▶</div>
                </div>
                <div style={{position:'absolute',top:12,left:12,fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'0.1em'}}>Video {i+1}</div>
              </div>
              <div style={{padding:'16px 20px'}}>
                <div style={{fontSize:13,fontWeight:700,color:'#fff',marginBottom:4}}>{title}</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,0.3)'}}>Harshit Arora · Founder, Growster</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── OUR WORK ── */}
      <section id="work" style={{padding:'80px 24px',background:'rgba(255,255,255,0.01)',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
        <div style={{maxWidth:1200,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:48}}>
            <div style={{fontSize:11,fontWeight:700,color:'#ff0080',letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:12}}>Production quality</div>
            <h2 style={{fontSize:'clamp(28px,4vw,48px)',fontWeight:900,letterSpacing:'-2px',marginBottom:12}}>Watch our work</h2>
            <p style={{fontSize:14,color:'rgba(255,255,255,0.35)',maxWidth:500,margin:'0 auto'}}>A selection of our best-performing ads across UGC, performance, and brand film.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14}}>
            {WORK.map((v,i)=>(
              <div key={i} style={{borderRadius:14,overflow:'hidden',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',cursor:'pointer',transition:'transform .2s',position:'relative'}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-4px)'}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(0)'}}>
                <a href={`https://www.instagram.com/reel/${v.id}/`} target="_blank" rel="noreferrer" style={{display:'block',textDecoration:'none'}}>
                  <div style={{aspectRatio:'9/16',background:'rgba(255,255,255,0.04)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden'}}>
                    <div style={{fontSize:32,opacity:0.3}}>▶</div>
                    <div style={{position:'absolute',bottom:12,left:12,right:12,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span style={{fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:99,background:'rgba(255,0,128,0.2)',border:'1px solid rgba(255,0,128,0.3)',color:'#ff0080'}}>{v.label}</span>
                      <span style={{fontSize:10,color:'rgba(255,255,255,0.3)',fontWeight:600}}>↗ Instagram</span>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEDIA ── */}
      <section style={{padding:'48px 24px',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
        <div style={{maxWidth:900,margin:'0 auto',textAlign:'center'}}>
          <div style={{fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.2)',letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:24}}>As seen on</div>
          <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:16}}>
            {MEDIA.map((m,i)=>(
              <div key={i} style={{fontSize:13,fontWeight:700,color:'rgba(255,255,255,0.2)',padding:'8px 16px',borderRadius:99,border:'1px solid rgba(255,255,255,0.07)',letterSpacing:'0.02em'}}>
                {m}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EMBEDDED FORM ── */}
      <section id="form-section" style={{padding:'80px 24px',borderTop:'1px solid rgba(255,255,255,0.06)',background:'rgba(255,0,128,0.02)'}}>
        <div style={{maxWidth:600,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:40}}>
            <div style={{fontSize:11,fontWeight:700,color:'#ff0080',letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:12}}>Get started</div>
            <h2 style={{fontSize:'clamp(28px,4vw,44px)',fontWeight:900,letterSpacing:'-2px',marginBottom:12}}>Ready for predictable creative?</h2>
            <p style={{fontSize:14,color:'rgba(255,255,255,0.35)'}}>Tell us about your content needs. We&apos;ll come back with a free audit and a custom PCV plan.</p>
          </div>
          {submitted ? (
            <div style={{textAlign:'center',padding:'48px',background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.25)',borderRadius:20}}>
              <div style={{fontSize:40,marginBottom:16}}>✓</div>
              <div style={{fontSize:20,fontWeight:800,marginBottom:8}}>We&apos;ll be in touch.</div>
              <div style={{fontSize:14,color:'rgba(255,255,255,0.4)'}}>Our team typically responds within 4 hours.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{display:'grid',gap:14}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div>
                  <div style={{fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:6}}>Your name *</div>
                  <input style={inp} value={form.name} onChange={e=>F('name',e.target.value)} placeholder="Harshit Arora" required/>
                </div>
                <div>
                  <div style={{fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:6}}>Brand *</div>
                  <input style={inp} value={form.brand} onChange={e=>F('brand',e.target.value)} placeholder="Snitch" required/>
                </div>
              </div>
              <div>
                <div style={{fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:6}}>WhatsApp number *</div>
                <input style={inp} value={form.phone} onChange={e=>F('phone',e.target.value)} placeholder="+91 98765 43210" required/>
              </div>
              <div>
                <div style={{fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:8}}>How many videos do you need per month? *</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                  {VIDEO_VOLUMES.map(v=>(
                    <div key={v} onClick={()=>F('volume',v)}
                      style={{padding:'10px 14px',borderRadius:10,border:`1px solid ${form.volume===v?'rgba(255,0,128,0.4)':'rgba(255,255,255,0.08)'}`,background:form.volume===v?'rgba(255,0,128,0.1)':'rgba(255,255,255,0.03)',cursor:'pointer',fontSize:13,fontWeight:600,color:form.volume===v?'#ff0080':'rgba(255,255,255,0.45)',transition:'all .15s'}}>
                      {v}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:8}}>Monthly content budget</div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
                  {BUDGETS.map(b=>(
                    <div key={b} onClick={()=>F('budget',b)}
                      style={{padding:'10px 8px',borderRadius:10,border:`1px solid ${form.budget===b?'rgba(255,0,128,0.4)':'rgba(255,255,255,0.08)'}`,background:form.budget===b?'rgba(255,0,128,0.1)':'rgba(255,255,255,0.03)',cursor:'pointer',fontSize:12,fontWeight:600,color:form.budget===b?'#ff0080':'rgba(255,255,255,0.45)',transition:'all .15s',textAlign:'center' as const}}>
                      {b}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:6}}>Biggest content challenge right now</div>
                <textarea style={{...inp,minHeight:90,resize:'vertical' as const,lineHeight:1.6}} value={form.problem} onChange={e=>F('problem',e.target.value)} placeholder="e.g. Our UGC creators are slow and inconsistent, we can't scale..."/>
              </div>
              <button type="submit" disabled={submitting||!form.name||!form.phone||!form.volume}
                style={{padding:'16px',borderRadius:12,border:'none',background:'linear-gradient(135deg,#ff0080,#cc0055)',color:'#fff',fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'Montserrat,sans-serif',boxShadow:'0 0 32px rgba(255,0,128,0.25)',opacity:(!form.name||!form.phone||!form.volume)?0.5:1,transition:'opacity .2s'}}>
                {submitting?'Sending...':'Get my free content audit →'}
              </button>
              <p style={{fontSize:11,color:'rgba(255,255,255,0.2)',textAlign:'center' as const}}>Minimum engagement: 30 videos/month. We respond within 4 hours.</p>
            </form>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{padding:'32px 24px',borderTop:'1px solid rgba(255,255,255,0.06)',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12}}>
        <div style={{fontSize:15,fontWeight:900,letterSpacing:'-0.5px'}}>Growster<span style={{color:'#ff0080'}}>.</span></div>
        <div style={{fontSize:11,color:'rgba(255,255,255,0.2)'}}>© 2025 Grandir Vitae Pvt. Ltd. · work@growster.in</div>
      </footer>

      {/* ── FLOATER ── */}
      {floaterVisible && !floaterOpen && (
        <button onClick={()=>setFloaterOpen(true)}
          style={{position:'fixed',bottom:28,right:28,zIndex:300,display:'flex',alignItems:'center',gap:10,padding:'14px 22px',borderRadius:99,border:'none',background:'linear-gradient(135deg,#ff0080,#cc0055)',color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'Montserrat,sans-serif',boxShadow:'0 8px 32px rgba(255,0,128,0.4)',animation:'float 2.5s ease infinite'}}>
          <span style={{fontSize:18}}>🤝</span>
          Work with us
        </button>
      )}

      {/* ── FLOATER FORM ── */}
      {floaterOpen && (
        <div style={{position:'fixed',inset:0,zIndex:400,display:'flex',alignItems:'flex-end',justifyContent:'flex-end',padding:24,pointerEvents:'none'}}>
          <div style={{pointerEvents:'all',width:'100%',maxWidth:420,background:'#0f0f1a',border:'1px solid rgba(255,255,255,0.1)',borderRadius:20,boxShadow:'0 24px 64px rgba(0,0,0,0.6)',overflow:'hidden'}}>
            <div style={{padding:'18px 20px',borderBottom:'1px solid rgba(255,255,255,0.08)',display:'flex',justifyContent:'space-between',alignItems:'center',background:'rgba(255,0,128,0.06)'}}>
              <div>
                <div style={{fontSize:14,fontWeight:800}}>Work with Growster</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,0.35)'}}>Get a free content audit</div>
              </div>
              <button onClick={()=>setFloaterOpen(false)} style={{background:'transparent',border:'none',color:'rgba(255,255,255,0.4)',cursor:'pointer',fontSize:20,lineHeight:1}}>✕</button>
            </div>
            <div style={{padding:'20px',maxHeight:'70vh',overflowY:'auto'}}>
              {submitted ? (
                <div style={{textAlign:'center',padding:'32px 0'}}>
                  <div style={{fontSize:36,marginBottom:12}}>✓</div>
                  <div style={{fontSize:16,fontWeight:800,marginBottom:8}}>We&apos;ll be in touch.</div>
                  <div style={{fontSize:13,color:'rgba(255,255,255,0.4)'}}>Usually within 4 hours.</div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{display:'grid',gap:12}}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                    <div>
                      <div style={{fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:5}}>Name *</div>
                      <input style={{...inp,padding:'9px 12px',fontSize:12}} value={form.name} onChange={e=>F('name',e.target.value)} placeholder="Your name" required/>
                    </div>
                    <div>
                      <div style={{fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:5}}>Brand *</div>
                      <input style={{...inp,padding:'9px 12px',fontSize:12}} value={form.brand} onChange={e=>F('brand',e.target.value)} placeholder="Brand name" required/>
                    </div>
                  </div>
                  <div>
                    <div style={{fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:5}}>WhatsApp *</div>
                    <input style={{...inp,padding:'9px 12px',fontSize:12}} value={form.phone} onChange={e=>F('phone',e.target.value)} placeholder="+91 98765 43210" required/>
                  </div>
                  <div>
                    <div style={{fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:6}}>Videos needed per month *</div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
                      {VIDEO_VOLUMES.map(v=>(
                        <div key={v} onClick={()=>F('volume',v)}
                          style={{padding:'8px 10px',borderRadius:8,border:`1px solid ${form.volume===v?'rgba(255,0,128,0.4)':'rgba(255,255,255,0.08)'}`,background:form.volume===v?'rgba(255,0,128,0.1)':'rgba(255,255,255,0.03)',cursor:'pointer',fontSize:11,fontWeight:600,color:form.volume===v?'#ff0080':'rgba(255,255,255,0.4)',transition:'all .15s'}}>
                          {v}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:6}}>Monthly budget</div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:6}}>
                      {BUDGETS.map(b=>(
                        <div key={b} onClick={()=>F('budget',b)}
                          style={{padding:'7px 8px',borderRadius:8,border:`1px solid ${form.budget===b?'rgba(255,0,128,0.4)':'rgba(255,255,255,0.08)'}`,background:form.budget===b?'rgba(255,0,128,0.1)':'rgba(255,255,255,0.03)',cursor:'pointer',fontSize:11,fontWeight:600,color:form.budget===b?'#ff0080':'rgba(255,255,255,0.4)',transition:'all .15s',textAlign:'center' as const}}>
                          {b}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button type="submit" disabled={submitting||!form.name||!form.phone||!form.volume}
                    style={{padding:'12px',borderRadius:10,border:'none',background:'linear-gradient(135deg,#ff0080,#cc0055)',color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'Montserrat,sans-serif',opacity:(!form.name||!form.phone||!form.volume)?0.5:1,transition:'opacity .2s',marginTop:4}}>
                    {submitting?'Sending...':'Get free audit →'}
                  </button>
                  <p style={{fontSize:10,color:'rgba(255,255,255,0.2)',textAlign:'center' as const}}>Min. 30 videos/month · Response within 4 hours</p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
