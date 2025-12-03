import { useState, useEffect } from 'react'

export default function CadastroPatrocinadores() {
  const [patrocinadores, setPatrocinadores] = useState([])
  const [paginaAtual, setPaginaAtual] = useState(1)
  const itensPorPagina = 10
  const [formData, setFormData] = useState({
    nome: '',
    tipoDocumento: 'CPF',
    documento: '',
    rg: '',
    dataNascimento: '',
    ie: '',
    celular: '',
    email: '',
    statusFiliacao: 'Ativa',
    dataFiliacao: ''
  })
  const [erros, setErros] = useState({})
  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState(false)
  const [itemEditando, setItemEditando] = useState(null)
  const [modalExcluir, setModalExcluir] = useState(false)
  const [itemExcluir, setItemExcluir] = useState(null)
  const [patrocinadorAtualizado, setPatrocinadorAtualizado] = useState(false)

  useEffect(() => {
    carregarPatrocinadores()
  }, [])

  const carregarPatrocinadores = async () => {
    try {
      const patrocinadoresIniciais = [
        { id: 1, cod_patrocinador: 1, nome: 'João Silva', documento: '123.456.789-00', rg: '12.345.678-9', data_nascimento: '1985-03-15', telefone: '(11) 99999-1111', email: 'joao@email.com', status_filiacao: 'Ativa', data_filiacao: '2024-01-01' },
        { id: 2, cod_patrocinador: 2, nome: 'Maria Santos', documento: '987.654.321-00', rg: '98.765.432-1', data_nascimento: '1990-07-22', telefone: '(11) 99999-2222', email: 'maria@email.com', status_filiacao: 'Ativa', data_filiacao: '2024-01-01' },
        { id: 3, cod_patrocinador: 3, nome: 'Empresa ABC Ltda', documento: '12.345.678/0001-90', ie: '123456789', telefone: '(11) 3333-4444', email: 'contato@abc.com', status_filiacao: 'Ativa', data_filiacao: '2024-01-01' },
        { id: 4, cod_patrocinador: 4, nome: 'Pedro Oliveira', documento: '111.222.333-44', rg: '11.122.233-4', data_nascimento: '1988-12-10', telefone: '(11) 99999-5555', email: 'pedro@email.com', status_filiacao: 'Inativa', data_filiacao: '2024-01-01' },
        { id: 5, cod_patrocinador: 5, nome: 'Comercial XYZ S/A', documento: '98.765.432/0001-10', ie: '987654321', telefone: '(11) 4444-5555', email: 'xyz@empresa.com', status_filiacao: 'Ativa', data_filiacao: '2024-01-01' },
        { id: 6, cod_patrocinador: 6, nome: 'Ana Costa', documento: '555.666.777-88', rg: '55.566.677-7', data_nascimento: '1992-05-18', telefone: '(11) 99999-6666', email: 'ana@email.com', status_filiacao: 'Ativa', data_filiacao: '2024-01-01' },
        { id: 7, cod_patrocinador: 7, nome: 'Carlos Ferreira', documento: '999.888.777-66', rg: '99.988.877-6', data_nascimento: '1980-11-03', telefone: '(11) 99999-7777', email: 'carlos@email.com', status_filiacao: 'Ativa', data_filiacao: '2024-01-01' },
        { id: 8, cod_patrocinador: 8, nome: 'Indústria DEF Ltda', documento: '11.222.333/0001-44', ie: '112223334', telefone: '(11) 5555-6666', email: 'def@industria.com', status_filiacao: 'Inativa', data_filiacao: '2024-01-01' },
        { id: 9, cod_patrocinador: 9, nome: 'Lucia Mendes', documento: '444.333.222-11', rg: '44.433.322-2', data_nascimento: '1987-09-25', telefone: '(11) 99999-8888', email: 'lucia@email.com', status_filiacao: 'Ativa', data_filiacao: '2024-01-01' },
        { id: 10, cod_patrocinador: 10, nome: 'Roberto Lima', documento: '777.888.999-00', rg: '77.788.899-9', data_nascimento: '1983-04-12', telefone: '(11) 99999-9999', email: 'roberto@email.com', status_filiacao: 'Ativa', data_filiacao: '2024-01-01' },
        { id: 11, cod_patrocinador: 11, nome: 'Supermercado GHI', documento: '22.333.444/0001-55', ie: '223334445', telefone: '(11) 6666-7777', email: 'ghi@super.com', status_filiacao: 'Ativa', data_filiacao: '2024-01-01' },
        { id: 12, cod_patrocinador: 12, nome: 'Fernanda Rocha', documento: '123.987.456-78', rg: '12.398.745-6', data_nascimento: '1995-08-30', telefone: '(11) 99999-0000', email: 'fernanda@email.com', status_filiacao: 'Inativa', data_filiacao: '2024-01-01' }
      ]
      setPatrocinadores(patrocinadoresIniciais.sort((a, b) => a.nome.localeCompare(b.nome)))
    } catch (error) {
      console.error('Erro ao carregar patrocinadores:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const novosErros = {}
    if (!formData.nome) novosErros.nome = 'Preenchimento obrigatório'
    if (!formData.documento) novosErros.documento = 'Preenchimento obrigatório'
    if (formData.tipoDocumento === 'CPF' && !formData.rg) novosErros.rg = 'Preenchimento obrigatório'
    if (formData.tipoDocumento === 'CPF' && !formData.dataNascimento) novosErros.dataNascimento = 'Preenchimento obrigatório'
    if (formData.tipoDocumento === 'CNPJ' && !formData.ie) novosErros.ie = 'Preenchimento obrigatório'
    if (!formData.celular) novosErros.celular = 'Preenchimento obrigatório'
    if (!formData.email) novosErros.email = 'Preenchimento obrigatório'
    if (!formData.dataFiliacao) novosErros.dataFiliacao = 'Preenchimento obrigatório'
    
    setErros(novosErros)
    
    if (Object.keys(novosErros).length > 0) {
      return
    }
    
    try {
      const novoPatrocinador = {
        id: Date.now(),
        cod_patrocinador: patrocinadores.length + 1,
        nome: formData.nome,
        documento: formData.documento,
        telefone: formData.celular,
        email: formData.email,
        status_filiacao: formData.statusFiliacao
      }
      
      const novosPatrocinadores = [...patrocinadores, novoPatrocinador].sort((a, b) => a.nome.localeCompare(b.nome))
      setPatrocinadores(novosPatrocinadores)
      
      alert('Patrocinador cadastrado com sucesso!')
      setFormData({
        nome: '',
        tipoDocumento: 'CPF',
        documento: '',
        rg: '',
        dataNascimento: '',
        ie: '',
        celular: '',
        email: '',
        statusFiliacao: 'Ativa',
        dataFiliacao: ''
      })
      setErros({})
      setShowForm(false)
    } catch (error) {
      alert('Erro ao cadastrar patrocinador')
    }
  }

  const handleEditar = (id) => {
    const patrocinador = patrocinadores.find(p => p.id === id)
    if (patrocinador) {
      const tipoDoc = patrocinador.documento.includes('/') ? 'CNPJ' : 'CPF'
      setFormData({
        nome: patrocinador.nome,
        tipoDocumento: tipoDoc,
        documento: patrocinador.documento,
        rg: patrocinador.rg || '',
        dataNascimento: patrocinador.data_nascimento || '',
        ie: patrocinador.ie || '',
        celular: patrocinador.telefone,
        email: patrocinador.email,
        statusFiliacao: patrocinador.status_filiacao,
        dataFiliacao: patrocinador.data_filiacao || ''
      })
      setItemEditando(patrocinador)
      setEditando(true)
    }
  }

  const handleCancelarEdicao = () => {
    setEditando(false)
    setItemEditando(null)
    setFormData({
      nome: '',
      tipoDocumento: 'CPF',
      documento: '',
      rg: '',
      dataNascimento: '',
      ie: '',
      celular: '',
      email: '',
      statusFiliacao: 'Ativa',
      dataFiliacao: ''
    })
    setErros({})
  }

  const handleAlterarInformacoes = async (e) => {
    e.preventDefault()
    
    const novosErros = {}
    if (!formData.nome) novosErros.nome = 'Preenchimento obrigatório'
    if (!formData.documento) novosErros.documento = 'Preenchimento obrigatório'
    if (formData.tipoDocumento === 'CPF' && !formData.rg) novosErros.rg = 'Preenchimento obrigatório'
    if (formData.tipoDocumento === 'CPF' && !formData.dataNascimento) novosErros.dataNascimento = 'Preenchimento obrigatório'
    if (formData.tipoDocumento === 'CNPJ' && !formData.ie) novosErros.ie = 'Preenchimento obrigatório'
    if (!formData.celular) novosErros.celular = 'Preenchimento obrigatório'
    if (!formData.email) novosErros.email = 'Preenchimento obrigatório'
    if (!formData.dataFiliacao) novosErros.dataFiliacao = 'Preenchimento obrigatório'
    
    setErros(novosErros)
    
    if (Object.keys(novosErros).length > 0) {
      return
    }
    
    try {
      const patrocinadoresAtualizados = patrocinadores.map(patrocinador => 
        patrocinador.id === itemEditando.id 
          ? {
              ...patrocinador,
              nome: formData.nome,
              documento: formData.documento,
              telefone: formData.celular,
              email: formData.email,
              status_filiacao: formData.statusFiliacao
            }
          : patrocinador
      ).sort((a, b) => a.nome.localeCompare(b.nome))
      setPatrocinadores(patrocinadoresAtualizados)
      
      setPatrocinadorAtualizado(true)
      setTimeout(() => {
        setPatrocinadorAtualizado(false)
        handleCancelarEdicao()
      }, 2000)
    } catch (error) {
      alert('Erro ao alterar informações')
    }
  }

  const handleExcluir = (id) => {
    const patrocinador = patrocinadores.find(p => p.id === id)
    setItemExcluir(patrocinador)
    setModalExcluir(true)
  }

  const confirmarExclusao = async () => {
    try {
      const novosPatrocinadores = patrocinadores.filter(patrocinador => patrocinador.id !== itemExcluir.id).sort((a, b) => a.nome.localeCompare(b.nome))
      setPatrocinadores(novosPatrocinadores)
      setModalExcluir(false)
      setItemExcluir(null)
      alert('Patrocinador excluído com sucesso!')
    } catch (error) {
      alert('Erro ao excluir patrocinador')
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

  const handleTipoDocumentoChange = (e) => {
    setFormData({
      ...formData, 
      tipoDocumento: e.target.value, 
      documento: '',
      rg: '',
      dataNascimento: '',
      ie: ''
    })
  }

  return (
    <div className="container mx-auto p-4">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <h1 className="text-2xl font-bold">
          {editando ? 'Editar Patrocinador' : 'Patrocinadores'}
        </h1>
        {!editando && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            {showForm ? 'Cancelar' : 'Novo Patrocinador'}
          </button>
        )}
      </div>
      
      {showForm && (
        <form onSubmit={editando ? handleAlterarInformacoes : handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-4xl mb-8 mx-auto">
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
            <label className="block text-sm font-medium mb-2">Documento</label>
            <div className="flex gap-2">
              <select
                value={formData.tipoDocumento}
                onChange={handleTipoDocumentoChange}
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

          {formData.tipoDocumento === 'CPF' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">RG</label>
                <input
                  type="text"
                  value={formData.rg}
                  onChange={(e) => setFormData({...formData, rg: e.target.value})}
                  className={`w-full p-2 border rounded ${erros.rg ? 'border-red-500' : ''}`}
                />
                {erros.rg && <div className="text-red-500 text-sm mt-1">{erros.rg}</div>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Data de Nascimento</label>
                <input
                  type="date"
                  value={formData.dataNascimento}
                  onChange={(e) => setFormData({...formData, dataNascimento: e.target.value})}
                  className={`w-full p-2 border rounded ${erros.dataNascimento ? 'border-red-500' : ''}`}
                />
                {erros.dataNascimento && <div className="text-red-500 text-sm mt-1">{erros.dataNascimento}</div>}
              </div>
            </>
          )}

          {formData.tipoDocumento === 'CNPJ' && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">IE</label>
              <input
                type="text"
                value={formData.ie}
                onChange={(e) => setFormData({...formData, ie: e.target.value.replace(/\D/g, '')})}
                className={`w-full p-2 border rounded ${erros.ie ? 'border-red-500' : ''}`}
              />
              {erros.ie && <div className="text-red-500 text-sm mt-1">{erros.ie}</div>}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Número Celular</label>
            <input
              type="text"
              value={formData.celular}
              onChange={(e) => setFormData({...formData, celular: e.target.value})}
              className={`w-full p-2 border rounded ${erros.celular ? 'border-red-500' : ''}`}
            />
            {erros.celular && <div className="text-red-500 text-sm mt-1">{erros.celular}</div>}
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
            <label className="block text-sm font-medium mb-2">Filiação</label>
            <select
              value={formData.statusFiliacao}
              onChange={(e) => setFormData({...formData, statusFiliacao: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="Ativa">Ativa</option>
              <option value="Inativa">Inativa</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Data da Filiação</label>
            <input
              type="date"
              value={formData.dataFiliacao}
              onChange={(e) => setFormData({...formData, dataFiliacao: e.target.value})}
              className={`w-full p-2 border rounded ${erros.dataFiliacao ? 'border-red-500' : ''}`}
            />
            {erros.dataFiliacao && <div className="text-red-500 text-sm mt-1">{erros.dataFiliacao}</div>}
          </div>
        </div>

        <div className="mt-6 text-center">
          {editando ? (
            <div className="space-x-4">
              <button
                type="submit"
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
          ) : (
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              Cadastrar Patrocinador
            </button>
          )}
        </div>
        </form>
      )}

      {editando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Editar Patrocinador</h2>
            
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
                <label className="block text-sm font-medium mb-2">Documento</label>
                <div className="flex gap-2">
                  <select
                    value={formData.tipoDocumento}
                    onChange={handleTipoDocumentoChange}
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

              {formData.tipoDocumento === 'CPF' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">RG</label>
                    <input
                      type="text"
                      value={formData.rg}
                      onChange={(e) => setFormData({...formData, rg: e.target.value})}
                      className={`w-full p-2 border rounded ${erros.rg ? 'border-red-500' : ''}`}
                    />
                    {erros.rg && <div className="text-red-500 text-sm mt-1">{erros.rg}</div>}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Data de Nascimento</label>
                    <input
                      type="date"
                      value={formData.dataNascimento}
                      onChange={(e) => setFormData({...formData, dataNascimento: e.target.value})}
                      className={`w-full p-2 border rounded ${erros.dataNascimento ? 'border-red-500' : ''}`}
                    />
                    {erros.dataNascimento && <div className="text-red-500 text-sm mt-1">{erros.dataNascimento}</div>}
                  </div>
                </>
              )}

              {formData.tipoDocumento === 'CNPJ' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">IE</label>
                  <input
                    type="text"
                    value={formData.ie}
                    onChange={(e) => setFormData({...formData, ie: e.target.value.replace(/\D/g, '')})}
                    className={`w-full p-2 border rounded ${erros.ie ? 'border-red-500' : ''}`}
                  />
                  {erros.ie && <div className="text-red-500 text-sm mt-1">{erros.ie}</div>}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Número Celular</label>
                <input
                  type="text"
                  value={formData.celular}
                  onChange={(e) => setFormData({...formData, celular: e.target.value})}
                  className={`w-full p-2 border rounded ${erros.celular ? 'border-red-500' : ''}`}
                />
                {erros.celular && <div className="text-red-500 text-sm mt-1">{erros.celular}</div>}
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
                <label className="block text-sm font-medium mb-2">Filiação</label>
                <select
                  value={formData.statusFiliacao}
                  onChange={(e) => setFormData({...formData, statusFiliacao: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="Ativa">Ativa</option>
                  <option value="Inativa">Inativa</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Data da Filiação</label>
                <input
                  type="date"
                  value={formData.dataFiliacao}
                  onChange={(e) => setFormData({...formData, dataFiliacao: e.target.value})}
                  className={`w-full p-2 border rounded ${erros.dataFiliacao ? 'border-red-500' : ''}`}
                />
                {erros.dataFiliacao && <div className="text-red-500 text-sm mt-1">{erros.dataFiliacao}</div>}
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
              {patrocinadorAtualizado && (
                <div className="mt-4 text-green-600 font-medium">
                  Patrocinador Atualizado
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Patrocinadores Cadastrados</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Cód.</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Nome</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Documento</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Telefone</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">E-mail</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status Filiação</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {patrocinadores
                .slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina)
                .map((patrocinador) => (
                <tr key={patrocinador.id}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{patrocinador.cod_patrocinador}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{patrocinador.nome}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{patrocinador.documento}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{patrocinador.telefone}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{patrocinador.email}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      patrocinador.status_filiacao === 'Ativa' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {patrocinador.status_filiacao}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleEditar(patrocinador.id)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleExcluir(patrocinador.id)}
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
        
        {patrocinadores.length > itensPorPagina && (
          <div className="mt-4 flex justify-center">
            <div className="flex space-x-2">
              {Array.from({ length: Math.ceil(patrocinadores.length / itensPorPagina) }, (_, i) => (
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
              Deseja realmente excluir o patrocinador <strong>{itemExcluir?.nome}</strong>?
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