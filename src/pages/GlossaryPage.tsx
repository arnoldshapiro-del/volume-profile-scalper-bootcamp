import { GLOSSARY } from '../data/glossary'

export default function GlossaryPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-head text-4xl font-bold mb-2">Glossary</h1>
      <p className="text-text-secondary mb-8">Every term used in the bootcamp, with the lesson where it's introduced.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {GLOSSARY.map((g) => (
          <div key={g.term} className="card">
            <div className="flex items-baseline justify-between mb-1">
              <h3 className="font-head font-bold text-lg text-poc-gold">{g.term}</h3>
              <span className="text-[10px] font-mono text-text-muted">{g.lesson}</span>
            </div>
            <div className="text-xs text-text-muted mb-2">{g.short}</div>
            <p className="text-sm text-text-primary leading-relaxed">{g.definition}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
