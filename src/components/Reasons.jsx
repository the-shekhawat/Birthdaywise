import { useState } from 'react'
import { site } from '../config'
import SectionHeading from './SectionHeading'

function FlipCard({ index, reason }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <button
      onClick={() => setFlipped((f) => !f)}
      className="group h-40 [perspective:1000px]"
      style={{ perspective: '1000px' }}
    >
      <div
        className="relative h-full w-full rounded-2xl transition-transform duration-500 [transform-style:preserve-3d]"
        style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-cream-100/10 bg-night-900/60 p-4 backdrop-blur [backface-visibility:hidden]"
        >
          <span className="font-display text-lg font-bold text-gold-300">Reason {index + 1}</span>
          <span className="mt-2 text-2xl">❤️</span>
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-gold-400 p-4 text-center [backface-visibility:hidden]"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <p className="font-body text-sm font-semibold text-night-950">{reason}</p>
        </div>
      </div>
    </button>
  )
}

export default function Reasons() {
  return (
    <section className="px-6 py-24">
      <SectionHeading
        eyebrow="tap a card"
        title={`${site.reasons.length} Reasons You're Amazing`}
        subtitle="Flip each card — there's a reason waiting behind it."
      />
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {site.reasons.map((reason, i) => (
          <FlipCard key={i} index={i} reason={reason} />
        ))}
      </div>
    </section>
  )
}
