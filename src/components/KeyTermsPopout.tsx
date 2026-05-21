import { GLOSSARY } from '../data/glossary'

interface Props {
  terms?: string[] // term names to filter to
}

export default function KeyTermsPopout({ terms }: Props) {
  const items = terms ? GLOSSARY.filter((g) => terms.includes(g.term)) : GLOSSARY.slice(0, 10)
  return (
    <aside className="hidden xl:block sticky top-6 self-start w-[200px] shrink-0" aria-label="Key terms">
      <div className="rounded-xl border border-border-subtle bg-bg-elevated p-4">
        <div className="text-xs uppercase tracking-wider text-text-secondary mb-3 font-mono">Key Terms</div>
        <ul className="space-y-3">
          {items.map((g) => (
            <li key={g.term}>
              <div className="font-head text-sm font-semibold text-poc-gold leading-tight">{g.term}</div>
              <div className="text-[11px] text-text-muted mb-1">{g.short}</div>
              <div className="text-xs text-text-secondary leading-relaxed">{g.definition}</div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
