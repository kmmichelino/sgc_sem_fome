# SGC - Sistema de Gerenciamento e Controle

Sistema destinado ao uso interno da ONG SEM FOME para controle administrativo e gerenciamento das atividades relacionadas à coleta, organização e distribuição de cestas básicas.

## Funcionalidades Principais

### Gestão de Estoque
- **Registrar entrada de produtos**: Permite registrar a entrada de produtos no sistema com informações como tipo, quantidade, data de recebimento, origem e validade
- **Consultar saldo no estoque**: Disponibiliza consulta atualizada das quantidades disponíveis por categoria, produto e validade
- **Processar atualização de estoque**: Executa automaticamente o recálculo do estoque com base nas entradas e saídas

### Gestão Financeira
- **Registrar doações financeiras**: Permite o lançamento de doações em dinheiro com informações como valor, data, forma de pagamento e doador
- **Controle financeiro**: Realiza o controle das movimentações financeiras da instituição

## Arquitetura

O projeto utiliza **Clean Architecture** seguindo os princípios **SOLID**:

```
src/
├── entities/          # Entidades de domínio
├── repositories/      # Interfaces e implementações de repositórios
├── use-cases/         # Casos de uso (regras de negócio)
├── controllers/       # Controladores (interface web)
├── routes/           # Definição de rotas
└── config/           # Configurações e injeção de dependências
```

## Tecnologias

- **Node.js** com ES Modules
- **Express.js** para API REST
- **MySQL** para banco de dados
- **Clean Architecture** para organização do código

## Instalação

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o banco de dados:
   - Execute o script `database_sgc.sql` no MySQL
   - Configure as variáveis de ambiente no arquivo `.env`

4. Execute o servidor:
   ```bash
   npm run dev
   ```

## Endpoints Principais

### Estoque
- `GET /estoque/saldo` - Consultar saldo do estoque
- `POST /estoque/entrada` - Registrar entrada de produtos

### Doações Financeiras
- `GET /doacoes-financeiras` - Listar doações financeiras
- `POST /doacoes-financeiras` - Registrar nova doação financeira

## Estrutura do Banco de Dados

O sistema utiliza as seguintes tabelas principais:
- `categorias_produtos` - Categorias de produtos (grãos, enlatados, etc.)
- `produtos` - Cadastro de produtos
- `estoque` - Controle de quantidades em estoque
- `entradas_produtos` - Registro de entradas no estoque
- `saidas_produtos` - Registro de saídas do estoque
- `doadores` - Cadastro de doadores
- `doacoes_financeiras` - Registro de doações em dinheiro
- `familias` - Cadastro de famílias beneficiadas
- `campanhas` - Gestão de campanhas de arrecadação