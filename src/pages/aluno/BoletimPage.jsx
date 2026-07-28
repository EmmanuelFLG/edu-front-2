import { useEffect, useState } from 'react'
import { ScrollText, User } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import SituacaoStamp from '../../components/ui/SituacaoStamp'
import { boletimApi } from '../../api/boletimApi'
import { useToast } from '../../context/ToastContext'
import { extrairMensagemErro } from '../../api/axiosClient'
import { formatarNota, formatarPercentual } from '../../utils/format'

function agruparPorDisciplina(itens) {
  const grupos = new Map()
  for (const item of itens) {
    if (!grupos.has(item.disciplina)) grupos.set(item.disciplina, [])
    grupos.get(item.disciplina).push(item)
  }
  return Array.from(grupos.entries()).map(([disciplina, bimestres]) => ({
    disciplina,
    professor: bimestres[0]?.professor,
    frequencia: bimestres[0]?.frequenciaPercentual,
    bimestres: bimestres.sort((a, b) => a.bimestre - b.bimestre),
  }))
}

export default function BoletimPage() {
  const toast = useToast()
  const [boletim, setBoletim] = useState(null)
  const [erro, setErro] = useState(false)

  useEffect(() => {
    let ativo = true
    boletimApi
      .consultar()
      .then((dados) => ativo && setBoletim(dados))
      .catch((err) => {
        if (!ativo) return
        setErro(true)
        toast.erro(extrairMensagemErro(err, 'Não foi possível carregar seu boletim.'))
      })
    return () => {
      ativo = false
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (boletim === null && !erro) return <Spinner label="Carregando boletim…" />

  if (erro) {
    return (
      <EmptyState
        icon={ScrollText}
        title="Boletim indisponível"
        description="Não foi possível carregar seu boletim agora. Verifique se você possui uma matrícula ativa."
      />
    )
  }

  const disciplinas = agruparPorDisciplina(boletim.disciplinas || [])

  return (
    <div>
      <PageHeader icon={ScrollText} title="Meu boletim" subtitle="Notas, médias, frequência e situação em cada disciplina." />

      <div className="card mb-6 flex items-center gap-3 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-100 text-ink-500">
          <User size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold text-ink-700">{boletim.alunoNome}</p>
          <p className="text-xs text-ink-400">Matrícula {boletim.matricula}</p>
        </div>
      </div>

      {disciplinas.length === 0 ? (
        <EmptyState
          icon={ScrollText}
          title="Nenhuma nota lançada ainda"
          description="Assim que os professores lançarem notas, elas aparecerão aqui."
        />
      ) : (
        <div className="space-y-5">
          {disciplinas.map((d) => (
            <div key={d.disciplina} className="card overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-50 px-5 py-3.5">
                <div>
                  <p className="font-display text-sm font-semibold text-ink-800">{d.disciplina}</p>
                  <p className="text-xs text-ink-400">{d.professor}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wide text-ink-300">Frequência</p>
                    <p className="font-mono text-sm font-semibold text-ink-600">{formatarPercentual(d.frequencia)}</p>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-ink-50 bg-ink-50/50 text-xs uppercase tracking-wide text-ink-400">
                      <th className="px-5 py-2.5 font-semibold">Bimestre</th>
                      <th className="px-3 py-2.5 font-semibold">N1</th>
                      <th className="px-3 py-2.5 font-semibold">N2</th>
                      <th className="px-3 py-2.5 font-semibold">N3</th>
                      <th className="px-3 py-2.5 font-semibold">Média</th>
                      <th className="px-5 py-2.5 font-semibold">Situação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.bimestres.map((b) => (
                      <tr key={b.bimestre} className="border-b border-ink-50 last:border-0">
                        <td className="px-5 py-2.5 font-medium text-ink-600">{b.bimestre}º bimestre</td>
                        <td className="px-3 py-2.5 font-mono text-ink-600">{formatarNota(b.n1)}</td>
                        <td className="px-3 py-2.5 font-mono text-ink-600">{formatarNota(b.n2)}</td>
                        <td className="px-3 py-2.5 font-mono text-ink-600">{formatarNota(b.n3)}</td>
                        <td className="px-3 py-2.5 font-mono font-semibold text-ink-800">{formatarNota(b.media)}</td>
                        <td className="px-5 py-2.5">
                          <SituacaoStamp situacao={b.situacao} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
