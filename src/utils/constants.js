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

// Ajustado para bater com os CSVs de Turmas criados (6º ao 9º ano)
export const SERIES_ANO = [
  { value: 'SEXTO_ANO', label: '6º Ano' },
  { value: 'SETIMO_ANO', label: '7º Ano' },
  { value: 'OITAVO_ANO', label: '8º Ano' },
  { value: 'NONO_ANO', label: '9º Ano' },
]

// Mantém a sua excelente lógica de espelhar o label para a Turma
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