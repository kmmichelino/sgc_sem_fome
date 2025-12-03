export class DoacaoFinanceira {
  constructor(id, doadorId, valor, dataDoacao, formaPagamento, campanhaId = null, observacoes = null, responsavel, dataRegistro = null) {
    this.id = id
    this.doadorId = doadorId
    this.valor = valor
    this.dataDoacao = dataDoacao
    this.formaPagamento = formaPagamento
    this.campanhaId = campanhaId
    this.observacoes = observacoes
    this.responsavel = responsavel
    this.dataRegistro = dataRegistro
  }
}