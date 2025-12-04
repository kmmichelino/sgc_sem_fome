import mysql from 'mysql2/promise'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

async function updateDatabase() {
  let connection
  
  try {
    // Conectar ao MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true
    })

    console.log('✓ Conectado ao banco de dados MySQL')

    // Executar comandos SQL separadamente
    await connection.query('USE sgc_sem_fome')
    
    // Criar tabela tipos_objetos
    await connection.query(`
      CREATE TABLE IF NOT EXISTS tipos_objetos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL UNIQUE
      )
    `)
    
    // Criar tabela achados
    await connection.query(`
      CREATE TABLE IF NOT EXISTS achados (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome_objeto VARCHAR(200) NOT NULL,
        local_encontrado VARCHAR(200) NOT NULL,
        data_encontrado DATE NOT NULL,
        observacao TEXT,
        tipo_objeto_id INT NOT NULL,
        url_foto VARCHAR(500),
        nome_pessoa VARCHAR(200) NOT NULL,
        status ENUM('Aguardando', 'Devolvido', 'Doado') DEFAULT 'Aguardando',
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tipo_objeto_id) REFERENCES tipos_objetos(id)
      )
    `)
    
    // Inserir tipos de objetos
    await connection.query(`
      INSERT IGNORE INTO tipos_objetos (nome) VALUES 
        ('Documentos'),
        ('Chaves'),
        ('Celular'),
        ('Carteira'),
        ('Óculos'),
        ('Bolsa'),
        ('Mochila'),
        ('Guarda-chuva'),
        ('Relógio'),
        ('Jóias'),
        ('Eletrônicos'),
        ('Roupas'),
        ('Calçados'),
        ('Livros'),
        ('Outros')
    `)
    
    console.log('✓ Tabelas de achados e tipos de objetos criadas com sucesso!')
    console.log('✓ Dados iniciais inseridos!')

  } catch (error) {
    console.error('Erro ao atualizar banco de dados:', error)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

updateDatabase()