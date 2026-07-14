import { useState } from 'react'
import confetti from 'canvas-confetti'
import { site } from '../config'
import SectionHeading from './SectionHeading'

export default function Quiz() {
  const [selected, setSelected] = useState(null)

  const handleSelect = (i) => {
    setSelected(i)
    if (i === site.quiz.correctIndex) {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } })
    }
  }

  return (
    <section className="px-6 py-24">
      <SectionHeading eyebrow="pop quiz" title={site.quiz.question} />
      <div className="mx-auto grid max-w-md grid-cols-2 gap-4">
        {site.quiz.options.map((opt, i) => {
          const isCorrect = selected !== null && i === site.quiz.correctIndex
          const isWrong = selected === i && i !== site.quiz.correctIndex
          return (
            <button
              key={opt}
              onClick={() => handleSelect(i)}
              className={`rounded-xl border p-4 font-body font-semibold transition-all ${
                isCorrect
                  ? 'border-gold-400 bg-gold-400/20 text-gold-300'
                  : isWrong
                  ? 'border-rose-500/40 bg-rose-500/10 text-rose-300 line-through'
                  : 'border-cream-100/10 bg-night-900/60 text-cream-100 hover:scale-105'
              }`}
            >
              {opt}
            </button>
          )
        })}
      </div>
      {selected !== null && (
        <p className="mt-6 text-center font-display text-2xl text-gold-300">
          {selected === site.quiz.correctIndex ? site.quiz.correctMessage : 'Try again ☺'}
        </p>
      )}
    </section>
  )
}
