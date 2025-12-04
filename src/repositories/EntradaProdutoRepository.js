import { EntradaProduto } from '../entities/EntradaProduto.js'

export class EntradaProdutoRepository {
  constructor(db) {
    this.db = db
  }

  async criar(entradaProduto) {
    const query = `
      INSERT INTO entradas_produtos 
      (tipo_produto, produto, quantidade, unidade, data_entrada, responsavel, parceiro, documento)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `
    const [result] = await this.db.execute(query, [
      entradaProduto.tipo_produto,
      entradaProduto.produto,
      entradaProduto.quantidade,
      entradaProduto.unidade,
      entradaProduto.data_entrada,
      entradaProduto.responsavel,
      entradaProduto.parceiro,
      entradaProduto.documento
    ])
    return result.insertId
  }

  async listar() {
    const query = `
      SELECT * FROM entradas_produtos 
      ORDER BY data_registro DESC
    `
    const [rows] = await this.db.execute(query)
    return rows.map(row => new EntradaProduto(row))
  }

  async buscarPorId(id) {
    const query = 'SELECT * FROM entradas_produtos WHERE id = ?'
    const [rows] = await this.db.execute(query, [id])
    return rows.length > 0 ? new EntradaProduto(rows[0]) : null
  }

  async excluir(id) {
    const query = 'DELETE FROM entradas_produtos WHERE id = ?'
    const [result] = await this.db.execute(query, [id])
    return result.affectedRows > 0
  }
}