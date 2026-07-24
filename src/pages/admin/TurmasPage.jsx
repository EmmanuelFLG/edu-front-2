import { School } from 'lucide-react'
import CrudPage from '../../components/CrudPage'
import Badge from '../../components/ui/Badge'
import { turmaApi } from '../../api/turmaApi'
import { TURNOS } from '../../utils/constants'

const TURNO_LABEL = Object.fromEntries(TURNOS.map((t) => [t.value, t.label]))

export default function TurmasPage() {
  return (
    <CrudPage
      icon={School} title="Turmas" subtitle="Turmas da instituição, por série, turno e ano letivo."
      api={turmaApi} importCsv={{ enabled: true, template: '/modelos/turmas.csv', onImport: turmaApi.importarCsv }}
      sortField="nome" searchKeys={['nome', 'serie']} searchPlaceholder="Buscar por nome ou série…"
      emptyTitle="Nenhuma turma cadastrada" emptyDescription="Cadastre uma turma para alocar professores e alunos."
      createLabel="Nova turma" formTitle={{ create: 'Nova Turma', edit: 'Editar Turma' }} deleteLabel="Remover"
      deleteDescription={(row) => `A turma "${row.nome}" será removida permanentemente.`}
      
      // Colunas da listagem
      columns={[
        { key: 'nome', label: 'Turma' },
        { key: 'serie', label: 'Série' },
        { key: 'turno', label: 'Turno', render: (row) => <Badge tone="brand">{TURNO_LABEL[row.turno] || row.turno}</Badge> },
        { key: 'anoLetivo', label: 'Ano letivo' }
      ]}
      
      // Mapeamento idêntico ao AlunosPage (com section e gridSpan)
      fields={[
        // DADOS DA TURMA
        { name: 'nome', label: 'Nome da Turma *', required: true, placeholder: 'Ex.: A', section: 'Dados da Turma', gridSpan: 'col-span-3' },
        { name: 'serie', label: 'Série *', required: true, placeholder: 'Ex.: 1º', section: 'Dados da Turma', gridSpan: 'col-span-3' },
        { name: 'turno', label: 'Turno *', type: 'select', required: true, options: TURNOS, section: 'Dados da Turma', gridSpan: 'col-span-3' },
        { name: 'anoLetivo', label: 'Ano letivo *', type: 'number', required: true, placeholder: '2026', parse: (v) => Number(v), section: 'Dados da Turma', gridSpan: 'col-span-3' }
      ]}
    />
  )
}