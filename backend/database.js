import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

connection.then(() => {
  console.log('✓ Conectado ao banco de dados MySQL')
}).catch((err) => {
  console.error('Erro ao conectar ao banco de dados:', err)
})

export { connection }
