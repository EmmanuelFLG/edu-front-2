import { useState } from 'react'
import { Plus, Search, Inbox, Upload } from 'lucide-react'
import PageHeader from './ui/PageHeader'
import Modal from './ui/Modal'
import ConfirmDialog from './ui/ConfirmDialog'
import Spinner from './ui/Spinner'
import EmptyState from './ui/EmptyState'
import Pagination from './ui/Pagination'
import CrudTable from './CrudTable'
import CrudForm from './CrudForm'
import { useCrud } from '../hooks/useCrud'
import { extrairMensagemErro } from '../api/axiosClient'

export default function CrudPage({
  title, subtitle, api, columns, fields, pageSize = 10, sortField = 'id', searchKeys = [],
  searchPlaceholder = 'Buscar…', emptyTitle = 'Nada por aqui', emptyDescription = 'Cadastre o primeiro registro.',
  deleteDescription = () => 'Esta ação não poderá ser desfeita.', deleteLabel = 'Excluir', createLabel = 'Novo',
  formTitle = { create: 'Novo registro', edit: 'Editar registro' }, action, importCsv, renderView, viewTitle,
}) {

  // --- HOOK DE LOGICA DO CRUD ---
  const { state, setters, actions, toast } = useCrud({ api, sortField, pageSize, searchKeys, fields })
  
  // --- ESTADOS EXCLUSIVOS DA INTERFACE DA PAGINA ---
  const [modalImportacaoAberto, setModalImportacaoAberto] = useState(false)
  const [arquivoCsv, setArquivoCsv] = useState(null)
  const [importando, setImportando] = useState(false)
  const [removendo, setRemovendo] = useState(false)

  // --- PERMISSOES ---
  const canEdit = typeof api.atualizar === 'function'
  const canDelete = typeof api.excluir === 'function'

  // --- FLUXO DE IMPORTACAO ---
  async function executarImportacaoCsv() {
    try {
      setImportando(true)
      await importCsv.onImport(arquivoCsv)
      toast.sucesso('Importação concluída.')
      setArquivoCsv(null)
      setModalImportacaoAberto(false)
      actions.carregarDados()
    } catch (err) {
      toast.erro(extrairMensagemErro(err))
    } finally {
      setImportando(false)
    }
  }

  return (
    <div>
      {/* Topo da Pagina */}
      <PageHeader title={title} subtitle={subtitle} action={
        <div className="flex gap-2">
          {importCsv?.enabled && (
            <button className="btn-outline flex items-center gap-1.5" onClick={() => setModalImportacaoAberto(true)}>
              <Upload size={16} /> Importar CSV
            </button>
          )}
          {action}
          <button className="btn-accent flex items-center gap-1.5" onClick={() => actions.abrirModalCadastro()}>
            <Plus size={16} />{createLabel}
          </button>
        </div>
      } />

      {/* Area Central: Busca, Tabela e Paginacao */}
      <div className="card overflow-hidden mt-4">
        {searchKeys.length > 0 && (
          <div className="border-b border-ink-50 p-4 bg-white">
            <div className="relative max-w-xs">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
              <input value={state.busca} onChange={(e) => setters.setBusca(e.target.value)} placeholder={searchPlaceholder} className="input-base pl-8 w-full" />
            </div>
          </div>
        )}

        {state.carregando ? (
          <Spinner />
        ) : state.linhasFiltradas.length === 0 ? (
          <EmptyState icon={Inbox} title={emptyTitle} description={emptyDescription} />
        ) : (
          <CrudTable 
            linhas={state.linhasFiltradas} 
            columns={columns} 
            onView={renderView ? setters.setVisualizando : null}
            onEdit={canEdit ? actions.abrirModalCadastro : null}
            onDelete={canDelete ? setters.setExcluindo : null}
          />
        )}
        
        <Pagination page={state.page} totalPages={state.data.totalPages} totalElements={state.data.totalElements} onChange={setters.setPage} />
      </div>

      {/* Modal de Formulario (Cadastro e Edicao) */}
      <Modal open={state.modalAberto} onClose={() => setters.setModalAberto(false)} title={state.registroEditando ? formTitle.edit : formTitle.create} width="max-w-2xl">
        <CrudForm 
          api={api} 
          fields={fields} 
          registroEditando={state.registroEditando} 
          opcoesSelectAsync={state.opcoesSelectAsync}
          onCancel={() => setters.setModalAberto(false)}
          onSuccess={(mensagem) => { 
            toast.sucesso(mensagem) 
            setters.setModalAberto(false) 
            actions.carregarDados() 
          }}
          toast={toast}
        />
      </Modal>

      {/* Modal de Importacao de Csv */}
      <Modal open={modalImportacaoAberto} onClose={() => setModalImportacaoAberto(false)} title="Importar CSV">
        <div className="space-y-4">
          <input type="file" accept=".csv" onChange={(e) => setArquivoCsv(e.target.files?.[0] ?? null)} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-ink-100 file:text-ink-700 hover:file:bg-ink-200" />
          {importCsv?.template && <a href={importCsv.template} download className="inline-block text-sm text-blue-600 underline">Baixar modelo CSV de referência</a>}
          <div className="flex justify-end gap-2 pt-2 border-t border-ink-50">
            <button className="btn-outline px-4 py-2 text-sm" onClick={() => setModalImportacaoAberto(false)}>Cancelar</button>
            <button className="btn-accent px-5 py-2 text-sm disabled:bg-ink-200" disabled={!arquivoCsv || importando} onClick={executarImportacaoCsv}>
              {importando ? 'Importando...' : 'Iniciar Importação'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de Ficha Cadastral (Visualizacao de Detalhes) */}
      {renderView && (
        <Modal open={!!state.visualizando} onClose={() => setters.setVisualizando(null)} title={typeof viewTitle === 'function' ? viewTitle(state.visualizando) : viewTitle || 'Detalhes'} width="max-w-2xl">
          {state.visualizando && renderView(state.visualizando)}
        </Modal>
      )}

      {/* Confirmacao de Exclusao */}
      <ConfirmDialog open={!!state.excluindo} onClose={() => setters.setExcluindo(null)} onConfirm={() => actions.confirmarExclusaoRegistro(setRemovendo)} title={deleteLabel} description={state.excluindo ? deleteDescription(state.excluindo) : ''} confirmLabel={deleteLabel} loading={removendo} />
    </div>
  )
}