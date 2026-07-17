import { useState, useEffect } from 'react'
import { site } from '../config'
import SectionHeading from './SectionHeading'

const NOTE_STYLES = [
  { 
    bg: 'bg-gradient-to-br from-[#fcfbf7] via-[#faf8f2] to-[#f5f1e6] text-[#2c1a11] border-[#e2d5bd]/60', 
    shadow: 'shadow-[0_10px_30px_-10px_rgba(40,20,5,0.06)]',
    cardTint: 'rgba(218,165,32,0.03)',
    tag: 'border-[#dfcbb5] text-[#8c6b4f] bg-[#f7f5ee]',
    ink: '#2c1a11'
  },
  { 
    bg: 'bg-gradient-to-br from-[#fffafa] via-[#fff5f6] to-[#fdf0f2] text-[#3d0a16] border-[#f2cbd4]/60', 
    shadow: 'shadow-[0_12px_32px_-10px_rgba(65,10,25,0.06)]',
    cardTint: 'rgba(225,29,72,0.02)',
    tag: 'border-[#ecd0d6] text-[#a65366] bg-[#fff6f7]',
    ink: '#3d0a16'
  },
  { 
    bg: 'bg-gradient-to-br from-[#f6fcf9] via-[#f0faf5] to-[#e6f5ee] text-[#0b331d] border-[#c2e7d5]/60', 
    shadow: 'shadow-[0_12px_30px_-10px_rgba(16,185,129,0.04)]',
    cardTint: 'rgba(16,185,129,0.02)',
    tag: 'border-[#cce8db] text-[#448c69] bg-[#f2faf6]',
    ink: '#0b331d'
  },
  { 
    bg: 'bg-gradient-to-br from-[#faf9ff] via-[#f5f2fc] to-[#eeeaf7] text-[#22073d] border-[#dbd2ed]/60', 
    shadow: 'shadow-[0_10px_30px_-10px_rgba(147,51,234,0.04)]',
    cardTint: 'rgba(147,51,234,0.02)',
    tag: 'border-[#ded6ed] text-[#7353a6] bg-[#f6f4fa]',
    ink: '#22073d'
  },
]

export default function WishWall() {
  const [wishes, setWishes] = useState([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [activeTiltId, setActiveTiltId] = useState(null)
  const [tiltStyles, setTiltStyles] = useState({})

  useEffect(() => {
    const initialized = (site.wishWallSeed || []).map((w, i) => {
      const pinOffset = ((i * 17) % 20) - 10
      // Mild mobile-optimized base rotations to prevent overlapping cuts on small portrait widths
      const rotation = ((i * 5) % 6) - 3 
      return {
        ...w,
        id: `seed-${i}`,
        styleIndex: i % NOTE_STYLES.length,
        rotation, 
        pinLeft: 50 + pinOffset,
        isNew: false
      }
    })
    setWishes(initialized)
  }, [])

  // Universal Fluid Interaction Engine (Handles desktop mouse vectors & mobile touch inputs flawlessly)
  const processDynamicMotion = (clientX, clientY, currentTarget, id) => {
    const box = currentTarget.getBoundingClientRect()
    
    // Extrapolate custom percentage offsets relative to changing viewport parameters
    const xPercentage = (clientX - box.left) / box.width
    const yPercentage = (clientY - box.top) / box.height
    
    // Map vectors to symmetric 3D rotation arrays (-0.5 to 0.5 center coordinate spacing)
    const rotateX = (0.5 - yPercentage) * 16 
    const rotateY = (xPercentage - 0.5) * 16

    setTiltStyles({
      transform: `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`,
      zIndex: 50,
      boxShadow: '0 25px 50px -12px rgba(44, 24, 16, 0.25)'
    })
    setActiveTiltId(id)
  }

  const handlePointerMove = (e, id) => {
    processDynamicMotion(e.clientX, e.clientY, e.currentTarget, id)
  }

  const handleTouchMove = (e, id) => {
    if (!e.touches || e.touches.length === 0) return
    // Captures structural movement without breaking native fluid background swipe mechanics
    processDynamicMotion(e.touches[0].clientX, e.touches[0].clientY, e.currentTarget, id)
  }

  const terminateMotion = () => {
    setActiveTiltId(null)
    setTiltStyles({})
  }

  const submit = (e) => {
    e.preventDefault()
    if (!message.trim()) return

    const newWish = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      name: name.trim() || 'Anonymous',
      message: message.trim(),
      styleIndex: Math.floor(Math.random() * NOTE_STYLES.length),
      rotation: Math.floor(Math.random() * 4) - 2, 
      pinLeft: 42 + Math.floor(Math.random() * 16),
      isNew: true
    }

    setWishes((prev) => [newWish, ...prev])
    setName('')
    setMessage('')
  }

  return (
    <section className="relative px-4 sm:px-6 py-12 sm:py-24 max-w-6xl mx-auto selection:bg-rose-500/10 overflow-hidden">
      <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />

      <style>{`
        .handwritten-ink { font-family: 'Alex Brush', cursive; font-weight: 400; }
        .luxury-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
        .gallery-serif { font-family: 'Playfair Display', serif; }
        
        @keyframes containerEntranceReveal {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes premiumCardDrop {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(-40px) rotate(-4deg);
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0) rotate(var(--target-rot, 0deg));
          }
        }

        .animate-board-reveal {
          animation: containerEntranceReveal 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-premium-drop {
          animation: premiumCardDrop 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <SectionHeading
        eyebrow="The Celebration Registry"
        title="Warm Birthday Wishes"
        subtitle="A pristine collective of timeless letters, golden milestones, and expressions of love from the people closest to your heart."
      />

      {/* Input Form Station with Adaptive Breakpoints */}
      <div className="luxury-sans relative z-30 max-w-xl mx-auto mb-12 sm:mb-20 mt-2 animate-board-reveal">
        <form 
          onSubmit={submit} 
          className="relative flex flex-col gap-2 rounded-xl border border-white/[0.06] bg-slate-950/20 p-2 backdrop-blur-2xl sm:flex-row shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={18}
            className="w-full rounded-lg border border-white/[0.05] bg-slate-950/40 px-4 py-2.5 text-xs tracking-wider text-slate-200 placeholder:text-slate-500/80 focus:border-amber-400/30 focus:bg-slate-950/70 focus:outline-none sm:w-1/3 transition-all duration-300"
          />
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Compose a beautiful note..."
            maxLength={110}
            required
            className="w-full flex-1 rounded-lg border border-white/[0.05] bg-slate-950/40 px-4 py-2.5 text-xs tracking-wider text-slate-200 placeholder:text-slate-500/80 focus:border-amber-400/30 focus:bg-slate-950/70 focus:outline-none transition-all duration-300"
          />
          <button 
            type="submit" 
            className="w-full sm:w-auto whitespace-nowrap rounded-lg bg-gradient-to-tr from-[#dfba6b] via-[#f7e3b5] to-[#e8c780] px-5 py-2.5 text-xs tracking-widest uppercase font-semibold text-slate-950 shadow-md transition-all duration-300 hover:brightness-105 active:scale-98"
          >
            Publish Note
          </button>
        </form>
      </div>

      {/* Infinite Grid System: Seamlessly moves between 1-col mobile, 2-col tablet, and 3-col widescreen configurations */}
      <div className="animate-board-reveal mx-auto grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr [transform-style:preserve-3d]">
        {wishes.map((w, index) => {
          const config = NOTE_STYLES[w.styleIndex]
          const isTilting = activeTiltId === w.id
          
          return (
            <div
              key={w.id}
              onMouseMove={(e) => handlePointerMove(e, w.id)}
              onMouseLeave={terminateMotion}
              onTouchMove={(e) => handleTouchMove(e, w.id)}
              onTouchEnd={terminateMotion}
              className={`group relative flex flex-col justify-between rounded-md border p-6 sm:p-7 pb-5 sm:pb-6 pt-10 sm:pt-11 ease-out touch-none select-none
                ${w.isNew ? 'animate-premium-drop' : 'opacity-100'} 
                ${config.bg} ${config.shadow}
                ${isTilting ? 'transition-none' : 'transition-all duration-200'}`}
              style={{ 
                '--target-rot': `${w.rotation}deg`,
                transform: isTilting 
                  ? tiltStyles.transform 
                  : `rotate(${w.rotation}deg) translateZ(0)`,
                boxShadow: isTilting ? tiltStyles.boxShadow : undefined,
                zIndex: isTilting ? tiltStyles.zIndex : undefined,
                animationDelay: w.isNew ? '0s' : `${index * 40}ms`
              }}
            >
              {/* Internal Framing Border Lines */}
              <div 
                className="absolute inset-[6px] border border-dashed rounded opacity-[0.3] pointer-events-none"
                style={{ borderColor: config.tag.split(' ')[0].replace('border-', '') }}
              />
              <div className="absolute inset-0 opacity-[0.01] bg-gradient-to-tr from-transparent via-white to-transparent pointer-events-none rounded-md" style={{ backgroundColor: config.cardTint }} />

              {/* Brushed Metallic Brass Clip Accent */}
              <div 
                className="absolute -top-3 w-6 h-6 flex items-center justify-center transition-transform duration-200"
                style={{ 
                  left: `${w.pinLeft}%`, 
                  transform: isTilting ? 'translateX(-50%) scale(1.08) translateZ(14px)' : 'translateX(-50%)' 
                }}
              >
                <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 drop-shadow-[0_3px_3px_rgba(40,20,5,0.15)]" fill="none">
                  <path d="M12 2L14.85 8.36L21.82 9.02L16.57 13.68L18.1 20.5L12 16.96L5.9 20.5L7.43 13.68L2.18 9.02L9.15 8.36L12 2Z" fill="url(#brassGoldGradFinal)" stroke="#bfa15f" strokeWidth="0.5" />
                  <defs>
                    <linearGradient id="brassGoldGradFinal" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f3e1b6" />
                      <stop offset="50%" stopColor="#cfa34c" />
                      <stop offset="100%" stopColor="#967026" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Luxury Calligraphy Text Area */}
              <p 
                className="handwritten-ink text-[32px] sm:text-[36px] lg:text-[38px] leading-[1.15] pt-2 grow opacity-95 pointer-events-none"
                style={{ 
                  color: config.ink,
                  transform: isTilting ? 'translateZ(10px)' : 'translateZ(0)',
                  transition: isTilting ? 'none' : 'transform 0.2s ease-out'
                }}
              >
                {w.message}
              </p>
              
              {/* Card Footer Block */}
              <div 
                className="mt-6 pt-3 border-t border-black/[0.04] flex items-center justify-between pointer-events-none"
                style={{ 
                  transform: isTilting ? 'translateZ(6px)' : 'translateZ(0)',
                  transition: isTilting ? 'none' : 'transform 0.2s ease-out'
                }}
              >
                <span className={`luxury-sans text-[7px] font-semibold tracking-[0.2em] uppercase px-1.5 py-0.5 rounded border ${config.tag}`}>
                  MEMENTO
                </span>
                <p className="gallery-serif text-sm sm:text-base font-medium italic opacity-75">
                  — {w.name}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <p className="luxury-sans mx-auto mt-16 max-w-sm text-center text-[9px] leading-relaxed tracking-widest text-slate-500/30 uppercase">
        ✦ Premium Dynamic Canvas Grid Connected ✦
      </p>
    </section>
  )
}