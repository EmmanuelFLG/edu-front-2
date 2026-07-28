import { api } from './axiosClient'

export const authApi = {
  login: (email, senha) => api.post('/auth/login', { email, senha }).then((r) => r.data),
}
