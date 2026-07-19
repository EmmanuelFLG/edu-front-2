import { Loader2 } from 'lucide-react'

export default function Spinner({ label = 'Carregando…', size = 18 }) {
  return (
    <div className="flex items-center gap-2 py-8 text-sm text-ink-400 justify-center">
      <Loader2 size={size} className="animate-spin" />
      <span>{label}</span>
    </div>
  )
}
