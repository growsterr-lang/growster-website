import Head from 'next/head'
import { useState } from 'react'

export default function BrandBook() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'colors', label: 'Colors' },
    { id: 'typography', label: 'Typography' },
    { id: 'spacing', label: 'Spacing & Layout' },
    { id: 'components', label: 'Components' },
    { id: 'icons', label: 'Icons & Emoji' },
    { id: 'motion', label: 'Motion' },
    { id: 'voice', label: 'Voice & Tone' },
    { id: 'usage', label: 'Do / Don\'t' },
  ]

  const colors = [
    { name: 'Brand Pink', hex: '#ff0080', var: '--brand', usage: 'Primary CTA, highlights, active states' },
    { name: 'Brand Blue', hex: '#0050ff', var: '--brand-blue', usage: 'Secondary accent, gradients' },
    { name: 'Brand Purple', hex: '#8b5cf6', var: '--brand-purple', usage: 'Tertiary accent, charts' },
    { name: 'Dark Pink', hex: '#cc0055', var: '--brand-dark', usage: 'Hover states, button gradients' },
    { name: 'Background', hex: '#050508', var: '--bg', usage: 'Page background' },
    { name: 'Surface', hex: 'rgba(255,255,255,0.04)', var: '--surface', usage: 'Cards, modals, glass panels' },
    { name: 'Border', hex: 'rgba(255,255,255,0.08)', var: '--border', usage: 'Dividers, card borders' },
    { name: 'Text Primary', hex: '#ffffff', var: '--text-primary', usage: 'Headlines, important text' },
    { name: 'Text Secondary', hex: 'rgba(255,255,255,0.55)', var: '--text-secondary', usage: 'Body text, descriptions' },
    { name: 'Text Muted', hex: 'rgba(255,255,255,0.28)', var: '--text-muted', usage: 'Labels, placeholders, captions' },
    { name: 'Success', hex: '#10b981', var: '--success', usage: 'Approved, done, positive states' },
    { name: 'Warning', hex: '#f59e0b', var: '--warning', usage: 'Pending, in-progress states' },
    { name: 'Error', hex: '#dc2626', var: '--error', usage: 'Rejected, overdue, destructive' },
  ]

  const gradients = [
    { name: 'Primary Gradient', value: 'linear-gradient(135deg, #ff0080, #0050ff)', usage: 'Hero text, avatars, key CTAs' },
    { name: 'Pink Gradient', value: 'linear-gradient(135deg, #ff0080, #cc0055)', usage: 'Primary buttons, FABs' },
    { name: 'Orb Pink', value: 'radial-gradient(circle, rgba(255,0,128,0.18) 0%, transparent 70%)', usage: 'Background orbs top-left' },
    { name: 'Orb Blue', value: 'radial-gradient(circle, rgba(0,80,255,0.15) 0%, transparent 70%)', usage: 'Background orbs bottom-right' },
    { name: 'Orb Purple', value: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', usage: 'Background orbs center' },
  ]

  const typeScale = [
    { name: 'Display', size: '64px', weight: '900', tracking: '-2px', usage: 'Hero headlines only', class: 'big' },
    { name: 'H1', size: '40px', weight: '800', tracking: '-1px', usage: 'Page titles' },
    { name: 'H2', size: '28px', weight: '800', tracking: '-0.5px', usage: 'Section headings' },
    { name: 'H3', size: '20px', weight: '700', tracking: '-0.3px', usage: 'Card titles, subsections' },
    { name: 'Body Large', size: '17px', weight: '500', tracking: '0', usage: 'Hero subtext, key descriptions' },
    { name: 'Body', size: '14px', weight: '400', tracking: '0', usage: 'General body copy' },
    { name: 'Small', size: '13px', weight: '500', tracking: '0', usage: 'UI text, buttons, nav' },
    { name: 'Label', size: '11px', weight: '700', tracking: '0.12em', usage: 'Form labels, pill text, captions — UPPERCASE' },
    { name: 'Micro', size: '10px', weight: '700', tracking: '0.15em', usage: 'Section tags, badges — UPPERCASE' },
  ]

  const spacing = [
    { name: '4px', value: '4px', usage: 'Icon gaps, tight inline spacing' },
    { name: '8px', value: '8px', usage: 'Small gaps, badge padding' },
    { name: '12px', value: '12px', usage: 'Button padding (sm), card gaps' },
    { name: '16px', value: '16px', usage: 'Standard gap, mobile padding' },
    { name: '20px', value: '20px', usage: 'Card padding (sm)' },
    { name: '24px', value: '24px', usage: 'Section padding (mobile), card padding' },
    { name: '32px', value: '32px', usage: 'Large card padding' },
    { name: '48px', value: '48px', usage: 'Section spacing (mobile)' },
    { name: '64px', value: '64px', usage: 'Section spacing (mobile alt)' },
    { name: '120px', value: '120px', usage: 'Section spacing (desktop)' },
  ]

  const radii = [
    { name: 'Button / Pill', value: '99px', usage: 'All buttons, badges, tags' },
    { name: 'Card Large', value: '28px', usage: 'Hero cards, feature cards' },
    { name: 'Card', value: '20px', usage: 'Standard cards, modals' },
    { name: 'Card Small', value: '16px', usage: 'Compact cards, list items' },
    { name: 'Input', value: '12px', usage: 'All form inputs' },
    { name: 'Micro', value: '8px', usage: 'Small buttons, chips' },
  ]

  const components = [
    {
      name: 'Primary Button',
      code: `background: linear-gradient(135deg, #ff0080, #cc0055)
border-radius: 99px
padding: 10px 20px
font-size: 13px
font-weight: 700
box-shadow: 0 0 20px rgba(255,0,128,0.3)
hover: translateY(-2px), shadow intensifies`,
      preview: <button style={{ padding: '10px 20px', borderRadius: 99, border: 'none', background: 'linear-gradient(135deg,#ff0080,#cc0055)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat', boxShadow: '0 0 20px rgba(255,0,128,0.3)' }}>Get started →</button>
    },
    {
      name: 'Ghost Button',
      code: `background: rgba(255,255,255,0.05)
border: 1px solid rgba(255,255,255,0.1)
border-radius: 99px
color: rgba(255,255,255,0.7)
hover: background lightens, border brightens`,
      preview: <button style={{ padding: '10px 20px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.1)', background: '#151520', color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Montserrat' }}>Learn more</button>
    },
    {
      name: 'Glass Card',
      code: `background: rgba(255,255,255,0.03)
border: 1px solid rgba(255,255,255,0.08)
border-radius: 20px
backdrop-filter: blur(20px)
hover: border brightens to 0.15`,
      preview: <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '1.25rem', backdropFilter: 'blur(20px)', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>Glass card component</div>
    },
    {
      name: 'Pill Label',
      code: `font-size: 10px
font-weight: 700
letter-spacing: 0.15em
text-transform: UPPERCASE
color: #ff0080
background: rgba(255,0,128,0.1)
border: 1px solid rgba(255,0,128,0.2)
border-radius: 99px
padding: 4px 12px`,
      preview: <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ff0080', background: 'rgba(255,0,128,0.1)', border: '1px solid rgba(255,0,128,0.2)', borderRadius: 99, padding: '4px 12px' }}>Our Services</span>
    },
    {
      name: 'Badge — Open',
      code: `background: rgba(0,80,255,0.15)
color: #60a5fa
border: 1px solid rgba(0,80,255,0.25)
border-radius: 99px
font-size: 11px, weight 600, UPPERCASE`,
      preview: <span style={{ background: 'rgba(0,80,255,0.15)', color: '#60a5fa', border: '1px solid rgba(0,80,255,0.25)', borderRadius: 99, fontSize: 11, fontWeight: 600, padding: '3px 10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Open</span>
    },
    {
      name: 'Input Field',
      code: `background: rgba(255,255,255,0.05)
border: 1px solid rgba(255,255,255,0.08)
border-radius: 12px
padding: 10px 14px
font-size: 14px
focus: border rgba(255,0,128,0.5), glow rgba(255,0,128,0.1)`,
      preview: <input placeholder="Type something..." style={{ background: '#151520', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '10px 14px', fontSize: 14, color: '#fff', fontFamily: 'Montserrat', outline: 'none', width: '100%' }} />
    },
  ]

  const emojis = [
    { emoji: '🐹', usage: 'Growster mascot, playful moments, 404 page' },
    { emoji: '🎬', usage: 'Directors, video production, shoots' },
    { emoji: '📋', usage: 'Tasks, references, lists' },
    { emoji: '📊', usage: 'Dashboard, analytics, reports' },
    { emoji: '💰', usage: 'Finance, revenue, money' },
    { emoji: '💳', usage: 'Payments, CC transactions' },
    { emoji: '📈', usage: 'Performance, growth, ROAS' },
    { emoji: '✅', usage: 'Approvals, completed, done' },
    { emoji: '⚠️', usage: 'Warnings, overdue, attention needed' },
    { emoji: '🎯', usage: 'Influencers, targeting, goals' },
    { emoji: '🌐', usage: 'Website leads, web-related' },
    { emoji: '🔔', usage: 'Notifications, standup alerts' },
    { emoji: '✈️', usage: 'Leave requests, travel' },
    { emoji: '🗓', usage: 'Attendance, calendar, scheduling' },
    { emoji: '😤', usage: 'Manager (intentionally expressive)' },
    { emoji: '🚀', usage: 'Excellent performance, scaling up' },
    { emoji: '💪', usage: 'Strong results, good progress' },
    { emoji: '🔒', usage: 'Locked references, security' },
  ]

  const motionRules = [
    { name: 'Fade Up', value: 'translateY(16px) → 0, opacity 0→1', duration: '0.5s', easing: 'cubic-bezier(0.16, 1, 0.3, 1)', usage: 'Page sections on scroll' },
    { name: 'Button Hover', value: 'translateY(-2px), shadow intensify', duration: '0.2s', easing: 'cubic-bezier(0.16, 1, 0.3, 1)', usage: 'All primary buttons' },
    { name: 'Card Hover', value: 'translateY(-3px), border brighten', duration: '0.3s', easing: 'ease', usage: 'Feature cards, team cards' },
    { name: 'Glow Pulse', value: 'opacity 0.5→1→0.5', duration: '2s', easing: 'ease-in-out infinite', usage: 'Brand dot in hero pill' },
    { name: 'Overlay Open', value: 'backdrop-filter blur(8px)', duration: '0.2s', easing: 'ease', usage: 'All modal overlays' },
    { name: 'Tab Indicator', value: 'border-bottom color transition', duration: '0.15s', easing: 'ease', usage: 'Navigation tabs' },
  ]

  const voiceRules = [
    { rule: 'Confident, not arrogant', example: '"We build systems." not "We try to build systems."' },
    { rule: 'Direct, not corporate', example: '"Let\'s talk →" not "Contact Us Today"' },
    { rule: 'Specific, not vague', example: '"3,000+ creatives delivered" not "Many creatives"' },
    { rule: 'Human, not robotic', example: '"Your daily survival tool 🐹" not "Task Management System"' },
    { rule: 'Playful in micro-copy', example: 'Fun facts, 404 page, empty states — use personality' },
    { rule: 'Sharp in headlines', example: 'Max 6 words. No filler. Punch first.' },
  ]

  const dos = [
    'Use Montserrat exclusively across all digital touchpoints',
    'Always use the dark background (#050508) as base',
    'Gradient text only on display/hero headlines',
    'Pink (#ff0080) for primary actions only — one per screen',
    'Glass cards with backdrop-filter: blur(20px)',
    'Pill/rounded (99px) for all interactive buttons',
    'Uppercase + wide tracking for all labels and section tags',
    'Orb backgrounds on every major page/section',
    'White text on dark — never dark text on dark',
    'Emoji in UI for personality — sparingly, purposefully',
  ]

  const donts = [
    'Never use light mode or white backgrounds',
    'Never use system fonts — Montserrat only',
    'Never use square buttons — always pill or rounded',
    'Never use green (#059669) as brand — that\'s old',
    'Never use solid black — use #050508',
    'Never gradient on body text — headlines only',
    'Never more than one primary CTA per section',
    'Never use blue links underlined — style as pink accent',
    'Never stack multiple gradient backgrounds',
    'Never use emojis in headlines — micro-copy only',
  ]

  const s: any = {
    nav: { background: 'rgba(5,5,8,0.9)', borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'sticky' as const, top: 0, zIndex: 50, backdropFilter: 'blur(20px)', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 },
    sidebar: { position: 'fixed' as const, top: 56, left: 0, width: 220, height: 'calc(100vh - 56px)', background: '#0d0d14', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '1.5rem 1rem', overflowY: 'auto' as const },
    main: { marginLeft: 220, padding: '2.5rem 2rem', maxWidth: 960, minHeight: '100vh' },
    section: { marginBottom: '4rem' },
    h2: { fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 8, color: '#fff' },
    h3: { fontSize: 16, fontWeight: 700, marginBottom: 12, color: 'rgba(255,255,255,0.8)' },
    label: { fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#ff0080', marginBottom: 16, display: 'block' },
    card: { background: '#111118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1.25rem' },
    code: { background: '#151520', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '1rem', fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace', whiteSpace: 'pre-wrap' as const, lineHeight: 1.7 },
  }

  return (
    <>
      <Head>
        <title>Growster Brand Book</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Montserrat', sans-serif; background: #050508; color: #fff; }
          ::-webkit-scrollbar { width: 3px; }
          ::-webkit-scrollbar-thumb { background: linear-gradient(#ff0080, #0050ff); border-radius: 99px; }
          @media print {
            .sidebar, nav { display: none !important; }
            .main { margin-left: 0 !important; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            html, body { background: #050508 !important; color: #fff !important; }
            .card-inner, [style*='background'] { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            div, section, span, td, th, p { background-color: inherit !important; }
          }
          @media (max-width: 768px) {
            .sidebar { display: none; }
            .main { margin-left: 0 !important; padding: 1.5rem 1rem !important; }
          }
        `}</style>
      </Head>

      {/* Nav */}
      <nav style={s.nav}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 16, fontWeight: 900, letterSpacing: '-0.5px' }}>Growster<span style={{ color: '#ff0080' }}>.</span></span>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Brand Book</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => window.print()} style={{ padding: '8px 18px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.1)', background: '#151520', color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>↓ Export PDF</button>
          <a href="/" style={{ padding: '8px 18px', borderRadius: 99, border: 'none', background: 'linear-gradient(135deg,#ff0080,#cc0055)', color: '#fff', fontSize: 12, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>← Site</a>
        </div>
      </nav>

      {/* Sidebar */}
      <div className="sidebar" style={s.sidebar}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Contents</div>
        {sections.map(sec => (
          <a key={sec.id} href={`#${sec.id}`}
            style={{ display: 'block', padding: '8px 12px', borderRadius: 10, fontSize: 13, fontWeight: activeSection === sec.id ? 700 : 500, color: activeSection === sec.id ? '#ff0080' : 'rgba(255,255,255,0.45)', textDecoration: 'none', marginBottom: 2, background: activeSection === sec.id ? 'rgba(255,0,128,0.08)' : 'transparent', transition: 'all 0.15s' }}
            onClick={() => setActiveSection(sec.id)}>
            {sec.label}
          </a>
        ))}
      </div>

      {/* Main content */}
      <main className="main" style={s.main}>

        {/* Overview */}
        <div id="overview" style={s.section}>
          <span style={s.label}>Growster Design System v1.0</span>
          <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-2px', marginBottom: 16, lineHeight: 1.1 }}>
            The Growster<br />
            <span style={{ background: 'linear-gradient(135deg,#ff0080,#0050ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Brand Book.</span>
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', maxWidth: 560, lineHeight: 1.8, marginBottom: 32 }}>
            This document defines the complete design language for Growster — covering colors, typography, spacing, components, motion, and voice. Use it to brief designers, developers, or AI tools.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {[
              { label: 'Primary Font', value: 'Montserrat' },
              { label: 'Base Color', value: '#050508' },
              { label: 'Brand Color', value: '#ff0080' },
              { label: 'Border Radius', value: '99px (pills)' },
              { label: 'Design Mode', value: 'Dark only' },
              { label: 'Personality', value: 'Bold, sharp, human' },
            ].map(item => (
              <div key={item.label} style={s.card}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{item.label}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div id="colors" style={s.section}>
          <span style={s.label}>Color System</span>
          <h2 style={s.h2}>Colors</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 24, lineHeight: 1.7 }}>All colors are designed for dark backgrounds only. Never use on white or light surfaces.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10, marginBottom: 32 }}>
            {colors.map(c => (
              <div key={c.name} style={{ ...s.card, display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: c.hex, flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)' }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 2, fontFamily: 'monospace' }}>{c.hex}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{c.usage}</div>
                </div>
              </div>
            ))}
          </div>

          <h3 style={s.h3}>Gradients</h3>
          <div style={{ display: 'grid', gap: 10 }}>
            {gradients.map(g => (
              <div key={g.name} style={{ ...s.card, display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ width: 80, height: 40, borderRadius: 10, background: g.value, flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{g.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace', marginBottom: 2 }}>{g.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{g.usage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div id="typography" style={s.section}>
          <span style={s.label}>Typography</span>
          <h2 style={s.h2}>Typography</h2>
          <div style={{ ...s.card, marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Primary Typeface</div>
            <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-1px', marginBottom: 4 }}>Montserrat</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>Google Fonts — weights: 300, 400, 500, 600, 700, 800, 900</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', background: '#111118', padding: '8px 12px', borderRadius: 8 }}>
              @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap')
            </div>
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            {typeScale.map(t => (
              <div key={t.name} style={{ ...s.card, display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ width: 120, flexShrink: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#ff0080' }}>{t.name}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{t.size} / {t.weight}</div>
                </div>
                <div style={{ flex: 1, fontSize: t.size, fontWeight: parseInt(t.weight), letterSpacing: t.tracking, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Growster.</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', maxWidth: 200, textAlign: 'right' as const }}>{t.usage}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Spacing */}
        <div id="spacing" style={s.section}>
          <span style={s.label}>Spacing & Layout</span>
          <h2 style={s.h2}>Spacing & Layout</h2>
          <h3 style={{ ...s.h3, marginTop: 0 }}>Spacing Scale</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, marginBottom: 32 }}>
            {spacing.map(sp => (
              <div key={sp.name} style={s.card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div style={{ height: 16, width: parseInt(sp.value) > 48 ? 48 : parseInt(sp.value), background: 'linear-gradient(135deg,#ff0080,#0050ff)', borderRadius: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>{sp.name}</span>
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{sp.usage}</div>
              </div>
            ))}
          </div>
          <h3 style={s.h3}>Border Radius</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
            {radii.map(r => (
              <div key={r.name} style={s.card}>
                <div style={{ width: 48, height: 32, background: 'rgba(255,0,128,0.2)', border: '2px solid #ff0080', borderRadius: r.value === '99px' ? 99 : parseInt(r.value), marginBottom: 10 }} />
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{r.name}</div>
                <div style={{ fontSize: 11, color: '#ff0080', fontFamily: 'monospace', marginBottom: 4 }}>{r.value}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{r.usage}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Components */}
        <div id="components" style={s.section}>
          <span style={s.label}>UI Components</span>
          <h2 style={s.h2}>Components</h2>
          <div style={{ display: 'grid', gap: 16 }}>
            {components.map(c => (
              <div key={c.name} style={s.card}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 16 }}>{c.name}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Specs</div>
                    <div style={s.code}>{c.code}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Preview</div>
                    <div style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {c.preview}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Icons & Emoji */}
        <div id="icons" style={s.section}>
          <span style={s.label}>Icons & Emoji</span>
          <h2 style={s.h2}>Icons & Emoji</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 24, lineHeight: 1.7 }}>Growster uses system emoji as UI icons — no icon library. Emoji add personality and reduce visual weight. Use sparingly and purposefully.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
            {emojis.map(e => (
              <div key={e.emoji} style={{ ...s.card, display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>{e.emoji}</span>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{e.usage}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Motion */}
        <div id="motion" style={s.section}>
          <span style={s.label}>Motion</span>
          <h2 style={s.h2}>Motion & Animation</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 24, lineHeight: 1.7 }}>Motion is purposeful and smooth. Use spring-like easing (cubic-bezier(0.16, 1, 0.3, 1)) for all UI transitions. Never use linear for UI — only for scrollbars and progress.</p>
          <div style={{ display: 'grid', gap: 10 }}>
            {motionRules.map(m => (
              <div key={m.name} style={{ ...s.card, display: 'grid', gridTemplateColumns: '160px 1fr 80px 180px', gap: 16, alignItems: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#ff0080' }}>{m.name}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>{m.value}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{m.duration}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{m.usage}</div>
              </div>
            ))}
          </div>
          <div style={{ ...s.card, marginTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Standard easing</div>
            <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#ff0080' }}>cubic-bezier(0.16, 1, 0.3, 1)</div>
            <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>/* Spring-like, fast start, smooth settle */</div>
          </div>
        </div>

        {/* Voice */}
        <div id="voice" style={s.section}>
          <span style={s.label}>Brand Voice</span>
          <h2 style={s.h2}>Voice & Tone</h2>
          <div style={{ display: 'grid', gap: 10 }}>
            {voiceRules.map(v => (
              <div key={v.rule} style={s.card}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{v.rule}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>"{v.example}"</div>
              </div>
            ))}
          </div>
        </div>

        {/* Do / Don't */}
        <div id="usage" style={s.section}>
          <span style={s.label}>Usage Rules</span>
          <h2 style={s.h2}>Do / Don't</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={s.card}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#10b981', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>✓ Do</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {dos.map((d, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ color: '#10b981', flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={s.card}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#fca5a5', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>✕ Don't</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {donts.map((d, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ color: '#fca5a5', flexShrink: 0, marginTop: 1 }}>✕</span>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Brief */}
          <div style={{ ...s.card, marginTop: 24, border: '1px solid rgba(255,0,128,0.2)', background: 'rgba(255,0,128,0.04)' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#ff0080', marginBottom: 12 }}>📋 AI Brief — Copy & Paste</div>
            <div style={{ ...s.code, fontSize: 11 }}>{`Design in the Growster design language:
- Dark background: #050508 (never white or light)
- Font: Montserrat only (900 for headlines, 700 for subheads, 500 for body)
- Primary color: #ff0080 (pink) — one accent per screen max
- Secondary: #0050ff (blue) — for gradients and secondary elements
- All buttons: pill-shaped (border-radius: 99px)
- Cards: glass effect — rgba(255,255,255,0.04) bg, rgba(255,255,255,0.08) border, blur(20px)
- Background: 3 gradient orbs (pink top-left, blue bottom-right, purple center-right)
- Headlines: gradient text using linear-gradient(135deg, #ff0080, #0050ff)
- Labels/tags: 10px, 700 weight, UPPERCASE, 0.15em letter-spacing
- Motion: cubic-bezier(0.16, 1, 0.3, 1) — spring easing
- Personality: Bold, sharp, human. No corporate language.
- Emoji: system emoji as icons, sparingly`}</div>
          </div>
        </div>

        <div style={{ height: 80, borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 40, paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>Growster Brand Book v1.0 · {new Date().getFullYear()}</span>
          <button onClick={() => window.print()} style={{ padding: '8px 18px', borderRadius: 99, border: 'none', background: 'linear-gradient(135deg,#ff0080,#cc0055)', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat' }}>↓ Export PDF</button>
        </div>
      </main>
    </>
  )
}
