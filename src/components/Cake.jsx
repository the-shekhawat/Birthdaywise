import { useState } from 'react'
import confetti from 'canvas-confetti'
import SectionHeading from './SectionHeading'
import { site } from '../config'

const CANDLE_COUNT = 5

export default function Cake() {
  const [lit, setLit] = useState(Array(CANDLE_COUNT).fill(true))
  const [sliced, setSliced] = useState(false)

  const allOut = lit.every((l) => !l)

  const blow = (i) => {
    if (!lit[i]) return // Can't blow out already unlit candle
    setLit((prev) => {
      const next = [...prev]
      next[i] = false
      if (next.every((l) => !l)) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } })
      }
      return next
    })
  }

  return (
    <section className="px-6 py-24 max-w-4xl mx-auto text-slate-100">
      {/* Self-contained animations to guarantee visual effect execution */}
      <style>{`
        @keyframes flicker {
          0%, 100% { transform: scale(1) rotate(-1deg); opacity: 0.9; }
          50% { transform: scale(1.15) rotate(2deg) translateY(-1px); opacity: 1; filter: drop-shadow(0 0 8px #f59e0b); }
        }
        @keyframes driftSmoke {
          0% { transform: translateY(0) scale(1); opacity: 0.6; }
          100% { transform: translateY(-40px) scale(1.4); opacity: 0; filter: blur(1px); }
        }
        .animate-candle-flicker {
          animation: flicker 0.6s ease-in-out infinite alternate;
        }
        .animate-smoke-drift {
          animation: driftSmoke 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <SectionHeading
        eyebrow="make a wish"
        title="Blow out the candles"
        subtitle="Click each flame, then cut the cake."
      />

      <div className="mx-auto flex max-w-xl flex-col items-center mt-12">
        
        {/* Interactive Candle Row */}
        <div className="mb-2 flex gap-5 items-end h-24 z-20">
          {lit.map((isLit, i) => (
            <div key={i} className="flex flex-col items-center relative group">
              {isLit ? (
                <button 
                  onClick={() => blow(i)} 
                  className="absolute bottom-10 h-7 w-4 bg-gradient-to-t from-amber-500 via-orange-400 to-yellow-200 rounded-full animate-candle-flicker shadow-[0_0_15px_rgba(245,158,11,0.6)] cursor-pointer focus:outline-none hover:scale-110 transition-transform"
                  aria-label="Blow out candle"
                />
              ) : (
                <span className="absolute bottom-11 text-base pointer-events-none animate-smoke-drift opacity-0">
                  💨
                </span>
              )}
              
              {/* Patterned Candle Body */}
              <span className={`h-12 w-2.5 rounded-sm bg-gradient-to-b from-rose-300 to-rose-400 border border-rose-200/20 shadow-sm relative overflow-hidden
                ${!isLit && 'opacity-70 saturate-50'}`}
              >
                {/* Diagonal candle stripe effect */}
                <span className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent rotate-45 transform scale-150" />
              </span>
            </div>
          ))}
        </div>

        {/* 3D Cake Visual Structure Container */}
        <div className="relative w-72 sm:w-84 group transition-transform duration-700">
          
          {/* Cake Slicing Separator Effect */}
          <div className={`transition-all duration-700 ease-out flex flex-col items-center ${sliced ? 'gap-x-8 transform scale-95' : 'gap-0'}`}>
            <div className="w-full flex">
              
              {/* Left Side/Slice of Cake */}
              <div className={`w-1/2 transition-transform duration-700 ease-out ${sliced ? '-translate-x-6 -rotate-3 opacity-90' : 'translate-x-0'}`}>
                {/* Top Frosting */}
                <div className="h-28 rounded-tl-[3rem] bg-gradient-to-b from-rose-400 to-rose-500 shadow-inner border-t border-l border-white/20 relative">
                  <div className="absolute inset-x-0 top-6 h-4 w-full bg-white/20 blur-[0.5px]" />
                  {/* Decorative frosting drop drops */}
                  <div className="absolute bottom-[-6px] left-4 w-4 h-4 rounded-full bg-rose-500" />
                  <div className="absolute bottom-[-4px] left-16 w-3 h-4 rounded-full bg-rose-500" />
                </div>
                {/* Base Cake Layer */}
                <div className="h-16 rounded-bl-2xl bg-gradient-to-b from-amber-300 to-amber-500 border-l border-b border-amber-600/20" />
              </div>

              {/* Right Side/Slice of Cake */}
              <div className={`w-1/2 transition-transform duration-700 ease-out ${sliced ? 'translate-x-6 rotate-3 opacity-90' : 'translate-x-0'}`}>
                {/* Top Frosting */}
                <div className="h-28 rounded-tr-[3rem] bg-gradient-to-b from-rose-400 to-rose-500 shadow-inner border-t border-r border-white/20 relative">
                  <div className="absolute inset-x-0 top-6 h-4 w-full bg-white/20 blur-[0.5px]" />
                  <div className="absolute bottom-[-5px] right-6 w-3 h-4 rounded-full bg-rose-500" />
                  <div className="absolute bottom-[-3px] right-20 w-4 h-3 rounded-full bg-rose-500" />
                </div>
                {/* Base Cake Layer */}
                <div className="h-16 rounded-br-2xl bg-gradient-to-b from-amber-300 to-amber-500 border-r border-b border-amber-600/20" />
              </div>

            </div>
          </div>

          {/* Underlay Serving Plate Shimmer */}
          <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 h-4 w-[110%] bg-gradient-to-r from-slate-700/40 via-slate-600/60 to-slate-700/40 rounded-full blur-[1px] -z-10 shadow-lg" />
        </div>

        {/* Action / Messaging UI States */}
        <div className="h-24 mt-12 flex items-center justify-center w-full">
          {allOut && !sliced && (
            <button
              onClick={() => setSliced(true)}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer hover:from-amber-300 hover:to-amber-400"
            >
              🔪 Cut the cake
            </button>
          )}

          {sliced && (
            <div className="max-w-md text-center bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-white/10 rounded-2xl p-4 shadow-xl backdrop-blur-md animate-fade-in">
              <p className="font-display text-lg text-amber-300 font-medium">
                🎂 Wish made, cake cut — happy birthday, {site.personName}!
              </p>
            </div>
          )}
        </div>

      </div>
    </section>
  )
}