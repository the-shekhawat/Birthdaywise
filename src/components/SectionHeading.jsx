export default function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      {eyebrow && (
        <p className="mb-3 font-hand text-xl text-gold-300 sm:text-2xl">{eyebrow}</p>
      )}
      <h2 className="font-display text-3xl font-bold text-cream-100 sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 font-body text-cream-100/60">{subtitle}</p>}
    </div>
  )
}
