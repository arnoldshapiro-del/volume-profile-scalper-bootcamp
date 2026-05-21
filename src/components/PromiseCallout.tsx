export default function PromiseCallout({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-xl border border-hvn-teal/40 bg-hvn-teal/5 p-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-hvn-teal text-xl">🎯</span>
        <span className="text-xs uppercase tracking-wider text-hvn-teal font-mono font-bold">The Promise</span>
      </div>
      <p className="italic text-text-primary leading-relaxed">{children}</p>
    </div>
  )
}
