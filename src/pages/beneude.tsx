import Head from 'next/head'
import { useState, useEffect } from 'react'

const SB_URL = 'https://agrctbhbmusxtjstfvst.supabase.co'
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFncmN0YmhibXVzeHRqc3RmdnN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NTcwODgsImV4cCI6MjA4OTMzMzA4OH0.4hXxsswtPE7PUnKNBWEOpiDRT8T2kMO0HaPUQ8fn2pQ'

const PRODUCTS = [
  {key:'all',label:'All products'},
  {key:'UN_MASK',label:'Un_Mask'},
  {key:'FACETIME',label:'FaceTime!'},
  {key:'SLEEP_ON_IT',label:'Sleep On It'},
  {key:'TRENDS',label:'Trends'},
]

const BC: Record<string,string> = {
  'Before and After':'#ff0080',
  'Problem Solving':'#8b5cf6',
  'One App Transformation':'#0050ff',
  'Milk Based Hook':'#10b981',
  'Absurdity Hooks':'#f59e0b',
  'POV Style':'#06b6d4',
  'ASMR':'#ec4899',
  'Side by Side':'#3b82f6',
  'Myth Busting':'#94a3b8',
  'This or That':'#a78bfa',
  'Rating System':'#34d399',
}

type Ref = {id:number;product:string;ref_no:number;link:string;script:string|null;bucket:string;approval_status:string;client_comment:string|null}

export default function BeNeude() {
  const [refs,setRefs] = useState<Ref[]>([])
  const [loading,setLoading] = useState(true)
  const [prod,setProd] = useState('all')
  const [bucket,setBucket] = useState('all')
  const [appr,setAppr] = useState('all')
  const [exp,setExp] = useState<Record<number,boolean>>({})
  const [saving,setSaving] = useState<Record<number,boolean>>({})
  const [fb,setFb] = useState<Record<number,string>>({})
  const [timers,setTimers] = useState<Record<number,any>>({})

  useEffect(()=>{ load() },[])

  async function load() {
    const r = await fetch(SB_URL+'/rest/v1/beneude_refs?select=*&order=product,ref_no',{
      headers:{apikey:SB_KEY,Authorization:'Bearer '+SB_KEY}
    })
    const d = await r.json()
    setRefs(d)
    const f:Record<number,string> = {}
    d.forEach((x:Ref)=>{ if(x.client_comment) f[x.id]=x.client_comment })
    setFb(f)
    setLoading(false)
  }

  async function setApproval(id:number,status:string) {
    const cur = refs.find(r=>r.id===id)?.approval_status
    const next = cur===status?'pending':status
    setSaving(p=>({...p,[id]:true}))
    await fetch(SB_URL+'/rest/v1/beneude_refs?id=eq.'+id,{
      method:'PATCH',
      headers:{apikey:SB_KEY,Authorization:'Bearer '+SB_KEY,'Content-Type':'application/json',Prefer:'return=minimal'},
      body:JSON.stringify({approval_status:next,reviewed_at:new Date().toISOString()})
    })
    setRefs(p=>p.map(r=>r.id===id?{...r,approval_status:next}:r))
    setSaving(p=>({...p,[id]:false}))
  }

  function onFb(id:number,val:string) {
    setFb(p=>({...p,[id]:val}))
    if(timers[id]) clearTimeout(timers[id])
    const t = setTimeout(async()=>{
      await fetch(SB_URL+'/rest/v1/beneude_refs?id=eq.'+id,{
        method:'PATCH',
        headers:{apikey:SB_KEY,Authorization:'Bearer '+SB_KEY,'Content-Type':'application/json',Prefer:'return=minimal'},
        body:JSON.stringify({client_comment:val})
      })
    },800)
    setTimers(p=>({...p,[id]:t}))
  }

  const filtered = refs.filter(r=>{
    if(prod!=='all'&&r.product!==prod) return false
    if(bucket!=='all'&&r.bucket!==bucket) return false
    if(appr!=='all'&&(r.approval_status||'pending')!==appr) return false
    return true
  })
  const buckets=Array.from(new Set(refs.filter(r=>prod==='all'||r.product===prod).map(r=>r.bucket))).sort()
  const approved=refs.filter(r=>r.approval_status==='approved').length
  const rejected=refs.filter(r=>r.approval_status==='rejected').length
  const pending=refs.length-approved-rejected
  const isPint=(u:string)=>u.includes('pin.it')
  const isReq=(s:string|null)=>s&&s.includes('SCRIPT REQ')

  const pill = (active:boolean, activeColor:string='#ff0080') => ({
    padding:'7px 16px',
    borderRadius:99,
    border:`1px solid ${active?activeColor+'50':'rgba(255,255,255,0.1)'}`,
    background:active?activeColor+'15':'transparent',
    color:active?activeColor:'rgba(255,255,255,0.45)',
    fontSize:12,
    fontWeight:700,
    cursor:'pointer' as const,
    fontFamily:'Montserrat,sans-serif',
    transition:'all .2s',
    whiteSpace:'nowrap' as const,
  })

  return (<>
    <Head>
      <title>Be Neude × Growster — Ref Deck</title>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Montserrat',sans-serif;background:#050508;color:#fff;min-height:100vh}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:#ff0080;border-radius:99px}
        @keyframes fu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fu .25s ease both}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
      `}</style>
    </Head>

    {/* Nav */}
    <nav style={{position:'sticky',top:0,zIndex:100,background:'rgba(5,5,8,0.85)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,0.06)',padding:'14px 28px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <div style={{fontSize:18,fontWeight:900,letterSpacing:'-0.5px'}}>
          Growster<span style={{color:'#ff0080'}}>.</span>
        </div>
        <div style={{width:1,height:18,background:'rgba(255,255,255,0.15)'}}/>
        <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',fontWeight:600}}>Be Neude · Ref Deck</div>
      </div>
      <div style={{display:'flex',gap:20,alignItems:'center'}}>
        {[
          {k:'approved',v:approved,c:'#10b981',label:'Approved'},
          {k:'rejected',v:rejected,c:'#ff0080',label:'Rejected'},
          {k:'pending',v:pending,c:'rgba(255,255,255,0.3)',label:'Pending'},
        ].map(s=>(
          <div key={s.k} onClick={()=>setAppr(appr===s.k?'all':s.k)} style={{textAlign:'center',cursor:'pointer',transition:'opacity .2s',opacity:appr!=='all'&&appr!==s.k?0.4:1}}>
            <div style={{fontSize:20,fontWeight:900,color:s.c,lineHeight:1}}>{s.v}</div>
            <div style={{fontSize:9,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'0.12em',marginTop:3,fontWeight:700}}>{s.label}</div>
          </div>
        ))}
      </div>
    </nav>

    {/* Hero */}
    <div style={{padding:'32px 28px 20px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
      <div style={{fontSize:11,fontWeight:700,color:'#ff0080',letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:8}}>Reference & Script Approval</div>
      <h1 style={{fontSize:32,fontWeight:900,letterSpacing:'-1.5px',marginBottom:6,background:'linear-gradient(135deg,#fff 60%,rgba(255,255,255,0.4))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
        Be Neude — Ref Deck
      </h1>
      <p style={{fontSize:13,color:'rgba(255,255,255,0.35)',marginBottom:20}}>
        Review each reference below. Click Approve or Reject — your feedback saves automatically.
      </p>

      {/* Progress bar */}
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
        <div style={{flex:1,height:4,background:'rgba(255,255,255,0.06)',borderRadius:99,overflow:'hidden'}}>
          <div style={{height:'100%',width:`${refs.length?Math.round(((approved+rejected)/refs.length)*100):0}%`,background:'linear-gradient(90deg,#ff0080,#0050ff)',borderRadius:99,transition:'width .5s'}}/>
        </div>
        <div style={{fontSize:12,color:'rgba(255,255,255,0.35)',fontWeight:600,whiteSpace:'nowrap'}}>
          {refs.length?Math.round(((approved+rejected)/refs.length)*100):0}% reviewed
        </div>
      </div>

      {/* Filters */}
      <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
        {/* Product filter */}
        {PRODUCTS.map(p=>(
          <button key={p.key} onClick={()=>{setProd(p.key);setBucket('all')}} style={pill(prod===p.key,'#ff0080')}>
            {p.label}
          </button>
        ))}
        <div style={{width:1,height:20,background:'rgba(255,255,255,0.08)',margin:'0 4px'}}/>
        {/* Approval filter */}
        {[
          {v:'all',l:'All'},
          {v:'pending',l:'⏳ Pending'},
          {v:'approved',l:'✓ Approved'},
          {v:'rejected',l:'✕ Rejected'},
        ].map(({v,l})=>(
          <button key={v} onClick={()=>setAppr(v)} style={pill(appr===v, v==='approved'?'#10b981':v==='rejected'?'#ff0080':v==='pending'?'#f59e0b':'#ff0080')}>
            {l}
          </button>
        ))}
        {buckets.length>0&&<div style={{width:1,height:20,background:'rgba(255,255,255,0.08)',margin:'0 4px'}}/>}
        {buckets.map(b=>(
          <button key={b} onClick={()=>setBucket(bucket===b?'all':b)} style={pill(bucket===b, BC[b]||'#ff0080')}>
            {b}
          </button>
        ))}
      </div>
    </div>

    {/* Grid */}
    {loading ? (
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'80px',gap:12,color:'rgba(255,255,255,0.3)'}}>
        <div style={{width:16,height:16,border:'2px solid rgba(255,0,128,0.3)',borderTop:'2px solid #ff0080',borderRadius:'50%',animation:'spin 1s linear infinite'}}/>
        Loading refs...
      </div>
    ) : (
      <>
        <div style={{padding:'10px 28px 6px',fontSize:12,color:'rgba(255,255,255,0.25)',fontWeight:600}}>
          {filtered.length} ref{filtered.length!==1?'s':''} {prod!=='all'||bucket!=='all'||appr!=='all'?'· filtered':''}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:14,padding:'8px 28px 100px'}}>
          {filtered.length===0 ? (
            <div style={{gridColumn:'1/-1',textAlign:'center',padding:'60px',color:'rgba(255,255,255,0.2)'}}>
              <div style={{fontSize:32,marginBottom:12}}>🔍</div>
              <div>No refs match your filters.</div>
            </div>
          ) : filtered.map((r,i)=>{
            const status=r.approval_status||'pending'
            const bc=BC[r.bucket]||'#8b5cf6'
            const req=isReq(r.script)
            const pname=PRODUCTS.find(p=>p.key===r.product)?.label
            const isApproved=status==='approved'
            const isRejected=status==='rejected'

            return (
              <div key={r.id} className="fu" style={{
                animationDelay:`${Math.min(i*0.02,0.4)}s`,
                background:'rgba(255,255,255,0.03)',
                border:`1px solid ${isApproved?'rgba(16,185,129,0.3)':isRejected?'rgba(255,0,128,0.3)':'rgba(255,255,255,0.08)'}`,
                borderTop:`2px solid ${isApproved?'#10b981':isRejected?'#ff0080':bc}`,
                borderRadius:16,
                overflow:'hidden',
                display:'flex',
                flexDirection:'column',
                transition:'all .2s',
              }}>
                {/* Card header */}
                <div style={{padding:'14px 16px 10px',display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8}}>
                  <div>
                    <div style={{fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:3}}>{pname} · #{r.ref_no}</div>
                    <div style={{fontSize:11,fontWeight:700,padding:'3px 9px',borderRadius:99,background:bc+'18',border:`1px solid ${bc}30`,color:bc,display:'inline-block'}}>{r.bucket}</div>
                  </div>
                  {isApproved&&<div style={{fontSize:11,fontWeight:700,color:'#10b981',padding:'4px 10px',borderRadius:99,background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.25)'}}>✓ Approved</div>}
                  {isRejected&&<div style={{fontSize:11,fontWeight:700,color:'#ff0080',padding:'4px 10px',borderRadius:99,background:'rgba(255,0,128,0.1)',border:'1px solid rgba(255,0,128,0.25)'}}>✕ Rejected</div>}
                  {!isApproved&&!isRejected&&<div style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.2)',padding:'4px 10px',borderRadius:99,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}>Pending</div>}
                </div>

                {/* Link */}
                <a href={r.link} target="_blank" rel="noreferrer"
                  style={{display:'flex',alignItems:'center',gap:8,margin:'0 16px 12px',padding:'10px 14px',background:'rgba(255,255,255,0.04)',borderRadius:10,textDecoration:'none',fontSize:12,fontWeight:700,color:isPint(r.link)?'#f43f5e':'#60a5fa',border:'1px solid rgba(255,255,255,0.08)',transition:'background .2s'}}>
                  <span style={{fontSize:16}}>{isPint(r.link)?'📌':'▶'}</span>
                  {isPint(r.link)?'View Pinterest ref':'Watch Instagram Reel'}
                  <span style={{marginLeft:'auto',fontSize:10,opacity:0.4}}>↗</span>
                </a>

                {/* Script */}
                {r.script ? (
                  <div style={{margin:'0 16px 12px'}}>
                    <div style={{fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>
                      {req?'✏️ Script needed':'📝 Script'}
                    </div>
                    <div style={{
                      padding:'12px 14px',
                      background:req?'rgba(139,92,246,0.06)':'rgba(255,255,255,0.03)',
                      border:`1px solid ${req?'rgba(139,92,246,0.2)':'rgba(255,255,255,0.07)'}`,
                      borderRadius:10,
                      fontSize:12,
                      color:req?'#a78bfa':'rgba(255,255,255,0.6)',
                      lineHeight:1.7,
                      maxHeight:exp[r.id]?'none':'90px',
                      overflow:'hidden',
                      position:'relative',
                      transition:'max-height .3s',
                    }}>
                      {req?'Script to be written by Growster team — visual ref only for now':r.script}
                      {!req&&!exp[r.id]&&<div style={{position:'absolute',bottom:0,left:0,right:0,height:32,background:'linear-gradient(transparent,rgba(5,5,8,0.9))'}}/>}
                    </div>
                    {!req&&(
                      <button onClick={()=>setExp(p=>({...p,[r.id]:!p[r.id]}))}
                        style={{background:'none',border:'none',fontFamily:'Montserrat,sans-serif',fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.3)',cursor:'pointer',padding:'6px 0',display:'block',transition:'color .2s'}}
                        onMouseEnter={e=>(e.currentTarget.style.color='#ff0080')}
                        onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.3)')}>
                        {exp[r.id]?'▲ Collapse':'▼ Read full script'}
                      </button>
                    )}
                  </div>
                ) : (
                  <div style={{margin:'0 16px 12px',padding:'10px 14px',background:'rgba(255,255,255,0.02)',borderRadius:10,fontSize:11,color:'rgba(255,255,255,0.2)',fontStyle:'italic',border:'1px solid rgba(255,255,255,0.05)'}}>
                    Visual reference only — no script
                  </div>
                )}

                {/* Approve / Reject */}
                <div style={{padding:'12px 16px',borderTop:'1px solid rgba(255,255,255,0.06)',display:'flex',gap:8,marginTop:'auto'}}>
                  <button onClick={()=>setApproval(r.id,'approved')} disabled={saving[r.id]}
                    style={{flex:1,padding:'10px',borderRadius:10,border:`1px solid ${isApproved?'rgba(16,185,129,0.4)':'rgba(255,255,255,0.1)'}`,background:isApproved?'rgba(16,185,129,0.12)':'rgba(255,255,255,0.03)',color:isApproved?'#10b981':'rgba(255,255,255,0.45)',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'Montserrat,sans-serif',transition:'all .2s'}}>
                    {saving[r.id]?'…':'✓ Approve'}
                  </button>
                  <button onClick={()=>setApproval(r.id,'rejected')} disabled={saving[r.id]}
                    style={{flex:1,padding:'10px',borderRadius:10,border:`1px solid ${isRejected?'rgba(255,0,128,0.4)':'rgba(255,255,255,0.1)'}`,background:isRejected?'rgba(255,0,128,0.1)':'rgba(255,255,255,0.03)',color:isRejected?'#ff0080':'rgba(255,255,255,0.45)',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'Montserrat,sans-serif',transition:'all .2s'}}>
                    {saving[r.id]?'…':'✕ Reject'}
                  </button>
                </div>

                {/* Feedback */}
                {status!=='pending'&&(
                  <div style={{padding:'0 16px 14px'}}>
                    <textarea value={fb[r.id]||''} onChange={e=>onFb(r.id,e.target.value)}
                      placeholder="Leave a comment or note... (auto-saves)"
                      rows={2}
                      style={{width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,padding:'10px 12px',fontSize:12,color:'#fff',fontFamily:'Montserrat,sans-serif',outline:'none',resize:'none',lineHeight:1.6,colorScheme:'dark'}}/>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </>
    )}

    {/* Bottom bar */}
    <div style={{position:'fixed',bottom:0,left:0,right:0,background:'rgba(5,5,8,0.95)',backdropFilter:'blur(20px)',borderTop:'1px solid rgba(255,255,255,0.06)',padding:'12px 28px',display:'flex',gap:20,alignItems:'center'}}>
      <div style={{display:'flex',alignItems:'center',gap:6}}>
        <div style={{width:8,height:8,borderRadius:'50%',background:'#10b981',boxShadow:'0 0 8px #10b981'}}/>
        <span style={{fontSize:12,fontWeight:700,color:'#10b981'}}>{approved} approved</span>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:6}}>
        <div style={{width:8,height:8,borderRadius:'50%',background:'#ff0080'}}/>
        <span style={{fontSize:12,fontWeight:700,color:'#ff0080'}}>{rejected} rejected</span>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:6}}>
        <div style={{width:8,height:8,borderRadius:'50%',background:'rgba(255,255,255,0.2)'}}/>
        <span style={{fontSize:12,fontWeight:600,color:'rgba(255,255,255,0.3)'}}>{pending} pending</span>
      </div>
      <span style={{marginLeft:'auto',fontSize:11,color:'rgba(255,255,255,0.2)',fontWeight:500}}>Changes save automatically</span>
    </div>

    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </>)
}
