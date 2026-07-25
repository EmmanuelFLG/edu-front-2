import { api } from './axiosClient'

export const turmaApi = {
  listar: (params) => api.get('/turmas', { params }).then((r) => r.data),
  buscar: (id) => api.get(`/turmas/${id}`).then((r) => r.data),
  criar: (data) => api.post('/turmas', data).then((r) => r.data),
  atualizar: (id, data) => api.put(`/turmas/${id}`, data).then((r) => r.data),
  excluir: (id) => api.delete(`/turmas/${id}`),
  listarParaSelect: () => api.get('/turmas', { params: { size: 1000, sort: 'nome' } }).then((r) => r.data.content),

  // Endpoint público (sem token) — usado na tela de auto-matrícula (/register).
  listarPublicas: () => api.get('/turmas/publicas').then((r) => r.data),

  async importarCsv(file) {
    const form = new FormData()
    form.append('file', file)
    const res = await api.post('/turmas/importar', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  }
}
