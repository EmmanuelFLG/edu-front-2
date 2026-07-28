import { useEffect, useState } from 'react'
import { LayoutDashboard, ScrollText, CalendarClock } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import LinkTile from '../../components/ui/LinkTile'
import SituacaoStamp from '../../components/ui/SituacaoStamp'
import { useAuth } from '../../context/AuthContext'
import { boletimApi } from '../../api/boletimApi'

export default function AlunoDashboard() {
  const { usuario } = useAuth()
  const [boletim, setBoletim] = useState(null)

  useEffect(() => {
    let ativo = true
    boletimApi
      .consultar()
      .then((dados) => ativo && setBoletim(dados))
      .catch(() => {})
    return () => {
      ativo = false
    }
  }, [])

  const disciplinasEmAtencao = (boletim?.disciplinas || []).filter((d) => d.situacao !== 'APROVADO')
  const nomesUnicos = [...new Set(disciplinasEmAtencao.map((d) => d.disciplina))]

  return (
    <div>
      <PageHeader
        icon={LayoutDashboard}
        title={`Olá, ${usuario.nome.split(' ')[0]}`}
        subtitle="Acompanhe seu boletim e sua grade de horários."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <LinkTile to="/aluno/boletim" icon={ScrollText} title="Meu boletim" description="Notas, médias, frequência e situação." />
        <LinkTile to="/aluno/horario" icon={CalendarClock} title="Meu horário" description="Suas aulas da semana, por dia." />
      </div>

      {nomesUnicos.length > 0 && (
        <div className="card mt-6 p-5">
          <p className="mb-3 text-sm font-semibold text-ink-700">Disciplinas que pedem atenção</p>
          <div className="flex flex-wrap gap-2">
            {nomesUnicos.map((nome) => {
              const item = disciplinasEmAtencao.find((d) => d.disciplina === nome)
              return (
                <div key={nome} className="flex items-center gap-2 rounded-lg border border-ink-100 px-3 py-2">
                  <span className="text-sm text-ink-600">{nome}</span>
                  <SituacaoStamp situacao={item.situacao} />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
