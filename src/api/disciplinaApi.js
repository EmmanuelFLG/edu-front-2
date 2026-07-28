import { api } from './axiosClient'

export const disciplinaApi = {
  listar: (params) => api.get('/disciplinas', { params }).then((r) => r.data),
  buscar: (id) => api.get(`/disciplinas/${id}`).then((r) => r.data),
  criar: (data) => api.post('/disciplinas', data).then((r) => r.data),
  atualizar: (id, data) => api.put(`/disciplinas/${id}`, data).then((r) => r.data),
  excluir: (id) => api.delete(`/disciplinas/${id}`),
  listarParaSelect: () =>
    api.get('/disciplinas', { params: { size: 1000, sort: 'nome' } }).then((r) => r.data.content),

  async importarCsv(file) {
    const form = new FormData()
    form.append('file', file)
    const res = await api.post('/disciplinas/importar', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  }
}
