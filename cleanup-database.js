import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

async function cleanupDatabase() {
  let connection
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    })

    console.log('✓ Conectado ao banco de dados MySQL')

    // Remover tabelas de achados (não fazem parte do sistema SGC)
    await connection.query('DROP TABLE IF EXISTS achados')
    await connection.query('DROP TABLE IF EXISTS tipos_objetos')
    
    console.log('✓ Tabelas de achados removidas (não fazem parte do sistema SGC)')
    console.log('✓ Sistema SGC configurado corretamente!')

  } catch (error) {
    console.error('Erro ao limpar banco de dados:', error)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

cleanupDatabase()