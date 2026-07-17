import { site } from '../config'
import SectionHeading from './SectionHeading'

export default function UsBears() {
  if (!site.bears?.length) return null

  return (
    <section className="relative px-6 py-24 sm:py-32 bg-transparent">
      {/* Standard luxury serif font import */}
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet" />

      <div className="relative z-10">
        <SectionHeading eyebrow="curated archive" title="You & Me" />
      </div>

      {/* Modern Minimal Grid */}
      <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3">
        {site.bears.map((b, i) => (
          <div
            key={i}
            className="group flex flex-col justify-between bg-transparent transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            {/* Elegant Picture Outer Case - Now Rounded */}
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50/50 p-6 transition-all duration-500 ease-out group-hover:border-neutral-400 group-hover:bg-neutral-50 shadow-sm hover:shadow-md">
              
              {/* Discrete Corner Crosshairs (Shifted slightly inward to match the rounded curves) */}
              <div className="absolute top-4 left-4 w-1.5 h-1.5 border-t border-l border-neutral-300 transition-colors duration-300 group-hover:border-neutral-400" />
              <div className="absolute top-4 right-4 w-1.5 h-1.5 border-t border-r border-neutral-300 transition-colors duration-300 group-hover:border-neutral-400" />
              <div className="absolute bottom-4 left-4 w-1.5 h-1.5 border-b border-l border-neutral-300 transition-colors duration-300 group-hover:border-neutral-400" />
              <div className="absolute bottom-4 right-4 w-1.5 h-1.5 border-b border-r border-neutral-300 transition-colors duration-300 group-hover:border-neutral-400" />

              {/* Central Bounded Image Display - Rounded to match */}
              <div className="w-full h-full flex items-center justify-center relative overflow-hidden rounded-xl">
                <img
                  src={b.src}
                  alt={b.caption || "Archive showcase item"}
                  className="max-h-full max-w-full object-contain grayscale-[20%] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] scale-[0.96] group-hover:scale-100 group-hover:grayscale-0"
                  loading="lazy"
                />
              </div>
            </div>

            {/* High-End Clean Typography Label Block */}
            {b.caption && (
              <div className="w-full pt-4 pb-2 text-left select-none px-2">
                {/* Micro Index Tracker */}
                <div className="text-[9px] font-mono tracking-[0.25em] text-neutral-400 uppercase font-medium">
                  
                </div>
                
                <p 
                  className="mt-1 text-base font-medium tracking-wide text-neutral-800 transition-colors duration-300 group-hover:text-neutral-950"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                 
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}