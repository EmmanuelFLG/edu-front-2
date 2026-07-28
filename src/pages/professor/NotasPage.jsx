import { useEffect, useMemo, useState } from 'react'
import { Save, Users2 } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import AlocacaoSelect from '../../components/AlocacaoSelect'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { matriculaApi } from '../../api/matriculaApi'
import { notaApi } from '../../api/notaApi'
import { extrairMensagemErro } from '../../api/axiosClient'
import { useToast } from '../../context/ToastContext'
import { BIMESTRES } from '../../utils/constants'

function calcularMediaLocal(n1, n2, n3) {
  const valores = [n1, n2, n3]
  if (valores.some((v) => v === '' || v === null || v === undefined)) return null
  const soma = valores.reduce((acc, v) => acc + Number(v), 0)
  return soma / 3
}

function NotaRow({ aluno, alocacao, bimestre, notaExistente, onSalvo }) {
  const toast = useToast()
  const [n1, setN1] = useState(notaExistente?.n1 ?? '')
  const [n2, setN2] = useState(notaExistente?.n2 ?? '')
  const [n3, setN3] = useState(notaExistente?.n3 ?? '')
  const [salvando, setSalvando] = useState(false)
  const [notaId, setNotaId] = useState(notaExistente?.id ?? null)

  useEffect(() => {
    setN1(notaExistente?.n1 ?? '')
    setN2(notaExistente?.n2 ?? '')
    setN3(notaExistente?.n3 ?? '')
    setNotaId(notaExistente?.id ?? null)
  }, [notaExistente])

  const mediaPrevia = calcularMediaLocal(n1, n2, n3)

  async function salvar() {
    setSalvando(true)
    try {
      const payload = {
        matriculaId: aluno.id,
        alocacaoId: alocacao.id,
        bimestre,
        n1: n1 === '' ? null : Number(n1),
        n2: n2 === '' ? null : Number(n2),
        n3: n3 === '' ? null : Number(n3),
      }
      const resposta = notaId ? await notaApi.atualizar(notaId, payload) : await notaApi.criar(payload)
      setNotaId(resposta.id)
      toast.sucesso(`Nota de ${aluno.alunoNome.split(' ')[0]} salva.`)
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
      {[
        [n1, setN1],
        [n2, setN2],
        [n3, setN3],
      ].map(([valor, setValor], i) => (
        <td key={i} className="px-2 py-2">
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="input-base w-20 text-center font-mono"
            aria-label={`N${i + 1} de ${aluno.alunoNome}`}
          />
        </td>
      ))}
      <td className="px-4 py-2 text-center font-mono text-sm font-semibold text-ink-700">
        {mediaPrevia === null ? '—' : mediaPrevia.toFixed(1).replace('.', ',')}
      </td>
      <td className="px-4 py-2 text-right">
        <button className="btn-outline btn-sm" onClick={salvar} disabled={salvando}>
          <Save size={13} />
          {salvando ? 'Salvando…' : notaId ? 'Atualizar' : 'Lançar'}
        </button>
      </td>
    </tr>
  )
}

export default function NotasPage() {
  const toast = useToast()
  const [alocacao, setAlocacao] = useState(null)
  const [bimestre, setBimestre] = useState(1)
  const [roster, setRoster] = useState(null)
  const [notas, setNotas] = useState([])
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    if (!alocacao) return
    let ativo = true
    setCarregando(true)
    Promise.all([matriculaApi.porTurma(alocacao.turmaId), notaApi.porTurma(alocacao.turmaId)])
      .then(([rosterResp, notasResp]) => {
        if (!ativo) return
        setRoster(rosterResp)
        setNotas(notasResp)
      })
      .catch((err) => toast.erro(extrairMensagemErro(err, 'Não foi possível carregar a turma.')))
      .finally(() => ativo && setCarregando(false))
    return () => {
      ativo = false
    }
  }, [alocacao]) // eslint-disable-line react-hooks/exhaustive-deps

  const notasDoBimestre = useMemo(
    () => notas.filter((n) => n.alocacaoId === alocacao?.id && n.bimestre === bimestre),
    [notas, alocacao, bimestre]
  )

  function atualizarNotaLocal(notaSalva) {
    setNotas((atual) => {
      const semEssa = atual.filter((n) => n.id !== notaSalva.id)
      return [...semEssa, notaSalva]
    })
  }

  return (
    <div>
      <PageHeader title="Notas" subtitle="Escolha a turma/disciplina e o bimestre para lançar as notas." />

      <div className="card mb-5 p-5">
        <p className="label-base">Turma e disciplina</p>
        <AlocacaoSelect value={alocacao} onChange={setAlocacao} />
      </div>

      {alocacao && (
        <div className="card overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-50 p-4">
            <div className="flex items-center gap-2 text-sm text-ink-500">
              <Users2 size={15} />
              {roster
                ? `${roster.length} aluno(s) em ${alocacao.serie} ${alocacao.turmaNome}`
                : 'Carregando turma…'}
            </div>
            <div className="flex gap-1 rounded-lg bg-ink-50 p-1">
              {BIMESTRES.map((b) => (
                <button
                  key={b}
                  onClick={() => setBimestre(b)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${bimestre === b ? 'bg-white text-ink-700 shadow-sm' : 'text-ink-400 hover:text-ink-600'
                    }`}
                >
                  {b}º bim.
                </button>
              ))}
            </div>
          </div>

          {carregando ? (
            <Spinner label="Carregando notas…" />
          ) : roster?.length === 0 ? (
            <EmptyState icon={Users2} title="Nenhum aluno matriculado" description="Esta turma ainda não tem alunos matriculados." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-ink-50 bg-ink-50/50 text-xs uppercase tracking-wide text-ink-400">
                    <th className="px-5 py-3 font-semibold">Aluno</th>
                    <th className="px-2 py-3 font-semibold">N1</th>
                    <th className="px-2 py-3 font-semibold">N2</th>
                    <th className="px-2 py-3 font-semibold">N3</th>
                    <th className="px-4 py-3 text-center font-semibold">Média</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {roster?.map((aluno) => (
                    <NotaRow
                      key={aluno.id}
                      aluno={aluno}
                      alocacao={alocacao}
                      bimestre={bimestre}
                      notaExistente={notasDoBimestre.find((n) => n.matriculaId === aluno.id)}
                      onSalvo={atualizarNotaLocal}
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
