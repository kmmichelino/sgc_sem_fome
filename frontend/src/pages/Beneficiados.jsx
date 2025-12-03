import { useState, useEffect } from 'react'

export default function Beneficiados() {
  const [beneficiados, setBeneficiados] = useState([])
  const [paginaAtual, setPaginaAtual] = useState(1)
  const itensPorPagina = 10
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    endereco: '',
    numeroMembros: '',
    rendaFamiliar: '',
    observacoes: '',
    status: 'Ativo'
  })
  const [erros, setErros] = useState({})
  const [editando, setEditando] = useState(false)
  const [itemEditando, setItemEditando] = useState(null)
  const [modalExcluir, setModalExcluir] = useState(false)
  const [itemExcluir, setItemExcluir] = useState(null)
  const [cadastroConcluido, setCadastroConcluido] = useState(false)
  const [alteracoesConcluidas, setAlteracoesConcluidas] = useState(false)

  useEffect(() => {
    carregarBeneficiados()
  }, [])

  const carregarBeneficiados = async () => {
    try {
      const beneficiadosIniciais = [
        { id: 1, cod_beneficiado: 1, nome: 'Cláudia Pereira', cpf: '456.789.123-00', telefone: '(11) 88888-2222', endereco: 'Rua das Flores, 123', numero_membros: 4, renda_familiar: 1200.00, status: 'Ativo' },
        { id: 2, cod_beneficiado: 2, nome: 'José Antônio', cpf: '789.123.456-11', telefone: '(11) 88888-5555', endereco: 'Av. Central, 456', numero_membros: 3, renda_familiar: 800.00, status: 'Ativo' },
        { id: 3, cod_beneficiado: 3, nome: 'Mariana Silva', cpf: '321.654.987-22', telefone: '(11) 88888-7777', endereco: 'Rua da Paz, 789', numero_membros: 5, renda_familiar: 1500.00, status: 'Ativo' },
        { id: 4, cod_beneficiado: 4, nome: 'Antônio Carlos', cpf: '654.987.321-33', telefone: '(11) 88888-9999', endereco: 'Rua Esperança, 321', numero_membros: 2, renda_familiar: 600.00, status: 'Inativo' },
        { id: 5, cod_beneficiado: 5, nome: 'Beatriz Souza', cpf: '147.258.369-44', telefone: '(11) 88888-0000', endereco: 'Rua Alegria, 654', numero_membros: 6, renda_familiar: 2000.00, status: 'Ativo' },
        { id: 6, cod_beneficiado: 6, nome: 'Ricardo Mendes', cpf: '258.369.147-55', telefone: '(11) 77777-1111', endereco: 'Av. Liberdade, 987', numero_membros: 3, renda_familiar: 900.00, status: 'Ativo' }
      ]
      setBeneficiados(beneficiadosIniciais.sort((a, b) => a.nome.localeCompare(b.nome)))
    } catch (error) {
      console.error('Erro ao carregar beneficiados:', error)
    }
  }

  const formatarCPF = (valor) => {
    const numeros = valor.replace(/\D/g, '')
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const handleCPFChange = (e) => {
    const valor = e.target.value
    const numerosSomente = valor.replace(/\D/g, '')
    
    if (numerosSomente.length <= 11) {
      const cpfFormatado = formatarCPF(numerosSomente)
      setFormData({...formData, cpf: cpfFormatado})
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const novosErros = {}
    if (!formData.nome) novosErros.nome = 'Preenchimento obrigatório'
    if (!formData.cpf) novosErros.cpf = 'Preenchimento obrigatório'
    if (!formData.telefone) novosErros.telefone = 'Preenchimento obrigatório'
    if (!formData.endereco) novosErros.endereco = 'Preenchimento obrigatório'
    if (!formData.numeroMembros) novosErros.numeroMembros = 'Preenchimento obrigatório'
    
    setErros(novosErros)
    
    if (Object.keys(novosErros).length > 0) {
      return
    }
    
    try {
      const novoBeneficiado = {
        id: Date.now(),
        cod_beneficiado: beneficiados.length + 1,
        nome: formData.nome,
        cpf: formData.cpf,
        telefone: formData.telefone,
        endereco: formData.endereco,
        numero_membros: parseInt(formData.numeroMembros),
        renda_familiar: parseFloat(formData.rendaFamiliar) || 0,
        status: 'Ativo'
      }
      
      const novosBeneficiados = [...beneficiados, novoBeneficiado].sort((a, b) => a.nome.localeCompare(b.nome))
      setBeneficiados(novosBeneficiados)
      
      setCadastroConcluido(true)
      setTimeout(() => {
        setCadastroConcluido(false)
        setFormData({
          nome: '',
          cpf: '',
          telefone: '',
          endereco: '',
          numeroMembros: '',
          rendaFamiliar: '',
          observacoes: ''
        })
        setErros({})
        setShowForm(false)
      }, 2000)
    } catch (error) {
      alert('Erro ao cadastrar beneficiado')
    }
  }

  const handleEditar = (id) => {
    const beneficiado = beneficiados.find(b => b.id === id)
    if (beneficiado) {
      setFormData({
        nome: beneficiado.nome,
        cpf: beneficiado.cpf,
        telefone: beneficiado.telefone,
        endereco: beneficiado.endereco,
        numeroMembros: beneficiado.numero_membros.toString(),
        rendaFamiliar: beneficiado.renda_familiar?.toString() || '',
        observacoes: beneficiado.observacoes || '',
        status: beneficiado.status
      })
      setItemEditando(beneficiado)
      setEditando(true)
    }
  }

  const handleCancelarEdicao = () => {
    setEditando(false)
    setItemEditando(null)
    setFormData({
      nome: '',
      cpf: '',
      telefone: '',
      endereco: '',
      numeroMembros: '',
      rendaFamiliar: '',
      observacoes: ''
    })
    setErros({})
  }

  const handleAlterarInformacoes = async (e) => {
    e.preventDefault()
    
    const novosErros = {}
    if (!formData.nome) novosErros.nome = 'Preenchimento obrigatório'
    if (!formData.cpf) novosErros.cpf = 'Preenchimento obrigatório'
    if (!formData.telefone) novosErros.telefone = 'Preenchimento obrigatório'
    if (!formData.endereco) novosErros.endereco = 'Preenchimento obrigatório'
    if (!formData.numeroMembros) novosErros.numeroMembros = 'Preenchimento obrigatório'
    
    setErros(novosErros)
    
    if (Object.keys(novosErros).length > 0) {
      return
    }
    
    try {
      const beneficiadosAtualizados = beneficiados.map(beneficiado => 
        beneficiado.id === itemEditando.id 
          ? {
              ...beneficiado,
              nome: formData.nome,
              cpf: formData.cpf,
              telefone: formData.telefone,
              endereco: formData.endereco,
              numero_membros: parseInt(formData.numeroMembros),
              renda_familiar: parseFloat(formData.rendaFamiliar) || 0,
              status: formData.status
            }
          : beneficiado
      ).sort((a, b) => a.nome.localeCompare(b.nome))
      setBeneficiados(beneficiadosAtualizados)
      
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
    const beneficiado = beneficiados.find(b => b.id === id)
    setItemExcluir(beneficiado)
    setModalExcluir(true)
  }

  const confirmarExclusao = async () => {
    try {
      const novosBeneficiados = beneficiados.filter(beneficiado => beneficiado.id !== itemExcluir.id).sort((a, b) => a.nome.localeCompare(b.nome))
      setBeneficiados(novosBeneficiados)
      setModalExcluir(false)
      setItemExcluir(null)
      alert('Beneficiado excluído com sucesso!')
    } catch (error) {
      alert('Erro ao excluir beneficiado')
    }
  }

  const cancelarExclusao = () => {
    setModalExcluir(false)
    setItemExcluir(null)
  }

  return (
    <div className="container mx-auto p-4">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <h1 className="text-2xl font-bold">Beneficiados</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          {showForm ? 'Cancelar' : 'Novo Beneficiado'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-4xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Nome Completo</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                className={`w-full p-2 border rounded ${erros.nome ? 'border-red-500' : ''}`}
                required
              />
              {erros.nome && <div className="text-red-500 text-sm mt-1">{erros.nome}</div>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">CPF</label>
              <input
                type="text"
                value={formData.cpf}
                onChange={handleCPFChange}
                placeholder="000.000.000-00"
                className={`w-full p-2 border rounded ${erros.cpf ? 'border-red-500' : ''}`}
                required
              />
              {erros.cpf && <div className="text-red-500 text-sm mt-1">{erros.cpf}</div>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Telefone</label>
              <input
                type="text"
                value={formData.telefone}
                onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                className={`w-full p-2 border rounded ${erros.telefone ? 'border-red-500' : ''}`}
                required
              />
              {erros.telefone && <div className="text-red-500 text-sm mt-1">{erros.telefone}</div>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Endereço</label>
              <input
                type="text"
                value={formData.endereco}
                onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                className={`w-full p-2 border rounded ${erros.endereco ? 'border-red-500' : ''}`}
                required
              />
              {erros.endereco && <div className="text-red-500 text-sm mt-1">{erros.endereco}</div>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Número de Membros da Família</label>
              <input
                type="number"
                value={formData.numeroMembros}
                onChange={(e) => setFormData({...formData, numeroMembros: e.target.value})}
                className={`w-full p-2 border rounded ${erros.numeroMembros ? 'border-red-500' : ''}`}
                required
              />
              {erros.numeroMembros && <div className="text-red-500 text-sm mt-1">{erros.numeroMembros}</div>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Renda Familiar (R$)</label>
              <input
                type="number"
                step="0.01"
                value={formData.rendaFamiliar}
                onChange={(e) => setFormData({...formData, rendaFamiliar: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4 md:col-span-2">
              <label className="block text-sm font-medium mb-2">Observações</label>
              <textarea
                value={formData.observacoes}
                onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                className="w-full p-2 border rounded"
                rows="3"
                placeholder="Observações adicionais..."
              />
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              Cadastrar Beneficiado
            </button>
            {cadastroConcluido && (
              <div className="mt-4 text-green-600 font-medium">
                Beneficiado Cadastrado
              </div>
            )}
          </div>
        </form>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Beneficiados Cadastrados</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Cód.</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Nome</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">CPF</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Telefone</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Membros</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Renda</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {beneficiados
                .slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina)
                .map((beneficiado) => (
                <tr key={beneficiado.id}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{beneficiado.cod_beneficiado}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{beneficiado.nome}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{beneficiado.cpf}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{beneficiado.telefone}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{beneficiado.numero_membros}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    R$ {beneficiado.renda_familiar?.toFixed(2) || '0,00'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      beneficiado.status === 'Ativo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {beneficiado.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleEditar(beneficiado.id)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleExcluir(beneficiado.id)}
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
        
        {beneficiados.length > itensPorPagina && (
          <div className="mt-4 flex justify-center">
            <div className="flex space-x-2">
              {Array.from({ length: Math.ceil(beneficiados.length / itensPorPagina) }, (_, i) => (
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

      {editando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Editar Beneficiado</h2>
            
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Nome Completo</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  className={`w-full p-2 border rounded ${erros.nome ? 'border-red-500' : ''}`}
                  required
                />
                {erros.nome && <div className="text-red-500 text-sm mt-1">{erros.nome}</div>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">CPF</label>
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={handleCPFChange}
                  placeholder="000.000.000-00"
                  className={`w-full p-2 border rounded ${erros.cpf ? 'border-red-500' : ''}`}
                  required
                />
                {erros.cpf && <div className="text-red-500 text-sm mt-1">{erros.cpf}</div>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Telefone</label>
                <input
                  type="text"
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  className={`w-full p-2 border rounded ${erros.telefone ? 'border-red-500' : ''}`}
                  required
                />
                {erros.telefone && <div className="text-red-500 text-sm mt-1">{erros.telefone}</div>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Endereço</label>
                <input
                  type="text"
                  value={formData.endereco}
                  onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                  className={`w-full p-2 border rounded ${erros.endereco ? 'border-red-500' : ''}`}
                  required
                />
                {erros.endereco && <div className="text-red-500 text-sm mt-1">{erros.endereco}</div>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Número de Membros da Família</label>
                <input
                  type="number"
                  value={formData.numeroMembros}
                  onChange={(e) => setFormData({...formData, numeroMembros: e.target.value})}
                  className={`w-full p-2 border rounded ${erros.numeroMembros ? 'border-red-500' : ''}`}
                  required
                />
                {erros.numeroMembros && <div className="text-red-500 text-sm mt-1">{erros.numeroMembros}</div>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Renda Familiar (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.rendaFamiliar}
                  onChange={(e) => setFormData({...formData, rendaFamiliar: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Observações</label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                  className="w-full p-2 border rounded"
                  rows="3"
                  placeholder="Observações adicionais..."
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
            </form>

            <div className="mt-6 text-center">
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
              {alteracoesConcluidas && (
                <div className="mt-4 text-green-600 font-medium">
                  Dados Cadastrais Alterados
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {modalExcluir && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4 text-center">Confirmar Exclusão?</h3>
            <p className="text-gray-600 mb-6 text-center">
              Deseja realmente excluir o beneficiado <strong>{itemExcluir?.nome}</strong>?
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