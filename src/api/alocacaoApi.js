import { api } from './axiosClient'

export const alocacaoApi = {
  listar: (params) => api.get('/alocacoes', { params }).then((r) => r.data),
  buscar: (id) => api.get(`/alocacoes/${id}`).then((r) => r.data),
  criar: (data) => api.post('/alocacoes', data).then((r) => r.data),
  excluir: (id) => api.delete(`/alocacoes/${id}`),
  // alocações do professor autenticado — usado para montar os seletores de Notas/Presenças
  minhas: () => api.get('/alocacoes/minhas').then((r) => r.data),

  async importarCsv(file) {
    const form = new FormData()
    form.append('file', file)
    const res = await api.post('/alocacoes/importar', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  }
}
