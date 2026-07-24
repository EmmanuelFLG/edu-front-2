import { api } from './axiosClient'

export const matriculaApi = {
  listar: (params) => api.get('/matriculas', { params }).then((r) => r.data),
  buscar: (id) => api.get(`/matriculas/${id}`).then((r) => r.data),
  criar: (data) => api.post('/matriculas', data).then((r) => r.data),
  // roster (alunos ativos) de uma turma — usado pelo ADMIN e pelo PROFESSOR
  porTurma: (turmaId) => api.get(`/matriculas/turma/${turmaId}`).then((r) => r.data),
}
