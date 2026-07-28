import { api } from './axiosClient'

export const matriculaApi = {
  // roster (alunos ativos) de uma turma — usado pelo ADMIN e pelo PROFESSOR.
  // A matrícula em si (vínculo aluno-turma) agora é sempre gerada automaticamente
  // pelo sistema — ver alunoApi (criação/edição de aluno) e solicitacaoMatriculaApi (aprovação).
  porTurma: (turmaId) => api.get(`/matriculas/turma/${turmaId}`).then((r) => r.data),
}
