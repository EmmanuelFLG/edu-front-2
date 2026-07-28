import CrudPage from '../../components/CrudPage'
import Badge from '../../components/ui/Badge'
import { horarioApi } from '../../api/horarioApi'
import { alocacaoApi } from '../../api/alocacaoApi'
import { DIAS_SEMANA } from '../../utils/constants'
import { formatarHora, labelDiaCurto } from '../../utils/format'

export default function HorariosPage() {
  return (
    <CrudPage
      title="Grade Horária" subtitle="Horários de aula de cada alocação (professor + disciplina + turma)."
      api={horarioApi} importCsv={{ enabled: true, template: '/modelos/horarios.csv', onImport: horarioApi.importarCsv }}
      sortField="id" searchKeys={['professor', 'disciplina', 'turma', 'sala']} searchPlaceholder="Buscar por professor, disciplina, turma ou sala…"
      emptyTitle="Nenhum horário cadastrado" emptyDescription="Cadastre um horário de aula vinculado a uma alocação existente."
      createLabel="Novo horário" formTitle={{ create: 'Novo Horário de Aula', edit: 'Editar Horário de Aula' }} deleteLabel="Inativar"
      deleteDescription={(row) => `O horário de "${row.disciplina} — ${row.turma}" será marcado como inativo.`}
      columns={[
        { key: 'diaSemana', label: 'Dia', render: (row) => <Badge tone="brand">{labelDiaCurto(row.diaSemana)}</Badge> },
        { key: 'horario', label: 'Horário', render: (row) => <span className="font-mono text-xs">{formatarHora(row.horaInicio)} – {formatarHora(row.horaFim)}</span> },
        { key: 'turma', label: 'Turma' },
        { key: 'disciplina', label: 'Disciplina' },
        { key: 'professor', label: 'Professor' },
        { key: 'sala', label: 'Sala' }
      ]}
      fields={[
        // DADOS DO HORÁRIO
        { name: 'alocacaoId', label: 'Alocação (turma · disciplina · professor) *', type: 'select-async', required: true, placeholder: 'Selecione a alocação…', section: 'Dados do Horário', gridSpan: 'col-span-4', fetchOptions: async () => { const resp = await alocacaoApi.listar({ size: 1000, sort: 'turmaId' }); return resp.content.map((a) => ({ value: a.id, label: `${a.turmaNome} · ${a.disciplinaNome} · ${a.professorNome}` })) }, getEditValue: (row) => row.alocacaoId, parse: (v) => Number(v) },
        { name: 'sala', label: 'Sala *', required: true, placeholder: 'Ex.: Sala 03', section: 'Dados do Horário', gridSpan: 'col-span-2' },
        { name: 'diaSemana', label: 'Dia da Semana *', type: 'select', required: true, options: DIAS_SEMANA, section: 'Dados do Horário', gridSpan: 'col-span-2' },
        { name: 'horaInicio', label: 'Hora de Início *', type: 'time', required: true, section: 'Dados do Horário', gridSpan: 'col-span-2', getEditValue: (row) => row.horaInicio?.slice(0, 5) },
        { name: 'horaFim', label: 'Hora de Fim *', type: 'time', required: true, section: 'Dados do Horário', gridSpan: 'col-span-2', getEditValue: (row) => row.horaFim?.slice(0, 5) }
      ]}
    />
  )
}