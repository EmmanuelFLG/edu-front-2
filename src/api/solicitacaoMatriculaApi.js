import { api } from './axiosClient'

export const solicitacaoMatriculaApi = {
  listar: (params) => api.get('/solicitacoes-matricula', { params }).then((r) => r.data),
  buscar: (id) => api.get(`/solicitacoes-matricula/${id}`).then((r) => r.data),
  aprovar: (id) => api.post(`/solicitacoes-matricula/${id}/aprovar`).then((r) => r.data),
  rejeitar: (id, motivo) => api.post(`/solicitacoes-matricula/${id}/rejeitar`, { motivo }).then((r) => r.data),
}
