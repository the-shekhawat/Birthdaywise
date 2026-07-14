import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import { site } from '../config'
import SectionHeading from './SectionHeading'

function getTimeLeft() {
  const diff = new Date(site.birthdayDate).getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function Countdown() {
  const [left, setLeft] = useState(getTimeLeft())
  const [celebrated, setCelebrated] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setLeft(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!left && !celebrated) {
      setCelebrated(true)
      // Premium continuous side bursts
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 }

      const randomInRange = (min, max) => Math.random() * (max - min) + min

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now()
        if (timeLeft <= 0) return clearInterval(interval)
        const particleCount = 50 * (timeLeft / duration)
        
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
      }, 250)
    }
  }, [left, celebrated])

  return (
    <section className="px-6 py-24 max-w-4xl mx-auto text-slate-100 selection:bg-amber-500/30">
      {/* Component Specific Keyframe Injectors */}
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); filter: drop-shadow(0 0 12px rgba(245,158,11,0.2)); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .luxury-pulse { animation: pulseGlow 3s ease-in-out infinite; }
        .luxury-float { animation: floatSlow 4s ease-in-out infinite; }
      `}</style>

      <SectionHeading 
        eyebrow="marking the moment" 
        title={left ? 'The Countdown Begins' : 'Happy Birthday!!'} 
      />

      <div className="mx-auto flex flex-col items-center mt-12">
        {left ? (
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 w-full luxury-float">
            {[
              ['Days', left.days],
              ['Hours', left.hours],
              ['Minutes', left.minutes],
              ['Seconds', left.seconds],
            ].map(([label, value]) => (
              <div
                key={label}
                className="relative flex w-24 sm:w-28 flex-col items-center rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/60 to-slate-950/80 py-6 backdrop-blur-xl shadow-xl shadow-black/20"
              >
                {/* Subtle internal ring glare */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                
                {/* Timer Numbers */}
                <span className="font-mono text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent filter drop-shadow-sm">
                  {String(value).padStart(2, '0')}
                </span>
                
                {/* Divider Line */}
                <span className="w-8 h-[2px] bg-amber-500/20 my-2.5 rounded-full" />
                
                {/* Meta Labels */}
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-slate-400/80">
                  {label}
                </span>
              </div>
            ))}
          </div>
        ) : (
          /* Celebratory State Premium Message Banner */
          <div className="w-full max-w-lg bg-gradient-to-b from-slate-900/40 via-slate-950/60 to-slate-900/40 border border-white/10 rounded-2xl p-8 text-center backdrop-blur-xl shadow-2xl luxury-pulse relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <p className="font-display text-2xl sm:text-3xl bg-gradient-to-r from-amber-200 via-rose-300 to-amber-300 bg-clip-text text-transparent font-bold tracking-wide">
              🎉 The day is finally here!
            </p>
            <p className="text-slate-300 text-sm mt-2 font-medium tracking-wide">
              Go wild, celebrate, and make today completely unforgettable! ✨
            </p>
          </div>
        )}
      </div>
    </section>
  )
}