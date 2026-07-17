import { useEffect, useRef, useState } from 'react'
import { site } from '../config'
import SectionHeading from './SectionHeading'

function RevealItem({ index, item, innerRef }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const target = ref.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    )

    if (target) observer.observe(target)
    return () => observer.disconnect()
  }, [])

  const alignRight = index % 2 === 1

  return (
    <div
      ref={(el) => {
        ref.current = el
        if (innerRef) innerRef.current = el
      }}
      className={`relative flex items-start gap-4 md:gap-8 py-8 md:py-12 transition-all duration-1000 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      } ${alignRight ? 'md:flex-row-reverse md:text-right' : ''}`}
    >
      <div className="absolute left-[15px] top-[46px] md:top-[56px] z-20 flex h-4 w-4 -translate-x-1/2 items-center justify-center md:left-1/2">
        <span className={`absolute h-6 w-6 rounded-full bg-rose-500/20 transition-transform duration-1000 ${visible ? 'animate-ping' : 'scale-0'}`} />
        <span className={`h-3 w-3 rounded-full border border-slate-950 transition-all duration-700 shadow-md ${visible ? 'scale-110 bg-gradient-to-tr from-amber-400 to-rose-500 shadow-rose-500/50' : 'scale-70 bg-slate-700'}`} />
      </div>

      <div className="hidden w-1/2 md:block" />

      <div 
        className={`w-full md:w-1/2 pl-10 pr-2 md:pl-0 md:pr-0 transition-all duration-1000 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]
          ${visible 
            ? 'translate-x-0 opacity-100 blur-0' 
            : `${alignRight ? 'md:translate-x-8' : 'md:-translate-x-8'} translate-x-6 opacity-0 blur-sm`
          }`}
      >
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/40 via-slate-950/60 to-slate-900/50 p-5 md:p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:border-rose-400/30 hover:shadow-2xl hover:shadow-rose-500/5">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent transition-opacity duration-500 group-hover:via-rose-400/20" />
          
          <div className={`flex flex-col xs:flex-row xs:items-center gap-1.5 md:gap-2.5 text-xl font-extrabold tracking-tight ${alignRight ? 'md:justify-end' : 'justify-start'}`}>
            <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text font-mono tracking-wider text-transparent">{item.year}</span>
            <span className="hidden xs:inline-flex text-rose-400/90 animate-[pulse_2s_infinite]">♥</span>
            <span className="font-sans text-base md:text-lg tracking-wide text-slate-100 transition-colors duration-300 group-hover:text-white">{item.label}</span>
          </div>
          
          <p className="mt-2.5 text-sm md:text-[15px] font-medium leading-relaxed text-slate-300/90 transition-colors duration-300 group-hover:text-slate-200">{item.note}</p>
          <div className="pointer-events-none absolute -bottom-12 -right-12 h-24 w-24 rounded-full bg-rose-500/10 opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100" />
        </div>
      </div>
    </div>
  )
}

export default function Timeline() {
  const trackRef = useRef(null)
  const lastScrollY = useRef(0)
  const lastTime = useRef(Date.now())
  const arrivedRef = useRef(false)
  const audioCtxRef = useRef(null)

  // Array of element references for tracking each card boundary accurately
  const itemsRef = useRef(site.timeline.map(() => ({ current: null })))
  // Tracks nodes that have already fired sound to prevent spam triggers
  const completedNodes = useRef(new Set())

  const [journeyProgress, setJourneyProgress] = useState(0)
  const [carPitch, setCarPitch] = useState(0) 
  const [carYaw, setCarYaw] = useState(0)     
  const [scrollDirection, setScrollDirection] = useState('idle') 
  const [velocity, setVelocity] = useState(0)
  const [isArriving, setIsArriving] = useState(false) 

  // Smooth & Lovable Milestone Harmony Pop Sound
  const playMilestonePop = () => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (!Ctx) return
      if (!audioCtxRef.current) audioCtxRef.current = new Ctx()
      const ctx = audioCtxRef.current
      if (ctx.state === 'suspended') ctx.resume()

      const now = ctx.currentTime
      
      // Warm, beautiful major third dyad chord (E5 & G#5) for a sweet tone
      const frequencies = [659.25, 830.61] 
      
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gainNode = ctx.createGain()
        
        osc.type = 'sine' // Soft round tone shape
        osc.frequency.setValueAtTime(freq, now)
        
        // Gentle strike envelope configuration
        gainNode.gain.setValueAtTime(0, now)
        gainNode.gain.linearRampToValueAtTime(0.15, now + 0.04) // Mild attack phase
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.55 + (idx * 0.05)) // Silky tail decay
        
        osc.connect(gainNode)
        gainNode.connect(ctx.destination)
        
        osc.start(now)
        osc.stop(now + 0.6)
      })
    } catch (e) {
      // Ignored silently if browser gestures block tracking
    }
  }

  const playArrivalChime = () => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (!Ctx) return
      if (!audioCtxRef.current) audioCtxRef.current = new Ctx()
      const ctx = audioCtxRef.current
      if (ctx.state === 'suspended') ctx.resume()

      const now = ctx.currentTime
      const notes = [659.25, 987.77, 1318.51] // E5, B5, E6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.value = freq
        const start = now + i * 0.1
        gain.gain.setValueAtTime(0, start)
        gain.gain.linearRampToValueAtTime(0.22, start + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.6)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(start)
        osc.stop(start + 0.65)
      })

      const thump = ctx.createOscillator()
      const thumpGain = ctx.createGain()
      thump.type = 'sine'
      thump.frequency.setValueAtTime(180, now)
      thump.frequency.exponentialRampToValueAtTime(60, now + 0.25)
      thumpGain.gain.setValueAtTime(0.3, now)
      thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3)
      thump.connect(thumpGain)
      thumpGain.connect(ctx.destination)
      thump.start(now)
      thump.stop(now + 0.32)
    } catch (e) {}
  }

  useEffect(() => {
    const updateCarPosition = () => {
      const track = trackRef.current
      if (!track) return

      const rect = track.getBoundingClientRect()
      const travelDistance = rect.height + window.innerHeight
      const progress = (window.innerHeight - rect.top) / travelDistance
      const clampedProgress = Math.max(0, Math.min(1, progress))
      setJourneyProgress(clampedProgress)

      // Calculate the global viewport Y center coordinate where the car marker rides
      const carViewportY = window.innerHeight / 2

      // Check current overlap status for each node item along the track
      itemsRef.current.forEach((itemRef, idx) => {
        const itemEl = itemRef.current
        if (!itemEl) return

        const itemRect = itemEl.getBoundingClientRect()
        // Center node timeline trigger calculations relative to the custom connector dots
        const indicatorNodeY = itemRect.top + (itemRect.height / 2)

        // Trigger condition: Car passes directly across the center target boundary line (+/-12px threshold buffer)
        if (Math.abs(indicatorNodeY - carViewportY) < 12) {
          if (!completedNodes.current.has(idx)) {
            completedNodes.current.add(idx)
            playMilestonePop()
          }
        } else if (Math.abs(indicatorNodeY - carViewportY) > 60) {
          // Clear standard tracking history indices once car exits the safe boundary zone
          completedNodes.current.delete(idx)
        }
      })

      if (clampedProgress >= 0.995) {
        if (!arrivedRef.current) {
          arrivedRef.current = true
          setIsArriving(true)
          playArrivalChime()
          setTimeout(() => setIsArriving(false), 1000)
        }
      } else if (clampedProgress < 0.9) {
        arrivedRef.current = false
      }

      const currentScrollY = window.scrollY
      const currentTime = Date.now()
      const timeDiff = currentTime - lastTime.current

      if (timeDiff > 0) {
        const scrollDiff = currentScrollY - lastScrollY.current
        const currentVelocity = Math.abs(scrollDiff / timeDiff) 
        setVelocity(currentVelocity)
        
        if (scrollDiff > 0) {
          setScrollDirection('forward')
          setCarPitch(Math.min(25, currentVelocity * 8))
          setCarYaw(Math.sin(clampedProgress * Math.PI * 4) * 8)
        } else if (scrollDiff < 0) {
          setScrollDirection('backward')
          setCarPitch(Math.max(-15, -currentVelocity * 6)) 
          setCarYaw(-Math.sin(clampedProgress * Math.PI * 4) * 6)
        }
      }

      lastScrollY.current = currentScrollY
      lastTime.current = currentTime
    }

    const decayInterval = setInterval(() => {
      setCarPitch((prev) => (Math.abs(prev) > 0.5 ? prev * 0.82 : 0))
      setCarYaw((prev) => (Math.abs(prev) > 0.5 ? prev * 0.85 : 0))
      setVelocity((prev) => {
        if (prev > 0.05) {
          return prev * 0.8
        } else {
          setScrollDirection('idle')
          return 0
        }
      })
    }, 50)

    updateCarPosition()
    window.addEventListener('scroll', updateCarPosition, { passive: true })
    window.addEventListener('resize', updateCarPosition)
    
    return () => {
      window.removeEventListener('scroll', updateCarPosition)
      window.removeEventListener('resize', updateCarPosition)
      clearInterval(decayInterval)
    }
  }, [])

  const headBeamScale = scrollDirection === 'forward' ? 1 + velocity * 2.5 : 0.4
  const headBeamOpacity = scrollDirection === 'forward' ? Math.min(0.95, 0.7 + velocity) : (scrollDirection === 'idle' ? 0.15 : 0)

  const tailBeamScale = scrollDirection === 'backward' ? 1 + velocity * 2.5 : 0.4
  const tailBeamOpacity = scrollDirection === 'backward' ? Math.min(0.95, 0.7 + velocity) : (scrollDirection === 'idle' ? 0.15 : 0)

  const arrivalScale = isArriving ? 1.65 : 1

  return (
    <section className="px-4 py-20 md:py-28 max-w-5xl mx-auto selection:bg-rose-500/20">
      <SectionHeading eyebrow="our constellation" title="A timeline of us" />
      
      <div ref={trackRef} className="relative mx-auto max-w-4xl mt-12 md:mt-20">
        <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-zinc-800/40 to-transparent pointer-events-none" />
        <div className="absolute left-[15px] md:left-1/2 top-10 bottom-10 w-[2px] -translate-x-1/2 bg-gradient-to-b from-amber-400/0 via-rose-500/30 to-amber-400/0 pointer-events-none blur-[0.5px]" />

        <div
          className="pointer-events-none absolute left-[15px] z-30 -translate-x-1/2 -translate-y-1/2 transition-[top] duration-150 ease-out md:left-1/2"
          style={{ 
            top: `${journeyProgress * 100}%`,
            perspective: '600px',
            transformStyle: 'preserve-3d'
          }}
          aria-hidden="true"
        >
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all ${
              isArriving ? 'duration-[1000ms] ease-out opacity-0 scale-[3.2]' : 'duration-0 opacity-0 scale-0'
            }`}
            style={{ transformOrigin: 'center' }}
          >
            <div className="h-16 w-16 rounded-full border-2 border-amber-300/80 shadow-[0_0_30px_10px_rgba(251,191,36,0.35)]" />
          </div>
          <div
            className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity ${
              isArriving ? 'duration-300 opacity-100' : 'duration-700 opacity-0'
            }`}
          >
            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-amber-300/40 via-rose-400/30 to-transparent blur-2xl" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
            <div 
              className="absolute top-[28px] w-40 h-48 bg-gradient-to-b from-amber-200/90 via-amber-300/30 to-transparent blur-[3px] transition-all duration-150 origin-top"
              style={{
                transform: `scaleY(${headBeamScale}) translateZ(5px)`,
                opacity: headBeamOpacity,
                clipPath: 'polygon(42% 0%, 58% 0%, 100% 100%, 0% 100%)'
              }}
            />

            <div 
              className="absolute bottom-[28px] w-32 h-36 bg-gradient-to-t from-rose-500/95 via-rose-600/30 to-transparent blur-[2px] transition-all duration-150 origin-bottom"
              style={{
                transform: `scaleY(${tailBeamScale}) translateZ(5px)`,
                opacity: tailBeamOpacity,
                clipPath: 'polygon(40% 100%, 60% 100%, 100% 0%, 0% 0%)'
              }}
            />
          </div>

          <div 
            className="flex items-center justify-center"
            style={{ 
              transform: `rotate(180deg) rotateX(${carPitch}deg) rotateY(${carYaw}deg) translateZ(20px) scale(${arrivalScale})`,
              transformOrigin: 'center center',
              transformStyle: 'preserve-3d',
              transition: isArriving
                ? 'transform 1000ms cubic-bezier(0.34, 1.56, 0.64, 1)'
                : 'transform 300ms ease-out'
            }}
          >
            <svg
              className="absolute w-10 h-16 opacity-25"
              viewBox="0 0 60 100"
              style={{
                transform: 'scaleY(-1) translateY(-100%) translateZ(-30px)',
                filter: 'blur(2px)',
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 70%)',
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 70%)'
              }}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 14C12 8 20 5 30 5C40 5 48 8 48 14V30C48 36 53 42 53 52V76C53 84 46 92 30 92C14 92 7 84 7 76V52C7 42 12 36 12 30V14Z" fill="#1d4ed8" />
            </svg>

            <div 
              className="absolute inset-0 w-10 h-16 bg-black/50 rounded-xl blur-md transition-transform duration-300"
              style={{ transform: `translateZ(-25px) translateY(-5px) scale(1.05)` }}
            />

            <svg 
              className="w-10 h-16 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
              viewBox="0 0 60 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="cyberBody" x1="30" y1="5" x2="30" y2="95" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#93c5fd" />
                  <stop offset="28%" stopColor="#3b82f6" />
                  <stop offset="65%" stopColor="#1e40af" />
                  <stop offset="100%" stopColor="#0a1128" />
                </linearGradient>
                <linearGradient id="cyberAccent" x1="0" y1="0" x2="60" y2="100">
                  <stop offset="0%" stopColor="#dbeafe" />
                  <stop offset="100%" stopColor="#0c1a3d" />
                </linearGradient>
                <linearGradient id="cockpitGlass" x1="30" y1="32" x2="30" y2="62" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#0b0f19" />
                  <stop offset="50%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#475569" />
                </linearGradient>
                <radialGradient id="chromeRim" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#f1f5f9" />
                  <stop offset="45%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#1e293b" />
                </radialGradient>
                <radialGradient id="tireGlow" cx="50%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#3f3f46" />
                  <stop offset="100%" stopColor="#020304" />
                </radialGradient>
                <linearGradient id="bodySheen" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
                  <stop offset="18%" stopColor="#ffffff" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
                <filter id="glossyLight" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="3.5" result="blur" />
                  <feSpecularLighting in="blur" surfaceScale="4.5" specularConstant="0.85" specularExponent="16" lightingColor="#ffffff" result="spec">
                    <fePointLight x="12" y="-15" z="55" />
                  </feSpecularLighting>
                  <feComposite in="spec" in2="SourceAlpha" operator="in" result="specClipped" />
                  <feComposite in="SourceGraphic" in2="specClipped" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
                </filter>
              </defs>

              <g>
                <rect x="0" y="18" width="8" height="16" rx="3" fill="url(#tireGlow)" stroke="#1e293b" strokeWidth="0.5" />
                <ellipse cx="4" cy="26" rx="2.4" ry="6.2" fill="url(#chromeRim)" />
                <g stroke="#0f172a" strokeWidth="0.4" opacity="0.7">
                  <line x1="4" y1="20.5" x2="4" y2="31.5" /><line x1="1.7" y1="23" x2="6.3" y2="29" /><line x1="6.3" y1="23" x2="1.7" y2="29" />
                </g>
                <ellipse cx="4" cy="26" rx="1" ry="2.6" fill="#0f172a" />
              </g>
              <g>
                <rect x="52" y="18" width="8" height="16" rx="3" fill="url(#tireGlow)" stroke="#1e293b" strokeWidth="0.5" />
                <ellipse cx="56" cy="26" rx="2.4" ry="6.2" fill="url(#chromeRim)" />
                <g stroke="#0f172a" strokeWidth="0.4" opacity="0.7">
                  <line x1="56" y1="20.5" x2="56" y2="31.5" /><line x1="53.7" y1="23" x2="58.3" y2="29" /><line x1="58.3" y1="23" x2="53.7" y2="29" />
                </g>
                <ellipse cx="56" cy="26" rx="1" ry="2.6" fill="#0f172a" />
              </g>
              <g>
                <rect x="0" y="66" width="9" height="18" rx="3" fill="url(#tireGlow)" stroke="#1e293b" strokeWidth="0.5" />
                <ellipse cx="4.5" cy="75" rx="2.7" ry="7" fill="url(#chromeRim)" />
                <g stroke="#0f172a" strokeWidth="0.4" opacity="0.7">
                  <line x1="4.5" y1="68.5" x2="4.5" y2="81.5" /><line x1="1.9" y1="71.5" x2="7.1" y2="78.5" /><line x1="7.1" y1="71.5" x2="1.9" y2="78.5" />
                </g>
                <ellipse cx="4.5" cy="75" rx="1.1" ry="3" fill="#0f172a" />
              </g>
              <g>
                <rect x="51" y="66" width="9" height="18" rx="3" fill="url(#tireGlow)" stroke="#1e293b" strokeWidth="0.5" />
                <ellipse cx="55.5" cy="75" rx="2.7" ry="7" fill="url(#chromeRim)" />
                <g stroke="#0f172a" strokeWidth="0.4" opacity="0.7">
                  <line x1="55.5" y1="68.5" x2="55.5" y2="81.5" /><line x1="52.9" y1="71.5" x2="58.1" y2="78.5" /><line x1="58.1" y1="71.5" x2="52.9" y2="78.5" />
                </g>
                <ellipse cx="55.5" cy="75" rx="1.1" ry="3" fill="#0f172a" />
              </g>

              <path
                d="M12 14C12 8 20 5 30 5C40 5 48 8 48 14V30C48 36 53 42 53 52V76C53 84 46 92 30 92C14 92 7 84 7 76V52C7 42 12 36 12 30V14Z"
                fill="url(#cyberBody)"
                stroke="url(#cyberAccent)"
                strokeWidth="1.25"
                filter="url(#glossyLight)"
              />
              <path
                d="M12 14C12 8 20 5 30 5C40 5 48 8 48 14V30C48 36 53 42 53 52V76C53 84 46 92 30 92C14 92 7 84 7 76V52C7 42 12 36 12 30V14Z"
                fill="url(#bodySheen)"
                opacity="0.6"
              />

              <path d="M14 6C20 11 40 11 46 6L42 20H18L14 6Z" fill="#0f172a" fillOpacity="0.45" stroke="#fb7185" strokeWidth="0.5" />
              <path d="M21 24L23 8M39 24L37 8" stroke="#3b0212" strokeWidth="1" />

              <path d="M16 40C16 28 21 25 30 25C39 25 44 28 44 40V58C44 65 39 67 30 67C21 67 16 65 16 58V40Z" fill="url(#cockpitGlass)" stroke="#64748b" strokeWidth="0.75" />
              <path d="M19 35C23 31 37 31 41 35" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M18 44C22 41 38 41 42 44" stroke="#ffffff" strokeOpacity="0.15" strokeWidth="1" strokeLinecap="round" />
              <path d="M28 25C21 35 21 50 28 67" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="2" />

              <rect x="23" y="72" width="14" height="13" rx="1.5" fill="#030712" stroke="#475569" strokeWidth="0.5" />
              <line x1="26" y1="75" x2="34" y2="75" stroke="#fb7185" strokeWidth="1" strokeOpacity="0.8" />
              <line x1="26" y1="78" x2="34" y2="78" stroke="#fb7185" strokeWidth="1" strokeOpacity="0.8" />
              <line x1="26" y1="81" x2="34" y2="81" stroke="#fb7185" strokeWidth="1" strokeOpacity="0.8" />

              <path d="M8 11C9 8 13 7 15 7V12H8V11Z" fill="#fef08a" />
              <path d="M52 11C51 8 47 7 45 7V12H52V11Z" fill="#fef08a" />
              <circle cx="11.5" cy="9.5" r="1" fill="#fff" />
              <circle cx="48.5" cy="9.5" r="1" fill="#fff" />

              <path
                d="M9 90C19 93 41 93 51 90"
                stroke={isArriving ? '#fbbf24' : scrollDirection === 'backward' ? '#ff003c' : '#f43f5e'}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path d="M13 88C21 90 39 90 47 88" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="0.5" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col relative">
          {site.timeline.map((item, i) => (
            <RevealItem 
              key={`${item.year}-${i}`} 
              item={item} 
              index={i} 
              innerRef={itemsRef.current[i]}
            />
          ))}
        </div>
      </div>
    </section>
  )
}