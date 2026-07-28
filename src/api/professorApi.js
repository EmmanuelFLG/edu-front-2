import { api } from './axiosClient'

export const professorApi = {
  listar: (params) => api.get('/professores', { params }).then((r) => r.data),
  buscar: (id) => api.get(`/professores/${id}`).then((r) => r.data),
  criar: (data) => api.post('/professores', data).then((r) => r.data),
  atualizar: (id, data) => api.put(`/professores/${id}`, data).then((r) => r.data),
  excluir: (id) => api.delete(`/professores/${id}`),
  listarParaSelect: () =>
    api.get('/professores', { params: { size: 1000, sort: 'nome' } }).then((r) => r.data.content),

  async importarCsv(file) {
    const form = new FormData()
    form.append('file', file)
    const res = await api.post('/professores/importar', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  }
}
