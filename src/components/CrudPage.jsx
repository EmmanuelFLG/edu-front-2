import { useEffect, useMemo, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, Search, Inbox } from 'lucide-react'
import PageHeader from './ui/PageHeader'
import Modal from './ui/Modal'
import ConfirmDialog from './ui/ConfirmDialog'
import Spinner from './ui/Spinner'
import EmptyState from './ui/EmptyState'
import Pagination from './ui/Pagination'
import { Field, Input, Select } from './ui/Field'
import { useToast } from '../context/ToastContext'
import { extrairMensagemErro } from '../api/axiosClient'

/**
 * Motor genérico de listagem + CRUD em modal, usado pelas páginas administrativas.
 * Cada página só precisa descrever "o quê" (colunas, campos do formulário, chamadas de API) —
 * a mecânica de listar/paginar/criar/editar/excluir vive aqui, uma única vez.
 */
export default function CrudPage({
  icon,
  title,
  subtitle,
  api,
  columns,
  fields,
  pageSize = 10,
  sortField = 'id',
  searchKeys = [],
  searchPlaceholder = 'Buscar…',
  emptyTitle = 'Nada por aqui ainda',
  emptyDescription = 'Cadastre o primeiro registro para começar.',
  deleteDescription = () => 'Esta ação não poderá ser desfeita.',
  deleteLabel = 'Excluir',
  createLabel = 'Novo',
  formTitle = { create: 'Novo registro', edit: 'Editar registro' },
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

  const canEdit = typeof api.atualizar === 'function'
  const canDelete = typeof api.excluir === 'function'

  const carregar = useCallback(async () => {
    setCarregando(true)
    try {
      const resposta = await api.listar({ page, size: pageSize, sort: sortField })
      setData(resposta)
    } catch (err) {
      toast.erro(extrairMensagemErro(err, 'Não foi possível carregar os dados.'))
    } finally {
      setCarregando(false)
    }
  }, [api, page, pageSize, sortField]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    carregar()
  }, [carregar])

  // Carrega as opções dos campos "select-async" (ex.: lista de turmas para o formulário de matrícula)
  useEffect(() => {
    if (!modalAberto) return
    const asyncFields = fields.filter((f) => f.type === 'select-async')
    asyncFields.forEach(async (f) => {
      if (opcoesSelect[f.name]) return
      const opcoes = await f.fetchOptions()
      setOpcoesSelect((atual) => ({ ...atual, [f.name]: opcoes }))
    })
  }, [modalAberto]) // eslint-disable-line react-hooks/exhaustive-deps

  const linhasFiltradas = useMemo(() => {
    if (!busca.trim() || searchKeys.length === 0) return data.content
    const termo = busca.trim().toLowerCase()
    return data.content.filter((row) =>
      searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(termo))
    )
  }, [data.content, busca, searchKeys])

  function abrirCriar() {
    setRegistroEditando(null)
    const iniciais = {}
    fields.forEach((f) => (iniciais[f.name] = f.defaultValue ?? ''))
    setValores(iniciais)
    setErrosCampos({})
    setModalAberto(true)
  }

  function abrirEditar(row) {
    setRegistroEditando(row)
    const iniciais = {}
    fields.forEach((f) => (iniciais[f.name] = f.getEditValue ? f.getEditValue(row) : row[f.name] ?? ''))
    setValores(iniciais)
    setErrosCampos({})
    setModalAberto(true)
  }

  function validar() {
    const erros = {}
    fields.forEach((f) => {
      if (f.required && !String(valores[f.name] ?? '').trim()) {
        erros[f.name] = 'Campo obrigatório'
      }
    })
    setErrosCampos(erros)
    return Object.keys(erros).length === 0
  }

  async function salvar(e) {
    e.preventDefault()
    if (!validar()) return
    setSalvando(true)
    try {
      const payload = {}
      fields.forEach((f) => {
        payload[f.name] = f.parse ? f.parse(valores[f.name]) : valores[f.name]
      })
      if (registroEditando) {
        await api.atualizar(registroEditando.id, payload)
        toast.sucesso('Registro atualizado com sucesso.')
      } else {
        await api.criar(payload)
        toast.sucesso('Registro criado com sucesso.')
      }
      setModalAberto(false)
      carregar()
    } catch (err) {
      toast.erro(extrairMensagemErro(err))
    } finally {
      setSalvando(false)
    }
  }

  async function confirmarExclusao() {
    if (!excluindo) return
    setRemovendo(true)
    try {
      await api.excluir(excluindo.id)
      toast.sucesso('Registro removido com sucesso.')
      setExcluindo(null)
      carregar()
    } catch (err) {
      toast.erro(extrairMensagemErro(err))
    } finally {
      setRemovendo(false)
    }
  }

  return (
    <div>
      <PageHeader
        icon={icon}
        title={title}
        subtitle={subtitle}
        action={
          <button className="btn-accent" onClick={abrirCriar}>
            <Plus size={16} />
            {createLabel}
          </button>
        }
      />

      <div className="card overflow-hidden">
        {searchKeys.length > 0 && (
          <div className="border-b border-ink-50 p-4">
            <div className="relative max-w-xs">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder={searchPlaceholder}
                className="input-base pl-8"
              />
            </div>
          </div>
        )}

        {carregando ? (
          <Spinner />
        ) : linhasFiltradas.length === 0 ? (
          <EmptyState icon={Inbox} title={emptyTitle} description={emptyDescription} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink-50 bg-ink-50/50 text-xs uppercase tracking-wide text-ink-400">
                  {columns.map((col) => (
                    <th key={col.key} className="px-5 py-3 font-semibold">
                      {col.label}
                    </th>
                  ))}
                  {(canEdit || canDelete) && <th className="px-5 py-3 text-right">Ações</th>}
                </tr>
              </thead>
              <tbody>
                {linhasFiltradas.map((row) => (
                  <tr key={row.id} className="border-b border-ink-50 last:border-0 hover:bg-ink-50/40">
                    {columns.map((col) => (
                      <td key={col.key} className="px-5 py-3 text-ink-600">
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                    {(canEdit || canDelete) && (
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1.5">
                          {canEdit && (
                            <button
                              className="rounded-md p-1.5 text-ink-400 hover:bg-brand-50 hover:text-brand-600"
                              onClick={() => abrirEditar(row)}
                              aria-label="Editar"
                              title="Editar"
                            >
                              <Pencil size={15} />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              className="rounded-md p-1.5 text-ink-400 hover:bg-bad-50 hover:text-bad-500"
                              onClick={() => setExcluindo(row)}
                              aria-label={deleteLabel}
                              title={deleteLabel}
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
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

      <Modal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        title={registroEditando ? formTitle.edit : formTitle.create}
      >
        <form onSubmit={salvar} className="space-y-4">
          {fields.map((f) => (
            <Field key={f.name} label={f.label} htmlFor={f.name} error={errosCampos[f.name]} hint={f.hint}>
              {f.type === 'select' || f.type === 'select-async' ? (
                <Select
                  id={f.name}
                  value={valores[f.name] ?? ''}
                  onChange={(e) => setValores((v) => ({ ...v, [f.name]: e.target.value }))}
                >
                  <option value="">{f.placeholder || 'Selecione…'}</option>
                  {(f.type === 'select' ? f.options : opcoesSelect[f.name] || []).map((op) => (
                    <option key={op.value} value={op.value}>
                      {op.label}
                    </option>
                  ))}
                </Select>
              ) : (
                <Input
                  id={f.name}
                  type={f.type || 'text'}
                  step={f.step}
                  min={f.min}
                  max={f.max}
                  placeholder={f.placeholder}
                  value={valores[f.name] ?? ''}
                  onChange={(e) => setValores((v) => ({ ...v, [f.name]: e.target.value }))}
                  autoComplete={f.autoComplete}
                />
              )}
            </Field>
          ))}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-outline" onClick={() => setModalAberto(false)} disabled={salvando}>
              Cancelar
            </button>
            <button type="submit" className="btn-accent" disabled={salvando}>
              {salvando ? 'Salvando…' : 'Salvar'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!excluindo}
        onClose={() => setExcluindo(null)}
        onConfirm={confirmarExclusao}
        title={deleteLabel}
        description={excluindo ? deleteDescription(excluindo) : ''}
        confirmLabel={deleteLabel}
        loading={removendo}
      />
    </div>
  )
}
