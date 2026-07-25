import { useEffect, useMemo, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, Search, Inbox, Upload, Eye } from 'lucide-react'
import PageHeader from './ui/PageHeader'
import Modal from './ui/Modal'
import ConfirmDialog from './ui/ConfirmDialog'
import Spinner from './ui/Spinner'
import EmptyState from './ui/EmptyState'
import Pagination from './ui/Pagination'
import { Input, Select } from './ui/Field'
import { useToast } from '../context/ToastContext'
import { extrairMensagemErro } from '../api/axiosClient'

export default function CrudPage({
  title, subtitle, api, columns, fields, pageSize = 10, sortField = 'id', searchKeys = [],
  searchPlaceholder = 'Buscar…', emptyTitle = 'Nada por aqui', emptyDescription = 'Cadastre o primeiro registro.',
  deleteDescription = () => 'Esta ação não poderá ser desfeita.', deleteLabel = 'Excluir', createLabel = 'Novo',
  formTitle = { create: 'Novo registro', edit: 'Editar registro' }, action, importCsv, renderView, viewTitle,
}) {
  const toast = useToast()
  const [page, setPage] = useState(0)
  const [data, setData] = useState({ content: [], totalPages: 0, totalElements: 0 })
  const [carregando, setCarregando] = useState(true)
  const [busca, setBusca] = useState('')

  const [modalAberto, setModalAberto] = useState(false)
  const [registroEditando, setRegistroEditando] = useState(null)
  const [valores, setValores] = useState({})
  const [errosCampos, setErrosCampos] = useState({})
  const [salvando, setSalvando] = useState(false)
  const [opcoesSelect, setOpcoesSelect] = useState({})

  const [excluindo, setExcluindo] = useState(null)
  const [removendo, setRemovendo] = useState(false)
  const [visualizando, setVisualizando] = useState(null)
  const [modalImportacaoAberto, setModalImportacaoAberto] = useState(false)
  const [arquivoCsv, setArquivoCsv] = useState(null)
  const [importando, setImportando] = useState(false)

  const canEdit = typeof api.atualizar === 'function'
  const canDelete = typeof api.excluir === 'function'

  const carregar = useCallback(async () => {
    setCarregando(true)
    try { setData(await api.listar({ page, size: pageSize, sort: sortField })) } 
    catch (err) { toast.erro(extrairMensagemErro(err, 'Falha ao carregar os dados.')) } 
    finally { setCarregando(false) }
  }, [api, page, pageSize, sortField])

  useEffect(() => { carregar() }, [carregar])

  useEffect(() => {
    if (!modalAberto) return
    fields.filter((f) => f.type === 'select-async').forEach(async (f) => {
      if (!opcoesSelect[f.name]) {
        const opcoes = await f.fetchOptions()
        setOpcoesSelect((atual) => ({ ...atual, [f.name]: opcoes }))
      }
    })
  }, [modalAberto, fields, opcoesSelect])

  const linhasFiltradas = useMemo(() => {
    if (!busca.trim() || !searchKeys.length) return data.content
    const termo = busca.trim().toLowerCase()
    return data.content.filter((row) => searchKeys.some((k) => String(row[k] ?? '').toLowerCase().includes(termo)))
  }, [data.content, busca, searchKeys])

  function abrirModal(row = null) {
    setRegistroEditando(row)
    const iniciais = {}
    fields.forEach((f) => (iniciais[f.name] = row ? (f.getEditValue ? f.getEditValue(row) : row[f.name] ?? '') : (f.defaultValue ?? '')))
    setValores(iniciais)
    setErrosCampos({})
    setModalAberto(true)
  }

  async function salvar(e) {
    e.preventDefault()
    const isEdit = !!registroEditando
    const camposVisiveis = fields.filter((f) => !(typeof f.hidden === 'function' ? f.hidden(isEdit) : f.hidden))
    const erros = {}
    camposVisiveis.forEach((f) => { if (f.required && !String(valores[f.name] ?? '').trim()) erros[f.name] = 'Obrigatório' })
    if (Object.keys(erros).length > 0) return setErrosCampos(erros)

    setSalvando(true)
    try {
      const payload = {}
      camposVisiveis.forEach((f) => (payload[f.name] = f.parse ? f.parse(valores[f.name]) : valores[f.name]))
      registroEditando ? await api.atualizar(registroEditando.id, payload) : await api.criar(payload)
      toast.sucesso(`Registro ${registroEditando ? 'atualizado' : 'criado'} com sucesso.`)
      setModalAberto(false)
      carregar()
    } catch (err) { toast.erro(extrairMensagemErro(err)) } 
    finally { setSalvando(false) }
  }

  async function confirmarExclusao() {
    if (!excluindo) return
    setRemovendo(true)
    try {
      await api.excluir(excluindo.id)
      toast.sucesso('Registro removido com sucesso.')
      setExcluindo(null)
      carregar()
    } catch (err) { toast.erro(extrairMensagemErro(err)) } 
    finally { setRemovendo(false) }
  }

  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} action={
        <div className="flex gap-2">
          {importCsv?.enabled && <button className="btn-outline flex items-center gap-1.5" onClick={() => setModalImportacaoAberto(true)}><Upload size={16} /> Importar CSV</button>}
          {action}
          <button className="btn-accent flex items-center gap-1.5" onClick={() => abrirModal()}><Plus size={16} />{createLabel}</button>
        </div>
      } />

      <div className="card overflow-hidden mt-4">
        {searchKeys.length > 0 && (
          <div className="border-b border-ink-50 p-4 bg-white">
            <div className="relative max-w-xs">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
              <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder={searchPlaceholder} className="input-base pl-8 w-full" />
            </div>
          </div>
        )}

        {carregando ? <Spinner /> : linhasFiltradas.length === 0 ? <EmptyState icon={Inbox} title={emptyTitle} description={emptyDescription} /> : (
          <div className="overflow-x-auto bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink-50 bg-ink-50/50 text-xs uppercase tracking-wide text-ink-400">
                  {columns.map((col) => <th key={col.key} className="px-5 py-3 font-semibold">{col.label}</th>)}
                  {(renderView || canEdit || canDelete) && <th className="px-5 py-3 text-right">Ações</th>}
                </tr>
              </thead>
              <tbody>
                {linhasFiltradas.map((row) => (
                  <tr key={row.id} className="border-b border-ink-50 last:border-0 hover:bg-ink-50/40">
                    {columns.map((col) => <td key={col.key} className="px-5 py-3 text-ink-600">{col.render ? col.render(row) : row[col.key]}</td>)}
                    {(renderView || canEdit || canDelete) && (
                      <td className="px-5 py-3 text-right">
                        {renderView && <button className="rounded-md p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700" onClick={() => setVisualizando(row)} title="Ver detalhes"><Eye size={15} /></button>}
                        {canEdit && <button className="rounded-md p-1.5 text-ink-400 hover:bg-brand-50 hover:text-brand-600" onClick={() => abrirModal(row)}><Pencil size={15} /></button>}
                        {canDelete && <button className="rounded-md p-1.5 text-ink-400 hover:bg-bad-50 hover:text-bad-500" onClick={() => setExcluindo(row)}><Trash2 size={15} /></button>}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} totalPages={data.totalPages} totalElements={data.totalElements} onChange={setPage} />
      </div>

      <Modal open={modalAberto} onClose={() => setModalAberto(false)} title={registroEditando ? formTitle.edit : formTitle.create} width="max-w-2xl">
        <form onSubmit={salvar} className="space-y-6">
          {Object.entries(fields.filter((f) => !(typeof f.hidden === 'function' ? f.hidden(!!registroEditando) : f.hidden)).reduce((acc, f) => { (acc[f.section || 'Geral'] = acc[f.section || 'Geral'] || []).push(f); return acc }, {})).map(([secao, campos]) => (
            <div key={secao} className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wide text-ink-800 border-b border-ink-200 pb-1.5">{secao}</h4>
              <div className="grid gap-x-4 gap-y-3 grid-cols-6">
                {campos.map((f) => (
                  <div key={f.name} className={f.gridSpan || 'col-span-6'}>
                    <label htmlFor={f.name} className="text-xs font-semibold text-ink-600 block mb-1">{f.label}</label>
                    {f.type === 'select' || f.type === 'select-async' ? (
                      <Select id={f.name} disabled={f.disabled} value={valores[f.name] ?? ''} onChange={(e) => setValores((v) => ({ ...v, [f.name]: e.target.value }))} className="w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 bg-white">
                        <option value="">{f.placeholder || 'Selecione…'}</option>
                        {(f.type === 'select' ? f.options : opcoesSelect[f.name] || []).map((op) => <option key={op.value} value={op.value}>{op.label}</option>)}
                      </Select>
                    ) : (
                      <Input id={f.name} disabled={f.disabled} type={f.type || 'text'} placeholder={f.placeholder} value={valores[f.name] ?? ''} onChange={(e) => setValores((v) => ({ ...v, [f.name]: e.target.value }))} className={`w-full rounded border px-3 py-1.5 text-sm focus:border-blue-500 ${f.disabled ? 'bg-ink-100/60 text-ink-400 italic' : 'border-ink-300'}`} />
                    )}
                    {errosCampos[f.name] ? <p className="text-xs text-bad-500 mt-0.5">{errosCampos[f.name]}</p> : f.hint && <p className="text-xs text-ink-400 mt-0.5 italic">{f.hint}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-4 border-t border-ink-100">
            <button type="button" className="btn-outline px-4 py-2 text-sm" onClick={() => setModalAberto(false)} disabled={salvando}>Cancelar</button>
            <button type="submit" className="btn-accent px-5 py-2 text-sm" disabled={salvando}>{salvando ? 'Salvando…' : 'Salvar Registro'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={modalImportacaoAberto} onClose={() => setModalImportacaoAberto(false)} title="Importar CSV">
        <div className="space-y-4">
          <input type="file" accept=".csv" onChange={(e) => setArquivoCsv(e.target.files?.[0] ?? null)} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-ink-100 file:text-ink-700 hover:file:bg-ink-200" />
          {importCsv?.template && <a href={importCsv.template} download className="inline-block text-sm text-blue-600 underline">Baixar modelo CSV de referência</a>}
          <div className="flex justify-end gap-2 pt-2 border-t border-ink-50">
            <button className="btn-outline px-4 py-2" onClick={() => setModalImportacaoAberto(false)}>Cancelar</button>
            <button className="btn-accent px-5 py-2 disabled:bg-ink-200" disabled={!arquivoCsv || importando} onClick={async () => {
              try { setImportando(true); await importCsv.onImport(arquivoCsv); toast.sucesso('Importação concluída.'); setArquivoCsv(null); setModalImportacaoAberto(false); carregar() } 
              catch (err) { toast.erro(extrairMensagemErro(err)) } finally { setImportando(false) }
            }}>{importando ? 'Importando...' : 'Iniciar Importação'}</button>
          </div>
        </div>
      </Modal>

      {renderView && (
        <Modal open={!!visualizando} onClose={() => setVisualizando(null)} title={typeof viewTitle === 'function' ? viewTitle(visualizando) : viewTitle || 'Detalhes'} width="max-w-2xl">
          {visualizando && renderView(visualizando)}
        </Modal>
      )}

      <ConfirmDialog open={!!excluindo} onClose={() => setExcluindo(null)} onConfirm={confirmarExclusao} title={deleteLabel} description={excluindo ? deleteDescription(excluindo) : ''} confirmLabel={deleteLabel} loading={removendo} />
    </div>
  )
}