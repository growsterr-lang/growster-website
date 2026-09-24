import Head from 'next/head'
import { useEffect, useState, useCallback, useRef } from 'react'

const CHAPTERS = [
  {
    year: null,
    type: 'intro',
    title: 'Growster.',
    subtitle: 'A story of growth.',
    color1: '#ff0080',
    color2: '#0050ff',
  },
  {
    year: '2019',
    type: 'visual',
    subtitle: 'The Beginning',
    title: 'Random name.\nRandom logo.\nReal intent.',
    body:
      "Harshit had seen enough agencies to know the problem. Nobody was empathising with businesses. They were selling templates. So Harshit started anyway. A random word generator gave the name. A random logo generator gave the logo. Growster was officially in business.",
    color1: '#7dd3fc',
    color2: '#2563eb',
    images: ['/story/2020.jpg'],
    stat: 'No templates. No safety net.',
    mood: 'archival-blue',
  },
  {
    year: '2020',
    type: 'text',
    subtitle: 'The Grind',
    title: 'One person.\n30 websites a month.',
    body:
      "At the height of Covid, Growster was building websites while businesses scrambled to go digital. Harshit was a one-person team making up to 30 websites a month. Hundreds of cold calls a day led to rooms Growster had no business being in — but kept entering.",
    color1: '#f59e0b',
    color2: '#ef4444',
    stat: '100s of cold calls. Zero shortcuts.',
    mood: 'warm-dossier',
  },
  {
    year: '2022',
    type: 'visual',
    subtitle: 'The First Real Bet',
    title: 'Kulcha Bros.\nComics.\nCommentary.\nChaos.',
    body:
      "By 2022, Growster had made over 200 websites and earned its first real social media mandate through Samir Kochhar and Cyrus Sahukar’s Kulcha Bros. Comics, commentary, experiments — everything was used to sell those kulchas. This is when the team began to take shape.",
    color1: '#ff0080',
    color2: '#f59e0b',
    images: ['/story/2022.webp', '/story/2022.jpg'],
    stat: '200+ websites. First true social validation.',
    mood: 'comic-chaos',
  },
  {
    year: '2024',
    type: 'gallery',
    subtitle: 'The Production Era',
    title: 'From posts\nto productions.',
    body:
      "Serious expansion. Social and performance were already making crores for businesses. Now came the plunge into production. With a stronger creative team and sharper collaborators, Growster expanded with intent. RWDY by Vijay Deverakonda trusted Growster with its communication and revenue mandate.",
    color1: '#8b5cf6',
    color2: '#ec4899',
    images: ['/story/2024-1.jpg', '/story/2024-2.png'],
    stat: 'Production wasn’t an add-on. It became the engine.',
    mood: 'filmset',
  },
  {
    year: '2025',
    type: 'gallery',
    subtitle: 'The Acceleration',
    title: 'Snitch.\nThen the table got bigger.',
    body:
      "2025 is where Growster starts getting noticed differently. Snitch comes in for performance creatives. 100+ videos a month. Then Zouk, Virgio, and more. The team grows, the table gets bigger, and the output quality and volume jump massively.",
    color1: '#22c55e',
    color2: '#0050ff',
    images: ['/story/2025-1.JPG', '/story/2025-2.JPG', '/story/2025-3.JPG'],
    stat: '100+ videos a month. Serious output. Serious trust.',
    mood: 'arrival',
  },
  {
    year: '2026',
    type: 'stats',
    subtitle: 'Today',
    title: 'The numbers\nspeak.',
    body: "This is where Growster is. And it’s still early.",
    color1: '#ff0080',
    color2: '#8b5cf6',
    stats: [
      { number: '3000+', label: 'Creatives Made' },
      { number: '₹300Cr+', label: 'Business Impacted' },
      { number: '₹100Cr+', label: 'Ad Spend Handled' },
    ],
    mood: 'clean-future',
  },
  {
    year: null,
    type: 'cta',
    title: 'Your story\nstarts here.',
    body:
      "Growster has been building since 2019. We know what growth looks like. Let’s write your chapter.",
    color1: '#ff0080',
    color2: '#0050ff',
    mood: 'clean-future',
  },
]

function getMoodStyles(mood?: string) {
  switch (mood) {
    case 'archival-blue':
      return {
        frameBg: 'linear-gradient(180deg, rgba(125,211,252,0.10), rgba(37,99,235,0.04))',
        frameBorder: '1px solid rgba(125,211,252,0.18)',
        frameShadow: '0 26px 70px rgba(0,0,0,0.28)',
        imageFilter: 'saturate(0.88) contrast(1.02)',
      }
    case 'warm-dossier':
      return {
        frameBg: 'linear-gradient(180deg, rgba(245,158,11,0.10), rgba(239,68,68,0.04))',
        frameBorder: '1px solid rgba(245,158,11,0.18)',
        frameShadow: '0 26px 70px rgba(0,0,0,0.28)',
        imageFilter: 'sepia(0.08) saturate(0.94)',
      }
    case 'comic-chaos':
      return {
        frameBg: 'linear-gradient(180deg, rgba(255,0,128,0.10), rgba(245,158,11,0.05))',
        frameBorder: '2px solid rgba(255,255,255,0.12)',
        frameShadow: '0 26px 70px rgba(0,0,0,0.32)',
        imageFilter: 'saturate(1.02) contrast(1.06)',
      }
    case 'filmset':
      return {
        frameBg: 'linear-gradient(180deg, rgba(139,92,246,0.10), rgba(236,72,153,0.04))',
        frameBorder: '1px solid rgba(139,92,246,0.18)',
        frameShadow: '0 30px 80px rgba(0,0,0,0.34)',
        imageFilter: 'contrast(1.04) saturate(0.98)',
      }
    case 'arrival':
      return {
        frameBg: 'linear-gradient(180deg, rgba(34,197,94,0.08), rgba(0,80,255,0.05))',
        frameBorder: '1px solid rgba(34,197,94,0.18)',
        frameShadow: '0 32px 90px rgba(0,0,0,0.36)',
        imageFilter: 'contrast(1.06) saturate(1.02)',
      }
    default:
      return {
        frameBg: 'rgba(255,255,255,0.04)',
        frameBorder: '1px solid rgba(255,255,255,0.08)',
        frameShadow: '0 24px 60px rgba(0,0,0,0.24)',
        imageFilter: 'none',
      }
  }
}

function ImageFrame({
  src,
  alt,
  tall = false,
  mood,
}: {
  src: string
  alt: string
  tall?: boolean
  mood?: string
}) {
  const s = getMoodStyles(mood)

  return (
    <div
      style={{
        borderRadius: 22,
        overflow: 'hidden',
        border: s.frameBorder,
        background: s.frameBg,
        aspectRatio: tall ? '4 / 5' : '16 / 9',
        boxShadow: s.frameShadow,
        position: 'relative',
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          filter: s.imageFilter,
        }}
        onError={(e) => {
          ;(e.currentTarget as HTMLImageElement).style.display = 'none'
        }}
      />
    </div>
  )
}

export default function StoryPage() {
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [direction, setDirection] = useState<'down' | 'up'>('down')
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 })
  const targetCursor = useRef({ x: -100, y: -100 })
  const rafRef = useRef<number>()
  const touchStartY = useRef(0)
  const lastWheel = useRef(0)
  const total = CHAPTERS.length

  const goTo = useCallback(
    (index: number, dir: 'down' | 'up') => {
      if (transitioning || index < 0 || index >= total) return
      setTransitioning(true)
      setDirection(dir)
      setTimeout(() => {
        setCurrent(index)
        setTransitioning(false)
      }, 550)
    },
    [transitioning, total]
  )

  const next = useCallback(() => goTo(current + 1, 'down'), [current, goTo])
  const prev = useCallback(() => goTo(current - 1, 'up'), [current, goTo])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault()
        next()
      }
      if (['ArrowUp', 'ArrowLeft'].includes(e.key)) {
        e.preventDefault()
        prev()
      }
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const now = Date.now()
      if (now - lastWheel.current < 900) return
      lastWheel.current = now
      if (e.deltaY > 20) next()
      else if (e.deltaY < -20) prev()
    }

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
    }

    const onTouchEnd = (e: TouchEvent) => {
      const diff = touchStartY.current - e.changedTouches[0].clientY
      if (diff > 50) next()
      else if (diff < -50) prev()
    }

    const onMouse = (e: MouseEvent) => {
      targetCursor.current = { x: e.clientX, y: e.clientY }
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
    }

    const animateCursor = () => {
      setCursorPos((prev) => ({
        x: prev.x + (targetCursor.current.x - prev.x) * 0.15,
        y: prev.y + (targetCursor.current.y - prev.y) * 0.15,
      }))
      rafRef.current = requestAnimationFrame(animateCursor)
    }

    rafRef.current = requestAnimationFrame(animateCursor)
    window.addEventListener('keydown', onKey)
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart)
    window.addEventListener('touchend', onTouchEnd)
    window.addEventListener('mousemove', onMouse)

    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('mousemove', onMouse)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [next, prev])

  const ch = CHAPTERS[current] as any
  const gx = 30 + mousePos.x * 40
  const gy = 30 + mousePos.y * 40

  return (
    <>
      <Head>
    <link rel="icon" type="image/png" href="/Growster-Favicon.png" />
    <link rel="apple-touch-icon" href="/Growster-Favicon.png" />
        <title>Our Story — Growster</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100%;overflow:hidden;font-family:'Montserrat',sans-serif;background:#050508;color:#fff;cursor:none}
        @media(max-width:768px){
          body{cursor:auto}
          .cur,.curdot{display:none}
          .dots{right:14px}
          .scene{padding:1.25rem 1rem 4.5rem}
          .title{letter-spacing:-2px}
          .visual-grid,.gallery-grid{grid-template-columns:1fr!important}
          .content-wrap{padding-top:4.5rem!important;padding-bottom:5rem!important}
          .visual-copy{text-align:left!important}
        }
        .cur{position:fixed;top:0;left:0;width:36px;height:36px;border:1.5px solid rgba(255,0,128,0.7);border-radius:50%;pointer-events:none;z-index:9999;mix-blend-mode:difference}
        .curdot{position:fixed;top:0;left:0;width:5px;height:5px;background:#ff0080;border-radius:50%;pointer-events:none;z-index:10000}
        .prog{position:fixed;top:0;left:0;right:0;height:2px;z-index:50;background:rgba(255,255,255,0.06)}
        .prog-fill{height:100%;background:linear-gradient(90deg,#ff0080,#0050ff);transition:width 0.6s cubic-bezier(0.16,1,0.3,1)}
        .dots{position:fixed;right:24px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:10px;z-index:50}
        .dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.2);cursor:pointer;transition:all 0.3s;border:none;padding:0}
        .dot.on{background:#ff0080;transform:scale(1.6);box-shadow:0 0 8px rgba(255,0,128,0.7)}
        .scene{position:fixed;inset:0;z-index:10;padding:clamp(1.5rem,5vw,4rem)}
        .content-wrap{
          width:100%;
          height:100%;
          overflow-y:auto;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:4.5rem 0 4.25rem;
          scrollbar-width:none;
        }
        .content-wrap::-webkit-scrollbar{display:none}
        .con{max-width:1120px;width:100%}
        .ylabel{font-size:11px;font-weight:800;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:20px;display:flex;align-items:center;justify-content:center;gap:14px}
        .ylabel::before,.ylabel::after{content:'';flex:0 0 44px;height:1px;background:rgba(255,255,255,0.15)}
        .title{font-size:clamp(32px,6.2vw,82px);font-weight:900;line-height:0.96;letter-spacing:-3px;white-space:pre-line;margin-bottom:22px}
        .body{font-size:clamp(13px,1.45vw,16px);color:rgba(255,255,255,0.5);line-height:1.72;max-width:660px;margin:0 auto 18px;font-weight:400}
        .stag{display:inline-block;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.34);padding:6px 16px;border-radius:99px;border:1px solid rgba(255,255,255,0.1)}
        .back{position:fixed;top:22px;left:22px;z-index:50;display:flex;align-items:center;gap:7px;font-size:12px;font-weight:700;color:rgba(255,255,255,0.35);text-decoration:none;transition:color 0.2s;cursor:none}
        .back:hover{color:rgba(255,255,255,0.75)}
        .cbtn{display:inline-flex;align-items:center;gap:8px;padding:15px 34px;border-radius:99px;border:none;background:linear-gradient(135deg,#ff0080,#cc0055);color:#fff;font-size:15px;font-weight:700;cursor:none;font-family:inherit;text-decoration:none;box-shadow:0 0 40px rgba(255,0,128,0.4);transition:all 0.3s}
        .cbtn:hover{transform:translateY(-3px);box-shadow:0 0 60px rgba(255,0,128,0.6)}
        .gbtn{display:inline-flex;align-items:center;gap:8px;padding:15px 28px;border-radius:99px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.04);color:rgba(255,255,255,0.6);font-size:14px;font-weight:600;text-decoration:none;cursor:none;transition:all 0.3s;font-family:inherit}
        .gbtn:hover{border-color:rgba(255,255,255,0.3);color:#fff}
        .hint{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:20;opacity:0.3;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;display:flex;align-items:center;gap:10px}
        .key{border:1px solid rgba(255,255,255,0.3);border-radius:6px;padding:3px 8px;font-size:12px;background:rgba(255,255,255,0.04)}
        .noise{position:fixed;inset:0;z-index:1;pointer-events:none;opacity:0.025;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
        .visual-grid{display:grid;grid-template-columns:1.08fr 0.92fr;gap:18px;align-items:center;margin-top:12px}
        .gallery-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:16px}

        @keyframes chapterFadeUp {
          from { opacity: 0; transform: translateY(28px) scale(0.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chapterFadeLeft {
          from { opacity: 0; transform: translateX(-36px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes chapterFadeRight {
          from { opacity: 0; transform: translateX(36px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes chapterSoftZoom {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .chapter-shell {
          animation: chapterFadeUp 0.72s cubic-bezier(0.16,1,0.3,1);
        }
        .story-head {
          animation: chapterFadeUp 0.68s cubic-bezier(0.16,1,0.3,1);
        }
        .story-copy {
          animation: chapterFadeLeft 0.78s cubic-bezier(0.16,1,0.3,1);
        }
        .story-media {
          animation: chapterFadeRight 0.82s cubic-bezier(0.16,1,0.3,1);
        }
        .story-grid {
          animation: chapterSoftZoom 0.8s cubic-bezier(0.16,1,0.3,1);
        }
        .stag {
          animation: chapterFadeUp 0.9s cubic-bezier(0.16,1,0.3,1);
        }
      `}</style>

      <div className="cur" style={{ transform: `translate(${cursorPos.x - 18}px,${cursorPos.y - 18}px)` }} />
      <div className="curdot" style={{ transform: `translate(${targetCursor.current.x - 2.5}px,${targetCursor.current.y - 2.5}px)` }} />
      <div className="noise" />

      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          transition: 'background 1s ease',
          background: `radial-gradient(ellipse 65% 65% at ${gx}% ${gy}%, ${ch.color1}28 0%, transparent 65%), radial-gradient(ellipse 50% 50% at ${100 - gx}% ${100 - gy}%, ${ch.color2}20 0%, transparent 65%), #050508`,
        }}
      />

      <div className="prog">
        <div className="prog-fill" style={{ width: `${(current / (total - 1)) * 100}%` }} />
      </div>

      <a href="/" className="back">← Back to site</a>

      <div className="dots">
        {CHAPTERS.map((_, i) => (
          <button
            key={i}
            className={`dot${i === current ? ' on' : ''}`}
            onClick={() => goTo(i, i > current ? 'down' : 'up')}
          />
        ))}
      </div>

      <div
        className="scene"
        key={current}
        style={{
          opacity: transitioning ? 0 : 1,
          transform: transitioning
            ? `translateY(${direction === 'down' ? '-30px' : '30px'}) scale(0.985)`
            : 'translateY(0) scale(1)',
          transition: 'opacity 0.56s cubic-bezier(0.16,1,0.3,1), transform 0.56s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div className="content-wrap">
          {ch.type === 'intro' && (
            <div className="con chapter-shell" style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: 'clamp(64px,13vw,150px)',
                  fontWeight: 900,
                  letterSpacing: '-4px',
                  lineHeight: 0.92,
                  marginBottom: 20,
                  background: 'linear-gradient(135deg,#fff 40%,rgba(255,255,255,0.4))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {ch.title}
              </div>
              <p
                style={{
                  fontSize: 'clamp(14px,2vw,22px)',
                  color: 'rgba(255,255,255,0.3)',
                  fontWeight: 300,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  marginBottom: 52,
                }}
              >
                {ch.subtitle}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                <span>Scroll or press</span><span className="key">↓</span><span>to begin</span>
              </div>
            </div>
          )}

          {ch.type === 'visual' && (
            <div className="con chapter-shell">
              <div className="ylabel story-head">{ch.subtitle} · {ch.year}</div>
              <div className="visual-grid">
                <div className="visual-copy story-copy" style={{ textAlign: 'left' }}>
                  <h1
                    className="title"
                    style={{
                      background: `linear-gradient(135deg,#fff 50%,${ch.color1})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textAlign: 'left',
                      fontSize: ch.year === '2019' ? 'clamp(28px,4.5vw,58px)' : 'clamp(30px,5vw,66px)',
                    }}
                  >
                    {ch.title}
                  </h1>
                  <p className="body story-copy" style={{ margin: '0 0 16px', textAlign: 'left', maxWidth: 500 }}>{ch.body}</p>
                  <div className="stag">{ch.stat}</div>
                </div>
                <div className="story-media"><ImageFrame
                  src={Array.isArray(ch.images) ? ch.images[0] : ch.images}
                  alt={ch.year || ch.subtitle}
                  tall
                  mood={ch.mood}
                /></div>
              </div>
            </div>
          )}

          {ch.type === 'text' && (
            <div className="con" style={{ textAlign: 'center', maxWidth: 980 }}>
              <div className="ylabel story-head">{ch.subtitle} · {ch.year}</div>
              <h1
                className="title"
                style={{
                  background: `linear-gradient(135deg,#fff 50%,${ch.color1})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: 'clamp(42px,8vw,108px)',
                  marginBottom: 26,
                }}
              >
                {ch.title}
              </h1>
              <p className="body" style={{ maxWidth: 680, margin: '0 auto 16px' }}>{ch.body}</p>
              <div className="stag">{ch.stat}</div>
            </div>
          )}

          {ch.type === 'gallery' && (
            <div className="con chapter-shell" style={{ textAlign: 'center' }}>
              <div className="ylabel story-head">{ch.subtitle} · {ch.year}</div>
              <h1
                className="title"
                style={{
                  background: `linear-gradient(135deg,#fff 50%,${ch.color1})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {ch.title}
              </h1>
              <p className="body story-copy">{ch.body}</p>
              <div className="stag" style={{ marginBottom: 12 }}>{ch.stat}</div>
              <div className="gallery-grid story-grid">
                {ch.images.map((src: string, i: number) => (
                  <ImageFrame key={i} src={src} alt={`${ch.year}-${i + 1}`} mood={ch.mood} />
                ))}
              </div>
            </div>
          )}

          {ch.type === 'stats' && (
            <div className="con chapter-shell" style={{ textAlign: 'center' }}>
              <div className="ylabel story-head">{ch.subtitle} · {ch.year}</div>
              <h1
                className="title"
                style={{
                  background: `linear-gradient(135deg,#fff 50%,${ch.color1})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {ch.title}
              </h1>
              <p className="body story-copy">{ch.body}</p>
              <div style={{ display: 'flex', gap: 'clamp(20px,5vw,56px)', justifyContent: 'center', flexWrap: 'wrap', marginTop: 8 }}>
                {ch.stats.map((s: any, i: number) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 'clamp(40px,7vw,88px)', fontWeight: 900, lineHeight: 1, color: ch.color1, marginBottom: 6 }}>
                      {s.number}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {ch.type === 'cta' && (
            <div className="con chapter-shell" style={{ textAlign: 'center' }}>
              <h1
                className="title"
                style={{
                  background: `linear-gradient(135deg,#fff 40%,${ch.color1})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  whiteSpace: 'pre-line',
                }}
              >
                {ch.title}
              </h1>
              <p className="body story-copy">{ch.body}</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="mailto:work@growster.in" className="cbtn">Let's grow together →</a>
                <a href="/" className="gbtn">Back to site</a>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="hint">
        {current === 0 ? (
          <>
            <span>Scroll or press</span>
            <span className="key">Space</span>
          </>
        ) : current < total - 1 ? (
          <>
            <span className="key">↑</span>
            <span className="key">↓</span>
            <span style={{ marginLeft: 6 }}>{current + 1} / {total}</span>
          </>
        ) : null}
      </div>
    </>
  )
}
