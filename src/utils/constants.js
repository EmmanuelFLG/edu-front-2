export const ROLES = {
  ADMIN: 'ROLE_ADMIN',
  PROFESSOR: 'ROLE_PROFESSOR',
  ALUNO: 'ROLE_ALUNO',
}

export const ROLE_HOME = {
  [ROLES.ADMIN]: '/admin',
  [ROLES.PROFESSOR]: '/professor',
  [ROLES.ALUNO]: '/aluno',
}

export const ROLE_LABEL = {
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.PROFESSOR]: 'Professor',
  [ROLES.ALUNO]: 'Aluno',
}

export const TURNOS = [
  { value: 'MATUTINO', label: 'Matutino' },
  { value: 'VESPERTINO', label: 'Vespertino' },
  { value: 'NOTURNO', label: 'Noturno' },
  { value: 'INTEGRAL', label: 'Integral' },
]

// Mesmas 4 opções de série/ano usadas no cadastro de Aluno (enum SerieAno do backend).
export const SERIES_ANO = [
  { value: 'PRIMEIRO_ANO_TECNICO', label: '1º Ano - Ensino Técnico Integrado' },
  { value: 'SEGUNDO_ANO_TECNICO', label: '2º Ano - Ensino Técnico Integrado' },
  { value: 'TERCEIRO_ANO_TECNICO', label: '3º Ano - Ensino Técnico Integrado' },
  { value: 'SUBSEQUENTE', label: 'Técnico Subsequente' },
]

// A Turma guarda a série como texto livre — para a alocação automática de
// turma funcionar, o texto precisa ser EXATAMENTE igual à descrição da
// SerieAno correspondente no backend. Por isso aqui o "value" enviado é o
// próprio texto (igual ao label), não a chave do enum.
export const SERIES_TURMA = SERIES_ANO.map((s) => ({ value: s.label, label: s.label }))

export const STATUS_SOLICITACAO = [
  { value: 'PENDENTE', label: 'Pendente' },
  { value: 'APROVADA', label: 'Aprovada' },
  { value: 'REJEITADA', label: 'Rejeitada' },
]

export const DIAS_SEMANA = [
  { value: 'SEGUNDA', label: 'Segunda' },
  { value: 'TERCA', label: 'Terça' },
  { value: 'QUARTA', label: 'Quarta' },
  { value: 'QUINTA', label: 'Quinta' },
  { value: 'SEXTA', label: 'Sexta' },
  { value: 'SABADO', label: 'Sábado' },
]

export const STATUS_PRESENCA = [
  { value: 'PRESENTE', label: 'Presente' },
  { value: 'FALTA', label: 'Falta' },
  { value: 'FALTA_JUSTIFICADA', label: 'Falta justificada' },
]

export const BIMESTRES = [1, 2, 3, 4]

export const SITUACAO_LABEL = {
  APROVADO: 'Aprovado',
  BOM: 'Bom andamento',
  RECUPERACAO: 'Recuperação',
  ATENCAO: 'Atenção',
  REPROVADO: 'Reprovado',
  CUIDADO: 'Cuidado',
  EM_ANDAMENTO: 'Em andamento',
}