import { useState, useEffect } from 'react'
import { getMovimentacoesFinanceiras, registrarMovimentacaoFinanceira, getTotaisFinanceiros } from '../services/api'

export default function DoacoesFinanceiras() {
  const [doacoes, setDoacoes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [paginaAtual, setPaginaAtual] = useState(1)
  const itensPorPagina = 10
  const [movimentacoes, setMovimentacoes] = useState([])
  const [totais, setTotais] = useState({ entradas: 0, saidas: 0 })
  const [filtroTipo, setFiltroTipo] = useState('')
  const [movimentacoesIniciais] = useState([
    { id: 1, tipo: 'Entrada', valor: 500.00, documento: '123.456.789-00', nome: 'João Silva', data: '2024-01-15', observacoes: 'Doação mensal' },
    { id: 2, tipo: 'Saída', valor: 200.00, documento: '456.789.123-00', beneficiado: 'Cláudia Pereira', data: '2024-01-14', observacoes: 'Auxílio emergencial' },
    { id: 3, tipo: 'Entrada', valor: 1000.00, documento: '12.345.678/0001-90', nome: 'Empresa ABC Ltda', data: '2024-01-13', observacoes: 'Patrocínio evento' },
    { id: 4, tipo: 'Saída', valor: 150.00, documento: '111.222.333-44', beneficiado: 'Pedro Oliveira', data: '2024-01-12', observacoes: 'Medicamentos' },
    { id: 5, tipo: 'Entrada', valor: 300.00, documento: '555.666.777-88', nome: 'Ana Costa', data: '2024-01-11', observacoes: 'Doação espontânea' },
    { id: 6, tipo: 'Saída', valor: 100.00, documento: '999.888.777-66', beneficiado: 'Carlos Ferreira', data: '2024-01-10', observacoes: 'Transporte' },
    { id: 7, tipo: 'Entrada', valor: 750.00, documento: '444.333.222-11', nome: 'Lucia Mendes', data: '2024-01-09', observacoes: 'Doação aniversário' },
    { id: 8, tipo: 'Saída', valor: 80.00, documento: '777.888.999-00', beneficiado: 'Roberto Lima', data: '2024-01-08', observacoes: 'Material escolar' },
    { id: 9, tipo: 'Entrada', valor: 2000.00, documento: '22.333.444/0001-55', nome: 'Supermercado GHI', data: '2024-01-07', observacoes: 'Parceria comercial' },
    { id: 10, tipo: 'Saída', valor: 120.00, documento: '123.987.456-78', beneficiado: 'Fernanda Rocha', data: '2024-01-06', observacoes: 'Consulta médica' },
    { id: 11, tipo: 'Entrada', valor: 400.00, documento: '666.777.888-99', nome: 'Diego Santos', data: '2024-01-05', observacoes: 'Doação fim de ano' },
    { id: 12, tipo: 'Saída', valor: 90.00, documento: '333.444.555-66', beneficiado: 'Julia Alves', data: '2024-01-04', observacoes: 'Alimentação' }
  ].sort((a, b) => new Date(b.data) - new Date(a.data)))
  const [formData, setFormData] = useState({
    tipoDocumento: 'CPF',
    documento: '',
    nome: '',
    email: '',
    filiacao: '',
    valor: '',
    dataDoacao: ''
  })
  const [showSaidaModal, setShowSaidaModal] = useState(false)
  const [tipoSaida, setTipoSaida] = useState('')
  const [saidaFormData, setSaidaFormData] = useState({
    valor: '',
    cpf: '',
    nome: '',
    dataSaida: '',
    observacoes: ''
  })
  const [contaFormData, setContaFormData] = useState({
    tipoConta: '',
    descricao: '',
    valor: '',
    dataVencimento: '',
    dataPagamento: '',
    observacoes: ''
  })
  const [beneficiados] = useState([
    { cpf: '456.789.123-00', nome: 'Cláudia Pereira' },
    { cpf: '789.123.456-11', nome: 'José Antônio' },
    { cpf: '321.654.987-22', nome: 'Mariana Silva' },
    { cpf: '654.987.321-33', nome: 'Antônio Carlos' },
    { cpf: '147.258.369-44', nome: 'Beatriz Souza' },
    { cpf: '258.369.147-55', nome: 'Ricardo Mendes' }
  ])
  const [patrocinadores] = useState([
    { id: 1, nome: 'João Silva', documento: '123.456.789-00', email: 'joao@email.com', status_filiacao: 'Ativa' },
    { id: 2, nome: 'Maria Santos', documento: '987.654.321-00', email: 'maria@email.com', status_filiacao: 'Ativa' },
    { id: 3, nome: 'Empresa ABC Ltda', documento: '12.345.678/0001-90', email: 'contato@abc.com', status_filiacao: 'Ativa' },
    { id: 4, nome: 'Pedro Oliveira', documento: '111.222.333-44', email: 'pedro@email.com', status_filiacao: 'Inativa' },
    { id: 5, nome: 'Comercial XYZ S/A', documento: '98.765.432/0001-10', email: 'xyz@empresa.com', status_filiacao: 'Ativa' },
    { id: 6, nome: 'Ana Costa', documento: '555.666.777-88', email: 'ana@email.com', status_filiacao: 'Ativa' },
    { id: 7, nome: 'Carlos Ferreira', documento: '999.888.777-66', email: 'carlos@email.com', status_filiacao: 'Ativa' },
    { id: 8, nome: 'Indústria DEF Ltda', documento: '11.222.333/0001-44', email: 'def@industria.com', status_filiacao: 'Inativa' },
    { id: 9, nome: 'Lucia Mendes', documento: '444.333.222-11', email: 'lucia@email.com', status_filiacao: 'Ativa' },
    { id: 10, nome: 'Roberto Lima', documento: '777.888.999-00', email: 'roberto@email.com', status_filiacao: 'Ativa' },
    { id: 11, nome: 'Supermercado GHI', documento: '22.333.444/0001-55', email: 'ghi@super.com', status_filiacao: 'Ativa' },
    { id: 12, nome: 'Fernanda Rocha', documento: '123.987.456-78', email: 'fernanda@email.com', status_filiacao: 'Inativa' }
  ])
  const [patrocinadorNaoEncontrado, setPatrocinadorNaoEncontrado] = useState(false)

  useEffect(() => {
    // Inicializar com dados padrão
    setMovimentacoes(movimentacoesIniciais)
    calcularTotaisLocais()
    
    // Tentar carregar dados da API
    carregarDoacoes()
    carregarMovimentacoes()
    carregarTotais()
  }, [])

  const calcularTotaisLocais = () => {
    const entradas = movimentacoesIniciais.filter(m => m.tipo === 'Entrada').reduce((sum, m) => sum + m.valor, 0)
    const saidas = movimentacoesIniciais.filter(m => m.tipo === 'Saída').reduce((sum, m) => sum + m.valor, 0)
    setTotais({ entradas, saidas })
  }

  const carregarDoacoes = async () => {
    try {
      const response = await getMovimentacoesFinanceiras()
      setDoacoes(response.data)
    } catch (error) {
      console.error('Erro ao carregar doações:', error)
    }
  }

  const carregarMovimentacoes = async () => {
    try {
      const response = await getMovimentacoesFinanceiras()
      if (response.success && response.data.length > 0) {
        setMovimentacoes([...movimentacoesIniciais, ...response.data])
      }
    } catch (error) {
      console.error('Erro ao carregar movimentações:', error)
      // Manter dados iniciais se API falhar
    }
  }

  const carregarTotais = async () => {
    try {
      const response = await getTotaisFinanceiros()
      if (response.success && response.data.length > 0) {
        const totaisData = response.data.reduce((acc, item) => {
          if (item.tipo === 'Entrada') acc.entradas = item.total
          if (item.tipo === 'Saída') acc.saidas = item.total
          return acc
        }, { entradas: 0, saidas: 0 })
        setTotais(totaisData)
      }
    } catch (error) {
      console.error('Erro ao carregar totais:', error)
      // Manter totais calculados localmente se API falhar
    }
  }

  const formatarDocumento = (valor, tipo) => {
    const numeros = valor.replace(/\D/g, '')
    if (tipo === 'CPF') {
      return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    } else {
      return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    }
  }

  const handleDocumentoChange = (e) => {
    const valor = e.target.value
    const numerosSomente = valor.replace(/\D/g, '')
    const maxLength = formData.tipoDocumento === 'CPF' ? 11 : 14
    
    if (numerosSomente.length <= maxLength) {
      const documentoFormatado = formatarDocumento(numerosSomente, formData.tipoDocumento)
      setFormData({...formData, documento: documentoFormatado})
      
      // Buscar patrocinador quando documento estiver completo
      if ((formData.tipoDocumento === 'CPF' && numerosSomente.length === 11) || 
          (formData.tipoDocumento === 'CNPJ' && numerosSomente.length === 14)) {
        const patrocinador = patrocinadores.find(p => p.documento === documentoFormatado)
        if (patrocinador) {
          setFormData(prev => ({
            ...prev,
            documento: documentoFormatado,
            nome: patrocinador.nome,
            email: patrocinador.email,
            filiacao: patrocinador.status_filiacao
          }))
          setPatrocinadorNaoEncontrado(false)
        } else {
          setFormData(prev => ({
            ...prev,
            documento: documentoFormatado,
            nome: '',
            email: '',
            filiacao: ''
          }))
          setPatrocinadorNaoEncontrado(true)
        }
      } else {
        setPatrocinadorNaoEncontrado(false)
      }
    }
  }

  const handleCPFChange = (e) => {
    const valor = e.target.value
    const numerosSomente = valor.replace(/\D/g, '')
    
    if (numerosSomente.length <= 11) {
      const cpfFormatado = formatarDocumento(numerosSomente, 'CPF')
      setSaidaFormData({...saidaFormData, cpf: cpfFormatado})
      
      if (numerosSomente.length === 11) {
        const beneficiado = beneficiados.find(b => b.cpf === cpfFormatado)
        if (beneficiado) {
          setSaidaFormData(prev => ({...prev, cpf: cpfFormatado, nome: beneficiado.nome}))
        } else {
          setSaidaFormData(prev => ({...prev, cpf: cpfFormatado, nome: ''}))
        }
      }
    }
  }

  const handleSaidaSubmit = async (e) => {
    e.preventDefault()
    try {
      let dadosMovimentacao
      if (tipoSaida === 'doacao') {
        if (!validarValor(saidaFormData.valor)) {
          alert('Por favor, insira um valor válido entre R$ 0,01 e R$ 999.999,99')
          return
        }
        dadosMovimentacao = {
          tipo: 'Saída',
          valor: parseFloat(saidaFormData.valor.replace(',', '.')),
          documento: saidaFormData.cpf,
          nome: null,
          beneficiado: saidaFormData.nome,
          data_movimentacao: saidaFormData.dataSaida,
          observacoes: saidaFormData.observacoes
        }
      } else {
        if (!validarValor(contaFormData.valor)) {
          alert('Por favor, insira um valor válido entre R$ 0,01 e R$ 999.999,99')
          return
        }
        dadosMovimentacao = {
          tipo: 'Saída',
          valor: parseFloat(contaFormData.valor.replace(',', '.')),
          documento: `${contaFormData.tipoConta.toUpperCase()}-${Date.now()}`,
          nome: null,
          beneficiado: contaFormData.descricao,
          data_movimentacao: contaFormData.dataPagamento,
          observacoes: contaFormData.observacoes
        }
      }
      
      await registrarMovimentacaoFinanceira(dadosMovimentacao)
      alert(tipoSaida === 'doacao' ? 'Doação registrada com sucesso!' : 'Pagamento de conta registrado com sucesso!')
      
      setShowSaidaModal(false)
      setTipoSaida('')
      setSaidaFormData({ valor: '', cpf: '', nome: '', dataSaida: '', observacoes: '' })
      setContaFormData({ tipoConta: '', descricao: '', valor: '', dataVencimento: '', dataPagamento: '', observacoes: '' })
      
      // Recarregar dados
      carregarMovimentacoes()
      carregarTotais()
    } catch (error) {
      alert('Erro ao registrar saída')
    }
  }

  const formatarMoeda = (valor) => {
    const numero = valor.replace(/\D/g, '')
    const valorDecimal = (parseInt(numero) / 100).toFixed(2)
    return valorDecimal.replace('.', ',')
  }

  const handleValorChange = (e) => {
    const valor = e.target.value
    const valorFormatado = formatarMoeda(valor)
    setFormData({...formData, valor: valorFormatado})
  }

  const validarValor = (valor) => {
    const valorNumerico = parseFloat(valor.replace(',', '.'))
    return valorNumerico > 0 && valorNumerico <= 999999.99
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validarValor(formData.valor)) {
      alert('Por favor, insira um valor válido entre R$ 0,01 e R$ 999.999,99')
      return
    }
    
    try {
      const dadosMovimentacao = {
        tipo: 'Entrada',
        valor: parseFloat(formData.valor.replace(',', '.')),
        documento: formData.documento,
        nome: formData.nome,
        beneficiado: null,
        data_movimentacao: formData.dataDoacao,
        observacoes: 'Doação financeira'
      }
      
      await registrarMovimentacaoFinanceira(dadosMovimentacao)
      alert('Doação registrada com sucesso!')
      
      setShowForm(false)
      setFormData({
        tipoDocumento: 'CPF',
        documento: '',
        nome: '',
        email: '',
        filiacao: '',
        valor: '',
        dataDoacao: ''
      })
      setPatrocinadorNaoEncontrado(false)
      
      // Recarregar dados
      carregarMovimentacoes()
      carregarTotais()
    } catch (error) {
      alert('Erro ao registrar doação')
    }
  }

  return (
    <div style={{padding: '2rem'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', maxWidth: '1200px', margin: '0 auto 2rem auto'}}>
        <h1 style={{fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-dark)'}}>Financeiro</h1>
        <div style={{display: 'flex', gap: '1rem'}}>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {showForm ? 'Cancelar' : 'Registrar Entrada'}
          </button>
          <button
            onClick={() => setShowSaidaModal(true)}
            style={{
              backgroundColor: '#f97316',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Registrar Saída
          </button>
        </div>
      </div>

      {showForm && (
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: '2rem'}}>
          <form onSubmit={handleSubmit} className="form-section" style={{maxWidth: '600px', width: '100%'}}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Documento</label>
                <div className="flex gap-2">
                  <select
                    value={formData.tipoDocumento}
                    onChange={(e) => setFormData({...formData, tipoDocumento: e.target.value, documento: '', nome: '', email: '', filiacao: ''})}
                    className="p-2 border rounded w-24"
                  >
                    <option value="CPF">CPF</option>
                    <option value="CNPJ">CNPJ</option>
                  </select>
                  <input
                    type="text"
                    value={formData.documento}
                    onChange={handleDocumentoChange}
                    placeholder={formData.tipoDocumento === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'}
                    className="flex-1 p-2 border rounded"
                    required
                  />
                </div>
                {patrocinadorNaoEncontrado && (
                  <div className="text-red-500 text-sm mt-1">Patrocinador não Cadastrado</div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Nome</label>
                <input
                  type="text"
                  value={formData.nome}
                  className="w-full p-2 border rounded bg-gray-100"
                  readOnly
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">E-mail</label>
                <input
                  type="email"
                  value={formData.email}
                  className="w-full p-2 border rounded bg-gray-100"
                  readOnly
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Filiação</label>
                <input
                  type="text"
                  value={formData.filiacao}
                  className="w-full p-2 border rounded bg-gray-100"
                  readOnly
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Data</label>
                <input
                  type="date"
                  value={formData.dataDoacao}
                  onChange={(e) => setFormData({...formData, dataDoacao: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Valor Recebido</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">R$</span>
                  <input
                    type="text"
                    value={formData.valor}
                    onChange={handleValorChange}
                    className="w-full p-2 pl-10 border rounded"
                    placeholder="0,00"
                    maxLength="10"
                    required
                  />
                </div>
                <small className="text-gray-500">Valor máximo: R$ 999.999,99</small>
              </div>
            </div>

            <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
              <button
                type="submit"
                className="btn-primary"
                style={{flex: 1}}
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-primary"
                style={{flex: 1, backgroundColor: '#6c757d'}}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {showSaidaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Registrar Saída</h2>
            
            {!tipoSaida ? (
              <div>
                <label className="block text-sm font-medium mb-2">Tipo de Saída</label>
                <select
                  value={tipoSaida}
                  onChange={(e) => setTipoSaida(e.target.value)}
                  className="w-full p-2 border rounded mb-4"
                >
                  <option value="">Selecione o tipo</option>
                  <option value="doacao">Doação</option>
                  <option value="pagamento">Pagamento Contas</option>
                </select>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowSaidaModal(false)}
                    className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : tipoSaida === 'doacao' ? (
              <form onSubmit={handleSaidaSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">CPF</label>
                    <input
                      type="text"
                      value={saidaFormData.cpf}
                      onChange={handleCPFChange}
                      placeholder="000.000.000-00"
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Nome</label>
                    <input
                      type="text"
                      value={saidaFormData.nome}
                      className="w-full p-2 border rounded bg-gray-100"
                      readOnly
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Valor</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">R$</span>
                      <input
                        type="text"
                        value={saidaFormData.valor}
                        onChange={(e) => {
                          const valorFormatado = formatarMoeda(e.target.value)
                          setSaidaFormData({...saidaFormData, valor: valorFormatado})
                        }}
                        className="w-full p-2 pl-10 border rounded"
                        placeholder="0,00"
                        maxLength="10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Data</label>
                    <input
                      type="date"
                      value={saidaFormData.dataSaida}
                      onChange={(e) => setSaidaFormData({...saidaFormData, dataSaida: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  
                  <div className="mb-4 md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Observações</label>
                    <textarea
                      value={saidaFormData.observacoes}
                      onChange={(e) => setSaidaFormData({...saidaFormData, observacoes: e.target.value})}
                      className="w-full p-2 border rounded"
                      rows="3"
                    />
                  </div>
                </div>
                
                <div className="flex justify-center space-x-4 mt-4">
                  <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">Salvar</button>
                  <button type="button" onClick={() => {setTipoSaida(''); setSaidaFormData({ valor: '', cpf: '', nome: '', dataSaida: '', observacoes: '' })}} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">Voltar</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSaidaSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Tipo de Conta</label>
                    <select
                      value={contaFormData.tipoConta}
                      onChange={(e) => setContaFormData({...contaFormData, tipoConta: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="energia">Energia</option>
                      <option value="agua">Água</option>
                      <option value="internet">Internet</option>
                      <option value="manutencao">Manutenção</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Descrição</label>
                    <input
                      type="text"
                      value={contaFormData.descricao}
                      onChange={(e) => setContaFormData({...contaFormData, descricao: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Valor</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">R$</span>
                      <input
                        type="text"
                        value={contaFormData.valor}
                        onChange={(e) => {
                          const valorFormatado = formatarMoeda(e.target.value)
                          setContaFormData({...contaFormData, valor: valorFormatado})
                        }}
                        className="w-full p-2 pl-10 border rounded"
                        placeholder="0,00"
                        maxLength="10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Data Vencimento</label>
                    <input
                      type="date"
                      value={contaFormData.dataVencimento}
                      onChange={(e) => setContaFormData({...contaFormData, dataVencimento: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Data Pagamento</label>
                    <input
                      type="date"
                      value={contaFormData.dataPagamento}
                      onChange={(e) => setContaFormData({...contaFormData, dataPagamento: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  
                  <div className="mb-4 md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Observações</label>
                    <textarea
                      value={contaFormData.observacoes}
                      onChange={(e) => setContaFormData({...contaFormData, observacoes: e.target.value})}
                      className="w-full p-2 border rounded"
                      rows="3"
                    />
                  </div>
                </div>
                
                <div className="flex justify-center space-x-4 mt-4">
                  <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">Salvar</button>
                  <button type="button" onClick={() => {setTipoSaida(''); setContaFormData({ tipoConta: '', descricao: '', valor: '', dataVencimento: '', dataPagamento: '', observacoes: '' })}} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">Voltar</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-6">Dashboard Financeiro</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow cursor-pointer hover:bg-gray-50" onClick={() => setFiltroTipo(filtroTipo === 'Entrada' ? '' : 'Entrada')}>
            <h3 className="text-lg font-semibold text-green-600 mb-2">Total Entradas</h3>
            <p className="text-3xl font-bold text-green-700">
              R$ {(Number(movimentacoes.filter(m => m.tipo === 'Entrada').reduce((sum, m) => sum + Number(m.valor || 0), 0)) + Number(totais.entradas || 0)).toFixed(2)}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow cursor-pointer hover:bg-gray-50" onClick={() => setFiltroTipo(filtroTipo === 'Saída' ? '' : 'Saída')}>
            <h3 className="text-lg font-semibold text-red-600 mb-2">Total Saídas</h3>
            <p className="text-3xl font-bold text-red-700">
              R$ {(Number(movimentacoes.filter(m => m.tipo === 'Saída').reduce((sum, m) => sum + Number(m.valor || 0), 0)) + Number(totais.saidas || 0)).toFixed(2)}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Saldo</h3>
            <p className={`text-3xl font-bold ${
              ((Number(movimentacoes.filter(m => m.tipo === 'Entrada').reduce((sum, m) => sum + Number(m.valor || 0), 0)) + Number(totais.entradas || 0)) - 
               (Number(movimentacoes.filter(m => m.tipo === 'Saída').reduce((sum, m) => sum + Number(m.valor || 0), 0)) + Number(totais.saidas || 0))) >= 0 
                ? 'text-green-700' : 'text-red-700'
            }`}>
              R$ {((Number(movimentacoes.filter(m => m.tipo === 'Entrada').reduce((sum, m) => sum + Number(m.valor || 0), 0)) + Number(totais.entradas || 0)) - 
                   (Number(movimentacoes.filter(m => m.tipo === 'Saída').reduce((sum, m) => sum + Number(m.valor || 0), 0)) + Number(totais.saidas || 0))).toFixed(2)}
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4 cursor-pointer hover:text-blue-600" onClick={() => setFiltroTipo('')}>Movimentações Financeiras</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Tipo</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Valor</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Documento</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Nome/Beneficiado</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Data</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Observações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {movimentacoes
                .filter(m => !filtroTipo || m.tipo === filtroTipo)
                .sort((a, b) => new Date(b.data_registro || b.data) - new Date(a.data_registro || a.data))
                .slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina)
                .map((movimentacao) => (
                <tr key={movimentacao.id}>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      movimentacao.tipo === 'Entrada' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {movimentacao.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    R$ {Number(movimentacao.valor || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{movimentacao.documento}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {movimentacao.nome || movimentacao.beneficiado}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {new Date(movimentacao.data).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{movimentacao.observacoes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {movimentacoes.filter(m => !filtroTipo || m.tipo === filtroTipo).length > itensPorPagina && (
          <div className="mt-4 flex justify-center">
            <div className="flex space-x-2">
              {Array.from({ length: Math.ceil(movimentacoes.filter(m => !filtroTipo || m.tipo === filtroTipo).length / itensPorPagina) }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPaginaAtual(i + 1)}
                  className={`px-3 py-1 rounded ${
                    paginaAtual === i + 1
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}