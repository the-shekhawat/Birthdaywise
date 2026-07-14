import { useEffect, useState, useRef } from 'react'

const darkMessages = [
  'Isolating the perimeter…',
  'Calibrating the parameters…',
  'Awakening the consciousness…',
  'Feeding the mechanism…',
  'It knows you are here…',
  'It is closer than it appears…',
]

const CORRUPTION_LINES = [
  '01001000 01000101 01001100 01010000',
  'do not turn around',
  'THE COUNT IS A LIE',
  'i have been here longer than you think',
  '404 — SOUL NOT FOUND',
]

const TOTAL_DURATION = 8000 // Fixed 8 second minimum stay on this screen

export default function Loader({ onDone }) {
  const [progress, setProgress] = useState(0)
  const [msgIndex, setMsgIndex] = useState(0)
  const [fading, setFading] = useState(false)
  const [glitchTrigger, setGlitchTrigger] = useState(false)
  const [stutter, setStutter] = useState(false)
  const [crack, setCrack] = useState(false)
  const [jumpScare, setJumpScare] = useState(false)
  const [crow, setCrow] = useState(null)
  const audioCtxRef = useRef(null)
  const droneRef = useRef(null)
  const crowIdRef = useRef(0)
  const startTimeRef = useRef(null)
  const stutterOffsetRef = useRef(0) // Accumulated visual-only setback from stutters

  // Low ambient dread drone underneath the whole load sequence
  useEffect(() => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      const ctx = new AudioContext()
      audioCtxRef.current = ctx
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()
      osc1.type = 'sine'
      osc2.type = 'sawtooth'
      osc1.frequency.value = 40
      osc2.frequency.value = 41.5
      gain.gain.value = 0.02
      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(ctx.destination)
      osc1.start()
      osc2.start()
      droneRef.current = { osc1, osc2, gain }
      return () => {
        osc1.stop()
        osc2.stop()
        ctx.close()
      }
    } catch {
      // Audio unsupported/blocked — visuals still carry the horror
    }
  }, [])

  const playScreech = () => {
    const ctx = audioCtxRef.current
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    const t = ctx.currentTime
    osc.frequency.setValueAtTime(1300 + Math.random() * 400, t)
    osc.frequency.exponentialRampToValueAtTime(280, t + 0.18)
    gain.gain.setValueAtTime(0.035, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.22)
  }

  const spawnCrow = () => {
    const id = crowIdRef.current++
    const vw = window.innerWidth
    const vh = window.innerHeight
    const points = Array.from({ length: 5 }, () => ({
      x: (Math.random() - 0.5) * 320,
      y: (Math.random() - 0.5) * 320,
      r: (Math.random() - 0.5) * 200,
    }))
    setCrow({
      id,
      style: {
        left: `${Math.random() * vw}px`,
        top: `${Math.random() * vh}px`,
        '--fx1': `${points[0].x}px`, '--fy1': `${points[0].y}px`, '--fr1': `${points[0].r}deg`,
        '--fx2': `${points[1].x}px`, '--fy2': `${points[1].y}px`, '--fr2': `${points[1].r}deg`,
        '--fx3': `${points[2].x}px`, '--fy3': `${points[2].y}px`, '--fr3': `${points[2].r}deg`,
        '--fx4': `${points[3].x}px`, '--fy4': `${points[3].y}px`, '--fr4': `${points[3].r}deg`,
        '--fx5': `${points[4].x}px`, '--fy5': `${points[4].y}px`, '--fr5': `${points[4].r}deg`,
        animation: 'crow-erratic 1.8s cubic-bezier(0.65,0,0.35,1) forwards',
      },
    })
    playScreech()
    setTimeout(() => setCrow(null), 1800)
  }

  useEffect(() => {
    startTimeRef.current = performance.now()

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTimeRef.current
      // Base progress is strictly time-driven so total duration always lands around 8s
      const timeProgress = Math.min((elapsed / TOTAL_DURATION) * 100, 100)
      // Layer a small erratic jitter on top purely for the unsettling "unstable system" look
      const jitter = Math.sin(elapsed / 180) * 2.5 + (Math.random() - 0.5) * 3
      let next = Math.max(0, Math.min(timeProgress + jitter - stutterOffsetRef.current, 100))

      // Occasionally the progress "lies" — visually stutters backward briefly without affecting real completion time
      if (elapsed > 1200 && elapsed < TOTAL_DURATION - 800 && Math.random() > 0.93) {
        setStutter(true)
        stutterOffsetRef.current = Math.min(stutterOffsetRef.current + Math.random() * 8 + 4, 20)
        setTimeout(() => {
          setStutter(false)
          stutterOffsetRef.current = Math.max(stutterOffsetRef.current - 10, 0)
        }, 350)
      }

      setMsgIndex(Math.min(darkMessages.length - 1, Math.floor((next / 100) * darkMessages.length)))

      // Randomly simulate terminal interference glitches during load
      if (Math.random() > 0.75) {
        setGlitchTrigger(true)
        setTimeout(() => setGlitchTrigger(false), 150)
      }

      // Screen cracks once things get far enough along — never fully heals
      if (next > 55 && !crack) setCrack(true)

      // Rare crow startle mid-load
      if (Math.random() > 0.95) spawnCrow()

      setProgress(next)

      if (elapsed >= TOTAL_DURATION) {
        clearInterval(interval)
        setProgress(100)
        // One last violent jump-scare flash before the cut, like something slipped through at the finish
        setJumpScare(true)
        setTimeout(() => setJumpScare(false), 260)
        setTimeout(() => {
          setFading(true)
          if (droneRef.current) droneRef.current.gain.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 0.3)
        }, 260)
        // Short hangover so the jump-scare reads, then move on immediately —
        // the container never drops opacity, so nothing behind it is ever revealed.
        setTimeout(onDone, 520)
      }
    }, 120)

    return () => clearInterval(interval)
  }, [onDone])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030303] select-none overflow-hidden font-mono text-stone-600 transition-all duration-300 ${
        fading ? 'scale-110 blur-2xl pointer-events-none' : 'scale-100'
      }`}
    >
      {/* 1. Heavy Vignette & Static Noise Line */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#000_85%)] z-30 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-red-950/30 shadow-[0_0_8px_rgba(153,27,27,0.4)] z-20 animate-[scanline_2.5s_infinite_linear]" />

      {/* Pulsing heartbeat wash, quickens as progress climbs */}
      <div
        className="absolute inset-0 bg-red-950/20 mix-blend-color-burn pointer-events-none"
        style={{ animation: `heartbeat ${Math.max(4 - (progress / 100) * 2.4, 1.4)}s infinite ease-in-out` }}
      />

      {/* VHS scanline texture, crawling */}
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 3px)',
          animation: 'scan-crawl 8s linear infinite',
        }}
      />

      {/* Static burst layered on glitches */}
      <div
        className={`absolute inset-0 z-40 pointer-events-none mix-blend-difference ${glitchTrigger ? 'opacity-30 animate-[static-noise_0.08s_steps(2)_infinite]' : 'opacity-0'}`}
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.4) 0px, transparent 2px, transparent 4px), repeating-linear-gradient(0deg, rgba(255,255,255,0.4) 0px, transparent 2px, transparent 4px)',
        }}
      />

      {/* Ghostly corrupted text bleeding through the background */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-around opacity-[0.06] overflow-hidden">
        {CORRUPTION_LINES.map((line, i) => (
          <p
            key={i}
            className="text-stone-400 text-xs tracking-[0.3em] whitespace-nowrap animate-[corrupt-drift_18s_linear_infinite]"
            style={{ animationDelay: `${i * -3}s` }}
          >
            {line}
          </p>
        ))}
      </div>

      {/* Distant watching eye, drifts in the dark corners */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <span className="absolute text-red-900/40 text-3xl animate-[drift-watch_14s_ease-in-out_infinite]">👁</span>
      </div>

      {/* Blood drip, grows more insistent as progress rises */}
      <svg
        className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-10 pointer-events-none transition-all duration-700"
        style={{ height: `${100 + progress}px`, opacity: 0.4 + (progress / 100) * 0.4 }}
        viewBox="0 0 20 190"
      >
        <path
          d="M10 0 C10 30 8 40 10 55 C12 68 6 78 10 92 C13 102 8 110 10 122 C11 130 9 138 10 148"
          stroke="rgba(153,10,10,0.6)"
          strokeWidth="2"
          fill="none"
          className="animate-[drip-grow_6s_ease-in-out_infinite]"
        />
        <circle cx="10" cy="148" r="2.4" fill="rgba(153,10,10,0.7)" className="animate-[drip-fall_3s_ease-in_infinite]" />
        <ellipse cx="10" cy="150" rx="6" ry="2" fill="rgba(153,10,10,0.25)" className="animate-[pool-pulse_3s_ease-in-out_infinite]" />
      </svg>

      {/* Screen-crack overlay, appears past the halfway point and never heals */}
      {crack && (
        <svg
          className="absolute inset-0 z-30 h-full w-full pointer-events-none opacity-25 animate-[crack-flicker_2.5s_infinite]"
          viewBox="0 0 400 800"
          preserveAspectRatio="none"
        >
          <path d="M200 0 L210 120 L160 180 L230 260 L180 340 L240 420 L190 520 L220 620 L200 800" stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="none" />
          <path d="M210 120 L320 90 M160 180 L60 150 M230 260 L340 300 M180 340 L70 380 M240 420 L360 460 M190 520 L90 560" stroke="rgba(255,255,255,0.3)" strokeWidth="0.75" fill="none" />
        </svg>
      )}

      {/* Crow startle, rare mid-load event */}
      {crow && (
        <span className="fixed z-[55] pointer-events-none" style={crow.style}>
          <span className="relative block leading-none" style={{ fontSize: '28px', filter: 'brightness(0) drop-shadow(0 0 3px rgba(0,0,0,0.9))' }}>
            🐦‍⬛
          </span>
          <span
            className="absolute rounded-full bg-red-600 animate-[eye-glow_0.3s_ease-in-out_infinite]"
            style={{ width: '2px', height: '2px', top: '10px', left: '17px', boxShadow: '0 0 3px 1px rgba(220,38,38,0.9)' }}
          />
        </span>
      )}

      {/* Full-screen jump-scare flash right as loading completes */}
      {jumpScare && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black pointer-events-none">
          <span className="text-red-600 text-[9rem] leading-none animate-[jumpscare-pulse_0.26s_ease-out]">👁</span>
        </div>
      )}

      {/* 2. Unsettling Totem Centerpiece */}
      <div
        className={`relative mb-12 text-6xl select-none leading-none tracking-normal transition-all duration-150 ${
          glitchTrigger ? 'text-red-600 animate-[breakout_0.15s_infinite] scale-125' : 'text-stone-800'
        }`}
      >
        {progress > 80 ? '👁' : progress > 40 ? '⦻' : '⌖'}
      </div>

      {/* 3. Aggressive Brutalist Progress Core */}
      <div className="relative w-56 sm:w-72 h-[3px] bg-stone-950 border border-stone-900 overflow-hidden p-[1px]">
        <div
          className={`h-full transition-all ease-out transform-gpu ${
            stutter ? 'duration-500 bg-red-900' : glitchTrigger ? 'duration-200 bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]' : 'duration-200 bg-red-950'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 4. Binary/Hex Minimalist Matrix Frame */}
      <div className="absolute bottom-6 left-6 text-[8px] tracking-widest text-stone-800 pointer-events-none uppercase">
        SYS_LOAD: {Math.floor(progress)}% // {stutter ? 'REGRESSING' : 'STABLE_ERR'}
      </div>

      {/* 5. Shifting Command Stream Text */}
      <div className="h-4 mt-6 overflow-hidden">
        <p
          className={`text-[10px] tracking-[0.25em] uppercase transition-colors duration-100 ${
            stutter ? 'text-red-800 italic' : glitchTrigger ? 'text-red-700 font-bold skew-x-12' : 'text-stone-600'
          }`}
        >
          {stutter ? 'IT DOES NOT WANT TO BE FOUND' : glitchTrigger ? 'MALFUNCTION DETECTED' : darkMessages[msgIndex]}
        </p>
      </div>

      {/* CSS Mechanical / System Horror Glitch Mutations */}
      <style>{`
        @keyframes scanline {
          0% { top: -5%; }
          100% { top: 105%; }
        }
        @keyframes breakout {
          0% { transform: translate(-2px, 1px) skewX(-10deg); filter: invert(1); }
          50% { transform: translate(3px, -2px) scaleY(0.9); filter: blur(0.5px); }
          100% { transform: translate(-1px, 2px); }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); opacity: 0.18; }
          45% { transform: scale(1.05); opacity: 0.26; }
          50% { transform: scale(1); opacity: 0.2; }
          55% { transform: scale(1.03); opacity: 0.24; }
        }
        @keyframes scan-crawl {
          0% { background-position: 0 0; }
          100% { background-position: 0 100px; }
        }
        @keyframes static-noise {
          0% { transform: translate(0,0); }
          50% { transform: translate(-2px, 1px); }
          100% { transform: translate(2px, -1px); }
        }
        @keyframes corrupt-drift {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-120%); }
        }
        @keyframes drift-watch {
          0%, 100% { top: 12%; left: 8%; opacity: 0; }
          10% { opacity: 0.5; }
          25% { top: 15%; left: 82%; opacity: 0.3; }
          45% { opacity: 0; }
          55% { top: 78%; left: 20%; opacity: 0.4; }
          70% { opacity: 0.2; }
          85% { top: 65%; left: 75%; opacity: 0.5; }
          95% { opacity: 0; }
        }
        @keyframes drip-grow {
          0%, 100% { stroke-dasharray: 160; stroke-dashoffset: 160; }
          40%, 90% { stroke-dashoffset: 0; }
        }
        @keyframes drip-fall {
          0% { opacity: 0; transform: translateY(0); }
          10% { opacity: 1; }
          80% { opacity: 1; transform: translateY(40px); }
          100% { opacity: 0; transform: translateY(60px); }
        }
        @keyframes pool-pulse {
          0%, 100% { transform: scale(1); opacity: 0.25; }
          50% { transform: scale(1.3); opacity: 0.4; }
        }
        @keyframes crack-flicker {
          0%, 92%, 100% { opacity: 0.25; }
          93%, 96% { opacity: 0.5; }
        }
        @keyframes eye-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes crow-erratic {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 0; }
          8% { opacity: 1; }
          20% { transform: translate(var(--fx1), var(--fy1)) rotate(var(--fr1)) scale(1); }
          40% { transform: translate(var(--fx2), var(--fy2)) rotate(var(--fr2)) scale(0.95); }
          58% { transform: translate(var(--fx3), var(--fy3)) rotate(var(--fr3)) scale(1.05); }
          75% { transform: translate(var(--fx4), var(--fy4)) rotate(var(--fr4)) scale(0.9); }
          92% { opacity: 1; }
          100% { transform: translate(var(--fx5), var(--fy5)) rotate(var(--fr5)) scale(0.6); opacity: 0; }
        }
        @keyframes jumpscare-pulse {
          0% { transform: scale(0.6); opacity: 0; }
          40% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
      `}</style>
    </div>
  )
}