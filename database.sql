CREATE DATABASE IF NOT EXISTS sgc_sem_fome;
USE sgc_sem_fome;


CREATE TABLE IF NOT EXISTS patrocinadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    tipo_documento ENUM('CPF', 'CNPJ') NOT NULL,
    documento VARCHAR(20) UNIQUE NOT NULL,
    rg VARCHAR(20),
    ie VARCHAR(20),
    data_nascimento DATE,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    status_filiacao ENUM('Ativa', 'Inativa') DEFAULT 'Ativa',
    data_filiacao DATE NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS categorias_produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    categoria_id INT NOT NULL,
    unidade_medida VARCHAR(20) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias_produtos(id)
);


CREATE TABLE IF NOT EXISTS entradas_produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_produto VARCHAR(100) NOT NULL,
    produto VARCHAR(200) NOT NULL,
    quantidade DECIMAL(10,2) NOT NULL,
    unidade VARCHAR(20) NOT NULL,
    data_entrada DATE NOT NULL,
    responsavel VARCHAR(100) NOT NULL,
    parceiro VARCHAR(200),
    documento VARCHAR(20),
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS saidas_produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_produto VARCHAR(100) NOT NULL,
    produto VARCHAR(200) NOT NULL,
    quantidade DECIMAL(10,2) NOT NULL,
    unidade VARCHAR(20) NOT NULL,
    data_saida DATE NOT NULL,
    responsavel VARCHAR(100) NOT NULL,
    familia_beneficiada VARCHAR(200),
    documento VARCHAR(14),
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS beneficiados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    endereco TEXT NOT NULL,
    numero_membros INT NOT NULL DEFAULT 1,
    renda_familiar DECIMAL(10,2),
    observacoes TEXT,
    status ENUM('Ativo', 'Inativo') DEFAULT 'Ativo',
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS movimentacoes_financeiras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('Entrada', 'Saída') NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    documento VARCHAR(20) NOT NULL,
    nome VARCHAR(200),
    beneficiado VARCHAR(200),
    data_movimentacao DATE NOT NULL,
    observacoes TEXT,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS voluntarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    nome_usuario VARCHAR(50) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    turno_disponivel ENUM('Manhã', 'Tarde', 'Noite', 'Diurno', 'Noturno', 'Integral'),
    responsavel_por JSON,
    status ENUM('Ativo', 'Inativo') DEFAULT 'Ativo',
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO categorias_produtos (nome) VALUES 
    ('Alimento Perecível'),
    ('Alimento não Perecível'),
    ('Higiene Pessoal'),
    ('Roupas');


INSERT INTO patrocinadores (nome, tipo_documento, documento, rg, ie, data_nascimento, telefone, email, data_filiacao) VALUES 
    ('João Silva', 'CPF', '123.456.789-00', '12.345.678-9', NULL, '1985-03-15', '(11) 99999-1111', 'joao@email.com', '2024-01-01'),
    ('Maria Santos', 'CPF', '987.654.321-00', '98.765.432-1', NULL, '1990-07-22', '(11) 99999-2222', 'maria@email.com', '2024-01-01'),
    ('Empresa ABC Ltda', 'CNPJ', '12.345.678/0001-90', NULL, '123456789', NULL, '(11) 3333-4444', 'contato@abc.com', '2024-01-01'),
    ('Pedro Oliveira', 'CPF', '111.222.333-44', '11.122.233-4', NULL, '1988-12-10', '(11) 99999-5555', 'pedro@email.com', '2024-01-01'),
    ('Ana Costa', 'CPF', '555.666.777-88', '55.566.677-7', NULL, '1992-05-18', '(11) 99999-6666', 'ana@email.com', '2024-01-01'),
    ('Carlos Ferreira', 'CPF', '999.888.777-66', '99.988.877-6', NULL, '1980-11-03', '(11) 99999-7777', 'carlos@email.com', '2024-01-01'),
    ('Comercial XYZ S/A', 'CNPJ', '98.765.432/0001-10', NULL, '987654321', NULL, '(11) 4444-5555', 'xyz@empresa.com', '2024-01-01'),
    ('Lucia Mendes', 'CPF', '444.333.222-11', '44.433.322-2', NULL, '1987-09-25', '(11) 99999-8888', 'lucia@email.com', '2024-01-01'),
    ('Roberto Lima', 'CPF', '777.888.999-00', '77.788.899-9', NULL, '1983-04-12', '(11) 99999-9999', 'roberto@email.com', '2024-01-01'),
    ('Indústria DEF Ltda', 'CNPJ', '11.222.333/0001-44', NULL, '112223334', NULL, '(11) 5555-6666', 'def@industria.com', '2024-01-01'),
    ('Supermercado GHI', 'CNPJ', '22.333.444/0001-55', NULL, '223334445', NULL, '(11) 6666-7777', 'ghi@super.com', '2024-01-01'),
    ('Fernanda Rocha', 'CPF', '123.987.456-78', '12.398.745-6', NULL, '1995-08-30', '(11) 99999-0000', 'fernanda@email.com', '2024-01-01');

INSERT INTO beneficiados (nome, cpf, telefone, endereco, numero_membros, renda_familiar, status) VALUES 
    ('Cláudia Pereira', '456.789.123-00', '(11) 88888-2222', 'Rua das Flores, 123', 4, 1200.00, 'Ativo'),
    ('José Antônio', '789.123.456-11', '(11) 88888-5555', 'Av. Central, 456', 3, 800.00, 'Ativo'),
    ('Mariana Silva', '321.654.987-22', '(11) 88888-7777', 'Rua da Paz, 789', 5, 1500.00, 'Ativo'),
    ('Antônio Carlos', '654.987.321-33', '(11) 88888-9999', 'Rua Esperança, 321', 2, 600.00, 'Inativo'),
    ('Beatriz Souza', '147.258.369-44', '(11) 88888-0000', 'Rua Alegria, 654', 6, 2000.00, 'Ativo'),
    ('Ricardo Mendes', '258.369.147-55', '(11) 77777-1111', 'Av. Liberdade, 987', 3, 900.00, 'Ativo');


INSERT INTO movimentacoes_financeiras (tipo, valor, documento, nome, beneficiado, data_movimentacao, observacoes) VALUES 
    ('Entrada', 500.00, '123.456.789-00', 'João Silva', NULL, '2024-01-15', 'Doação mensal'),
    ('Saída', 200.00, '987.654.321-00', NULL, 'Maria Santos', '2024-01-14', 'Auxílio emergencial'),
    ('Entrada', 1000.00, '12.345.678/0001-90', 'Empresa ABC Ltda', NULL, '2024-01-13', 'Patrocínio evento'),
    ('Saída', 150.00, '111.222.333-44', NULL, 'Pedro Oliveira', '2024-01-12', 'Medicamentos'),
    ('Entrada', 300.00, '555.666.777-88', 'Ana Costa', NULL, '2024-01-11', 'Doação espontânea'),
    ('Saída', 100.00, '999.888.777-66', NULL, 'Carlos Ferreira', '2024-01-10', 'Transporte'),
    ('Entrada', 750.00, '444.333.222-11', 'Lucia Mendes', NULL, '2024-01-09', 'Doação aniversário'),
    ('Saída', 80.00, '777.888.999-00', NULL, 'Roberto Lima', '2024-01-08', 'Material escolar'),
    ('Entrada', 2000.00, '22.333.444/0001-55', 'Supermercado GHI', NULL, '2024-01-07', 'Parceria comercial'),
    ('Saída', 120.00, '123.987.456-78', NULL, 'Fernanda Rocha', '2024-01-06', 'Consulta médica'),
    ('Entrada', 400.00, '666.777.888-99', 'Diego Santos', NULL, '2024-01-05', 'Doação fim de ano'),
    ('Saída', 90.00, '333.444.555-66', NULL, 'Julia Alves', '2024-01-04', 'Alimentação');


INSERT INTO voluntarios (nome, cpf, telefone, email, nome_usuario, senha, turno_disponivel, responsavel_por) VALUES 
    ('Administrador DEV', '000.000.000-00', '(11) 00000-0000', 'dev@ong.com', 'dev', '1234', 'Integral', '["Beneficiados", "Entrada de Produtos", "Saída de Produtos", "Financeiro", "Patrocinadores"]'),
    ('Ana Silva', '123.456.789-01', '(11) 99999-1111', 'ana@ong.com', 'ana.silva', 'senha123', 'Manhã', '["Beneficiados", "Financeiro"]'),
    ('Carlos Santos', '987.654.321-02', '(11) 99999-2222', 'carlos@ong.com', 'carlos.santos', 'senha123', 'Integral', '["Entrada de Produtos", "Saída de Produtos"]'),
    ('Maria Oliveira', '111.222.333-03', '(11) 99999-3333', 'maria@ong.com', 'maria.oliveira', 'senha123', 'Tarde', '["Patrocinadores"]');

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

-- Inserindo alguns achados de exemplo
INSERT INTO achados (nome_objeto, local_encontrado, data_encontrado, observacao, tipo_objeto_id, nome_pessoa, status) VALUES 
    ('iPhone 13 Pro', 'Biblioteca Central', '2024-01-15', 'Celular preto com capa azul', 3, 'João Silva', 'Aguardando'),
    ('Carteira de couro', 'Cantina', '2024-01-14', 'Carteira marrom com documentos', 4, 'Maria Santos', 'Aguardando'),
    ('Chaves do carro', 'Estacionamento Bloco A', '2024-01-13', 'Chaveiro com logo da Honda', 2, 'Pedro Oliveira', 'Devolvido'),
    ('Óculos de grau', 'Sala 205', '2024-01-12', 'Óculos de armação preta', 5, 'Ana Costa', 'Aguardando');

