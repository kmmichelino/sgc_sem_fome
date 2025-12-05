export class Voluntario {
  constructor(data) {
    this.id = data.id
    this.nome = data.nome
    this.cpf = data.cpf
    this.telefone = data.telefone
    this.email = data.email
    this.nome_usuario = data.nome_usuario
    this.senha = data.senha
    this.turno_disponivel = data.turno_disponivel
    this.responsavel_por = data.responsavel_por
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

    if (!this.email || this.email.trim().length === 0) {
      errors.push('Email é obrigatório')
    }

    if (!this.nome_usuario || this.nome_usuario.trim().length === 0) {
      errors.push('Nome de usuário é obrigatório')
    }

    if (!this.senha || this.senha.trim().length === 0) {
      errors.push('Senha é obrigatória')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}