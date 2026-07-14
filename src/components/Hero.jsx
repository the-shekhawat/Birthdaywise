import { useRef, useState, useCallback } from 'react'
import { site } from '../config'

export default function Hero() {
  const dateLabel = new Date(site.birthdayDate).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const frameRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e) => {
    const el = frameRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: py * -6, y: px * 8 }) // gentle, not gimmicky
  }, [])

  const handleMouseLeave = useCallback(() => setTilt({ x: 0, y: 0 }), [])

  const name = site.personName || ''

  return (
    <section className="relative flex min-h-[95vh] items-center justify-center overflow-hidden px-6 py-28 sm:py-36 bg-gradient-to-b from-night-950 via-[#0d0914] to-night-950">
      {/* Ambient lighting */}
      <div className="absolute left-1/4 top-1/3 -z-10 h-[500px] w-[500px] rounded-full bg-rose-500/10 mix-blend-screen blur-[140px] animate-pulse" />
      <div className="absolute right-1/4 bottom-1/3 -z-10 h-[450px] w-[450px] rounded-full bg-gold-400/10 mix-blend-screen blur-[130px] animate-pulse [animation-delay:2.5s]" />

      {/* Faint starfield for depth */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-50">
        {[...Array(24)].map((_, i) => {
          const top = (i * 37) % 100
          const left = (i * 53) % 100
          const size = i % 3 === 0 ? 2 : 1
          const delay = (i % 6) * 0.7
          return (
            <span
              key={`star-${i}`}
              className="absolute rounded-full bg-cream-100/30"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                width: size,
                height: size,
                animation: `twinkle ${4 + (i % 4)}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
              }}
            />
          )
        })}
      </div>

      {/* Floating petals */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-70">
        {[
          { top: '18%', left: '22%', rot: -15, hue: 'rose', size: 14, dur: 9, delay: 0 },
          { top: '72%', left: '30%', rot: 25, hue: 'gold', size: 10, dur: 11, delay: 1.4 },
          { top: '30%', left: '85%', rot: -30, hue: 'rose', size: 12, dur: 8, delay: 2.6 },
          { top: '65%', left: '88%', rot: 10, hue: 'gold', size: 8, dur: 10, delay: 0.8 },
          { top: '85%', left: '55%', rot: -20, hue: 'rose', size: 11, dur: 12, delay: 3.2 },
        ].map((p, i) => (
          <span
            key={`petal-${i}`}
            className="absolute"
            style={{
              top: p.top,
              left: p.left,
              animation: `petalDrift ${p.dur}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          >
            <svg
              width={p.size * 2}
              height={p.size * 2}
              viewBox="0 0 24 24"
              style={{ transform: `rotate(${p.rot}deg)`, opacity: 0.5 }}
            >
              <path
                d="M12 2C15 6 20 8 20 13C20 18 16 22 12 22C8 22 4 18 4 13C4 8 9 6 12 2Z"
                fill={p.hue === 'rose' ? 'rgba(251,113,133,0.5)' : 'rgba(250,204,120,0.5)'}
              />
            </svg>
          </span>
        ))}
      </div>

      {/* Ornamental corner flourishes — invitation-card framing */}
      {[
        'top-6 left-6',
        'top-6 right-6 -scale-x-100',
        'bottom-6 left-6 -scale-y-100',
        'bottom-6 right-6 -scale-x-100 -scale-y-100',
      ].map((pos, i) => (
        <svg
          key={`corner-${i}`}
          className={`pointer-events-none absolute z-10 hidden opacity-30 sm:block ${pos}`}
          width="56"
          height="56"
          viewBox="0 0 56 56"
          fill="none"
        >
          <path
            d="M2 28V6C2 3.79086 3.79086 2 6 2H28"
            stroke="url(#cornerGrad)"
            strokeWidth="1"
          />
          <circle cx="2" cy="2" r="2" fill="#facc78" fillOpacity="0.6" />
          <defs>
            <linearGradient id="cornerGrad" x1="0" y1="0" x2="56" y2="56">
              <stop offset="0%" stopColor="#facc78" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#facc78" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      ))}

      {/* Main content */}
      <div className="relative z-10 mx-auto flex max-w-5xl transform-gpu animate-[fadeInUp_1.4s_cubic-bezier(0.16,1,0.3,1)] flex-col items-center gap-12 text-center lg:flex-row lg:gap-20 lg:text-left">
        {/* Portrait */}
        <div
          ref={frameRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="group relative flex-shrink-0"
          style={{ perspective: '1000px' }}
        >
          <div
            className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-rose-500/20 via-gold-400/20 to-transparent opacity-80 blur-2xl transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
          />

          <div
            className="relative h-80 w-64 overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.02] shadow-[0_30px_70px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.15)] backdrop-blur-md transition-transform duration-300 ease-out sm:h-96 sm:w-72"
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.01)`,
              transformStyle: 'preserve-3d',
            }}
          >
            {site.heroPhotoUrl ? (
              <img
                src={site.heroPhotoUrl}
                alt={site.personName}
                className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-night-900/40">
                <span className="select-none text-7xl drop-shadow-md">{site.heroPhotoEmoji || '👑'}</span>
                <span className="font-mono text-xs uppercase tracking-widest text-cream-100/30">Portrait Node</span>
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
            {/* soft moving sheen, like light catching glass */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.12) 45%, transparent 60%)',
                backgroundSize: '200% 200%',
                animation: 'sheen 2.2s ease-in-out infinite',
              }}
            />
          </div>

          <div className="absolute -bottom-4 -left-4 z-20 flex h-14 w-14 items-center justify-center rounded-full border border-rose-400/20 bg-gradient-to-br from-rose-950/95 to-night-950 p-2 text-2xl shadow-xl transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
            🌹
          </div>
          <div className="absolute -top-3 -right-3 z-20 flex h-9 w-9 animate-pulse items-center justify-center rounded-full border border-gold-400/20 bg-gradient-to-br from-gold-950/90 to-night-950 text-sm shadow-md">
            ✨
          </div>
        </div>

        {/* Typography */}
        <div className="flex max-w-xl flex-1 flex-col justify-center">
          <div className="inline-flex items-center justify-center gap-3 lg:justify-start">
            <span className="hidden h-px w-8 bg-gradient-to-r from-transparent to-gold-400/60 lg:block" />
            <p className="bg-gradient-to-r from-gold-300 via-rose-300 to-gold-200 bg-clip-text font-hand text-2xl tracking-wide text-transparent">
              turning {site.age} today
            </p>
            <span className="hidden h-px w-8 bg-gradient-to-l from-transparent to-gold-400/60 lg:hidden" />
          </div>

          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            {[...name].map((char, i) => (
              <span
                key={i}
                className="inline-block animate-[letterIn_0.7s_cubic-bezier(0.16,1,0.3,1)_both] bg-gradient-to-b from-white via-cream-100 to-cream-200/80 bg-clip-text text-transparent drop-shadow-sm"
                style={{ animationDelay: `${0.4 + i * 0.045}s` }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>

          <p className="mt-4 font-mono text-xs uppercase tracking-[0.35em] text-cream-100/40">
            {dateLabel}
          </p>

          <div className="group/quote relative mt-8">
            <span className="pointer-events-none absolute -left-4 -top-3 select-none font-serif text-5xl text-gold-400/10 transition-colors duration-300 group-hover/quote:text-rose-400/20">
              “
            </span>
            <p className="font-body text-base italic leading-relaxed tracking-wide text-cream-100/70 antialiased sm:text-lg">
              {site.tagline}
            </p>
            <span className="pointer-events-none absolute -bottom-6 right-0 select-none font-serif text-5xl text-gold-400/10 transition-colors duration-300 group-hover/quote:text-rose-400/20">
              ”
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes letterIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes petalDrift {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.35; }
          50% { transform: translateY(-22px) rotate(8deg); opacity: 0.6; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.6; }
        }
        @keyframes sheen {
          0% { background-position: -50% -50%; }
          100% { background-position: 150% 150%; }
        }
      `}</style>
    </section>
  )
}