export default function FatalMistake({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-8 rounded-xl border-2 border-bear-red/60 bg-bear-red/5 p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-bear-red text-2xl" aria-hidden="true">❌</span>
        <span className="text-sm uppercase tracking-wider text-bear-red font-head font-bold">The Fatal Mistake</span>
      </div>
      <p className="text-text-primary leading-relaxed">{children}</p>
    </div>
  )
}
