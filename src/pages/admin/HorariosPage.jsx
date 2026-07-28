import { CalendarClock } from 'lucide-react'
import CrudPage from '../../components/CrudPage'
import Badge from '../../components/ui/Badge'
import { horarioApi } from '../../api/horarioApi'
import { alocacaoApi } from '../../api/alocacaoApi'
import { DIAS_SEMANA } from '../../utils/constants'
import { formatarHora, labelDiaCurto } from '../../utils/format'

export default function HorariosPage() {
  return (
    <CrudPage
      icon={CalendarClock}
      title="Grade horária"
      subtitle="Horários de aula de cada alocação (professor + disciplina + turma)."
      api={horarioApi}
      searchKeys={['professor', 'disciplina', 'turma', 'sala']}
      searchPlaceholder="Buscar por professor, disciplina, turma ou sala…"
      emptyTitle="Nenhum horário cadastrado"
      emptyDescription="Cadastre um horário de aula vinculado a uma alocação existente."
      createLabel="Novo horário"
      formTitle={{ create: 'Novo horário de aula', edit: 'Editar horário de aula' }}
      deleteLabel="Inativar"
      deleteDescription={(row) => `O horário de "${row.disciplina} — ${row.turma}" será marcado como inativo.`}
      columns={[
        { key: 'diaSemana', label: 'Dia', render: (row) => <Badge tone="brand">{labelDiaCurto(row.diaSemana)}</Badge> },
        {
          key: 'horario',
          label: 'Horário',
          render: (row) => (
            <span className="font-mono text-xs">
              {formatarHora(row.horaInicio)} – {formatarHora(row.horaFim)}
            </span>
          ),
        },
        { key: 'turma', label: 'Turma' },
        { key: 'disciplina', label: 'Disciplina' },
        { key: 'professor', label: 'Professor' },
        { key: 'sala', label: 'Sala' },
      ]}
      fields={[
        {
          name: 'alocacaoId',
          label: 'Alocação (professor · disciplina · turma)',
          type: 'select-async',
          required: true,
          placeholder: 'Selecione a alocação…',
          fetchOptions: async () => {
            const resp = await alocacaoApi.listar({ size: 1000, sort: 'turmaId' })
            return resp.content.map((a) => ({
              value: a.id,
              label: `${a.turmaNome} · ${a.disciplinaNome} · ${a.professorNome}`,
            }))
          },
          getEditValue: (row) => row.alocacaoId,
          parse: (v) => Number(v),
        },
        { name: 'diaSemana', label: 'Dia da semana', type: 'select', required: true, options: DIAS_SEMANA },
        {
          name: 'horaInicio',
          label: 'Hora de início',
          type: 'time',
          required: true,
          getEditValue: (row) => row.horaInicio?.slice(0, 5),
        },
        {
          name: 'horaFim',
          label: 'Hora de fim',
          type: 'time',
          required: true,
          getEditValue: (row) => row.horaFim?.slice(0, 5),
        },
        { name: 'sala', label: 'Sala', required: true, placeholder: 'Ex.: Sala 03' },
      ]}
    />
  )
}
