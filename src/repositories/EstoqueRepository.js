import { Estoque } from '../entities/Estoque.js'

export class EstoqueRepository {
  constructor(db) {
    this.db = db
  }

  async consultarSaldo() {
    const query = `
      SELECT 
        e.id,
        p.nome as produto_nome,
        c.nome as categoria_nome,
        e.quantidade,
        e.data_validade,
        e.lote,
        p.unidade_medida
      FROM estoque e
      JOIN produtos p ON e.produto_id = p.id
      JOIN categorias_produtos c ON p.categoria_id = c.id
      WHERE e.quantidade > 0
      ORDER BY c.nome, p.nome
    `
    const [rows] = await this.db.execute(query)
    return rows
  }

  async atualizarEstoque(produtoId, quantidade) {
    const queryVerificar = 'SELECT id, quantidade FROM estoque WHERE produto_id = ?'
    const [existing] = await this.db.execute(queryVerificar, [produtoId])

    if (existing.length > 0) {
      const novaQuantidade = existing[0].quantidade + quantidade
      const queryAtualizar = 'UPDATE estoque SET quantidade = ?, data_atualizacao = NOW() WHERE produto_id = ?'
      await this.db.execute(queryAtualizar, [novaQuantidade, produtoId])
    } else {
      const queryInserir = 'INSERT INTO estoque (produto_id, quantidade) VALUES (?, ?)'
      await this.db.execute(queryInserir, [produtoId, quantidade])
    }
  }

  async obterPorProduto(produtoId) {
    const query = 'SELECT * FROM estoque WHERE produto_id = ?'
    const [rows] = await this.db.execute(query, [produtoId])
    return rows.length > 0 ? new Estoque(rows[0].id, rows[0].produto_id, rows[0].quantidade, rows[0].data_validade, rows[0].lote, rows[0].data_atualizacao) : null
  }
}