import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'

const BRAND_LOGOS = [
  { src: '/brands/Snitch.png', name: 'Snitch' },
  { src: '/brands/virgio.png', name: 'Virgio' },
  { src: '/brands/rwdy.png', name: 'RWDY' },
  { src: '/brands/samsung.png', name: 'Samsung' },
  { src: '/brands/google.png', name: 'Google' },
  { src: '/brands/troogood.png', name: 'Troo Good' },
  { src: '/brands/skyhigh.png', name: 'Sky High' },
  { src: '/brands/Snitch2.png', name: 'Snitch' },
]

const SERVICES = [
  { icon: '📱', title: 'Social Media', desc: 'Content strategy, community building, and platform-native creative that makes your brand impossible to scroll past.', color: '#ff0080', accent: 'rgba(255,0,128,0.15)' },
  { icon: '⚡', title: 'Performance Marketing', desc: 'Data-driven paid campaigns on Meta and Google. Every rupee tracked, every creative tested, every result owned.', color: '#0050ff', accent: 'rgba(0,80,255,0.15)' },
  { icon: '🎬', title: 'Ad Films', desc: "From concept to camera to cut — we produce films that don't just look good, they convert.", color: '#8b5cf6', accent: 'rgba(139,92,246,0.15)' },
  { icon: '🎯', title: 'Performance Content', desc: 'UGC, product shoots, reels, and motion — content engineered specifically to perform in paid environments.', color: '#f59e0b', accent: 'rgba(245,158,11,0.15)' },
]


const TEAM = [
  { name:'Gayatri', role:'Head of Brand Communications', img:'/Gayatri_PFP.jpg.jpeg', fun:'Always has food or a cocktail glass in front of her', color:'#ff0080', emoji:'🍸' },
  { name:'Kriti', role:'Head of Creative Production', img:'/Kriti.png', fun:'Started as an intern. Now she runs the show.', color:'#8b5cf6', emoji:'👑' },
  { name:'Ishika', role:'Sr. Video Editor', img:'/Ishika.jpeg', fun:'Loves transitions. Transitioning into being a nicer person.', color:'#0050ff', emoji:'✂️' },
  { name:'Mayank', role:'Video Editor', img:'/Mayank.png', fun:'Looks 20 years younger when he shaves.', color:'#f59e0b', emoji:'🪒' },
  { name:'Prachi', role:'PR & Relationships', img:'/Prachi.jpeg', fun:"In a new city everyday. No idea how she affords it.", color:'#10b981', emoji:'✈️' },
  { name:'Suraj', role:'Video Editor', img:'/Suraj.jpeg', fun:'Loves Stranger Things. Which is ironic because he is a strange thing.', color:'#ec4899', emoji:'👁️' },
  { name:'Aryan', role:'Graphic Design', img:'/Aryan.png', fun:"HUGE Jackie Shroff fan. He's from Mumbai. Makes sense.", color:'#f97316', emoji:'🎨' },
  { name:'Sukh', role:'Chief Cinematographer', img:'/Sukh.jpeg', fun:"Loves to be behind the camera, hates white lights. Don't ask him the difference between ISO and EV. Please.", color:'#06b6d4', emoji:'🎬' },
]

const STATS = [
  { number: '3000+', label: 'Creatives Made', color: '#ff0080' },
  { number: '50+', label: 'Brands Scaled', color: '#0050ff' },
  { number: '₹10Cr+', label: 'Ad Spend Managed', color: '#8b5cf6' },
  { number: '4x', label: 'Average ROAS', color: '#f59e0b' },
]

export default function TestSite() {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 })
  const [cursorHover, setCursorHover] = useState(false)
  const [activeService, setActiveService] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name:'', brand:'', email:'', phone:'', message:'' })
  const [formStatus, setFormStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle')
  const [isMobile, setIsMobile] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [activeSection, setActiveSection] = useState('services')
  const [navHidden, setNavHidden] = useState(false)
  const [counted, setCounted] = useState(false)
  const [counts, setCounts] = useState([0, 0, 0, 0])
  const statsRef = useRef<HTMLDivElement>(null)
  const magnetRefs = useRef<(HTMLElement | null)[]>([])
  const teamScrollRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const dragStart = useRef(0)
  const targetCursor = useRef({ x: -100, y: -100 })
  const rafRef = useRef<number>()

  useEffect(() => {
    let movePending = false
    const onMove = (e: MouseEvent) => {
      targetCursor.current = { x: e.clientX, y: e.clientY }
      if (!movePending) {
        movePending = true
        requestAnimationFrame(() => {
          setMouse({ x: targetCursor.current.x / window.innerWidth, y: targetCursor.current.y / window.innerHeight })
          movePending = false
        })
      }
    }
    const animateCursor = () => {
      setCursorPos(prev => ({
        x: prev.x + (targetCursor.current.x - prev.x) * 0.18,
        y: prev.y + (targetCursor.current.y - prev.y) * 0.18,
      }))
      rafRef.current = requestAnimationFrame(animateCursor)
    }
    rafRef.current = requestAnimationFrame(animateCursor)

    // Scroll handler — drives gradient on mobile, parallax on desktop
    let lastScrollY = window.scrollY
    const onScroll = () => {
      const sy = window.scrollY
      setScrollY(sy)

      if (window.innerWidth < 768) {
        const total = Math.max(document.body.scrollHeight - window.innerHeight, 1)
        const pct = sy / total
        setMouse({ x: 0.3 + Math.sin(pct * Math.PI * 3) * 0.4, y: 0.2 + pct * 0.6 })
      }

      setNavHidden(sy > lastScrollY && sy > 120)
      lastScrollY = sy

      const sections = ['services', 'content', 'work', 'contact']
      const checkpoint = sy + window.innerHeight * 0.35
      for (const id of sections) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.offsetTop
        const bottom = top + el.offsetHeight
        if (checkpoint >= top && checkpoint < bottom) {
          setActiveSection(id)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Mobile detection
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Section reveal system
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })

    document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el))

    const addHover = () => setCursorHover(true)
    const removeHover = () => setCursorHover(false)
    const attachHover = () => {
      document.querySelectorAll('a, button, [data-hover]').forEach(el => {
        el.addEventListener('mouseenter', addHover)
        el.addEventListener('mouseleave', removeHover)
      })
    }
    attachHover()
    window.addEventListener('mousemove', onMove)
    // Counter animation on scroll
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !counted) {
        setCounted(true)
        const targets = [3000, 50, 10, 4]
        const suffixes = ['+', '+', 'Cr+', 'x']
        targets.forEach((target, i) => {
          let start = 0
          const duration = 2000
          const step = 16
          const increment = target / (duration / step)
          const timer = setInterval(() => {
            start += increment
            if (start >= target) { start = target; clearInterval(timer) }
            setCounts(prev => { const n = [...prev]; n[i] = Math.floor(start); return n })
          }, step)
        })
      }
    }, { threshold: 0.3 })
    if (statsRef.current) observer.observe(statsRef.current)

    // Magnetic buttons — single global handler
    const magnetHandlers: Array<{ el: Element, move: (e: MouseEvent) => void, leave: EventListener }> = []
    const onMagnet = (e: MouseEvent) => {
      document.querySelectorAll('.mag-btn').forEach(btn => {
        const rect = btn.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = e.clientX - cx
        const dy = e.clientY - cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        ;(btn as HTMLElement).style.transform = dist < 100
          ? `translate(${dx * (1 - dist / 100) * 0.4}px, ${dy * (1 - dist / 100) * 0.4}px)`
          : ''
      })
    }
    window.addEventListener('mousemove', onMagnet, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', checkMobile)
      observer.disconnect()
      revealObserver.disconnect()
      window.removeEventListener('mousemove', onMagnet)
    }
  }, [])

  const gx = 25 + mouse.x * 50
  const gy = 25 + mouse.y * 50
  const gx2 = 75 - mouse.x * 50
  const gy2 = 75 - mouse.y * 50

  return (
    <>
      <Head>
        <title>Growster — Growth Marketing</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Montserrat', sans-serif; background: #050508; color: #fff; overflow-x: hidden; cursor: none; }
        @media (max-width: 768px) {
          body { cursor: auto; }
          .cursor, .cursor-dot { display: none; }
          .desktop-nav { display: none !important; }
          nav { top: 10px !important; padding: 8px 8px 8px 16px !important; }
          .big { font-size: clamp(34px,10vw,52px) !important; letter-spacing:-1.5px !important; }
          section { padding: 64px 20px !important; }
          .scard { padding: 1.5rem !important; }
          .stcard { padding: 1.25rem !important; }
          .ig-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
          .cta-row { flex-direction: column !important; align-items: stretch !important; gap: 10px !important; }
          .cta-row a { justify-content: center !important; }
          .scroll-indicator { display: none !important; }
          .footer-inner { flex-direction: column !important; align-items: center !important; text-align: center !important; }
          .why-grid { grid-template-columns: 1fr !important; }
          .brand-strip-item { height: 70px !important; width: 150px !important; margin: 0 20px !important; }
          .big3k { font-size: clamp(80px,20vw,140px) !important; letter-spacing:-4px !important; }
          .hero-sub { font-size: 15px !important; max-width: 100% !important; }
          .pill-tags { gap: 6px !important; }
          .services-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .big { font-size: clamp(28px,9vw,40px) !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .ig-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(#ff0080, #0050ff); border-radius: 99px; }
        ::selection { background: rgba(255,0,128,0.3); }

        .cursor {
          position: fixed; top: 0; left: 0; width: 38px; height: 38px;
          border: 1.5px solid rgba(255,0,128,0.7); border-radius: 50%;
          pointer-events: none; z-index: 9999;
          transition: width 0.3s, height 0.3s, background 0.3s, border-color 0.3s;
          mix-blend-mode: difference;
        }
        .cursor.hover { width: 60px; height: 60px; background: rgba(255,0,128,0.08); border-color: #ff0080; }
        .cursor-dot {
          position: fixed; top: 0; left: 0; width: 5px; height: 5px;
          background: #ff0080; border-radius: 50%; pointer-events: none; z-index: 10000;
        }

        .glass {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.09);
        }

        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes marquee-r { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        .marquee-t { display: flex; animation: marquee 28s linear infinite; width: max-content; }
        .marquee-tr { display: flex; animation: marquee-r 32s linear infinite; width: max-content; }

        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-18px); } }
        @keyframes float2 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes fadeUp { from { opacity:0; transform: translateY(36px); } to { opacity:1; transform: translateY(0); } }
        @keyframes glow { 0%,100% { opacity:0.5; } 50% { opacity:1; } }

        .animate-1 { opacity:0; animation: fadeUp 1s 0.15s cubic-bezier(0.16,1,0.3,1) forwards; }
        .animate-2 { opacity:0; animation: fadeUp 1s 0.3s cubic-bezier(0.16,1,0.3,1) forwards; }
        .animate-3 { opacity:0; animation: fadeUp 1s 0.45s cubic-bezier(0.16,1,0.3,1) forwards; }
        .animate-4 { opacity:0; animation: fadeUp 1s 0.6s cubic-bezier(0.16,1,0.3,1) forwards; }
        .animate-5 { opacity:0; animation: fadeUp 1s 0.75s cubic-bezier(0.16,1,0.3,1) forwards; }

        .pill {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.15em;
          text-transform: uppercase; color: #ff0080;
          padding: 5px 14px; border-radius: 99px;
          background: rgba(255,0,128,0.1); border: 1px solid rgba(255,0,128,0.2);
          margin-bottom: 16px;
        }

        .big { font-size: clamp(34px,5.5vw,68px); font-weight:700; line-height:1.02; letter-spacing:-2px; }

        .brand-grad {
          background: linear-gradient(135deg, #ff0080, #0050ff);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        .cta-p {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 28px; border-radius: 99px; border: none;
          background: linear-gradient(135deg, #ff0080, #cc0055);
          color: #fff; font-size: 14px; font-weight: 700;
          cursor: none; font-family: inherit; text-decoration: none;
          transition: transform 0.2s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s, background 0.25s;
          box-shadow: 0 0 28px rgba(255,0,128,0.35), 0 4px 16px rgba(255,0,128,0.2);
        }
        .cta-p:hover { transform: translateY(-2px); box-shadow: 0 0 48px rgba(255,0,128,0.55), 0 8px 24px rgba(255,0,128,0.35); }

        .cta-g {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 28px; border-radius: 99px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.75); font-size: 14px; font-weight: 600;
          cursor: none; font-family: inherit; text-decoration: none; transition: all 0.25s;
        }
        .cta-g:hover { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.08); color: #fff; transform: translateY(-2px); }

        .nav-pill {
          color: rgba(255,255,255,0.5); text-decoration: none;
          font-size: 13px; font-weight: 500;
          padding: 6px 14px; border-radius: 99px;
          transition: all 0.2s; cursor: none;
        }
        .nav-pill:hover { color: #fff; background: rgba(255,255,255,0.08); }

        .scard {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 26px; padding: 2.25rem;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
          position: relative; overflow: hidden; cursor: none;
        }
        .scard:hover { transform: translateY(-6px); border-color: rgba(255,255,255,0.14); box-shadow: 0 24px 60px rgba(0,0,0,0.4); }

        .stcard {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 22px; padding: 2rem; text-align: center;
          position: relative; overflow: hidden; transition: all 0.3s;
        }
        .stcard:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.14); }

        .igcard {
          position: relative; border-radius: 20px; overflow: hidden;
          aspect-ratio: 1; cursor: none;
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .igcard:hover { transform: scale(1.03); }
        .igcard-inner { width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:1.5rem; min-height:180px; }
        .igcard-overlay {
          position:absolute; inset:0;
          background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%);
          opacity:0; transition: opacity 0.3s;
          display:flex; align-items:flex-end; padding:1.25rem;
        }
        .igcard:hover .igcard-overlay { opacity:1; }

        .divider { height:1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent); }

        input, textarea {
          width:100%; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1); border-radius:12px;
          padding:13px 16px; font-size:14px; font-family:inherit;
          color:#fff; outline:none; transition:all 0.2s; cursor:text;
        }
        input:focus, textarea:focus { border-color: rgba(255,0,128,0.6); box-shadow: 0 0 0 3px rgba(255,0,128,0.1); background: rgba(255,255,255,0.07); }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.25); }
        textarea { resize:vertical; min-height:120px; }

        .premium-nav {
          transition: transform 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease, background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
          box-shadow: 0 18px 60px rgba(0,0,0,0.22);
        }
        .premium-nav.nav-hidden {
          transform: translateX(-50%) translateY(-120%);
          opacity: 0.72;
        }
        .nav-pill.active {
          color: #fff;
          background: rgba(255,255,255,0.09);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.07);
        }

        [data-reveal] {
          opacity: 0;
          transform: translateY(38px) scale(0.985);
          transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1);
          will-change: transform, opacity;
        }
        [data-reveal].is-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .text-reveal {
          overflow: hidden;
        }
        .text-reveal > span {
          display: inline-block;
          transform: translateY(110%);
          opacity: 0;
          animation: textLift 1s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        .text-reveal.delay-1 > span { animation-delay: 0.18s; }
        .text-reveal.delay-2 > span { animation-delay: 0.34s; }
        .text-reveal.delay-3 > span { animation-delay: 0.5s; }

        @keyframes textLift {
          to { transform: translateY(0); opacity: 1; }
        }

        .mag-btn, .nav-pill, .igcard, .scard, .stcard, .premium-media {
          will-change: transform;
        }

        .interactive-card {
          transform-style: preserve-3d;
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s ease, border-color 0.35s ease;
        }
        .interactive-card:hover {
          box-shadow: 0 28px 80px rgba(0,0,0,0.42);
        }
        .interactive-card::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.13), transparent 40%);
          opacity: 0;
          transition: opacity 0.25s ease;
          pointer-events: none;
        }
        .interactive-card:hover::after {
          opacity: 1;
        }

        .premium-media {
          overflow: hidden;
          position: relative;
        }
        .premium-media img {
          transition: transform 0.8s cubic-bezier(0.16,1,0.3,1), filter 0.45s ease;
          filter: saturate(0.96) contrast(1.02);
        }
        .premium-media:hover img {
          transform: scale(1.045);
          filter: saturate(1.05) contrast(1.08);
        }
        .premium-media::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.04), transparent 28%, rgba(0,0,0,0.08));
          opacity: 0.8;
          pointer-events: none;
          z-index: 1;
        }

        .play-pulse {
          animation: pulseSoft 2.4s ease-in-out infinite;
        }
        @keyframes pulseSoft {
          0%,100% { transform: scale(1); box-shadow: 0 8px 30px rgba(0,0,0,0.25); }
          50% { transform: scale(1.045); box-shadow: 0 10px 42px rgba(255,0,128,0.16), 0 8px 30px rgba(0,0,0,0.25); }
        }

        .marquee-t:hover, .marquee-tr:hover {
          animation-play-state: paused;
        }

        .bg-noise {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.035;
          mix-blend-mode: soft-light;
          background-image:
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.8) 0.6px, transparent 0.8px),
            radial-gradient(circle at 80% 30%, rgba(255,255,255,0.8) 0.6px, transparent 0.8px),
            radial-gradient(circle at 50% 80%, rgba(255,255,255,0.8) 0.6px, transparent 0.8px);
          background-size: 18px 18px, 22px 22px, 26px 26px;
        }

        .cta-p, .cta-g {
          position: relative;
          overflow: hidden;
        }
        .cta-p::after, .cta-g::after {
          content: '';
          position: absolute;
          top: 0;
          left: -130%;
          width: 80%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          transform: skewX(-20deg);
          transition: left 0.55s ease;
        }
        .cta-p:hover::after, .cta-g:hover::after {
          left: 150%;
        }


        /* Team scroller */
        .team-scroll {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding-bottom: 16px;
          scrollbar-width: none;
          -ms-overflow-style: none;
          cursor: grab;
        }
        .team-scroll:active { cursor: grabbing; }
        .team-scroll::-webkit-scrollbar { display: none; }

        .team-card {
          flex-shrink: 0;
          width: 280px;
          border-radius: 28px;
          overflow: hidden;
          position: relative;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          transition: transform 0.45s cubic-bezier(0.16,1,0.3,1), border-color 0.3s, box-shadow 0.4s;
          cursor: none;
        }
        .team-card:hover {
          transform: translateY(-10px) scale(1.02);
          border-color: rgba(255,255,255,0.15);
          box-shadow: 0 32px 80px rgba(0,0,0,0.5);
        }
        .team-card-img {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
          object-position: top;
          display: block;
          transition: transform 0.8s cubic-bezier(0.16,1,0.3,1), filter 0.4s;
          filter: saturate(0.9);
        }
        .team-card:hover .team-card-img {
          transform: scale(1.06);
          filter: saturate(1.05);
        }
        .team-card-info {
          padding: 18px 20px 20px;
          position: relative;
        }
        .team-card-fun {
          position: absolute;
          inset: 0;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          background: linear-gradient(to top, rgba(5,5,8,0.97) 0%, rgba(5,5,8,0.7) 60%, transparent 100%);
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .team-card:hover .team-card-fun { opacity: 1; }
        .team-card:hover .team-card-info { opacity: 0; }
        .team-card-info { transition: opacity 0.25s ease; }

        @media (max-width: 768px) {
          .team-card { width: 220px; }
        }
        @media (max-width: 768px) {
          [data-reveal] {
            transform: translateY(22px) scale(0.99);
          }
          .premium-nav.nav-hidden {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        }
      `}</style>

      {/* Cursor */}
      <div className={`cursor${cursorHover ? ' hover' : ''}`} style={{ transform: `translate(${cursorPos.x - 19}px, ${cursorPos.y - 19}px)` }} />
      <div className="cursor-dot" style={{ transform: `translate(${targetCursor.current.x - 2.5}px, ${targetCursor.current.y - 2.5}px)` }} />

      {/* Dynamic gradient bg */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 65% 65% at ${gx}% ${gy}%, rgba(255,0,128,0.26) 0%, transparent 65%),
          radial-gradient(ellipse 55% 55% at ${gx2}% ${gy2}%, rgba(0,80,255,0.22) 0%, transparent 65%),
          radial-gradient(ellipse 35% 35% at 50% 55%, rgba(139,92,246,0.1) 0%, transparent 70%),
          #050508
        `,
        transition: 'background 0.08s linear',
      }} />

      <div className="bg-noise" />

      {/* Floating orbs */}
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'6%', left:'2%', width:'42vw', height:'42vw', borderRadius:'50%', background:'radial-gradient(circle, rgba(255,0,128,0.12) 0%, transparent 70%)', animation:'float 9s ease-in-out infinite', filter:'blur(24px)' }} />
        <div style={{ position:'absolute', bottom:'4%', right:'2%', width:'38vw', height:'38vw', borderRadius:'50%', background:'radial-gradient(circle, rgba(0,80,255,0.12) 0%, transparent 70%)', animation:'float2 11s ease-in-out infinite', filter:'blur(24px)' }} />
        <div style={{ position:'absolute', top:'42%', right:'12%', width:'22vw', height:'22vw', borderRadius:'50%', background:'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', animation:'float 14s ease-in-out infinite reverse', filter:'blur(16px)' }} />
      </div>

      <div style={{ position:'relative', zIndex:1 }}>

        {/* NAV */}
        <nav className={`glass premium-nav${navHidden ? ' nav-hidden' : ''}`} style={{ position:'fixed', top: isMobile ? 12 : 18, left:'50%', transform:'translateX(-50%)', zIndex:100, borderRadius:99, padding: isMobile ? '9px 9px 9px 18px' : '10px 10px 10px 22px', display:'flex', alignItems:'center', gap:4, width:'min(720px, calc(100vw - 24px))' }}>
          <div style={{ flex:1, display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:16, fontWeight:800, color:'#fff', letterSpacing:'-0.5px' }}>Growster<span style={{ color:'#ff0080' }}>.</span></span>
          </div>
          <div className="desktop-nav" style={{ display:'flex', gap:2 }}>
            {[
              ['Services','services'],
              ['Work','work'],
              ['Content','content'],
              ['Contact','contact']
            ].map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                className={`nav-pill ${activeSection === id ? 'active' : ''}`}
              >
                {label}
              </a>
            ))}
            <a href="/story" className="nav-pill" style={{ color:'rgba(255,255,255,0.7)' }}>Our Story</a>
          </div>
          <a href="mailto:work@growster.in" className="cta-p" style={{ padding:'8px 18px', fontSize:12, marginLeft:8 }}>Let's talk →</a>
        </nav>

        {/* HERO */}
        <section data-reveal style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding: isMobile ? '120px 20px 60px' : '140px 24px 80px', textAlign:'center', position:'relative' }}>
          <div className="pill animate-1">
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#ff0080', display:'inline-block', animation:'glow 2s ease-in-out infinite' }} />
            Growth Marketing Company
          </div>
          <h1 className="big animate-2 text-reveal delay-1" style={{ maxWidth:880, margin:'0 auto 6px', transform:`translateY(${scrollY * 0.15}px)`, transition:'transform 0.1s linear' }}><span>We don't manage brands.</span></h1>
          <h1 className="big brand-grad animate-3 text-reveal delay-2" style={{ maxWidth:880, margin:'0 auto 24px', transform:`translateY(${scrollY * 0.1}px)`, transition:'transform 0.1s linear' }}><span>We grow them.</span></h1>
          <div className="animate-4" style={{ margin:'0 auto 36px', maxWidth: isMobile ? '100%' : 720 }}>
            <p style={{ fontSize: isMobile ? 15 : 17, color:'rgba(255,255,255,0.78)', maxWidth: isMobile ? '100%' : 640, margin:'0 auto 12px', lineHeight:1.8, fontWeight:500 }}>
              Performance creative for brands that are already spending — and want to scale harder.
            </p>
            <p style={{ fontSize: isMobile ? 13 : 14, color:'rgba(255,255,255,0.38)', maxWidth: isMobile ? '100%' : 640, margin:'0 auto', lineHeight:1.8, fontWeight:400 }}>
              Strategy + production + paid media under one roof. Built for D2C, fashion, hospitality, and consumer brands.
            </p>
          </div>
          <div className="cta-row animate-5" style={{ display:'flex', flexDirection: isMobile ? 'column' : 'row', gap:12, alignItems:'center', justifyContent:'center', marginBottom: isMobile ? 48 : 80 }}>
            <a href="mailto:work@growster.in" className="cta-p mag-btn">Start growing →</a>
            <a href="#work" className="cta-g mag-btn">See our work</a>
          </div>

          {/* Brand strip */}
          <div style={{ width:'100%', maxWidth:1000 }}>
            <p style={{ fontSize:10, color:'rgba(255,255,255,0.22)', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:22, fontWeight:700 }}>Trusted by India's best</p>
            <div style={{ overflow:'hidden', maskImage:'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)', WebkitMaskImage:'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)' }}>
              <div className="marquee-t">
                {[...BRAND_LOGOS, ...BRAND_LOGOS, ...BRAND_LOGOS].map((b, i) => (
                  <div key={i} style={{ margin:'0 24px', flexShrink:0, height:40, display:'flex', alignItems:'center', opacity:0.55, transition:'opacity 0.2s', filter:'brightness(0) invert(1)' }}
                    data-hover onMouseEnter={e => (e.currentTarget.style.opacity='1')} onMouseLeave={e => (e.currentTarget.style.opacity='0.55')}>
                    <img src={b.src} alt={b.name} style={{ width:'80%', height:'80%', objectFit:'contain', filter:'brightness(10) saturate(0)' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='scroll-indicator' style={{ position:'absolute', bottom:28, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:8, opacity:0.25 }}>
            <span style={{ fontSize:10, letterSpacing:'0.15em', textTransform:'uppercase', fontWeight:600 }}>Scroll</span>
            <div style={{ width:1, height:36, background:'linear-gradient(to bottom, #fff, transparent)' }} />
          </div>
        </section>

        <div className="divider" />

        {/* SERVICES */}
        <section data-reveal id="services" style={{ padding: isMobile ? '64px 20px' : '120px 24px' }}>
          <div style={{ maxWidth:1140, margin:'0 auto' }}>
            <div style={{ marginBottom: isMobile ? 36 : 64, display:'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent:'space-between', alignItems: isMobile ? 'flex-start' : 'flex-end', flexWrap:'wrap', gap:20 }}>
              <div>
                <div className="pill">What we do</div>
                <h2 className="big" style={{ cursor:'default' }} >Services built for<br /><span style={{ color:'rgba(255,255,255,0.28)' }}>real growth.</span></h2>
              </div>
              <p style={{ fontSize:14, color:'rgba(255,255,255,0.38)', maxWidth:280, lineHeight:1.75, fontWeight:400 }}>Everything you need to go from zero to a brand people actually talk about.</p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(260px, 1fr))', gap: isMobile ? 12 : 14 }}>
              {SERVICES.map((s, i) => (
                <div key={i} className="scard interactive-card" onMouseEnter={() => setActiveService(i)} onMouseLeave={() => setActiveService(null)}>
                  <div style={{ position:'absolute', inset:0, borderRadius:26, background:`radial-gradient(ellipse at 0% 0%, ${s.color}10, transparent 60%)`, opacity: activeService===i ? 1 : 0, transition:'opacity 0.4s' }} />
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:22 }}>
                    <div style={{ width:54, height:54, borderRadius:16, background:s.accent, border:`1px solid ${s.color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, transition:'transform 0.35s', transform: activeService===i ? 'scale(1.12) rotate(-6deg)' : 'scale(1)' }}>{s.icon}</div>
                    <span style={{ fontSize:11, color:'rgba(255,255,255,0.18)', fontWeight:700, letterSpacing:'0.1em' }}>0{i+1}</span>
                  </div>
                  <h3 style={{ fontSize:19, fontWeight:800, marginBottom:10, lineHeight:1.2 }}>{s.title}</h3>
                  <p style={{ fontSize:14, color:'rgba(255,255,255,0.42)', lineHeight:1.78, fontWeight:400 }}>{s.desc}</p>
                  <div style={{ marginTop:22, height:2, background:`linear-gradient(90deg, ${s.color}, transparent)`, borderRadius:99, transition:'width 0.5s ease', width: activeService===i ? '100%' : '25%' }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* 3000+ SECTION */}
        <section data-reveal id="content" style={{ padding: isMobile ? '64px 20px' : '120px 24px', position:'relative' }}>
          <div style={{ maxWidth:1140, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:16 }}>
              <div className="pill">Films &amp; Performance Content</div>
            </div>
            <div style={{ position:'relative', textAlign:'center', padding: isMobile ? '32px 0 28px' : '60px 0 48px', cursor:'default' }}>
              <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'600px', height:'600px', borderRadius:'50%', background:'radial-gradient(circle, rgba(255,0,128,0.16) 0%, transparent 65%)', filter:'blur(40px)' }} />
                <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'500px', height:'500px', borderRadius:'50%', border:'1px solid rgba(255,0,128,0.07)' }} />
                <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'360px', height:'360px', borderRadius:'50%', border:'1px solid rgba(255,0,128,0.05)' }} />
              </div>
              <div className='big3k' style={{ fontSize:'clamp(100px,20vw,220px)', fontWeight:700, lineHeight:0.88, background:'linear-gradient(135deg, #ff0080 0%, #cc00ff 45%, #0050ff 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:'-6px', position:'relative', zIndex:1, display:'inline-block', transition:'transform 0.4s cubic-bezier(0.16,1,0.3,1)' }}
                onMouseEnter={e => (e.currentTarget.style.transform='scale(1.05)')}
                onMouseLeave={e => (e.currentTarget.style.transform='scale(1)')}>
                3000+
              </div>
              <p style={{ fontSize:'clamp(18px,2.5vw,26px)', fontWeight:600, color:'rgba(255,255,255,0.85)', marginTop:12, position:'relative', zIndex:1, letterSpacing:'-0.5px' }}>Creatives made for India’s Top Brands</p>
              <p style={{ fontSize:15, color:'rgba(255,255,255,0.35)', maxWidth:460, margin:'12px auto 0', lineHeight:1.8, fontWeight:400, position:'relative', zIndex:1 }}>
                Ad films, UGC, product reels, motion graphics — a full content engine under one roof, all built to perform.
              </p>
              <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap', marginTop:28, position:'relative', zIndex:1 }}>
                {['Ad Films','UGC','Product Reels','Motion','Performance Content'].map((tag,i) => (
                  <span key={i} style={{ fontSize:11, fontWeight:600, padding:'5px 14px', borderRadius:99, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.45)', letterSpacing:'0.05em', textTransform:'uppercase' as const }}>{tag}</span>
                ))}
              </div>
            </div>
            <div ref={statsRef} style={{ display:'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: isMobile ? 10 : 12 }}>
              {STATS.map((s, i) => (
                <div key={i} className="stcard interactive-card" data-hover>
                  <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 50% 0%, ${s.color}18, transparent 70%)`, borderRadius:22 }} />
                  <div style={{ fontSize:'clamp(34px,4.5vw,50px)', fontWeight:700, color:s.color, lineHeight:1, marginBottom:8, position:'relative' }}>{counted ? s.number : ['0+','0+','₹0Cr+','0x'][i]}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.38)', fontWeight:600, textTransform:'uppercase' as const, letterSpacing:'0.1em', position:'relative' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* FOUNDER + FEATURED VIDEO */}
        <section style={{ padding: isMobile ? '64px 20px' : '120px 24px' }}>
          <div style={{ maxWidth:1140, margin:'0 auto' }}>
            <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1.05fr 0.95fr', gap: isMobile ? 18 : 24, alignItems:'stretch', marginBottom: isMobile ? 18 : 24 }}>
              
              <div className="glass premium-media interactive-card" style={{ borderRadius:28, overflow:'hidden', position:'relative' }}
                onMouseEnter={e => { const el = e.currentTarget.querySelector('.founder-fun') as HTMLElement; if(el) el.style.opacity='1' }}
                onMouseLeave={e => { const el = e.currentTarget.querySelector('.founder-fun') as HTMLElement; if(el) el.style.opacity='0' }}>
                <div style={{ aspectRatio: isMobile ? '4 / 5' : '4 / 5', background:'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
                  <img
                    src="/harshit-founder.jpg"
                    alt="Harshit Arora"
                    style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
                  />
                  {/* Fun fact overlay */}
                  <div className="founder-fun" style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(5,5,8,0.97) 0%, rgba(5,5,8,0.7) 50%, transparent 100%)', opacity:0, transition:'opacity 0.4s ease', display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'2rem', zIndex:2 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:'#ff0080', textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:8 }}>Fun fact</div>
                    <p style={{ fontSize:15, color:'rgba(255,255,255,0.88)', lineHeight:1.7, fontWeight:500 }}>
                      Master Delegator. Ringtone is ABCDEFGHI...JKLM because he thinks his team is family.
                    </p>
                    <div style={{ marginTop:14, height:1.5, width:48, background:'linear-gradient(90deg, #ff0080, transparent)', borderRadius:99 }} />
                  </div>
                </div>
              </div>

              <div className="glass" style={{ borderRadius:28, padding: isMobile ? '1.5rem' : '2rem', display:'flex', flexDirection:'column', justifyContent:'center' }}>
                <div className="pill">Built by operators</div>
                <h2 className="big" style={{ fontSize:'clamp(28px,4.2vw,54px)', marginBottom:14 }}>
                  The face behind<br /><span className="brand-grad">Growster.</span>
                </h2>
                <p style={{ fontSize:15, color:'rgba(255,255,255,0.38)', lineHeight:1.85, marginBottom:18, maxWidth:560 }}>
                  I started Growster because most agencies understand deliverables, not growth. We built this company to drive outcomes — not just output.
                </p>
                <div style={{ display:'grid', gap:10, marginBottom:18 }}>
                  {[
                    'Performance creative for brands spending seriously on growth.',
                    'We combine strategy, production, and paid media under one roof.',
                    'Built for D2C, fashion, hospitality, and consumer brands.'
                  ].map((line, i) => (
                    <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                      <span style={{ color:'#ff0080', fontWeight:800, lineHeight:1.5 }}>✦</span>
                      <p style={{ fontSize:14, color:'rgba(255,255,255,0.72)', lineHeight:1.7 }}>{line}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginTop:4 }}>
                  <a href="mailto:work@growster.in" className="cta-p mag-btn">Work with us →</a>
                  <a href="https://instagram.com/growster.in" target="_blank" rel="noreferrer" className="cta-g mag-btn">See the work ↗</a>
                </div>
              </div>
            </div>


            {/* TEAM SCROLLER */}
            <div style={{ marginBottom: isMobile ? 18 : 24 }}>
              <div style={{ marginBottom:24 }}>
                <div className="pill">The humans behind it</div>
                <h2 className="big" style={{ fontSize:'clamp(24px,3.5vw,48px)' }}>The team that<br /><span className="brand-grad">makes it happen.</span></h2>
              </div>
              <div
                className="team-scroll"
                ref={teamScrollRef}
                onMouseDown={e => { isDragging.current = true; dragStart.current = e.pageX - (teamScrollRef.current?.scrollLeft || 0); if(teamScrollRef.current) teamScrollRef.current.style.scrollBehavior='auto' }}
                onMouseMove={e => { if(!isDragging.current||!teamScrollRef.current) return; e.preventDefault(); teamScrollRef.current.scrollLeft = dragStart.current - e.pageX }}
                onMouseUp={() => { isDragging.current = false }}
                onMouseLeave={() => { isDragging.current = false }}
              >
                {TEAM.map((member, i) => (
                  <div key={i} className="team-card" data-hover>
                    <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, ${member.color}, transparent)`, zIndex:2 }} />
                    <div style={{ position:'relative', overflow:'hidden' }}>
                      <img src={member.img} alt={member.name} className="team-card-img" />
                      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'50%', background:'linear-gradient(to top, rgba(5,5,8,0.9), transparent)', pointerEvents:'none' }} />
                      <div style={{ position:'absolute', top:12, right:12, width:34, height:34, borderRadius:'50%', background:'rgba(0,0,0,0.5)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, zIndex:2 }}>{member.emoji}</div>
                      <div className="team-card-fun">
                        <div style={{ fontSize:10, fontWeight:700, color:member.color, textTransform:'uppercase' as const, letterSpacing:'0.1em', marginBottom:5 }}>Fun fact</div>
                        <p style={{ fontSize:12, color:'rgba(255,255,255,0.8)', lineHeight:1.6, fontWeight:500 }}>{member.fun}</p>
                      </div>
                    </div>
                    <div className="team-card-info">
                      <div style={{ fontSize:16, fontWeight:800, color:'#fff', marginBottom:3 }}>{member.name}</div>
                      <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:500 }}>{member.role}</div>
                      <div style={{ marginTop:10, height:1.5, background:`linear-gradient(90deg, ${member.color}80, transparent)`, borderRadius:99 }} />
                    </div>
                  </div>
                ))}
                <div className="team-card" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'rgba(255,0,128,0.04)', border:'1px dashed rgba(255,0,128,0.2)', minHeight:380, gap:14, padding:24 }} data-hover>
                  <div style={{ fontSize:40 }}>🐹</div>
                  <div style={{ fontSize:16, fontWeight:800, textAlign:'center' as const, lineHeight:1.3 }}>Want to join<br />the team?</div>
                  <p style={{ fontSize:12, color:'rgba(255,255,255,0.38)', textAlign:'center' as const, lineHeight:1.6 }}>We're always looking for people who care about craft.</p>
                  <a href="mailto:work@growster.in" className="cta-p" style={{ fontSize:12, padding:'9px 20px' }}>Say hello →</a>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:10, opacity:0.25, marginTop:12 }}>
                <div style={{ width:28, height:1.5, background:'#fff', borderRadius:99 }} />
                <span style={{ fontSize:10, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase' as const }}>Drag to explore</span>
              </div>
            </div>


            <div className="glass interactive-card" style={{ borderRadius:28, overflow:'hidden', padding: isMobile ? '1.25rem' : '1.5rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:isMobile ? 'flex-start' : 'center', flexDirection:isMobile ? 'column' : 'row', gap:14, marginBottom:18 }}>
                <div>
                  <div className="pill">Featured reel</div>
                  <h3 style={{ fontSize: isMobile ? 22 : 30, fontWeight:800, lineHeight:1.15, marginBottom:8 }}>
                    We don't just run ads.<br /><span style={{ color:'rgba(255,255,255,0.42)' }}>We make content people actually watch.</span>
                  </h3>
                  <p style={{ fontSize:14, color:'rgba(255,255,255,0.38)', lineHeight:1.75, maxWidth:620 }}>
                    A quick look at the standard we expect from ourselves — presence, polish, and clarity.
                  </p>
                </div>
                <a href="https://www.instagram.com/p/DVxd9KoE_kj/" target="_blank" rel="noreferrer" className="cta-p mag-btn" style={{ flexShrink:0 }}>
                  Watch reel ↗
                </a>
              </div>

              <a
                href="https://www.instagram.com/p/DVxd9KoE_kj/"
                target="_blank"
                rel="noreferrer"
                data-hover
                style={{
                  display:'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr',
                  gap:0,
                  textDecoration:'none',
                  borderRadius:22,
                  overflow:'hidden',
                  border:'1px solid rgba(255,255,255,0.08)',
                  background:'rgba(255,255,255,0.03)'
                }}
              >
                <div style={{
                  minHeight: isMobile ? 240 : 340,
                  background:'linear-gradient(135deg, rgba(255,0,128,0.18), rgba(0,80,255,0.18))',
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  position:'relative'
                }}>
                  <div className="play-pulse" style={{
                    width:88,
                    height:88,
                    borderRadius:'50%',
                    background:'rgba(255,255,255,0.12)',
                    border:'1px solid rgba(255,255,255,0.16)',
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    backdropFilter:'blur(14px)',
                    WebkitBackdropFilter:'blur(14px)',
                    boxShadow:'0 8px 30px rgba(0,0,0,0.25)'
                  }}>
                    <span style={{ fontSize:32, color:'#fff', marginLeft:4 }}>▶</span>
                  </div>
                  <div style={{
                    position:'absolute',
                    inset:0,
                    background:'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.22) 100%)'
                  }} />
                </div>

                <div style={{ padding: isMobile ? '1.25rem' : '1.6rem', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                  <div>
                    <div style={{ fontSize:11, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)', fontWeight:700, marginBottom:10 }}>
                      Instagram feature
                    </div>
                    <div style={{ fontSize: isMobile ? 20 : 26, fontWeight:800, color:'#fff', lineHeight:1.2, marginBottom:10 }}>
                      Content that feels premium.<br />And still performs.
                    </div>
                    <p style={{ fontSize:14, color:'rgba(255,255,255,0.42)', lineHeight:1.8 }}>
                      This is the kind of output that builds brand recall and earns attention in paid and organic environments.
                    </p>
                  </div>

                  <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginTop:18 }}>
                    {['Founder-led', 'Brand-first', 'Performance-aware'].map((tag, i) => (
                      <span key={i} style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.56)', padding:'6px 12px', borderRadius:99, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.03)', textTransform:'uppercase' as const, letterSpacing:'0.06em' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* WHY US */}
        <section data-reveal id="work" style={{ padding: isMobile ? '64px 20px' : '120px 24px' }}>
          <div style={{ maxWidth:1140, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:64 }}>
              <div className="pill">Why Growster</div>
              <h2 className="big">Not an agency.<br /><span className="brand-grad">A growth partner.</span></h2>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:14 }}>
              {[
                { emoji:'🧠', title:'Strategy-first thinking', desc:"We don't post content. We build systems. Every piece has a job — reach, convert, retain.", color:'#ff0080' },
                { emoji:'🏭', title:'In-house production', desc:'No outsourcing. Directors, editors, and strategists all under one roof for faster, sharper output.', color:'#0050ff' },
                { emoji:'📊', title:'Performance-obsessed', desc:"We track everything. If it can't be measured, we make it measurable. Data drives every decision.", color:'#8b5cf6' },
                { emoji:'🚀', title:'Built to scale', desc:'From ₹50K to ₹1Cr+ ad budgets — our systems scale with your brand without losing quality.', color:'#f59e0b' },
                { emoji:'🎨', title:'Creative that converts', desc:"Viral isn't the goal. Sales is. We make content that looks incredible and actually moves product.", color:'#10b981' },
                { emoji:'🤝', title:'True partnership', desc:"A dedicated team that knows your brand inside out. We're as invested in your growth as you are.", color:'#ec4899' },
              ].map((item, i) => (
                <div key={i} className="scard">
                  <div style={{ position:'absolute', inset:0, borderRadius:26, background:`radial-gradient(ellipse at 0% 0%, ${item.color}08, transparent 60%)` }} />
                  <div style={{ fontSize:30, marginBottom:16 }}>{item.emoji}</div>
                  <h3 style={{ fontSize:18, fontWeight:800, marginBottom:10 }}>{item.title}</h3>
                  <p style={{ fontSize:14, color:'rgba(255,255,255,0.42)', lineHeight:1.78, fontWeight:400 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* INSTAGRAM */}
        <section data-reveal style={{ padding:'120px 24px' }}>
          <div style={{ maxWidth:1140, margin:'0 auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:44, flexWrap:'wrap', gap:20 }}>
              <div>
                <div className="pill">@growster.in</div>
                <h2 className="big" style={{ fontSize:'clamp(26px,3.8vw,50px)' }}>We live on your feed.<br /><span style={{ color:'rgba(255,255,255,0.28)' }}>Follow along.</span></h2>
              </div>
              <a href="https://instagram.com/growster.in" target="_blank" rel="noreferrer" className="cta-g" style={{ flexShrink:0 }}>Follow @growster.in ↗</a>
            </div>
            <div style={{ display:'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: isMobile ? 8 : 10 }}>
              {[
                { bg:'linear-gradient(135deg, #ff0080 0%, #ff6b35 100%)', icon:'⚡', label:'Performance Marketing', sub:'Results that speak' },
                { bg:'linear-gradient(135deg, #0050ff 0%, #00c6ff 100%)', icon:'📱', label:'Social Media', sub:'Content strategy' },
                { bg:'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', icon:'🎬', label:'Ad Films', sub:'Behind the lens' },
                { bg:'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', icon:'📈', label:'Brand Growth', sub:'0 to scale' },
                { bg:'linear-gradient(135deg, #10b981 0%, #0050ff 100%)', icon:'🎨', label:'Creative Content', sub:'3000+ creatives' },
                { bg:'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', icon:'🐹', label:'The Team', sub:'Meet Growster' },
              ].map((card, i) => (
                <a key={i} href="https://instagram.com/growster.in" target="_blank" rel="noreferrer" className="igcard interactive-card" data-hover style={{ textDecoration:'none' }}>
                  <div className="igcard-inner" style={{ background:card.bg }}>
                    <div style={{ fontSize:'clamp(28px,4vw,46px)', marginBottom:10 }}>{card.icon}</div>
                    <div style={{ fontSize:'clamp(12px,1.4vw,15px)', fontWeight:800, textAlign:'center', lineHeight:1.25 }}>{card.label}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.6)', marginTop:5, fontWeight:500 }}>{card.sub}</div>
                  </div>
                  <div className="igcard-overlay">
                    <span style={{ fontSize:12, fontWeight:600, display:'flex', alignItems:'center', gap:6 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                      View on Instagram
                    </span>
                  </div>
                </a>
              ))}
            </div>
            <div style={{ textAlign:'center', marginTop:28 }}>
              <a href="https://instagram.com/growster.in" target="_blank" rel="noreferrer" className="cta-g">See everything @growster.in ↗</a>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* MARQUEE STRIP */}
        <div data-reveal style={{ padding: isMobile ? '24px 0' : '36px 0', overflow:'hidden' }}>
          <div style={{ maskImage:'linear-gradient(90deg, transparent, black 5%, black 95%, transparent)', WebkitMaskImage:'linear-gradient(90deg, transparent, black 5%, black 95%, transparent)', overflow:'hidden' }}>
            <div className="marquee-tr">
              {['Growth Marketing','Social Media','Performance Marketing','Ad Films','Content Creation','Brand Strategy','Meta Ads','Google Ads','UGC','Reels','Growth Marketing','Social Media','Performance Marketing','Ad Films','Content Creation','Brand Strategy','Meta Ads','Google Ads','UGC','Reels'].map((text, i) => (
                <span key={i} style={{ padding:'0 22px', fontSize:12, fontWeight:700, color: i%2===0 ? 'rgba(255,255,255,0.13)' : 'rgba(255,0,128,0.35)', whiteSpace:'nowrap', letterSpacing:'0.05em', textTransform:'uppercase', flexShrink:0 }}>
                  {text} <span style={{ opacity:0.4 }}>✦</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* CONTACT */}
        <section data-reveal id="contact" style={{ padding: isMobile ? '64px 20px' : '120px 24px' }}>
          <div style={{ maxWidth:680, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:52 }}>
              <div className="pill">Get in touch</div>
              <h2 className="big">Ready to grow<span style={{ color:'#ff0080' }}>?</span></h2>
              <p style={{ fontSize:15, color:'rgba(255,255,255,0.33)', marginTop:14, fontWeight:400, lineHeight:1.75 }}>Tell us about your brand. We'll tell you exactly how we'd grow it.</p>
            </div>
            <div className="glass" style={{ borderRadius:26, padding:'clamp(1.5rem, 4vw, 2.5rem)' }}>
              <div style={{ display:'grid', gap:13 }}>
                <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:11 }}>
                  <div>
                    <label style={{ display:'block', fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.32)', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.12em' }}>Your name</label>
                    <input placeholder="Harshit Arora" value={formData.name} onChange={e => setFormData(p => ({...p, name:e.target.value}))} />
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.32)', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.12em' }}>Brand</label>
                    <input placeholder="Snitch" value={formData.brand} onChange={e => setFormData(p => ({...p, brand:e.target.value}))} />
                  </div>
                </div>
                <div>
                  <label style={{ display:'block', fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.32)', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.12em' }}>Email</label>
                  <input type="email" placeholder="you@brand.com" value={formData.email} onChange={e => setFormData(p => ({...p, email:e.target.value}))} />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.32)', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.12em' }}>Phone</label>
                  <input type="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={e => setFormData(p => ({...p, phone:e.target.value}))} />
                </div>
                
                <div>
                  <label style={{ display:'block', fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.32)', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.12em' }}>What are you looking for?</label>
                  <textarea placeholder="Tell us about your brand, your current challenges, and what growth means to you…" value={formData.message} onChange={e => setFormData(p => ({...p, message:e.target.value}))} />
                </div>
                <button
                  disabled={formStatus === 'sending' || formStatus === 'sent'}
                  onClick={async () => {
                    if (!formData.name || !formData.email || !formData.phone) return
                    setFormStatus('sending')
                    try {
                      const res = await fetch('https://agrctbhbmusxtjstfvst.supabase.co/rest/v1/leads', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFncmN0YmhibXVzeHRqc3RmdnN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NTcwODgsImV4cCI6MjA4OTMzMzA4OH0.4hXxsswtPE7PUnKNBWEOpiDRT8T2kMO0HaPUQ8fn2pQ',
                          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFncmN0YmhibXVzeHRqc3RmdnN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NTcwODgsImV4cCI6MjA4OTMzMzA4OH0.4hXxsswtPE7PUnKNBWEOpiDRT8T2kMO0HaPUQ8fn2pQ',
                          'Prefer': 'return=minimal'
                        },
                        body: JSON.stringify(formData)
                      })
                      if (res.ok) { setFormStatus('sent'); setFormData({ name:'', brand:'', email:'', phone:'', message:'' }) }
                      else setFormStatus('error')
                    } catch { setFormStatus('error') }
                  }}
                  className="cta-p"
                  style={{ justifyContent:'center', marginTop:4, width:'100%', border:'none', opacity: formStatus==='sending' ? 0.7 : 1, cursor: formStatus==='sent' ? 'default' : 'pointer', fontFamily:'inherit' }}>
                  {formStatus === 'idle' && 'Send message →'}
                  {formStatus === 'sending' && 'Sending...'}
                  {formStatus === 'sent' && "✓ Sent! We'll be in touch."}
                  {formStatus === 'error' && 'Something went wrong. Try again.'}
                </button>
              </div>
            </div>
            <div style={{ display:'flex', justifyContent:'center', gap: isMobile ? 24 : 'clamp(20px,5vw,48px)', marginTop:44, flexWrap:'wrap' }}>
              {[
                { icon:'✉️', label:'Email', value:'work@growster.in', href:'mailto:work@growster.in' },
                { icon:'💬', label:'WhatsApp', value:'+91 70172 51443', href:'https://wa.link/qq521h' },
                { icon:'📸', label:'Instagram', value:'@growster.in', href:'https://instagram.com/growster.in' },
              ].map(item => (
                <a key={item.label} href={item.href} target="_blank" rel="noreferrer" data-hover style={{ textAlign:'center', textDecoration:'none' }}>
                  <div style={{ fontSize:18, marginBottom:5 }}>{item.icon}</div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.28)', textTransform:'uppercase', letterSpacing:'0.12em', fontWeight:700, marginBottom:3 }}>{item.label}</div>
                  <div style={{ fontSize:13, color:'rgba(255,255,255,0.65)', fontWeight:500 }}>{item.value}</div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop:'1px solid rgba(255,255,255,0.06)', padding:'28px 24px' }}>
          <div className='footer-inner' style={{ maxWidth:1140, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:14 }}>
            <img src="/brands/growster-logo.png" alt="Growster" style={{ height:24, width:'auto', opacity:0.5 }} />
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.18)', fontWeight:400 }}>© {new Date().getFullYear()} Grandir Vitae Pvt. Ltd.</p>
            <div style={{ display:'flex', gap:20 }}>
              {[['Instagram','https://instagram.com/growster.in'],['WhatsApp','https://wa.link/qq521h'],['Email','mailto:work@growster.in']].map(([label,href]) => (
                <a key={label} href={href} target="_blank" rel="noreferrer"
                  style={{ fontSize:11, color:'rgba(255,255,255,0.28)', textDecoration:'none', transition:'color 0.2s', fontWeight:500, cursor:'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color='rgba(255,255,255,0.75)')}
                  onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.28)')}>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
