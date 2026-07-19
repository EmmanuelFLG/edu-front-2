import { useEffect, useState } from 'react'
import { Link2 } from 'lucide-react'
import { alocacaoApi } from '../api/alocacaoApi'
import { useToast } from '../context/ToastContext'
import { extrairMensagemErro } from '../api/axiosClient'
import Spinner from './ui/Spinner'
import EmptyState from './ui/EmptyState'

/**
 * Busca as alocações do professor autenticado (GET /alocacoes/minhas) e permite
 * escolher uma delas (turma + disciplina). Usado como primeiro passo nas telas
 * de Notas e Frequência — sem alocação selecionada, não há o que lançar.
 */
export default function AlocacaoSelect({ value, onChange }) {
  const toast = useToast()
  const [alocacoes, setAlocacoes] = useState(null)

  useEffect(() => {
    let ativo = true
    alocacaoApi
      .minhas()
      .then((dados) => {
        if (!ativo) return
        setAlocacoes(dados)
        if (dados.length > 0 && !value) onChange(dados[0])
      })
      .catch((err) => toast.erro(extrairMensagemErro(err, 'Não foi possível carregar suas turmas.')))
    return () => {
      ativo = false
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (alocacoes === null) return <Spinner label="Carregando suas turmas…" />

  if (alocacoes.length === 0) {
    return (
      <EmptyState
        icon={Link2}
        title="Nenhuma turma alocada"
        description="Você ainda não está vinculado a nenhuma disciplina/turma. Fale com a administração."
      />
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {alocacoes.map((a) => {
        const ativa = value?.id === a.id
        return (
          <button
            key={a.id}
            onClick={() => onChange(a)}
            className={`rounded-lg border px-3.5 py-2 text-left text-sm transition-colors ${
              ativa
                ? 'border-brand-500 bg-brand-500 text-white shadow-card'
                : 'border-ink-100 bg-white text-ink-600 hover:border-brand-300 hover:bg-brand-50'
            }`}
          >
            <span className="block font-display font-semibold leading-tight">{a.turmaNome}</span>
            <span className={`block text-xs ${ativa ? 'text-brand-100' : 'text-ink-400'}`}>{a.disciplinaNome}</span>
          </button>
        )
      })}
    </div>
  )
}
