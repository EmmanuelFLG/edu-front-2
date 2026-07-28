import { Eye, Pencil, Trash2 } from 'lucide-react'

export default function CrudTable({ linhas, columns, onView, onEdit, onDelete }) {
  // Verifica se existe pelo menos uma ação habilitada para renderizar a coluna "Ações"
  const possuiAcoes = Boolean(onView || onEdit || onDelete)

  return (
    <div className="overflow-x-auto bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-ink-50 bg-ink-50/50 text-xs uppercase tracking-wide text-ink-400">
            {columns.map((coluna) => (
              <th key={coluna.key} className="px-5 py-3 font-semibold">
                {coluna.label}
              </th>
            ))}
            {possuiAcoes && <th className="px-5 py-3 text-right">Ações</th>}
          </tr>
        </thead>
        
        <tbody>
          {linhas.map((linha) => (
            <tr key={linha.id} className="border-b border-ink-50 last:border-0 hover:bg-ink-50/40">
              {columns.map((coluna) => (
                <td key={coluna.key} className="px-5 py-3 text-ink-600">
                  {/* Se a coluna tiver uma função customizada de renderização, usa ela. Senão, imprime o valor puro */}
                  {coluna.render ? coluna.render(linha) : linha[coluna.key]}
                </td>
              ))}
              
              {possuiAcoes && (
                <td className="px-5 py-3 text-right space-x-1">
                  {onView && (
                    <button 
                      className="rounded-md p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700" 
                      onClick={() => onView(linha)} 
                      title="Ver detalhes"
                    >
                      <Eye size={15} />
                    </button>
                  )}
                  
                  {onEdit && (
                    <button 
                      className="rounded-md p-1.5 text-ink-400 hover:bg-brand-50 hover:text-brand-600" 
                      onClick={() => onEdit(linha)}
                      title="Editar registro"
                    >
                      <Pencil size={15} />
                    </button>
                  )}
                  
                  {onDelete && (
                    <button 
                      className="rounded-md p-1.5 text-ink-400 hover:bg-bad-50 hover:text-bad-500" 
                      onClick={() => onDelete(linha)}
                      title="Excluir registro"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}