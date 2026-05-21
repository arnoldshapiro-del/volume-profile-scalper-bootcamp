export default function ChartCaption({ id, children }: { id: string, children: React.ReactNode }) {
  return (
    <figcaption className="mt-2 mb-8 text-center text-xs text-text-secondary font-mono">
      <span className="text-poc-gold">{id}</span> · {children}
    </figcaption>
  )
}
