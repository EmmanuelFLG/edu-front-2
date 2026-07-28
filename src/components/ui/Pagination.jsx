import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, onChange, totalElements }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between border-t border-ink-50 px-5 py-3">
      <p className="text-xs text-ink-400">
        Página {page + 1} de {totalPages}
        {typeof totalElements === 'number' && <> · {totalElements} registro(s)</>}
      </p>
      <div className="flex gap-1.5">
        <button
          className="btn-outline btn-sm"
          disabled={page <= 0}
          onClick={() => onChange(page - 1)}
          aria-label="Página anterior"
        >
          <ChevronLeft size={14} />
        </button>
        <button
          className="btn-outline btn-sm"
          disabled={page >= totalPages - 1}
          onClick={() => onChange(page + 1)}
          aria-label="Próxima página"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}
