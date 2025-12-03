export class SaidaProduto {
  constructor(id, produtoId, familiaId, quantidade, dataSaida, tipoSaida, observacoes = null, responsavel, dataRegistro = null) {
    this.id = id
    this.produtoId = produtoId
    this.familiaId = familiaId
    this.quantidade = quantidade
    this.dataSaida = dataSaida
    this.tipoSaida = tipoSaida
    this.observacoes = observacoes
    this.responsavel = responsavel
    this.dataRegistro = dataRegistro
  }
}