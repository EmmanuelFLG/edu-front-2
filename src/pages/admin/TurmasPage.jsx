import { School } from 'lucide-react'
import CrudPage from '../../components/CrudPage'
import Badge from '../../components/ui/Badge'
import { turmaApi } from '../../api/turmaApi'
import { TURNOS, SERIES_TURMA } from '../../utils/constants'

const TURNO_LABEL = Object.fromEntries(TURNOS.map((t) => [t.value, t.label]))

export default function TurmasPage() {
  return (
    <CrudPage
      icon={School} title="Turmas" subtitle="Turmas da instituição, por série, turno e ano letivo."
      api={turmaApi} importCsv={{ enabled: true, template: '/modelos/turmas.csv', onImport: turmaApi.importarCsv }}
      sortField="nome" searchKeys={['nome', 'serie']} searchPlaceholder="Buscar por nome ou série…"
      emptyTitle="Nenhuma turma cadastrada" emptyDescription="Cadastre uma turma para que a matrícula automática de alunos tenha onde alocar."
      createLabel="Nova turma" formTitle={{ create: 'Nova Turma', edit: 'Editar Turma' }} deleteLabel="Remover"
      deleteDescription={(row) => `A turma "${row.nome}" será removida permanentemente.`}

      // Colunas da listagem
      columns={[
        { key: 'nome', label: 'Turma' },
        { key: 'serie', label: 'Série' },
        { key: 'turno', label: 'Turno', render: (row) => <Badge tone="brand">{TURNO_LABEL[row.turno] || row.turno}</Badge> },
        { key: 'anoLetivo', label: 'Ano letivo' },
        {
          key: 'ocupacao',
          label: 'Vagas',
          render: (row) => (
            <span className={row.capacidade && row.matriculasAtivas >= row.capacidade ? 'font-semibold text-bad-500' : ''}>
              {row.matriculasAtivas ?? 0}{row.capacidade ? ` / ${row.capacidade}` : ''}
            </span>
          ),
        },
      ]}

      // Mapeamento idêntico ao AlunosPage (com section e gridSpan)
      fields={[
        // DADOS DA TURMA
        { name: 'nome', label: 'Nome da Turma *', required: true, placeholder: 'Ex.: A', section: 'Dados da Turma', gridSpan: 'col-span-3' },
        {
          name: 'serie', label: 'Série *', type: 'select', required: true, options: SERIES_TURMA, section: 'Dados da Turma', gridSpan: 'col-span-3',
          hint: 'Precisa bater com a Série/Ano escolhida no cadastro do aluno para a alocação automática funcionar.',
        },
        { name: 'turno', label: 'Turno *', type: 'select', required: true, options: TURNOS, section: 'Dados da Turma', gridSpan: 'col-span-3' },
        { name: 'anoLetivo', label: 'Ano letivo *', type: 'number', required: true, placeholder: '2026', parse: (v) => Number(v), section: 'Dados da Turma', gridSpan: 'col-span-3' },
        {
          name: 'capacidade', label: 'Capacidade máxima', type: 'number', placeholder: 'Ex.: 40', section: 'Dados da Turma', gridSpan: 'col-span-3',
          hint: 'Opcional. Deixe em branco para não limitar o número de alunos.',
          parse: (v) => (v === '' || v === null || v === undefined ? null : Number(v)),
        },
      ]}
    />
  )
}
