import { api } from './axiosClient'

export const registroApi = {
  registrarAluno: (data) => api.post('/auth/registro-aluno', data).then((r) => r.data),
}
