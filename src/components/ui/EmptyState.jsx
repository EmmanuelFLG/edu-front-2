export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-14 text-center px-6">
      {Icon && (
        <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-ink-50 text-ink-300">
          <Icon size={22} />
        </div>
      )}
      <p className="font-display text-base font-semibold text-ink-700">{title}</p>
      {description && <p className="max-w-sm text-sm text-ink-400">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
