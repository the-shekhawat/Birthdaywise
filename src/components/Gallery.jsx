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

  // Generate stable random rotations and tape positions for an authentic scattered look
  const photoModifiers = useMemo(() => 
    PHOTOS.map(() => ({
      rotate: Math.random() * 6 - 3, // Slightly gentler angles for a premium feel
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
              className={`group relative rounded-sm bg-white p-4 pb-7 shadow-[0_4px_15px_-3px_rgba(0,0,0,0.04),0_10px_30px_-10px_rgba(0,0,0,0.06)] border border-neutral-200/60 ease-out select-none cursor-zoom-in
                ${isTilting ? 'transition-none' : 'transition-all duration-500 hover:shadow-xl'}`}
              style={{
                transform: isTilting 
                  ? tiltStyles.transform 
                  : `rotate(${modifiers.rotate}deg) translateZ(0)`,
                boxShadow: isTilting ? tiltStyles.boxShadow : undefined,
                zIndex: isTilting ? tiltStyles.zIndex : undefined
              }}
            >
              {/* Semi-translucent Washi Tape overlay */}
              <div 
                className="absolute -top-3 left-1/2 -translate-x-1/2 h-5 w-20 bg-white/40 backdrop-blur-[1.5px] border-x border-dashed border-neutral-300/30 shadow-[0_1px_2px_rgba(0,0,0,0.01)] pointer-events-none z-30 opacity-75 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  transform: `translateX(calc(-50% + ${modifiers.tapeX}px)) rotate(${modifiers.tapeRotate}deg)`,
                }}
              />

              {/* Image Container */}
              <div 
                className="overflow-hidden bg-neutral-50 rounded-sm border border-neutral-100 aspect-[4/3] w-full flex items-center justify-center relative"
                style={{
                  transform: isTilting ? 'translateZ(16px)' : 'translateZ(0)',
                  transition: isTilting ? 'none' : 'transform 0.4s ease-out'
                }}
              >
                {/* Soft ambient reflection background */}
                <img 
                  src={p.src} 
                  alt="" 
                  className="absolute inset-0 h-full w-full object-cover blur-xl opacity-20 scale-125 pointer-events-none" 
                />
                
                {/* Main image */}
                <img 
                  src={p.src} 
                  alt={p.caption} 
                  className="relative h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] pointer-events-none z-10" 
                />
              </div>
              
              {/* Polaroids Captions (Fixed) */}
              <p 
                className="handwritten-polaroid mt-4 text-center text-2xl text-neutral-700/90 tracking-wide pointer-events-none select-none"
                style={{
                  transform: isTilting ? 'translateZ(28px)' : 'translateZ(0)',
                  transition: isTilting ? 'none' : 'transform 0.4s ease-out'
                }}
              >
               
              </p>
            </button>
          )
        })}
      </div>

      {/* Cinematic Lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/85 p-4 sm:p-10 cursor-zoom-out animate-lightbox backdrop-blur-md"
          onClick={() => setActive(null)}
        >
          <div 
            className="relative rounded-sm bg-white p-5 pb-10 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.5)] max-w-2xl w-full mx-auto border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setActive(null)}
              className="absolute -top-10 right-0 sm:right-[-4px] text-white/70 hover:text-white transition-colors duration-200 text-xs font-sans tracking-widest uppercase font-medium"
            >
              ✕ Close
            </button>

            <div className="overflow-hidden rounded-sm border border-neutral-100 bg-neutral-50 w-full max-h-[65vh] flex items-center justify-center relative">
              <img 
                src={active.src} 
                alt="" 
                className="absolute inset-0 h-full w-full object-cover blur-2xl opacity-15 pointer-events-none" 
              />
              <img 
                src={active.src} 
                alt={active.caption} 
                className="relative max-h-[65vh] max-w-full object-contain z-10 shadow-sm" 
              />
            </div>
            
            {/* Lightbox Caption (Fixed) */}
            <p className="handwritten-polaroid mt-5 text-center text-3xl sm:text-4xl text-neutral-800 tracking-wide">
             
            </p>
          </div>
        </div>
      )}
    </section>
  )
}