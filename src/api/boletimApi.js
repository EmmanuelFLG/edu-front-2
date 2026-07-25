import { api } from './axiosClient'

export const boletimApi = {
  consultar: () => api.get('/boletim').then((r) => r.data),
}
