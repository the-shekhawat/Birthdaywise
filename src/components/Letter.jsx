import { useEffect, useRef, useState } from 'react'
import { site } from '../config'
import SectionHeading from './SectionHeading'

// Simple line-art rose used for corner flourishes and the watermark
function Rose({ className = '', strokeColor = 'currentColor' }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      stroke={strokeColor}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Bloom */}
      <path d="M100 60c-14-10-34-6-38 10-4 16 10 28 24 26-14 6-22 22-12 34 10 12 28 10 34-4 2 16 18 26 32 20 14-6 18-24 6-34 16 4 30-8 28-24-2-16-20-24-32-16 6-14-2-30-18-32-12-2-22 6-24 20z" />
      <path d="M100 60c6 8 6 20-2 28" />
      <path d="M76 96c8-2 18 2 22 10" />
      <path d="M94 122c4-8 14-12 22-10" />
      <path d="M124 108c-6 6-8 16-4 24" />
      {/* Stem */}
      <path d="M100 130c-4 24-2 46 4 66" />
      {/* Leaves */}
      <path d="M100 158c-10-2-20 4-24 14 12 4 22-2 24-14z" />
      <path d="M106 176c10-4 22 0 28 10-12 6-24 2-28-10z" />
      {/* Thorns */}
      <path d="M101 144l-6-4" />
      <path d="M103 162l6-4" />
    </svg>
  )
}

export default function Letter() {
  const ref = useRef(null)
  const [scrolledIntoView, setScrolledIntoView] = useState(false)
  const [isOpened, setIsOpened] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setScrolledIntoView(true)
        obs.disconnect()
      }
    }, {
      threshold: 0.15,
    })
    
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} className="relative overflow-hidden px-6 py-28 sm:py-36 bg-gradient-to-b from-transparent via-rose-50/10 to-transparent">
      
      {/* Dynamic Keyframes for Falling Petals & Luxury Reveals */}
      <style>{`
        @keyframes driftAndSpin {
          0% { transform: translateY(-10%) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.7; }
          100% { transform: translateY(110vh) translateX(80px) rotate(360deg); opacity: 0; }
        }
        @keyframes letterUnfold {
          0% { transform: translateY(40px) scale(0.96); opacity: 0; filter: blur(4px); }
          100% { transform: translateY(0) scale(1); opacity: 1; filter: blur(0); }
        }
        .animate-petal-1 { animation: driftAndSpin 12s linear infinite; }
        .animate-petal-2 { animation: driftAndSpin 16s linear infinite 3s; }
        .animate-petal-3 { animation: driftAndSpin 14s linear infinite 7s; }
        .letter-unfold { animation: letterUnfold 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {/* Ambient Luxury Background Lights */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 bg-rose-200/20 blur-[140px] rounded-full pointer-events-none" />

      {/* Elegant Large Watermarks */}
      <Rose className="absolute -left-20 top-12 -z-10 h-80 w-80 rotate-[-15deg] text-rose-800/20 blur-[0.5px] pointer-events-none sm:h-[28rem] sm:w-[28rem]" />
      <Rose className="absolute -right-24 bottom-6 -z-10 h-96 w-96 rotate-[22deg] text-rose-900/15 blur-[0.5px] pointer-events-none sm:h-[32rem] sm:w-[32rem]" />

      {/* Organic Cascading Background Petals */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none">
        <span className="absolute left-[15%] top-0 w-3 h-4 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full rounded-tl-none opacity-0 animate-petal-1 blur-[0.3px]" />
        <span className="absolute right-[25%] top-0 w-4 h-5 bg-gradient-to-br from-rose-300 via-rose-500 to-rose-700 rounded-full rounded-tr-none opacity-0 animate-petal-2 blur-[0.5px]" />
        <span className="absolute left-[45%] top-0 w-3 h-3 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full rounded-bl-none opacity-0 animate-petal-3 blur-[0.2px]" />
      </div>

      {/* Header Staggered Reveal */}
      <div className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${scrolledIntoView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
        <SectionHeading eyebrow="a personal note" title="Everything I wanted to say" />
      </div>

      <div className="mt-14 max-w-2xl mx-auto relative min-h-[300px] flex items-center justify-center">
        
        {/* State A: The Sealed Envelope Box */}
        {!isOpened && (
          <div 
            onClick={() => setIsOpened(true)}
            className={`w-full max-w-md aspect-[1.6/1] bg-gradient-to-br from-slate-900 to-black rounded-2xl shadow-[0_30px_70px_-15px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/5 flex flex-col items-center justify-center p-8 cursor-pointer group transition-all duration-700 select-none ${
              scrolledIntoView ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-8'
            } hover:scale-[1.02] hover:border-rose-500/20 hover:shadow-rose-950/20`}
          >
            {/* Subtle vintage stamp placement */}
            <div className="absolute top-4 right-4 w-10 h-12 border border-white/10 rounded-sm flex items-center justify-center text-[10px] text-white/20 tracking-tighter uppercase font-mono rotate-6 pointer-events-none">
              Post
            </div>

            {/* Glowing Wax Seal Button */}
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-rose-800 via-rose-600 to-rose-500 flex items-center justify-center shadow-xl shadow-rose-950/50 border border-rose-400/30 group-hover:scale-110 active:scale-95 transition-transform duration-300">
              <span className="absolute inset-1 rounded-full border border-dashed border-white/20 opacity-60" />
              <Rose className="w-9 h-9 text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] animate-pulse" />
              {/* Outer clicking ripple indicator */}
              <span className="absolute inset-0 rounded-full border border-rose-500/50 animate-ping opacity-40 group-hover:opacity-70" />
            </div>
            
            <p className="mt-5 text-[11px] font-bold tracking-[0.25em] text-slate-400 uppercase group-hover:text-rose-400 transition-colors">
              Click Seal to Open
            </p>
          </div>
        )}

        {/* State B: The Exquisite Stationary Letter Card */}
        {isOpened && (
          <div className="letter-unfold w-full relative overflow-hidden rounded-md bg-stone-100/95 text-stone-900 shadow-[-25px_30px_70px_rgba(28,25,23,0.25),_0px_15px_30px_rgba(28,25,23,0.15)] transition-all duration-500 p-8 sm:p-14 hover:shadow-[-30px_35px_80px_rgba(28,25,23,0.3)] border-t border-white/60 bg-[url('https://www.transparenttextures.com/patterns/lined-paper-2.png')]">
            
            {/* Soft inner vignette shading frame */}
            <div className="absolute inset-0 bg-gradient-to-tr from-stone-900/[0.03] via-transparent to-stone-900/[0.01] pointer-events-none" />
            <div className="absolute inset-4 border border-stone-950/[0.04] pointer-events-none sm:inset-6" />

            {/* Stationary Watermarks & Corner Accents */}
            <Rose className="absolute -right-12 -top-12 h-64 w-64 rotate-[20deg] text-rose-800/[0.06] pointer-events-none" />
            <Rose className="absolute -left-5 -top-5 h-20 w-20 -rotate-12 text-rose-700/60 pointer-events-none" />
            <Rose className="absolute -right-5 -bottom-5 h-20 w-20 rotate-[160deg] text-rose-700/60 pointer-events-none" />

            {/* Letter Content Block */}
            <article className="relative z-10 max-h-[65vh] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-stone-300 scrollbar-track-transparent">
              <p className="whitespace-pre-line font-hand text-2xl leading-[1.7] text-stone-800/95 tracking-wide sm:text-3xl drop-shadow-[0_0.5px_0.5px_rgba(44,40,36,0.15)] selection:bg-rose-600/10">
                {site.letter}
              </p>
            </article>

            {/* Elegant Calligraphic Sign-off */}
            <div className="relative z-10 mt-10 flex items-center justify-end gap-3 select-none opacity-80 pointer-events-none">
              <span className="h-[1px] w-12 bg-stone-900/20" />
              <div className="w-7 h-7 rounded-full bg-rose-700/10 border border-rose-700/20 flex items-center justify-center">
                <Rose className="h-4 w-4 text-rose-700" />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}