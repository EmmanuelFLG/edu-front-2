import { Link2 } from 'lucide-react'
import CrudPage from '../../components/CrudPage'
import { alocacaoApi } from '../../api/alocacaoApi'
import { professorApi } from '../../api/professorApi'
import { disciplinaApi } from '../../api/disciplinaApi'
import { turmaApi } from '../../api/turmaApi'

export default function AlocacoesPage() {
  return (
    <CrudPage
      icon={Link2}
      title="Alocações"
      subtitle="Quem ensina o quê, em qual turma — a base para notas, frequência e horários."
      api={alocacaoApi}
      searchKeys={['professorNome', 'disciplinaNome', 'turmaNome']}
      searchPlaceholder="Buscar por professor, disciplina ou turma…"
      emptyTitle="Nenhuma alocação cadastrada"
      emptyDescription="Vincule um professor a uma disciplina e turma para liberar o lançamento de notas."
      createLabel="Nova alocação"
      formTitle={{ create: 'Nova alocação' }}
      deleteLabel="Remover"
      deleteDescription={(row) => `A alocação de "${row.professorNome}" em "${row.disciplinaNome} — ${row.turmaNome}" será removida.`}
      columns={[
        { key: 'professorNome', label: 'Professor' },
        { key: 'disciplinaNome', label: 'Disciplina' },
        { key: 'turmaNome', label: 'Turma' },
      ]}
      fields={[
        {
          name: 'professorId',
          label: 'Professor',
          type: 'select-async',
          required: true,
          placeholder: 'Selecione o professor…',
          fetchOptions: async () => {
            const professores = await professorApi.listarParaSelect()
            return professores.map((p) => ({ value: p.id, label: p.nome }))
          },
          parse: (v) => Number(v),
        },
        {
          name: 'disciplinaId',
          label: 'Disciplina',
          type: 'select-async',
          required: true,
          placeholder: 'Selecione a disciplina…',
          fetchOptions: async () => {
            const disciplinas = await disciplinaApi.listarParaSelect()
            return disciplinas.map((d) => ({ value: d.id, label: d.nome }))
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
      ]}
    />
  )
}
