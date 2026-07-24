import { api } from './axiosClient'

export const professorApi = {
  listar: (params) => api.get('/professores', { params }).then((r) => r.data),
  buscar: (id) => api.get(`/professores/${id}`).then((r) => r.data),
  criar: (data) => api.post('/professores', data).then((r) => r.data),
  atualizar: (id, data) => api.put(`/professores/${id}`, data).then((r) => r.data),
  excluir: (id) => api.delete(`/professores/${id}`),
  listarParaSelect: () =>
    api.get('/professores', { params: { size: 1000, sort: 'nome' } }).then((r) => r.data.content),
}
