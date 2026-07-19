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
      <div className="relative hidden flex-col justify-between overflow-hidden bg-ink-800 p-10 text-white md:flex">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-500/30 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500">
            <GraduationCap size={22} />
          </div>
          <span className="font-display text-xl font-bold">EduGestor</span>
        </div>

        <div className="relative max-w-sm">
          <p className="stamp-good bg-white/10 border-good-400 text-good-400 mb-5">painel único</p>
          <h1 className="font-display text-3xl font-bold leading-tight">
            Notas, frequência e horários — tudo no mesmo lugar.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-ink-200">
            Administração, professores e alunos acessam a mesma plataforma, cada um com a sua
            própria visão: cadastros para a secretaria, lançamento de notas e chamada para o
            professor, boletim e grade horária para o aluno.
          </p>
        </div>

        <p className="relative text-xs text-ink-300">
          Sistema de gestão escolar · uso interno da instituição
        </p>
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
                  placeholder="voce@escola.com"
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
