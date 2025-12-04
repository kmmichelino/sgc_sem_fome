export class Estoque {
  constructor(id, produtoId, quantidade, dataValidade = null, lote = null, dataAtualizacao = null) {
    this.id = id
    this.produtoId = produtoId
    this.quantidade = quantidade
    this.dataValidade = dataValidade
    this.lote = lote
    this.dataAtualizacao = dataAtualizacao
  }
}