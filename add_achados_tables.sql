USE sgc_sem_fome;

-- Tabela de Tipos de Objetos
CREATE TABLE IF NOT EXISTS tipos_objetos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

-- Tabela de Achados
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
);

-- Inserindo tipos de objetos padrão
INSERT INTO tipos_objetos (nome) VALUES 
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
    ('Outros');