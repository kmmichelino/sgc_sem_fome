CREATE DATABASE IF NOT EXISTS sgc_sem_fome;
USE sgc_sem_fome;

-- Tabela de Categorias de Produtos
CREATE TABLE IF NOT EXISTS categorias_produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT
);

-- Tabela de Doadores
CREATE TABLE IF NOT EXISTS doadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    tipo ENUM('Pessoa Física', 'Pessoa Jurídica') NOT NULL,
    documento VARCHAR(20) UNIQUE,
    telefone VARCHAR(20),
    email VARCHAR(100),
    endereco TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    categoria_id INT NOT NULL,
    unidade_medida VARCHAR(20) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias_produtos(id)
);

-- Tabela de Estoque
CREATE TABLE IF NOT EXISTS estoque (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL,
    quantidade DECIMAL(10,2) NOT NULL DEFAULT 0,
    data_validade DATE,
    lote VARCHAR(50),
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

-- Tabela de Entradas de Produtos
CREATE TABLE IF NOT EXISTS entradas_produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL,
    doador_id INT,
    quantidade DECIMAL(10,2) NOT NULL,
    data_entrada DATE NOT NULL,
    data_validade DATE,
    lote VARCHAR(50),
    observacoes TEXT,
    responsavel VARCHAR(100) NOT NULL,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (produto_id) REFERENCES produtos(id),
    FOREIGN KEY (doador_id) REFERENCES doadores(id)
);

-- Tabela de Famílias Beneficiadas
CREATE TABLE IF NOT EXISTS familias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_responsavel VARCHAR(200) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    telefone VARCHAR(20),
    endereco TEXT NOT NULL,
    numero_membros INT NOT NULL DEFAULT 1,
    renda_familiar DECIMAL(10,2),
    observacoes TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE
);

-- Tabela de Saídas de Produtos
CREATE TABLE IF NOT EXISTS saidas_produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL,
    familia_id INT,
    quantidade DECIMAL(10,2) NOT NULL,
    data_saida DATE NOT NULL,
    tipo_saida ENUM('Distribuição', 'Uso Interno', 'Descarte') NOT NULL,
    observacoes TEXT,
    responsavel VARCHAR(100) NOT NULL,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (produto_id) REFERENCES produtos(id),
    FOREIGN KEY (familia_id) REFERENCES familias(id)
);

-- Tabela de Campanhas
CREATE TABLE IF NOT EXISTS campanhas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    meta_arrecadacao DECIMAL(10,2),
    meta_produtos TEXT,
    responsavel VARCHAR(100) NOT NULL,
    status ENUM('Planejada', 'Ativa', 'Finalizada', 'Cancelada') DEFAULT 'Planejada',
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Doações Financeiras
CREATE TABLE IF NOT EXISTS doacoes_financeiras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doador_id INT,
    valor DECIMAL(10,2) NOT NULL,
    data_doacao DATE NOT NULL,
    forma_pagamento ENUM('Dinheiro', 'PIX', 'Transferência', 'Cartão', 'Cheque') NOT NULL,
    campanha_id INT,
    observacoes TEXT,
    responsavel VARCHAR(100) NOT NULL,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doador_id) REFERENCES doadores(id),
    FOREIGN KEY (campanha_id) REFERENCES campanhas(id)
);

-- Tabela de Movimentações Financeiras
CREATE TABLE IF NOT EXISTS movimentacoes_financeiras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('Entrada', 'Saída') NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_movimentacao DATE NOT NULL,
    forma_pagamento VARCHAR(50),
    responsavel VARCHAR(100) NOT NULL,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserindo dados iniciais
INSERT INTO categorias_produtos (nome, descricao) VALUES 
    ('Grãos', 'Arroz, feijão, lentilha, etc.'),
    ('Enlatados', 'Conservas, molhos, etc.'),
    ('Perecíveis', 'Frutas, verduras, carnes, etc.'),
    ('Higiene', 'Sabonetes, shampoo, pasta de dente, etc.'),
    ('Limpeza', 'Detergente, desinfetante, etc.'),
    ('Outros', 'Diversos produtos não categorizados');