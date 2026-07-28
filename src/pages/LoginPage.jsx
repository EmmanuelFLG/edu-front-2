import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { GraduationCap, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { extrairMensagemErro } from '../api/axiosClient'
import { ROLE_HOME } from '../utils/constants'

export default function LoginPage() {
  const { login, carregando } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    try {
      const usuario = await login(email, senha)
      const destino = location.state?.from?.pathname || ROLE_HOME[usuario.perfil] || '/'
      navigate(destino, { replace: true })
    } catch (err) {
      const msg = extrairMensagemErro(err, 'Email ou senha incorretos.')
      setErro(msg)
      toast.erro(msg)
    }
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Painel de marca */}
      <div className="relative hidden flex-col justify-center overflow-hidden bg-ink-800 px-12 py-10 text-white md:flex">
        

        {/* Logo */}
        <div className="relative">
          <span className="font-display text-4xl font-bold tracking-tight">
            EduGestor
          </span>
        </div>

        {/* Conteúdo principal */}
        <div className="relative mt-16 max-w-md">
          <h1 className="text-3xl font-bold leading-tight text-white">
            Notas, frequência e horários, tudo no mesmo lugar.
          </h1>

          <p className="mt-6 text-lg leading-8 text-ink-200">
            Administração, professores e alunos acessam a mesma plataforma, cada um
            com sua própria visão. A secretaria gerencia cadastros e matrículas,
            professores lançam notas e frequência, enquanto os alunos acompanham o
            boletim e a grade horária de forma simples e organizada.
          </p>
        </div>

        {/* Rodapé */}
        <div className="relative mt-16">
          <p className="text-base text-ink-300">
            Sistema de gestão escolar · Uso interno da instituição
          </p>
        </div>
      </div>

      {/* Formulário */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 md:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-600 text-white">
              <GraduationCap size={19} />
            </div>
            <span className="font-display text-lg font-bold text-ink-800">EduGestor</span>
          </div>

          <h2 className="font-display text-2xl font-semibold text-ink-800">Entrar</h2>
          <p className="mt-1 text-sm text-ink-400">Use as credenciais fornecidas pela sua instituição.</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="label-base">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@escola.com"
                  className="input-base pl-9"
                />
              </div>
            </div>

            <div>
              <label htmlFor="senha" className="label-base">
                Senha
              </label>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
                <input
                  id="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="input-base pl-9 pr-9"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-500"
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {erro && (
              <p role="alert" className="rounded-lg bg-bad-50 px-3 py-2 text-sm font-medium text-bad-600">
                {erro}
              </p>
            )}

            <button type="submit" disabled={carregando} className="btn-accent w-full py-2.5">
              {carregando ? 'Entrando…' : 'Entrar'}
              {!carregando && <ArrowRight size={16} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
