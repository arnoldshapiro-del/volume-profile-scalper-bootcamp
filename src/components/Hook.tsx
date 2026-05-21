export default function Hook({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 pl-5 border-l-4 border-poc-gold/60 italic text-lg text-text-primary leading-relaxed">
      {children}
    </div>
  )
}
