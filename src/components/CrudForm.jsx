import { useState } from 'react'
import { extrairMensagemErro } from '../api/axiosClient'
import { Input, Select } from './ui/Field'

export default function CrudForm({ api, fields, registroEditando, opcoesSelectAsync, onCancel, onSuccess, toast }) {
  const [valoresFormulario, setValoresFormulario] = useState(() => {
    const iniciais = {}
    fields.forEach((campo) => {
      iniciais[campo.name] = registroEditando 
        ? (campo.getEditValue ? campo.getEditValue(registroEditando) : registroEditando[campo.name] ?? '') 
        : (campo.defaultValue ?? '')
    })
    return iniciais
  })
  
  const [errosCampos, setErrosCampos] = useState({})
  const [salvando, setSalvando] = useState(false)

  const modoEdicao = !!registroEditando
  const secoesAgrupadas = fields
    .filter((campo) => !(typeof campo.hidden === 'function' ? campo.hidden(modoEdicao) : campo.hidden))
    .reduce((acumulador, campo) => {
      const nomeSecao = campo.section || 'Geral'
      acumulador[nomeSecao] = acumulador[nomeSecao] || []
      acumulador[nomeSecao].push(campo)
      return acumulador
    }, {})

  async function handleSalvarRegistro(e) {
    e.preventDefault()
    
    const errosDetectados = {}
    fields.forEach((campo) => { 
      if (campo.required && !String(valoresFormulario[campo.name] ?? '').trim()) {
        errosDetectados[campo.name] = 'Obrigatório' 
      }
    })
    
    if (Object.keys(errosDetectados).length > 0) return setErrosCampos(errosDetectados)

    setSalvando(true)
    try {
      const payload = {}
      fields.forEach((campo) => {
        payload[campo.name] = campo.parse ? campo.parse(valoresFormulario[campo.name]) : valoresFormulario[campo.name]
      })
      
      registroEditando ? await api.atualizar(registroEditando.id, payload) : await api.criar(payload)
      onSuccess(`Registro ${registroEditando ? 'atualizado' : 'criado'} com sucesso.`)
    } catch (err) { 
      toast.erro(extrairMensagemErro(err)) 
    } finally { 
      setSalvando(false) 
    }
  }

  return (
    <form onSubmit={handleSalvarRegistro} className="space-y-6">
      {Object.entries(secoesAgrupadas).map(([nomeDaSecao, listaDeCampos]) => (
        <div key={nomeDaSecao} className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wide text-ink-800 border-b border-ink-200 pb-1.5">{nomeDaSecao}</h4>
          <div className="grid gap-x-4 gap-y-3 grid-cols-6">
            {listaDeCampos.map((campo) => (
              <div key={campo.name} className={campo.gridSpan || 'col-span-6'}>
                <label htmlFor={campo.name} className="text-xs font-semibold text-ink-600 block mb-1">{campo.label}</label>
                
                {['select', 'select-async'].includes(campo.type) ? (
                  <Select id={campo.name} disabled={campo.disabled} value={valoresFormulario[campo.name] ?? ''} onChange={(e) => setValoresFormulario((val) => ({ ...val, [campo.name]: e.target.value }))} className="w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 bg-white">
                    <option value="">{campo.placeholder || 'Selecione…'}</option>
                    {(campo.type === 'select' ? campo.options : opcoesSelectAsync[campo.name] || []).map((opcao) => (
                      <option key={opcao.value} value={opcao.value}>{opcao.label}</option>
                    ))}
                  </Select>
                ) : (
                  <Input id={campo.name} disabled={campo.disabled} type={campo.type || 'text'} placeholder={campo.placeholder} value={valoresFormulario[campo.name] ?? ''} onChange={(e) => setValoresFormulario((val) => ({ ...val, [campo.name]: e.target.value }))} className={`w-full rounded border px-3 py-1.5 text-sm focus:border-blue-500 ${campo.disabled ? 'bg-ink-100/60 text-ink-400 italic' : 'border-ink-300'}`} />
                )}

                {errosCampos[campo.name] ? (
                  <p className="text-xs text-bad-500 mt-0.5">{errosCampos[campo.name]}</p>
                ) : campo.hint ? (
                  <p className="text-xs text-ink-400 mt-0.5 italic">{campo.hint}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="flex justify-end gap-2 pt-4 border-t border-ink-100">
        <button type="button" className="btn-outline px-4 py-2 text-sm" onClick={onCancel} disabled={salvando}>Cancelar</button>
        <button type="submit" className="btn-accent px-5 py-2 text-sm" disabled={salvando}>{salvando ? 'Salvando…' : 'Salvar Registro'}</button>
      </div>
    </form>
  )
}