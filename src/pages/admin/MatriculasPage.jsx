import { ClipboardList } from 'lucide-react'
import CrudPage from '../../components/CrudPage'
import Badge from '../../components/ui/Badge'
import { matriculaApi } from '../../api/matriculaApi'
import { alunoApi } from '../../api/alunoApi'
import { turmaApi } from '../../api/turmaApi'

const anoAtual = new Date().getFullYear()

export default function MatriculasPage() {
  return (
    <CrudPage
      title="Matrículas"
      subtitle="Vínculo entre aluno e turma para um ano letivo."
      api={matriculaApi}
      searchKeys={['alunoNome', 'turmaNome']}
      searchPlaceholder="Buscar por aluno ou turma…"
      emptyTitle="Nenhuma matrícula registrada"
      emptyDescription="Matricule um aluno em uma turma para liberar notas, frequência e boletim."
      createLabel="Nova matrícula"
      formTitle={{ create: 'Matricular aluno' }}
      columns={[
        { key: 'alunoNome', label: 'Aluno' },
        { key: 'turmaNome', label: 'Turma' },
        { key: 'anoLetivo', label: 'Ano letivo' },
        {
          key: 'ativa',
          label: 'Status',
          render: (row) => <Badge tone={row.ativa ? 'good' : 'neutral'}>{row.ativa ? 'Ativa' : 'Inativa'}</Badge>,
        },
      ]}
      fields={[
        {
          name: 'alunoId',
          label: 'Aluno',
          type: 'select-async',
          required: true,
          placeholder: 'Selecione o aluno…',
          fetchOptions: async () => {
            const alunos = await alunoApi.listarParaSelect()
            return alunos.map((a) => ({ value: a.id, label: `${a.nome} — matrícula ${a.matricula}` }))
          },
          parse: (v) => Number(v),
        },
        {
          name: 'turmaId',
          label: 'Turma',
          type: 'select-async',
          required: true,
          placeholder: 'Selecione a turma…',
          fetchOptions: async () => {
            const turmas = await turmaApi.listarParaSelect()
            return turmas.map((t) => ({ value: t.id, label: `${t.nome} — ${t.serie} (${t.anoLetivo})` }))
          },
          parse: (v) => Number(v),
        },
        {
          name: 'anoLetivo',
          label: 'Ano letivo',
          type: 'number',
          required: true,
          defaultValue: anoAtual,
          parse: (v) => Number(v),
        },
      ]}
    />
  )
}
