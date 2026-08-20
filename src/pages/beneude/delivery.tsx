import Head from 'next/head'
import { useState, useEffect } from 'react'

const SB_URL = 'https://agrctbhbmusxtjstfvst.supabase.co'
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFncmN0YmhibXVzeHRqc3RmdnN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NTcwODgsImV4cCI6MjA4OTMzMzA4OH0.4hXxsswtPE7PUnKNBWEOpiDRT8T2kMO0HaPUQ8fn2pQ'

type Video = {
  id: number; sno: number; product_name: string; video_link: string | null
  brand_feedback: string | null; growster_notes: string | null
  cpm: number | null; ctr: number | null; hook_rate: number | null
  spend: number | null; roas: number | null; aov: number | null
}
type Averages = { avg_cpm: number|null; avg_ctr: number|null; avg_hook_rate: number|null; avg_roas: number|null; avg_aov: number|null }

const PERF: {key:string;label:string;unit:string;invert?:boolean}[] = [
  {key:'cpm',label:'CPM',unit:'₹',invert:true},
  {key:'ctr',label:'CTR',unit:'%'},
  {key:'hook_rate',label:'Hook Rate',unit:'%'},
  {key:'spend',label:'Spend',unit:'₹'},
  {key:'roas',label:'ROAS',unit:'x'},
  {key:'aov',label:'AOV',unit:'₹'},
]

function badge(val:number|null, avg:number|null, invert=false) {
  if(!val||!avg) return null
  const pct = Math.round(((val-avg)/avg)*100)
  const better = invert ? val<avg : val>avg
  return {pct:Math.abs(pct),better}
}

export default function BeneudeDelivery() {
  const [videos,setVideos] = useState<Video[]>([])
  const [avgs,setAvgs] = useState<Averages>({avg_cpm:null,avg_ctr:null,avg_hook_rate:null,avg_roas:null,avg_aov:null})
  const [loading,setLoading] = useState(true)
  const [fb,setFb] = useState<Record<number,string>>({})
  const [perf,setPerf] = useState<Record<number,any>>({})
  const [fbTimers,setFbTimers] = useState<Record<number,any>>({})
  const [savingFb,setSavingFb] = useState<Record<number,boolean>>({})
  const [savingPerf,setSavingPerf] = useState<Record<number,boolean>>({})
  const [expanded,setExpanded] = useState<Record<number,boolean>>({})
  const [showAvg,setShowAvg] = useState(false)
  const [avgEdit,setAvgEdit] = useState<Averages>({avg_cpm:null,avg_ctr:null,avg_hook_rate:null,avg_roas:null,avg_aov:null})
  const [savingAvg,setSavingAvg] = useState(false)

  useEffect(()=>{ load() },[])

  async function load() {
    const h = {apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`}
    const [vr,ar] = await Promise.all([
      fetch(`${SB_URL}/rest/v1/beneude_delivery?select=*&order=sno`,{headers:h}),
      fetch(`${SB_URL}/rest/v1/beneude_account_averages?select=*&limit=1`,{headers:h})
    ])
    const vd = await vr.json()
    const ad = await ar.json()
    const vs = Array.isArray(vd)?vd:[]
    setVideos(vs)
    if(ad&&ad[0]){setAvgs(ad[0]);setAvgEdit(ad[0])}
    const f:Record<number,string>={}, p:Record<number,any>={}
    vs.forEach((v:Video)=>{ f[v.id]=v.brand_feedback||''; p[v.id]={cpm:v.cpm,ctr:v.ctr,hook_rate:v.hook_rate,spend:v.spend,roas:v.roas,aov:v.aov} })
    setFb(f); setPerf(p); setLoading(false)
  }

  function onFb(id:number, val:string) {
    setFb(p=>({...p,[id]:val}))
    if(fbTimers[id]) clearTimeout(fbTimers[id])
    const t = setTimeout(async()=>{
      setSavingFb(p=>({...p,[id]:true}))
      await fetch(`${SB_URL}/rest/v1/beneude_delivery?id=eq.${id}`,{method:'PATCH',headers:{apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({brand_feedback:val,updated_at:new Date().toISOString()})})
      setVideos(p=>p.map(v=>v.id===id?{...v,brand_feedback:val}:v))
      setSavingFb(p=>({...p,[id]:false}))
    },800)
    setFbTimers(p=>({...p,[id]:t}))
  }

  async function savePerf(id:number) {
    setSavingPerf(p=>({...p,[id]:true}))
    await fetch(`${SB_URL}/rest/v1/beneude_delivery?id=eq.${id}`,{method:'PATCH',headers:{apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({...perf[id],updated_at:new Date().toISOString()})})
    setVideos(p=>p.map(v=>v.id===id?{...v,...perf[id]}:v))
    setSavingPerf(p=>({...p,[id]:false}))
  }

  async function saveAvg() {
    setSavingAvg(true)
    await fetch(`${SB_URL}/rest/v1/beneude_account_averages?id=eq.1`,{method:'PATCH',headers:{apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({...avgEdit,updated_at:new Date().toISOString()})})
    setAvgs(avgEdit); setSavingAvg(false); setShowAvg(false)
  }

  const inp:any={background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,padding:'8px 10px',fontSize:12,color:'#fff',fontFamily:'Montserrat,sans-serif',outline:'none',width:'100%'}
  const withPerf = videos.filter(v=>v.ctr||v.roas||v.cpm).length

  return (<>
    <Head>
      <title>Be Neude x Growster — Delivery Tracker</title>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Montserrat',sans-serif;background:#050508;color:#fff;min-height:100vh}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#ff0080;border-radius:99px}textarea::placeholder,input::placeholder{color:rgba(255,255,255,0.2)}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </Head>

    <nav style={{position:'sticky',top:0,zIndex:100,background:'rgba(5,5,8,0.92)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,0.06)',padding:'14px 28px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <span style={{fontSize:17,fontWeight:900,letterSpacing:'-0.5px'}}>Growster<span style={{color:'#ff0080'}}>.</span></span>
        <span style={{width:1,height:16,background:'rgba(255,255,255,0.15)',display:'block'}}/>
        <span style={{fontSize:11,color:'rgba(255,255,255,0.35)',fontWeight:600}}>Be Neude · Delivery Tracker</span>
      </div>
      <div style={{display:'flex',gap:8}}>
        <a href="/beneude" style={{padding:'7px 16px',borderRadius:99,border:'1px solid rgba(255,255,255,0.1)',background:'transparent',color:'rgba(255,255,255,0.5)',fontSize:12,fontWeight:700,textDecoration:'none'}}>← Ref Deck</a>
        <button onClick={()=>setShowAvg(!showAvg)} style={{padding:'7px 16px',borderRadius:99,border:'1px solid rgba(255,255,255,0.1)',background:'rgba(255,255,255,0.04)',color:'rgba(255,255,255,0.6)',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'Montserrat,sans-serif'}}>
          Set account averages
        </button>
      </div>
    </nav>

    {showAvg&&(
      <div style={{background:'rgba(139,92,246,0.06)',borderBottom:'1px solid rgba(139,92,246,0.2)',padding:'16px 28px'}}>
        <div style={{fontSize:10,fontWeight:700,color:'#8b5cf6',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:12}}>Your account averages — we compare our videos against these</div>
        <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'flex-end'}}>
          {[{k:'avg_cpm',l:'Avg CPM (₹)'},{k:'avg_ctr',l:'Avg CTR (%)'},{k:'avg_hook_rate',l:'Avg Hook Rate (%)'},{k:'avg_roas',l:'Avg ROAS'},{k:'avg_aov',l:'Avg AOV (₹)'}].map(f=>(
            <div key={f.k} style={{minWidth:120}}>
              <div style={{fontSize:9,fontWeight:700,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:5}}>{f.l}</div>
              <input style={inp} type="number" step="any" value={(avgEdit as any)[f.k]||''} onChange={e=>setAvgEdit(p=>({...p,[f.k]:parseFloat(e.target.value)||null}))} placeholder="0"/>
            </div>
          ))}
          <button onClick={saveAvg} disabled={savingAvg} style={{padding:'9px 20px',borderRadius:99,border:'none',background:'linear-gradient(135deg,#8b5cf6,#6d28d9)',color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'Montserrat,sans-serif'}}>
            {savingAvg?'Saving...':'Save averages'}
          </button>
        </div>
      </div>
    )}

    <div style={{padding:'28px 28px 16px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
      <div style={{fontSize:11,fontWeight:700,color:'#ff0080',letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:8}}>Video Delivery</div>
      <h1 style={{fontSize:26,fontWeight:900,letterSpacing:'-1px',marginBottom:6}}>Be Neude — Delivery Tracker</h1>
      <p style={{fontSize:13,color:'rgba(255,255,255,0.35)',marginBottom:16}}>Every video we've delivered. Add your feedback and performance data directly on each row.</p>
      {videos.length>0&&(
        <div style={{display:'flex',gap:24,flexWrap:'wrap'}}>
          {[{l:'Videos delivered',v:videos.length},{l:'With performance data',v:withPerf},{l:'Pending data',v:videos.length-withPerf}].map(s=>(
            <div key={s.l}>
              <div style={{fontSize:22,fontWeight:900,color:'#fff'}}>{s.v}</div>
              <div style={{fontSize:9,color:'rgba(255,255,255,0.3)',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',marginTop:2}}>{s.l}</div>
            </div>
          ))}
        </div>
      )}
    </div>

    {loading?(
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'80px',gap:10,color:'rgba(255,255,255,0.3)',fontSize:13}}>
        <div style={{width:16,height:16,border:'2px solid rgba(255,0,128,0.3)',borderTop:'2px solid #ff0080',borderRadius:'50%',animation:'spin 1s linear infinite'}}/>
        Loading...
      </div>
    ):videos.length===0?(
      <div style={{textAlign:'center',padding:'80px',color:'rgba(255,255,255,0.2)'}}>
        <div style={{fontSize:32,marginBottom:12}}>📦</div>
        <div>No videos delivered yet.</div>
      </div>
    ):(
      <div style={{padding:'16px 28px 80px'}}>
        <div style={{display:'grid',gap:10}}>
          {videos.map(v=>{
            const isExp = expanded[v.id]
            const hasPerfData = v.ctr||v.roas||v.cpm||v.hook_rate
            const vperf = perf[v.id]||{}
            return (
              <div key={v.id} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,overflow:'hidden'}}>
                <div style={{padding:'14px 18px',display:'grid',gridTemplateColumns:'40px 1fr 1fr 1fr auto',gap:14,alignItems:'start'}}>
                  <div style={{fontSize:13,fontWeight:700,color:'rgba(255,255,255,0.2)',paddingTop:4}}>#{v.sno}</div>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:'#fff',marginBottom:6}}>{v.product_name}</div>
                    {v.video_link?(
                      <a href={v.video_link} target="_blank" rel="noreferrer" style={{fontSize:11,fontWeight:700,color:'#60a5fa',textDecoration:'none'}}>▶ Watch video ↗</a>
                    ):(
                      <span style={{fontSize:11,color:'rgba(255,255,255,0.2)'}}>No link yet</span>
                    )}
                  </div>
                  <div>
                    <div style={{fontSize:9,fontWeight:700,color:'rgba(255,255,255,0.25)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:5}}>
                      Your feedback {savingFb[v.id]&&<span style={{color:'#ff0080'}}>· saving...</span>}
                    </div>
                    <textarea value={fb[v.id]||''} onChange={e=>onFb(v.id,e.target.value)} placeholder="Add your feedback..." rows={2} style={{...inp,resize:'none' as const,lineHeight:1.5,fontSize:12}}/>
                  </div>
                  <div>
                    <div style={{fontSize:9,fontWeight:700,color:'#ff0080',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:5}}>Growster notes</div>
                    <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',lineHeight:1.6,padding:'8px 10px',background:'rgba(255,0,128,0.04)',borderRadius:8,border:'1px solid rgba(255,0,128,0.1)',minHeight:56}}>
                      {v.growster_notes||<span style={{color:'rgba(255,255,255,0.15)',fontStyle:'italic'}}>No notes yet</span>}
                    </div>
                  </div>
                  <div>
                    <button onClick={()=>setExpanded(p=>({...p,[v.id]:!p[v.id]}))}
                      style={{padding:'7px 14px',borderRadius:99,border:`1px solid ${hasPerfData?'rgba(16,185,129,0.3)':'rgba(255,255,255,0.1)'}`,background:hasPerfData?'rgba(16,185,129,0.08)':'transparent',color:hasPerfData?'#10b981':'rgba(255,255,255,0.35)',fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:'Montserrat,sans-serif',whiteSpace:'nowrap' as const}}>
                      {hasPerfData?'📈 Performance':'+ Add performance'} {isExp?'▲':'▼'}
                    </button>
                  </div>
                </div>

                {isExp&&(
                  <div style={{padding:'14px 18px 16px',borderTop:'1px solid rgba(255,255,255,0.06)',background:'rgba(255,255,255,0.02)'}}>
                    <div style={{fontSize:9,fontWeight:700,color:'#8b5cf6',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:12}}>Video performance — enter your data below</div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:10,marginBottom:12}}>
                      {PERF.map(f=>{
                        const val = vperf[f.key]
                        const avg = (avgs as any)[`avg_${f.key}`]
                        const b = badge(v[f.key as keyof Video] as number, avg, f.invert)
                        return (
                          <div key={f.key}>
                            <div style={{fontSize:9,fontWeight:700,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:5}}>
                              {f.label}
                              {b&&<span style={{marginLeft:4,fontSize:8,padding:'1px 5px',borderRadius:99,background:b.better?'rgba(16,185,129,0.15)':'rgba(255,0,128,0.12)',color:b.better?'#10b981':'#ff0080',border:`1px solid ${b.better?'rgba(16,185,129,0.25)':'rgba(255,0,128,0.2)'}`}}>{b.better?'↑':'↓'}{b.pct}%</span>}
                            </div>
                            <input style={{...inp,fontSize:12}} type="number" step="any" value={val??''} onChange={e=>setPerf(p=>({...p,[v.id]:{...p[v.id],[f.key]:parseFloat(e.target.value)||null}}))} placeholder="—"/>
                            {avg&&<div style={{fontSize:8,color:'rgba(255,255,255,0.2)',marginTop:3}}>Acct avg: {f.unit}{avg}</div>}
                          </div>
                        )
                      })}
                    </div>
                    <button onClick={()=>savePerf(v.id)} disabled={savingPerf[v.id]} style={{padding:'8px 20px',borderRadius:99,border:'none',background:'linear-gradient(135deg,#8b5cf6,#6d28d9)',color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'Montserrat,sans-serif'}}>
                      {savingPerf[v.id]?'Saving...':'Save performance data'}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )}

    <div style={{position:'fixed',bottom:0,left:0,right:0,background:'rgba(5,5,8,0.95)',backdropFilter:'blur(20px)',borderTop:'1px solid rgba(255,255,255,0.06)',padding:'11px 28px',display:'flex',gap:20,alignItems:'center'}}>
      <span style={{fontSize:12,fontWeight:700,color:'#10b981'}}>{withPerf} with performance data</span>
      <span style={{fontSize:12,fontWeight:600,color:'rgba(255,255,255,0.25)'}}>{videos.length-withPerf} pending</span>
      <span style={{marginLeft:'auto',fontSize:11,color:'rgba(255,255,255,0.15)'}}>Feedback saves automatically</span>
    </div>
  </>)
}
