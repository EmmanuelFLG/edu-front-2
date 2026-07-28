import { useCallback, useEffect, useState } from 'react'
import { Inbox, Check, X } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Pagination from '../../components/ui/Pagination'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { Textarea } from '../../components/ui/Field'
import { useToast } from '../../context/ToastContext'
import { extrairMensagemErro } from '../../api/axiosClient'
import { solicitacaoMatriculaApi } from '../../api/solicitacaoMatriculaApi'
import { alunoApi } from '../../api/alunoApi'
import { TURNOS, STATUS_SOLICITACAO } from '../../utils/constants'

const TURNO_LABEL = Object.fromEntries(TURNOS.map((t) => [t.value, t.label]))
const STATUS_TONE = { PENDENTE: 'warn', APROVADA: 'good', REJEITADA: 'bad' }

function formatarDataHora(valor) {
  if (!valor) return '—'
  const [data, hora] = valor.split('T')
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}${hora ? ` às ${hora.slice(0, 5)}` : ''}`
}

export default function SolicitacoesMatriculaPage() {
  const toast = useToast()

  // --- ESTADOS DE DADOS E FILTROS ---
  const [page, setPage] = useState(0)
  const [status, setStatus] = useState('PENDENTE')
  const [data, setData] = useState({ content: [], totalPages: 0, totalElements: 0 })
  const [carregando, setCarregando] = useState(true)

  // --- ESTADOS DE ANÁLISE (APROVAR/REJEITAR) ---
  const [aprovando, setAprovando] = useState(null)
  const [processandoAprovacao, setProcessandoAprovacao] = useState(false)
  const [rejeitando, setRejeitando] = useState(null)
  const [motivoRejeicao, setMotivoRejeicao] = useState('')
  const [processandoRejeicao, setProcessandoRejeicao] = useState(false)

  // --- OPERAÇÕES DA API ---
  const carregar = useCallback(async () => {
    setCarregando(true)
    try {
      setData(await solicitacaoMatriculaApi.listar({ 
        page, 
        size: 10, 
        sort: 'dataSolicitacao,desc', 
        status: status || undefined 
      }))
    } catch (err) {
      toast.erro(extrairMensagemErro(err, 'Falha ao carregar as solicitações.'))
    } finally {
      setCarregando(false)
    }
  }, [page, status, toast])

  useEffect(() => { 
    carregar() 
  }, [carregar])

  function mudarStatus(novoStatus) {
    setStatus(novoStatus)
    setPage(0)
  }

  async function handleAprovar() {
    if (!aprovando) return
    setProcessandoAprovacao(true)
    try {
      const resultado = await solicitacaoMatriculaApi.aprovar(aprovando.id)
      let mensagem = `Matrícula de ${resultado.nome} aprovada.`
      
      if (resultado.alunoId) {
        try {
          const aluno = await alunoApi.buscar(resultado.alunoId)
          mensagem = `${aluno.nome} matriculado! Matrícula ${aluno.matricula}${aluno.turmaNome ? ` — turma ${aluno.turmaNome}` : ''}.`
        } catch {
          // Mantém mensagem padrão se a consulta de detalhes do aluno falhar
        }
      }
      
      toast.sucesso(mensagem)
      setAprovando(null)
      carregar()
    } catch (err) {
      toast.erro(extrairMensagemErro(err, 'Não foi possível aprovar a solicitação.'))
    } finally {
      setProcessandoAprovacao(false)
    }
  }

  async function handleRejeitar(e) {
    e.preventDefault()
    if (!rejeitando) return
    setProcessandoRejeicao(true)
    try {
      await solicitacaoMatriculaApi.rejeitar(rejeitando.id, motivoRejeicao.trim() || null)
      toast.sucesso('Solicitação rejeitada.')
      setRejeitando(null)
      setMotivoRejeicao('')
      carregar()
    } catch (err) {
      toast.erro(extrairMensagemErro(err, 'Não foi possível rejeitar a solicitação.'))
    } finally {
      setProcessandoRejeicao(false)
    }
  }

  // --- SUBCOMPONENTE: FILTRO POR STATUS (Abas) ---
  function RenderFiltros() {
    return (
      <div className="flex gap-1.5 border-b border-ink-50 p-3 bg-white">
        <button onClick={() => mudarStatus('')} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${!status ? 'bg-ink-700 text-white' : 'text-ink-500 hover:bg-ink-50'}`}>
          Todas
        </button>
        {STATUS_SOLICITACAO.map((s) => (
          <button key={s.value} onClick={() => mudarStatus(s.value)} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${status === s.value ? 'bg-ink-700 text-white' : 'text-ink-500 hover:bg-ink-50'}`}>
            {s.label}
          </button>
        ))}
      </div>
    )
  }

  // --- SUBCOMPONENTE: TABELA DE PEDIDOS ---
  function RenderTabela() {
    return (
      <div className="overflow-x-auto bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink-50 bg-ink-50/50 text-xs uppercase tracking-wide text-ink-400">
              <th className="px-5 py-3 font-semibold">Aluno</th>
              <th className="px-5 py-3 font-semibold">Série / Turno</th>
              <th className="px-5 py-3 font-semibold">Solicitado em</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 text-right font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.content.map((row) => (
              <tr key={row.id} className="border-b border-ink-50 last:border-0 hover:bg-ink-50/40 align-top">
                <td className="px-5 py-3">
                  <p className="font-medium text-ink-700">{row.nome}</p>
                  <p className="text-xs text-ink-400">{row.email}</p>
                  {row.cpf && <p className="text-xs text-ink-400">CPF: {row.cpf}</p>}
                </td>
                <td className="px-5 py-3 text-ink-600">
                  <p className="font-medium">{row.serie}</p>
                  <p className="text-xs text-ink-400">{TURNO_LABEL[row.turno] || row.turno}</p>
                </td>
                <td className="px-5 py-3 text-ink-500">{formatarDataHora(row.dataSolicitacao)}</td>
                <td className="px-5 py-3">
                  <Badge tone={STATUS_TONE[row.status] || 'neutral'}>
                    {STATUS_SOLICITACAO.find((s) => s.value === row.status)?.label || row.status}
                  </Badge>
                  {row.status === 'REJEITADA' && row.motivoRejeicao && (
                    <p className="mt-1 max-w-[220px] text-xs italic text-ink-400">Motivo: {row.motivoRejeicao}</p>
                  )}
                </td>
                <td className="px-5 py-3 text-right">
                  {row.status === 'PENDENTE' && (
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => setAprovando(row)}
                        className="flex items-center gap-1 rounded-md bg-good-50 px-2.5 py-1.5 text-xs font-semibold text-good-600 hover:bg-good-100"
                      >
                        <Check size={14} /> Aprovar
                      </button>
                      <button
                        onClick={() => setRejeitando(row)}
                        className="flex items-center gap-1 rounded-md bg-bad-50 px-2.5 py-1.5 text-xs font-semibold text-bad-600 hover:bg-bad-100"
                      >
                        <X size={14} /> Rejeitar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // --- RENDERIZAÇÃO DA ESTRUTURA PRINCIPAL ---
  return (
    <div>
      <PageHeader title="Solicitações de Matrícula" subtitle="Pedidos enviados pela tela pública de auto-matrícula, aguardando análise da secretaria."/>

      <div className="card overflow-hidden mt-4">
        <RenderFiltros />

        {carregando ? (
          <Spinner />
        ) : data.content.length === 0 ? (
          <EmptyState icon={Inbox} title="Nenhuma solicitação encontrada" description="Assim que alguém preencher o formulário público de matrícula, o pedido aparece aqui."/>
        ) : (
          <RenderTabela />
        )}
        
        <Pagination page={page} totalPages={data.totalPages} totalElements={data.totalElements} onChange={setPage} />
      </div>

      {/* Confirmação de Aprovação */}
      <ConfirmDialog open={!!aprovando} onClose={() => setAprovando(null)} onConfirm={handleAprovar} title="Aprovar matrícula" tone="accent" confirmLabel="Aprovar" loading={processandoAprovacao} description={aprovando ? `${aprovando.nome} será matriculado(a) e o sistema vai atribuir automaticamente uma turma de "${aprovando.serie}" no turno ${TURNO_LABEL[aprovando.turno] || aprovando.turno} (a com menos alunos, entre as que tiverem vaga).` : ''}/>

      {/* Modal para preenchimento de Rejeição */}
      <Modal open={!!rejeitando} onClose={() => setRejeitando(null)} title="Rejeitar solicitação" width="max-w-sm">
        <form onSubmit={handleRejeitar} className="space-y-4">
          <p className="text-sm text-ink-500">
            {rejeitando && `A solicitação de ${rejeitando.nome} será marcada como rejeitada.`}
          </p>
          <div>
            <label htmlFor="motivo" className="text-xs font-semibold text-ink-600 block mb-1">Motivo (opcional)</label>
            <Textarea
              id="motivo"
              rows={3}
              value={motivoRejeicao}
              onChange={(e) => setMotivoRejeicao(e.target.value)}
              placeholder="Ex.: documentação incompleta, vaga indisponível…"
              className="w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-ink-50">
            <button type="button" className="btn-outline px-4 py-2 text-sm" onClick={() => setRejeitando(null)} disabled={processandoRejeicao}>
              Cancelar
            </button>
            <button type="submit" className="btn-danger px-4 py-2 text-sm" disabled={processandoRejeicao}>
              {processandoRejeicao ? 'Rejeitando…' : 'Rejeitar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}