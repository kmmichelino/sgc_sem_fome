import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

async function testConnection() {
  let connection
  
  try {
    console.log('🔍 Testando conexão com MySQL...')
    console.log('Host:', process.env.DB_HOST)
    console.log('User:', process.env.DB_USER)
    console.log('Database:', process.env.DB_NAME)
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    })

    console.log('✅ Conectado ao MySQL')

    // Testar tabela beneficiados
    const [rows] = await connection.execute('SELECT COUNT(*) as total FROM beneficiados')
    console.log('✅ Tabela beneficiados existe - Total:', rows[0].total)

    // Testar estrutura da tabela
    const [columns] = await connection.execute('DESCRIBE beneficiados')
    console.log('✅ Estrutura da tabela beneficiados:')
    columns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? '(NOT NULL)' : ''}`)
    })

    // Testar inserção
    const testData = {
      nome: 'Teste Conexão',
      cpf: '999.999.999-99',
      telefone: '(11) 99999-9999',
      endereco: 'Rua Teste',
      numero_membros: 1,
      renda_familiar: 1000.00,
      observacoes: 'Teste',
      status: 'Ativo'
    }

    const [result] = await connection.execute(`
      INSERT INTO beneficiados 
      (nome, cpf, telefone, endereco, numero_membros, renda_familiar, observacoes, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      testData.nome,
      testData.cpf,
      testData.telefone,
      testData.endereco,
      testData.numero_membros,
      testData.renda_familiar,
      testData.observacoes,
      testData.status
    ])

    console.log('✅ Inserção teste OK - ID:', result.insertId)

    // Limpar teste
    await connection.execute('DELETE FROM beneficiados WHERE id = ?', [result.insertId])
    console.log('✅ Limpeza OK')

  } catch (error) {
    console.error('❌ Erro:', error.message)
    console.error('Stack:', error.stack)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

testConnection()