// Repositórios
import { EstoqueRepository } from '../repositories/EstoqueRepository.js'
import { EntradaProdutoRepository } from '../repositories/EntradaProdutoRepository.js'
import { DoacaoFinanceiraRepository } from '../repositories/DoacaoFinanceiraRepository.js'
import { MovimentacaoFinanceiraRepository } from '../repositories/MovimentacaoFinanceiraRepository.js'
import { MockMovimentacaoFinanceiraRepository } from '../repositories/MockMovimentacaoFinanceiraRepository.js'

// Casos de uso
import { ConsultarSaldoEstoqueUseCase } from '../use-cases/ConsultarSaldoEstoqueUseCase.js'
import { RegistrarEntradaProdutoUseCase } from '../use-cases/RegistrarEntradaProdutoUseCase.js'
import { ExcluirEntradaProdutoUseCase } from '../use-cases/ExcluirEntradaProdutoUseCase.js'
import { RegistrarDoacaoFinanceiraUseCase } from '../use-cases/RegistrarDoacaoFinanceiraUseCase.js'

// Controladores
import { EstoqueController } from '../controllers/EstoqueController.js'
import { DoacaoFinanceiraController } from '../controllers/DoacaoFinanceiraController.js'
import { MovimentacaoFinanceiraController } from '../controllers/MovimentacaoFinanceiraController.js'

function configurarDependencias(dbConnection) {
  // Repositórios
  let estoqueRepository, entradaProdutoRepository, doacaoFinanceiraRepository, movimentacaoFinanceiraRepository
  
  if (dbConnection) {
    estoqueRepository = new EstoqueRepository(dbConnection)
    entradaProdutoRepository = new EntradaProdutoRepository(dbConnection)
    doacaoFinanceiraRepository = new DoacaoFinanceiraRepository(dbConnection)
    movimentacaoFinanceiraRepository = new MovimentacaoFinanceiraRepository(dbConnection)
  } else {
    // Use mock repositories when database is not available
    console.log('Using mock repositories')
    movimentacaoFinanceiraRepository = new MockMovimentacaoFinanceiraRepository()
    // For now, we'll focus on financial movements
    estoqueRepository = null
    entradaProdutoRepository = null
    doacaoFinanceiraRepository = null
  }

  // Casos de uso
  let consultarSaldoEstoqueUseCase, registrarEntradaProdutoUseCase, excluirEntradaProdutoUseCase, registrarDoacaoFinanceiraUseCase
  let estoqueController, doacaoFinanceiraController
  
  if (dbConnection) {
    consultarSaldoEstoqueUseCase = new ConsultarSaldoEstoqueUseCase(estoqueRepository)
    registrarEntradaProdutoUseCase = new RegistrarEntradaProdutoUseCase(entradaProdutoRepository, estoqueRepository)
    excluirEntradaProdutoUseCase = new ExcluirEntradaProdutoUseCase(entradaProdutoRepository)
    registrarDoacaoFinanceiraUseCase = new RegistrarDoacaoFinanceiraUseCase(doacaoFinanceiraRepository)
    
    estoqueController = new EstoqueController(consultarSaldoEstoqueUseCase, registrarEntradaProdutoUseCase, excluirEntradaProdutoUseCase)
    doacaoFinanceiraController = new DoacaoFinanceiraController(registrarDoacaoFinanceiraUseCase, doacaoFinanceiraRepository)
  } else {
    // Mock controllers for when database is not available
    estoqueController = null
    doacaoFinanceiraController = null
  }
  
  const movimentacaoFinanceiraController = new MovimentacaoFinanceiraController(movimentacaoFinanceiraRepository)

  return {
    estoqueController,
    doacaoFinanceiraController,
    movimentacaoFinanceiraController
  }
}

export { configurarDependencias }