import Badge from './ui/Badge'
import { SERIES_ANO, TURNOS } from '../utils/constants'

const SERIE_LABEL = Object.fromEntries(SERIES_ANO.map((s) => [s.value, s.label]))
const TURNO_LABEL = Object.fromEntries(TURNOS.map((t) => [t.value, t.label]))
const SEXO_LABEL = { MASCULINO: 'Masculino', FEMININO: 'Feminino', OUTRO: 'Outro' }

function formatarData(iso) {
  if (!iso) return '—'
  const [ano, mes, dia] = iso.split('-')
  return `${dia}/${mes}/${ano}`
}

function Campo({ label, valor, span = 1 }) {
  return (
    <div className={span === 2 ? 'col-span-2' : span === 3 ? 'col-span-2 sm:col-span-3' : ''}>
      <dt className="text-xs text-ink-400">{label}</dt>
      <dd className="text-ink-700">{valor}</dd>
    </div>
  )
}

export default function DetalhesAluno({ aluno }) {
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
          <Campo label="Turma atual" valor={aluno.turmaNome ? `${aluno.turmaNome} (${TURNO_LABEL[aluno.turmaTurno] || aluno.turmaTurno})` : 'Sem turma'} span={3} />
        </dl>
      </section>
    </div>
  )
}