import { useEffect, useMemo, useState } from 'react'
import { Save, Users2, CheckCheck } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import AlocacaoSelect from '../../components/AlocacaoSelect'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { Select } from '../../components/ui/Field'
import { matriculaApi } from '../../api/matriculaApi'
import { presencaApi } from '../../api/presencaApi'
import { extrairMensagemErro } from '../../api/axiosClient'
import { useToast } from '../../context/ToastContext'
import { STATUS_PRESENCA } from '../../utils/constants'

function hoje() {
  return new Date().toISOString().slice(0, 10)
}

function PresencaRow({ aluno, alocacao, data, registroExistente, forcarPresente, onSalvo }) {
  const toast = useToast()
  const [status, setStatus] = useState(registroExistente?.status ?? 'PRESENTE')
  const [faltas, setFaltas] = useState(registroExistente?.quantidadeFaltas ?? 0)
  const [salvando, setSalvando] = useState(false)
  const [registroId, setRegistroId] = useState(registroExistente?.id ?? null)

  useEffect(() => {
    setStatus(registroExistente?.status ?? 'PRESENTE')
    setFaltas(registroExistente?.quantidadeFaltas ?? 0)
    setRegistroId(registroExistente?.id ?? null)
  }, [registroExistente, data])

  useEffect(() => {
    if (forcarPresente === 0) return
    setStatus('PRESENTE')
    setFaltas(0)
  }, [forcarPresente]) // eslint-disable-line react-hooks/exhaustive-deps

  async function salvar() {
    setSalvando(true)
    try {
      const payload = {
        matriculaId: aluno.id,
        alocacaoId: alocacao.id,
        data,
        quantidadeFaltas: Number(faltas) || 0,
        status,
      }
      const resposta = registroId ? await presencaApi.atualizar(registroId, payload) : await presencaApi.criar(payload)
      setRegistroId(resposta.id)
      toast.sucesso(`Frequência de ${aluno.alunoNome.split(' ')[0]} salva.`)
      onSalvo(resposta)
    } catch (err) {
      toast.erro(extrairMensagemErro(err))
    } finally {
      setSalvando(false)
    }
  }

  return (
    <tr className="border-b border-ink-50 last:border-0 hover:bg-ink-50/40">
      <td className="px-5 py-2.5 text-ink-700">{aluno.alunoNome}</td>
      <td className="px-3 py-2">
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="min-w-[10rem]">
          {STATUS_PRESENCA.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </Select>
      </td>
      <td className="px-3 py-2">
        <input
          type="number"
          min="0"
          value={faltas}
          onChange={(e) => setFaltas(e.target.value)}
          className="input-base w-20 text-center font-mono"
          aria-label={`Faltas de ${aluno.alunoNome}`}
        />
      </td>
      <td className="px-4 py-2 text-right">
        <button className="btn-outline btn-sm" onClick={salvar} disabled={salvando}>
          <Save size={13} />
          {salvando ? 'Salvando…' : registroId ? 'Atualizar' : 'Registrar'}
        </button>
      </td>
    </tr>
  )
}

export default function PresencasPage() {
  const toast = useToast()
  const [alocacao, setAlocacao] = useState(null)
  const [data, setData] = useState(hoje())
  const [roster, setRoster] = useState(null)
  const [presencas, setPresencas] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [forcarPresente, setForcarPresente] = useState(0)

  useEffect(() => {
    if (!alocacao) return
    let ativo = true
    setCarregando(true)
    Promise.all([matriculaApi.porTurma(alocacao.turmaId), presencaApi.porTurma(alocacao.turmaId)])
      .then(([rosterResp, presencasResp]) => {
        if (!ativo) return
        setRoster(rosterResp)
        setPresencas(presencasResp)
      })
      .catch((err) => toast.erro(extrairMensagemErro(err, 'Não foi possível carregar a turma.')))
      .finally(() => ativo && setCarregando(false))
    return () => {
      ativo = false
    }
  }, [alocacao]) // eslint-disable-line react-hooks/exhaustive-deps

  const registrosDoDia = useMemo(
    () => presencas.filter((p) => p.alocacaoId === alocacao?.id && p.data === data),
    [presencas, alocacao, data]
  )

  function atualizarPresencaLocal(registroSalvo) {
    setPresencas((atual) => {
      const semEsse = atual.filter((p) => p.id !== registroSalvo.id)
      return [...semEsse, registroSalvo]
    })
  }

  return (
    <div>
      <PageHeader title="Frequência" subtitle="Escolha a turma/disciplina e a data para fazer a chamada." />

      <div className="card mb-5 p-5">
        <p className="label-base">Turma e disciplina</p>
        <AlocacaoSelect value={alocacao} onChange={setAlocacao} />
      </div>

      {alocacao && (
        <div className="card overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-50 p-4">
            <div className="flex items-center gap-2 text-sm text-ink-500">
              <Users2 size={15} />
              {roster ? `${roster.length} aluno(s) em ${alocacao.turmaNome}` : 'Carregando turma…'}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="input-base w-auto"
                aria-label="Data da aula"
              />
              <button className="btn-outline btn-sm" onClick={() => setForcarPresente((v) => v + 1)}>
                <CheckCheck size={13} />
                Marcar todos presentes
              </button>
            </div>
          </div>

          {carregando ? (
            <Spinner label="Carregando frequência…" />
          ) : roster?.length === 0 ? (
            <EmptyState icon={Users2} title="Nenhum aluno matriculado" description="Esta turma ainda não tem alunos matriculados." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-ink-50 bg-ink-50/50 text-xs uppercase tracking-wide text-ink-400">
                    <th className="px-5 py-3 font-semibold">Aluno</th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                    <th className="px-3 py-3 font-semibold">Faltas</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {roster?.map((aluno) => (
                    <PresencaRow
                      key={aluno.id}
                      aluno={aluno}
                      alocacao={alocacao}
                      data={data}
                      registroExistente={registrosDoDia.find((p) => p.matriculaId === aluno.id)}
                      forcarPresente={forcarPresente}
                      onSalvo={atualizarPresencaLocal}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
