import { api } from './axiosClient'

export const horarioApi = {
  listar: (params) => api.get('/horarios', { params }).then((r) => r.data),
  buscar: (id) => api.get(`/horarios/${id}`).then((r) => r.data),
  criar: (data) => api.post('/horarios', data).then((r) => r.data),
  atualizar: (id, data) => api.put(`/horarios/${id}`, data).then((r) => r.data),
  excluir: (id) => api.delete(`/horarios/${id}`),
  porTurma: (turmaId) => api.get(`/turmas/${turmaId}/horarios`).then((r) => r.data),
  porProfessor: (professorId) => api.get(`/professores/${professorId}/horarios`).then((r) => r.data),
  minhaTurma: () => api.get('/horarios/minha-turma').then((r) => r.data),

  async importarCsv(file) {
    const form = new FormData()
    form.append('file', file)
    const res = await api.post('/horarios/importar', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  }
}
