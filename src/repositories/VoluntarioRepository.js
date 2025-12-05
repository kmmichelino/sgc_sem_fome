import { Voluntario } from '../entities/Voluntario.js'

export class VoluntarioRepository {
  constructor(db) {
    this.db = db
  }

  async criar(voluntario) {
    const query = `
      INSERT INTO voluntarios 
      (nome, cpf, telefone, email, nome_usuario, senha, turno_disponivel, responsavel_por, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    const [result] = await this.db.execute(query, [
      voluntario.nome,
      voluntario.cpf,
      voluntario.telefone,
      voluntario.email,
      voluntario.nome_usuario,
      voluntario.senha,
      voluntario.turno_disponivel,
      voluntario.responsavel_por,
      voluntario.status
    ])
    return result.insertId
  }

  async listar() {
    const query = `
      SELECT * FROM voluntarios 
      ORDER BY nome ASC
    `
    const [rows] = await this.db.execute(query)
    return rows.map(row => new Voluntario(row))
  }

  async buscarPorId(id) {
    const query = 'SELECT * FROM voluntarios WHERE id = ?'
    const [rows] = await this.db.execute(query, [id])
    return rows.length > 0 ? new Voluntario(rows[0]) : null
  }

  async buscarPorCpf(cpf) {
    const query = 'SELECT * FROM voluntarios WHERE cpf = ?'
    const [rows] = await this.db.execute(query, [cpf])
    return rows.length > 0 ? new Voluntario(rows[0]) : null
  }

  async buscarPorNomeUsuario(nomeUsuario) {
    const query = 'SELECT * FROM voluntarios WHERE nome_usuario = ?'
    const [rows] = await this.db.execute(query, [nomeUsuario])
    return rows.length > 0 ? new Voluntario(rows[0]) : null
  }

  async atualizar(id, voluntario) {
    const query = `
      UPDATE voluntarios 
      SET nome = ?, cpf = ?, telefone = ?, email = ?, 
          nome_usuario = ?, turno_disponivel = ?, responsavel_por = ?, status = ?
      WHERE id = ?
    `
    const [result] = await this.db.execute(query, [
      voluntario.nome,
      voluntario.cpf,
      voluntario.telefone,
      voluntario.email,
      voluntario.nome_usuario,
      voluntario.turno_disponivel,
      voluntario.responsavel_por,
      voluntario.status,
      id
    ])
    return result.affectedRows > 0
  }

  async excluir(id) {
    const query = 'DELETE FROM voluntarios WHERE id = ?'
    const [result] = await this.db.execute(query, [id])
    return result.affectedRows > 0
  }
}