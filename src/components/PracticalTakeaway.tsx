export default function PracticalTakeaway({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-10 rounded-xl border border-poc-gold/40 bg-poc-gold/5 p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-poc-gold text-xl" aria-hidden="true">⚡</span>
        <span className="text-sm uppercase tracking-wider text-poc-gold font-head font-bold">Practical Takeaway</span>
      </div>
      <p className="italic text-text-primary leading-relaxed text-lg">{children}</p>
    </div>
  )
}
