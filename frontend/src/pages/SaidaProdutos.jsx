import { useState, useEffect } from 'react'

export default function SaidaProdutos() {
  const [saidas, setSaidas] = useState([])
  const [paginaAtual, setPaginaAtual] = useState(1)
  const itensPorPagina = 10
  const [formData, setFormData] = useState({
    tipoProduto: '',
    produto: '',
    quantidade: '',
    unidade: '',
    dataSaida: '',
    responsavel: '',
    familiaBeneficiada: '',
    documento: ''
  })
  const [erros, setErros] = useState({})
  const [editando, setEditando] = useState(false)
  const [itemEditando, setItemEditando] = useState(null)
  const [modalExcluir, setModalExcluir] = useState(false)
  const [itemExcluir, setItemExcluir] = useState(null)

  useEffect(() => {
    carregarSaidas()
  }, [])

  const carregarSaidas = async () => {
    try {
      setSaidas([
        { id: 1, cod_saida: 1, tipo_produto: 'Alimento não Perecível', produto: 'Arroz', quantidade: '5', unidade: 'KG', data_saida: '2024-01-20', responsavel: 'João' },
        { id: 2, cod_saida: 2, tipo_produto: 'Higiene Pessoal', produto: 'Sabonete', quantidade: '10', unidade: 'UN', data_saida: '2024-01-19', responsavel: 'Maria' },
        { id: 3, cod_saida: 3, tipo_produto: 'Alimento não Perecível', produto: 'Feijão', quantidade: '3', unidade: 'KG', data_saida: '2024-01-18', responsavel: 'Pedro' },
        { id: 4, cod_saida: 4, tipo_produto: 'Roupas', produto: 'Camiseta', quantidade: '5', unidade: 'UN', data_saida: '2024-01-17', responsavel: 'Ana' },
        { id: 5, cod_saida: 5, tipo_produto: 'Alimento Perecível', produto: 'Leite', quantidade: '2', unidade: 'L', data_saida: '2024-01-16', responsavel: 'Carlos' },
        { id: 6, cod_saida: 6, tipo_produto: 'Higiene Pessoal', produto: 'Pasta de Dente', quantidade: '8', unidade: 'UN', data_saida: '2024-01-15', responsavel: 'Lucia' },
        { id: 7, cod_saida: 7, tipo_produto: 'Alimento não Perecível', produto: 'Óleo', quantidade: '1', unidade: 'L', data_saida: '2024-01-14', responsavel: 'Roberto' },
        { id: 8, cod_saida: 8, tipo_produto: 'Roupas', produto: 'Calça', quantidade: '3', unidade: 'UN', data_saida: '2024-01-13', responsavel: 'Fernanda' },
        { id: 9, cod_saida: 9, tipo_produto: 'Alimento Perecível', produto: 'Banana', quantidade: '2', unidade: 'KG', data_saida: '2024-01-12', responsavel: 'Marcos' },
        { id: 10, cod_saida: 10, tipo_produto: 'Higiene Pessoal', produto: 'Shampoo', quantidade: '6', unidade: 'UN', data_saida: '2024-01-11', responsavel: 'Julia' },
        { id: 11, cod_saida: 11, tipo_produto: 'Alimento não Perecível', produto: 'Macarrão', quantidade: '4', unidade: 'KG', data_saida: '2024-01-10', responsavel: 'Diego' },
        { id: 12, cod_saida: 12, tipo_produto: 'Roupas', produto: 'Blusa', quantidade: '2', unidade: 'UN', data_saida: '2024-01-09', responsavel: 'Carla' }
      ])
    } catch (error) {
      console.error('Erro ao carregar saídas:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const novosErros = {}
    if (!formData.tipoProduto) novosErros.tipoProduto = 'Preenchimento obrigatório'
    if (!formData.produto) novosErros.produto = 'Preenchimento obrigatório'
    if (!formData.quantidade) novosErros.quantidade = 'Preenchimento obrigatório'
    if (!formData.unidade) novosErros.unidade = 'Preenchimento obrigatório'
    if (!formData.dataSaida) novosErros.dataSaida = 'Preenchimento obrigatório'
    if (!formData.responsavel) novosErros.responsavel = 'Preenchimento obrigatório'
    if (!formData.familiaBeneficiada) novosErros.familiaBeneficiada = 'Preenchimento obrigatório'
    if (!formData.documento) novosErros.documento = 'Preenchimento obrigatório'
    
    setErros(novosErros)
    
    if (Object.keys(novosErros).length > 0) {
      return
    }
    
    try {
      alert('Saída registrada com sucesso!')
      carregarSaidas()
      setFormData({
        tipoProduto: '',
        produto: '',
        quantidade: '',
        unidade: '',
        dataSaida: '',
        responsavel: '',
        familiaBeneficiada: '',
        documento: ''
      })
      setErros({})
    } catch (error) {
      alert('Erro ao registrar saída')
    }
  }

  const handleEditar = (id) => {
    const saida = saidas.find(s => s.id === id)
    if (saida) {
      setFormData({
        tipoProduto: saida.tipo_produto,
        produto: saida.produto,
        quantidade: saida.quantidade,
        unidade: saida.unidade,
        dataSaida: saida.data_saida,
        responsavel: saida.responsavel,
        familiaBeneficiada: saida.familia_beneficiada || '',
        documento: saida.documento || ''
      })
      setItemEditando(saida)
      setEditando(true)
    }
  }

  const handleCancelarEdicao = () => {
    setEditando(false)
    setItemEditando(null)
    setFormData({
      tipoProduto: '',
      produto: '',
      quantidade: '',
      unidade: '',
      dataSaida: '',
      responsavel: '',
      familiaBeneficiada: '',
      documento: ''
    })
    setErros({})
  }

  const handleAlterarInformacoes = async (e) => {
    e.preventDefault()
    
    const novosErros = {}
    if (!formData.tipoProduto) novosErros.tipoProduto = 'Preenchimento obrigatório'
    if (!formData.produto) novosErros.produto = 'Preenchimento obrigatório'
    if (!formData.quantidade) novosErros.quantidade = 'Preenchimento obrigatório'
    if (!formData.unidade) novosErros.unidade = 'Preenchimento obrigatório'
    if (!formData.dataSaida) novosErros.dataSaida = 'Preenchimento obrigatório'
    if (!formData.responsavel) novosErros.responsavel = 'Preenchimento obrigatório'
    if (!formData.familiaBeneficiada) novosErros.familiaBeneficiada = 'Preenchimento obrigatório'
    if (!formData.documento) novosErros.documento = 'Preenchimento obrigatório'
    
    setErros(novosErros)
    
    if (Object.keys(novosErros).length > 0) {
      return
    }
    
    try {
      const saidasAtualizadas = saidas.map(saida => 
        saida.id === itemEditando.id 
          ? {
              ...saida,
              tipo_produto: formData.tipoProduto,
              produto: formData.produto,
              quantidade: formData.quantidade,
              unidade: formData.unidade,
              data_saida: formData.dataSaida,
              responsavel: formData.responsavel
            }
          : saida
      )
      setSaidas(saidasAtualizadas)
      
      alert('Informações alteradas com sucesso!')
      handleCancelarEdicao()
    } catch (error) {
      alert('Erro ao alterar informações')
    }
  }

  const handleExcluir = (id) => {
    const saida = saidas.find(s => s.id === id)
    setItemExcluir(saida)
    setModalExcluir(true)
  }

  const confirmarExclusao = async () => {
    try {
      setSaidas(saidas.filter(saida => saida.id !== itemExcluir.id))
      setModalExcluir(false)
      setItemExcluir(null)
      alert('Saída excluída com sucesso!')
    } catch (error) {
      alert('Erro ao excluir saída')
    }
  }

  const cancelarExclusao = () => {
    setModalExcluir(false)
    setItemExcluir(null)
  }

  const formatarCPF = (valor) => {
    const numeros = valor.replace(/\D/g, '')
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const handleDocumentoChange = (e) => {
    const valor = e.target.value
    const numerosSomente = valor.replace(/\D/g, '')
    
    if (numerosSomente.length <= 11) {
      const cpfFormatado = formatarCPF(numerosSomente)
      setFormData({...formData, documento: cpfFormatado})
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {editando ? 'Editar Saída de Produto' : 'Registrar Saída de Produtos'}
      </h1>
      
      {!editando && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-4xl mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Tipo de Produto</label>
            <select
              value={formData.tipoProduto}
              onChange={(e) => setFormData({...formData, tipoProduto: e.target.value})}
              className={`w-full p-2 border rounded ${erros.tipoProduto ? 'border-red-500' : ''}`}
            >
              <option value="">Selecione o tipo</option>
              <option value="Alimento Perecível">Alimento Perecível</option>
              <option value="Alimento não Perecível">Alimento não Perecível</option>
              <option value="Higiene Pessoal">Higiene Pessoal</option>
              <option value="Roupas">Roupas</option>
            </select>
            {erros.tipoProduto && <div className="text-red-500 text-sm mt-1">{erros.tipoProduto}</div>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Produto</label>
            <input
              type="text"
              value={formData.produto}
              onChange={(e) => setFormData({...formData, produto: e.target.value})}
              className={`w-full p-2 border rounded ${erros.produto ? 'border-red-500' : ''}`}
            />
            {erros.produto && <div className="text-red-500 text-sm mt-1">{erros.produto}</div>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Quantidade</label>
            <input
              type="text"
              value={formData.quantidade}
              onChange={(e) => setFormData({...formData, quantidade: e.target.value})}
              className={`w-full p-2 border rounded ${erros.quantidade ? 'border-red-500' : ''}`}
            />
            {erros.quantidade && <div className="text-red-500 text-sm mt-1">{erros.quantidade}</div>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">UN</label>
            <select
              value={formData.unidade}
              onChange={(e) => setFormData({...formData, unidade: e.target.value})}
              className={`w-full p-2 border rounded ${erros.unidade ? 'border-red-500' : ''}`}
            >
              <option value="">Selecione a unidade</option>
              <option value="UN">UN</option>
              <option value="G">G</option>
              <option value="KG">KG</option>
              <option value="L">L</option>
            </select>
            {erros.unidade && <div className="text-red-500 text-sm mt-1">{erros.unidade}</div>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Data de Saída</label>
            <input
              type="date"
              value={formData.dataSaida}
              onChange={(e) => setFormData({...formData, dataSaida: e.target.value})}
              className={`w-full p-2 border rounded ${erros.dataSaida ? 'border-red-500' : ''}`}
            />
            {erros.dataSaida && <div className="text-red-500 text-sm mt-1">{erros.dataSaida}</div>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Responsável pelo Registro</label>
            <input
              type="text"
              value={formData.responsavel}
              onChange={(e) => setFormData({...formData, responsavel: e.target.value})}
              className={`w-full p-2 border rounded ${erros.responsavel ? 'border-red-500' : ''}`}
            />
            {erros.responsavel && <div className="text-red-500 text-sm mt-1">{erros.responsavel}</div>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Família Beneficiada</label>
            <input
              type="text"
              placeholder="Responsável Familiar"
              value={formData.familiaBeneficiada}
              onChange={(e) => setFormData({...formData, familiaBeneficiada: e.target.value})}
              className={`w-full p-2 border rounded ${erros.familiaBeneficiada ? 'border-red-500' : ''}`}
            />
            {erros.familiaBeneficiada && <div className="text-red-500 text-sm mt-1">{erros.familiaBeneficiada}</div>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">CPF</label>
            <input
              type="text"
              value={formData.documento}
              onChange={handleDocumentoChange}
              placeholder="000.000.000-00"
              className={`w-full p-2 border rounded ${erros.documento ? 'border-red-500' : ''}`}
            />
            {erros.documento && <div className="text-red-500 text-sm mt-1">{erros.documento}</div>}
          </div>
        </div>

        <div className="mt-6 text-center">
          {editando ? (
            <div className="space-x-4">
              <button
                type="button"
                onClick={handleAlterarInformacoes}
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
              >
                Alterar Informações
              </button>
              <button
                type="button"
                onClick={handleCancelarEdicao}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              type="submit"
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
            >
              Registrar Saída
            </button>
          )}
        </div>
      </form>
      )}

      {editando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Editar Saída de Produto</h2>
            
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Tipo de Produto</label>
                <select
                  value={formData.tipoProduto}
                  onChange={(e) => setFormData({...formData, tipoProduto: e.target.value})}
                  className={`w-full p-2 border rounded ${erros.tipoProduto ? 'border-red-500' : ''}`}
                >
                  <option value="">Selecione o tipo</option>
                  <option value="Alimento Perecível">Alimento Perecível</option>
                  <option value="Alimento não Perecível">Alimento não Perecível</option>
                  <option value="Higiene Pessoal">Higiene Pessoal</option>
                  <option value="Roupas">Roupas</option>
                </select>
                {erros.tipoProduto && <div className="text-red-500 text-sm mt-1">{erros.tipoProduto}</div>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Produto</label>
                <input
                  type="text"
                  value={formData.produto}
                  onChange={(e) => setFormData({...formData, produto: e.target.value})}
                  className={`w-full p-2 border rounded ${erros.produto ? 'border-red-500' : ''}`}
                />
                {erros.produto && <div className="text-red-500 text-sm mt-1">{erros.produto}</div>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Quantidade</label>
                <input
                  type="text"
                  value={formData.quantidade}
                  onChange={(e) => setFormData({...formData, quantidade: e.target.value})}
                  className={`w-full p-2 border rounded ${erros.quantidade ? 'border-red-500' : ''}`}
                />
                {erros.quantidade && <div className="text-red-500 text-sm mt-1">{erros.quantidade}</div>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">UN</label>
                <select
                  value={formData.unidade}
                  onChange={(e) => setFormData({...formData, unidade: e.target.value})}
                  className={`w-full p-2 border rounded ${erros.unidade ? 'border-red-500' : ''}`}
                >
                  <option value="">Selecione a unidade</option>
                  <option value="UN">UN</option>
                  <option value="G">G</option>
                  <option value="KG">KG</option>
                  <option value="L">L</option>
                </select>
                {erros.unidade && <div className="text-red-500 text-sm mt-1">{erros.unidade}</div>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Data de Saída</label>
                <input
                  type="date"
                  value={formData.dataSaida}
                  onChange={(e) => setFormData({...formData, dataSaida: e.target.value})}
                  className={`w-full p-2 border rounded ${erros.dataSaida ? 'border-red-500' : ''}`}
                />
                {erros.dataSaida && <div className="text-red-500 text-sm mt-1">{erros.dataSaida}</div>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Responsável pelo Registro</label>
                <input
                  type="text"
                  value={formData.responsavel}
                  onChange={(e) => setFormData({...formData, responsavel: e.target.value})}
                  className={`w-full p-2 border rounded ${erros.responsavel ? 'border-red-500' : ''}`}
                />
                {erros.responsavel && <div className="text-red-500 text-sm mt-1">{erros.responsavel}</div>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Família Beneficiada</label>
                <input
                  type="text"
                  placeholder="Responsável Familiar"
                  value={formData.familiaBeneficiada}
                  onChange={(e) => setFormData({...formData, familiaBeneficiada: e.target.value})}
                  className={`w-full p-2 border rounded ${erros.familiaBeneficiada ? 'border-red-500' : ''}`}
                />
                {erros.familiaBeneficiada && <div className="text-red-500 text-sm mt-1">{erros.familiaBeneficiada}</div>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">CPF</label>
                <input
                  type="text"
                  value={formData.documento}
                  onChange={handleDocumentoChange}
                  placeholder="000.000.000-00"
                  className={`w-full p-2 border rounded ${erros.documento ? 'border-red-500' : ''}`}
                />
                {erros.documento && <div className="text-red-500 text-sm mt-1">{erros.documento}</div>}
              </div>
            </form>

            <div className="mt-6 text-center space-x-4">
              <button
                type="button"
                onClick={handleAlterarInformacoes}
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
              >
                Alterar Informações
              </button>
              <button
                type="button"
                onClick={handleCancelarEdicao}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Saídas Registradas</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Cód.</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Data</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Tipo</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Produto</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Quantidade</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">UN</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Responsável</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {saidas
                .slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina)
                .map((saida) => (
                <tr key={saida.id}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{saida.cod_saida}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{new Date(saida.data_saida).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{saida.tipo_produto}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{saida.produto}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{saida.quantidade}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{saida.unidade}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{saida.responsavel}</td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleEditar(saida.id)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleExcluir(saida.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      🗑️ Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {saidas.length > itensPorPagina && (
          <div className="mt-4 flex justify-center">
            <div className="flex space-x-2">
              {Array.from({ length: Math.ceil(saidas.length / itensPorPagina) }, (_, i) => (
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

      {modalExcluir && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4 text-center">Confirmar Exclusão?</h3>
            <p className="text-gray-600 mb-6 text-center">
              Deseja realmente excluir a saída do produto <strong>{itemExcluir?.produto}</strong>?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmarExclusao}
                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
              >
                Confirmar
              </button>
              <button
                onClick={cancelarExclusao}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}