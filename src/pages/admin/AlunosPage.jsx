import { GraduationCap } from 'lucide-react'
import CrudPage from '../../components/CrudPage'
import Badge from '../../components/ui/Badge'
import { alunoApi } from '../../api/alunoApi'

export default function AlunosPage() {
  return (
    <CrudPage
      title="Alunos" subtitle="Gerenciamento central de matrículas e dados dos alunos."
      api={alunoApi} importCsv={{ enabled: true, template: '/modelos/alunos.csv', onImport: alunoApi.importarCsv }}
      sortField="nome" searchKeys={['nome', 'email', 'matricula', 'cpf']} searchPlaceholder="Buscar por nome, email, matrícula ou CPF…"
      emptyTitle="Nenhum aluno cadastrado" emptyDescription="Cadastre o primeiro aluno para começar a montar as turmas."
      createLabel="Novo aluno" formTitle={{ create: 'Matricular Novo Aluno', edit: 'Editar Ficha do Aluno' }} deleteLabel="Inativar"
      deleteDescription={(row) => `A matrícula de "${row.nome}" será inativada. O histórico é preservado.`}
      
      // Colunas da listagem (resumo rápido para o Administrador)
      columns={[
        { key: 'nome', label: 'Nome' },
        { key: 'email', label: 'Email' },
        { key: 'serie', label: 'Série' },
        { key: 'turma', label: 'Turma' },
        { key: 'matricula', label: 'Matrícula' },
        { key: 'ativo', label: 'Status', render: (row) => <Badge tone={row.ativo ? 'good' : 'neutral'}>{row.ativo ? 'Ativo' : 'Inativo'}</Badge> }
      ]}
      
      // Mapeamento idêntico aos campos da RegisterPage (agrupados por 'section' e 'gridSpan')
      fields={[
        // DADOS DO ALUNO
        { name: 'nome', label: 'Nome Completo *', required: true, section: 'Dados do Aluno', gridSpan: 'col-span-4' },
        { name: 'dataNascimento', label: 'Data de Nascimento *', type: 'date', required: true, section: 'Dados do Aluno', gridSpan: 'col-span-2' },
        { name: 'sexo', label: 'Sexo', type: 'select', section: 'Dados do Aluno', gridSpan: 'col-span-2', options: [{ value: 'MASCULINO', label: 'Masculino' }, { value: 'FEMININO', label: 'Feminino' }, { value: 'OUTRO', label: 'Outro' }] },
        { name: 'cpf', label: 'CPF', placeholder: '000.000.000-00', section: 'Dados do Aluno', gridSpan: 'col-span-2' },
        { name: 'rg', label: 'RG', placeholder: '0.000.000', section: 'Dados do Aluno', gridSpan: 'col-span-2' },
        { name: 'telefone', label: 'Contato / Telefone', placeholder: '(00) 00000-0000', section: 'Dados do Aluno', gridSpan: 'col-span-2' },
        { name: 'email', label: 'E-mail', type: 'email', placeholder: 'exemplo@escola.com', section: 'Dados do Aluno', gridSpan: 'col-span-2' },
        
        // ENDEREÇO
        { name: 'cep', label: 'CEP', placeholder: '00000-000', section: 'Endereço', gridSpan: 'col-span-2' },
        { name: 'rua', label: 'Rua', section: 'Endereço', gridSpan: 'col-span-4' },
        { name: 'numero', label: 'Número', section: 'Endereço', gridSpan: 'col-span-2' },
        { name: 'complemento', label: 'Complemento', placeholder: 'Apto, Bloco, etc.', section: 'Endereço', gridSpan: 'col-span-4' },
        { name: 'bairro', label: 'Bairro', section: 'Endereço', gridSpan: 'col-span-2' },
        { name: 'cidade', label: 'Cidade', section: 'Endereço', gridSpan: 'col-span-3' },
        { name: 'estado', label: 'Estado', placeholder: 'PB', section: 'Endereço', gridSpan: 'col-span-1', parse: (v) => String(v).toUpperCase() },

        // INFORMAÇÕES ESCOLARES
        { name: 'serieAno', label: 'Série / Ano *', type: 'select', required: true, section: 'Informações Escolares', gridSpan: 'col-span-3', options: [{ value: '1_ANO_TEC', label: '1º Ano - Técnico Integrado' }, { value: '2_ANO_TEC', label: '2º Ano - Técnico Integrado' }, { value: '3_ANO_TEC', label: '3º Ano - Técnico Integrado' }, { value: 'SUBSEQUENTE', label: 'Técnico Subsequente' }] },
        { name: 'turno', label: 'Turno *', type: 'select', required: true, section: 'Informações Escolares', gridSpan: 'col-span-3', options: [{ value: 'MANHA', label: 'Manhã' }, { value: 'TARDE', label: 'Tarde' }, { value: 'NOITE', label: 'Noite' }, { value: 'INTEGRAL', label: 'Integral' }] }
      ]}
    />
  )
}