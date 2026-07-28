import { BookOpen } from 'lucide-react'
import CrudPage from '../../components/CrudPage'
import Badge from '../../components/ui/Badge'
import { disciplinaApi } from '../../api/disciplinaApi'

export default function DisciplinasPage() {
  return (
    <CrudPage
      icon={BookOpen}
      title="Disciplinas"
      subtitle="Disciplinas oferecidas pela instituição e sua carga horária."
      api={disciplinaApi}
      sortField="nome"
      searchKeys={['nome']}
      searchPlaceholder="Buscar por nome…"
      emptyTitle="Nenhuma disciplina cadastrada"
      emptyDescription="Cadastre uma disciplina para poder alocar professores a ela."
      createLabel="Nova disciplina"
      formTitle={{ create: 'Nova disciplina', edit: 'Editar disciplina' }}
      deleteLabel="Inativar"
      deleteDescription={(row) => `"${row.nome}" será marcada como inativa.`}
      columns={[
        { key: 'nome', label: 'Disciplina' },
        { key: 'cargaHoraria', label: 'Carga horária', render: (row) => `${row.cargaHoraria}h` },
        {
          key: 'ativa',
          label: 'Status',
          render: (row) => <Badge tone={row.ativa ? 'good' : 'neutral'}>{row.ativa ? 'Ativa' : 'Inativa'}</Badge>,
        },
      ]}
      fields={[
        { name: 'nome', label: 'Nome da disciplina', required: true, placeholder: 'Ex.: Matemática' },
        {
          name: 'cargaHoraria',
          label: 'Carga horária (horas)',
          type: 'number',
          required: true,
          placeholder: '80',
          parse: (v) => Number(v),
        },
      ]}
    />
  )
}
