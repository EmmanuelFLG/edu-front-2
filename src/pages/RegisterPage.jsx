import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, FileText, ArrowRight } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { registroApi } from '../api/registroApi'
import { turmaApi } from '../api/turmaApi'
import { extrairMensagemErro } from '../api/axiosClient'

const TURNO_LABEL = { MATUTINO: 'Manhã', VESPERTINO: 'Tarde', NOTURNO: 'Noite', INTEGRAL: 'Integral' }

export default function RegisterPage() {
  const navigate = useNavigate()
  const toast = useToast()

  // Estados dos Dados do Aluno
  const [nome, setNome] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [sexo, setSexo] = useState('')
  const [cpf, setCpf] = useState('')
  const [rg, setRg] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')

  // Estados do Endereço
  const [cep, setCep] = useState('')
  const [rua, setRua] = useState('')
  const [numero, setNumero] = useState('')
  const [complemento, setComplemento] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')

  // Série e Turno (opções extraídas das turmas realmente cadastradas no banco,
  // não de uma lista fixa — assim só aparece o que a secretaria já cadastrou)
  const [serie, setSerie] = useState('')
  const [turno, setTurno] = useState('')
  const [turmas, setTurmas] = useState([])
  const [carregandoTurmas, setCarregandoTurmas] = useState(true)

  useEffect(() => {
    turmaApi.listarPublicas()
      .then(setTurmas)
      .catch(() => toast.erro('Não foi possível carregar as opções de série/turno. Recarregue a página.'))
      .finally(() => setCarregandoTurmas(false))
  }, [])

  // Séries distintas entre as turmas com vaga
  const series = [...new Set(turmas.map((t) => t.serie))]
  // Turnos distintos, só entre as turmas da série já escolhida
  const turnosDaSerie = [...new Set(turmas.filter((t) => t.serie === serie).map((t) => t.turno))]

  function selecionarSerie(valor) {
    setSerie(valor)
    setTurno('') // reseta o turno ao trocar de série, já que as opções mudam
  }

  const [aceitouTermos, setAceitouTermos] = useState(false)
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!aceitouTermos) {
      toast.erro('Você precisa confirmar os Termos e Condições para prosseguir.')
      return
    }
    if (senha !== confirmarSenha) {
      toast.erro('As senhas não coincidem.')
      return
    }

    setCarregando(true)
    try {
      await registroApi.registrarAluno({
        nome,
        dataNascimento,
        sexo: sexo || null,
        cpf,
        rg,
        telefone,
        email,
        senha,
        confirmarSenha,
        cep,
        rua,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        serie,
        turno,
        aceitouTermos,
      })

      toast.sucesso('Solicitação de matrícula enviada com sucesso! A secretaria vai analisar seu pedido e você será avisado quando puder acessar o sistema.')
      navigate('/login')
    } catch (err) {
      toast.erro(extrairMensagemErro(err, 'Não foi possível concluir a matrícula.'))
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-50 pb-12">
      
      {/* 1. TOPO ESCURO */}
      <header className="bg-[#3e3e3e] px-6 py-3 text-white shadow-md">
        <div className="mx-auto px-6 flex max-w-5xl items-center gap-3">
          <span className="text-base font-medium tracking-wide">
            EduGestor · Sistema Escolar
          </span>
        </div>
      </header>

      {/* CONTAINER PRINCIPAL */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">

        {/* FORMULÁRIO COMPLETO */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-8" noValidate>
          
          {/* SEÇÃO: DADOS DO ALUNO */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-ink-800 border-b border-ink-200 pb-2">
              Dados do Aluno
            </h3>
            <div className="mt-4 grid gap-4 grid-cols-6">
              
              <div className="col-span-4">
                <label className="text-xs font-semibold text-ink-600">Nome Completo *</label>
                <input type="text" required value={nome} onChange={(e) => setNome(e.target.value)} className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none" />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-semibold text-ink-600">Matrícula (automática)</label>
                <input type="text" disabled value="Gerada pelo sistema" className="mt-1 w-full rounded border border-ink-200 bg-ink-100/60 px-3 py-1.5 text-sm text-ink-400 cursor-not-allowed italic" />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-semibold text-ink-600">Data de Nascimento *</label>
                <input type="date" required value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none" />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-semibold text-ink-600">Sexo</label>
                <select value={sexo} onChange={(e) => setSexo(e.target.value)} className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none bg-white">
                  <option value="">Selecione...</option>
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMININO">Feminino</option>
                  <option value="OUTRO">Outro</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-xs font-semibold text-ink-600">CPF</label>
                <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none" />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-semibold text-ink-600">RG</label>
                <input type="text" value={rg} onChange={(e) => setRg(e.target.value)} placeholder="0.000.000" className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none" />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-semibold text-ink-600">Contato / Telefone</label>
                <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(00) 00000-0000" className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none" />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-semibold text-ink-600">E-mail</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="exemplo@escola.com" className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none" />
              </div>

              <div className="col-span-3">
                <label className="text-xs font-semibold text-ink-600">Criar Senha de Acesso *</label>
                <input type="password" required value={senha} onChange={(e) => setSenha(e.target.value)} className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none" />
              </div>

              <div className="col-span-3">
                <label className="text-xs font-semibold text-ink-600">Confirmar Senha *</label>
                <input type="password" required value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* SEÇÃO: ENDEREÇO */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-ink-800 border-b border-ink-200 pb-2">
              Endereço
            </h3>
            <div className="mt-4 grid gap-4 grid-cols-6">
              
              <div className="col-span-2">
                <label className="text-xs font-semibold text-ink-600">CEP</label>
                <input type="text" value={cep} onChange={(e) => setCep(e.target.value)} placeholder="00000-000" className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none" />
              </div>

              <div className="col-span-4">
                <label className="text-xs font-semibold text-ink-600">Rua</label>
                <input type="text" value={rua} onChange={(e) => setRua(e.target.value)} className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none" />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-semibold text-ink-600">Número</label>
                <input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none" />
              </div>

              <div className="col-span-4">
                <label className="text-xs font-semibold text-ink-600">Complemento</label>
                <input type="text" value={complemento} onChange={(e) => setComplemento(e.target.value)} placeholder="Apto, Bloco, etc." className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none" />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-semibold text-ink-600">Bairro</label>
                <input type="text" value={bairro} onChange={(e) => setBairro(e.target.value)} className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none" />
              </div>

              <div className="col-span-3">
                <label className="text-xs font-semibold text-ink-600">Cidade</label>
                <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none" />
              </div>

              <div className="col-span-1">
                <label className="text-xs font-semibold text-ink-600">Estado</label>
                <input type="text" value={estado} onChange={(e) => setEstado(e.target.value)} maxLength={2} placeholder="PB" className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none uppercase" />
              </div>
            </div>
          </div>

          {/* SEÇÃO: INFORMAÇÕES ESCOLARES */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-ink-800 border-b border-ink-200 pb-2">
              Informações Escolares
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-ink-600">Série / Ano *</label>
                <select
                  required
                  value={serie}
                  onChange={(e) => selecionarSerie(e.target.value)}
                  disabled={carregandoTurmas}
                  className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none bg-white disabled:bg-ink-100/60"
                >
                  <option value="">
                    {carregandoTurmas ? 'Carregando…' : series.length === 0 ? 'Nenhuma série com vaga no momento' : 'Selecione a série/ano...'}
                  </option>
                  {series.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-600">Turno *</label>
                <select
                  required
                  value={turno}
                  onChange={(e) => setTurno(e.target.value)}
                  disabled={!serie}
                  className="mt-1 w-full rounded border border-ink-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none bg-white disabled:bg-ink-100/60"
                >
                  <option value="">{serie ? 'Selecione o turno...' : 'Escolha a série primeiro'}</option>
                  {turnosDaSerie.map((t) => <option key={t} value={t}>{TURNO_LABEL[t] || t}</option>)}
                </select>
              </div>
            </div>
            {!carregandoTurmas && series.length === 0 && (
              <p className="mt-2 text-xs italic text-ink-400">
                Não há turmas com vaga disponível no momento. Entre em contato com a secretaria.
              </p>
            )}
          </div>

          {/* TERMOS E CONDIÇÕES */}
          <div className="flex items-center gap-2">
            <input
              id="aceitouTermos"
              type="checkbox"
              checked={aceitouTermos}
              onChange={(e) => setAceitouTermos(e.target.checked)}
              className="h-4 w-4 rounded border-ink-300 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="aceitouTermos" className="text-sm text-ink-600">
              Li e concordo com os Termos e Condições da instituição.
            </label>
          </div>

          {/* BOTÃO DE SUBMIT */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={carregando}
              className="flex items-center gap-2 rounded bg-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-green-700 disabled:bg-ink-300"
            >
              {carregando ? 'Enviando...' : 'Enviar Solicitação de Matrícula'}
              <ArrowRight size={16} />
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}