import { useEffect, useRef } from 'react'

const SYMBOLS = ['✨', '❤️', '🎈', '🎉', '🎂', '🌟', '🌸']

export default function CursorTrail() {
  const containerRef = useRef(null)
  const lastSpawn = useRef(0)

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (isTouch) return

    const handleMove = (e) => {
      const now = Date.now()
      // Decreased spawning cooldown (from 50ms to 25ms) for a continuous, snappy stream
      if (now - lastSpawn.current < 25) return
      lastSpawn.current = now

      const el = document.createElement('span')
      
      const scaleStart = 0.9 + Math.random() * 0.4
      const driftX = (Math.random() - 0.5) * 40
      const driftY = -40 - Math.random() * 30  // Shortened vertical distance
      const spinAngle = (Math.random() - 0.5) * 90

      el.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
      el.style.position = 'fixed'
      el.style.left = `${e.clientX}px`
      el.style.top = `${e.clientY}px`
      el.style.pointerEvents = 'none'
      el.style.fontSize = `${14 + Math.random() * 8}px`
      el.style.zIndex = '9999'
      el.style.filter = 'drop-shadow(0 2px 6px rgba(245, 158, 11, 0.25))'
      
      el.style.transform = `translate(-50%, -50%) scale(${scaleStart}) rotate(0deg)`
      el.style.opacity = '1'
      // Decreased transition duration (from 0.9s to 0.45s) for quick fading
      el.style.transition = 'transform 0.45s cubic-bezier(0.1, 0.8, 0.25, 1), opacity 0.45s cubic-bezier(0.1, 0.8, 0.25, 1)'
      
      containerRef.current?.appendChild(el)

      requestAnimationFrame(() => {
        el.style.transform = `translate(calc(-50% + ${driftX}px), calc(-50% + ${driftY}px)) scale(0.3) rotate(${spinAngle}deg)`
        el.style.opacity = '0'
      })

      // Decreased cleanup time to match the new lifespan
      setTimeout(() => el.remove(), 450)
    }

    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return <div ref={containerRef} className="pointer-events-none fixed inset-0 z-[9999]" />
}