import { api } from './axiosClient'

export const alunoApi = {
  listar: (params) => api.get('/alunos', { params }).then((r) => r.data),
  buscar: (id) => api.get(`/alunos/${id}`).then((r) => r.data),
  criar: (data) => api.post('/alunos', data).then((r) => r.data),
  atualizar: (id, data) => api.put(`/alunos/${id}`, data).then((r) => r.data),
  excluir: (id) => api.delete(`/alunos/${id}`),
  listarParaSelect: () => api.get('/alunos', { params: { size: 1000, sort: 'nome' } }).then((r) => r.data.content),

  async importarCsv(file) {
    const form = new FormData()
    form.append('file', file)
    const response = await api.post('/alunos/importar', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  }
}
