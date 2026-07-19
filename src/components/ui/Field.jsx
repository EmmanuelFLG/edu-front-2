export function Field({ label, htmlFor, error, hint, children }) {
  return (
    <div>
      {label && (
        <label htmlFor={htmlFor} className="label-base">
          {label}
        </label>
      )}
      {children}
      {hint && !error && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
      {error && <p className="mt-1 text-xs font-medium text-bad-500">{error}</p>}
    </div>
  )
}

export function Input(props) {
  return <input {...props} className={`input-base ${props.className || ''}`} />
}

export function Select({ children, ...props }) {
  return (
    <select {...props} className={`input-base ${props.className || ''}`}>
      {children}
    </select>
  )
}

export function Textarea(props) {
  return <textarea {...props} className={`input-base ${props.className || ''}`} />
}
