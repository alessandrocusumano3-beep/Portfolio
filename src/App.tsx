import { useCallback, useEffect, useMemo, useState } from 'react'

const WHATSAPP_URL = 'https://wa.me/393773856938'
const PHONE_DISPLAY = '377 385 6938'
const EMAIL = 'centrofitnessproforma@gmail.com'

const LOYALTY_POINTS_KEY = 'proforma-gara-primavera-punti'
const LOYALTY_LAST_INGRESSO_KEY = 'proforma-gara-primavera-ultimo-ingresso'
const LOYALTY_NAME_KEY = 'proforma-gara-primavera-nome'
const PUNTI_MAX = 100
const COLS = 5
const ROWS = 20

const MILESTONES = [
  { punti: 30, label: '30 REGALO' },
  { punti: 50, label: '50 REGALO' },
  { punti: 80, label: '80 REGALO' },
  { punti: 100, label: '100 REGALO' },
] as const

type StaffMember = {
  name: string
  role: string
  cred?: string
  image: string
  bio: string
}

const STAFF: readonly StaffMember[] = [
  {
    name: 'Chiara Mainardi',
    role: 'Personal trainer',
    cred: 'Dottoressa in Scienze Motorie',
    image: '/staff-chiara.png',
    bio: 'Formazione scientifica e approccio personalizzato: ti accompagniamo verso obiettivi sicuri, misurabili e sostenibili nel tempo.',
  },
  {
    name: 'Matteo Conca',
    role: 'Personal trainer',
    image: '/staff-matteo.png',
    bio: 'Allenamento strutturato e costante, focus sulla tecnica e sulla progressione — in sala ti seguiamo con professionalità e attenzione al dettaglio.',
  },
  {
    name: 'Valutazioni & benessere',
    role: 'Analisi e percorsi',
    image: '/staff-valutazioni.png',
    bio: 'In sede supportiamo il tuo percorso con strumenti dedicati all’analisi corporea e alla definizione di un piano su misura, insieme al team.',
  },
]

const SEDI = [
  {
    nome: 'Sant’Angelo Lodigiano',
    via: 'Viale Trento e Trieste',
    tel: '0371 1681552',
    href: 'tel:+3903711681552',
  },
  {
    nome: 'Corteolona',
    via: 'Via Olona 5',
    tel: '0382 404072',
    href: 'tel:+390382404072',
  },
  {
    nome: 'Gerenzago',
    via: 'Via Villanterio 32',
    tel: '0382 1547437',
    href: 'tel:+3903821547437',
  },
] as const

const WEBSITE = 'https://www.proforma2020.it'

const SOCIAL = {
  instagram: 'https://www.instagram.com/proforma2020/',
  facebook: 'https://www.facebook.com/proforma2020',
  tiktok: 'https://www.tiktok.com/@proforma2020',
} as const

/** Immagini originali dai contenuti social / Facebook — usate come ambient e novità */
const GYM_IMG = {
  loyalty: '/img-1814.png',
  promo: '/img-1815.png',
  pilates: '/img-1816.png',
  main: '/img-1817.png',
} as const

const NOVITA_BLOCKS: readonly {
  id: string
  title: string
  caption: string
  img: string
  large: boolean
}[] = [
  {
    id: 'sala',
    title: 'Sala & attrezzatura',
    caption: 'Spazi luminosi, zona pesi e cardio: tutto ciò che serve per allenarti con metodo.',
    img: GYM_IMG.promo,
    large: true,
  },
  {
    id: 'pilates',
    title: 'Pilates & movimento',
    caption: 'Equilibrio e postura con corsi e lezioni dedicate al benessere.',
    img: GYM_IMG.pilates,
    large: false,
  },
  {
    id: 'promo',
    title: 'Offerte in corso',
    caption: 'Rottamazione abbonamento e mesi omaggio — passa in reception per i dettagli.',
    img: GYM_IMG.main,
    large: false,
  },
  {
    id: 'community',
    title: 'Premi & community',
    caption: 'Gara di Primavera e tessera punti: più ti alleni, più crescono i vantaggi.',
    img: GYM_IMG.loyalty,
    large: false,
  },
]

function oggiItalia(): string {
  return new Date().toLocaleDateString('it-IT', { timeZone: 'Europe/Rome' })
}

function DigitalLoyaltyCard() {
  const [punti, setPunti] = useState(0)
  const [nome, setNome] = useState('')
  const [ultimoIngresso, setUltimoIngresso] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const p = Number(localStorage.getItem(LOYALTY_POINTS_KEY))
      if (!Number.isNaN(p) && p >= 0) setPunti(Math.min(PUNTI_MAX, p))
      setNome(localStorage.getItem(LOYALTY_NAME_KEY) ?? '')
      setUltimoIngresso(localStorage.getItem(LOYALTY_LAST_INGRESSO_KEY))
    } catch {
      /* ignore */
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(LOYALTY_POINTS_KEY, String(punti))
    } catch {
      /* ignore */
    }
  }, [punti, hydrated])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(LOYALTY_NAME_KEY, nome.trim())
    } catch {
      /* ignore */
    }
  }, [nome, hydrated])

  const ingressoDisponibileOggi = ultimoIngresso !== oggiItalia()

  const segnaIngresso = useCallback(() => {
    const oggi = oggiItalia()
    if (ultimoIngresso === oggi) return
    setPunti((n) => Math.min(PUNTI_MAX, n + 1))
    setUltimoIngresso(oggi)
    try {
      localStorage.setItem(LOYALTY_LAST_INGRESSO_KEY, oggi)
    } catch {
      /* ignore */
    }
  }, [ultimoIngresso])

  const azzeraDemo = useCallback(() => {
    setPunti(0)
    setUltimoIngresso(null)
    try {
      localStorage.removeItem(LOYALTY_POINTS_KEY)
      localStorage.removeItem(LOYALTY_LAST_INGRESSO_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  const celle = useMemo(() => {
    const out: { i: number; milestone?: (typeof MILESTONES)[number] }[] = []
    for (let i = 0; i < PUNTI_MAX; i++) {
      const n = i + 1
      const ms = MILESTONES.find((m) => m.punti === n)
      out.push({ i, milestone: ms })
    }
    return out
  }, [])

  return (
    <div className="pf-stamp-wrap">
      <p className="pf-stamp-intro">
        Bigliettino digitale &quot;Gara di Primavera&quot;: ogni ingresso in palestra vale{' '}
        <strong>1 punto</strong>. Timbra qui come promemoria; i punti ufficiali restano quelli
        registrati in reception.
      </p>
      <div className="pf-stamp-actions">
        <button
          type="button"
          className="pf-btn pf-btn--ingresso"
          onClick={segnaIngresso}
          disabled={!ingressoDisponibileOggi || punti >= PUNTI_MAX}
        >
          {punti >= PUNTI_MAX
            ? 'Hai raggiunto 100 punti!'
            : ingressoDisponibileOggi
              ? '+1 punto — ho fatto ingresso oggi'
              : 'Ingresso di oggi già registrato'}
        </button>
        <button type="button" className="pf-btn pf-btn--ghost" onClick={azzeraDemo}>
          Azzera demo
        </button>
      </div>
      <p className="pf-stamp-meta">
        Punti accumulati: <strong>{punti}</strong> / {PUNTI_MAX}
      </p>

      <div className="pf-stamp-card" aria-label="Tessera punti Gara di Primavera">
        <div className="pf-stamp-card__main">
          <div className="pf-stamp-card__title">Gara di Primavera</div>
          <div className="pf-stamp-watermark" aria-hidden>
            PF
          </div>
          <div className="pf-stamp-grid">
            {celle.map(({ i, milestone }) => {
              const filled = i < punti
              return (
                <div
                  key={i}
                  className={`pf-stamp-cell${filled ? ' pf-stamp-cell--filled' : ''}${milestone ? ' pf-stamp-cell--milestone' : ''}`}
                >
                  {milestone ? (
                    <span className="pf-stamp-milestone">{milestone.label}</span>
                  ) : null}
                  <span className="pf-stamp-daisy" aria-hidden>
                    <svg viewBox="0 0 32 32" className="pf-stamp-daisy__svg">
                      <circle cx="16" cy="16" r="11" fill="rgba(255,255,255,0.95)" />
                      <circle cx="16" cy="16" r="5.5" fill="#fff3a0" />
                    </svg>
                  </span>
                </div>
              )
            })}
          </div>
        </div>
        <div className="pf-stamp-rail" aria-hidden>
          <span>PUNTI</span>
        </div>
        <div className="pf-stamp-footer">
          <div className="pf-stamp-footer__promo">Gara di Primavera</div>
          <div className="pf-stamp-footer__row">
            <label className="pf-stamp-footer__label" htmlFor="tessera-nome">
              Tessera di:
            </label>
            <input
              id="tessera-nome"
              className="pf-stamp-footer__input"
              type="text"
              placeholder="Il tuo nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              maxLength={48}
              autoComplete="name"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function StaffCard({ member }: { member: StaffMember }) {
  return (
    <div className="pf-staff-tilt">
      <article className="pf-staff-card">
        <div className="pf-staff-card__shine" aria-hidden />
        <div className="pf-staff-card__photo">
          <img
            src={member.image}
            alt={
              member.name.includes('&')
                ? 'Team valutazioni e analisi in sede ProForma 2020'
                : `Ritratto professionale di ${member.name}, ${member.role} ProForma 2020`
            }
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="pf-staff-card__body">
          <h3 className="pf-staff-card__name">{member.name}</h3>
          <p className="pf-staff-card__role">{member.role}</p>
          {member.cred ? <p className="pf-staff-card__cred">{member.cred}</p> : null}
          <p className="pf-staff-card__bio">{member.bio}</p>
        </div>
      </article>
    </div>
  )
}

function App() {
  return (
    <div className="pf">
      <div className="pf-atmosphere" aria-hidden />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Outfit:wght@400;500;600;700&family=Syne:wght@500;600;700&display=swap');

        @keyframes pf-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(2%, -2%) scale(1.03); }
        }

        @keyframes pf-shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        @keyframes pf-glow-pulse {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 0.75; }
        }

        @media (prefers-reduced-motion: reduce) {
          .pf-atmosphere::before,
          .pf-hero__mesh {
            animation: none !important;
          }
          .pf-gym-pillar:hover,
          .pf-bento__cell:hover,
          .pf-course:hover,
          .pf-perk:hover,
          .pf-card:hover,
          .pf-staff-tilt:hover .pf-staff-card,
          .pf-location-card:hover {
            transform: none !important;
          }
        }

        .pf {
          --pf-black: #0c0c0c;
          --pf-white: #fafafa;
          --pf-green: #c8f542;
          --pf-green-deep: #7cb518;
          --pf-green-dark: #3d5c1f;
          --pf-gold: #d4af37;
          --pf-gold-soft: #c9a227;
          --pf-muted: #a3a3a3;
          --pf-card: #141414;
          --pf-border: #262626;
          font-family: 'Outfit', system-ui, sans-serif;
          color: var(--pf-white);
          background: var(--pf-black);
          line-height: 1.55;
          -webkit-font-smoothing: antialiased;
        }

        .pf * { box-sizing: border-box; }

        .pf a { color: inherit; }

        .pf-atmosphere {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .pf-atmosphere::before {
          content: '';
          position: absolute;
          width: 140%;
          height: 140%;
          top: -20%;
          left: -20%;
          background:
            radial-gradient(ellipse 50% 40% at 20% 30%, rgba(200, 245, 66, 0.09) 0%, transparent 55%),
            radial-gradient(ellipse 45% 35% at 85% 20%, rgba(212, 175, 55, 0.07) 0%, transparent 50%),
            radial-gradient(ellipse 60% 50% at 50% 100%, rgba(60, 90, 30, 0.15) 0%, transparent 55%);
          animation: pf-float 28s ease-in-out infinite;
        }

        .pf-atmosphere::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.5;
          mix-blend-mode: overlay;
        }

        .pf > main,
        .pf > header,
        .pf > footer {
          position: relative;
          z-index: 1;
        }

        .pf-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.25rem;
          background: linear-gradient(180deg, rgba(8,8,10,0.88) 0%, rgba(8,8,10,0.55) 85%, transparent 100%);
          backdrop-filter: blur(14px) saturate(1.2);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow: 0 4px 40px rgba(0, 0, 0, 0.35);
        }

        .pf-brand {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.5rem;
          letter-spacing: 0.04em;
          color: var(--pf-white);
          text-decoration: none;
        }

        .pf-brand span { color: var(--pf-green); }

        .pf-nav {
          display: none;
          gap: 1.5rem;
          align-items: center;
        }

        @media (min-width: 768px) {
          .pf-nav { display: flex; }
        }

        .pf-nav a {
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          color: var(--pf-muted);
          transition: color 0.2s;
        }

        .pf-nav a:hover { color: var(--pf-green); }

        .pf-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.85rem 1.5rem;
          font-family: inherit;
          font-size: 0.95rem;
          font-weight: 600;
          text-decoration: none;
          border: none;
          border-radius: 999px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .pf-btn:active { transform: scale(0.98); }

        .pf-btn--wa {
          background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
          color: #fff;
          box-shadow: 0 8px 32px rgba(37, 211, 102, 0.35);
        }

        .pf-btn--wa:hover {
          box-shadow: 0 12px 40px rgba(37, 211, 102, 0.45);
        }

        .pf-btn--outline {
          background: transparent;
          color: var(--pf-white);
          border: 2px solid var(--pf-border);
        }

        .pf-btn--outline:hover {
          border-color: var(--pf-green);
          color: var(--pf-green);
        }

        .pf-hero {
          position: relative;
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 6.5rem 1.25rem 3.5rem;
          overflow: hidden;
        }

        .pf-hero__bg {
          position: absolute;
          inset: 0;
          background-image: url(${GYM_IMG.promo});
          background-size: cover;
          background-position: center 40%;
          transform: scale(1.02);
        }

        .pf-hero__bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, rgba(8, 10, 8, 0.92) 0%, rgba(8, 10, 8, 0.45) 48%, rgba(8, 10, 8, 0.75) 100%);
        }

        .pf-hero__overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 90% 70% at 70% 80%, rgba(200, 245, 66, 0.07) 0%, transparent 55%);
          pointer-events: none;
        }

        .pf-hero__mesh {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            125deg,
            rgba(200, 245, 66, 0.03) 0%,
            transparent 40%,
            rgba(212, 175, 55, 0.04) 100%
          );
          pointer-events: none;
          animation: pf-glow-pulse 10s ease-in-out infinite;
        }

        .pf-hero__accent {
          position: absolute;
          top: 25%;
          right: -15%;
          width: 55%;
          height: 45%;
          background: radial-gradient(ellipse, rgba(200, 245, 66, 0.12) 0%, transparent 70%);
          pointer-events: none;
          filter: blur(40px);
        }

        .pf-hero__inner {
          position: relative;
          max-width: 58rem;
          margin: 0 auto;
          width: 100%;
        }

        .pf-tagline {
          font-family: 'Syne', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--pf-green);
          margin-bottom: 0.85rem;
        }

        .pf-hero h1 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2.85rem, 9vw, 5rem);
          line-height: 0.92;
          letter-spacing: 0.03em;
          margin: 0 0 1rem;
          font-weight: 400;
          text-shadow: 0 4px 48px rgba(0, 0, 0, 0.5);
        }

        .pf-hero p {
          font-size: 1.08rem;
          color: rgba(200, 200, 200, 0.92);
          max-width: 34rem;
          margin: 0 0 1.75rem;
          line-height: 1.6;
        }

        .pf-hero__stats {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem 1.25rem;
          margin-bottom: 2rem;
        }

        .pf-hero__stat {
          font-family: 'Syne', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(250, 250, 250, 0.85);
          padding: 0.5rem 0.9rem;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
        }

        .pf-hero__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .pf-btn--glow {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%);
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: var(--pf-white);
          backdrop-filter: blur(8px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .pf-btn--glow:hover {
          border-color: var(--pf-green);
          color: var(--pf-green);
          box-shadow: 0 0 40px rgba(200, 245, 66, 0.15);
        }

        .pf-section {
          padding: 4.5rem 1.25rem;
          position: relative;
        }

        .pf-eyebrow {
          font-family: 'Syne', sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--pf-gold);
          margin: 0 0 0.65rem;
        }

        .pf-section--gym {
          background: linear-gradient(180deg, rgba(11, 11, 14, 0.98) 0%, var(--pf-black) 100%);
          border-top: 1px solid rgba(255, 255, 255, 0.04);
        }

        .pf-gym-pillars {
          display: grid;
          gap: 1rem;
          margin-top: 2rem;
        }

        @media (min-width: 768px) {
          .pf-gym-pillars {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .pf-gym-pillar {
          padding: 1.55rem 1.35rem;
          border-radius: 1.35rem;
          background: linear-gradient(155deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%);
          border: 1px solid rgba(255, 255, 255, 0.09);
          backdrop-filter: blur(14px);
          transform-style: preserve-3d;
          transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.45s;
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.05) inset,
            0 24px 56px rgba(0, 0, 0, 0.38);
        }

        .pf-gym-pillar:hover {
          transform: translateY(-8px) perspective(800px) rotateX(6deg);
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.1) inset,
            0 36px 72px rgba(0, 0, 0, 0.48),
            0 0 80px rgba(200, 245, 66, 0.05);
        }

        .pf-gym-pillar__num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2.4rem;
          line-height: 1;
          background: linear-gradient(135deg, #e8f96a 0%, var(--pf-green-deep) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.45rem;
        }

        .pf-gym-pillar h3 {
          font-family: 'Syne', sans-serif;
          font-size: 1.02rem;
          font-weight: 700;
          margin: 0 0 0.5rem;
          color: var(--pf-white);
        }

        .pf-gym-pillar p {
          margin: 0;
          font-size: 0.87rem;
          color: var(--pf-muted);
          line-height: 1.55;
        }

        .pf-section--novita {
          background: linear-gradient(180deg, var(--pf-black) 0%, #0c0c0f 45%, var(--pf-black) 100%);
          position: relative;
        }

        .pf-section--novita::before {
          content: '';
          position: absolute;
          top: 0;
          left: 10%;
          right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(200, 245, 66, 0.22), transparent);
        }

        .pf-wrap--wide {
          max-width: 82rem;
        }

        .pf-bento {
          display: grid;
          gap: 1rem;
          grid-template-columns: 1fr;
        }

        .pf-bento__cell {
          position: relative;
          border-radius: 1.35rem;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transform-style: preserve-3d;
          transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.5s;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.42);
          min-height: 260px;
        }

        @media (min-width: 900px) {
          .pf-bento {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            grid-auto-rows: minmax(190px, auto);
            gap: 1.25rem;
          }

          .pf-bento__cell--lg {
            grid-column: span 7;
            grid-row: span 2;
            min-height: 440px;
          }

          .pf-bento__cell:not(.pf-bento__cell--lg) {
            grid-column: span 5;
          }
        }

        .pf-bento__cell:hover {
          transform: translateY(-6px) scale(1.008);
          box-shadow:
            0 32px 80px rgba(0, 0, 0, 0.55),
            0 0 0 1px rgba(200, 245, 66, 0.14);
        }

        .pf-bento__visual {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transform: scale(1.06);
          transition: transform 0.65s ease;
        }

        .pf-bento__cell:hover .pf-bento__visual {
          transform: scale(1.12);
        }

        .pf-bento__visual::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(185deg, rgba(8, 8, 10, 0.1) 0%, rgba(8, 8, 10, 0.55) 45%, rgba(8, 8, 10, 0.95) 100%);
        }

        .pf-bento__glass {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1.4rem 1.45rem;
          z-index: 1;
        }

        .pf-bento__badge {
          align-self: flex-start;
          font-family: 'Syne', sans-serif;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--pf-green);
          margin-bottom: 0.45rem;
          padding: 0.32rem 0.62rem;
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(200, 245, 66, 0.28);
          backdrop-filter: blur(10px);
        }

        .pf-bento__glass h3 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(1.5rem, 3vw, 2rem);
          letter-spacing: 0.06em;
          margin: 0 0 0.4rem;
          text-shadow: 0 4px 24px rgba(0, 0, 0, 0.65);
        }

        .pf-bento__glass p {
          margin: 0;
          font-size: 0.88rem;
          color: rgba(235, 235, 235, 0.92);
          line-height: 1.5;
          max-width: 32rem;
        }

        .pf-section--offers {
          background: var(--pf-card);
          border-top: 1px solid var(--pf-border);
          border-bottom: 1px solid var(--pf-border);
        }

        .pf-section--courses {
          background:
            radial-gradient(ellipse 80% 50% at 50% 0%, rgba(200, 245, 66, 0.06) 0%, transparent 55%),
            linear-gradient(180deg, #0f0f0f 0%, var(--pf-black) 100%);
        }

        .pf-section--staff {
          background:
            radial-gradient(ellipse 70% 50% at 50% 0%, rgba(212, 175, 55, 0.05) 0%, transparent 55%),
            linear-gradient(180deg, #0a0a0c 0%, var(--pf-black) 100%);
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          text-align: center;
        }

        .pf-section--staff .pf-lead {
          margin-left: auto;
          margin-right: auto;
          max-width: 26rem;
          font-size: 0.95rem;
        }

        .pf-section--staff h2 {
          font-size: clamp(1.75rem, 4vw, 2.35rem);
          opacity: 0.95;
        }

        .pf-section--perks {
          overflow: hidden;
          background: radial-gradient(ellipse 60% 40% at 80% 20%, rgba(212, 175, 55, 0.06) 0%, transparent 50%),
            var(--pf-black);
        }

        .pf-section--contact {
          background: linear-gradient(160deg, var(--pf-green-dark) 0%, var(--pf-black) 55%);
        }

        .pf-wrap {
          max-width: 72rem;
          margin: 0 auto;
          width: 100%;
          position: relative;
        }

        .pf-section h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2rem, 5vw, 3rem);
          letter-spacing: 0.03em;
          margin: 0 0 0.5rem;
          font-weight: 400;
        }

        .pf-lead {
          color: var(--pf-muted);
          max-width: 36rem;
          margin: 0 0 2.5rem;
          font-size: 1rem;
        }

        .pf-offers-grid {
          display: grid;
          gap: 2rem;
          align-items: stretch;
        }

        @media (min-width: 900px) {
          .pf-offers-grid {
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
          }
        }

        .pf-offers-panel {
          border-radius: 1.25rem;
          padding: 2rem 1.75rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: linear-gradient(145deg, rgba(30, 32, 28, 0.95) 0%, rgba(14, 14, 16, 0.98) 100%);
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.06) inset,
            0 28px 72px rgba(0, 0, 0, 0.45);
          text-align: left;
          display: flex;
          flex-direction: column;
          justify-content: center;
          transform-style: preserve-3d;
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }

        .pf-offers-panel:hover {
          transform: perspective(1000px) rotateY(-2deg) translateZ(4px);
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.08) inset,
            0 36px 88px rgba(0, 0, 0, 0.5);
        }

        .pf-offers-panel__kicker {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--pf-gold);
          margin-bottom: 0.75rem;
        }

        .pf-offers-panel__title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2rem, 5vw, 2.75rem);
          line-height: 1;
          letter-spacing: 0.04em;
          margin: 0 0 1rem;
          color: var(--pf-white);
        }

        .pf-offers-panel__text {
          color: var(--pf-muted);
          font-size: 0.98rem;
          margin: 0 0 1.5rem;
          line-height: 1.6;
        }

        .pf-offers-panel__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .pf-offers-panel__list li {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          font-size: 0.92rem;
          color: rgba(250, 250, 250, 0.88);
        }

        .pf-offers-panel__list li::before {
          content: '';
          flex-shrink: 0;
          width: 6px;
          height: 6px;
          margin-top: 0.45rem;
          border-radius: 50%;
          background: var(--pf-green);
          box-shadow: 0 0 0 3px rgba(200, 245, 66, 0.2);
        }

        .pf-staff-grid {
          display: grid;
          gap: 1.35rem;
        }

        @media (min-width: 768px) {
          .pf-staff-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
          }
        }

        .pf-staff-tilt {
          perspective: 1000px;
        }

        .pf-staff-card {
          position: relative;
          background: linear-gradient(180deg, #161618 0%, #101012 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 1.15rem;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transform-style: preserve-3d;
          transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.45s, border-color 0.35s;
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.05) inset,
            0 20px 50px rgba(0, 0, 0, 0.4);
        }

        .pf-staff-tilt:hover .pf-staff-card {
          transform: rotateX(4deg) rotateY(-5deg) translateZ(12px);
          border-color: rgba(212, 175, 55, 0.25);
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.08) inset,
            0 28px 60px rgba(0, 0, 0, 0.5),
            -8px 8px 40px rgba(0, 0, 0, 0.35);
        }

        .pf-staff-card__shine {
          position: absolute;
          top: 0;
          left: -40%;
          width: 50%;
          height: 100%;
          background: linear-gradient(95deg, transparent, rgba(255, 255, 255, 0.06), transparent);
          transform: skewX(-18deg);
          pointer-events: none;
          z-index: 3;
          opacity: 0;
          transition: opacity 0.4s, left 0.55s ease;
        }

        .pf-staff-tilt:hover .pf-staff-card__shine {
          opacity: 1;
          left: 120%;
        }

        .pf-staff-card__photo {
          aspect-ratio: 3 / 4;
          background: linear-gradient(160deg, #2a2a2e 0%, #1a1a1c 100%);
          overflow: hidden;
          position: relative;
        }

        .pf-staff-card__photo::after {
          content: '';
          position: absolute;
          inset: 0;
          box-shadow: 0 -30px 40px rgba(0, 0, 0, 0.45) inset;
          pointer-events: none;
        }

        .pf-staff-card__photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 12%;
          display: block;
          filter: saturate(1.05) contrast(1.03);
        }

        .pf-staff-card__body {
          padding: 1.15rem 1.15rem 1.35rem;
          text-align: left;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .pf-staff-card__name {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.35rem;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: var(--pf-gold);
          margin: 0 0 0.2rem;
          line-height: 1.15;
        }

        .pf-staff-card__role {
          font-family: 'Syne', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(250, 250, 250, 0.88);
          margin: 0 0 0.3rem;
        }

        .pf-staff-card__cred {
          font-size: 0.78rem;
          color: var(--pf-muted);
          font-style: italic;
          margin: 0 0 0.55rem;
        }

        .pf-staff-card__bio {
          margin: 0;
          font-size: 0.82rem;
          color: var(--pf-muted);
          line-height: 1.5;
          margin-top: auto;
        }

        .pf-cards {
          display: grid;
          gap: 1rem;
        }

        .pf-card {
          background: linear-gradient(160deg, rgba(18, 18, 20, 0.98) 0%, rgba(8, 8, 10, 1) 100%);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 1.1rem;
          padding: 1.35rem 1.5rem;
          transition: transform 0.35s ease, border-color 0.25s, box-shadow 0.35s;
          transform-style: preserve-3d;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
        }

        .pf-card:hover {
          transform: translateY(-3px) perspective(900px) rotateX(2deg);
          border-color: rgba(200, 245, 66, 0.28);
          box-shadow: 0 20px 56px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(200, 245, 66, 0.06);
        }

        .pf-card--highlight {
          background: linear-gradient(135deg, rgba(200, 245, 66, 0.12) 0%, rgba(20, 20, 20, 1) 100%);
          border-color: rgba(200, 245, 66, 0.35);
        }

        .pf-card h3 {
          margin: 0 0 0.5rem;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--pf-green);
        }

        .pf-card p {
          margin: 0;
          color: var(--pf-muted);
          font-size: 0.95rem;
        }

        .pf-badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.35rem 0.65rem;
          border-radius: 6px;
          background: rgba(200, 245, 66, 0.2);
          color: var(--pf-green);
          margin-bottom: 0.75rem;
        }

        .pf-courses {
          display: grid;
          gap: 1.25rem;
        }

        @media (min-width: 640px) {
          .pf-courses { grid-template-columns: repeat(2, 1fr); }
        }

        @media (min-width: 1100px) {
          .pf-courses { grid-template-columns: repeat(4, 1fr); }
        }

        .pf-course {
          position: relative;
          border-radius: 1.15rem;
          overflow: hidden;
          min-height: 280px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transform-style: preserve-3d;
          transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.45s;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
        }

        .pf-course__bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: transform 0.4s ease;
        }

        .pf-course--pilates .pf-course__bg {
          background-image: linear-gradient(165deg, rgba(10, 14, 10, 0.75) 0%, rgba(8, 10, 8, 0.88) 100%),
            url(${GYM_IMG.pilates});
          background-size: cover;
          background-position: center 35%;
        }

        .pf-course--pt .pf-course__bg {
          background-image: linear-gradient(180deg, rgba(10, 10, 12, 0.55) 0%, rgba(8, 8, 10, 0.88) 100%),
            url(${GYM_IMG.promo});
          background-size: cover;
          background-position: center 40%;
        }

        .pf-course--boxe .pf-course__bg {
          background-image: linear-gradient(150deg, rgba(35, 12, 12, 0.82) 0%, rgba(8, 8, 10, 0.9) 100%),
            url(${GYM_IMG.promo});
          background-size: cover;
          background-position: 60% 50%;
        }

        .pf-course--tutti .pf-course__bg {
          background-image: linear-gradient(140deg, rgba(18, 20, 14, 0.8) 0%, rgba(8, 8, 10, 0.92) 100%),
            url(${GYM_IMG.main});
          background-size: cover;
          background-position: center 30%;
        }

        .pf-course:hover {
          transform: translateY(-6px) perspective(900px) rotateX(3deg);
          box-shadow: 0 32px 70px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(200, 245, 66, 0.1);
        }

        .pf-course:hover .pf-course__bg { transform: scale(1.06); }

        .pf-course__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 0%, rgba(12,12,12,0.92) 100%);
        }

        .pf-course__body {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1.25rem;
        }

        .pf-course h3 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.75rem;
          margin: 0 0 0.35rem;
          letter-spacing: 0.04em;
        }

        .pf-course p {
          margin: 0;
          font-size: 0.875rem;
          color: var(--pf-muted);
        }

        .pf-perks {
          display: grid;
          gap: 1.25rem;
        }

        @media (min-width: 700px) {
          .pf-perks { grid-template-columns: repeat(3, 1fr); }
        }

        .pf-perk {
          text-align: center;
          padding: 2rem 1.35rem;
          background: linear-gradient(165deg, rgba(22, 22, 26, 0.95) 0%, rgba(12, 12, 14, 0.98) 100%);
          border-radius: 1.25rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          transform-style: preserve-3d;
          transition: transform 0.4s ease, box-shadow 0.4s ease, border-color 0.35s;
          box-shadow: 0 18px 48px rgba(0, 0, 0, 0.35);
        }

        .pf-perk:hover {
          transform: translateY(-5px) perspective(800px) rotateX(4deg);
          border-color: rgba(200, 245, 66, 0.2);
          box-shadow: 0 28px 64px rgba(0, 0, 0, 0.45), 0 0 50px rgba(200, 245, 66, 0.06);
        }

        .pf-perk__icon {
          width: 3.5rem;
          height: 3.5rem;
          margin: 0 auto 1rem;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--pf-green) 0%, var(--pf-green-deep) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .pf-perk h3 {
          margin: 0 0 0.5rem;
          font-size: 1.05rem;
          font-weight: 700;
        }

        .pf-perk p {
          margin: 0;
          color: var(--pf-muted);
          font-size: 0.9rem;
        }

        .pf-contact-grid {
          display: grid;
          gap: 1.5rem;
        }

        @media (min-width: 640px) {
          .pf-contact-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .pf-contact-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          padding: 1.25rem;
          background: rgba(0, 0, 0, 0.35);
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .pf-contact-item strong {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--pf-green);
          margin-bottom: 0.35rem;
        }

        .pf-contact-item a {
          font-weight: 600;
          text-decoration: none;
          color: var(--pf-white);
        }

        .pf-contact-item a:hover { text-decoration: underline; }

        .pf-contact-locations {
          display: grid;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        @media (min-width: 768px) {
          .pf-contact-locations { grid-template-columns: repeat(3, 1fr); }
        }

        .pf-location-card {
          padding: 1.2rem 1.25rem;
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.07) 0%, rgba(0, 0, 0, 0.38) 100%);
          border-radius: 1.15rem;
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(10px);
          text-align: left;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.28);
        }

        .pf-location-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 56px rgba(0, 0, 0, 0.38);
        }

        .pf-location-card h3 {
          margin: 0 0 0.35rem;
          font-size: 1rem;
          font-weight: 700;
          color: var(--pf-white);
        }

        .pf-location-card p {
          margin: 0 0 0.5rem;
          font-size: 0.88rem;
          color: rgba(250, 250, 250, 0.75);
          line-height: 1.45;
        }

        .pf-location-card a {
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          color: var(--pf-green);
        }

        .pf-location-card a:hover {
          text-decoration: underline;
        }

        .pf-footer {
          padding: 2rem 1.25rem;
          border-top: 1px solid var(--pf-border);
          text-align: center;
          background: #080808;
        }

        .pf-footer p {
          margin: 0.35rem 0;
          font-size: 0.875rem;
          color: var(--pf-muted);
        }

        .pf-footer__name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.35rem;
          letter-spacing: 0.05em;
          color: var(--pf-white);
        }

        .pf-footer-social {
          display: flex;
          justify-content: center;
          gap: 1.25rem;
          margin: 1.25rem 0 0.5rem;
        }

        .pf-footer-social a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background: var(--pf-card);
          border: 1px solid var(--pf-border);
          color: var(--pf-muted);
          transition: color 0.2s, border-color 0.2s, background 0.2s;
        }

        .pf-footer-social a:hover {
          color: var(--pf-green);
          border-color: rgba(200, 245, 66, 0.4);
          background: #1a1a1a;
        }

        .pf-footer-social svg {
          width: 1.15rem;
          height: 1.15rem;
          fill: currentColor;
        }

        .pf-section--stamp {
          background: linear-gradient(180deg, #1a1a1a 0%, var(--pf-black) 100%);
          border-bottom: 1px solid var(--pf-border);
        }

        .pf-stamp-wrap {
          max-width: 22rem;
          margin: 0 auto;
        }

        .pf-stamp-intro {
          color: var(--pf-muted);
          font-size: 0.9rem;
          margin: 0 0 1.25rem;
          text-align: center;
          max-width: 24rem;
          margin-left: auto;
          margin-right: auto;
        }

        .pf-stamp-intro strong { color: var(--pf-white); }

        .pf-stamp-actions {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          margin-bottom: 0.75rem;
        }

        .pf-btn--ingresso {
          background: linear-gradient(135deg, #ff8c42 0%, #ff5a1f 100%);
          color: #1a0a00;
          font-weight: 700;
          border-radius: 12px;
          width: 100%;
        }

        .pf-btn--ingresso:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          transform: none;
        }

        .pf-btn--ghost {
          background: transparent;
          color: var(--pf-muted);
          font-size: 0.8rem;
          font-weight: 500;
          padding: 0.5rem;
          border-radius: 8px;
          border: 1px dashed var(--pf-border);
          width: 100%;
        }

        .pf-btn--ghost:hover {
          color: var(--pf-white);
          border-color: var(--pf-muted);
        }

        .pf-stamp-meta {
          text-align: center;
          font-size: 0.85rem;
          color: var(--pf-muted);
          margin: 0 0 1.5rem;
        }

        .pf-stamp-meta strong {
          color: var(--pf-green);
          font-size: 1.05rem;
        }

        .pf-stamp-card {
          display: flex;
          flex-wrap: wrap;
          align-items: stretch;
          border-radius: 14px;
          overflow: hidden;
          box-shadow:
            0 4px 0 rgba(0, 0, 0, 0.2),
            0 20px 50px rgba(0, 0, 0, 0.55);
          border: 3px solid #e85d04;
        }

        .pf-stamp-card__main {
          flex: 1 1 calc(100% - 2.35rem);
          min-width: 0;
          background: #ff6b1a;
          background-image:
            radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.12) 0%, transparent 45%),
            radial-gradient(circle at 80% 70%, rgba(255, 220, 100, 0.15) 0%, transparent 40%);
          position: relative;
          padding: 0.5rem 0.4rem 0.45rem 0.5rem;
        }

        .pf-stamp-card__title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.35rem;
          letter-spacing: 0.12em;
          text-align: center;
          color: #fff;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          margin-bottom: 0.35rem;
        }

        .pf-stamp-watermark {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(5rem, 28vw, 7.5rem);
          color: rgba(255, 255, 255, 0.08);
          pointer-events: none;
          letter-spacing: -0.05em;
        }

        .pf-stamp-rail {
          flex: 0 0 2.35rem;
          width: 2.35rem;
          background: linear-gradient(180deg, #c8f542 0%, #7cb518 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          font-weight: 800;
          font-size: 0.95rem;
          letter-spacing: 0.35em;
          color: #fff;
          text-transform: uppercase;
          border-left: 2px solid rgba(0, 0, 0, 0.08);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
        }

        .pf-stamp-rail span {
          padding: 0.5rem 0;
        }

        .pf-stamp-grid {
          display: grid;
          grid-template-columns: repeat(${COLS}, 1fr);
          grid-template-rows: repeat(${ROWS}, 1fr);
          gap: 3px;
          position: relative;
          z-index: 1;
        }

        .pf-stamp-cell {
          position: relative;
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 0;
        }

        .pf-stamp-cell--milestone {
          z-index: 2;
        }

        .pf-stamp-milestone {
          position: absolute;
          top: -2px;
          left: 50%;
          transform: translateX(-50%) scale(0.62);
          transform-origin: top center;
          background: #d32f2f;
          color: #fff;
          font-size: 0.45rem;
          font-weight: 800;
          line-height: 1.1;
          padding: 2px 3px;
          border-radius: 2px;
          text-align: center;
          white-space: nowrap;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
          z-index: 3;
          max-width: 140%;
        }

        .pf-stamp-daisy {
          display: block;
          width: 100%;
          height: 100%;
          max-width: 1.65rem;
          max-height: 1.65rem;
          margin: 0 auto;
        }

        .pf-stamp-daisy__svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.12));
        }

        .pf-stamp-cell--filled .pf-stamp-daisy__svg circle:first-child {
          fill: rgba(255, 255, 255, 0.35);
        }

        .pf-stamp-cell--filled .pf-stamp-daisy__svg circle:last-child {
          fill: #c62828;
        }

        .pf-stamp-footer {
          flex: 1 1 100%;
          display: flex;
          flex-direction: column;
          gap: 0;
          background: #fff;
          padding: 0;
          border-top: 2px solid rgba(0, 0, 0, 0.06);
        }

        .pf-stamp-footer__promo {
          text-align: center;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.05rem;
          font-weight: 700;
          font-style: italic;
          color: #5a7c16;
          padding: 0.45rem 0.5rem 0.35rem;
          letter-spacing: 0.04em;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }

        .pf-stamp-footer__row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 0.65rem;
        }

        .pf-stamp-footer__label {
          font-size: 0.72rem;
          font-weight: 700;
          color: #333;
          white-space: nowrap;
        }

        .pf-stamp-footer__input {
          flex: 1;
          min-width: 0;
          border: none;
          border-bottom: 2px solid #ff6b1a;
          font-family: inherit;
          font-size: 0.85rem;
          font-weight: 600;
          color: #1a1a1a;
          padding: 0.2rem 0;
          background: transparent;
        }

        .pf-stamp-footer__input::placeholder {
          color: #999;
          font-weight: 500;
        }

        .pf-stamp-footer__input:focus {
          outline: none;
          border-bottom-color: #7cb518;
        }

        @media (min-width: 400px) {
          .pf-stamp-daisy {
            max-width: 1.85rem;
            max-height: 1.85rem;
          }
        }
      `}</style>

      <header className="pf-header">
        <a href="#top" className="pf-brand">
          PROFORMA <span>2020</span>
        </a>
        <nav className="pf-nav" aria-label="Principale">
          <a href="#palestra">Palestra</a>
          <a href="#novita">Novità</a>
          <a href="#offerte">Offerte</a>
          <a href="#corsi">Corsi</a>
          <a href="#tessera">Tessera</a>
          <a href="#vantaggi">Perché noi</a>
          <a href="#team">Team</a>
          <a href="#contatti">Contatti</a>
        </nav>
        <a className="pf-btn pf-btn--wa" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
      </header>

      <main id="top">
        <section className="pf-hero" aria-labelledby="hero-title">
          <div className="pf-hero__bg" role="presentation" />
          <div className="pf-hero__overlay" />
          <div className="pf-hero__mesh" aria-hidden />
          <div className="pf-hero__accent" aria-hidden />
          <div className="pf-hero__inner">
            <p className="pf-tagline">Longevity and Fitness Hub</p>
            <h1 id="hero-title">La palestra dove il metodo incontra i risultati</h1>
            <p>
              Spazi moderni, tre sedi tra Pavia e Lodi — Corteolona, Sant&apos;Angelo Lodigiano e
              Gerenzago — e un&apos;offerta completa: corsi, sala pesi, personal training e percorsi
              pensati per durare nel tempo.
            </p>
            <div className="pf-hero__stats">
              <span className="pf-hero__stat">3 sedi</span>
              <span className="pf-hero__stat">Corsi inclusi</span>
              <span className="pf-hero__stat">Longevity focus</span>
            </div>
            <div className="pf-hero__actions">
              <a
                className="pf-btn pf-btn--wa"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Prenota su WhatsApp
              </a>
              <a className="pf-btn pf-btn--glow" href="#novita">
                Vedi la palestra
              </a>
            </div>
          </div>
        </section>

        <section id="palestra" className="pf-section pf-section--gym" aria-labelledby="palestra-title">
          <div className="pf-wrap">
            <p className="pf-eyebrow">L&apos;esperienza</p>
            <h2 id="palestra-title">Un hub fitness, non solo una sala</h2>
            <p className="pf-lead">
              ProForma 2020 è pensata come un unico ecosistema: ambienti curati, attrezzatura
              professionale e programmazione chiara — dal primo ingresso al percorso nel tempo.
            </p>
            <div className="pf-gym-pillars">
              <div className="pf-gym-pillar">
                <div className="pf-gym-pillar__num">01</div>
                <h3>Struttura &amp; zona corsi</h3>
                <p>
                  Sale dedicate, attrezzi e spazi per allenamento libero e corsi — Pilates, boxe e
                  molto altro con accesso incluso nel tuo piano.
                </p>
              </div>
              <div className="pf-gym-pillar">
                <div className="pf-gym-pillar__num">02</div>
                <h3>Metodo &amp; longevità</h3>
                <p>
                  Obiettivi misurabili, progressioni e attenzione al benessere: l&apos;approccio
                  &quot;Longevity and Fitness Hub&quot; come filo conduttore.
                </p>
              </div>
              <div className="pf-gym-pillar">
                <div className="pf-gym-pillar__num">03</div>
                <h3>Tre sedi, stessa qualità</h3>
                <p>
                  Corteolona, Sant&apos;Angelo Lodigiano e Gerenzago: scegli la sede più comoda e
                  trova accoglienza e standard condivisi.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="novita" className="pf-section pf-section--novita" aria-labelledby="novita-title">
          <div className="pf-wrap pf-wrap--wide">
            <p className="pf-eyebrow">Dentro ProForma</p>
            <h2 id="novita-title">Novità e spazi dalla nostra community</h2>
            <p className="pf-lead" style={{ maxWidth: '40rem' }}>
              Immagini reali dai nostri canali: sala, corsi, promozioni attive e iniziative come la
              Gara di Primavera — così vedi com&apos;è allenarsi da noi.
            </p>
            <div className="pf-bento">
              {NOVITA_BLOCKS.map((b) => (
                <article
                  key={b.id}
                  className={`pf-bento__cell${b.large ? ' pf-bento__cell--lg' : ''}`}
                >
                  <div
                    className="pf-bento__visual"
                    style={{ backgroundImage: `url(${b.img})` }}
                    role="presentation"
                  />
                  <div className="pf-bento__glass">
                    <span className="pf-bento__badge">ProForma 2020</span>
                    <h3>{b.title}</h3>
                    <p>{b.caption}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="offerte" className="pf-section pf-section--offers" aria-labelledby="offerte-title">
          <div className="pf-wrap">
            <h2 id="offerte-title">Abbonamenti &amp; offerte</h2>
            <p className="pf-lead">
              Promozioni pensate per chi vuole iniziare o cambiare centro senza rinunciare al valore
              del proprio abbonamento.
            </p>
            <div className="pf-offers-grid">
              <div className="pf-offers-panel">
                <p className="pf-offers-panel__kicker">Valore del tuo abbonamento</p>
                <h3 className="pf-offers-panel__title">Rottamazione &amp; mesi omaggio</h3>
                <p className="pf-offers-panel__text">
                  Se avevi un abbonamento presso un altro centro, possiamo trasformarlo in mesi in
                  omaggio per continuare il percorso da noi — condizioni e validità in reception.
                </p>
                <ul className="pf-offers-panel__list">
                  <li>Abbonamento valutato in sede</li>
                  <li>Accesso a tutti i corsi incluso nel piano</li>
                  <li>Supporto costante del team e dei trainer</li>
                  <li>Promo famiglia e piani lunghi con vantaggi dedicati</li>
                </ul>
              </div>
              <div className="pf-cards">
                <article className="pf-card pf-card--highlight">
                  <span className="pf-badge">In evidenza</span>
                  <h3>Rottamazione abbonamento</h3>
                  <p>
                    Avevi un abbonamento presso un altro centro? Lo trasformiamo in{' '}
                    <strong style={{ color: 'var(--pf-white)' }}>mesi omaggio</strong> per allenarti
                    da noi: abbonamento valutato, accesso a tutti i corsi e supporto del team.
                  </p>
                </article>
                <article className="pf-card">
                  <span className="pf-badge">Promo</span>
                  <h3>Mesi gratis &amp; piani</h3>
                  <p>
                    Iscriviti e sfrutta promozioni con mesi in regalo su abbonamenti annuali e
                    famiglia. Chiedi in sede le condizioni attive e lo sconto su piani biennali e
                    triennali.
                  </p>
                </article>
                <article className="pf-card">
                  <span className="pf-badge">Prova</span>
                  <h3>Prova gratuita</h3>
                  <p>
                    Richiedi una prova gratuita per corsi e lezioni: contattaci su WhatsApp o passa in
                    reception in una delle sedi.
                  </p>
                </article>
                <article className="pf-card">
                  <span className="pf-badge">Community</span>
                  <h3>Gara di Primavera — punti premio</h3>
                  <p>
                    Accumula punti con la tessera promozionale e scala i premi: gadget ProForma, mesi
                    in regalo, personal training e pacchetti metodo. Più punti raccogli, più il
                    premio cresce.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section id="corsi" className="pf-section pf-section--courses" aria-labelledby="corsi-title">
          <div className="pf-wrap">
            <p className="pf-eyebrow">Programmazione</p>
            <h2 id="corsi-title">Corsi &amp; training</h2>
            <p className="pf-lead">
              Dalla sala alle lezioni: un&apos;offerta ampia con accesso incluso — immagini dai nostri
              spazi e dalle attività ProForma.
            </p>
            <div className="pf-courses">
              <article className="pf-course pf-course--pilates">
                <div className="pf-course__bg" role="presentation" />
                <div className="pf-course__overlay" />
                <div className="pf-course__body">
                  <h3>Pilates</h3>
                  <p>
                    Equilibrio, postura e benessere: corsi collettivi e possibilità di lezione
                    individuale su richiesta.
                  </p>
                </div>
              </article>
              <article className="pf-course pf-course--pt">
                <div className="pf-course__bg" role="presentation" />
                <div className="pf-course__overlay" />
                <div className="pf-course__body">
                  <h3>Personal training</h3>
                  <p>
                    Piano su misura con i nostri personal trainer: tecnica, progressioni e obiettivi
                    chiari nel tempo.
                  </p>
                </div>
              </article>
              <article className="pf-course pf-course--boxe">
                <div className="pf-course__bg" role="presentation" />
                <div className="pf-course__overlay" />
                <div className="pf-course__body">
                  <h3>Boxe</h3>
                  <p>
                    Intensità, coordinazione e metodo in un percorso dinamico — chiedi in sede
                    calendario e livelli.
                  </p>
                </div>
              </article>
              <article className="pf-course pf-course--tutti">
                <div className="pf-course__bg" role="presentation" />
                <div className="pf-course__overlay" />
                <div className="pf-course__body">
                  <h3>Tutti i corsi</h3>
                  <p>
                    Con l&apos;abbonamento accedi all&apos;intera programmazione: varietà, motivazione e
                    continuità per il tuo percorso Longevity &amp; Fitness.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="tessera" className="pf-section pf-section--stamp" aria-labelledby="tessera-title">
          <div className="pf-wrap">
            <p className="pf-eyebrow" style={{ textAlign: 'center' }}>
              Fedeltà
            </p>
            <h2 id="tessera-title" style={{ textAlign: 'center' }}>
              Il tuo bigliettino digitale
            </h2>
            <p
              className="pf-lead"
              style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto', maxWidth: '28rem' }}
            >
              La tessera &quot;Gara di Primavera&quot; come quella in palestra: griglia di margherite,
              barra verde PUNTI e traguardi premio. Ogni ingresso vale un punto.
            </p>
            <DigitalLoyaltyCard />
          </div>
        </section>

        <section id="vantaggi" className="pf-section pf-section--perks" aria-labelledby="vantaggi-title">
          <div className="pf-wrap">
            <h2 id="vantaggi-title">Perché sceglierci</h2>
            <p className="pf-lead">
              Un hub pensato per chi cerca professionalità, ambiente curato e un metodo sostenibile
              nel tempo.
            </p>
            <div className="pf-perks">
              <div className="pf-perk">
                <div className="pf-perk__icon" aria-hidden>
                  🤝
                </div>
                <h3>Supporto del team</h3>
                <p>
                  Accoglienza in reception, trainer disponibili e un percorso che non ti lascia solo
                  nei momenti chiave.
                </p>
              </div>
              <div className="pf-perk">
                <div className="pf-perk__icon" aria-hidden>
                  🏋️
                </div>
                <h3>Struttura moderna</h3>
                <p>
                  Spazi luminosi, attrezzatura professionale e un&apos;atmosfera pulita per allenarti
                  con concentrazione e comfort.
                </p>
              </div>
              <div className="pf-perk">
                <div className="pf-perk__icon" aria-hidden>
                  📋
                </div>
                <h3>Percorsi personalizzati</h3>
                <p>
                  Obiettivi, tempi e livello di partenza diversi per ognuno: costruiamo il piano
                  giusto per te.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="team" className="pf-section pf-section--staff" aria-labelledby="team-title">
          <div className="pf-wrap">
            <p className="pf-eyebrow">People</p>
            <h2 id="team-title">Il team al servizio della tua esperienza</h2>
            <p className="pf-lead">
              Trainer e professionisti che completano la struttura: qui per guidarti in sala, nei
              corsi e nelle valutazioni — sempre al fianco del percorso palestra.
            </p>
            <div className="pf-staff-grid">
              {STAFF.map((member) => (
                <StaffCard key={member.name} member={member} />
              ))}
            </div>
          </div>
        </section>

        <section id="contatti" className="pf-section pf-section--contact" aria-labelledby="contatti-title">
          <div className="pf-wrap">
            <h2 id="contatti-title">Contatti</h2>
            <p className="pf-lead" style={{ color: 'rgba(250,250,250,0.75)' }}>
              Siamo a <strong style={{ color: 'rgba(255,255,255,0.95)', fontWeight: 600 }}>Corteolona</strong>,{' '}
              <strong style={{ color: 'rgba(255,255,255,0.95)', fontWeight: 600 }}>Sant&apos;Angelo Lodigiano</strong> e{' '}
              <strong style={{ color: 'rgba(255,255,255,0.95)', fontWeight: 600 }}>Gerenzago</strong>: scegli la sede
              più comoda e passa in reception o scrivici online.
            </p>
            <div className="pf-contact-locations">
              {SEDI.map((s) => (
                <div className="pf-location-card" key={s.nome}>
                  <h3>{s.nome}</h3>
                  <p>{s.via}</p>
                  <a href={s.href}>{s.tel}</a>
                </div>
              ))}
            </div>
            <div className="pf-contact-grid">
              <div className="pf-contact-item">
                <div>
                  <strong>Cellulare</strong>
                  <a href="tel:+393773856938">{PHONE_DISPLAY}</a>
                  <span
                    style={{
                      display: 'block',
                      marginTop: '0.35rem',
                      fontSize: '0.82rem',
                      color: 'var(--pf-muted)',
                      fontWeight: 400,
                    }}
                  >
                    Numero unico per informazioni rapide
                  </span>
                </div>
              </div>
              <div className="pf-contact-item">
                <div>
                  <strong>WhatsApp</strong>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                    Apri chat WhatsApp
                  </a>
                </div>
              </div>
              <div className="pf-contact-item">
                <div>
                  <strong>Email</strong>
                  <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </div>
              </div>
              <div className="pf-contact-item">
                <div>
                  <strong>Sito web</strong>
                  <a href={WEBSITE} target="_blank" rel="noopener noreferrer">
                    proforma2020.it
                  </a>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '2rem' }}>
              <a className="pf-btn pf-btn--wa" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                Scrivici su WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="pf-footer">
        <p className="pf-footer__name">ProForma 2020</p>
        <p>Longevity and Fitness Hub</p>
        <p>
          <a href={`tel:+393773856938`}>{PHONE_DISPLAY}</a>
          {' · '}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          {' · '}
          <a href={WEBSITE} target="_blank" rel="noopener noreferrer">
            proforma2020.it
          </a>
        </p>
        <div className="pf-footer-social">
          <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram ProForma 2020">
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M12 7.2A4.8 4.8 0 1 0 16.8 12 4.81 4.81 0 0 0 12 7.2Zm0 7.91A3.11 3.11 0 1 1 15.11 12 3.11 3.11 0 0 1 12 15.11ZM16.55 5.4a1.12 1.12 0 1 1-1.12 1.12 1.12 1.12 0 0 1 1.12-1.12Zm3.05 1.14A6.62 6.62 0 0 0 17.91 4 15.51 15.51 0 0 0 12 3.7 15.6 15.6 0 0 0 6.09 4 6.52 6.52 0 0 0 3.4 6.54 15.36 15.36 0 0 0 3.1 12a15.56 15.56 0 0 0 .31 5.46A6.58 6.58 0 0 0 6.09 20a15.7 15.7 0 0 0 5.91.3 15.7 15.7 0 0 0 5.91-.3 6.58 6.58 0 0 0 2.69-2.54 15.56 15.56 0 0 0 .31-5.46 15.36 15.36 0 0 0-.31-5.46ZM17.86 18a4.07 4.07 0 0 1-2.29 1.44A14.51 14.51 0 0 1 12 19.7a14.51 14.51 0 0 1-3.57-.26A4.07 4.07 0 0 1 6.14 18a12.54 12.54 0 0 1-.28-6 12.54 12.54 0 0 1 .28-6 4.07 4.07 0 0 1 2.29-1.43A14.51 14.51 0 0 1 12 4.3a14.51 14.51 0 0 1 3.57.27A4.07 4.07 0 0 1 17.86 6a12.54 12.54 0 0 1 .28 6 12.54 12.54 0 0 1-.28 6Z" />
            </svg>
          </a>
          <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook ProForma 2020">
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M13.5 22v-9.1h3.1l.5-3.6h-3.6V7.5c0-1 .3-1.7 1.8-1.7h1.9V2.5c-.3 0-1.5-.1-2.9-.1-2.9 0-4.9 1.8-4.9 5v2.8H7.5v3.6h3.2V22h4.8z" />
            </svg>
          </a>
          <a href={SOCIAL.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok ProForma 2020">
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M16.6 5.2c-.9 0-1.7.35-2.3.92v8.56a5.73 5.73 0 1 1-5.73-5.73c.11 0 .21 0 .32.02v3.27a2.55 2.55 0 1 0 2.41 2.53V2h3.3v3.2z" />
            </svg>
          </a>
        </div>
        <p style={{ marginTop: '1rem', fontSize: '0.8rem' }}>
          © {new Date().getFullYear()} ProForma 2020. Tutti i diritti riservati.
        </p>
      </footer>
    </div>
  )
}

export default App
