export class Beneficiado {
  constructor(data) {
    this.id = data.id
    this.nome = data.nome
    this.cpf = data.cpf
    this.telefone = data.telefone
    this.endereco = data.endereco
    this.numero_membros = data.numero_membros
    this.renda_familiar = data.renda_familiar
    this.observacoes = data.observacoes
    this.status = data.status || 'Ativo'
    this.data_cadastro = data.data_cadastro
  }

  validate() {
    const errors = []

    if (!this.nome || this.nome.trim().length === 0) {
      errors.push('Nome é obrigatório')
    }

    if (!this.cpf || this.cpf.trim().length === 0) {
      errors.push('CPF é obrigatório')
    }

    if (!this.telefone || this.telefone.trim().length === 0) {
      errors.push('Telefone é obrigatório')
    }

    if (!this.endereco || this.endereco.trim().length === 0) {
      errors.push('Endereço é obrigatório')
    }

    if (!this.numero_membros || this.numero_membros < 1) {
      errors.push('Número de membros deve ser maior que 0')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}