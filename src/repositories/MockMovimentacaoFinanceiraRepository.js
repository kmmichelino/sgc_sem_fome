export class MockMovimentacaoFinanceiraRepository {
  constructor() {
    this.movimentacoes = [
      { id: 1, tipo: 'Entrada', valor: 500.00, documento: '123.456.789-00', nome: 'João Silva', beneficiado: null, data_movimentacao: '2024-01-15', observacoes: 'Doação mensal', data_registro: new Date() },
      { id: 2, tipo: 'Saída', valor: 200.00, documento: '456.789.123-00', nome: null, beneficiado: 'Cláudia Pereira', data_movimentacao: '2024-01-14', observacoes: 'Auxílio emergencial', data_registro: new Date() }
    ]
    this.nextId = 3
  }

  async criar(movimentacao) {
    const novaMovimentacao = {
      id: this.nextId++,
      ...movimentacao,
      data_registro: new Date()
    }
    this.movimentacoes.push(novaMovimentacao)
    return novaMovimentacao.id
  }

  async listar() {
    return [...this.movimentacoes].sort((a, b) => new Date(b.data_registro) - new Date(a.data_registro))
  }

  async obterTotais() {
    const entradas = this.movimentacoes.filter(m => m.tipo === 'Entrada').reduce((sum, m) => sum + m.valor, 0)
    const saidas = this.movimentacoes.filter(m => m.tipo === 'Saída').reduce((sum, m) => sum + m.valor, 0)
    
    return [
      { tipo: 'Entrada', total: entradas },
      { tipo: 'Saída', total: saidas }
    ]
  }
}