import { useMemo, useState } from 'react'
import SectionHeading from './SectionHeading'

const PHOTOS = [
  { src: '/images/gallery-1.jpg', caption: 'National Mathematics Day' },
  { src: '/images/gallery-2.jpg', caption: 'Lighting up the sky' },
  { src: '/images/gallery-3.jpg', caption: 'Little me' },
  { src: '/images/gallery-4.jpg', caption: 'Festival night' },
  { src: '/images/gallery-5.jpg', caption: 'Under the fairy lights' },
  { src: '/images/gallery-6.jpg', caption: 'Roses in hand' },
]

export default function Gallery() {
  const [active, setActive] = useState(null)
  const [activeTiltId, setActiveTiltId] = useState(null)
  const [tiltStyles, setTiltStyles] = useState({})

  const photoModifiers = useMemo(() => 
    PHOTOS.map(() => ({
      rotate: Math.random() * 6 - 3, 
      tapeX: Math.random() * 20 - 10,
      tapeRotate: Math.random() * 6 - 3
    })), 
    []
  )

  const applyMotion = (clientX, clientY, currentTarget, id) => {
    const box = currentTarget.getBoundingClientRect()
    const xPct = (clientX - box.left) / box.width
    const yPct = (clientY - box.top) / box.height
    
    const rotateX = (0.5 - yPct) * 14
    const rotateY = (xPct - 0.5) * 14

    setTiltStyles({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`,
      zIndex: 40,
      boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.2), 0 12px 24px -10px rgba(0, 0, 0, 0.15)'
    })
    setActiveTiltId(id)
  }

  const handlePointerMove = (e, id) => {
    applyMotion(e.clientX, e.clientY, e.currentTarget, id)
  }

  const handleTouchMove = (e, id) => {
    if (!e.touches || e.touches.length === 0) return
    applyMotion(e.touches[0].clientX, e.touches[0].clientY, e.currentTarget, id)
  }

  const resetMotion = () => {
    setActiveTiltId(null)
    setTiltStyles({})
  }

  return (
    <section className="relative px-6 sm:px-12 py-20 sm:py-32 max-w-6xl mx-auto overflow-hidden bg-neutral-50/30">
      <link href="https://fonts.googleapis.com/css2?family=Caveat:wght(500;600;700)&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" />

      <style>{`
        .handwritten-polaroid { 
          font-family: 'Caveat', cursive; 
          font-weight: 600;
        }
        
        @keyframes premiumFadeIn {
          0% { opacity: 0; transform: scale(0.96) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-lightbox {
          animation: premiumFadeIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>

      <SectionHeading 
        eyebrow="memory gallery" 
        title="Captured Moments"
      />

      <div className="mx-auto grid grid-cols-1 gap-y-14 gap-x-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl [transform-style:preserve-3d] mt-12">
        {PHOTOS.map((p, i) => {
          const isTilting = activeTiltId === i
          const modifiers = photoModifiers[i]
          
          return (
            <button
              key={i}
              onClick={() => setActive(p)}
              onMouseMove={(e) => handlePointerMove(e, i)}
              onMouseLeave={resetMotion}
              onTouchMove={(e) => handleTouchMove(e, i)}
              onTouchEnd={resetMotion}
              className={`group relative rounded-sm bg-white p-4 pb-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] border border-neutral-200/80 ease-out select-none cursor-zoom-in w-full flex flex-col items-center justify-between
                ${isTilting ? 'transition-none' : 'transition-all duration-500 hover:shadow-2xl'}`}
              style={{
                transform: isTilting 
                  ? tiltStyles.transform 
                  : `rotate(${modifiers.rotate}deg) translateZ(0)`,
                boxShadow: isTilting ? tiltStyles.boxShadow : undefined,
                zIndex: isTilting ? tiltStyles.zIndex : undefined
              }}
            >
              {/* Washi Tape */}
              <div 
                className="absolute -top-3 left-1/2 -translate-x-1/2 h-5 w-20 bg-white/60 backdrop-blur-[2px] border-x border-dashed border-neutral-300/40 shadow-[0_1px_2px_rgba(0,0,0,0.02)] pointer-events-none z-30"
                style={{
                  transform: `translateX(calc(-50% + ${modifiers.tapeX}px)) rotate(${modifiers.tapeRotate}deg)`,
                }}
              />

              {/* Dynamic Aspect Ratio Container */}
              <div 
                className="overflow-hidden bg-neutral-100 rounded-sm w-full relative flex items-center justify-center min-h-[220px] sm:min-h-[260px]"
                style={{
                  transform: isTilting ? 'translateZ(16px)' : 'translateZ(0)',
                  transition: isTilting ? 'none' : 'transform 0.4s ease-out'
                }}
              >
                {/* Fallback Ambient Blur (Only covers blank space for weirdly shaped image files) */}
                <img 
                  src={p.src} 
                  alt="" 
                  className="absolute inset-0 h-full w-full object-cover blur-2xl opacity-15 pointer-events-none" 
                />
                
                {/* Main Clean Image: 100% visible, fully scalable, no clipping */}
                <img 
                  src={p.src} 
                  alt={p.caption} 
                  className="w-full h-auto max-h-[280px] object-contain relative z-10 transition-transform duration-500 ease-out group-hover:scale-[1.01]" 
                />
              </div>
              
              {/* Card Caption Text */}
              <p 
                className="handwritten-polaroid mt-4 text-center text-2xl text-neutral-800 tracking-wide pointer-events-none w-full truncate px-1"
                style={{
                  transform: isTilting ? 'translateZ(24px)' : 'translateZ(0)',
                  transition: isTilting ? 'none' : 'transform 0.4s ease-out'
                }}
              >
              
              </p>
            </button>
          )
        })}
      </div>

      {/* Lightbox Overlay */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/90 p-4 sm:p-8 cursor-zoom-out animate-lightbox backdrop-blur-md"
          onClick={() => setActive(null)}
        >
          <div 
            className="relative rounded-sm bg-white p-4 pb-6 shadow-2xl max-w-3xl w-full mx-auto border border-white/5 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setActive(null)}
              className="absolute -top-8 right-0 text-white/80 hover:text-white transition-colors duration-200 text-xs tracking-widest uppercase font-semibold"
            >
              ✕ Close
            </button>

            {/* Complete Lightbox Display Frame */}
            <div className="overflow-hidden rounded-sm bg-neutral-900/5 w-full flex items-center justify-center relative">
              <img 
                src={active.src} 
                alt={active.caption} 
                className="w-full h-auto max-h-[70vh] object-contain z-10" 
              />
            </div>
            
            {/* Lightbox Caption Text */}
            <p className="handwritten-polaroid mt-4 text-center text-3xl text-neutral-800 tracking-wide w-full px-2">
             
            </p>
          </div>
        </div>
      )}
    </section>
  )
}