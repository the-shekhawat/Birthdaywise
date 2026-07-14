import { useMemo, useState } from 'react'
import SectionHeading from './SectionHeading'

// Swap `emoji` for a real `src` image path once you have photos —
// e.g. { src: '/photos/trip.jpg', caption: 'Goa, 2022' }
const PHOTOS = [
  { emoji: '📷', caption: 'First meet, 2019' },
  { emoji: '🌧️', caption: 'That rainy afternoon' },
  { emoji: '🚗', caption: 'The missed train' },
  { emoji: '🎓', caption: 'Graduation day' },
  { emoji: '🏖️', caption: 'Goa, 2022' },
  { emoji: '🎉', caption: 'Every birthday since' },
]

export default function Gallery() {
  const [active, setActive] = useState(null)
  const rotations = useMemo(() => PHOTOS.map(() => Math.random() * 10 - 5), [])

  return (
    <section className="px-6 py-24">
      <SectionHeading eyebrow="memory gallery" title="Moments worth keeping" />
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-3">
        {PHOTOS.map((p, i) => (
          <button
            key={i}
            onClick={() => setActive(p)}
            className="group rounded-sm bg-cream-100 p-3 pb-8 shadow-xl transition-transform duration-300 hover:z-10 hover:scale-105 hover:rotate-0"
            style={{ transform: `rotate(${rotations[i]}deg)` }}
          >
            <div className="flex h-24 items-center justify-center bg-night-900/5 text-4xl sm:h-32">
              {p.emoji}
            </div>
            <p className="mt-2 text-center font-hand text-lg text-night-900">{p.caption}</p>
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-night-950/90 p-6 backdrop-blur"
          onClick={() => setActive(null)}
        >
          <div className="rounded-sm bg-cream-100 p-6 pb-10 shadow-2xl">
            <div className="flex h-48 w-64 items-center justify-center bg-night-900/5 text-6xl sm:h-64 sm:w-80">
              {active.emoji}
            </div>
            <p className="mt-3 text-center font-hand text-2xl text-night-900">{active.caption}</p>
          </div>
        </div>
      )}
    </section>
  )
}
