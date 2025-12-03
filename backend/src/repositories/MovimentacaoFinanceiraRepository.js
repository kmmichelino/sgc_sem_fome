export class MovimentacaoFinanceiraRepository {
  constructor(db) {
    this.db = db
  }

  async criar(movimentacao) {
    const query = `
      INSERT INTO movimentacoes_financeiras 
      (tipo, valor, documento, nome, beneficiado, data_movimentacao, observacoes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    const [result] = await this.db.execute(query, [
      movimentacao.tipo,
      movimentacao.valor,
      movimentacao.documento,
      movimentacao.nome,
      movimentacao.beneficiado,
      movimentacao.data_movimentacao,
      movimentacao.observacoes
    ])
    return result.insertId
  }

  async listar() {
    const query = `
      SELECT * FROM movimentacoes_financeiras 
      ORDER BY data_registro DESC
    `
    const [rows] = await this.db.execute(query)
    return rows
  }

  async obterTotais() {
    const query = `
      SELECT 
        tipo,
        SUM(valor) as total
      FROM movimentacoes_financeiras 
      GROUP BY tipo
    `
    const [rows] = await this.db.execute(query)
    return rows
  }
}