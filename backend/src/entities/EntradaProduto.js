export class EntradaProduto {
  constructor(id, produtoId, doadorId, quantidade, dataEntrada, dataValidade = null, lote = null, observacoes = null, responsavel, dataRegistro = null) {
    this.id = id
    this.produtoId = produtoId
    this.doadorId = doadorId
    this.quantidade = quantidade
    this.dataEntrada = dataEntrada
    this.dataValidade = dataValidade
    this.lote = lote
    this.observacoes = observacoes
    this.responsavel = responsavel
    this.dataRegistro = dataRegistro
  }
}