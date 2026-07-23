import { CalendarClock, MapPin } from 'lucide-react'
import EmptyState from './ui/EmptyState'
import { DIAS_SEMANA } from '../utils/constants'
import { formatarHora } from '../utils/format'

export default function WeeklySchedule({
  horarios,
  tipo = 'aluno', // aluno | professor
}) {

  if (!horarios || horarios.length === 0) {
    return (
      <EmptyState
        icon={CalendarClock}
        title="Nenhum horário cadastrado"
        description="Ainda não há horários de aula cadastrados para consulta."
      />
    )
  }


  const dias = DIAS_SEMANA.filter((dia) =>
    [
      'SEGUNDA',
      'TERCA',
      'QUARTA',
      'QUINTA',
      'SEXTA'
    ].includes(dia.value)
  )


  const horariosUnicos = [
    ...new Set(
      horarios.map(
        (h) => `${h.horaInicio}-${h.horaFim}`
      )
    ),
  ].sort()


  function buscarAula(hora, dia) {
    return horarios.find(
      (h) =>
        `${h.horaInicio}-${h.horaFim}` === hora &&
        h.diaSemana === dia
    )
  }


  return (
    <div className="card overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full border-collapse text-sm">

          <thead>
            <tr className="border-b border-ink-50 bg-ink-50/50">

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-ink-400">
                Horário
              </th>

              {dias.map((dia) => (
                <th
                  key={dia.value}
                  className="px-4 py-3 text-center text-xs font-semibold uppercase text-ink-400"
                >
                  {dia.label}
                </th>
              ))}

            </tr>
          </thead>


          <tbody>

            {horariosUnicos.map((hora) => (

              <tr
                key={hora}
                className="border-b border-ink-50 last:border-0"
              >

                <td className="px-4 py-4 whitespace-nowrap font-mono text-xs font-semibold text-brand-600">

                  {formatarHora(hora.split('-')[0])}
                  {' – '}
                  {formatarHora(hora.split('-')[1])}

                </td>


                {dias.map((dia) => {

                  const aula = buscarAula(
                    hora,
                    dia.value
                  )


                  return (

                    <td
                      key={dia.value}
                      className="px-3 py-3 text-center align-top"
                    >

                      {aula ? (

                        <div className="rounded-lg bg-brand-50 px-3 py-2">


                          {/* Matéria */}
                          <p className="font-semibold text-ink-700">
                            {aula.disciplina}
                          </p>


                          {/* Professor vê turma
                              Aluno vê professor */}
                          <p className="mt-1 text-xs text-ink-400">
                            {tipo === 'professor'
                              ? `${aula.serie} ${aula.turma}`
                              : aula.professor
                            }
                          </p>


                          {/* Sala */}
                          {tipo === 'professor' && aula.sala && (

                            <p className="mt-1 flex justify-center items-center gap-1 text-xs text-ink-300">

                              <MapPin size={11} />

                              {aula.sala}

                            </p>

                          )}


                        </div>

                      ) : (

                        <span className="text-ink-300">
                          —
                        </span>

                      )}

                    </td>

                  )

                })}

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}