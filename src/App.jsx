import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'
import AppLayout from './layouts/AppLayout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import NotFoundPage from './pages/NotFoundPage'
import { ROLES, ROLE_HOME } from './utils/constants'

import AdminDashboard from './pages/admin/AdminDashboard'
import AlunosPage from './pages/admin/AlunosPage'
import ProfessoresPage from './pages/admin/ProfessoresPage'
import TurmasPage from './pages/admin/TurmasPage'
import DisciplinasPage from './pages/admin/DisciplinasPage'
import AlocacoesPage from './pages/admin/AlocacoesPage'
import HorariosPage from './pages/admin/HorariosPage'
import SolicitacoesMatriculaPage from './pages/admin/SolicitacoesMatriculaPage'

import ProfessorDashboard from './pages/professor/ProfessorDashboard'
import NotasPage from './pages/professor/NotasPage'
import PresencasPage from './pages/professor/PresencasPage'
import HorarioProfessorPage from './pages/professor/HorarioProfessorPage'

import AlunoDashboard from './pages/aluno/AlunoDashboard'
import BoletimPage from './pages/aluno/BoletimPage'
import HorarioAlunoPage from './pages/aluno/HorarioAlunoPage'

function RaizAutenticada() {
  const { usuario } = useAuth()
  return <Navigate to={ROLE_HOME[usuario.perfil] || '/login'} replace />
}

export default function App() {
  const { estaAutenticado, usuario } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={estaAutenticado ? <Navigate to={ROLE_HOME[usuario.perfil]} replace /> : <LoginPage />}
      />
      <Route path="/register" element ={<RegisterPage/>}/>

      <Route path="/" element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<RaizAutenticada />} />

          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/alunos" element={<AlunosPage />} />
            <Route path="admin/professores" element={<ProfessoresPage />} />
            <Route path="admin/turmas" element={<TurmasPage />} />
            <Route path="admin/disciplinas" element={<DisciplinasPage />} />
            <Route path="admin/solicitacoes-matricula" element={<SolicitacoesMatriculaPage />} />
            <Route path="admin/alocacoes" element={<AlocacoesPage />} />
            <Route path="admin/horarios" element={<HorariosPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={[ROLES.PROFESSOR]} />}>
            <Route path="professor" element={<ProfessorDashboard />} />
            <Route path="professor/notas" element={<NotasPage />} />
            <Route path="professor/presencas" element={<PresencasPage />} />
            <Route path="professor/horario" element={<HorarioProfessorPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={[ROLES.ALUNO]} />}>
            <Route path="aluno" element={<AlunoDashboard />} />
            <Route path="aluno/boletim" element={<BoletimPage />} />
            <Route path="aluno/horario" element={<HorarioAlunoPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
