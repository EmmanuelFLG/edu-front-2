export function formatarHora(hora) {
  if (!hora) return '—'
  return hora.slice(0, 5) // "07:00:00" -> "07:00"
}

export function formatarNota(valor) {
  if (valor === null || valor === undefined) return '—'
  return Number(valor).toFixed(1).replace('.', ',')
}

export function formatarPercentual(valor) {
  if (valor === null || valor === undefined) return '—'
  return `${Number(valor).toFixed(1).replace('.', ',')}%`
}

export function formatarData(data) {
  if (!data) return '—'
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

export function iniciais(nome) {
  if (!nome) return '?'
  const partes = nome.trim().split(/\s+/)
  const primeira = partes[0]?.[0] || ''
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : ''
  return (primeira + ultima).toUpperCase()
}

export function labelDiaCurto(dia) {
  const mapa = { SEGUNDA: 'Seg', TERCA: 'Ter', QUARTA: 'Qua', QUINTA: 'Qui', SEXTA: 'Sex', SABADO: 'Sáb' }
  return mapa[dia] || dia
}
