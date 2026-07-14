import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { site } from '../config'

export default function Finale() {
  useEffect(() => {
    const id = setInterval(() => {
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      })
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      })
    }, 2200)
    return () => clearInterval(id)
  }, [])

  const burst = (e) => {
    const x = e.clientX / window.innerWidth
    const y = e.clientY / window.innerHeight
    confetti({ particleCount: 70, spread: 80, origin: { x, y } })
  }

  return (
    <section
      onClick={burst}
      className="relative flex min-h-screen cursor-pointer flex-col items-center justify-center px-6 text-center"
    >
      {site.bears?.[0] && (
        <img
          src={site.bears[0].src}
          alt=""
          className="mb-6 h-32 w-32 object-contain sm:h-40 sm:w-40"
        />
      )}
      <p className="font-hand text-3xl text-gold-300 sm:text-4xl">{site.finalMessage}</p>
      <h2 className="mt-4 font-display text-4xl font-bold text-cream-100 text-shadow-glow sm:text-6xl">
        Happy Birthday, {site.personName} 🎉
      </h2>
      <p className="mt-8 font-body text-xs uppercase tracking-[0.3em] text-cream-100/40">
        click anywhere for fireworks
      </p>
    </section>
  )
}
