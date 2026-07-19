import { SITUACAO_LABEL } from '../../utils/constants'

const CLASSES = {
  APROVADO: 'stamp-good',
  RECUPERACAO: 'stamp-warn',
  REPROVADO: 'stamp-bad',
}

export default function SituacaoStamp({ situacao }) {
  if (!situacao) return <span className="text-ink-300">—</span>
  return <span className={CLASSES[situacao] || 'stamp'}>{SITUACAO_LABEL[situacao] || situacao}</span>
}
