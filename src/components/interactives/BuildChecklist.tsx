import { useState } from 'react'
import { useChecklist } from '../../hooks/useChecklist'

const ITEMS = [
  { id: 'big3', label: "Mark yesterday's POC, VAH, VAL — extend across today" },
  { id: 'nakedpocs', label: 'Identify all naked POCs from past 5–10 sessions' },
  { id: 'hvns', label: 'Note HVN clusters above and below current price' },
  { id: 'lvns', label: 'Note LVN voids above and below current price' },
  { id: 'bias', label: 'Define bias: above / in / below yesterday\'s value area' },
  { id: 'entries', label: 'Pre-define entries: which Brooks setups at which key levels' },
  { id: 'notrade', label: 'Pre-define no-trade zones: vacuums where you stay flat' },
  { id: 'ib_high_low', label: 'At 10:30 — confirm IB high/low' },
  { id: 'open_type', label: 'At 10:30 — classify Open Type (Drive/Test Drive/Rejection/Auction)' },
  { id: 'shape', label: 'At 10:30 — note developing profile shape (D/P/b/Trend)' },
  { id: 'eod_mark', label: 'EOD — mark today\'s POC, VAH, VAL for tomorrow' },
  { id: 'eod_review', label: 'EOD — log new naked POCs and LVN voids' },
]

export default function BuildChecklist() {
  const { checklist, setChecklist } = useChecklist()
  const [customText, setCustomText] = useState('')

  function toggle(id: string) {
    setChecklist({
      ...checklist,
      items: { ...checklist.items, [id]: !checklist.items[id] },
    })
  }

  function addCustom() {
    if (!customText.trim()) return
    setChecklist({ ...checklist, customAdditions: [...checklist.customAdditions, customText.trim()] })
    setCustomText('')
  }

  function removeCustom(idx: number) {
    setChecklist({ ...checklist, customAdditions: checklist.customAdditions.filter((_, i) => i !== idx) })
  }

  const selectedCount = ITEMS.filter((i) => checklist.items[i.id]).length + checklist.customAdditions.length

  return (
    <div className="my-8 rounded-xl border border-border-subtle bg-bg-card p-6">
      <h4 className="font-head font-semibold text-xl mb-1">Interactive · Build Your Personal Pre-Market Checklist</h4>
      <p className="text-sm text-text-secondary mb-4">Toggle the items you'll commit to. Saved to your browser. Add custom items below.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-6">
        {ITEMS.map((item) => {
          const checked = !!checklist.items[item.id]
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggle(item.id)}
              className={`text-left px-3.5 py-3 rounded-lg border transition-all flex items-start gap-3 ${
                checked
                  ? 'border-hvn-teal bg-hvn-teal/10'
                  : 'border-border-subtle bg-bg-elevated hover:border-accent-blue'
              }`}
            >
              <span className={`mt-0.5 shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                checked ? 'border-hvn-teal bg-hvn-teal text-bg-base' : 'border-text-muted'
              }`}>
                {checked && <span className="text-xs">✓</span>}
              </span>
              <span className="text-sm">{item.label}</span>
            </button>
          )
        })}
      </div>

      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-wider text-text-secondary mb-2">Add custom items</div>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="e.g. check NQ correlation before MES entries"
            className="flex-1 px-3 py-2 rounded-lg bg-bg-elevated border border-border-subtle text-sm focus:border-accent-blue focus:outline-none"
            onKeyDown={(e) => { if (e.key === 'Enter') addCustom() }}
          />
          <button type="button" className="btn-secondary" onClick={addCustom}>Add</button>
        </div>
        {checklist.customAdditions.length > 0 && (
          <ul className="space-y-1.5">
            {checklist.customAdditions.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm rounded-md bg-bg-elevated border border-border-subtle px-3 py-1.5">
                <span className="text-poc-gold">+</span>
                <span className="flex-1">{item}</span>
                <button type="button" className="text-text-muted hover:text-bear-red text-xs" onClick={() => removeCustom(i)}>✕</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-lg border border-poc-gold/40 bg-poc-gold/5 p-4">
        <div className="text-xs font-mono uppercase text-poc-gold mb-1">Your Saved Checklist</div>
        <p className="text-sm text-text-primary">
          <span className="font-bold text-poc-gold">{selectedCount}</span> items committed. They'll appear at the top of this page on every visit from now on.
        </p>
      </div>
    </div>
  )
}
