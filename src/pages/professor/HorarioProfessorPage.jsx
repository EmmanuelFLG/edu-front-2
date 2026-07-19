import { useEffect, useState } from 'react'
import { CalendarClock } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/Spinner'
import WeeklySchedule from '../../components/WeeklySchedule'
import { horarioApi } from '../../api/horarioApi'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { extrairMensagemErro } from '../../api/axiosClient'

export default function HorarioProfessorPage() {
  const { usuario } = useAuth()
  const toast = useToast()
  const [horarios, setHorarios] = useState(null)

  useEffect(() => {
    let ativo = true
    horarioApi
      .porProfessor(usuario.id)
      .then((dados) => ativo && setHorarios(dados))
      .catch((err) => toast.erro(extrairMensagemErro(err, 'Não foi possível carregar sua grade horária.')))
    return () => {
      ativo = false
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <PageHeader icon={CalendarClock} title="Meu horário" subtitle="Suas aulas da semana, por dia." />
      {horarios === null ? <Spinner /> : <WeeklySchedule horarios={horarios} />}
    </div>
  )
}
