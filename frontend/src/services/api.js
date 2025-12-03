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

export default api