import { site } from '../config'
import SectionHeading from './SectionHeading'

export default function UsBears() {
  if (!site.bears?.length) return null

  return (
    <section className="px-6 py-24">
      <SectionHeading eyebrow="just us" title="You and me" />
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
        {site.bears.map((b, i) => (
          <div
            key={i}
            className="flex flex-col items-center rounded-2xl border border-cream-100/10 bg-night-900/50 p-4 backdrop-blur"
          >
            <img
              src={b.src}
              alt={b.caption}
              className="h-40 w-40 rounded-xl object-contain sm:h-44 sm:w-44"
            />

          </div>
        ))}
      </div>
    </section>
  )
}
