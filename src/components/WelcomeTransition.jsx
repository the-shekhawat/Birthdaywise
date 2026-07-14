import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'

export default function WelcomeTransition({ onDone }) {
  const [opening, setOpening] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setOpening(true), 150)
    const t2 = setTimeout(() => {
      confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } })
    }, 500)
    const t3 = setTimeout(onDone, 1500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [onDone])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-night-950">
      <div
        className={`absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-rose-500 to-rose-400 transition-transform duration-[1200ms] ease-in-out ${
          opening ? '-translate-x-full' : 'translate-x-0'
        }`}
      />
      <div
        className={`absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-gold-500 to-gold-400 transition-transform duration-[1200ms] ease-in-out ${
          opening ? 'translate-x-full' : 'translate-x-0'
        }`}
      />
      <p className="relative z-10 font-display text-3xl font-bold text-night-950 sm:text-5xl">
        Surprise incoming…
      </p>
    </div>
  )
}
