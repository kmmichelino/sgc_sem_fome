import { SaidaProduto } from '../entities/SaidaProduto.js'

export class SaidaProdutoRepository {
  constructor(db) {
    this.db = db
  }

  async criar(saidaProduto) {
    const query = `
      INSERT INTO saidas_produtos 
      (tipo_produto, produto, quantidade, unidade, data_saida, responsavel, familia_beneficiada, documento)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `
    const [result] = await this.db.execute(query, [
      saidaProduto.tipo_produto,
      saidaProduto.produto,
      saidaProduto.quantidade,
      saidaProduto.unidade,
      saidaProduto.data_saida,
      saidaProduto.responsavel,
      saidaProduto.familia_beneficiada,
      saidaProduto.documento
    ])
    return result.insertId
  }

  async listar() {
    const query = `
      SELECT * FROM saidas_produtos 
      ORDER BY data_registro DESC
    `
    const [rows] = await this.db.execute(query)
    return rows.map(row => new SaidaProduto(row))
  }

  async buscarPorId(id) {
    const query = 'SELECT * FROM saidas_produtos WHERE id = ?'
    const [rows] = await this.db.execute(query, [id])
    return rows.length > 0 ? new SaidaProduto(rows[0]) : null
  }

  async excluir(id) {
    const query = 'DELETE FROM saidas_produtos WHERE id = ?'
    const [result] = await this.db.execute(query, [id])
    return result.affectedRows > 0
  }
}