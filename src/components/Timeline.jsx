import { useEffect, useRef, useState } from 'react'
import { site } from '../config'
import SectionHeading from './SectionHeading'

function RevealItem({ index, item }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observerTarget = ref.current
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          // Once it's visible, we can stop observing this item
          if (observerTarget) obs.unobserve(observerTarget)
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Triggers slightly before scrolling into view
      }
    )
    
    if (observerTarget) obs.observe(observerTarget)
    return () => {
      if (observerTarget) obs.unobserve(observerTarget)
    }
  }, [])

  const alignRight = index % 2 === 1

  return (
    <div
      ref={ref}
      className={`relative flex items-start gap-8 py-10 transition-all duration-1000 [transition-timing-function:cubic-bezier(0.25,1,0.5,1)] ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      } ${alignRight ? 'sm:flex-row-reverse sm:text-right' : ''}`}
    >
      {/* Precision Node Connection Indicator */}
      <div className="absolute left-[7px] sm:left-1/2 -translate-x-1/2 top-[52px] z-20 flex h-4 w-4 items-center justify-center">
        <span className={`absolute h-6 w-6 rounded-full bg-rose-500/20 transition-transform duration-1000 ${
          visible ? 'animate-ping' : 'scale-0'
        }`} />
        <span className={`h-3 w-3 rounded-full border border-slate-950 transition-all duration-700 shadow-md ${
          visible 
            ? 'bg-gradient-to-tr from-amber-400 to-rose-500 scale-110 shadow-rose-500/50' 
            : 'bg-slate-700 scale-70'
        }`} />
      </div>

      {/* Spacing alignment balance cushion block for wide views */}
      <div className="hidden sm:block w-1/2" />

      {/* Memory Glassmorphic Card Unit with Dynamic Width Scale Expansion */}
      <div 
        className={`w-full sm:w-1/2 pl-6 sm:pl-0 transition-all duration-1000 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] origin-top
          ${visible ? 'scale-x-100 scale-y-100 blur-0' : 'scale-x-95 scale-y-90 blur-md'}
          ${alignRight ? 'sm:origin-right' : 'sm:origin-left'}`}
      >
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/40 via-slate-950/60 to-slate-900/50 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:border-rose-400/30 hover:shadow-2xl hover:shadow-rose-500/5">
          
          {/* Internal card ambient accent edge beam */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          {/* Card Header Container */}
          <div className={`flex flex-wrap items-center gap-2 text-xl font-extrabold tracking-tight ${
            alignRight ? 'sm:justify-end' : 'justify-start'
          }`}>
            <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent font-mono tracking-wider">
              {item.year}
            </span>
            
            {/* Elegant, Modern Animated Heart Badge */}
            <span className="inline-flex items-center justify-center text-rose-400/90 animate-[pulse_2s_infinite]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            </span>

            <span className="text-slate-100 font-sans tracking-wide text-lg">
              {item.label}
            </span>
          </div>

          <p className="mt-3 text-[15px] leading-relaxed text-slate-300/90 font-medium">
            {item.note}
          </p>

          {/* Subtly animated decorative ambient glow inside card hover */}
          <div className="absolute -right-12 -bottom-12 w-24 h-24 rounded-full bg-rose-500/10 blur-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
      </div>
    </div>
  )
}

export default function Timeline() {
  return (
    <section className="px-6 py-24 max-w-5xl mx-auto selection:bg-rose-500/20">
      <SectionHeading eyebrow="our constellation" title="A timeline of us" />
      
      {/* Structural Track Wrapper */}
      <div className="relative mx-auto max-w-4xl mt-16 pl-4 sm:pl-0">
        
        {/* Continuous Luxury Stem Guideline */}
        <div className="absolute left-[22px] sm:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-slate-800/40 to-transparent pointer-events-none" />
        
        {/* Dynamic Micro Glow Tracker Stem Overlay */}
        <div className="absolute left-[22px] sm:left-1/2 top-10 bottom-10 w-[2px] -translate-x-1/2 bg-gradient-to-b from-amber-400/0 via-rose-500/40 to-amber-400/0 pointer-events-none blur-[0.5px]" />

        <div className="flex flex-col relative">
          {site.timeline.map((item, i) => (
            // Swapped key to a safer composite key to prevent duplicates if two events share a year
            <RevealItem key={`${item.year}-${i}`} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}