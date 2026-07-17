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

  const rotations = useMemo(() => PHOTOS.map(() => Math.random() * 8 - 4), [])

  const applyMotion = (clientX, clientY, currentTarget, id) => {
    const box = currentTarget.getBoundingClientRect()
    const xPct = (clientX - box.left) / box.width
    const yPct = (clientY - box.top) / box.height
    
    const rotateX = (0.5 - yPct) * 12
    const rotateY = (xPct - 0.5) * 12

    setTiltStyles({
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`,
      zIndex: 40,
      boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)'
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
    <section className="relative px-4 sm:px-8 py-16 sm:py-24 max-w-5xl mx-auto overflow-hidden">
      <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Playfair+Display:ital,wght=0,500;1,400&display=swap" rel="stylesheet" />

      <style>{`
        .handwritten-polaroid { font-family: 'Caveat', cursive; }
        
        @keyframes subtleFadeIn {
          0% { opacity: 0; transform: scale(0.97); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-lightbox {
          animation: subtleFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <SectionHeading 
        eyebrow="memory gallery" 
        
      />

      <div className="mx-auto grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl [transform-style:preserve-3d]">
        {PHOTOS.map((p, i) => {
          const isTilting = activeTiltId === i
          return (
            <button
              key={i}
              onClick={() => setActive(p)}
              onMouseMove={(e) => handlePointerMove(e, i)}
              onMouseLeave={resetMotion}
              onTouchMove={(e) => handleTouchMove(e, i)}
              onTouchEnd={resetMotion}
              className={`group relative rounded bg-white p-3 pb-6 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] border border-neutral-100 ease-out select-none
                ${isTilting ? 'transition-none' : 'transition-all duration-300'}`}
              style={{
                transform: isTilting 
                  ? tiltStyles.transform 
                  : `rotate(${rotations[i]}deg) translateZ(0)`,
                boxShadow: isTilting ? tiltStyles.boxShadow : undefined,
                zIndex: isTilting ? tiltStyles.zIndex : undefined
              }}
            >
              {/* Image Frame Container — Switch to object-contain for full, uncropped visibility */}
              <div 
                className="overflow-hidden bg-neutral-950/5 rounded border border-neutral-100/30 aspect-[4/3] w-full flex items-center justify-center relative"
                style={{
                  transform: isTilting ? 'translateZ(8px)' : 'translateZ(0)',
                  transition: isTilting ? 'none' : 'transform 0.3s ease-out'
                }}
              >
                {/* Blurred background aesthetic to dynamically match image bounds for extreme landscape/portrait shapes */}
                <img 
                  src={p.src} 
                  alt="" 
                  className="absolute inset-0 h-full w-full object-cover blur-md opacity-25 scale-110 pointer-events-none" 
                />
                
                {/* Crisp non-cropped front image */}
                <img 
                  src={p.src} 
                  alt={p.caption} 
                  className="relative h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02] pointer-events-none z-10" 
                />
              </div>
              
              <p 
                className="handwritten-polaroid mt-3.5 text-center text-xl sm:text-2xl text-neutral-800 tracking-wide pointer-events-none"
                style={{
                  transform: isTilting ? 'translateZ(12px)' : 'translateZ(0)',
                  transition: isTilting ? 'none' : 'transform 0.3s ease-out'
                }}
              >
               
              </p>
            </button>
          )
        })}
      </div>

      {/* Cinematic Lightbox overlay */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/95 p-4 sm:p-6 backdrop-blur-md cursor-zoom-out animate-lightbox"
          onClick={() => setActive(null)}
        >
          <div 
            className="relative rounded bg-white p-4 pb-8 sm:pb-10 shadow-2xl max-w-2xl w-full mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setActive(null)}
              className="absolute top-2 right-3 text-neutral-400 hover:text-neutral-800 transition-colors duration-200 text-xs font-sans uppercase tracking-wider font-semibold"
            >
              ✕ Close
            </button>

            {/* Lightbox containment container — adapts seamlessly to portrait and landscape constraints */}
            <div className="overflow-hidden rounded border border-neutral-100 bg-neutral-950/10 w-full max-h-[60vh] flex items-center justify-center relative">
              <img 
                src={active.src} 
                alt="" 
                className="absolute inset-0 h-full w-full object-cover blur-lg opacity-30 pointer-events-none" 
              />
              <img 
                src={active.src} 
                alt={active.caption} 
                className="relative max-h-[60vh] max-w-full object-contain z-10 shadow-md" 
              />
            </div>
            
            <p className="handwritten-polaroid mt-4 text-center text-2xl sm:text-3xl text-neutral-800 leading-none">
              {active.caption}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}