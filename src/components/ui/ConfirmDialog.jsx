import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'

export default function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel = 'Confirmar', tone = 'danger', loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title} width="max-w-sm">
      <div className="flex gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tone === 'danger' ? 'bg-bad-50 text-bad-500' : 'bg-amber-50 text-amber-600'}`}>
          <AlertTriangle size={18} />
        </div>
        <p className="text-sm text-ink-500">{description}</p>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button className="btn-outline" onClick={onClose} disabled={loading}>
          Cancelar
        </button>
        <button
          className={tone === 'danger' ? 'btn-danger' : 'btn-accent'}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? 'Aguarde…' : confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
