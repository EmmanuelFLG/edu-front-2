import { useState, useCallback, useMemo, useEffect } from 'react'
import { useToast } from '../context/ToastContext'
import { extrairMensagemErro } from '../api/axiosClient'

export function useCrud({ api, sortField, pageSize, searchKeys, fields }) {
  const toast = useToast()
  
  const [data, setData] = useState({ content: [], totalPages: 0, totalElements: 0 })
  const [carregando, setCarregando] = useState(true)
  const [busca, setBusca] = useState('')
  const [page, setPage] = useState(0)

  const [modalAberto, setModalAberto] = useState(false)
  const [registroEditando, setRegistroEditando] = useState(null)
  
  const [excluindo, setExcluindo] = useState(null)
  const [visualizando, setVisualizando] = useState(null)

  const [opcoesSelectAsync, setOpcoesSelectAsync] = useState({})

  const carregarDados = useCallback(async () => {
    setCarregando(true)
    try {
      const resposta = await api.listar({ page, size: pageSize, sort: sortField })
      setData(resposta)
    } catch (err) {
      toast.erro(extrairMensagemErro(err, 'Falha ao carregar os dados.'))
    } finally {
      setCarregando(false)
    }
  }, [api, page, pageSize, sortField, toast])

  useEffect(() => { carregarDados() }, [carregarDados])

  useEffect(() => {
    if (!modalAberto) return
    fields.filter((c) => c.type === 'select-async').forEach(async (campo) => {
      if (!opcoesSelectAsync[campo.name]) {
        const opcoesCarregadas = await campo.fetchOptions()
        setOpcoesSelectAsync((atual) => ({ ...atual, [campo.name]: opcoesCarregadas }))
      }
    })
  }, [modalAberto, fields, opcoesSelectAsync])

  const linhasFiltradas = useMemo(() => {
    if (!busca.trim() || !searchKeys?.length) return data.content
    const termo = busca.trim().toLowerCase()
    return data.content.filter((linha) => 
      searchKeys.some((chave) => String(linha[chave] ?? '').toLowerCase().includes(termo))
    )
  }, [data.content, busca, searchKeys])

  function abrirModalCadastro(registro = null) {
    setRegistroEditando(registro)
    setModalAberto(true)
  }

  async function confirmarExclusaoRegistro(setRemovendo) {
    if (!excluindo) return
    setRemovendo(true)
    try {
      await api.excluir(excluindo.id)
      toast.sucesso('Registro removido com sucesso.')
      setExcluindo(null)
      carregarDados()
    } catch (err) {
      toast.erro(extrairMensagemErro(err))
    } finally {
      setRemovendo(false)
    }
  }

  return {
    state: { data, page, carregando, busca, modalAberto, registroEditando, excluindo, visualizando, opcoesSelectAsync, linhasFiltradas },
    setters: { setPage, setBusca, setModalAberto, setExcluindo, setVisualizando },
    actions: { carregarDados, abrirModalCadastro, confirmarExclusaoRegistro },
    toast
  }
}