import { useState } from 'react'
import confetti from 'canvas-confetti'
import { site } from '../config'
import SectionHeading from './SectionHeading'

function GiftBox({ gift }) {
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    if (open) return
    setOpen(true)
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } })
  }

  return (
    <button
      onClick={handleOpen}
      className={`flex min-h-[11rem] flex-col items-center justify-center rounded-2xl border border-cream-100/10 p-6 text-center transition-all duration-500 ${
        open ? 'bg-gradient-to-br from-rose-400/20 to-gold-400/20' : 'bg-night-900/60 hover:scale-105'
      }`}
    >
      {!open ? (
        <>
          <span className="text-5xl">{gift.emoji}</span>
          <span className="mt-3 font-body text-sm text-cream-100/60">{gift.title}</span>
        </>
      ) : (
        <p className="font-hand text-xl text-cream-100">{gift.message}</p>
      )}
    </button>
  )
}

export default function GiftBoxes() {
  return (
    <section className="px-6 py-24">
      <SectionHeading eyebrow="pick a box" title="A few small gifts" />
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
        {site.gifts.map((g, i) => (
          <GiftBox key={i} gift={g} />
        ))}
      </div>
    </section>
  )
}
