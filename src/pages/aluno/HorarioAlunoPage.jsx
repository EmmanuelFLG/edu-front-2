import { useEffect, useState } from 'react'
import { CalendarClock } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/Spinner'
import WeeklySchedule from '../../components/WeeklySchedule'
import { horarioApi } from '../../api/horarioApi'
import { useToast } from '../../context/ToastContext'
import { extrairMensagemErro } from '../../api/axiosClient'

export default function HorarioAlunoPage() {
  const toast = useToast()
  const [horarios, setHorarios] = useState(null)

  useEffect(() => {
    let ativo = true
    horarioApi
      .minhaTurma()
      .then((dados) => ativo && setHorarios(dados))
      .catch((err) => toast.erro(extrairMensagemErro(err, 'Não foi possível carregar sua grade horária.')))
    return () => {
      ativo = false
    }
  }, []) // 

  return (
    <div>
      <PageHeader title="Meu horário" subtitle="Suas aulas da semana, por dia." />
      {horarios === null ? <Spinner /> : <WeeklySchedule
        horarios={horarios}
        tipo="aluno"
      />}
    </div>
  )
}
