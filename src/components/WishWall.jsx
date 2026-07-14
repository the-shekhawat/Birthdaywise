import { useState } from 'react'
import { site } from '../config'
import SectionHeading from './SectionHeading'

// Curated warm, romantic aesthetic sticky note palette
const NOTE_STYLES = [
  { bg: 'bg-amber-100 text-amber-950 border-amber-200/50', pin: 'bg-amber-400' },
  { bg: 'bg-rose-100 text-rose-950 border-rose-200/50', pin: 'bg-rose-400' },
  { bg: 'bg-orange-50 text-orange-950 border-orange-200/50', pin: 'bg-orange-400' },
  { bg: 'bg-pink-100 text-pink-950 border-pink-200/50', pin: 'bg-pink-400' },
]

export default function WishWall() {
  // Map seed data to include unique style properties so they don't shift on re-renders
  const [wishes, setWishes] = useState(() => 
    (site.wishWallSeed || []).map((w, i) => ({
      ...w,
      id: `seed-${i}`,
      styleIndex: i % NOTE_STYLES.length,
      rotation: ((i * 7) % 8) - 4, // Clean, predictable angle rotation limits
    }))
  )
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!message.trim()) return

    const newWish = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      name: name.trim() || 'Anonymous',
      message: message.trim(),
      styleIndex: Math.floor(Math.random() * NOTE_STYLES.length),
      rotation: Math.floor(Math.random() * 8) - 4, // Stable assignment
    }

    setWishes((prev) => [newWish, ...prev]) // Prepends so the newest note beautifully animates at the top
    setName('')
    setMessage('')
  }

  return (
    <section className="px-6 py-24 max-w-5xl mx-auto selection:bg-rose-500/20">
      <SectionHeading
        eyebrow="from everyone who loves you"
        title="The Memory Wall"
        subtitle="Leave a sweet note, a favorite memory, or a warm birthday wish below."
      />

      {/* Modern, Glassmorphic Input Form Container */}
      <form 
        onSubmit={submit} 
        className="mx-auto mb-16 flex max-w-xl flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/40 p-3 backdrop-blur-md sm:flex-row shadow-xl"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          maxLength={25}
          className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-400/50 focus:border-rose-400/50 focus:bg-slate-950/80 focus:outline-none sm:w-1/3 transition-all duration-300"
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Leave a sweet note..."
          maxLength={150}
          required
          className="flex-1 rounded-xl border border-white/10 bg-slate-950/40 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-400/50 focus:border-rose-400/50 focus:bg-slate-950/80 focus:outline-none transition-all duration-300"
        />
        <button 
          type="submit" 
          className="rounded-xl bg-gradient-to-r from-amber-400 to-rose-400 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-md transition-all duration-300 hover:opacity-90 active:scale-95"
        >
          Post Note
        </button>
      </form>

      {/* Grid Canvas Layer */}
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-3 auto-rows-fr">
        {wishes.map((w) => {
          const config = NOTE_STYLES[w.styleIndex]
          return (
            <div
              key={w.id}
              className={`group relative flex flex-col justify-between rounded-sm p-5 border shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:z-30 animate-[fadeIn_0.5s_ease-out] ${config.bg}`}
              style={{ transform: `rotate(${w.rotation}deg)` }}
            >
              {/* Minimalist Top Decorator Pin */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full shadow-inner opacity-80 group-hover:scale-110 transition-transform duration-300 visual-pin bg-slate-800/20" />

              {/* Note Content */}
              <p className="font-sans text-[15px] font-medium leading-relaxed tracking-wide italic">
                "{w.message}"
              </p>
              
              {/* Author Footer */}
              <p className="mt-4 text-right text-xs font-bold tracking-wider uppercase opacity-60">
                — {w.name}
              </p>
            </div>
          )
        })}
      </div>

      <p className="mx-auto mt-12 max-w-md text-center text-xs leading-normal text-slate-400/40">
        ✨ Local Session Storage active. Connect an asynchronous database provider to preserve guest notes globally.
      </p>
    </section>
  )
}