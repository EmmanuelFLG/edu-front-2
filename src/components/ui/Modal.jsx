import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, subtitle, children, width = 'max-w-lg' }) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink-900/40 px-4 py-8 backdrop-blur-[2px]">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`w-full ${width} animate-[fadeIn_0.15s_ease-out] rounded-xl2 bg-white shadow-pop`}
      >
        <div className="flex items-start justify-between border-b border-ink-50 px-6 py-4">
          <div>
            <h2 id="modal-title" className="font-display text-lg font-semibold text-ink-800">
              {title}
            </h2>
            {subtitle && <p className="mt-0.5 text-sm text-ink-400">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-md p-1.5 text-ink-300 hover:bg-ink-50 hover:text-ink-600"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
