export default function Footer() {
  return (
    <footer className="mt-20 py-8 border-t border-border-subtle text-center">
      <p className="text-xs text-text-muted">
        Volume Profile Scalper Bootcamp · {new Date().getFullYear()} · Built with Claude
      </p>
      <p className="text-xs text-text-muted mt-1 max-w-xl mx-auto">
        Educational content. Not financial advice. Trading futures involves substantial risk.
      </p>
    </footer>
  )
}
