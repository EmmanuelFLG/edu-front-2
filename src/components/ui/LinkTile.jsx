import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function LinkTile({ to, icon: Icon, title, description }) {
  return (
    <Link
      to={to}
      className="card group flex items-start gap-3.5 p-5 transition-shadow hover:shadow-pop"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
        <Icon size={19} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display text-sm font-semibold text-ink-800">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-ink-400">{description}</p>
      </div>
      <ArrowRight size={16} className="mt-1 shrink-0 text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500" />
    </Link>
  )
}
