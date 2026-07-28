import { useEffect, useState } from 'react'
import {GraduationCap, Users, School, BookOpen, ClipboardCheck, Link2, CalendarClock} from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'
import LinkTile from '../../components/ui/LinkTile'
import { useAuth } from '../../context/AuthContext'
import { alunoApi } from '../../api/alunoApi'
import { professorApi } from '../../api/professorApi'
import { turmaApi } from '../../api/turmaApi'
import { disciplinaApi } from '../../api/disciplinaApi'

export default function AdminDashboard() {
  const { usuario } = useAuth()
  const [contagens, setContagens] = useState(null)

  useEffect(() => {
    let ativo = true
    async function carregar() {
      const params = { page: 0, size: 1 }
      const [alunos, professores, turmas, disciplinas] = await Promise.all([
        alunoApi.listar(params),
        professorApi.listar(params),
        turmaApi.listar(params),
        disciplinaApi.listar(params),
      ])
      if (!ativo) return
      setContagens({
        alunos: alunos.totalElements,
        professores: professores.totalElements,
        turmas: turmas.totalElements,
        disciplinas: disciplinas.totalElements,
      })
    }
    carregar()
    return () => {
      ativo = false
    }
  }, [])

  return (
    <div>
      <PageHeader title={`Olá, ${usuario.nome.split(' ')[0]}`} subtitle="Visão geral da instituição e atalhos para a gestão do dia a dia."/>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Alunos" value={contagens?.alunos} loading={!contagens} tone="ink" />
        <StatCard label="Professores" value={contagens?.professores} loading={!contagens} tone="brand" />
        <StatCard label="Turmas" value={contagens?.turmas} loading={!contagens} tone="ink" />
        <StatCard label="Disciplinas" value={contagens?.disciplinas} loading={!contagens} tone="amber" />
      </div>

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-ink-400">Gestão</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <LinkTile to="/admin/alunos" icon={GraduationCap} title="Alunos" description="Cadastrar, editar e inativar alunos." />
        <LinkTile to="/admin/solicitacoes-matricula" icon={ClipboardCheck} title="Solicitações de Matrícula" description="Aprovar ou rejeitar pedidos vindos do cadastro público." />
        <LinkTile to="/admin/professores" icon={Users} title="Professores" description="Cadastrar, editar e inativar professores." />
        <LinkTile to="/admin/turmas" icon={School} title="Turmas" description="Séries, turnos e anos letivos." />
        <LinkTile to="/admin/disciplinas" icon={BookOpen} title="Disciplinas" description="Carga horária e disciplinas ativas." />
        <LinkTile to="/admin/alocacoes" icon={Link2} title="Alocações" description="Vincular professores a disciplinas e turmas." />
        <LinkTile to="/admin/horarios" icon={CalendarClock} title="Grade horária" description="Horários de aula de cada alocação." />
      </div>
    </div>
  )
}
