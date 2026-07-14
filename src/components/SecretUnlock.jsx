import { useState } from 'react'
import confetti from 'canvas-confetti'
import { site } from '../config'
import SectionHeading from './SectionHeading'

export default function SecretUnlock() {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('idle') // idle | wrong | unlocked

  const submit = (e) => {
    e.preventDefault()
    if (value.trim().toLowerCase() === site.secretPassword.answer.toLowerCase()) {
      setStatus('unlocked')
      confetti({ particleCount: 130, spread: 100, origin: { y: 0.5 } })
    } else {
      setStatus('wrong')
    }
  }

  return (
    <section className="px-6 py-24">
      <SectionHeading eyebrow="one last lock" title="Enter the secret password" subtitle={site.secretPassword.hint} />
      <div className="mx-auto max-w-sm">
        {status !== 'unlocked' ? (
          <form onSubmit={submit} className="flex gap-2">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Type here…"
              className="flex-1 rounded-full border border-cream-100/20 bg-night-900/60 px-5 py-3 font-body text-cream-100 placeholder:text-cream-100/30 focus:border-gold-400 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-gold-400 px-5 py-3 font-semibold text-night-950 transition-transform hover:scale-105"
            >
              Unlock
            </button>
          </form>
        ) : (
          <p className="text-center font-display text-xl text-gold-300">{site.secretPassword.unlockedMessage}</p>
        )}
        {status === 'wrong' && (
          <p className="mt-3 text-center font-body text-sm text-rose-300">Not quite — try again.</p>
        )}
      </div>
    </section>
  )
}
