import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authApi } from '../api/authApi'
import { setUnauthorizedHandler } from '../api/axiosClient'

const AuthContext = createContext(null)

const STORAGE_KEY = 'edugestor.user'
const TOKEN_KEY = 'edugestor.token'

function lerUsuarioSalvo() {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY)
    return bruto ? JSON.parse(bruto) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(lerUsuarioSalvo)
  const [carregando, setCarregando] = useState(false)

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(TOKEN_KEY)
    setUsuario(null)
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(() => logout())
  }, [logout])

  const login = useCallback(async (email, senha) => {
    setCarregando(true)
    try {
      const resposta = await authApi.login(email, senha)
      const dadosUsuario = {
        id: resposta.id,
        nome: resposta.nome,
        email: resposta.email,
        perfil: resposta.perfil,
      }
      localStorage.setItem(TOKEN_KEY, resposta.token)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dadosUsuario))
      setUsuario(dadosUsuario)
      return dadosUsuario
    } finally {
      setCarregando(false)
    }
  }, [])

  const value = {
    usuario,
    estaAutenticado: !!usuario,
    carregando,
    login,
    logout,
    temPerfil: (...perfis) => !!usuario && perfis.includes(usuario.perfil),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth precisa ser usado dentro de um AuthProvider')
  return ctx
}
