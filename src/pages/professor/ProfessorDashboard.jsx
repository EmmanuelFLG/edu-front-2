import { useEffect, useState } from 'react'
import { LayoutDashboard, NotebookPen, CalendarCheck, CalendarClock, School, Link2 } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'
import LinkTile from '../../components/ui/LinkTile'
import { useAuth } from '../../context/AuthContext'
import { alocacaoApi } from '../../api/alocacaoApi'

export default function ProfessorDashboard() {
  const { usuario } = useAuth()
  const [alocacoes, setAlocacoes] = useState(null)

  useEffect(() => {
    let ativo = true
    alocacaoApi.minhas().then((dados) => ativo && setAlocacoes(dados))
    return () => {
      ativo = false
    }
  }, [])

  const turmasUnicas = new Set((alocacoes || []).map((a) => a.turmaId)).size
  const disciplinasUnicas = new Set((alocacoes || []).map((a) => a.disciplinaId)).size

  return (
    <div>
      <PageHeader
        icon={LayoutDashboard}
        title={`Olá, ${usuario.nome.split(' ')[0]}`}
        subtitle="Lance notas, registre frequência e consulte seu horário."
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <StatCard icon={School} label="Turmas" value={turmasUnicas} loading={!alocacoes} tone="ink" />
        <StatCard icon={NotebookPen} label="Disciplinas" value={disciplinasUnicas} loading={!alocacoes} tone="brand" />
        <StatCard icon={Link2} label="Alocações" value={alocacoes?.length} loading={!alocacoes} tone="amber" />
      </div>

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-ink-400">Atalhos</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <LinkTile to="/professor/notas" icon={NotebookPen} title="Lançar notas" description="Registrar e atualizar notas por bimestre." />
        <LinkTile to="/professor/presencas" icon={CalendarCheck} title="Fazer chamada" description="Registrar a frequência dos alunos." />
        <LinkTile to="/professor/horario" icon={CalendarClock} title="Meu horário" description="Consultar sua grade de aulas da semana." />
      </div>
    </div>
  )
}
