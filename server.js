import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { getConnection } from './database.js'
import { configurarDependencias } from './src/config/dependencies.js'
import { configurarRotasEstoque } from './src/routes/estoqueRoutes.js'
import { configurarRotasDoacaoFinanceira } from './src/routes/doacaoFinanceiraRoutes.js'
import { configurarRotasMovimentacaoFinanceira } from './src/routes/movimentacaoFinanceiraRoutes.js'
import { configurarRotasBeneficiado } from './src/routes/beneficiadoRoutes.js'
import patrocinadoresRoutes from './src/routes/patrocinadoresRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

let estoqueController, doacaoFinanceiraController, movimentacaoFinanceiraController, beneficiadoController

getConnection().then((connection) => {
  const controllers = configurarDependencias(connection)
  estoqueController = controllers.estoqueController
  doacaoFinanceiraController = controllers.doacaoFinanceiraController
  movimentacaoFinanceiraController = controllers.movimentacaoFinanceiraController
  beneficiadoController = controllers.beneficiadoController
  console.log('✓ Controllers configurados com sucesso')
}).catch((err) => {
  console.error('Erro na configuração das dependências:', err)
  console.log('Usando repositórios mock...')
  const controllers = configurarDependencias(null)
  estoqueController = controllers.estoqueController
  doacaoFinanceiraController = controllers.doacaoFinanceiraController
  movimentacaoFinanceiraController = controllers.movimentacaoFinanceiraController
  beneficiadoController = controllers.beneficiadoController
})

app.get('/', (req, res) => {
  res.json({
    message: 'SGC - Sistema de Gerenciamento e Controle - ONG SEM FOME',
    version: '1.0.0',
    architecture: 'Clean Architecture (SOLID)',
    endpoints: {
      estoque: '/estoque',
      doacoesFinanceiras: '/doacoes-financeiras',
      movimentacoesFinanceiras: '/movimentacoes-financeiras',
      patrocinadores: '/patrocinadores',
      beneficiados: '/beneficiados'
    }
  })
})

// Rotas serão configuradas após a inicialização dos controllers
setTimeout(() => {
  app.use('/estoque', configurarRotasEstoque(estoqueController))
  app.use('/doacoes-financeiras', configurarRotasDoacaoFinanceira(doacaoFinanceiraController))
  app.use('/movimentacoes-financeiras', configurarRotasMovimentacaoFinanceira(movimentacaoFinanceiraController))
  app.use('/beneficiados', configurarRotasBeneficiado(beneficiadoController))
  app.use('/patrocinadores', patrocinadoresRoutes)
}, 1000)

app.listen(PORT, () => {
  console.log(`✓ SGC - Servidor rodando em http://localhost:${PORT}`)
})
