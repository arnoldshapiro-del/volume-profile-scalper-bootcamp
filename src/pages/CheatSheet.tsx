export default function CheatSheet() {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8 no-print">
        <h1 className="font-head font-bold text-4xl mb-2 print-title">Volume Profile Cheat Sheet</h1>
        <p className="text-text-secondary">The complete pocket reference. Print it. Tape it to your monitor.</p>
        <button
          type="button"
          onClick={() => window.print()}
          className="btn-primary mt-4"
        >
          🖨 Print or Save as PDF
        </button>
      </header>

      <section className="card print-card mb-6">
        <h2 className="font-head font-bold text-2xl mb-4 print-title">The Big Three</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border border-poc-gold/40 bg-poc-gold/5 p-4 print-card">
            <div className="text-poc-gold print-gold font-head font-bold text-lg">POC</div>
            <div className="text-xs text-text-muted mb-2">Point of Control</div>
            <p className="text-sm">The price with the most volume. Acts as a magnet that price often returns to.</p>
          </div>
          <div className="rounded-lg border border-va-purple/40 bg-va-purple/5 p-4 print-card">
            <div className="text-va-purple print-purple font-head font-bold text-lg">VAH</div>
            <div className="text-xs text-text-muted mb-2">Value Area High</div>
            <p className="text-sm">Top edge of the 70% volume zone. Resistance level.</p>
          </div>
          <div className="rounded-lg border border-va-purple/40 bg-va-purple/5 p-4 print-card">
            <div className="text-va-purple print-purple font-head font-bold text-lg">VAL</div>
            <div className="text-xs text-text-muted mb-2">Value Area Low</div>
            <p className="text-sm">Bottom edge of the 70% volume zone. Support level.</p>
          </div>
        </div>
      </section>

      <section className="card print-card mb-6">
        <h2 className="font-head font-bold text-2xl mb-4 print-title">The 4 Profile Shapes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'D-Shape (Balanced)', icon: '⚖', desc: 'Bell curve, POC mid-range. Strategy: mean reversion, fade extremes.' },
            { name: 'P-Shape (Short Cover)', icon: '𝐏', desc: 'Heavy bottom, thin tail up. Strategy: fade the tail top.' },
            { name: 'b-Shape (Long Liq.)', icon: '𝐛', desc: 'Heavy top, thin tail down. Strategy: fade the tail bottom.' },
            { name: 'Trend Day', icon: '↗', desc: 'Thin elongated profile. Strategy: join only, never fade.' },
          ].map((s) => (
            <div key={s.name} className="rounded-lg border border-border-subtle p-4 print-card">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl text-hvn-teal print-teal">{s.icon}</span>
                <div className="font-head font-bold print-title">{s.name}</div>
              </div>
              <p className="text-sm text-text-secondary">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card print-card mb-6">
        <h2 className="font-head font-bold text-2xl mb-4 print-title">The 4 Open Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Open Drive', icon: '🚀', desc: 'Strong directional move from bell. ★★★★ — join immediately.' },
            { name: 'Open Test Drive', icon: '🔄', desc: 'Brief opposite test, then strong drive. ★★★ — wait for reversal candle, then join.' },
            { name: 'Open Rejection Reverse', icon: '↩', desc: 'Initial move, sharp rejection, reversal through opening print. ★★ — follow the reversal.' },
            { name: 'Open Auction', icon: '〰', desc: 'Sideways chop. ★ — stay small or stand aside.' },
          ].map((s) => (
            <div key={s.name} className="rounded-lg border border-border-subtle p-4 print-card">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl">{s.icon}</span>
                <div className="font-head font-bold print-title">{s.name}</div>
              </div>
              <p className="text-sm text-text-secondary">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card print-card mb-6">
        <h2 className="font-head font-bold text-2xl mb-4 print-title">The 80% Rule — Checklist</h2>
        <ol className="list-decimal list-outside ml-6 space-y-2 text-sm">
          <li>Price opens OUTSIDE yesterday's value area (above VAH or below VAL).</li>
          <li>Price RE-ENTERS the value area.</li>
          <li>Price STAYS inside for 2 consecutive 30-minute periods.</li>
          <li>~80% probability price traverses to opposite VA edge. T1 = POC, T2 = opposite VA edge.</li>
        </ol>
      </section>

      <section className="card print-card mb-6">
        <h2 className="font-head font-bold text-2xl mb-4 print-title">Failed Breakout — 4-Step Checklist</h2>
        <ol className="list-decimal list-outside ml-6 space-y-2 text-sm">
          <li>Price BREAKS above VAH (or below VAL).</li>
          <li>FAILS to find acceptance — weak follow-through, no conviction.</li>
          <li>RE-ENTERS the value area.</li>
          <li>REJECTION candle (engulfing/hammer/pin) confirms reversal. T1 = POC, T2 = opposite VA edge.</li>
        </ol>
      </section>

      <section className="card print-card mb-6">
        <h2 className="font-head font-bold text-2xl mb-4 print-title">Take-It-or-Skip-It · Brooks × Profile</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-left py-2 px-2 font-head">Brooks Setup</th>
                <th className="py-2 px-2 font-head text-poc-gold print-gold">At HVN/POC/VA edge</th>
                <th className="py-2 px-2 font-head text-lvn-amber">In LVN / No-Mans-Land</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['H2 long', '✓ TAKE — institutional floor', '✗ SKIP — no support'],
                ['H2 short', '✓ TAKE — institutional ceiling', '✗ SKIP — no resistance'],
                ['Bull flag', '✓ TAKE — momentum into magnet', '~ Caution — no target'],
                ['Bear flag', '✓ TAKE — momentum into vacuum', '~ Caution — no target'],
                ['Double bottom', '✓ TAKE — buyers confirmed at HVN', '✗ SKIP — random level'],
                ['Breakout INTO HVN', '✗ SKIP — likely chop/reverse', '—'],
              ].map((row, i) => (
                <tr key={i} className="border-b border-border-subtle/40">
                  <td className="py-2 px-2 font-mono">{row[0]}</td>
                  <td className="py-2 px-2 text-bull-green">{row[1]}</td>
                  <td className="py-2 px-2 text-text-secondary">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card print-card mb-6">
        <h2 className="font-head font-bold text-2xl mb-4 print-title">Pre-Market 5-Minute Routine</h2>
        <ol className="list-decimal list-outside ml-6 space-y-1.5 text-sm">
          <li>Mark yesterday's POC, VAH, VAL — extend across today.</li>
          <li>Mark all naked POCs from past 5–10 sessions.</li>
          <li>Note HVN clusters above and below current price.</li>
          <li>Note LVN voids above and below current price.</li>
          <li>Define bias: above / in / below yesterday's value area.</li>
          <li>Pre-define entries: which Brooks setups at which levels.</li>
          <li>Pre-define no-trade zones: vacuums where you'll stay flat.</li>
        </ol>
      </section>

      <p className="text-xs text-text-muted text-center mt-8 no-print">Educational reference only. Not financial advice. Trading futures involves substantial risk.</p>
    </div>
  )
}
