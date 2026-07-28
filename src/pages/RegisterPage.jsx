import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight} from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { registroApi } from '../api/registroApi'
import { turmaApi } from '../api/turmaApi'
import { extrairMensagemErro } from '../api/axiosClient'
import { TURNOS } from '../utils/constants'

// Mapeamento dinâmico de turnos para exibição amigável
const TURNO_LABEL = Object.fromEntries(TURNOS.map((t) => [t.value, t.label]))

export default function RegisterPage() {
  const navigate = useNavigate()
  const toast = useToast()

  // --- ESTADOS DO FORMULÁRIO ---
  const [valoresFormulario, setValoresFormulario] = useState({
    nome: '', dataNascimento: '', sexo: '', cpf: '', rg: '', telefone: '', email: '',
    senha: '', confirmarSenha: '', cep: '', rua: '', numero: '', complemento: '',
    bairro: '', cidade: '', estado: '', serie: '', turno: '', aceitouTermos: false
  })

  // --- ESTADOS DE TURMAS E CARREGAMENTO ---
  const [turmasDisponiveis, setTurmasDisponiveis] = useState([])
  const [carregandoTurmas, setCarregandoTurmas] = useState(true)
  const [enviandoSolicitacao, setEnviandoSolicitacao] = useState(false)

  // --- CARGA DAS OPÇÕES DE MATRÍCULA ---
  useEffect(() => {
    async function carregarOpcoesPublicas() {
      try {
        const resposta = await turmaApi.listarPublicas()
        setTurmasDisponiveis(resposta)
      } catch {
        toast.erro('Não foi possível carregar as opções de série/turno. Recarregue a página.')
      } finally {
        setCarregandoTurmas(false)
      }
    }
    carregarOpcoesPublicas()
  }, [toast])

  // --- FILTROS DINÂMICOS DE SÉRIE E TURNO ---
  const opcoesSerie = useMemo(() => {
    return [...new Set(turmasDisponiveis.map((turma) => turma.serie))]
  }, [turmasDisponiveis])

  const opcoesTurno = useMemo(() => {
    const turmasDaSerie = turmasDisponiveis.filter((turma) => turma.serie === valoresFormulario.serie)
    return [...new Set(turmasDaSerie.map((turma) => turma.turno))]
  }, [turmasDisponiveis, valoresFormulario.serie])

  // --- HANDLERS ---
  function atualizarCampo(campo, valor) {
    setValoresFormulario((atual) => ({ ...atual, [campo]: valor }))
  }

  function selecionarSerie(valorSerie) {
    setValoresFormulario((atual) => ({ ...atual, serie: valorSerie, turno: '' }))
  }

  async function handleEnviarMatricula(e) {
    e.preventDefault()
    
    if (!valoresFormulario.aceitouTermos) {
      return toast.erro('Você precisa confirmar os Termos e Condições para prosseguir.')
    }
    if (valoresFormulario.senha !== valoresFormulario.confirmarSenha) {
      return toast.erro('As senhas não coincidem.')
    }

    setEnviandoSolicitacao(true)
    try {
      await registroApi.registrarAluno({
        ...valoresFormulario,
        sexo: valoresFormulario.sexo || null,
      })

      toast.sucesso('Solicitação de matrícula enviada com sucesso! A secretaria vai analisar seu pedido.')
      navigate('/login')
    } catch (erro) {
      toast.erro(extrairMensagemErro(erro, 'Não foi possível concluir a matrícula.'))
    } finally {
      setEnviandoSolicitacao(false)
    }
  }

  // --- RENDERIZAÇÃO DA INTERFACE ---
  return (
    <div className="min-h-screen bg-paper pb-16">
      
      {/* Cabeçalho com o mesmo padrão de cor #3e3e3e */}
      <header className="bg-ink-800 px-6 py-4 text-white shadow-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-display text-lg font-bold tracking-tight">
              EduGestor
            </span>
          </div>
          <span className="text-xs text-ink-300 font-medium">
            Portal Público de Matrícula
          </span>
        </div>
      </header>

      {/* Container Principal do Formulário */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-8">
        
        <div className="mb-6">
          <h1 className="text-xl font-bold text-ink-900">Solicitação de Matrícula</h1>
          <p className="text-sm text-ink-500 mt-1">
            Preencha os campos abaixo com os dados do aluno. Após o envio, a secretaria fará a análise do pedido.
          </p>
        </div>

        <div className="card bg-white shadow-sm border border-ink-100 rounded-xl p-6 sm:p-8">
          <form onSubmit={handleEnviarMatricula} className="space-y-8" noValidate>
            
            {/* Seção: Dados Pessoais */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wide text-ink-800 border-b border-ink-200 pb-2">
                Dados do Aluno
              </h3>
              <div className="mt-4 grid gap-4 grid-cols-6">
                <div className="col-span-4">
                  <label className="text-xs font-semibold text-ink-600">Nome Completo *</label>
                  <input required value={valoresFormulario.nome} onChange={(e) => atualizarCampo('nome', e.target.value)} className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 outline-none" />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-semibold text-ink-600">Data de Nascimento *</label>
                  <input type="date" required value={valoresFormulario.dataNascimento} onChange={(e) => atualizarCampo('dataNascimento', e.target.value)} className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 outline-none" />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-semibold text-ink-600">Sexo</label>
                  <select value={valoresFormulario.sexo} onChange={(e) => atualizarCampo('sexo', e.target.value)} className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 outline-none bg-white">
                    <option value="">Selecione...</option>
                    <option value="MASCULINO">Masculino</option>
                    <option value="FEMININO">Feminino</option>
                    <option value="OUTRO">Outro</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-semibold text-ink-600">CPF</label>
                  <input value={valoresFormulario.cpf} onChange={(e) => atualizarCampo('cpf', e.target.value)} placeholder="000.000.000-00" className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 outline-none" />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-semibold text-ink-600">RG</label>
                  <input value={valoresFormulario.rg} onChange={(e) => atualizarCampo('rg', e.target.value)} placeholder="0.000.000" className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 outline-none" />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-semibold text-ink-600">Contato / Telefone</label>
                  <input value={valoresFormulario.telefone} onChange={(e) => atualizarCampo('telefone', e.target.value)} placeholder="(00) 00000-0000" className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 outline-none" />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-semibold text-ink-600">E-mail</label>
                  <input type="email" value={valoresFormulario.email} onChange={(e) => atualizarCampo('email', e.target.value)} placeholder="exemplo@escola.com" className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 outline-none" />
                </div>

                <div className="col-span-3">
                  <label className="text-xs font-semibold text-ink-600">Criar Senha de Acesso *</label>
                  <input type="password" required value={valoresFormulario.senha} onChange={(e) => atualizarCampo('senha', e.target.value)} className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 outline-none" />
                </div>

                <div className="col-span-3">
                  <label className="text-xs font-semibold text-ink-600">Confirmar Senha *</label>
                  <input type="password" required value={valoresFormulario.confirmarSenha} onChange={(e) => atualizarCampo('confirmarSenha', e.target.value)} className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 outline-none" />
                </div>
              </div>
            </div>

            {/* Seção: Endereço */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wide text-ink-800 border-b border-ink-200 pb-2">
                Endereço
              </h3>
              <div className="mt-4 grid gap-4 grid-cols-6">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-ink-600">CEP</label>
                  <input value={valoresFormulario.cep} onChange={(e) => atualizarCampo('cep', e.target.value)} placeholder="00000-000" className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 outline-none" />
                </div>

                <div className="col-span-4">
                  <label className="text-xs font-semibold text-ink-600">Rua</label>
                  <input value={valoresFormulario.rua} onChange={(e) => atualizarCampo('rua', e.target.value)} className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 outline-none" />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-semibold text-ink-600">Número</label>
                  <input value={valoresFormulario.numero} onChange={(e) => atualizarCampo('numero', e.target.value)} className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 outline-none" />
                </div>

                <div className="col-span-4">
                  <label className="text-xs font-semibold text-ink-600">Complemento</label>
                  <input value={valoresFormulario.complemento} onChange={(e) => atualizarCampo('complemento', e.target.value)} placeholder="Apto, Bloco, etc." className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 outline-none" />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-semibold text-ink-600">Bairro</label>
                  <input value={valoresFormulario.bairro} onChange={(e) => atualizarCampo('bairro', e.target.value)} className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 outline-none" />
                </div>

                <div className="col-span-3">
                  <label className="text-xs font-semibold text-ink-600">Cidade</label>
                  <input value={valoresFormulario.cidade} onChange={(e) => atualizarCampo('cidade', e.target.value)} className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 outline-none" />
                </div>

                <div className="col-span-1">
                  <label className="text-xs font-semibold text-ink-600">Estado</label>
                  <input value={valoresFormulario.estado} onChange={(e) => atualizarCampo('estado', e.target.value.toUpperCase())} maxLength={2} placeholder="PB" className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 outline-none uppercase" />
                </div>
              </div>
            </div>

            {/* Seção: Vínculo Acadêmico */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wide text-ink-800 border-b border-ink-200 pb-2">
                Informações Escolares
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-ink-600">Série / Ano *</label>
                  <select
                    required
                    value={valoresFormulario.serie}
                    onChange={(e) => selecionarSerie(e.target.value)}
                    disabled={carregandoTurmas}
                    className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 outline-none bg-white disabled:bg-ink-100/60"
                  >
                    <option value="">
                      {carregandoTurmas ? 'Carregando…' : opcoesSerie.length === 0 ? 'Nenhuma série disponível' : 'Selecione a série/ano...'}
                    </option>
                    {opcoesSerie.map((serieItem) => <option key={serieItem} value={serieItem}>{serieItem}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink-600">Turno *</label>
                  <select
                    required
                    value={valoresFormulario.turno}
                    onChange={(e) => atualizarCampo('turno', e.target.value)}
                    disabled={!valoresFormulario.serie}
                    className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 outline-none bg-white disabled:bg-ink-100/60"
                  >
                    <option value="">{valoresFormulario.serie ? 'Selecione o turno...' : 'Escolha a série primeiro'}</option>
                    {opcoesTurno.map((turnoItem) => <option key={turnoItem} value={turnoItem}>{TURNO_LABEL[turnoItem] || turnoItem}</option>)}
                  </select>
                </div>
              </div>
              
              {!carregandoTurmas && opcoesSerie.length === 0 && (
                <p className="mt-2 text-xs italic text-ink-400">
                  Não há turmas com vaga disponível no momento. Entre em contato com a secretaria.
                </p>
              )}
            </div>
            
            <div className="flex justify-end pt-4 border-t border-ink-100">
              <button
                type="submit"
                disabled={enviandoSolicitacao}
                className="flex items-center gap-2 rounded bg-[#3e3e3e] px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-ink-800 disabled:bg-ink-300"
              >
                {enviandoSolicitacao ? 'Enviando...' : 'Enviar Solicitação de Matrícula'}
                <ArrowRight size={16} />
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}