import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('edugestor.token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handler externo, plugado pelo AuthContext, chamado quando o token
// é rejeitado (expirado/ inválido) em qualquer chamada.
let onUnauthorized = () => {}
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      onUnauthorized()
    }
    return Promise.reject(error)
  }
)

/**
 * Extrai uma mensagem amigável do formato de erro padronizado do backend
 * (ErrorResponse: timestamp, status, erro, mensagem, caminho, detalhes).
 */
export function extrairMensagemErro(error, fallback = 'Não foi possível concluir a operação.') {
  const data = error?.response?.data
  if (!data) return error?.message || fallback
  if (data.detalhes && typeof data.detalhes === 'object') {
    const primeiraChave = Object.keys(data.detalhes)[0]
    if (primeiraChave) return `${primeiraChave}: ${data.detalhes[primeiraChave]}`
  }
  return data.mensagem || data.erro || fallback
}
