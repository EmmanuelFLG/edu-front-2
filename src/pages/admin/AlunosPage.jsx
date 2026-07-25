import CrudPage from '../../components/CrudPage'
import Badge from '../../components/ui/Badge'
import { alunoApi } from '../../api/alunoApi'
import { turmaApi } from '../../api/turmaApi'
import { SERIES_ANO, TURNOS } from '../../utils/constants'

const SERIE_LABEL = Object.fromEntries(SERIES_ANO.map((s) => [s.value, s.label]))
const TURNO_LABEL = Object.fromEntries(TURNOS.map((t) => [t.value, t.label]))
const SEXO_LABEL = { MASCULINO: 'Masculino', FEMININO: 'Feminino', OUTRO: 'Outro' }

function formatarData(iso) {
  if (!iso) return '—'
  const [ano, mes, dia] = iso.split('-')
  return `${dia}/${mes}/${ano}`
}

function DetalhesAluno({ aluno }) {
  return (
    <div className="space-y-5">
      <section>
        <h4 className="text-xs font-bold uppercase tracking-wide text-ink-800 border-b border-ink-200 pb-1.5">Dados do Aluno</h4>
        <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
          <Campo label="Nome" valor={aluno.nome} span={2} />
          <Campo label="Matrícula" valor={aluno.matricula} />
          <Campo label="Email" valor={aluno.email} span={2} />
          <Campo label="Status" valor={<Badge tone={aluno.ativo ? 'good' : 'neutral'}>{aluno.ativo ? 'Ativo' : 'Inativo'}</Badge>} />
          <Campo label="Data de Nascimento" valor={formatarData(aluno.dataNascimento)} />
          <Campo label="Sexo" valor={SEXO_LABEL[aluno.sexo] || '—'} />
          <Campo label="CPF" valor={aluno.cpf || '—'} />
          <Campo label="RG" valor={aluno.rg || '—'} />
          <Campo label="Telefone" valor={aluno.telefone || '—'} />
        </dl>
      </section>

      <section>
        <h4 className="text-xs font-bold uppercase tracking-wide text-ink-800 border-b border-ink-200 pb-1.5">Endereço</h4>
        <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
          <Campo label="CEP" valor={aluno.cep || '—'} />
          <Campo label="Rua" valor={aluno.rua || '—'} span={2} />
          <Campo label="Número" valor={aluno.numero || '—'} />
          <Campo label="Complemento" valor={aluno.complemento || '—'} span={2} />
          <Campo label="Bairro" valor={aluno.bairro || '—'} />
          <Campo label="Cidade" valor={aluno.cidade || '—'} />
          <Campo label="Estado" valor={aluno.estado || '—'} />
        </dl>
      </section>

      <section>
        <h4 className="text-xs font-bold uppercase tracking-wide text-ink-800 border-b border-ink-200 pb-1.5">Informações Escolares</h4>
        <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
          <Campo label="Série / Ano" valor={SERIE_LABEL[aluno.serieAno] || '—'} span={2} />
          <Campo label="Turno" valor={TURNO_LABEL[aluno.turno] || aluno.turno || '—'} />
          <Campo label="Turma atual" valor={aluno.turmaNome ? `${aluno.turmaNome} — ${aluno.turmaSerie} (${TURNO_LABEL[aluno.turmaTurno] || aluno.turmaTurno})` : 'Sem turma'} span={3} />
        </dl>
      </section>
    </div>
  )
}

function Campo({ label, valor, span = 1 }) {
  return (
    <div className={span === 2 ? 'col-span-2' : span === 3 ? 'col-span-2 sm:col-span-3' : ''}>
      <dt className="text-xs text-ink-400">{label}</dt>
      <dd className="text-ink-700">{valor}</dd>
    </div>
  )
}

export default function AlunosPage() {
  return (
    <CrudPage
      title="Alunos" subtitle="Gerenciamento central de matrículas e dados dos alunos."
      api={alunoApi} importCsv={{ enabled: true, template: '/modelos/alunos.csv', onImport: alunoApi.importarCsv }}
      sortField="nome" searchKeys={['nome', 'email', 'matricula', 'cpf']} searchPlaceholder="Buscar por nome, email, matrícula ou CPF…"
      emptyTitle="Nenhum aluno cadastrado" emptyDescription="Cadastre o primeiro aluno para começar a montar as turmas."
      createLabel="Novo aluno" formTitle={{ create: 'Matricular Novo Aluno', edit: 'Editar Ficha do Aluno' }} deleteLabel="Inativar"
      deleteDescription={(row) => `A matrícula de "${row.nome}" será inativada. O histórico é preservado.`}

      // Ficha completa — clique no ícone de olho na listagem
      renderView={(aluno) => <DetalhesAluno aluno={aluno} />}
      viewTitle={(aluno) => aluno?.nome || 'Detalhes do aluno'}

      // Colunas enxutas na listagem — o resto fica na ficha (botão "olho")
      columns={[
        { key: 'nome', label: 'Nome' },
        { key: 'matricula', label: 'Matrícula' },
        {
          key: 'turma',
          label: 'Turma',
          render: (row) => row.turmaNome
            ? <span>{row.turmaNome} <span className="text-xs text-ink-400">— {row.turmaSerie} ({TURNO_LABEL[row.turmaTurno] || row.turmaTurno})</span></span>
            : <span className="italic text-ink-300">Sem turma</span>,
        },
        { key: 'ativo', label: 'Status', render: (row) => <Badge tone={row.ativo ? 'good' : 'neutral'}>{row.ativo ? 'Ativo' : 'Inativo'}</Badge> },
      ]}

      // Mapeamento dos campos do formulário (agrupados por 'section' e 'gridSpan')
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
        {
          name: 'serieAno', label: 'Série / Ano *', type: 'select', required: true, section: 'Informações Escolares', gridSpan: 'col-span-3', options: SERIES_ANO,
          hint: 'Usada para escolher automaticamente a turma na criação.',
        },
        { name: 'turno', label: 'Turno *', type: 'select', required: true, section: 'Informações Escolares', gridSpan: 'col-span-3', options: TURNOS },
        {
          name: 'turmaId',
          label: 'Turma',
          type: 'select-async',
          section: 'Informações Escolares',
          gridSpan: 'col-span-6',
          // Só aparece ao editar: na criação a turma é atribuída automaticamente
          // (turma com menos alunos, entre as compatíveis com a Série/Turno acima).
          hidden: (isEdit) => !isEdit,
          placeholder: 'Manter turma atual…',
          hint: 'Altere somente se for necessário transferir o aluno para outra turma.',
          fetchOptions: async () => {
            const turmas = await turmaApi.listarParaSelect()
            return turmas.map((t) => ({ value: t.id, label: `${t.nome} — ${t.serie} (${TURNO_LABEL[t.turno] || t.turno})` }))
          },
          getEditValue: (row) => row.turmaId ?? '',
          parse: (v) => (v ? Number(v) : null),
        },
      ]}
    />
  )
}
