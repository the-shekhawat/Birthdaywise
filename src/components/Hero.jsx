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
    // Only apply tilt if the device supports hover (prevents touch screen stutter)
    if (window.matchMedia('(hover: hover)').matches) {
      const el = frameRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      setTilt({ x: py * -8, y: px * 10 })
    }
  }, [])

  const handleMouseLeave = useCallback(() => setTilt({ x: 0, y: 0 }), [])

  const name = site.personName || ''
  // Split name into words first to prevent awkward text wrapping on small screens
  const words = name.split(' ')

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-16 sm:px-8 sm:py-24 md:py-32 bg-gradient-to-b from-zinc-950 via-[#0d0914] to-zinc-950">
      
      {/* Ambient Lighting - Adaptive blur & sizing */}
      <div className="absolute left-1/10 top-1/4 -z-10 h-[250px] w-[250px] rounded-full bg-rose-500/10 mix-blend-screen blur-[60px] sm:h-[400px] sm:w-[400px] sm:blur-[100px] lg:h-[600px] lg:w-[600px] lg:blur-[150px] animate-pulse" />
      <div className="absolute right-1/10 bottom-1/4 -z-10 h-[220px] w-[220px] rounded-full bg-amber-400/10 mix-blend-screen blur-[60px] sm:h-[350px] sm:w-[350px] sm:blur-[90px] lg:h-[550px] lg:w-[550px] lg:blur-[140px] animate-pulse [animation-delay:2.5s]" />

      {/* Centered/Offset Dancing Bear Background - Adapts safely to screen size */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-20 md:opacity-30 lg:opacity-40 translate-y-16 md:translate-y-0 md:translate-x-[20vw]">
        <img
          src="/images/bear-dance.gif"
          alt=""
          className="h-[30vh] max-h-[280px] w-auto object-contain sm:h-[45vh] sm:max-h-[420px] lg:h-[52vh] lg:max-h-[520px]"
        />
      </div>

      {/* Faint Starfield */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-30 md:opacity-50">
        {[...Array(24)].map((_, i) => {
          const top = (i * 31) % 100
          const left = (i * 47) % 100
          const size = i % 3 === 0 ? 2 : 1
          const delay = (i % 6) * 0.8
          return (
            <span
              key={`star-${i}`}
              className="absolute rounded-full bg-white"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                width: size,
                height: size,
                animation: `twinkle ${3 + (i % 4)}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
              }}
            />
          )
        })}
      </div>

      {/* Floating Petals - Hidden on small mobile to reduce visual noise */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-50 sm:opacity-70">
        {[
          { top: '15%', left: '10%', rot: -15, hue: 'rose', size: 12, dur: 9, delay: 0 },
          { top: '80%', left: '15%', rot: 25, hue: 'gold', size: 10, dur: 11, delay: 1.4 },
          { top: '20%', left: '85%', rot: -30, hue: 'rose', size: 12, dur: 8, delay: 2.6 },
          { top: '70%', left: '88%', rot: 10, hue: 'gold', size: 8, dur: 10, delay: 0.8 },
        ].map((p, i) => (
          <span
            key={`petal-${i}`}
            className="absolute hidden md:block"
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
              style={{ transform: `rotate(${p.rot}deg)`, opacity: 0.4 }}
            >
              <path
                d="M12 2C15 6 20 8 20 13C20 18 16 22 12 22C8 22 4 18 4 13C4 8 9 6 12 2Z"
                fill={p.hue === 'rose' ? 'rgba(244,63,94,0.6)' : 'rgba(245,158,11,0.6)'}
              />
            </svg>
          </span>
        ))}
      </div>

      {/* Corner Flourishes - Responsive scale */}
      {[
        'top-4 left-4 sm:top-6 sm:left-6',
        'top-4 right-4 sm:top-6 sm:right-6 -scale-x-100',
        'bottom-4 left-4 sm:bottom-6 sm:left-6 -scale-y-100',
        'bottom-4 right-4 sm:bottom-6 sm:right-6 -scale-x-100 -scale-y-100',
      ].map((pos, i) => (
        <svg
          key={`corner-${i}`}
          className={`pointer-events-none absolute z-10 opacity-20 sm:opacity-30 ${pos}`}
          width="36"
          height="36"
          viewBox="0 0 56 56"
          fill="none"
        >
          <path
            d="M2 28V6C2 3.79086 3.79086 2 6 2H28"
            stroke="url(#cornerGrad)"
            strokeWidth="1.5"
          />
          <circle cx="2" cy="2" r="2" fill="#fbbf24" fillOpacity="0.7" />
          <defs>
            <linearGradient id="cornerGrad" x1="0" y1="0" x2="56" y2="56">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      ))}

      {/* Main Container */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl transform-gpu animate-[fadeInUp_1.2s_cubic-bezier(0.16,1,0.3,1)] flex-col items-center gap-10 text-center md:flex-row md:gap-12 lg:gap-16 lg:text-left">
        
        {/* Interactive Portrait Wrapper */}
        <div
          ref={frameRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="group relative flex-shrink-0 touch-none"
          style={{ perspective: '1200px' }}
        >
          {/* Ambient Outer Glow */}
          <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-tr from-rose-500/20 via-amber-400/20 to-transparent opacity-80 blur-xl transition-all duration-700 group-hover:scale-105" />

          {/* Flexible Portrait Card (scales dynamically with screen width) */}
          <div
            className="relative h-64 w-48 overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.02] shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.15)] backdrop-blur-md transition-all duration-300 ease-out xs:h-72 xs:w-56 sm:h-88 sm:w-64 md:h-96 md:w-72"
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.01)`,
              transformStyle: 'preserve-3d',
            }}
          >
            {site.heroPhotoUrl ? (
              <img
                src={site.heroPhotoUrl}
                alt={site.personName}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-zinc-950/40">
                <span className="select-none text-5xl drop-shadow-lg sm:text-7xl">{site.heroPhotoEmoji || '👑'}</span>
                <span className="font-mono text-[9px] tracking-widest text-white/30 uppercase">Portrait Node</span>
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            
            {/* Soft Interactive Lighting Sheen */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.08) 45%, transparent 60%)',
                backgroundSize: '200% 200%',
                animation: 'sheen 2.5s ease-in-out infinite',
              }}
            />
          </div>

          {/* Adaptive Floating Glass Icons */}
          <div className="absolute -bottom-2 -left-2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-rose-500/30 bg-rose-950/80 text-lg shadow-lg backdrop-blur-sm transition-all duration-500 group-hover:-translate-x-1 group-hover:rotate-12 group-hover:scale-110 xs:h-12 xs:w-12 sm:h-14 sm:w-14 sm:text-2xl">
            🌹
          </div>
          <div className="absolute -top-2 -right-2 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-amber-400/30 bg-amber-950/80 text-xs shadow-md backdrop-blur-sm transition-all duration-500 group-hover:translate-x-1 group-hover:scale-110 xs:h-9 xs:w-9 sm:text-sm">
            ✨
          </div>
        </div>

        {/* Responsive Typography Block */}
        <div className="flex max-w-xl flex-1 flex-col justify-center px-2 sm:px-0">
          
          {/* Subtle Tagline Accent */}
          <div className="inline-flex items-center justify-center gap-3 md:justify-start">
            <span className="hidden h-px w-8 bg-gradient-to-r from-transparent to-amber-400/60 md:block" />
            <p className="bg-gradient-to-r from-amber-300 via-rose-300 to-amber-200 bg-clip-text font-serif text-base italic tracking-wide text-transparent sm:text-lg md:text-xl">
              turning {site.age} today
            </p>
            <span className="h-px w-6 bg-gradient-to-l from-transparent to-amber-400/60 md:hidden" />
          </div>

          {/* Heading - Responsive staggered letters with word-level wrapping safeguards */}
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]">
            {words.map((word, wordIdx) => (
              <span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.25em]">
                {[...word].map((char, charIdx) => {
                  // Calculate absolute letter index for clean stagger delay mapping
                  const absoluteIdx = name.indexOf(word) + charIdx
                  return (
                    <span
                      key={charIdx}
                      className="inline-block animate-[letterIn_0.6s_cubic-bezier(0.16,1,0.3,1)_both] bg-gradient-to-b from-white via-zinc-100 to-zinc-300/80 bg-clip-text text-transparent drop-shadow-md"
                      style={{ animationDelay: `${0.3 + absoluteIdx * 0.03}s` }}
                    >
                      {char}
                    </span>
                  )
                })}
              </span>
            ))}
          </h1>

          {/* Date Indicator */}
          <p className="mt-3 font-mono text-[9px] sm:text-xs uppercase tracking-[0.35em] text-zinc-400/80">
            {dateLabel}
          </p>

          {/* Tagline Box */}
          <div className="group/quote relative mt-6 px-4 sm:px-6">
            <span className="pointer-events-none absolute -left-1 -top-3 select-none font-serif text-4xl text-rose-500/10 transition-colors duration-300 group-hover/quote:text-rose-500/20 sm:text-5xl">
              “
            </span>
            <p className="font-sans text-xs font-light leading-relaxed tracking-wide text-zinc-300 antialiased sm:text-sm md:text-base">
              {site.tagline}
            </p>
            <span className="pointer-events-none absolute -bottom-6 right-2 select-none font-serif text-4xl text-amber-500/10 transition-colors duration-300 group-hover/quote:text-amber-500/20 sm:text-5xl">
              ”
            </span>
          </div>

          <a
            href="#countdown"
            className="group/cta mt-10 inline-flex w-fit items-center gap-3 self-center rounded-full border border-amber-300/40 bg-amber-400/10 px-5 py-2.5 text-sm font-semibold tracking-wide text-amber-200 shadow-[0_0_30px_rgba(251,191,36,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:bg-amber-400/20 hover:shadow-[0_0_36px_rgba(251,191,36,0.25)] lg:self-start"
          >
            Start the celebration
            <span className="text-lg transition-transform duration-300 group-hover/cta:translate-y-1">↓</span>
          </a>
        </div>
      </div>

      {/* Embedded Animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes letterIn {
          from { opacity: 0; transform: translateY(8px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes petalDrift {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-12px) rotate(6deg); opacity: 0.5; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(0.9); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        @keyframes sheen {
          0% { background-position: -50% -50%; }
          100% { background-position: 150% 150%; }
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  )
}
