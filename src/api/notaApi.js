import { api } from './axiosClient'

export const notaApi = {
  criar: (data) => api.post('/notas', data).then((r) => r.data),
  atualizar: (id, data) => api.put(`/notas/${id}`, data).then((r) => r.data),
  porTurma: (turmaId) => api.get(`/notas/turma/${turmaId}`).then((r) => r.data),
  porAluno: (alunoId) => api.get(`/notas/aluno/${alunoId}`).then((r) => r.data),
}
