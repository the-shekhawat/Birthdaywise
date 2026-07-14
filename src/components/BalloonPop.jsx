import { useMemo, useState } from 'react'
import SectionHeading from './SectionHeading'

const WISHES = [
  'May this year bring you more laughs than you can count.',
  'Wishing you courage for everything new this year brings.',
  'May you find joy in the smallest, quietest moments.',
  "Here's to adventures you haven't even planned yet.",
  'May you always feel as loved as you are today.',
  'Wishing you rest, real rest, whenever you need it.',
]

const BALLOON_STYLES = [
  { 
    bg: 'bg-gradient-to-tr from-rose-600 via-rose-500 to-rose-300', 
    shadow: 'shadow-rose-500/30 drop-shadow-[0_10px_15px_rgba(244,63,94,0.2)]', 
    border: 'border-rose-500/20', 
    text: 'text-rose-500 dark:text-rose-400',
    glow: 'from-rose-500/5 via-transparent to-transparent'
  },
  { 
    bg: 'bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-200', 
    shadow: 'shadow-amber-500/30 drop-shadow-[0_10px_15px_rgba(245,158,11,0.2)]', 
    border: 'border-amber-500/20', 
    text: 'text-amber-600 dark:text-amber-400',
    glow: 'from-amber-500/5 via-transparent to-transparent'
  },
  { 
    bg: 'bg-gradient-to-tr from-pink-600 via-pink-500 to-pink-300', 
    shadow: 'shadow-pink-500/30 drop-shadow-[0_10px_15px_rgba(236,72,153,0.2)]', 
    border: 'border-pink-500/20', 
    text: 'text-pink-500 dark:text-pink-400',
    glow: 'from-pink-500/5 via-transparent to-transparent'
  },
  { 
    bg: 'bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-300', 
    shadow: 'shadow-indigo-500/30 drop-shadow-[0_10px_15px_rgba(79,70,229,0.2)]', 
    border: 'border-indigo-500/20', 
    text: 'text-indigo-500 dark:text-indigo-400',
    glow: 'from-indigo-500/5 via-transparent to-transparent'
  }
]

export default function BalloonPop() {
  const [popped, setPopped] = useState({})
  const [particles, setParticles] = useState([])

  const balloons = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        style: BALLOON_STYLES[i % BALLOON_STYLES.length],
        wish: WISHES[i % WISHES.length],
        left: 10 + (i * 13) % 80, 
        delay: (i % 4) * 0.9,
        duration: 9 + (i % 3) * 2.5,
        swayDuration: 4 + (i % 2) * 2
      })),
    []
  )

  const handlePop = (id, e) => {
    const rect = e.currentTarget.parentElement.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newParticles = Array.from({ length: 16 }).map((_, i) => {
      const angle = (i * (360 / 16) * Math.PI) / 180
      const randomForce = 50 + Math.random() * 65
      return {
        id: `${id}-${i}-${Date.now()}`,
        x,
        y,
        dx: Math.cos(angle) * randomForce,
        dy: Math.sin(angle) * randomForce,
        size: 3 + Math.random() * 6,
        color: balloons[id].style.bg
      }
    })

    setParticles((prev) => [...prev, ...newParticles])
    setPopped((prev) => ({ ...prev, [id]: true }))

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)))
    }, 750)
  }

  const totalPopped = Object.keys(popped).length

  return (
    <section className="px-6 py-24 max-w-5xl mx-auto selection:bg-amber-500/20">
      <style>{`
        @keyframes floatAtmospheric {
          0% { transform: translateY(115%) scale(0.9) rotate(0deg); opacity: 0; }
          8% { opacity: 1; transform: translateY(100%) scale(1); }
          50% { transform: translateY(45%) scale(1.03) rotate(3deg); }
          85% { opacity: 1; }
          100% { transform: translateY(-620px) scale(0.85) rotate(-5deg); opacity: 0; }
        }
        @keyframes subtleSway {
          0%, 100% { transform: translateX(-8px); }
          50% { transform: translateX(8px); }
        }
        @keyframes popBurst {
          0% { transform: translate(0, 0) scale(1.3); opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
        }
        @keyframes cardReveal {
          0% { transform: translateY(15px) scale(0.96); opacity: 0; filter: blur(4px); }
          100% { transform: translateY(0) scale(1); opacity: 1; filter: blur(0); }
        }
        .custom-float {
          animation: floatAtmospheric linear infinite;
        }
        .custom-sway {
          animation: subtleSway ease-in-out infinite alternate;
        }
        .particle-burst {
          animation: popBurst 0.7s cubic-bezier(0.08, 0.82, 0.17, 1) forwards;
        }
        .card-reveal {
          animation: cardReveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
        <SectionHeading eyebrow="a wish hidden inside each one" title="Pop a Balloon" />
        
        {totalPopped > 0 && (
          <button 
            onClick={() => setPopped({})}
            className="group relative self-start sm:self-auto px-6 py-3 text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-amber-300 border border-slate-200 dark:border-amber-400/20 rounded-full bg-white/40 dark:bg-slate-900/60 backdrop-blur-md shadow-sm hover:border-slate-400 dark:hover:border-amber-400/50 transition-all duration-300 active:scale-95 overflow-hidden"
          >
            Reset Sky
          </button>
        )}
      </div>

      {/* Play Area - Changed bg-slate-950 to bg-transparent */}
      <div className="relative h-[550px] w-full overflow-hidden rounded-[32px] border border-slate-200/60 dark:border-white/10 bg-transparent">
        
        {/* Subtle cross-compatible grid backdrop pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Floating Balloons */}
        {balloons.map((b) =>
          popped[b.id] ? null : (
            <div
              key={b.id}
              className="absolute bottom-0 custom-float"
              style={{ 
                left: `${b.left}%`, 
                animationDelay: `${b.delay}s`, 
                animationDuration: `${b.duration}s` 
              }}
            >
              <div 
                className="custom-sway"
                style={{ animationDuration: `${b.swayDuration}s` }}
              >
                <button
                  onClick={(e) => handlePop(b.id, e)}
                  className={`relative w-[68px] h-[84px] rounded-t-[50%] rounded-b-[60%_85%] ${b.style.bg} ${b.style.shadow} transition-all duration-300 hover:scale-110 hover:-translate-y-1 active:scale-90 cursor-pointer focus:outline-none flex flex-col items-center group
                  after:content-[''] after:absolute after:bottom-[-4px] after:w-0 after:h-0 after:border-l-[7px] after:border-l-transparent after:border-r-[7px] after:border-r-transparent after:border-b-[9px] after:border-b-inherit`}
                  style={{ borderBottomColor: 'rgba(0,0,0,0.25)' }}
                  aria-label="pop balloon"
                >
                  {/* Glossy Realism 3D Overlays */}
                  <span className="absolute top-2.5 left-3.5 w-3.5 h-6 bg-gradient-to-b from-white/45 via-white/10 to-transparent rounded-full rotate-[18deg] blur-[0.4px]" />
                  <span className="absolute bottom-3 right-3 w-5 h-5 bg-black/10 rounded-full blur-sm pointer-events-none" />
                  <span className="absolute inset-1.5 rounded-t-[50%] rounded-b-[60%_85%] bg-gradient-to-b from-white/10 via-transparent to-black/40 opacity-80 pointer-events-none" />
                  
                  {/* String visible on both dark and light modes */}
                  <span className="absolute bottom-[-32px] w-[1px] h-9 bg-gradient-to-b from-slate-400/40 dark:from-white/25 to-transparent group-hover:from-slate-600 dark:group-hover:from-white/40 transition-colors" />
                </button>
              </div>
            </div>
          )
        )}

        {/* Explosions */}
        {particles.map((p) => (
          <span
            key={p.id}
            className={`absolute rounded-full ${p.color} pointer-events-none shadow-sm particle-burst`}
            style={{
              left: `${p.x}px`,
              top: `${p.y}px`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`,
            }}
          />
        ))}

        {/* Active Helper Tag */}
        {totalPopped === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 px-5 py-2.5 rounded-full backdrop-blur-md shadow-sm animate-pulse">
              🎈 Release a wish by popping a balloon
            </p>
          </div>
        )}
      </div>

      {/* Revealed Wish Output Boxes */}
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {balloons
          .filter((b) => popped[b.id])
          .map((b) => (
            <div 
              key={b.id} 
              className={`card-reveal flex gap-5 items-center rounded-2xl border ${b.style.border} bg-gradient-to-br ${b.style.glow} from-white dark:from-slate-950/40 to-slate-50 dark:to-slate-950/90 p-6 backdrop-blur-2xl shadow-md dark:shadow-xl dark:shadow-black/40 border-slate-200 transition-all duration-300 hover:border-slate-300 dark:hover:border-white/20`}
            >
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 shadow-inner ${b.style.text} text-xl shrink-0`}>
                ✨
              </div>
              <p className="text-[15px] font-medium leading-relaxed text-slate-700 dark:text-slate-200 flex-1">
                {b.wish}
              </p>
            </div>
          ))}
      </div>
    </section>
  )
}