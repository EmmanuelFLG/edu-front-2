export default function StatCard({ icon: Icon, label, value, tone = 'ink', loading }) {
  const tones = {
    ink: 'bg-ink-600 text-white',
    brand: 'bg-brand-500 text-white',
    amber: 'bg-amber-400 text-ink-900',
  }
  return (
    <div className="card flex items-center gap-4 p-5">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${tones[tone]}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="font-mono text-2xl font-semibold leading-none text-ink-800">
          {loading ? '—' : value}
        </p>
        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
      </div>
    </div>
  )
}
