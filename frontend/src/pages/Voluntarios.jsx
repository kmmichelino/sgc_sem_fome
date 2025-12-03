import { useState, useEffect } from 'react'

export default function Voluntarios() {
  const [voluntarios, setVoluntarios] = useState([])
  const [paginaAtual, setPaginaAtual] = useState(1)
  const itensPorPagina = 10
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    nomeUsuario: '',
    senha: '',
    turnoDisponivel: '',
    responsavelPor: {
      beneficiados: false,
      entradaProdutos: false,
      financeiro: false,
      patrocinadores: false,
      saidaProdutos: false
    }
  })
  const [erros, setErros] = useState({})
  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState(false)
  const [itemEditando, setItemEditando] = useState(null)
  const [modalExcluir, setModalExcluir] = useState(false)
  const [itemExcluir, setItemExcluir] = useState(null)
  const [voluntarioAtualizado, setVoluntarioAtualizado] = useState(false)

  useEffect(() => {
    carregarVoluntarios()
  }, [])

  const carregarVoluntarios = async () => {
    try {
      const voluntariosSalvos = JSON.parse(localStorage.getItem('voluntarios') || '[]')
      
      const voluntariosIniciais = [
        { id: 1, cod_voluntario: 1, nome: 'Ana Silva', cpf: '123.456.789-01', telefone: '(11) 99999-1111', email: 'ana@ong.com', nomeUsuario: 'ana.silva', turnoDisponivel: 'Manhã', responsavelPor: ['Beneficiados', 'Financeiro'] },
        { id: 2, cod_voluntario: 2, nome: 'Carlos Santos', cpf: '987.654.321-02', telefone: '(11) 99999-2222', email: 'carlos@ong.com', nomeUsuario: 'carlos.santos', turnoDisponivel: 'Integral', responsavelPor: ['Entrada de Produtos', 'Saída de Produtos'] },
        { id: 3, cod_voluntario: 3, nome: 'Maria Oliveira', cpf: '111.222.333-03', telefone: '(11) 99999-3333', email: 'maria@ong.com', nomeUsuario: 'maria.oliveira', turnoDisponivel: 'Tarde', responsavelPor: ['Patrocinadores'] }
      ]
      
      if (voluntariosSalvos.length === 0) {
        localStorage.setItem('voluntarios', JSON.stringify(voluntariosIniciais))
        setVoluntarios(voluntariosIniciais.sort((a, b) => a.nome.localeCompare(b.nome)))
      } else {
        setVoluntarios(voluntariosSalvos.sort((a, b) => a.nome.localeCompare(b.nome)))
      }
    } catch (error) {
      console.error('Erro ao carregar voluntários:', error)
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

  const handleResponsavelChange = (area) => {
    setFormData({
      ...formData,
      responsavelPor: {
        ...formData.responsavelPor,
        [area]: !formData.responsavelPor[area]
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const novosErros = {}
    if (!formData.nome) novosErros.nome = 'Preenchimento obrigatório'
    if (!formData.cpf) novosErros.cpf = 'Preenchimento obrigatório'
    if (!formData.telefone) novosErros.telefone = 'Preenchimento obrigatório'
    if (!formData.email) novosErros.email = 'Preenchimento obrigatório'
    if (!formData.nomeUsuario) novosErros.nomeUsuario = 'Preenchimento obrigatório'
    if (!formData.senha) novosErros.senha = 'Preenchimento obrigatório'
    
    setErros(novosErros)
    
    if (Object.keys(novosErros).length > 0) {
      return
    }
    
    try {
      const responsaveis = Object.keys(formData.responsavelPor)
        .filter(key => formData.responsavelPor[key])
        .map(key => {
          const nomes = {
            beneficiados: 'Beneficiados',
            entradaProdutos: 'Entrada de Produtos',
            financeiro: 'Financeiro',
            patrocinadores: 'Patrocinadores',
            saidaProdutos: 'Saída de Produtos'
          }
          return nomes[key]
        })
      
      const novoVoluntario = {
        id: Date.now(),
        cod_voluntario: voluntarios.length + 1,
        nome: formData.nome,
        cpf: formData.cpf,
        telefone: formData.telefone,
        email: formData.email,
        nomeUsuario: formData.nomeUsuario,
        turnoDisponivel: formData.turnoDisponivel,
        responsavelPor: responsaveis
      }
      
      const novosVoluntarios = [...voluntarios, novoVoluntario].sort((a, b) => a.nome.localeCompare(b.nome))
      setVoluntarios(novosVoluntarios)
      localStorage.setItem('voluntarios', JSON.stringify(novosVoluntarios))
      
      alert('Voluntário cadastrado com sucesso!')
      setFormData({
        nome: '',
        cpf: '',
        telefone: '',
        email: '',
        nomeUsuario: '',
        senha: '',
        turnoDisponivel: '',
        responsavelPor: {
          beneficiados: false,
          entradaProdutos: false,
          financeiro: false,
          patrocinadores: false,
          saidaProdutos: false
        }
      })
      setErros({})
      setShowForm(false)
    } catch (error) {
      alert('Erro ao cadastrar voluntário')
    }
  }

  const handleEditar = (id) => {
    const voluntario = voluntarios.find(v => v.id === id)
    if (voluntario) {
      const responsavelObj = {
        beneficiados: voluntario.responsavelPor?.includes('Beneficiados') || false,
        entradaProdutos: voluntario.responsavelPor?.includes('Entrada de Produtos') || false,
        financeiro: voluntario.responsavelPor?.includes('Financeiro') || false,
        patrocinadores: voluntario.responsavelPor?.includes('Patrocinadores') || false,
        saidaProdutos: voluntario.responsavelPor?.includes('Saída de Produtos') || false
      }
      
      setFormData({
        nome: voluntario.nome,
        cpf: voluntario.cpf,
        telefone: voluntario.telefone,
        email: voluntario.email,
        nomeUsuario: voluntario.nomeUsuario,
        senha: '',
        turnoDisponivel: voluntario.turnoDisponivel || '',
        responsavelPor: responsavelObj
      })
      setItemEditando(voluntario)
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
      email: '',
      nomeUsuario: '',
      senha: '',
      turnoDisponivel: '',
      responsavelPor: {
        beneficiados: false,
        entradaProdutos: false,
        financeiro: false,
        patrocinadores: false,
        saidaProdutos: false
      }
    })
    setErros({})
  }

  const handleAlterarInformacoes = async (e) => {
    e.preventDefault()
    
    const novosErros = {}
    if (!formData.nome) novosErros.nome = 'Preenchimento obrigatório'
    if (!formData.cpf) novosErros.cpf = 'Preenchimento obrigatório'
    if (!formData.telefone) novosErros.telefone = 'Preenchimento obrigatório'
    if (!formData.email) novosErros.email = 'Preenchimento obrigatório'
    if (!formData.nomeUsuario) novosErros.nomeUsuario = 'Preenchimento obrigatório'
    
    setErros(novosErros)
    
    if (Object.keys(novosErros).length > 0) {
      return
    }
    
    try {
      const responsaveis = Object.keys(formData.responsavelPor)
        .filter(key => formData.responsavelPor[key])
        .map(key => {
          const nomes = {
            beneficiados: 'Beneficiados',
            entradaProdutos: 'Entrada de Produtos',
            financeiro: 'Financeiro',
            patrocinadores: 'Patrocinadores',
            saidaProdutos: 'Saída de Produtos'
          }
          return nomes[key]
        })
      
      const voluntariosAtualizados = voluntarios.map(voluntario => 
        voluntario.id === itemEditando.id 
          ? {
              ...voluntario,
              nome: formData.nome,
              cpf: formData.cpf,
              telefone: formData.telefone,
              email: formData.email,
              nomeUsuario: formData.nomeUsuario,
              turnoDisponivel: formData.turnoDisponivel,
              responsavelPor: responsaveis
            }
          : voluntario
      ).sort((a, b) => a.nome.localeCompare(b.nome))
      setVoluntarios(voluntariosAtualizados)
      localStorage.setItem('voluntarios', JSON.stringify(voluntariosAtualizados))
      
      setVoluntarioAtualizado(true)
      setTimeout(() => {
        setVoluntarioAtualizado(false)
        handleCancelarEdicao()
      }, 2000)
    } catch (error) {
      alert('Erro ao alterar informações')
    }
  }

  const handleExcluir = (id) => {
    const voluntario = voluntarios.find(v => v.id === id)
    setItemExcluir(voluntario)
    setModalExcluir(true)
  }

  const confirmarExclusao = async () => {
    try {
      const novosVoluntarios = voluntarios.filter(voluntario => voluntario.id !== itemExcluir.id).sort((a, b) => a.nome.localeCompare(b.nome))
      setVoluntarios(novosVoluntarios)
      localStorage.setItem('voluntarios', JSON.stringify(novosVoluntarios))
      setModalExcluir(false)
      setItemExcluir(null)
      alert('Voluntário excluído com sucesso!')
    } catch (error) {
      alert('Erro ao excluir voluntário')
    }
  }

  const cancelarExclusao = () => {
    setModalExcluir(false)
    setItemExcluir(null)
  }

  return (
    <div className="container mx-auto p-4">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <h1 className="text-2xl font-bold">
          {editando ? 'Editar Voluntário' : 'Voluntários'}
        </h1>
        {!editando && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            {showForm ? 'Cancelar' : 'Novo Voluntário'}
          </button>
        )}
      </div>
      
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-4xl mb-8 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Nome</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              className={`w-full p-2 border rounded ${erros.nome ? 'border-red-500' : ''}`}
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
            />
            {erros.telefone && <div className="text-red-500 text-sm mt-1">{erros.telefone}</div>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">E-mail</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className={`w-full p-2 border rounded ${erros.email ? 'border-red-500' : ''}`}
            />
            {erros.email && <div className="text-red-500 text-sm mt-1">{erros.email}</div>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Nome de Usuário</label>
            <input
              type="text"
              value={formData.nomeUsuario}
              onChange={(e) => setFormData({...formData, nomeUsuario: e.target.value})}
              className={`w-full p-2 border rounded ${erros.nomeUsuario ? 'border-red-500' : ''}`}
            />
            {erros.nomeUsuario && <div className="text-red-500 text-sm mt-1">{erros.nomeUsuario}</div>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Senha para o Usuário</label>
            <input
              type="password"
              value={formData.senha}
              onChange={(e) => setFormData({...formData, senha: e.target.value})}
              className={`w-full p-2 border rounded ${erros.senha ? 'border-red-500' : ''}`}
            />
            {erros.senha && <div className="text-red-500 text-sm mt-1">{erros.senha}</div>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Turno Disponível</label>
            <select
              value={formData.turnoDisponivel}
              onChange={(e) => setFormData({...formData, turnoDisponivel: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="">Selecione</option>
              <option value="Manhã">Manhã</option>
              <option value="Tarde">Tarde</option>
              <option value="Noite">Noite</option>
              <option value="Diurno">Diurno</option>
              <option value="Noturno">Noturno</option>
              <option value="Integral">Integral</option>
            </select>
          </div>

          <div className="mb-4 md:col-span-2">
            <label className="block text-sm font-medium mb-2">Responsável por</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.responsavelPor.beneficiados}
                  onChange={() => handleResponsavelChange('beneficiados')}
                  className="mr-2"
                />
                Beneficiados
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.responsavelPor.entradaProdutos}
                  onChange={() => handleResponsavelChange('entradaProdutos')}
                  className="mr-2"
                />
                Entrada de Produtos
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.responsavelPor.financeiro}
                  onChange={() => handleResponsavelChange('financeiro')}
                  className="mr-2"
                />
                Financeiro
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.responsavelPor.patrocinadores}
                  onChange={() => handleResponsavelChange('patrocinadores')}
                  className="mr-2"
                />
                Patrocinadores
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.responsavelPor.saidaProdutos}
                  onChange={() => handleResponsavelChange('saidaProdutos')}
                  className="mr-2"
                />
                Saída de Produtos
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Cadastrar Voluntário
          </button>
        </div>
        </form>
      )}

      {editando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Editar Voluntário</h2>
            
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Nome</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  className={`w-full p-2 border rounded ${erros.nome ? 'border-red-500' : ''}`}
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
                />
                {erros.telefone && <div className="text-red-500 text-sm mt-1">{erros.telefone}</div>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">E-mail</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full p-2 border rounded ${erros.email ? 'border-red-500' : ''}`}
                />
                {erros.email && <div className="text-red-500 text-sm mt-1">{erros.email}</div>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Nome de Usuário</label>
                <input
                  type="text"
                  value={formData.nomeUsuario}
                  onChange={(e) => setFormData({...formData, nomeUsuario: e.target.value})}
                  className={`w-full p-2 border rounded ${erros.nomeUsuario ? 'border-red-500' : ''}`}
                />
                {erros.nomeUsuario && <div className="text-red-500 text-sm mt-1">{erros.nomeUsuario}</div>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Nova Senha (deixe em branco para manter)</label>
                <input
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData({...formData, senha: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Turno Disponível</label>
                <select
                  value={formData.turnoDisponivel}
                  onChange={(e) => setFormData({...formData, turnoDisponivel: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Selecione</option>
                  <option value="Manhã">Manhã</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Noite">Noite</option>
                  <option value="Diurno">Diurno</option>
                  <option value="Noturno">Noturno</option>
                  <option value="Integral">Integral</option>
                </select>
              </div>

              <div className="mb-4 md:col-span-2">
                <label className="block text-sm font-medium mb-2">Responsável por</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.responsavelPor.beneficiados}
                      onChange={() => handleResponsavelChange('beneficiados')}
                      className="mr-2"
                    />
                    Beneficiados
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.responsavelPor.entradaProdutos}
                      onChange={() => handleResponsavelChange('entradaProdutos')}
                      className="mr-2"
                    />
                    Entrada de Produtos
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.responsavelPor.financeiro}
                      onChange={() => handleResponsavelChange('financeiro')}
                      className="mr-2"
                    />
                    Financeiro
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.responsavelPor.patrocinadores}
                      onChange={() => handleResponsavelChange('patrocinadores')}
                      className="mr-2"
                    />
                    Patrocinadores
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.responsavelPor.saidaProdutos}
                      onChange={() => handleResponsavelChange('saidaProdutos')}
                      className="mr-2"
                    />
                    Saída de Produtos
                  </label>
                </div>
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
              {voluntarioAtualizado && (
                <div className="mt-4 text-green-600 font-medium">
                  Voluntário Atualizado
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Voluntários Cadastrados</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Cód.</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Nome</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">CPF</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Telefone</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">E-mail</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Turno</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Responsável por</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {voluntarios
                .slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina)
                .map((voluntario) => (
                <tr key={voluntario.id}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{voluntario.cod_voluntario}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{voluntario.nome}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{voluntario.cpf}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{voluntario.telefone}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{voluntario.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{voluntario.turnoDisponivel || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {voluntario.responsavelPor?.join(', ') || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleEditar(voluntario.id)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleExcluir(voluntario.id)}
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
        
        {voluntarios.length > itensPorPagina && (
          <div className="mt-4 flex justify-center">
            <div className="flex space-x-2">
              {Array.from({ length: Math.ceil(voluntarios.length / itensPorPagina) }, (_, i) => (
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
              Deseja realmente excluir o voluntário <strong>{itemExcluir?.nome}</strong>?
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