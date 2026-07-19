import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  BookOpen,
  ClipboardList,
  Link2,
  CalendarClock,
  NotebookPen,
  CalendarCheck,
  ScrollText,
  Menu,
  X,
  LogOut,
  GraduationCap as Logo,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { ROLES, ROLE_LABEL } from '../utils/constants'
import { iniciais } from '../utils/format'

const NAV = {
  [ROLES.ADMIN]: [
    { to: '/admin', label: 'Início', icon: LayoutDashboard, end: true },
    { to: '/admin/alunos', label: 'Alunos', icon: GraduationCap },
    { to: '/admin/professores', label: 'Professores', icon: Users },
    { to: '/admin/turmas', label: 'Turmas', icon: School },
    { to: '/admin/disciplinas', label: 'Disciplinas', icon: BookOpen },
    { to: '/admin/matriculas', label: 'Matrículas', icon: ClipboardList },
    { to: '/admin/alocacoes', label: 'Alocações', icon: Link2 },
    { to: '/admin/horarios', label: 'Grade horária', icon: CalendarClock },
  ],
  [ROLES.PROFESSOR]: [
    { to: '/professor', label: 'Início', icon: LayoutDashboard, end: true },
    { to: '/professor/notas', label: 'Notas', icon: NotebookPen },
    { to: '/professor/presencas', label: 'Frequência', icon: CalendarCheck },
    { to: '/professor/horario', label: 'Meu horário', icon: CalendarClock },
  ],
  [ROLES.ALUNO]: [
    { to: '/aluno', label: 'Início', icon: LayoutDashboard, end: true },
    { to: '/aluno/boletim', label: 'Boletim', icon: ScrollText },
    { to: '/aluno/horario', label: 'Meu horário', icon: CalendarClock },
  ],
}

function SidebarContent({ items, onNavigate }) {
  return (
    <>
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white">
          <Logo size={19} />
        </div>
        <div>
          <p className="font-display text-base font-bold leading-none text-white">EduGestor</p>
          <p className="mt-1 text-[11px] text-ink-300">gestão escolar</p>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 px-3 pb-4">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-brand-500 text-white' : 'text-ink-200 hover:bg-ink-700 hover:text-white'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  )
}

export default function AppLayout() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const items = NAV[usuario.perfil] || []

  function sair() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-paper">
      {/* Sidebar — desktop */}
      <aside className="hidden w-60 shrink-0 flex-col bg-ink-800 md:flex">
        <SidebarContent items={items} />
      </aside>

      {/* Sidebar — drawer mobile */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-ink-900/50" onClick={() => setDrawerOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-ink-800">
            <button
              className="absolute right-3 top-4 rounded-md p-1.5 text-ink-300 hover:bg-ink-700"
              onClick={() => setDrawerOpen(false)}
              aria-label="Fechar menu"
            >
              <X size={18} />
            </button>
            <SidebarContent items={items} onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-ink-100 bg-white px-4 md:px-6">
          <button
            className="rounded-md p-2 text-ink-500 hover:bg-ink-50 md:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>
          <span className="hidden font-display text-sm font-semibold text-ink-400 md:block">
            {ROLE_LABEL[usuario.perfil]}
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 font-display text-xs font-bold text-amber-700">
                {iniciais(usuario.nome)}
              </div>
              <span className="hidden text-sm font-medium text-ink-700 sm:block">{usuario.nome}</span>
            </div>
            <button
              onClick={sair}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-ink-400 hover:bg-bad-50 hover:text-bad-500"
              title="Sair"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
