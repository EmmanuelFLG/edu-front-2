const TONES = {
  neutral: 'bg-ink-50 text-ink-500',
  brand: 'bg-brand-50 text-brand-600',
  good: 'bg-good-50 text-good-600',
  warn: 'bg-amber-50 text-amber-700',
  bad: 'bg-bad-50 text-bad-600',
}

export default function Badge({ children, tone = 'neutral' }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${TONES[tone]}`}>
      {children}
    </span>
  )
}
