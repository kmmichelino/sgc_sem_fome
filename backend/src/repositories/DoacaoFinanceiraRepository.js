import { DoacaoFinanceira } from '../entities/DoacaoFinanceira.js'

export class DoacaoFinanceiraRepository {
  constructor(db) {
    this.db = db
  }

  async criar(doacaoFinanceira) {
    const query = `
      INSERT INTO doacoes_financeiras 
      (doador_id, valor, data_doacao, forma_pagamento, campanha_id, observacoes, responsavel)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    const [result] = await this.db.execute(query, [
      doacaoFinanceira.doadorId,
      doacaoFinanceira.valor,
      doacaoFinanceira.dataDoacao,
      doacaoFinanceira.formaPagamento,
      doacaoFinanceira.campanhaId,
      doacaoFinanceira.observacoes,
      doacaoFinanceira.responsavel
    ])
    return result.insertId
  }

  async listar() {
    const query = `
      SELECT 
        df.*,
        d.nome as doador_nome,
        c.nome as campanha_nome
      FROM doacoes_financeiras df
      LEFT JOIN doadores d ON df.doador_id = d.id
      LEFT JOIN campanhas c ON df.campanha_id = c.id
      ORDER BY df.data_registro DESC
    `
    const [rows] = await this.db.execute(query)
    return rows
  }

  async obterTotalPorPeriodo(dataInicio, dataFim) {
    const query = `
      SELECT SUM(valor) as total
      FROM doacoes_financeiras 
      WHERE data_doacao BETWEEN ? AND ?
    `
    const [rows] = await this.db.execute(query, [dataInicio, dataFim])
    return rows[0].total || 0
  }
}