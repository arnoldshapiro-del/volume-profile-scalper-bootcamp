import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto text-center py-20">
      <div className="text-6xl mb-4">🧭</div>
      <h1 className="font-head text-3xl font-bold mb-3">Lost in the profile.</h1>
      <p className="text-text-secondary mb-6">This page is in a low-volume node. Head back to the value area.</p>
      <Link to="/" className="btn-primary">Back to Dashboard</Link>
    </div>
  )
}
