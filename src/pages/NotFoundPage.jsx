import { Link } from 'react-router-dom'
import { CompassIcon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { ROLE_HOME } from '../utils/constants'

export default function NotFoundPage() {
  const { usuario, estaAutenticado } = useAuth()
  const destino = estaAutenticado ? ROLE_HOME[usuario.perfil] || '/login' : '/login'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-paper px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-100 text-ink-400">
        <CompassIcon size={26} />
      </div>
      <h1 className="font-display text-2xl font-bold text-ink-800">Página não encontrada</h1>
      <p className="max-w-sm text-sm text-ink-400">
        O endereço acessado não existe ou você não tem permissão para vê-lo.
      </p>
      <Link to={destino} className="btn-accent mt-3">
        Voltar ao início
      </Link>
    </div>
  )
}
