import express from 'express'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sgc_sem_fome'
}

// GET - Listar patrocinadores
router.get('/', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig)
    const [rows] = await connection.execute('SELECT * FROM patrocinadores ORDER BY nome')
    await connection.end()
    
    // Mapear para formato esperado pelo frontend
    const patrocinadores = rows.map((row, index) => ({
      id: row.id,
      cod_patrocinador: index + 1,
      nome: row.nome,
      tipo_documento: row.tipo_documento,
      documento: row.documento,
      rg: row.rg,
      ie: row.ie,
      data_nascimento: row.data_nascimento,
      telefone: row.telefone,
      email: row.email,
      status_filiacao: row.status_filiacao,
      data_filiacao: row.data_filiacao,
      data_cadastro: row.data_cadastro
    }))
    
    res.json(patrocinadores)
  } catch (error) {
    console.error('Erro ao buscar patrocinadores:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST - Criar patrocinador
router.post('/', async (req, res) => {
  try {
    const { nome, tipo_documento, documento, rg, ie, data_nascimento, telefone, email, data_filiacao } = req.body
    
    // Tratar datas vazias
    const dataNascimentoFormatted = data_nascimento && data_nascimento !== '' ? data_nascimento : null
    const dataFiliacaoFormatted = data_filiacao && data_filiacao !== '' ? data_filiacao : null
    
    const connection = await mysql.createConnection(dbConfig)
    const [result] = await connection.execute(
      'INSERT INTO patrocinadores (nome, tipo_documento, documento, rg, ie, data_nascimento, telefone, email, data_filiacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [nome, tipo_documento, documento, rg || null, ie || null, dataNascimentoFormatted, telefone, email, dataFiliacaoFormatted]
    )
    await connection.end()
    
    res.status(201).json({ id: result.insertId, message: 'Patrocinador criado com sucesso' })
  } catch (error) {
    console.error('Erro ao criar patrocinador:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT - Atualizar patrocinador
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    console.log('PUT /patrocinadores/:id - ID:', id)
    console.log('PUT /patrocinadores/:id - Body:', req.body)
    
    const { nome, tipo_documento, documento, rg, ie, data_nascimento, telefone, email, status_filiacao, data_filiacao } = req.body
    
    // Tratar datas vazias
    const dataNascimentoFormatted = data_nascimento && data_nascimento !== '' ? data_nascimento : null
    const dataFiliacaoFormatted = data_filiacao && data_filiacao !== '' ? data_filiacao : null
    
    console.log('Dados formatados:', {
      nome, tipo_documento, documento, rg: rg || null, ie: ie || null, 
      data_nascimento: dataNascimentoFormatted, telefone, email, 
      status_filiacao: status_filiacao || 'Ativa', data_filiacao: dataFiliacaoFormatted
    })
    
    const connection = await mysql.createConnection(dbConfig)
    const result = await connection.execute(
      'UPDATE patrocinadores SET nome = ?, tipo_documento = ?, documento = ?, rg = ?, ie = ?, data_nascimento = ?, telefone = ?, email = ?, status_filiacao = ?, data_filiacao = ? WHERE id = ?',
      [nome, tipo_documento, documento, rg || null, ie || null, dataNascimentoFormatted, telefone, email, status_filiacao || 'Ativa', dataFiliacaoFormatted, id]
    )
    await connection.end()
    
    console.log('Update result:', result)
    res.json({ message: 'Patrocinador atualizado com sucesso' })
  } catch (error) {
    console.error('Erro detalhado ao atualizar patrocinador:', error)
    console.error('Stack trace:', error.stack)
    res.status(500).json({ error: error.message, details: error.stack })
  }
})

// DELETE - Excluir patrocinador
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const connection = await mysql.createConnection(dbConfig)
    await connection.execute('DELETE FROM patrocinadores WHERE id = ?', [id])
    await connection.end()
    
    res.json({ message: 'Patrocinador excluído com sucesso' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router