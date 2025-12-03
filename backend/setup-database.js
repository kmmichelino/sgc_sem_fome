import mysql from 'mysql2/promise'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

async function setupDatabase() {
  try {
    // Connect without database first
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    })

    console.log('Connected to MySQL server')

    // Read and execute the SQL file
    const sqlContent = fs.readFileSync('./database.sql', 'utf8')
    const statements = sqlContent.split(';').filter(stmt => stmt.trim())

    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement)
      }
    }

    console.log('Database setup completed successfully!')
    await connection.end()
  } catch (error) {
    console.error('Error setting up database:', error)
  }
}

setupDatabase()