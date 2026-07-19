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
  RECUPERACAO: 'Recuperação',
  REPROVADO: 'Reprovado',
}
