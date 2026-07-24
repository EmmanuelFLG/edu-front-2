import { api } from './axiosClient'

export const presencaApi = {
  criar: (data) => api.post('/presencas', data).then((r) => r.data),
  atualizar: (id, data) => api.put(`/presencas/${id}`, data).then((r) => r.data),
  porTurma: (turmaId) => api.get(`/presencas/turma/${turmaId}`).then((r) => r.data),
  porAluno: (alunoId) => api.get(`/presencas/aluno/${alunoId}`).then((r) => r.data),
}
