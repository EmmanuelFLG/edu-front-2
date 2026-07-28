import { School } from 'lucide-react'
import CrudPage from '../../components/CrudPage'
import Badge from '../../components/ui/Badge'
import { turmaApi } from '../../api/turmaApi'
import { TURNOS } from '../../utils/constants'

const TURNO_LABEL = Object.fromEntries(TURNOS.map((t) => [t.value, t.label]))

export default function TurmasPage() {
  return (
    <CrudPage
      icon={School}
      title="Turmas"
      subtitle="Turmas da instituição, por série, turno e ano letivo."
      api={turmaApi}
      sortField="nome"
      searchKeys={['nome', 'serie']}
      searchPlaceholder="Buscar por nome ou série…"
      emptyTitle="Nenhuma turma cadastrada"
      emptyDescription="Cadastre uma turma para depois matricular alunos e alocar professores."
      createLabel="Nova turma"
      formTitle={{ create: 'Nova turma', edit: 'Editar turma' }}
      deleteLabel="Remover"
      deleteDescription={(row) => `A turma "${row.nome}" será removida permanentemente.`}
      columns={[
        { key: 'nome', label: 'Turma' },
        { key: 'serie', label: 'Série' },
        { key: 'turno', label: 'Turno', render: (row) => <Badge tone="brand">{TURNO_LABEL[row.turno] || row.turno}</Badge> },
        { key: 'anoLetivo', label: 'Ano letivo' },
      ]}
      fields={[
        { name: 'nome', label: 'Nome da turma', required: true, placeholder: 'Ex.: 1A' },
        { name: 'serie', label: 'Série', required: true, placeholder: 'Ex.: 1º ano' },
        { name: 'turno', label: 'Turno', type: 'select', required: true, options: TURNOS },
        {
          name: 'anoLetivo',
          label: 'Ano letivo',
          type: 'number',
          required: true,
          placeholder: '2026',
          parse: (v) => Number(v),
        },
      ]}
    />
  )
}
