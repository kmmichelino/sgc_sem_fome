import { useState, useEffect } from 'react'
import { registrarEntradaProduto, excluirEntradaProduto } from '../services/api'

export default function EntradaProdutos() {
  const [entradas, setEntradas] = useState([])
  const [paginaAtual, setPaginaAtual] = useState(1)
  const itensPorPagina = 10
  const [formData, setFormData] = useState({
    tipoProduto: '',
    produto: '',
    quantidade: '',
    unidade: '',
    dataEntrada: '',
    responsavel: '',
    parceiro: '',
    tipoDocumento: 'CPF',
    documento: ''
  })
  const [erros, setErros] = useState({})
  const [editando, setEditando] = useState(false)
  const [itemEditando, setItemEditando] = useState(null)
  const [modalExcluir, setModalExcluir] = useState(false)
  const [itemExcluir, setItemExcluir] = useState(null)
  const [alteracoesConcluidas, setAlteracoesConcluidas] = useState(false)
  const [exclusaoConcluida, setExclusaoConcluida] = useState(false)

  useEffect(() => {
    carregarEntradas()
  }, [])

  const carregarEntradas = async () => {
    try {
      const entradasSalvas = JSON.parse(localStorage.getItem('entradas') || '[]')
      
      const entradasIniciais = [
        { id: 1, cod_entrada: 1, tipo_produto: 'Alimento não Perecível', produto: 'Arroz', quantidade: '50', unidade: 'KG', data_entrada: '2024-01-15', responsavel: 'João', parceiro: 'Supermercado ABC', documento: '123.456.789-00' },
        { id: 2, cod_entrada: 2, tipo_produto: 'Alimento não Perecível', produto: 'Feijão', quantidade: '30', unidade: 'KG', data_entrada: '2024-01-14', responsavel: 'Maria', parceiro: 'Empresa XYZ', documento: '987.654.321-00' },
        { id: 3, cod_entrada: 3, tipo_produto: 'Higiene Pessoal', produto: 'Sabonete', quantidade: '100', unidade: 'UN', data_entrada: '2024-01-13', responsavel: 'Pedro', parceiro: 'Doação Individual', documento: '111.222.333-44' },
        { id: 4, cod_entrada: 4, tipo_produto: 'Roupas', produto: 'Camiseta', quantidade: '25', unidade: 'UN', data_entrada: '2024-01-12', responsavel: 'Ana', parceiro: 'Loja de Roupas', documento: '555.666.777-88' },
        { id: 5, cod_entrada: 5, tipo_produto: 'Alimento Perecível', produto: 'Banana', quantidade: '10', unidade: 'KG', data_entrada: '2024-01-11', responsavel: 'Carlos', parceiro: 'Feira Local', documento: '999.888.777-66' },
        { id: 6, cod_entrada: 6, tipo_produto: 'Alimento não Perecível', produto: 'Macarrão', quantidade: '40', unidade: 'KG', data_entrada: '2024-01-10', responsavel: 'Lucia', parceiro: 'Indústria Alimentos', documento: '12.345.678/0001-90' },
        { id: 7, cod_entrada: 7, tipo_produto: 'Higiene Pessoal', produto: 'Pasta de Dente', quantidade: '50', unidade: 'UN', data_entrada: '2024-01-09', responsavel: 'Roberto', parceiro: 'Farmácia Popular', documento: '444.333.222-11' },
        { id: 8, cod_entrada: 8, tipo_produto: 'Alimento não Perecível', produto: 'Óleo', quantidade: '20', unidade: 'L', data_entrada: '2024-01-08', responsavel: 'Fernanda', parceiro: 'Atacadista Regional', documento: '98.765.432/0001-10' },
        { id: 9, cod_entrada: 9, tipo_produto: 'Roupas', produto: 'Calça', quantidade: '15', unidade: 'UN', data_entrada: '2024-01-07', responsavel: 'Marcos', parceiro: 'Confecção Local', documento: '777.888.999-00' },
        { id: 10, cod_entrada: 10, tipo_produto: 'Alimento Perecível', produto: 'Leite', quantidade: '30', unidade: 'L', data_entrada: '2024-01-06', responsavel: 'Julia', parceiro: 'Laticínios Vale', documento: '11.222.333/0001-44' },
        { id: 11, cod_entrada: 11, tipo_produto: 'Alimento não Perecível', produto: 'Açúcar', quantidade: '25', unidade: 'KG', data_entrada: '2024-01-05', responsavel: 'Diego', parceiro: 'Usina Açucareira', documento: '22.333.444/0001-55' },
        { id: 12, cod_entrada: 12, tipo_produto: 'Higiene Pessoal', produto: 'Shampoo', quantidade: '35', unidade: 'UN', data_entrada: '2024-01-04', responsavel: 'Carla', parceiro: 'Distribuidora Beleza', documento: '123.987.456-78' }
      ]
      
      if (entradasSalvas.length === 0) {
        localStorage.setItem('entradas', JSON.stringify(entradasIniciais))
        setEntradas(entradasIniciais)
      } else {
        setEntradas(entradasSalvas)
      }
    } catch (error) {
      console.error('Erro ao carregar entradas:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const novosErros = {}
    if (!formData.tipoProduto) novosErros.tipoProduto = 'Preenchimento obrigatório'
    if (!formData.produto) novosErros.produto = 'Preenchimento obrigatório'
    if (!formData.quantidade) novosErros.quantidade = 'Preenchimento obrigatório'
    if (!formData.unidade) novosErros.unidade = 'Preenchimento obrigatório'
    if (!formData.dataEntrada) novosErros.dataEntrada = 'Preenchimento obrigatório'
    if (!formData.responsavel) novosErros.responsavel = 'Preenchimento obrigatório'
    if (!formData.parceiro) novosErros.parceiro = 'Preenchimento obrigatório'
    if (!formData.documento) novosErros.documento = 'Preenchimento obrigatório'
    
    setErros(novosErros)
    
    if (Object.keys(novosErros).length > 0) {
      return
    }
    
    try {
      const novaEntrada = {
        id: Date.now(),
        cod_entrada: entradas.length + 1,
        tipo_produto: formData.tipoProduto,
        produto: formData.produto,
        quantidade: formData.quantidade,
        unidade: formData.unidade,
        data_entrada: formData.dataEntrada,
        responsavel: formData.responsavel,
        parceiro: formData.parceiro,
        documento: formData.documento
      }
      
      const novasEntradas = [...entradas, novaEntrada]
      setEntradas(novasEntradas)
      localStorage.setItem('entradas', JSON.stringify(novasEntradas))
      
      // Disparar evento para atualizar o gráfico
      window.dispatchEvent(new Event('entradasUpdated'))
      
      alert('Entrada registrada com sucesso!')
      setFormData({
        tipoProduto: '',
        produto: '',
        quantidade: '',
        unidade: '',
        dataEntrada: '',
        responsavel: '',
        parceiro: '',
        tipoDocumento: 'CPF',
        documento: ''
      })
      setErros({})
    } catch (error) {
      alert('Erro ao registrar entrada')
    }
  }

  const handleEditar = (id) => {
    const entrada = entradas.find(e => e.id === id)
    if (entrada) {
      setFormData({
        tipoProduto: entrada.tipo_produto,
        produto: entrada.produto,
        quantidade: entrada.quantidade,
        unidade: entrada.unidade,
        dataEntrada: entrada.data_entrada,
        responsavel: entrada.responsavel,
        parceiro: entrada.parceiro || '',
        tipoDocumento: 'CPF',
        documento: entrada.documento || ''
      })
      setItemEditando(entrada)
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
      dataEntrada: '',
      responsavel: '',
      parceiro: '',
      tipoDocumento: 'CPF',
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
    if (!formData.dataEntrada) novosErros.dataEntrada = 'Preenchimento obrigatório'
    if (!formData.responsavel) novosErros.responsavel = 'Preenchimento obrigatório'
    if (!formData.parceiro) novosErros.parceiro = 'Preenchimento obrigatório'
    if (!formData.documento) novosErros.documento = 'Preenchimento obrigatório'
    
    setErros(novosErros)
    
    if (Object.keys(novosErros).length > 0) {
      return
    }
    
    try {
      // Simular atualização no banco
      const entradasAtualizadas = entradas.map(entrada => 
        entrada.id === itemEditando.id 
          ? {
              ...entrada,
              tipo_produto: formData.tipoProduto,
              produto: formData.produto,
              quantidade: formData.quantidade,
              unidade: formData.unidade,
              data_entrada: formData.dataEntrada,
              responsavel: formData.responsavel
            }
          : entrada
      )
      setEntradas(entradasAtualizadas)
      localStorage.setItem('entradas', JSON.stringify(entradasAtualizadas))
      
      // Disparar evento para atualizar o gráfico
      window.dispatchEvent(new Event('entradasUpdated'))
      
      setAlteracoesConcluidas(true)
      setTimeout(() => {
        setAlteracoesConcluidas(false)
        handleCancelarEdicao()
      }, 2000)
    } catch (error) {
      alert('Erro ao alterar informações')
    }
  }

  const handleExcluir = (id) => {
    const entrada = entradas.find(e => e.id === id)
    setItemExcluir(entrada)
    setModalExcluir(true)
  }

  const confirmarExclusao = async () => {
    try {
      // Simular exclusão no banco
      const novasEntradas = entradas.filter(entrada => entrada.id !== itemExcluir.id)
      setEntradas(novasEntradas)
      localStorage.setItem('entradas', JSON.stringify(novasEntradas))
      
      // Disparar evento para atualizar o gráfico
      window.dispatchEvent(new Event('entradasUpdated'))
      setExclusaoConcluida(true)
      setTimeout(() => {
        setExclusaoConcluida(false)
        setModalExcluir(false)
        setItemExcluir(null)
      }, 2000)
    } catch (error) {
      alert('Erro ao excluir entrada')
    }
  }

  const cancelarExclusao = () => {
    setModalExcluir(false)
    setItemExcluir(null)
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
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {editando ? 'Editar Entrada de Produto' : 'Registrar Entrada de Produtos'}
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
            <label className="block text-sm font-medium mb-2">Data da Entrada</label>
            <input
              type="date"
              value={formData.dataEntrada}
              onChange={(e) => setFormData({...formData, dataEntrada: e.target.value})}
              className={`w-full p-2 border rounded ${erros.dataEntrada ? 'border-red-500' : ''}`}
            />
            {erros.dataEntrada && <div className="text-red-500 text-sm mt-1">{erros.dataEntrada}</div>}
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
            <label className="block text-sm font-medium mb-2">Parceiro / Patrocinador</label>
            <input
              type="text"
              placeholder="Nome do parceiro ou patrocinador"
              value={formData.parceiro}
              onChange={(e) => setFormData({...formData, parceiro: e.target.value})}
              className={`w-full p-2 border rounded ${erros.parceiro ? 'border-red-500' : ''}`}
            />
            {erros.parceiro && <div className="text-red-500 text-sm mt-1">{erros.parceiro}</div>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Documento</label>
            <div className="flex gap-2">
              <select
                value={formData.tipoDocumento}
                onChange={(e) => setFormData({...formData, tipoDocumento: e.target.value, documento: ''})}
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
                className={`flex-1 p-2 border rounded ${erros.documento ? 'border-red-500' : ''}`}
              />
            </div>
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
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Registrar Entrada
            </button>
          )}
        </div>
      </form>
      )}

      {editando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Editar Entrada de Produto</h2>
            
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
                <label className="block text-sm font-medium mb-2">Data da Entrada</label>
                <input
                  type="date"
                  value={formData.dataEntrada}
                  onChange={(e) => setFormData({...formData, dataEntrada: e.target.value})}
                  className={`w-full p-2 border rounded ${erros.dataEntrada ? 'border-red-500' : ''}`}
                />
                {erros.dataEntrada && <div className="text-red-500 text-sm mt-1">{erros.dataEntrada}</div>}
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
                <label className="block text-sm font-medium mb-2">Parceiro / Patrocinador</label>
                <input
                  type="text"
                  placeholder="Nome do parceiro ou patrocinador"
                  value={formData.parceiro}
                  onChange={(e) => setFormData({...formData, parceiro: e.target.value})}
                  className={`w-full p-2 border rounded ${erros.parceiro ? 'border-red-500' : ''}`}
                />
                {erros.parceiro && <div className="text-red-500 text-sm mt-1">{erros.parceiro}</div>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Documento</label>
                <div className="flex gap-2">
                  <select
                    value={formData.tipoDocumento}
                    onChange={(e) => setFormData({...formData, tipoDocumento: e.target.value, documento: ''})}
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
                    className={`flex-1 p-2 border rounded ${erros.documento ? 'border-red-500' : ''}`}
                  />
                </div>
                {erros.documento && <div className="text-red-500 text-sm mt-1">{erros.documento}</div>}
              </div>
            </form>

            <div className="mt-6 text-center">
              <div className="space-x-4">
                <button
                  type="button"
                  onClick={handleAlterarInformacoes}
                  className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={handleCancelarEdicao}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
              {alteracoesConcluidas && (
                <div className="mt-4 text-green-600 font-medium">
                  Alterações Concluídas
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Entradas Registradas</h2>
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
              {entradas
                .slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina)
                .map((entrada) => (
                <tr key={entrada.id}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{entrada.cod_entrada}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{new Date(entrada.data_entrada).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{entrada.tipo_produto}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{entrada.produto}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{entrada.quantidade}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{entrada.unidade}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{entrada.responsavel}</td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleEditar(entrada.id)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleExcluir(entrada.id)}
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
        
        {entradas.length > itensPorPagina && (
          <div className="mt-4 flex justify-center">
            <div className="flex space-x-2">
              {Array.from({ length: Math.ceil(entradas.length / itensPorPagina) }, (_, i) => (
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
              Deseja realmente excluir a entrada do produto <strong>{itemExcluir?.produto}</strong>?
            </p>
            <div className="text-center">
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
              {exclusaoConcluida && (
                <div className="mt-4 text-green-600 font-medium">
                  Exclusão Concluída
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}