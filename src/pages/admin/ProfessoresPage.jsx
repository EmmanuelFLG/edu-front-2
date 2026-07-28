import CrudPage from '../../components/CrudPage'
import Badge from '../../components/ui/Badge'
import { professorApi } from '../../api/professorApi'

export default function ProfessoresPage() {
  return (
    <CrudPage
      title="Professores" subtitle="Cadastro, edição e inativação do corpo docente."
      api={professorApi} importCsv={{ enabled: true, template: '/modelos/professores.csv', onImport: professorApi.importarCsv }}
      sortField="nome" searchKeys={['nome', 'email']} searchPlaceholder="Buscar por nome ou email…"
      emptyTitle="Nenhum professor cadastrado" emptyDescription="Cadastre o primeiro professor para poder criar as alocações de turma."
      createLabel="Novo professor" formTitle={{ create: 'Novo Professor', edit: 'Editar Professor' }} deleteLabel="Inativar"
      deleteDescription={(row) => `"${row.nome}" será marcado como inativo. As alocações existentes são preservadas.`}
      columns={[
        { key: 'nome', label: 'Nome' },
        { key: 'email', label: 'Email' },
        { key: 'ativo', label: 'Status', render: (row) => <Badge tone={row.ativo ? 'good' : 'neutral'}>{row.ativo ? 'Ativo' : 'Inativo'}</Badge> }
      ]}
      fields={[
        { name: 'nome', label: 'Nome completo *', required: true, placeholder: 'Ex.: João Pereira', section: 'Dados do Professor', gridSpan: 'col-span-3' },
        { name: 'email', label: 'Email *', type: 'email', required: true, placeholder: 'professor@escola.com', section: 'Dados do Professor', gridSpan: 'col-span-3' },
        { name: 'senha', label: 'Senha', type: 'password', placeholder: '••••••••', hint: 'Deixe em branco para manter a senha atual.', section: 'Dados do Professor', gridSpan: 'col-span-6', parse: (v) => (v && v.trim() ? v : undefined) }
      ]}
    />
  )
}