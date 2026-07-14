import { useState, useRef, useEffect } from 'react'
import { site } from '../config'

const WHISPERS = [
  'IT KNOWS YOU LIE',
  'WRONG. IT REMEMBERS EVERYTHING.',
  'STOP GUESSING. IT IS WATCHING.',
  'EACH MISTAKE FEEDS IT',
  'YOU WILL NOT ESCAPE THIS SCREEN',
  'IT IS BEHIND YOU NOW',
]

const CORRUPTION_LINES = [
  '01001000 01000101 01001100 01010000',
  'let me out let me out let me out',
  'THE DOOR WAS NEVER LOCKED',
  'i have been here longer than you think',
  '404 — SOUL NOT FOUND',
]

// A crow that startles and darts across the screen — erratic, jittery flight path,
// with a faint red eye-glow so it reads as menacing rather than cute
function Crow({ id, style, onDone }) {
  useEffect(() => {
    const t = setTimeout(() => onDone(id), 1800)
    return () => clearTimeout(t)
  }, [id, onDone])

  return (
    <span
      className="fixed z-[55] pointer-events-none"
      style={{
        left: 0,
        top: 0,
        ...style,
      }}
    >
      <span
        className="relative block leading-none"
        style={{ fontSize: '28px', filter: 'brightness(0) drop-shadow(0 0 3px rgba(0,0,0,0.9))' }}
      >
        🐦‍⬛
      </span>
      <span
        className="absolute rounded-full bg-red-600 animate-[eye-glow_0.3s_ease-in-out_infinite]"
        style={{ width: '2px', height: '2px', top: '10px', left: '17px', boxShadow: '0 0 3px 1px rgba(220,38,38,0.9)' }}
      />
    </span>
  )
}

export default function LockScreen({ onUnlock }) {
  const [value, setValue] = useState('')
  const [shake, setShake] = useState(false)
  const [unlocking, setUnlocking] = useState(false)
  const [glitchText, setGlitchText] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [crack, setCrack] = useState(false)
  const [jumpScare, setJumpScare] = useState(false)
  const [crows, setCrows] = useState([])
  const containerRef = useRef(null)
  const audioCtxRef = useRef(null)
  const droneRef = useRef(null)
  const crowIdRef = useRef(0)

  const message = attempts === 0 ? 'DO NOT KEEP IT WAITING' : WHISPERS[Math.min(attempts, WHISPERS.length - 1)]
  const intensity = Math.min(attempts / 5, 1) // 0 -> 1, escalates dread over failed attempts

  // Low ambient dread drone that thickens with each failed attempt (Web Audio API, no external files)
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
      osc1.frequency.value = 42
      osc2.frequency.value = 43.5
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
      // Audio unsupported/blocked — fail silently, visuals still carry the horror
    }
  }, [])

  useEffect(() => {
    if (droneRef.current && audioCtxRef.current) {
      const t = audioCtxRef.current.currentTime
      droneRef.current.gain.gain.linearRampToValueAtTime(0.02 + intensity * 0.05, t + 0.5)
      droneRef.current.osc2.detune.linearRampToValueAtTime(intensity * 30, t + 0.5)
    }
  }, [intensity])

  // Short harsh screech blip, played whenever a crow spawns
  const playScreech = () => {
    const ctx = audioCtxRef.current
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    const t = ctx.currentTime
    osc.frequency.setValueAtTime(1400 + Math.random() * 400, t)
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.18)
    gain.gain.setValueAtTime(0.04, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.22)
  }

  // Spawns a crow with a randomized, erratic multi-point flight path on every keystroke
  const spawnCrow = () => {
    const id = crowIdRef.current++
    const vw = window.innerWidth
    const vh = window.innerHeight
    const startX = Math.random() * vw
    const startY = Math.random() * vh

    // Build a jittery keyframe path via CSS custom properties consumed by the animation
    const points = Array.from({ length: 5 }, () => ({
      x: (Math.random() - 0.5) * 320,
      y: (Math.random() - 0.5) * 320,
      r: (Math.random() - 0.5) * 200,
    }))

    const styleVars = {
      left: `${startX}px`,
      top: `${startY}px`,
      '--fx1': `${points[0].x}px`, '--fy1': `${points[0].y}px`, '--fr1': `${points[0].r}deg`,
      '--fx2': `${points[1].x}px`, '--fy2': `${points[1].y}px`, '--fr2': `${points[1].r}deg`,
      '--fx3': `${points[2].x}px`, '--fy3': `${points[2].y}px`, '--fr3': `${points[2].r}deg`,
      '--fx4': `${points[3].x}px`, '--fy4': `${points[3].y}px`, '--fr4': `${points[3].r}deg`,
      '--fx5': `${points[4].x}px`, '--fy5': `${points[4].y}px`, '--fr5': `${points[4].r}deg`,
      animation: `crow-erratic 1.8s cubic-bezier(0.65,0,0.35,1) forwards`,
    }

    setCrows((c) => [...c, { id, style: styleVars }])
    playScreech()
  }

  const removeCrow = (id) => {
    setCrows((c) => c.filter((cr) => cr.id !== id))
  }

  const handleKeyDown = () => {
    // A crow startles and darts off on each keypress — feels like disturbing something in the dark
    spawnCrow()
    if (Math.random() < 0.2) setTimeout(spawnCrow, 90)
  }

  const submit = (e) => {
    e.preventDefault()
    if (value.trim() === String(site.birthYear)) {
      setUnlocking(true)
      if (droneRef.current) droneRef.current.gain.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 1.2)
      setTimeout(onUnlock, 1400)
    } else {
      setShake(true)
      setGlitchText(true)
      setValue('')
      setAttempts((a) => a + 1)
      if (attempts >= 2) setCrack(true)
      if (attempts >= 3) {
        setJumpScare(true)
        setTimeout(() => setJumpScare(false), 260)
      }
      setTimeout(() => {
        setShake(false)
        setGlitchText(false)
      }, 600)
    }
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030303] px-6 text-center select-none overflow-hidden font-mono"
    >
      {/* 1. Psychological & Oppressive Overlays */}
      <div
        className="absolute inset-0 z-20 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle at center, transparent ${10 - intensity * 6}%, rgba(0,0,0,0.98) ${80 - intensity * 10}%)`,
        }}
      />

      <div
        className="absolute inset-0 bg-red-950/25 mix-blend-color-burn"
        style={{ animation: `heartbeat ${Math.max(4 - intensity * 2, 1.4)}s infinite ease-in-out` }}
      />

      <div className={`absolute inset-0 bg-stone-900/40 pointer-events-none z-30 transition-opacity ${shake ? 'opacity-100 animate-[subtle-flash_0.1s_infinite]' : 'opacity-0'}`} />

      <div className={`absolute inset-0 bg-red-700/30 pointer-events-none z-40 ${shake ? 'animate-[strobe-burst_0.4s_ease-out]' : 'opacity-0'}`} />

      {/* Harsh white/black static burst layered into every failed attempt */}
      <div
        className={`absolute inset-0 z-40 pointer-events-none mix-blend-difference ${shake ? 'opacity-40 animate-[static-noise_0.08s_steps(2)_infinite]' : 'opacity-0'}`}
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.4) 0px, transparent 2px, transparent 4px), repeating-linear-gradient(0deg, rgba(255,255,255,0.4) 0px, transparent 2px, transparent 4px)',
        }}
      />

      <div
        className="absolute inset-0 z-25 pointer-events-none opacity-[0.15] mix-blend-overlay"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 3px)',
          animation: 'scan-crawl 8s linear infinite',
        }}
      />

      <div className="absolute inset-0 opacity-[0.07] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyIiBoZWlnaHQ2PSIyIj48cmVjdCB3aWR0aD0iMSIgaGVpZHRoPSIxIiBmaWxsPSIjZmZmIi8+PC9zdmc+')] bg-repeat pointer-events-none z-20 animate-[grain_0.2s_infinite]" />

      {/* Ghostly corrupted text bleeding through the background, barely legible */}
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

      {crack && (
        <svg
          className="absolute inset-0 z-30 h-full w-full pointer-events-none opacity-30 animate-[crack-flicker_2.5s_infinite]"
          viewBox="0 0 400 800"
          preserveAspectRatio="none"
        >
          <path d="M200 0 L210 120 L160 180 L230 260 L180 340 L240 420 L190 520 L220 620 L200 800" stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="none" />
          <path d="M210 120 L320 90 M160 180 L60 150 M230 260 L340 300 M180 340 L70 380 M240 420 L360 460 M190 520 L90 560" stroke="rgba(255,255,255,0.3)" strokeWidth="0.75" fill="none" />
        </svg>
      )}

      <div className="absolute inset-0 z-10 pointer-events-none">
        <span className="absolute text-red-900/40 text-3xl animate-[drift-watch_14s_ease-in-out_infinite]">👁</span>
      </div>

      {/* Blood drip trailing from the top edge, pooling at its base */}
      <svg className="absolute top-0 left-1/2 -translate-x-1/2 z-20 h-48 w-10 pointer-events-none opacity-70" viewBox="0 0 20 190">
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

      {/* Crows startled off the screen on every keystroke — erratic, jittery flight paths */}
      {crows.map((c) => (
        <Crow key={c.id} id={c.id} style={c.style} onDone={removeCrow} />
      ))}

      {/* Full-screen jump-scare takeover on repeated failure */}
      {jumpScare && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black pointer-events-none">
          <span className="text-red-600 text-[9rem] leading-none animate-[jumpscare-pulse_0.26s_ease-out]">☠</span>
        </div>
      )}

      <div
        className={`relative z-10 flex flex-col items-center max-w-sm transition-all duration-[1200ms] ease-in-out ${
          unlocking ? 'scale-[0.6] opacity-0 blur-2xl translate-y-24 pointer-events-none' : 'scale-100 opacity-100'
        }`}
      >
        <div className="relative h-16 w-16 mb-6 flex items-center justify-center">
          <span
            className={`text-5xl font-light select-none leading-none absolute transition-all duration-300 ${
              unlocking ? 'text-stone-700 opacity-20 scale-50' : 'text-red-700/80'
            } ${shake ? 'animate-[distort-shake_0.3s_infinite] text-red-500' : 'animate-[glitch-flicker_3s_infinite]'}`}
          >
            {unlocking ? '👁' : attempts >= 4 ? '🕷' : '☠'}
          </span>
        </div>

        <h1
          className={`font-serif text-xl tracking-[0.3em] font-bold text-stone-300 uppercase sm:text-2xl transition-all duration-100 ${
            glitchText ? 'text-red-600 tracking-[-0.05em] scale-y-150 skew-x-12 blur-[1px]' : 'animate-[glitch-flicker_5s_infinite]'
          }`}
        >
          {glitchText ? WHISPERS[Math.min(attempts, WHISPERS.length - 1)] : message}
        </h1>

        <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-stone-600 max-w-[280px]">
          Provide the year of execution to lower the barrier.
        </p>

        <form onSubmit={submit} className="mt-12 flex flex-col items-center gap-6 w-full">
          <div className="relative w-full flex justify-center">
            <div className="absolute inset-y-0 left-0 right-0 border-y border-stone-900 pointer-events-none" />

            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              inputMode="numeric"
              maxLength={4}
              placeholder="0000"
              disabled={unlocking}
              className={`w-40 rounded-none border-b bg-transparent py-4 text-center text-3xl font-mono tracking-[0.5em] pl-[0.5em] placeholder:text-stone-950 focus:outline-none transition-all duration-150 ${
                shake
                  ? 'border-red-700 text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.7)] animate-[distort-shake_0.2s_infinite]'
                  : 'border-stone-900 text-stone-500 focus:border-red-950 focus:text-red-900'
              }`}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={unlocking}
            className="w-40 rounded-none border border-stone-900 bg-stone-950/40 px-5 py-3 text-[10px] uppercase tracking-[0.4em] text-stone-600 transition-all duration-200 hover:bg-red-950/10 hover:border-red-950 hover:text-red-600 disabled:opacity-0"
          >
            {unlocking ? 'COMPLYING' : 'SUBMIT'}
          </button>
        </form>

        <div className="h-6 mt-6 overflow-hidden">
          {shake && (
            <p className="text-[9px] uppercase tracking-widest text-red-700/90 animate-[fast-flicker_0.15s_infinite]">
              !! SECURITY BREACH RECOGNIZED BY THE HOST — ATTEMPT {attempts} !!
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes distort-shake {
          0% { transform: translate(2px, 1px) skewX(-5deg); }
          20% { transform: translate(-1px, -2px) skewX(10deg); }
          40% { transform: translate(-3px, 0px) skewY(5deg); }
          60% { transform: translate(1px, 2px) skewX(-10deg); }
          80% { transform: translate(-1px, -1px) skewY(-5deg); }
          100% { transform: translate(2px, -2px); }
        }
        @keyframes glitch-flicker {
          0%, 19.999%, 22%, 61.999%, 64%, 64.999%, 72%, 100% { opacity: 1; filter: none; }
          20%, 21.999%, 62%, 63.999%, 65%, 71.999% { opacity: 0.1; filter: invert(1) blur(1px); }
        }
        @keyframes fast-flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          45% { transform: scale(1.05); opacity: 0.28; }
          50% { transform: scale(1); opacity: 0.22; }
          55% { transform: scale(1.03); opacity: 0.26; }
        }
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-1%, 1%); }
          40% { transform: translate(-2%, -1%); }
          60% { transform: translate(1%, -2%); }
          80% { transform: translate(-1%, 2%); }
        }
        @keyframes subtle-flash {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.4; }
        }
        @keyframes strobe-burst {
          0% { opacity: 0.6; }
          30% { opacity: 0; }
          50% { opacity: 0.4; }
          100% { opacity: 0; }
        }
        @keyframes static-noise {
          0% { transform: translate(0,0); }
          50% { transform: translate(-2px, 1px); }
          100% { transform: translate(2px, -1px); }
        }
        @keyframes scan-crawl {
          0% { background-position: 0 0; }
          100% { background-position: 0 100px; }
        }
        @keyframes crack-flicker {
          0%, 92%, 100% { opacity: 0.3; }
          93%, 96% { opacity: 0.6; }
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
        @keyframes corrupt-drift {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-120%); }
        }
        @keyframes jumpscare-pulse {
          0% { transform: scale(0.6); opacity: 0; }
          40% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
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
      `}</style>
    </div>
  )
}