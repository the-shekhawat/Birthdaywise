import { useEffect, useState, useRef, useCallback } from 'react'

// This is the "warning" screen shown right after the loader finishes and
// right before the door-opening reveal (WelcomeTransition). It only asks
// the visitor to confirm before moving on — the actual reveal animation
// lives in WelcomeTransition.jsx so it isn't duplicated here.
//
// The continue button is still fully clickable and accessible at all
// times — keyboard/Enter/Space always works immediately, no dodging.
// The mouse-evade behavior only ever triggers twice, then the button
// settles and stays put, so no visitor actually gets stuck.
export default function Landing({ onEnter }) {
  const [leaving, setLeaving] = useState(false)
  const [flicker, setFlicker] = useState(false)
  const [glitching, setGlitching] = useState(false)
  const [shake, setShake] = useState(false)
  const [subliminal, setSubliminal] = useState(null)
  const [held, setHeld] = useState(false) // "held breath" — hovering near the button
  const [btnOffset, setBtnOffset] = useState({ x: 0, y: 0 })
  const dodgeCountRef = useRef(0)
  const btnRef = useRef(null)

  const audioCtxRef = useRef(null)
  const droneRef = useRef(null)
  const canvasRef = useRef(null)

  const SUBLIMINAL_WORDS = ['DON\'T', 'STAY', 'LEAVE', 'BEHIND YOU', 'STILL HERE']

  // ---- Ambient dread audio: drone + breathing pulse + noise stingers + whisper bed ----
  useEffect(() => {
    let noiseTimeouts = []
    let whisperTimeouts = []
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      const ctx = new AudioContext()
      audioCtxRef.current = ctx

      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const sub = ctx.createOscillator()
      const masterGain = ctx.createGain()
      const droneGain = ctx.createGain()

      osc1.type = 'sine'
      osc2.type = 'sawtooth'
      sub.type = 'sine'
      osc1.frequency.value = 42
      osc2.frequency.value = 43.5
      sub.frequency.value = 21

      droneGain.gain.value = 0.022
      masterGain.gain.value = 1

      osc1.connect(droneGain)
      osc2.connect(droneGain)
      sub.connect(droneGain)
      droneGain.connect(masterGain)
      masterGain.connect(ctx.destination)

      osc1.start()
      osc2.start()
      sub.start()

      const lfo = ctx.createOscillator()
      const lfoGain = ctx.createGain()
      lfo.frequency.value = 0.12
      lfoGain.gain.value = 0.35
      lfo.connect(lfoGain)
      lfoGain.connect(masterGain.gain)
      lfo.start()

      droneRef.current = { osc1, osc2, sub, lfo, droneGain, masterGain }

      // short static/noise burst
      const scheduleNoise = () => {
        const t = 4000 + Math.random() * 7000
        const id = setTimeout(() => {
          try {
            const bufferSize = ctx.sampleRate * 0.15
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
            const data = buffer.getChannelData(0)
            for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.3
            const noise = ctx.createBufferSource()
            noise.buffer = buffer
            const noiseGain = ctx.createGain()
            noiseGain.gain.value = 0.015
            noise.connect(noiseGain)
            noiseGain.connect(masterGain)
            noise.start()
          } catch {}
          scheduleNoise()
        }, t)
        noiseTimeouts.push(id)
      }
      scheduleNoise()

      // filtered-noise "whisper" bed — bandpassed hiss that swells and fades,
      // reads as breathy/vocal-ish without being an actual recognizable word
      const scheduleWhisper = () => {
        const t = 6000 + Math.random() * 8000
        const id = setTimeout(() => {
          try {
            const dur = 1.2 + Math.random() * 0.8
            const bufferSize = ctx.sampleRate * dur
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
            const data = buffer.getChannelData(0)
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
            const src = ctx.createBufferSource()
            src.buffer = buffer
            const bandpass = ctx.createBiquadFilter()
            bandpass.type = 'bandpass'
            bandpass.frequency.value = 900 + Math.random() * 500
            bandpass.Q.value = 4
            const wGain = ctx.createGain()
            wGain.gain.setValueAtTime(0, ctx.currentTime)
            wGain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + dur * 0.4)
            wGain.gain.linearRampToValueAtTime(0, ctx.currentTime + dur)
            src.connect(bandpass)
            bandpass.connect(wGain)
            wGain.connect(masterGain)
            src.start()
          } catch {}
          scheduleWhisper()
        }, t)
        whisperTimeouts.push(id)
      }
      scheduleWhisper()
    } catch {}

    return () => {
      noiseTimeouts.forEach(clearTimeout)
      whisperTimeouts.forEach(clearTimeout)
      const d = droneRef.current
      try {
        d?.osc1.stop()
        d?.osc2.stop()
        d?.sub.stop()
        d?.lfo.stop()
        audioCtxRef.current?.close()
      } catch {}
    }
  }, [])

  // ---- Irregular light flicker ----
  useEffect(() => {
    let timeoutId
    const cycle = () => {
      const wait = 600 + Math.random() * 1800
      timeoutId = setTimeout(() => {
        setFlicker(true)
        setTimeout(() => setFlicker(false), 40 + Math.random() * 90)
        cycle()
      }, wait)
    }
    cycle()
    return () => clearTimeout(timeoutId)
  }, [])

  // ---- Title glitch bursts ----
  useEffect(() => {
    let timeoutId
    const cycle = () => {
      const wait = 2500 + Math.random() * 4000
      timeoutId = setTimeout(() => {
        setGlitching(true)
        setTimeout(() => setGlitching(false), 180 + Math.random() * 200)
        cycle()
      }, wait)
    }
    cycle()
    return () => clearTimeout(timeoutId)
  }, [])

  // ---- Rare full screen shake ----
  useEffect(() => {
    let timeoutId
    const cycle = () => {
      const wait = 5000 + Math.random() * 6000
      timeoutId = setTimeout(() => {
        setShake(true)
        setTimeout(() => setShake(false), 250)
        cycle()
      }, wait)
    }
    cycle()
    return () => clearTimeout(timeoutId)
  }, [])

  // ---- Subliminal single-frame word flashes in the corners ----
  useEffect(() => {
    let timeoutId
    const cycle = () => {
      const wait = 3000 + Math.random() * 5000
      timeoutId = setTimeout(() => {
        const word = SUBLIMINAL_WORDS[Math.floor(Math.random() * SUBLIMINAL_WORDS.length)]
        const corner = Math.floor(Math.random() * 4)
        setSubliminal({ word, corner })
        setTimeout(() => setSubliminal(null), 60) // single-frame flash
        cycle()
      }, wait)
    }
    cycle()
    return () => clearTimeout(timeoutId)
  }, [])

  // ---- Film grain / static canvas ----
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      const imgData = ctx.createImageData(w, h)
      const buf = imgData.data
      for (let i = 0; i < buf.length; i += 4) {
        const v = Math.random() * 255
        buf[i] = v
        buf[i + 1] = v
        buf[i + 2] = v
        buf[i + 3] = 14
      }
      ctx.putImageData(imgData, 0, 0)
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // ---- The button "flinches" away from the cursor, twice, then gives up and stays put ----
  const handleButtonMouseEnter = useCallback(() => {
    setHeld(true)
    if (dodgeCountRef.current >= 2) return // after two dodges, it always stays
    dodgeCountRef.current += 1
    const dx = (Math.random() - 0.5) * 90
    const dy = (Math.random() - 0.5) * 30
    setBtnOffset({ x: dx, y: dy })
    // settle back after a beat, like it's reluctantly giving in
    setTimeout(() => setBtnOffset({ x: 0, y: 0 }), 260)
  }, [])

  const handleButtonMouseLeave = useCallback(() => {
    setHeld(false)
  }, [])

  const handleContinue = useCallback(() => {
    if (leaving) return
    setLeaving(true)
    const d = droneRef.current
    if (d && audioCtxRef.current) {
      d.masterGain.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 0.5)
    }
    setTimeout(onEnter, 500)
  }, [leaving, onEnter])

  const cornerClass = {
    0: 'top-6 left-6',
    1: 'top-6 right-6',
    2: 'bottom-6 left-6',
    3: 'bottom-6 right-6',
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden transition-opacity duration-500 ${
        leaving ? 'opacity-0 pointer-events-none' : 'opacity-100'
      } ${flicker ? 'brightness-[0.75]' : 'brightness-100'} ${shake ? 'landing-shake' : ''}`}
    >
      <style>{`
        @keyframes landingShake {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-2px, 1px); }
          40% { transform: translate(2px, -1px); }
          60% { transform: translate(-1px, 2px); }
          80% { transform: translate(1px, -2px); }
        }
        .landing-shake { animation: landingShake 0.25s linear infinite; }

        @keyframes redSweep {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.4; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .landing-sweep {
          position: absolute;
          left: 0; right: 0;
          height: 40vh;
          background: linear-gradient(to bottom, transparent, rgba(153,27,27,0.12), transparent);
          animation: redSweep 9s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes glitchShift {
          0% { clip-path: inset(0 0 90% 0); transform: translate(0,0); }
          20% { clip-path: inset(10% 0 60% 0); transform: translate(-3px, 0); }
          40% { clip-path: inset(40% 0 30% 0); transform: translate(3px, 0); }
          60% { clip-path: inset(70% 0 5% 0); transform: translate(-2px, 0); }
          80% { clip-path: inset(20% 0 50% 0); transform: translate(2px, 0); }
          100% { clip-path: inset(0 0 90% 0); transform: translate(0,0); }
        }
        .glitch-layer {
          position: absolute;
          top: 0; left: 0; width: 100%;
          animation: glitchShift 0.35s steps(2, end) infinite;
        }

        .scanlines::before {
          content: "";
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            to bottom,
            rgba(0,0,0,0.25) 0px,
            rgba(0,0,0,0.25) 1px,
            transparent 1px,
            transparent 3px
          );
          pointer-events: none;
          mix-blend-mode: multiply;
        }

        .vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.85) 100%),
                      radial-gradient(ellipse at center, rgba(120,0,0,0.08) 0%, transparent 60%);
          pointer-events: none;
        }

        .continue-btn {
          transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes corruptText {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
        .corrupt-word {
          display: inline-block;
          animation: corruptText 2.4s ease-in-out infinite;
        }
      `}</style>

      {/* film grain */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen" />

      {/* scanlines + vignette */}
      <div className="scanlines pointer-events-none absolute inset-0" />
      <div className={`vignette transition-opacity duration-700 ${held ? 'opacity-100' : 'opacity-90'}`} />

      {/* slow red light sweep */}
      <div className="landing-sweep" />

      {/* subliminal single-frame flash */}
      {subliminal && (
        <span
          className={`pointer-events-none absolute ${cornerClass[subliminal.corner]} font-mono text-xs tracking-widest text-red-600`}
          style={{ opacity: 0.9 }}
        >
          {subliminal.word}
        </span>
      )}

      {/* when hovering the button, everything else dims — a held breath */}
      <div
        className={`relative max-w-md space-y-6 px-6 text-center transition-[filter] duration-500 ${
          held ? '' : ''
        }`}
      >
        <p
          className={`text-sm uppercase tracking-[0.35em] text-red-700 animate-pulse transition-opacity duration-500 ${
            held ? 'opacity-40' : 'opacity-100'
          }`}
        >
          Warning
        </p>

        <h1
          className={`relative text-2xl font-bold text-red-500 sm:text-4xl transition-opacity duration-500 ${
            held ? 'opacity-60' : 'opacity-100'
          }`}
          style={{ textShadow: '0 0 18px rgba(185,28,28,0.35)' }}
        >
          <span className="relative inline-block">
            What comes next cannot be <span className="corrupt-word">undone</span>
            {glitching && (
              <>
                <span
                  aria-hidden="true"
                  className="glitch-layer text-cyan-400"
                  style={{ transform: 'translate(-2px,0)', mixBlendMode: 'screen' }}
                >
                  What comes next cannot be undone
                </span>
                <span
                  aria-hidden="true"
                  className="glitch-layer text-red-600"
                  style={{ transform: 'translate(2px,0)', mixBlendMode: 'screen' }}
                >
                  What comes next cannot be undone
                </span>
              </>
            )}
          </span>
        </h1>

        <p
          className={`text-sm text-neutral-400 sm:text-base transition-opacity duration-500 ${
            held ? 'opacity-40' : 'opacity-100'
          }`}
        >
          Proceed only if you are prepared for what waits on the other side.
        </p>

        <button
          ref={btnRef}
          onClick={handleContinue}
          onMouseEnter={handleButtonMouseEnter}
          onMouseLeave={handleButtonMouseLeave}
          disabled={leaving}
          style={{ transform: `translate(${btnOffset.x}px, ${btnOffset.y}px)` }}
          className="continue-btn group relative mt-4 overflow-hidden rounded border border-red-800 bg-red-950/40 px-6 py-2 text-sm uppercase tracking-widest text-red-400 transition-colors hover:bg-red-900/60 hover:text-red-200 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <span className="relative z-10">I understand — continue</span>
          <span className="absolute inset-0 -translate-x-full bg-red-800/20 transition-transform duration-700 group-hover:translate-x-0" />
        </button>
      </div>
    </div>
  )
}