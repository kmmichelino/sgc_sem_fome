export class Voluntario {
  constructor(id, nome, cpf, telefone, email, nomeUsuario, senha, turnoDisponivel, responsavelPor, status) {
    this.id = id
    this.nome = nome
    this.cpf = cpf
    this.telefone = telefone
    this.email = email
    this.nomeUsuario = nomeUsuario
    this.senha = senha
    this.turnoDisponivel = turnoDisponivel
    this.responsavelPor = responsavelPor
    this.status = status || 'Ativo'
    this.dataCadastro = new Date()
  }

  static fromDatabase(row) {
    return new Voluntario(
      row.id,
      row.nome,
      row.cpf,
      row.telefone,
      row.email,
      row.nome_usuario,
      row.senha,
      row.turno_disponivel,
      JSON.parse(row.responsavel_por || '[]'),
      row.status
    )
  }
}