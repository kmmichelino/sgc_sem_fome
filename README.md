# SGC - Sistema de Gerenciamento e Controle

Sistema destinado ao uso interno da ONG SEM FOME para controle administrativo e gerenciamento das atividades relacionadas à coleta, organização e distribuição de cestas básicas.

## 🚀 Tecnologias

- **Frontend**: React.js + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Banco de Dados**: MySQL
- **Arquitetura**: Clean Architecture + SOLID

## 📋 Funcionalidades

### Gestão de Estoque
- Registrar entrada de produtos
- Consultar saldo no estoque
- Processar saída de produtos
- Gráficos interativos de controle

### Gestão Financeira
- Registrar doações financeiras
- Controle de movimentações
- Dashboard financeiro

### Gestão de Pessoas
- Cadastro de patrocinadores (CPF/CNPJ)
- Cadastro de beneficiados
- Cadastro de voluntários com turnos e responsabilidades

## 🛠️ Instalação

### Pré-requisitos
- Node.js 18+
- MySQL 8.0+
- Git

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

### Banco de Dados
1. Execute o script `database.sql` no MySQL
2. Configure as variáveis de ambiente no arquivo `.env`

## 🚀 Execução

### Backend
```bash
cd backend
npm run dev
```

### Frontend
```bash
cd frontend
npm run dev
```

## 📁 Estrutura do Projeto

```
sgc/
├── backend/
│   ├── src/
│   │   ├── entities/
│   │   ├── repositories/
│   │   ├── use-cases/
│   │   ├── controllers/
│   │   └── routes/
│   ├── database.sql
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
└── README.md
```

## 🎯 Principais Telas

- **Dashboard**: Visão geral do sistema
- **Estoque**: Controle de produtos com gráficos
- **Entrada de Produtos**: Registro de doações
- **Saída de Produtos**: Distribuição para beneficiados
- **Doações Financeiras**: Controle financeiro
- **Patrocinadores**: Gestão de doadores
- **Beneficiados**: Cadastro de famílias
- **Voluntários**: Gestão da equipe

## 👥 Contribuição

Projeto desenvolvido para a disciplina de Tópicos Especiais em Engenharia de Software I - UNOESTE.

## 📄 Licença

Este projeto é de uso acadêmico.