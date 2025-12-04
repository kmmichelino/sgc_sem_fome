export class Patrocinador {
  constructor(id, nome, tipoDocumento, documento, rg, ie, dataNascimento, telefone, email, statusFiliacao, dataFiliacao) {
    this.id = id
    this.nome = nome
    this.tipoDocumento = tipoDocumento
    this.documento = documento
    this.rg = rg
    this.ie = ie
    this.dataNascimento = dataNascimento
    this.telefone = telefone
    this.email = email
    this.statusFiliacao = statusFiliacao
    this.dataFiliacao = dataFiliacao
    this.dataCadastro = new Date()
  }

  static fromDatabase(row) {
    return new Patrocinador(
      row.id,
      row.nome,
      row.tipo_documento,
      row.documento,
      row.rg,
      row.ie,
      row.data_nascimento,
      row.telefone,
      row.email,
      row.status_filiacao,
      row.data_filiacao
    )
  }
}