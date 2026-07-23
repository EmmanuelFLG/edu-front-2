import { GraduationCap } from 'lucide-react'
import CrudPage from '../../components/CrudPage'
import Badge from '../../components/ui/Badge'
import { alunoApi } from '../../api/alunoApi'

export default function AlunosPage() {
  return (
    <CrudPage
      icon={GraduationCap}
      title="Alunos"
      subtitle="Cadastro, edição e inativação dos alunos da instituição."
      api={alunoApi}
      sortField="nome"
      searchKeys={['nome', 'email', 'matricula']}
      searchPlaceholder="Buscar por nome, email ou matrícula…"
      emptyTitle="Nenhum aluno cadastrado"
      emptyDescription="Cadastre o primeiro aluno para começar a montar as turmas."
      createLabel="Novo aluno"
      formTitle={{ create: 'Novo aluno', edit: 'Editar aluno' }}
      deleteLabel="Inativar"
      deleteDescription={(row) => `"${row.nome}" será marcado como inativo. O histórico acadêmico é preservado.`}
      columns={[
        { key: 'nome', label: 'Nome' },
        { key: 'email', label: 'Email' },
        { key: 'matricula', label: 'Matrícula' },
        {
          key: 'ativo',
          label: 'Status',
          render: (row) => <Badge tone={row.ativo ? 'good' : 'neutral'}>{row.ativo ? 'Ativo' : 'Inativo'}</Badge>,
        },
      ]}
      fields={[
        { name: 'nome', label: 'Nome completo', required: true, placeholder: 'Ex.: Maria da Silva' },
        { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'aluno@escola.com' },
        {
          name: 'senha',
          label: 'Senha',
          type: 'password',
          placeholder: '••••••••',
          hint: 'Deixe em branco para manter a senha atual (ou gerar a padrão em um novo cadastro).',
          parse: (v) => (v && v.trim() ? v : undefined),
        },
      ]}
    />
  )
}
