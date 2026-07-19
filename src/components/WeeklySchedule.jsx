import { CalendarClock, MapPin } from 'lucide-react'
import EmptyState from './ui/EmptyState'
import { DIAS_SEMANA } from '../utils/constants'
import { formatarHora } from '../utils/format'

export default function WeeklySchedule({ horarios, mostrarProfessor = false }) {
  if (!horarios || horarios.length === 0) {
    return (
      <EmptyState
        icon={CalendarClock}
        title="Nenhum horário cadastrado"
        description="Ainda não há horários de aula cadastrados para consulta."
      />
    )
  }

  const porDia = DIAS_SEMANA.map((dia) => ({
    ...dia,
    itens: horarios
      .filter((h) => h.diaSemana === dia.value)
      .sort((a, b) => (a.horaInicio > b.horaInicio ? 1 : -1)),
  })).filter((dia) => dia.itens.length > 0)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {porDia.map((dia) => (
        <div key={dia.value} className="card overflow-hidden">
          <div className="border-b border-ink-50 bg-ink-600 px-4 py-2.5">
            <p className="font-display text-sm font-semibold text-white">{dia.label}-feira</p>
          </div>
          <ul className="divide-y divide-ink-50">
            {dia.itens.map((h) => (
              <li key={h.id} className="px-4 py-3">
                <p className="font-mono text-xs font-semibold text-brand-600">
                  {formatarHora(h.horaInicio)} – {formatarHora(h.horaFim)}
                </p>
                <p className="mt-1 text-sm font-medium text-ink-700">{h.disciplina}</p>
                <p className="text-xs text-ink-400">
                  {h.turma}
                  {mostrarProfessor && ` · ${h.professor}`}
                </p>
                {h.sala && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-ink-300">
                    <MapPin size={11} />
                    {h.sala}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
