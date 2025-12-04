export class SaidaProduto {
  constructor(data) {
    this.id = data.id
    this.tipo_produto = data.tipo_produto
    this.produto = data.produto
    this.quantidade = data.quantidade
    this.unidade = data.unidade
    this.data_saida = data.data_saida
    this.responsavel = data.responsavel
    this.familia_beneficiada = data.familia_beneficiada
    this.documento = data.documento
    this.data_registro = data.data_registro
  }

  validate() {
    const errors = []

    if (!this.tipo_produto || this.tipo_produto.trim().length === 0) {
      errors.push('Tipo de produto é obrigatório')
    }

    if (!this.produto || this.produto.trim().length === 0) {
      errors.push('Produto é obrigatório')
    }

    if (!this.quantidade || this.quantidade <= 0) {
      errors.push('Quantidade deve ser maior que zero')
    }

    if (!this.unidade || this.unidade.trim().length === 0) {
      errors.push('Unidade é obrigatória')
    }

    if (!this.data_saida) {
      errors.push('Data de saída é obrigatória')
    }

    if (!this.responsavel || this.responsavel.trim().length === 0) {
      errors.push('Responsável é obrigatório')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}