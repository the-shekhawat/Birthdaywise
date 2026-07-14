import { useMemo } from 'react'

// A quiet, persistent night sky: layered twinkling stars, a soft drifting
// glow, and one slow shooting star. Sits behind every section via fixed
// positioning. Respects prefers-reduced-motion.

function seededRandom(seed) {
  let value = seed
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

export default function StarsBackground() {
  const stars = useMemo(() => {
    const rand = seededRandom(42)

    // Three depth layers: small/dim/slow far stars, mid stars, and a few
    // bright near "hero" stars that catch the eye without being busy.
    const layers = [
      { count: 55, sizeRange: [0.6, 1.2], opacityRange: [0.25, 0.5], durationRange: [3, 6] },
      { count: 28, sizeRange: [1.1, 1.9], opacityRange: [0.4, 0.75], durationRange: [2.5, 4.5] },
      { count: 9, sizeRange: [1.8, 2.6], opacityRange: [0.7, 1], durationRange: [2, 3.5] },
    ]

    let id = 0
    return layers.flatMap((layer) =>
      Array.from({ length: layer.count }).map(() => ({
        id: id++,
        top: rand() * 100,
        left: rand() * 100,
        size: layer.sizeRange[0] + rand() * (layer.sizeRange[1] - layer.sizeRange[0]),
        baseOpacity: layer.opacityRange[0] + rand() * (layer.opacityRange[1] - layer.opacityRange[0]),
        delay: rand() * 5,
        duration: layer.durationRange[0] + rand() * (layer.durationRange[1] - layer.durationRange[0]),
        glow: layer.sizeRange[1] > 2,
      }))
    )
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-night-950 via-[#2b0f30] to-[#4a1a38]">
      <style>{`
        @keyframes star-twinkle {
          0%, 100% { opacity: var(--base-opacity); transform: scale(1); }
          50% { opacity: calc(var(--base-opacity) * 0.35); transform: scale(0.85); }
        }
        @keyframes cloud-drift {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(2%, -3%) scale(1.05); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes shooting-star {
          0% { transform: translate(0, 0) rotate(35deg); opacity: 0; }
          5% { opacity: 1; }
          20% { opacity: 0; }
          100% { transform: translate(-380px, 260px) rotate(35deg); opacity: 0; }
        }
        .star-twinkle { animation: star-twinkle ease-in-out infinite; }
        .cloud-drift { animation: cloud-drift ease-in-out infinite; }
        .shooting-star { animation: shooting-star 7s ease-in cubic-bezier(0.3, 0, 0.7, 1) infinite; animation-delay: 4s; }
        @media (prefers-reduced-motion: reduce) {
          .star-twinkle, .cloud-drift, .shooting-star { animation: none !important; opacity: var(--base-opacity, 0.6) !important; }
        }
      `}</style>

      {stars.map((s) => (
        <span
          key={s.id}
          className="star-twinkle absolute rounded-full bg-cream-100"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            '--base-opacity': s.baseOpacity,
            opacity: s.baseOpacity,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            boxShadow: s.glow ? '0 0 4px 1px rgba(255,250,235,0.6)' : undefined,
          }}
        />
      ))}

      <span
        className="shooting-star absolute h-px w-24 rounded-full"
        style={{
          top: '14%',
          left: '68%',
          background: 'linear-gradient(90deg, rgba(255,250,235,0.9), rgba(255,250,235,0))',
        }}
      />

      <div className="cloud-drift absolute -top-24 -left-24 h-80 w-80 rounded-full bg-rose-500/25 blur-3xl" />
      <div
        className="cloud-drift absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-rose-400/20 blur-3xl"
        style={{ animationDelay: '2.5s', animationDuration: '9s' }}
      />
      <div
        className="cloud-drift absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-rose-300/15 blur-3xl"
        style={{ animationDelay: '1.2s', animationDuration: '10s' }}
      />

      {/* Subtle vignette to anchor content and add depth toward the edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_45%,_rgba(0,0,0,0.35)_100%)]" />
    </div>
  )
}