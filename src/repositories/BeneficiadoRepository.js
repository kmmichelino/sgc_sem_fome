import { Beneficiado } from '../entities/Beneficiado.js'

export class BeneficiadoRepository {
  constructor(db) {
    this.db = db
  }

  async criar(beneficiado) {
    const query = `
      INSERT INTO beneficiados 
      (nome, cpf, telefone, endereco, numero_membros, renda_familiar, observacoes, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `
    const [result] = await this.db.execute(query, [
      beneficiado.nome,
      beneficiado.cpf,
      beneficiado.telefone,
      beneficiado.endereco,
      beneficiado.numero_membros,
      beneficiado.renda_familiar,
      beneficiado.observacoes,
      beneficiado.status
    ])
    return result.insertId
  }

  async listar() {
    const query = `
      SELECT * FROM beneficiados 
      ORDER BY data_cadastro DESC
    `
    const [rows] = await this.db.execute(query)
    return rows.map(row => new Beneficiado(row))
  }

  async buscarPorId(id) {
    const query = 'SELECT * FROM beneficiados WHERE id = ?'
    const [rows] = await this.db.execute(query, [id])
    return rows.length > 0 ? new Beneficiado(rows[0]) : null
  }

  async buscarPorCpf(cpf) {
    const query = 'SELECT * FROM beneficiados WHERE cpf = ?'
    const [rows] = await this.db.execute(query, [cpf])
    return rows.length > 0 ? new Beneficiado(rows[0]) : null
  }

  async atualizar(id, beneficiado) {
    const query = `
      UPDATE beneficiados 
      SET nome = ?, cpf = ?, telefone = ?, endereco = ?, 
          numero_membros = ?, renda_familiar = ?, observacoes = ?, status = ?
      WHERE id = ?
    `
    const [result] = await this.db.execute(query, [
      beneficiado.nome,
      beneficiado.cpf,
      beneficiado.telefone,
      beneficiado.endereco,
      beneficiado.numero_membros,
      beneficiado.renda_familiar,
      beneficiado.observacoes,
      beneficiado.status,
      id
    ])
    return result.affectedRows > 0
  }

  async excluir(id) {
    const query = 'DELETE FROM beneficiados WHERE id = ?'
    const [result] = await this.db.execute(query, [id])
    return result.affectedRows > 0
  }
}