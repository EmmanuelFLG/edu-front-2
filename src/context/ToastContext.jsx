import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

const ICONS = {
  sucesso: CheckCircle2,
  erro: XCircle,
  info: Info,
}

const STYLES = {
  sucesso: 'border-good-500/30 bg-good-50 text-good-600',
  erro: 'border-bad-500/30 bg-bad-50 text-bad-600',
  info: 'border-brand-400/30 bg-brand-50 text-brand-600',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remover = useCallback((id) => {
    setToasts((atuais) => atuais.filter((t) => t.id !== id))
  }, [])

  const notificar = useCallback(
    (mensagem, tipo = 'info', duracaoMs = 4200) => {
      const id = Math.random().toString(36).slice(2)
      setToasts((atuais) => [...atuais, { id, mensagem, tipo }])
      setTimeout(() => remover(id), duracaoMs)
    },
    [remover]
  )

  const toast = {
    sucesso: (msg) => notificar(msg, 'sucesso'),
    erro: (msg) => notificar(msg, 'erro'),
    info: (msg) => notificar(msg, 'info'),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => {
          const Icon = ICONS[t.tipo]
          return (
            <div
              key={t.id}
              role="status"
              className={`flex items-start gap-2.5 rounded-lg border px-4 py-3 shadow-pop backdrop-blur-sm animate-[fadeIn_0.15s_ease-out] ${STYLES[t.tipo]}`}
            >
              <Icon size={18} className="mt-0.5 shrink-0" />
              <p className="flex-1 text-sm font-medium leading-snug">{t.mensagem}</p>
              <button
                onClick={() => remover(t.id)}
                className="shrink-0 text-current/60 hover:text-current"
                aria-label="Fechar notificação"
              >
                <X size={15} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast precisa ser usado dentro de um ToastProvider')
  return ctx
}
