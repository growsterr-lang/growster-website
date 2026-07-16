import Head from 'next/head'
import { useState, useEffect } from 'react'

const SB_URL = 'https://agrctbhbmusxtjstfvst.supabase.co'
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFncmN0YmhibXVzeHRqc3RmdnN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NTcwODgsImV4cCI6MjA4OTMzMzA4OH0.4hXxsswtPE7PUnKNBWEOpiDRT8T2kMO0HaPUQ8fn2pQ'

const PRODUCTS = [
  {key:'all',label:'All'},
  {key:'UN_MASK',label:'Un_Mask'},
  {key:'FACETIME',label:'FaceTime!'},
  {key:'SLEEP_ON_IT',label:'Sleep On It'},
  {key:'TRENDS',label:'Trends'},
]
const BC: Record<string,string> = {
  'Before and After':'#e07b54','Problem Solving':'#7c3aed',
  'One App Transformation':'#1d6fa4','Milk Based Hook':'#2d7a4f',
  'Absurdity Hooks':'#c0392b','POV Style':'#d97706',
  'ASMR':'#be185d','Side by Side':'#0891b2',
  'Myth Busting':'#374151','This or That':'#6d28d9','Rating System':'#059669',
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
  const buckets=[...new Set(refs.filter(r=>prod==='all'||r.product===prod).map(r=>r.bucket))].sort()
  const approved=refs.filter(r=>r.approval_status==='approved').length
  const rejected=refs.filter(r=>r.approval_status==='rejected').length
  const pending=refs.length-approved-rejected
  const isPint=(u:string)=>u.includes('pin.it')
  const isReq=(s:string|null)=>s&&s.includes('SCRIPT REQ')

  return (<>
    <Head>
      <title>Be Neude x Growster — Ref Deck</title>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{font-family:Montserrat,sans-serif;background:#faf7f4;color:#111}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#c97b5a;border-radius:99px}@keyframes fu{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}.fu{animation:fu .2s ease both}`}</style>
    </Head>

    <div style={{background:'#111',color:'#fff',padding:'16px 24px',position:'sticky',top:0,zIndex:100,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
      <div>
        <div style={{fontSize:16,fontWeight:900,letterSpacing:'-0.5px'}}>Be Neude <span style={{color:'#c97b5a'}}>×</span> Growster</div>
        <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',marginTop:2}}>Reference & Script Approval Deck</div>
      </div>
      <div style={{display:'flex',gap:20}}>
        {[['approved',approved,'#6ee7b7'],['rejected',rejected,'#fca5a5'],['pending',pending,'rgba(255,255,255,0.5)']].map(([k,v,c]:any)=>(
          <div key={k} style={{textAlign:'center',cursor:'pointer'}} onClick={()=>setAppr(appr===k?'all':k)}>
            <div style={{fontSize:20,fontWeight:900,color:c}}>{v}</div>
            <div style={{fontSize:9,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'0.1em'}}>{k}</div>
          </div>
        ))}
      </div>
    </div>

    <div style={{background:'#fff',borderBottom:'1px solid #ede8e1',padding:'12px 24px',display:'flex',gap:6,flexWrap:'wrap',alignItems:'center'}}>
      {PRODUCTS.map(p=>(
        <button key={p.key} onClick={()=>{setProd(p.key);setBucket('all')}}
          style={{padding:'5px 13px',borderRadius:99,border:'1px solid #ddd',background:prod===p.key?'#111':'transparent',color:prod===p.key?'#fff':'#888',fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:'Montserrat,sans-serif',transition:'all .15s'}}>
          {p.label}
        </button>
      ))}
      <div style={{width:1,height:20,background:'#ede8e1',margin:'0 4px'}}/>
      {[['all','All'],['pending','Pending'],['approved','Approved'],['rejected','Rejected']].map(([v,l])=>(
        <button key={v} onClick={()=>setAppr(v)}
          style={{padding:'5px 11px',borderRadius:99,border:'1px solid #ddd',fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:'Montserrat,sans-serif',transition:'all .15s',
            background:appr===v?(v==='approved'?'#2d7a4f':v==='rejected'?'#c0392b':v==='pending'?'#f59e0b':'#111'):'transparent',
            color:appr===v?'#fff':'#888',borderColor:appr===v?'transparent':'#ddd'}}>
          {l}
        </button>
      ))}
      <div style={{width:1,height:20,background:'#ede8e1',margin:'0 4px'}}/>
      <button onClick={()=>setBucket('all')} style={{padding:'5px 11px',borderRadius:99,border:'1px solid #ddd',background:bucket==='all'?'#111':'transparent',color:bucket==='all'?'#fff':'#888',fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:'Montserrat,sans-serif'}}>All buckets</button>
      {buckets.map(b=>(
        <button key={b} onClick={()=>setBucket(b)}
          style={{padding:'5px 11px',borderRadius:99,border:`1px solid ${bucket===b?(BC[b]||'#888'):'#ddd'}`,background:bucket===b?(BC[b]||'#888')+'18':'transparent',color:bucket===b?(BC[b]||'#888'):'#888',fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:'Montserrat,sans-serif',transition:'all .15s'}}>
          {b}
        </button>
      ))}
    </div>

    {loading ? (
      <div style={{textAlign:'center',padding:'80px',color:'#888'}}>Loading refs...</div>
    ) : (
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:14,padding:'20px 24px 80px'}}>
        {filtered.length===0 ? (
          <div style={{gridColumn:'1/-1',textAlign:'center',padding:'60px',color:'#888'}}>No refs match filters.</div>
        ) : filtered.map((r,i)=>{
          const status=r.approval_status||'pending'
          const bc=BC[r.bucket]||'#888'
          const req=isReq(r.script)
          const pname=PRODUCTS.find(p=>p.key===r.product)?.label
          return (
            <div key={r.id} className="fu" style={{animationDelay:`${Math.min(i*0.02,0.4)}s`,background:'#fff',border:`1px solid ${status==='approved'?'#a7d7b8':status==='rejected'?'#f5b8b8':'#ede8e1'}`,borderLeft:`3px solid ${status==='approved'?'#2d7a4f':status==='rejected'?'#c0392b':'#e8e2d9'}`,borderRadius:12,overflow:'hidden',display:'flex',flexDirection:'column'}}>
              <div style={{padding:'12px 14px 8px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{fontSize:11,fontWeight:700,color:'#aaa'}}>{pname} · #{r.ref_no}</div>
                <div style={{fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:99,background:bc+'18',border:`1px solid ${bc}30`,color:bc}}>{r.bucket}</div>
              </div>

              <a href={r.link} target="_blank" rel="noreferrer"
                style={{display:'block',margin:'0 14px 10px',padding:'9px 12px',background:'#faf7f4',borderRadius:8,textDecoration:'none',fontSize:11,fontWeight:600,color:isPint(r.link)?'#c0392b':'#1d6fa4',border:'1px solid #ede8e1',overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>
                {isPint(r.link)?'📌 Pinterest ref':'▶ Instagram Reel'}
              </a>

              {r.script ? (
                <div style={{margin:'0 14px 4px'}}>
                  <div style={{padding:'10px 12px',background:req?'#fdf4ff':'#fffdf8',border:`1px solid ${req?'#e8d5f5':'#ede8d5'}`,borderRadius:8,fontSize:12,color:req?'#7c3aed':'#333',lineHeight:1.65,maxHeight:exp[r.id]?'none':'80px',overflow:'hidden',position:'relative'}}>
                    {req?'✏️ Script required — to be written by Growster':r.script}
                    {!req&&!exp[r.id]&&<div style={{position:'absolute',bottom:0,left:0,right:0,height:28,background:'linear-gradient(transparent,#fffdf8)'}}/>}
                  </div>
                  {!req&&<button onClick={()=>setExp(p=>({...p,[r.id]:!p[r.id]}))} style={{background:'none',border:'none',fontFamily:'Montserrat,sans-serif',fontSize:10,fontWeight:700,color:'#c97b5a',cursor:'pointer',padding:'4px 0',display:'block'}}>{exp[r.id]?'▲ Show less':'▼ Full script'}</button>}
                </div>
              ) : (
                <div style={{margin:'0 14px 10px',padding:'8px 12px',background:'#f7f5f2',borderRadius:8,fontSize:11,color:'#aaa',fontStyle:'italic'}}>Visual reference only</div>
              )}

              <div style={{padding:'10px 14px',borderTop:'1px solid #f0ebe4',display:'flex',gap:8,marginTop:'auto'}}>
                <button onClick={()=>setApproval(r.id,'approved')} disabled={saving[r.id]}
                  style={{flex:1,padding:'8px',borderRadius:8,border:`1px solid ${status==='approved'?'#a7d7b8':'#ddd'}`,background:status==='approved'?'#e6f4ed':'transparent',color:status==='approved'?'#2d7a4f':'#888',fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:'Montserrat,sans-serif',transition:'all .15s'}}>
                  {saving[r.id]?'…':'✓ Approve'}
                </button>
                <button onClick={()=>setApproval(r.id,'rejected')} disabled={saving[r.id]}
                  style={{flex:1,padding:'8px',borderRadius:8,border:`1px solid ${status==='rejected'?'#f5b8b8':'#ddd'}`,background:status==='rejected'?'#fdeaea':'transparent',color:status==='rejected'?'#c0392b':'#888',fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:'Montserrat,sans-serif',transition:'all .15s'}}>
                  {saving[r.id]?'…':'✕ Reject'}
                </button>
              </div>

              {status!=='pending'&&(
                <div style={{padding:'0 14px 12px'}}>
                  <textarea value={fb[r.id]||''} onChange={e=>onFb(r.id,e.target.value)}
                    placeholder="Add feedback (auto-saves)..." rows={2}
                    style={{width:'100%',background:'rgba(0,0,0,0.04)',border:'1px solid #e0dbd5',borderRadius:8,padding:'8px 10px',fontSize:12,color:'#111',fontFamily:'Montserrat,sans-serif',outline:'none',resize:'none',marginTop:8,lineHeight:1.5}}/>
                </div>
              )}
            </div>
          )
        })}
      </div>
    )}

    <div style={{position:'fixed',bottom:0,left:0,right:0,background:'#fff',borderTop:'1px solid #ede8e1',padding:'10px 24px',display:'flex',gap:24,fontSize:12,fontWeight:600}}>
      <span style={{color:'#2d7a4f'}}>✓ {approved} approved</span>
      <span style={{color:'#c0392b'}}>✕ {rejected} rejected</span>
      <span style={{color:'#888'}}>– {pending} pending</span>
      <span style={{marginLeft:'auto',color:'#aaa',fontSize:11,fontWeight:500}}>Changes save automatically</span>
    </div>
  </>)
}
