import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:4000'
})

// Estoque
export const getSaldoEstoque = async () => {
  const response = await api.get('/estoque/saldo')
  return response.data
}

export const registrarEntradaProduto = async (data) => {
  const response = await api.post('/estoque/entrada', data)
  return response.data
}

export const excluirEntradaProduto = async (id) => {
  const response = await api.delete(`/estoque/entrada/${id}`)
  return response.data
}

// Doações Financeiras
export const getDoacoesFinanceiras = async () => {
  const response = await api.get('/doacoes-financeiras')
  return response.data
}

export const registrarDoacaoFinanceira = async (data) => {
  const response = await api.post('/doacoes-financeiras', data)
  return response.data
}

// Movimentações Financeiras
export const getMovimentacoesFinanceiras = async () => {
  const response = await api.get('/movimentacoes-financeiras')
  return response.data
}

export const registrarMovimentacaoFinanceira = async (data) => {
  const response = await api.post('/movimentacoes-financeiras', data)
  return response.data
}

export const getTotaisFinanceiros = async () => {
  const response = await api.get('/movimentacoes-financeiras/totais')
  return response.data
}

// Patrocinadores
export const getPatrocinadores = async () => {
  const response = await api.get('/patrocinadores')
  return response.data
}

export const criarPatrocinador = async (data) => {
  const response = await api.post('/patrocinadores', data)
  return response.data
}

export const atualizarPatrocinador = async (id, data) => {
  const response = await api.put(`/patrocinadores/${id}`, data)
  return response.data
}

export const excluirPatrocinador = async (id) => {
  const response = await api.delete(`/patrocinadores/${id}`)
  return response.data
}

// Beneficiados
export const getBeneficiados = async () => {
  const response = await api.get('/beneficiados')
  return response.data
}

export const createBeneficiado = async (data) => {
  const response = await api.post('/beneficiados', data)
  return response.data
}

export const getBeneficiadoById = async (id) => {
  const response = await api.get(`/beneficiados/${id}`)
  return response.data
}

export const updateBeneficiado = async (id, data) => {
  const response = await api.put(`/beneficiados/${id}`, data)
  return response.data
}

export const deleteBeneficiado = async (id) => {
  const response = await api.delete(`/beneficiados/${id}`)
  return response.data
}

// Voluntários
export const loginVoluntario = async (nomeUsuario, senha) => {
  const response = await api.post('/voluntarios/login', { nomeUsuario, senha })
  return response.data
}

export const getVoluntarios = async () => {
  const response = await api.get('/voluntarios')
  return response.data
}

export const createVoluntario = async (data) => {
  const response = await api.post('/voluntarios', data)
  return response.data
}

export const getVoluntarioById = async (id) => {
  const response = await api.get(`/voluntarios/${id}`)
  return response.data
}

export const updateVoluntario = async (id, data) => {
  const response = await api.put(`/voluntarios/${id}`, data)
  return response.data
}

export const deleteVoluntario = async (id) => {
  const response = await api.delete(`/voluntarios/${id}`)
  return response.data
}

// Entrada de Produtos
export const getEntradasProdutos = async () => {
  const response = await api.get('/estoque/entrada')
  return response.data
}

// Categorias de Produtos
export const getCategoriasProdutos = async () => {
  const response = await api.get('/categorias-produtos')
  return response.data
}



export default api