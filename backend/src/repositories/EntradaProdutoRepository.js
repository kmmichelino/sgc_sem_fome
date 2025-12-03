import { EntradaProduto } from '../entities/EntradaProduto.js'

export class EntradaProdutoRepository {
  constructor(db) {
    this.db = db
  }

  async criar(entradaProduto) {
    const query = `
      INSERT INTO entradas_produtos 
      (produto_id, doador_id, quantidade, data_entrada, data_validade, lote, observacoes, responsavel)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `
    const [result] = await this.db.execute(query, [
      entradaProduto.produtoId,
      entradaProduto.doadorId,
      entradaProduto.quantidade,
      entradaProduto.dataEntrada,
      entradaProduto.dataValidade,
      entradaProduto.lote,
      entradaProduto.observacoes,
      entradaProduto.responsavel
    ])
    return result.insertId
  }

  async listar() {
    const query = `
      SELECT 
        ep.*,
        p.nome as produto_nome,
        d.nome as doador_nome
      FROM entradas_produtos ep
      JOIN produtos p ON ep.produto_id = p.id
      LEFT JOIN doadores d ON ep.doador_id = d.id
      ORDER BY ep.data_registro DESC
    `
    const [rows] = await this.db.execute(query)
    return rows
  }

  async excluir(id) {
    const query = 'DELETE FROM entradas_produtos WHERE id = ?'
    const [result] = await this.db.execute(query, [id])
    return result.affectedRows > 0
  }
}