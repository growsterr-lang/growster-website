import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'

const SB_URL = 'https://agrctbhbmusxtjstfvst.supabase.co'
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFncmN0YmhibXVzeHRqc3RmdnN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NTcwODgsImV4cCI6MjA4OTMzMzA4OH0.4hXxsswtPE7PUnKNBWEOpiDRT8T2kMO0HaPUQ8fn2pQ'

const PRODUCTS = [
  {key:'all',label:'All'},
  {key:'UN_MASK',label:'Un_Mask'},
  {key:'FACETIME',label:'FaceTime!'},
  {key:'SLEEP_ON_IT',label:'Sleep On It'},
  {key:'TRENDS',label:'Trends'},
]

type Ref = {
  id:number;product:string;ref_no:number;link:string;script:string|null;
  bucket:string;approval_status:string;client_comment:string|null;
  edited:boolean;edit_note:string|null
}

export default function BrandDeck() {
  const [refs,setRefs] = useState<Ref[]>([])
  const [loading,setLoading] = useState(true)
  const [prod,setProd] = useState('all')
  const [view,setView] = useState<'card'|'list'>('card')
  const [idx,setIdx] = useState(0)
  const [saving,setSaving] = useState(false)
  const [fb,setFb] = useState<Record<number,string>>({})
  const [timers,setTimers] = useState<Record<number,any>>({})
  const [showFb,setShowFb] = useState<Record<number,boolean>>({})
  const [exp,setExp] = useState<Record<number,boolean>>({})

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

  const filtered = refs.filter(r=>prod==='all'||r.product===prod)

  useEffect(()=>{ setIdx(0) },[prod])

  const cur = filtered[idx]

  async function setApproval(id:number,status:string) {
    const cur = refs.find(r=>r.id===id)?.approval_status
    const next = cur===status?'pending':status
    setSaving(true)
    await fetch(SB_URL+'/rest/v1/beneude_refs?id=eq.'+id,{
      method:'PATCH',
      headers:{apikey:SB_KEY,Authorization:'Bearer '+SB_KEY,'Content-Type':'application/json',Prefer:'return=minimal'},
      body:JSON.stringify({approval_status:next,reviewed_at:new Date().toISOString()})
    })
    setRefs(p=>p.map(r=>r.id===id?{...r,approval_status:next}:r))
    setSaving(false)
    if(next==='approved'||next==='rejected') {
      setShowFb(p=>({...p,[id]:true}))
    }
    // Auto advance in card view after 600ms
    if(view==='card'&&(next==='approved'||next==='rejected')) {
      setTimeout(()=>{ if(idx<filtered.length-1) setIdx(i=>i+1) },600)
    }
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

  const approved=refs.filter(r=>r.approval_status==='approved').length
  const rejected=refs.filter(r=>r.approval_status==='rejected').length
  const pending=refs.length-approved-rejected
  const pct=refs.length?Math.round(((approved+rejected)/refs.length)*100):0
  const isPint=(u:string)=>u.includes('pin.it')
  const isReq=(s:string|null)=>s&&s.includes('SCRIPT REQ')

  const D = '#050508'
  const pill=(active:boolean,c='#ff0080')=>({
    padding:'6px 14px',borderRadius:99,border:`1px solid ${active?c+'50':'rgba(255,255,255,0.1)'}`,
    background:active?c+'15':'transparent',color:active?c:'rgba(255,255,255,0.4)',
    fontSize:12,fontWeight:700,cursor:'pointer' as const,fontFamily:'Montserrat,sans-serif',transition:'all .2s'
  })

  function RefCard({r}:{r:Ref}) {
    const status=r.approval_status||'pending'
    const isApp=status==='approved', isRej=status==='rejected'
    const req=isReq(r.script)
    const isEdited=r.edited
    return (
      <div style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${isApp?'rgba(16,185,129,0.25)':isRej?'rgba(255,0,128,0.25)':'rgba(255,255,255,0.08)'}`,borderRadius:16,overflow:'hidden'}}>
        {/* Top */}
        <div style={{padding:'14px 16px 12px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <span style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.25)'}}>{PRODUCTS.find(p=>p.key===r.product)?.label} · #{r.ref_no}</span>
              <span style={{fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:99,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.4)'}}>{r.bucket}</span>
              {isEdited&&<span style={{fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:99,background:'rgba(245,158,11,0.1)',border:'1px solid rgba(245,158,11,0.3)',color:'#f59e0b'}}>✏ Updated — please re-review</span>}
            </div>
            {isApp&&<span style={{fontSize:11,fontWeight:700,color:'#10b981',padding:'4px 10px',borderRadius:99,background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.2)'}}>✓ Approved</span>}
            {isRej&&<span style={{fontSize:11,fontWeight:700,color:'#ff0080',padding:'4px 10px',borderRadius:99,background:'rgba(255,0,128,0.08)',border:'1px solid rgba(255,0,128,0.2)'}}>✕ Rejected</span>}
          </div>
          <a href={r.link} target="_blank" rel="noreferrer"
            style={{display:'flex',alignItems:'center',gap:8,padding:'11px 14px',background:'rgba(255,255,255,0.04)',borderRadius:10,textDecoration:'none',fontSize:12,fontWeight:700,color:isPint(r.link)?'#f43f5e':'#60a5fa',border:'1px solid rgba(255,255,255,0.07)'}}>
            <span style={{fontSize:16}}>{isPint(r.link)?'📌':'▶'}</span>
            {isPint(r.link)?'View Pinterest ref':'Watch Instagram Reel'}
            <span style={{marginLeft:'auto',opacity:0.35,fontSize:10}}>↗</span>
          </a>
        </div>

        {/* Script */}
        <div style={{padding:'14px 16px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
          <div style={{fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.25)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:8}}>{req?'✏️ Script needed':'📝 Script'}</div>
          <div style={{
            padding:'12px 14px',background:req?'rgba(139,92,246,0.06)':'rgba(255,255,255,0.03)',
            border:`1px solid ${req?'rgba(139,92,246,0.2)':'rgba(255,255,255,0.07)'}`,borderRadius:10,
            fontSize:12,color:req?'#a78bfa':'rgba(255,255,255,0.6)',lineHeight:1.7,
            maxHeight:exp[r.id]?'none':'90px',overflow:'hidden',position:'relative'
          }}>
            {req?'Script to be written by Growster — visual ref only':r.script||'No script for this ref.'}
            {!req&&r.script&&!exp[r.id]&&<div style={{position:'absolute',bottom:0,left:0,right:0,height:32,background:`linear-gradient(transparent,${D}cc)`}}/>}
          </div>
          {!req&&r.script&&(
            <button onClick={()=>setExp(p=>({...p,[r.id]:!p[r.id]}))}
              style={{background:'none',border:'none',fontFamily:'Montserrat,sans-serif',fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.25)',cursor:'pointer',padding:'6px 0'}}>
              {exp[r.id]?'▲ Show less':'▼ Read full script'}
            </button>
          )}
          {r.edit_note&&<div style={{marginTop:8,padding:'8px 12px',background:'rgba(245,158,11,0.06)',border:'1px solid rgba(245,158,11,0.2)',borderRadius:8,fontSize:11,color:'#f59e0b'}}>Note from Growster: {r.edit_note}</div>}
        </div>

        {/* Actions */}
        <div style={{padding:'14px 16px',display:'flex',gap:10}}>
          <button onClick={()=>setApproval(r.id,'approved')} disabled={saving}
            style={{flex:1,padding:'12px',borderRadius:10,border:`1px solid ${isApp?'rgba(16,185,129,0.4)':'rgba(255,255,255,0.1)'}`,background:isApp?'rgba(16,185,129,0.12)':'rgba(255,255,255,0.03)',color:isApp?'#10b981':'rgba(255,255,255,0.5)',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'Montserrat,sans-serif',transition:'all .2s'}}>
            {saving?'…':'✓ Approve'}
          </button>
          <button onClick={()=>setApproval(r.id,'rejected')} disabled={saving}
            style={{flex:1,padding:'12px',borderRadius:10,border:`1px solid ${isRej?'rgba(255,0,128,0.4)':'rgba(255,255,255,0.1)'}`,background:isRej?'rgba(255,0,128,0.1)':'rgba(255,255,255,0.03)',color:isRej?'#ff0080':'rgba(255,255,255,0.5)',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'Montserrat,sans-serif',transition:'all .2s'}}>
            {saving?'…':'✕ Reject'}
          </button>
        </div>

        {(isApp||isRej||(showFb[r.id]))&&(
          <div style={{padding:'0 16px 14px'}}>
            <textarea value={fb[r.id]||''} onChange={e=>onFb(r.id,e.target.value)}
              placeholder="Add a note or feedback... (auto-saves)" rows={2}
              style={{width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,padding:'10px 12px',fontSize:12,color:'#fff',fontFamily:'Montserrat,sans-serif',outline:'none',resize:'none',lineHeight:1.6,colorScheme:'dark'}}/>
          </div>
        )}
      </div>
    )
  }

  return (<>
    <Head>
      <title>Be Neude × Growster — Ref Deck</title>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Montserrat',sans-serif;background:#050508;color:#fff;min-height:100vh}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#ff0080;border-radius:99px}@keyframes fu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.fu{animation:fu .25s ease both}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </Head>

    {/* Nav */}
    <nav style={{position:'sticky',top:0,zIndex:100,background:'rgba(5,5,8,0.92)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,0.06)',padding:'14px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <span style={{fontSize:17,fontWeight:900,letterSpacing:'-0.5px'}}>Growster<span style={{color:'#ff0080'}}>.</span></span>
        <span style={{width:1,height:16,background:'rgba(255,255,255,0.15)',display:'block'}}/>
        <span style={{fontSize:11,color:'rgba(255,255,255,0.35)',fontWeight:600}}>Be Neude · Ref Deck</span>
      </div>
      <div style={{display:'flex',gap:16,alignItems:'center'}}>
        {[{k:'approved',v:approved,c:'#10b981'},{k:'rejected',v:rejected,c:'#ff0080'},{k:'pending',v:pending,c:'rgba(255,255,255,0.3)'}].map(s=>(
          <div key={s.k} style={{textAlign:'center'}}>
            <div style={{fontSize:18,fontWeight:900,color:s.c,lineHeight:1}}>{s.v}</div>
            <div style={{fontSize:9,color:'rgba(255,255,255,0.25)',textTransform:'uppercase',letterSpacing:'0.12em',marginTop:2,fontWeight:700}}>{s.k}</div>
          </div>
        ))}
      </div>
    </nav>

    {/* Header */}
    <div style={{padding:'24px 24px 16px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
      <div style={{fontSize:11,fontWeight:700,color:'#ff0080',letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:6}}>Reference & Script Approval</div>
      <h1 style={{fontSize:28,fontWeight:900,letterSpacing:'-1px',marginBottom:4}}>Be Neude — Ref Deck</h1>
      <p style={{fontSize:13,color:'rgba(255,255,255,0.35)',marginBottom:16}}>Review each reference and approve or reject. Your feedback saves automatically.</p>

      {/* Progress */}
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
        <div style={{flex:1,height:3,background:'rgba(255,255,255,0.06)',borderRadius:99,overflow:'hidden'}}>
          <div style={{height:'100%',width:`${pct}%`,background:'linear-gradient(90deg,#ff0080,#0050ff)',borderRadius:99,transition:'width .5s'}}/>
        </div>
        <span style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.3)',whiteSpace:'nowrap'}}>{pct}% reviewed</span>
      </div>

      {/* Controls row */}
      <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          {PRODUCTS.map(p=>(
            <button key={p.key} onClick={()=>setProd(p.key)} style={pill(prod===p.key)}>{p.label}</button>
          ))}
        </div>
        {/* View toggle */}
        <div style={{display:'flex',background:'rgba(255,255,255,0.05)',borderRadius:99,padding:3,border:'1px solid rgba(255,255,255,0.08)'}}>
          {[{v:'card',l:'🃏 One by one'},{v:'list',l:'☰ List'}].map(({v,l})=>(
            <button key={v} onClick={()=>setView(v as any)}
              style={{padding:'5px 14px',borderRadius:99,border:'none',background:view===v?'rgba(255,255,255,0.1)':'transparent',color:view===v?'#fff':'rgba(255,255,255,0.4)',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'Montserrat,sans-serif',transition:'all .2s'}}>
              {l}
            </button>
          ))}
        </div>
      </div>
    </div>

    {loading ? (
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'80px',gap:10,color:'rgba(255,255,255,0.3)'}}>
        <div style={{width:16,height:16,border:'2px solid rgba(255,0,128,0.3)',borderTop:'2px solid #ff0080',borderRadius:'50%',animation:'spin 1s linear infinite'}}/>
        Loading refs...
      </div>
    ) : view==='card' ? (
      /* ── CARD VIEW ── */
      <div style={{maxWidth:580,margin:'24px auto',padding:'0 24px 80px'}}>
        {filtered.length===0 ? (
          <div style={{textAlign:'center',padding:'60px',color:'rgba(255,255,255,0.2)'}}>No refs for this product.</div>
        ) : (<>
          <RefCard r={filtered[idx]}/>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:16}}>
            <button onClick={()=>setIdx(i=>Math.max(0,i-1))} disabled={idx===0}
              style={{padding:'9px 20px',borderRadius:99,border:'1px solid rgba(255,255,255,0.1)',background:'transparent',color:idx===0?'rgba(255,255,255,0.15)':'rgba(255,255,255,0.5)',fontSize:12,fontWeight:700,cursor:idx===0?'default':'pointer',fontFamily:'Montserrat,sans-serif'}}>
              ← Prev
            </button>
            <span style={{fontSize:12,fontWeight:700,color:'rgba(255,255,255,0.2)'}}>{idx+1} of {filtered.length}</span>
            <button onClick={()=>setIdx(i=>Math.min(filtered.length-1,i+1))} disabled={idx===filtered.length-1}
              style={{padding:'9px 20px',borderRadius:99,border:'1px solid rgba(255,255,255,0.1)',background:'transparent',color:idx===filtered.length-1?'rgba(255,255,255,0.15)':'rgba(255,255,255,0.5)',fontSize:12,fontWeight:700,cursor:idx===filtered.length-1?'default':'pointer',fontFamily:'Montserrat,sans-serif'}}>
              Next →
            </button>
          </div>
        </>)}
      </div>
    ) : (
      /* ── LIST VIEW ── */
      <div style={{padding:'16px 24px 80px'}}>
        <div style={{fontSize:11,color:'rgba(255,255,255,0.25)',fontWeight:600,marginBottom:12}}>{filtered.length} refs</div>
        <div style={{display:'grid',gap:8}}>
          {filtered.map(r=>{
            const status=r.approval_status||'pending'
            const isApp=status==='approved',isRej=status==='rejected'
            const isPint2=(u:string)=>u.includes('pin.it')
            return (
              <div key={r.id} style={{background:'rgba(255,255,255,0.03)',border:`1px solid ${isApp?'rgba(16,185,129,0.2)':isRej?'rgba(255,0,128,0.2)':'rgba(255,255,255,0.07)'}`,borderLeft:`3px solid ${isApp?'#10b981':isRej?'#ff0080':'rgba(255,255,255,0.08)'}`,borderRadius:12,padding:'12px 16px',display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
                <span style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.25)',minWidth:80}}>{PRODUCTS.find(p=>p.key===r.product)?.label} #{r.ref_no}</span>
                <span style={{fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:99,background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.35)',border:'1px solid rgba(255,255,255,0.08)'}}>{r.bucket}</span>
                {r.edited&&<span style={{fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:99,background:'rgba(245,158,11,0.1)',border:'1px solid rgba(245,158,11,0.25)',color:'#f59e0b'}}>✏ Updated</span>}
                <a href={r.link} target="_blank" rel="noreferrer" style={{fontSize:11,fontWeight:700,color:isPint2(r.link)?'#f43f5e':'#60a5fa',textDecoration:'none'}}>{isPint2(r.link)?'📌 Pinterest':'▶ Reel'} ↗</a>
                <div style={{marginLeft:'auto',display:'flex',gap:6}}>
                  <button onClick={()=>setApproval(r.id,'approved')}
                    style={{padding:'6px 14px',borderRadius:99,border:`1px solid ${isApp?'rgba(16,185,129,0.4)':'rgba(255,255,255,0.1)'}`,background:isApp?'rgba(16,185,129,0.1)':'transparent',color:isApp?'#10b981':'rgba(255,255,255,0.4)',fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:'Montserrat,sans-serif'}}>
                    ✓
                  </button>
                  <button onClick={()=>setApproval(r.id,'rejected')}
                    style={{padding:'6px 14px',borderRadius:99,border:`1px solid ${isRej?'rgba(255,0,128,0.35)':'rgba(255,255,255,0.1)'}`,background:isRej?'rgba(255,0,128,0.08)':'transparent',color:isRej?'#ff0080':'rgba(255,255,255,0.4)',fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:'Montserrat,sans-serif'}}>
                    ✕
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )}

    <div style={{position:'fixed',bottom:0,left:0,right:0,background:'rgba(5,5,8,0.95)',backdropFilter:'blur(20px)',borderTop:'1px solid rgba(255,255,255,0.06)',padding:'11px 24px',display:'flex',gap:20,alignItems:'center'}}>
      <span style={{fontSize:12,fontWeight:700,color:'#10b981'}}>✓ {approved} approved</span>
      <span style={{fontSize:12,fontWeight:700,color:'#ff0080'}}>✕ {rejected} rejected</span>
      <span style={{fontSize:12,fontWeight:600,color:'rgba(255,255,255,0.25)'}}>{pending} pending</span>
      <span style={{marginLeft:'auto',fontSize:11,color:'rgba(255,255,255,0.15)'}}>Saves automatically</span>
    </div>
  </>)
}
