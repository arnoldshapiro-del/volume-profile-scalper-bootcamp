export default function Concept({ num, title, children }: { num: number, title: string, children: React.ReactNode }) {
  return (
    <section className="my-8">
      <h3 className="font-head font-semibold text-2xl mb-3 flex items-baseline gap-3">
        <span className="font-mono text-poc-gold text-base">{num.toString().padStart(2, '0')}</span>
        <span>{title}</span>
      </h3>
      <div className="text-text-primary leading-relaxed space-y-3 pl-1">{children}</div>
    </section>
  )
}
