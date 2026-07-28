import CrudPage from '../../components/CrudPage'
import Badge from '../../components/ui/Badge'
import DetalhesAluno from '../../components/DetalhesAluno'
import { alunoApi } from '../../api/alunoApi'
import { turmaApi } from '../../api/turmaApi'
import { SERIES_ANO, TURNOS } from '../../utils/constants'

const TURNO_LABEL = Object.fromEntries(TURNOS.map((t) => [t.value, t.label]))

export default function AlunosPage() {
  return (
    <CrudPage
      title="Alunos" subtitle="Gerenciamento central de matrículas e dados dos alunos."
      api={alunoApi} importCsv={{ enabled: true, template: '/modelos/alunos.csv', onImport: alunoApi.importarCsv }}
      sortField="nome" searchKeys={['nome', 'email', 'matricula', 'cpf']} searchPlaceholder="Buscar por nome, email, matrícula ou CPF…"
      emptyTitle="Nenhum aluno cadastrado" emptyDescription="Cadastre o primeiro aluno para começar a montar as turmas."
      createLabel="Novo aluno" formTitle={{ create: 'Matricular Novo Aluno', edit: 'Editar Ficha do Aluno' }} deleteLabel="Inativar"
      deleteDescription={(row) => `A matrícula de "${row.nome}" será inativada. O histórico é preservado.`}
      
      // Chamando o componente detalhe
      renderView={(aluno) => <DetalhesAluno aluno={aluno} />}
      viewTitle={(aluno) => aluno?.nome || 'Detalhes do aluno'}
      
      columns={[
        { key: 'nome', label: 'Nome' },
        { key: 'matricula', label: 'Matrícula' },
        {
          key: 'turma', label: 'Turma',
          render: (row) => row.turmaNome
            ? <span>{row.turmaNome} <span className="text-xs text-ink-400">({TURNO_LABEL[row.turmaTurno] || row.turmaTurno})</span></span>
            : <span className="italic text-ink-300">Sem turma</span>,
        },
        { key: 'ativo', label: 'Status', render: (row) => <Badge tone={row.ativo ? 'good' : 'neutral'}>{row.ativo ? 'Ativo' : 'Inativo'}</Badge> }
      ]}
      fields={[
        // DADOS DO ALUNO
        { name: 'nome', label: 'Nome Completo *', required: true, section: 'Dados do Aluno', gridSpan: 'col-span-4' },
        { name: 'dataNascimento', label: 'Data de Nascimento *', type: 'date', required: true, section: 'Dados do Aluno', gridSpan: 'col-span-2' },
        { name: 'sexo', label: 'Sexo', type: 'select', section: 'Dados do Aluno', gridSpan: 'col-span-2', options: [{ value: 'MASCULINO', label: 'Masculino' }, { value: 'FEMININO', label: 'Feminino' }, { value: 'OUTRO', label: 'Outro' }] },
        { name: 'cpf', label: 'CPF', placeholder: '000.000.000-00', section: 'Dados do Aluno', gridSpan: 'col-span-2' },
        { name: 'rg', label: 'RG', placeholder: '0.000.000', section: 'Dados do Aluno', gridSpan: 'col-span-2' },
        { name: 'telefone', label: 'Contato / Telefone', placeholder: '(00) 00000-0000', section: 'Dados do Aluno', gridSpan: 'col-span-2' },
        { name: 'email', label: 'E-mail', type: 'email', placeholder: 'exemplo@escola.com', section: 'Dados do Aluno', gridSpan: 'col-span-2' },
        
        // ENDEREÇO
        { name: 'cep', label: 'CEP', placeholder: '00000-000', section: 'Endereço', gridSpan: 'col-span-2' },
        { name: 'rua', label: 'Rua', section: 'Endereço', gridSpan: 'col-span-4' },
        { name: 'numero', label: 'Número', section: 'Endereço', gridSpan: 'col-span-2' },
        { name: 'complemento', label: 'Complemento', placeholder: 'Apto, Bloco, etc.', section: 'Endereço', gridSpan: 'col-span-4' },
        { name: 'bairro', label: 'Bairro', section: 'Endereço', gridSpan: 'col-span-2' },
        { name: 'cidade', label: 'Cidade', section: 'Endereço', gridSpan: 'col-span-3' },
        { name: 'estado', label: 'Estado', placeholder: 'PB', section: 'Endereço', gridSpan: 'col-span-1', parse: (v) => String(v).toUpperCase() },
        
        // INFORMAÇÕES ESCOLARES
        { name: 'serieAno', label: 'Série / Ano *', type: 'select', required: true, section: 'Informações Escolares', gridSpan: 'col-span-3', options: SERIES_ANO, hint: 'Usada para escolher automaticamente a turma na criação.' },
        { name: 'turno', label: 'Turno *', type: 'select', required: true, section: 'Informações Escolares', gridSpan: 'col-span-3', options: TURNOS },
        {
          name: 'turmaId', label: 'Turma', type: 'select-async', section: 'Informações Escolares', gridSpan: 'col-span-6',
          hidden: (isEdit) => !isEdit, placeholder: 'Manter turma atual…', hint: 'Altere somente se for necessário transferir o aluno para outra turma.',
          fetchOptions: async () => {
            const turmas = await turmaApi.listarParaSelect()
            return turmas.map((t) => ({ value: t.id, label: `${t.nome} (${TURNO_LABEL[t.turno] || t.turno})` }))
          },
          getEditValue: (row) => row.turmaId ?? '',
          parse: (v) => (v ? Number(v) : null)
        }
      ]}
    />
  )
}