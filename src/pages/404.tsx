import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [started, setStarted] = useState(false)
  const [dead, setDead] = useState(false)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const gameRef = useRef<any>(null)

  useEffect(() => {
    const best = parseInt(localStorage.getItem('hamster-best') || '0')
    setBest(best)
  }, [])

  useEffect(() => {
    if (!started || dead) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const W = canvas.width = canvas.offsetWidth
    const H = canvas.height = canvas.offsetHeight
    const ground = H * 0.75

    let frame = 0
    let sc = 0
    let speed = 5
    let animId: number

    // Hamster
    const ham = { x: W * 0.15, y: ground, vy: 0, jumping: false, frame: 0 }
    const obstacles: { x: number, w: number, h: number }[] = []
    const clouds: { x: number, y: number, s: number }[] = [
      { x: W * 0.3, y: H * 0.15, s: 1 },
      { x: W * 0.6, y: H * 0.25, s: 0.7 },
      { x: W * 0.8, y: H * 0.1, s: 0.9 },
    ]

    const jump = () => {
      if (!ham.jumping) {
        ham.vy = -16
        ham.jumping = true
      }
    }

    const onKey = (e: KeyboardEvent) => { if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); jump() } }
    const onTouch = () => jump()
    window.addEventListener('keydown', onKey)
    canvas.addEventListener('click', onTouch)

    const drawHamster = (x: number, y: number, legFrame: number) => {
      const lf = Math.floor(legFrame / 8) % 2
      ctx.save()
      ctx.translate(x, y)

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.15)'
      ctx.beginPath()
      ctx.ellipse(2, 4, 20, 6, 0, 0, Math.PI * 2)
      ctx.fill()

      // Body
      ctx.fillStyle = '#f5c27a'
      ctx.beginPath()
      ctx.ellipse(0, -16, 18, 14, 0, 0, Math.PI * 2)
      ctx.fill()

      // Belly
      ctx.fillStyle = '#fde8c0'
      ctx.beginPath()
      ctx.ellipse(2, -14, 10, 9, 0, 0, Math.PI * 2)
      ctx.fill()

      // Head
      ctx.fillStyle = '#f5c27a'
      ctx.beginPath()
      ctx.ellipse(14, -26, 14, 13, 0.3, 0, Math.PI * 2)
      ctx.fill()

      // Ear
      ctx.fillStyle = '#f5a0a0'
      ctx.beginPath()
      ctx.ellipse(20, -36, 6, 5, -0.3, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#f5c27a'
      ctx.beginPath()
      ctx.ellipse(20, -36, 4, 3, -0.3, 0, Math.PI * 2)
      ctx.fill()

      // Eye
      ctx.fillStyle = '#1a0a00'
      ctx.beginPath()
      ctx.arc(20, -28, 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(21, -29, 1, 0, Math.PI * 2)
      ctx.fill()

      // Cheek
      ctx.fillStyle = 'rgba(255,150,150,0.4)'
      ctx.beginPath()
      ctx.ellipse(24, -24, 5, 3, 0, 0, Math.PI * 2)
      ctx.fill()

      // Nose
      ctx.fillStyle = '#ff8080'
      ctx.beginPath()
      ctx.arc(27, -26, 2, 0, Math.PI * 2)
      ctx.fill()

      // Tail
      ctx.strokeStyle = '#f5c27a'
      ctx.lineWidth = 4
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(-16, -16)
      ctx.quadraticCurveTo(-28, -8, -22, 0)
      ctx.stroke()

      // Legs
      ctx.fillStyle = '#f5a855'
      if (lf === 0) {
        ctx.fillRect(-8, -6, 7, 10)
        ctx.fillRect(4, -4, 7, 8)
      } else {
        ctx.fillRect(-8, -4, 7, 8)
        ctx.fillRect(4, -6, 7, 10)
      }

      ctx.restore()
    }

    const drawCactus = (x: number, w: number, h: number) => {
      ctx.fillStyle = '#ff0080'
      ctx.beginPath()
      ctx.roundRect(x, ground - h, w, h, 4)
      ctx.fill()
      ctx.fillStyle = 'rgba(255,255,255,0.15)'
      ctx.fillRect(x + w * 0.3, ground - h, w * 0.2, h)
    }

    const loop = () => {
      ctx.clearRect(0, 0, W, H)

      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, H)
      sky.addColorStop(0, '#050508')
      sky.addColorStop(1, '#1a0a1a')
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, W, H)

      // Stars
      ctx.fillStyle = 'rgba(255,255,255,0.4)'
      for (let i = 0; i < 40; i++) {
        const sx = ((i * 137 + frame * 0.2) % W)
        const sy = (i * 73) % (ground - 20)
        const ss = i % 3 === 0 ? 1.5 : 0.8
        ctx.beginPath()
        ctx.arc(sx, sy, ss, 0, Math.PI * 2)
        ctx.fill()
      }

      // Clouds
      clouds.forEach(c => {
        c.x -= speed * 0.3 * c.s
        if (c.x < -80) c.x = W + 80
        ctx.fillStyle = 'rgba(255,255,255,0.06)'
        ctx.beginPath()
        ctx.ellipse(c.x, c.y, 40 * c.s, 18 * c.s, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.ellipse(c.x + 20 * c.s, c.y - 8 * c.s, 28 * c.s, 14 * c.s, 0, 0, Math.PI * 2)
        ctx.fill()
      })

      // Ground
      const grd = ctx.createLinearGradient(0, ground, 0, H)
      grd.addColorStop(0, 'rgba(255,0,128,0.3)')
      grd.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grd
      ctx.fillRect(0, ground, W, H - ground)
      ctx.strokeStyle = 'rgba(255,0,128,0.6)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, ground)
      ctx.lineTo(W, ground)
      ctx.stroke()

      // Obstacles
      if (frame % Math.max(60, 120 - Math.floor(sc / 5)) === 0 && frame > 60) {
        const h = 30 + Math.random() * 40
        obstacles.push({ x: W + 20, w: 18 + Math.random() * 12, h })
      }
      for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= speed
        drawCactus(obstacles[i].x, obstacles[i].w, obstacles[i].h)
        if (obstacles[i].x < -50) obstacles.splice(i, 1)

        // Collision
        const o = obstacles[i]
        if (o && ham.x + 10 > o.x + 4 && ham.x - 10 < o.x + o.w - 4 && ham.y - 4 > ground - o.h) {
          setDead(true)
          setScore(sc)
          setBest(b => { const nb = Math.max(b, sc); localStorage.setItem('hamster-best', String(nb)); return nb })
          cancelAnimationFrame(animId)
          return
        }
      }

      // Hamster physics
      ham.vy += 0.8
      ham.y += ham.vy
      if (ham.y >= ground) { ham.y = ground; ham.vy = 0; ham.jumping = false }
      ham.frame = frame

      drawHamster(ham.x, ham.y, frame)

      // Score
      sc++
      setScore(sc)
      if (sc % 200 === 0) speed += 0.3

      // Score display
      ctx.fillStyle = 'rgba(255,255,255,0.5)'
      ctx.font = '700 14px Montserrat, sans-serif'
      ctx.letterSpacing = '2px'
      ctx.textAlign = 'right'
      ctx.fillText(`${Math.floor(sc / 10)}`, W - 20, 36)

      frame++
      animId = requestAnimationFrame(loop)
    }

    animId = requestAnimationFrame(loop)
    gameRef.current = { cleanup: () => { cancelAnimationFrame(animId); window.removeEventListener('keydown', onKey); canvas.removeEventListener('click', onTouch) } }
    return () => gameRef.current?.cleanup()
  }, [started, dead])

  const restart = () => { setDead(false); setScore(0); setStarted(true) }

  return (
    <>
      <Head>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <title>404 — Lost in the wheel | Growster</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100%;font-family:'Montserrat',sans-serif;background:#050508;color:#fff;overflow:hidden}
      `}</style>

      <div style={{ position:'fixed', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:0 }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(255,0,128,0.7)', marginBottom:8 }}>Error 404</div>
          <h1 style={{ fontSize:'clamp(32px,6vw,64px)', fontWeight:900, letterSpacing:'-2px', lineHeight:1 }}>
            Page not found.<br />
            <span style={{ background:'linear-gradient(135deg,#ff0080,#0050ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Hamster found.</span>
          </h1>
          <p style={{ fontSize:14, color:'rgba(255,255,255,0.35)', marginTop:12, fontWeight:400 }}>Press <kbd style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:6, padding:'2px 8px', fontSize:12, fontWeight:600 }}>Space</kbd> or tap to jump</p>
        </div>

        {/* Canvas */}
        <div style={{ position:'relative', width:'min(680px, 92vw)', height:220 }}>
          <canvas ref={canvasRef} style={{ width:'100%', height:'100%', borderRadius:20, border:'1px solid rgba(255,0,128,0.2)', display:'block' }} />

          {/* Start screen */}
          {!started && !dead && (
            <div onClick={() => setStarted(true)} style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'rgba(5,5,8,0.85)', borderRadius:20, cursor:'pointer', gap:12 }}>
              <div style={{ fontSize:48 }}>🐹</div>
              <div style={{ fontSize:15, fontWeight:700, color:'rgba(255,255,255,0.8)' }}>Click to start running</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:500 }}>Dodge the obstacles. Don't stop.</div>
            </div>
          )}

          {/* Dead screen */}
          {dead && (
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'rgba(5,5,8,0.9)', borderRadius:20, gap:10 }}>
              <div style={{ fontSize:36 }}>💀</div>
              <div style={{ fontSize:16, fontWeight:800 }}>You got caught</div>
              <div style={{ display:'flex', gap:24, fontSize:13, color:'rgba(255,255,255,0.5)' }}>
                <span>Score: <strong style={{ color:'#ff0080' }}>{Math.floor(score / 10)}</strong></span>
                <span>Best: <strong style={{ color:'#fff' }}>{Math.floor(best / 10)}</strong></span>
              </div>
              <button onClick={restart} style={{ marginTop:6, padding:'9px 24px', borderRadius:99, border:'none', background:'linear-gradient(135deg,#ff0080,#cc0055)', color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>Try again →</button>
            </div>
          )}

          {/* Live score */}
          {started && !dead && (
            <div style={{ position:'absolute', top:12, left:16, fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.35)', letterSpacing:'0.1em' }}>
              SCORE <span style={{ color:'#fff' }}>{Math.floor(score / 10)}</span>
            </div>
          )}
        </div>

        {/* Footer links */}
        <div style={{ display:'flex', gap:16, marginTop:32 }}>
          <a href="/" style={{ fontSize:13, color:'rgba(255,255,255,0.4)', textDecoration:'none', fontWeight:500, transition:'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color='#fff')} onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.4)')}>
            ← Back to home
          </a>
          <span style={{ color:'rgba(255,255,255,0.1)' }}>·</span>
          <a href="mailto:work@growster.in" style={{ fontSize:13, color:'rgba(255,255,255,0.4)', textDecoration:'none', fontWeight:500, transition:'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color='#ff0080')} onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.4)')}>
            work@growster.in
          </a>
        </div>
      </div>
    </>
  )
}
