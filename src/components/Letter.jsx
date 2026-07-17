import { useEffect, useRef, useState } from 'react'
import { site } from '../config'
import SectionHeading from './SectionHeading'

function LoveRoseAccent({ className = '', strokeColor = 'currentColor' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

function PetalShape({ className = '', style = {} }) {
  return (
    <span
      className={className}
      style={{
        ...style,
        borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
        display: 'block',
      }}
    />
  )
}

const ROMANTIC_VINTAGE_THEMES = {
  blush: {
    name: 'Blush Valentine',
    ink: '#361116',
    accent: '#b83b5e',
    gradientStart: '#d64161',
    gradientEnd: '#ff7b90',
    bgTint: 'from-rose-50/20 via-red-50/10 to-transparent',
    leafFill: '#5b7053',
  },
  amethyst: {
    name: 'Devoted Violet',
    ink: '#220f29',
    accent: '#6c4380',
    gradientStart: '#8c5ca3',
    gradientEnd: '#cba6db',
    bgTint: 'from-purple-50/20 via-fuchsia-50/10 to-transparent',
    leafFill: '#4c5c70',
  },
  honey: {
    name: 'Warm Sweetheart',
    ink: '#301808',
    accent: '#965a1f',
    gradientStart: '#bd7b3c',
    gradientEnd: '#f2c594',
    bgTint: 'from-amber-50/20 via-orange-50/10 to-transparent',
    leafFill: '#615949',
  }
}

export default function Letter() {
  const ref = useRef(null)
  const articleContainerRef = useRef(null)
  
  const [scrolledIntoView, setScrolledIntoView] = useState(false)
  const [isOpening, setIsOpening] = useState(false)
  const [isOpened, setIsOpened] = useState(false)
  const [showPetals, setShowPetals] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState('blush')
  const [tiltStyle, setTiltStyle] = useState({})
  
  const [bloomProgress, setBloomProgress] = useState(0)
  const [interactiveOffset, setInteractiveOffset] = useState({ x: 0, y: 0 })

  const wordsArray = site.letter ? site.letter.split(/(\s+)/) : []

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = (e) => setReducedMotion(e.matches)
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setScrolledIntoView(true)
        obs.disconnect()
      }
    }, { threshold: 0.15 })

    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const xc = rect.width / 2
    const yc = rect.height / 2

    if (!isOpened) {
      if (isOpening || reducedMotion) return
      const rotateX = (yc - y) / 12
      const rotateY = (x - xc) / 12
      setTiltStyle({ transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.03)` })
    } else {
      setInteractiveOffset({
        x: ((x - xc) / xc) * 5,
        y: ((y - yc) / yc) * 5
      })
    }
  }

  const handleMouseLeave = () => {
    setTiltStyle({})
    setInteractiveOffset({ x: 0, y: 0 })
  }

  useEffect(() => {
    if (!isOpened) return
    if (reducedMotion) {
      setBloomProgress(1)
      return
    }
    let startTime
    const duration = 1400
    const animate = (now) => {
      if (!startTime) startTime = now
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      setBloomProgress(1 - Math.pow(1 - progress, 3))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [isOpened, reducedMotion])

  const handleOpenLetter = () => {
    if (isOpening || isOpened) return
    setIsOpening(true)
    const flapDelay = reducedMotion ? 0 : 650
    setTimeout(() => {
      setShowPetals(true)
      setIsOpened(true)
    }, flapDelay)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleOpenLetter()
    }
  }

  const petals = Array.from({ length: 26 }).map((_, i) => {
    const randomLeft = Math.random() * 100
    const randomDelay = Math.random() * 0.6
    const randomDuration = 4.0 + Math.random() * 2.0
    const width = 8 + Math.random() * 6
    const currentActiveTheme = ROMANTIC_VINTAGE_THEMES[selectedTheme]
    const romanticColors = [currentActiveTheme.gradientStart, currentActiveTheme.gradientEnd, '#fca5a5', '#fff1f2']
    const tone = romanticColors[Math.floor(Math.random() * romanticColors.length)]
    return {
      id: i,
      style: {
        left: `${randomLeft}%`,
        animationDelay: `${randomDelay}s`,
        animationDuration: `${randomDuration}s`,
        width: `${width}px`,
        height: `${width * 1.2}px`,
        background: `linear-gradient(135deg, ${tone}, ${tone}cc)`,
      },
      className: 'absolute top-[-20px] opacity-75 pointer-events-none animate-petal-fall',
    }
  })

  const activeTheme = ROMANTIC_VINTAGE_THEMES[selectedTheme]
  let printableWordCounter = 0

  return (
    <section ref={ref} className={`relative overflow-hidden px-6 py-28 sm:py-36 bg-gradient-to-b transition-colors duration-1000 ${activeTheme.bgTint}`}>
      <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet" />

      <style>{`
        /* Premium Multi-Stage Letter Opening Sequence */
        @keyframes highEndLetterReveal {
          0% { 
            transform: translateY(60px) rotateX(-25deg) scale(0.88); 
            opacity: 0; 
            filter: blur(8px);
            clip-path: inset(35% 35% 35% 35% rounded 24px);
          }
          55% {
            opacity: 1;
            filter: blur(1px);
            clip-path: inset(0% 0% 0% 0% rounded 16px);
          }
          100% { 
            transform: translateY(0) rotateX(0deg) scale(1); 
            opacity: 1; 
            clip-path: inset(0% 0% 0% 0% rounded 16px);
          }
        }

        /* Staggered Content Reveals */
        @keyframes panelSlideInLeft {
          0% { opacity: 0; transform: translateX(-30px) scale(0.95); filter: blur(2px); }
          100% { opacity: 1; transform: translateX(0) scale(1); filter: blur(0); }
        }

        @keyframes panelSlideInRight {
          0% { opacity: 0; transform: translateX(30px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        @keyframes flapOpen {
          0% { transform: rotateX(0deg); }
          100% { transform: rotateX(-176deg); }
        }
        @keyframes sealBurst {
          0% { transform: scale(1); opacity: 1; filter: brightness(1); }
          45% { transform: scale(1.4); opacity: 0.8; filter: brightness(1.25) blur(0.5px); }
          100% { transform: scale(2.4); opacity: 0; filter: brightness(1.5) blur(6px); }
        }
        @keyframes sealPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 10px 30px -4px rgba(0,0,0,0.25), 0 0 0 0px rgba(214,65,97,0.2); }
          50% { transform: scale(1.05); box-shadow: 0 16px 36px -3px rgba(0,0,0,0.35), 0 0 16px 6px rgba(214,65,97,0.3); }
        }
        @keyframes petalFall {
          0%   { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.85; }
          30%  { transform: translate(15px, 25vh) rotate(60deg); }
          60%  { transform: translate(-15px, 55vh) rotate(140deg); }
          80%  { transform: translate(12px, 80vh) rotate(220deg); }
          100% { transform: translate(-4px, 100vh) rotate(300deg); opacity: 0; }
        }
        @keyframes simpleRosePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes simpleStemSway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(1.8deg); }
        }
        @keyframes revealWordPremium {
          0% { opacity: 0; transform: translateY(6px); filter: blur(2px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes signoffReveal {
          0% { opacity: 0; transform: scale(0.85) translateY(10px); }
          100% { opacity: 0.4; transform: scale(1) translateY(0); }
        }

        .label-font-serif { font-family: 'Playfair Display', Georgia, serif; }
        .love-font-script { font-family: 'Great Vibes', cursive; }

        /* Animation classes mapped to timing curves */
        .letter-reveal { 
          animation: highEndLetterReveal 1.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-style: preserve-3d;
        }
        .animate-left-panel {
          opacity: 0;
          animation: panelSlideInLeft 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.45s;
        }
        .animate-right-panel {
          opacity: 0;
          animation: panelSlideInRight 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.55s;
        }
        .animate-signoff {
          opacity: 0;
          animation: signoffReveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards 1.6s;
        }

        .flap-open { animation: flapOpen 0.65s cubic-bezier(0.4, 0, 0.1, 1) forwards; }
        .seal-burst { animation: sealBurst 0.55s cubic-bezier(0.2, 1, 0.4, 1) forwards; }
        .seal-pulse { animation: sealPulse 2.5s ease-in-out infinite; }
        .animate-petal-fall { animation-name: petalFall; animation-timing-function: linear; animation-fill-mode: forwards; }
        
        .animate-rose-beat { animation: simpleRosePulse 1s ease-in-out infinite; transform-origin: 100px 75px; }
        .animate-stem-sway { animation: simpleStemSway 1s ease-in-out infinite; transform-origin: 100px 180px; }

        .word-node {
          opacity: 0;
          display: inline-block;
          animation: revealWordPremium 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-petal-fall { animation: none !important; opacity: 0 !important; }
          .letter-reveal, .flap-open, .animate-left-panel, .animate-right-panel { animation-duration: 0.01s !important; animation-delay: 0s !important; }
          .animate-rose-beat, .animate-stem-sway, .animate-signoff { animation: none !important; opacity: 0.4 !important; }
          .word-node { opacity: 1 !important; animation: none !important; }
        }
      `}</style>

      {showPetals && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden select-none">
          {petals.map((p) => <PetalShape key={p.id} style={p.style} className={p.className} />)}
        </div>
      )}

      <div 
        className="absolute left-1/2 top-1/2 -z-10 h-[520px] w-[720px] -translate-x-1/2 -translate-y-1/2 blur-[140px] rounded-full pointer-events-none transition-colors duration-1000 opacity-60"
        style={{ backgroundColor: activeTheme.gradientEnd }}
      />

      <div className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${scrolledIntoView ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <SectionHeading eyebrow="with all my heart" title="A Letter Kept For You" />
      </div>

      <div className="mt-14 max-w-4xl mx-auto relative min-h-[460px] flex items-center justify-center" style={{ perspective: '2000px' }}>

        {/* Closed Velvet Envelope State */}
        {!isOpened && (
          <div
            role="button"
            tabIndex={0}
            aria-label="Open the love letter"
            onClick={handleOpenLetter}
            onKeyDown={handleKeyDown}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={tiltStyle}
            className={`relative w-full max-w-md aspect-[1.65/1] select-none transition-all duration-500 ease-out outline-none
              ${scrolledIntoView ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-6'}
              ${isOpening ? 'pointer-events-none scale-90 opacity-0 transition-all duration-500' : 'cursor-pointer group'}
              focus-visible:ring-2 focus-visible:ring-rose-400 rounded-2xl
            `}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#241114] via-[#1a0a0c] to-[#0d0405] shadow-[0_35px_80px_-15px_rgba(20,5,7,0.85)] border border-white/5 overflow-hidden transition-shadow duration-300 group-hover:shadow-[0_45px_95px_-10px_rgba(20,5,7,0.95)]">
              <svg className="absolute inset-0 h-full w-full opacity-25 transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 400 250" preserveAspectRatio="none">
                <path d="M0 0 L200 130 L400 0" fill="none" stroke="#e2b4a8" strokeWidth="1" strokeOpacity="0.5" />
                <path d="M0 250 L160 108" fill="none" stroke="#e2b4a8" strokeWidth="0.75" strokeOpacity="0.3" />
                <path d="M400 250 L240 108" fill="none" stroke="#e2b4a8" strokeWidth="0.75" strokeOpacity="0.3" />
              </svg>
            </div>

            <div className={`absolute inset-x-0 top-0 h-1/2 origin-top ${isOpening ? 'flap-open' : ''}`} style={{ transformStyle: 'preserve-3d' }}>
              <div
                className="absolute inset-0 bg-gradient-to-b from-[#2e1518] to-[#1c0a0c] border-b border-black/40 shadow-sm"
                style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
              />
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                style={{ borderRadius: '48% 50% 46% 52%' }}
                className={`relative w-16 h-16 bg-gradient-to-tr from-[#6b1f2b] via-[#a82e43] to-[#e64a65] flex items-center justify-center border border-rose-300/40 shadow-lg ${isOpening ? 'seal-burst' : 'seal-pulse group-hover:scale-110 transition-transform duration-300'}`}
              >
                <div style={{ borderRadius: '45%' }} className="absolute inset-0.5 border-t border-l border-white/25 pointer-events-none" />
                <LoveRoseAccent className={`w-6 h-6 text-rose-50 drop-shadow-[0_2px_3px_rgba(0,0,0,0.45)] ${isOpening ? 'opacity-0 transition-opacity duration-150' : ''}`} />
              </div>
            </div>

            <p className={`absolute bottom-6 inset-x-0 text-center text-[10px] font-semibold tracking-[0.4em] uppercase transition-all duration-300 ${isOpening ? 'text-transparent' : 'text-rose-300/50 group-hover:text-rose-100 group-hover:tracking-[0.45em]'}`}>
              Open Letter
            </p>
          </div>
        )}

        {/* Beautiful Stationery Opened State */}
        {isOpened && (
          <div className="letter-reveal w-full grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch rounded-2xl bg-[#faf6ee] text-[#2c1316] shadow-[0px_45px_95px_rgba(38,13,17,0.15)] border border-[#dec0b8]/50 p-6 sm:p-10 relative transition-transform duration-300 hover:-translate-y-1">
            
            <div className="pointer-events-none absolute inset-[7px] rounded-xl border border-[#dec0b8]/40" />
            <div className="pointer-events-none absolute inset-[11px] rounded-xl border border-[#dec0b8]/15" />

            {/* Left Interactive Art Block */}
            <div 
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="animate-left-panel md:col-span-5 flex flex-col items-center justify-between bg-[#fbf8f1] rounded-xl p-5 border border-[#eadace]/60 min-h-[360px] shadow-[0_12px_40px_-15px_rgba(44,19,22,0.06)] relative overflow-hidden group/canvas"
            >
              <div className="absolute top-2.5 left-2.5 w-2 h-2 border-t border-l border-[#d3b6ae]/50 pointer-events-none" />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 border-t border-r border-[#d3b6ae]/50 pointer-events-none" />
              <div className="absolute bottom-2.5 left-2.5 w-2 h-2 border-b border-l border-[#d3b6ae]/50 pointer-events-none" />
              <div className="absolute bottom-2.5 right-2.5 w-2 h-2 border-b border-r border-[#d3b6ae]/50 pointer-events-none" />

              <div className="w-full flex justify-between items-center text-[9px] font-mono tracking-widest text-neutral-400 select-none border-b border-[#eadace]/40 pb-2.5">
                <span className="flex items-center gap-2 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeTheme.accent }} /> 
                  ART ENGINE
                </span>
                <button 
                  onClick={() => {
                    setBloomProgress(0)
                    setTimeout(() => setBloomProgress(1), 50)
                  }}
                  className="px-2.5 py-0.5 rounded-md bg-white border border-[#eadace]/50 text-neutral-500 hover:text-neutral-800 hover:border-neutral-300 shadow-sm transition-all text-[8px]"
                >
                  RE-BLOOM
                </button>
              </div>

              <div className="w-full max-w-[200px] aspect-square my-4 rounded-xl relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#fdfcf9] to-[#f7f3e9] border border-[#eadace]/30 shadow-[inset_0_4px_12px_rgba(0,0,0,0.02)]">
                <svg viewBox="0 0 200 200" className="w-[90%] h-[90%] transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1)" style={{ transform: `scale(${0.45 + bloomProgress * 0.55})` }}>
                  <defs>
                    <linearGradient id="roseBloomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={activeTheme.gradientStart} />
                      <stop offset="100%" stopColor={activeTheme.gradientEnd} />
                    </linearGradient>
                    <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={activeTheme.leafFill} />
                      <stop offset="100%" stopColor={`${activeTheme.leafFill}d0`} />
                    </linearGradient>
                  </defs>

                  <g className="animate-stem-sway">
                    <path d="M 100,105 Q 97,145 103,185" fill="none" stroke={activeTheme.ink} strokeWidth="2" strokeLinecap="round" />
                    {bloomProgress > 0.4 && (
                      <path d={`M 98,136 C ${81 + interactiveOffset.x},125 ${69 + interactiveOffset.x},142 98,148 C 98,148 90 + interactiveOffset.x,152 98,136`} fill="url(#leafGrad)" stroke={activeTheme.ink} strokeWidth="1.2" strokeLinejoin="round" />
                    )}
                    {bloomProgress > 0.6 && (
                      <path d={`M 102,148 C ${119 - interactiveOffset.x},138 ${131 - interactiveOffset.x},154 102,160 C 102,160 ${110 - interactiveOffset.x},164 102,148`} fill="url(#leafGrad)" stroke={activeTheme.ink} strokeWidth="1.2" strokeLinejoin="round" />
                    )}
                  </g>

                  <g className="animate-rose-beat" transform={`translate(${interactiveOffset.x * 0.4}, ${interactiveOffset.y * 0.4})`} style={{ transformOrigin: '100px 75px' }}>
                    <path d="M 100,112 C 60,92 50,52 100,42 C 150,52 140,92 100,112 Z" fill="url(#roseBloomGrad)" stroke={activeTheme.ink} strokeWidth="2" strokeLinejoin="round" opacity={bloomProgress} />
                    {bloomProgress > 0.3 && (
                      <path d="M 100,102 C 72,85 68,60 100,52 C 132,60 128,85 100,102 Z" fill="rgba(255,255,255,0.12)" stroke={activeTheme.ink} strokeWidth="1.5" strokeLinejoin="round" transform="rotate(-4 100 75)" />
                    )}
                    {bloomProgress > 0.6 && (
                      <path d="M 100,88 C 85,82 82,68 100,64 C 115,64 112,78 100,82 C 92,80 94,72 100,72 C 104,72 104,76 101,77" fill="none" stroke={activeTheme.ink} strokeWidth="1.5" strokeLinecap="round" />
                    )}
                  </g>
                </svg>
              </div>

              <div className="w-full border-t border-[#eadace]/40 pt-3 flex flex-col items-center gap-2">
                <div className="text-[8px] font-mono tracking-[0.25em] text-neutral-400 uppercase font-medium">Palette Variant</div>
                <div className="flex justify-center items-center gap-4">
                  {Object.entries(ROMANTIC_VINTAGE_THEMES).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedTheme(key)}
                      className={`w-3.5 h-3.5 rounded-full transition-all duration-300 relative ${
                        selectedTheme === key 
                          ? 'scale-125 ring-2 ring-offset-2 ring-neutral-400 ring-offset-[#fbf8f1]' 
                          : 'opacity-40 hover:opacity-100 hover:scale-115'
                      }`}
                      style={{ backgroundColor: value.gradientStart }}
                      title={value.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Calligraphy Letter Space */}
            <div className="animate-right-panel md:col-span-7 flex flex-col justify-between relative pt-2">
              <div className="absolute top-0 right-0 text-[11px] tracking-[0.2em] label-font-serif uppercase text-neutral-400 select-none">
                Est. Forever
              </div>

              <article 
                ref={articleContainerRef}
                className="relative z-10 max-h-[48vh] overflow-y-auto pr-3 mt-10 scroll-smooth scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent"
              >
                <div 
                  className="love-font-script text-3xl sm:text-4xl leading-[1.6] tracking-wide transition-colors duration-500 selection:bg-rose-200/50"
                  style={{ color: activeTheme.ink }}
                >
                  {wordsArray.map((word, index) => {
                    if (word.trim() === '') {
                      return <span key={index}>{word}</span>
                    }
                    
                    {/* Synchronized with the slower, more deliberate paper fold setup */}
                    const currentDelay = 0.95 + (printableWordCounter * 0.22)
                    printableWordCounter++

                    return (
                      <span
                        key={index}
                        className="word-node"
                        style={{ animationDelay: `${currentDelay}s` }}
                      >
                        {word}
                      </span>
                    )
                  })}
                </div>
              </article>

              {/* Staggered Sign-off flourish */}
              <div className="animate-signoff relative z-10 mt-6 flex items-center justify-end gap-3 select-none">
                <span className="h-[1px] w-10 bg-neutral-300" />
                <div className="w-7 h-7 rounded-full border border-neutral-300 flex items-center justify-center">
                  <LoveRoseAccent className="h-3.5 w-3.5" strokeColor={activeTheme.ink} />
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </section>
  )
}