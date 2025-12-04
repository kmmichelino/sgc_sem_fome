import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

let connection = null

const createConnection = async () => {
  if (!connection) {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    })
    console.log('✓ Conectado ao banco de dados MySQL')
  }
  return connection
}

const getConnection = async () => {
  if (!connection) {
    await createConnection()
  }
  return connection
}

export { getConnection, createConnection }
