// Repositórios
import { EstoqueRepository } from '../repositories/EstoqueRepository.js'
import { EntradaProdutoRepository } from '../repositories/EntradaProdutoRepository.js'
import { SaidaProdutoRepository } from '../repositories/SaidaProdutoRepository.js'
import { DoacaoFinanceiraRepository } from '../repositories/DoacaoFinanceiraRepository.js'
import { MovimentacaoFinanceiraRepository } from '../repositories/MovimentacaoFinanceiraRepository.js'
import { MockMovimentacaoFinanceiraRepository } from '../repositories/MockMovimentacaoFinanceiraRepository.js'
import { BeneficiadoRepository } from '../repositories/BeneficiadoRepository.js'

// Casos de uso
import { ConsultarSaldoEstoqueUseCase } from '../use-cases/ConsultarSaldoEstoqueUseCase.js'
import { RegistrarEntradaProdutoUseCase } from '../use-cases/RegistrarEntradaProdutoUseCase.js'
import { ExcluirEntradaProdutoUseCase } from '../use-cases/ExcluirEntradaProdutoUseCase.js'
import { RegistrarDoacaoFinanceiraUseCase } from '../use-cases/RegistrarDoacaoFinanceiraUseCase.js'
import { CriarBeneficiadoUseCase } from '../use-cases/CriarBeneficiadoUseCase.js'
import { ListarBeneficiadosUseCase } from '../use-cases/ListarBeneficiadosUseCase.js'

// Controladores
import { EstoqueController } from '../controllers/EstoqueController.js'
import { DoacaoFinanceiraController } from '../controllers/DoacaoFinanceiraController.js'
import { MovimentacaoFinanceiraController } from '../controllers/MovimentacaoFinanceiraController.js'
import { BeneficiadoController } from '../controllers/BeneficiadoController.js'

function configurarDependencias(dbConnection) {
  // Repositórios
  let estoqueRepository, entradaProdutoRepository, saidaProdutoRepository, doacaoFinanceiraRepository, movimentacaoFinanceiraRepository
  let beneficiadoRepository
  
  if (dbConnection) {
    estoqueRepository = new EstoqueRepository(dbConnection)
    entradaProdutoRepository = new EntradaProdutoRepository(dbConnection)
    saidaProdutoRepository = new SaidaProdutoRepository(dbConnection)
    doacaoFinanceiraRepository = new DoacaoFinanceiraRepository(dbConnection)
    movimentacaoFinanceiraRepository = new MovimentacaoFinanceiraRepository(dbConnection)
    beneficiadoRepository = new BeneficiadoRepository(dbConnection)
  } else {
    // Use mock repositories when database is not available
    console.log('Using mock repositories')
    movimentacaoFinanceiraRepository = new MockMovimentacaoFinanceiraRepository()
    // For now, we'll focus on financial movements
    estoqueRepository = null
    entradaProdutoRepository = null
    saidaProdutoRepository = null
    doacaoFinanceiraRepository = null
    beneficiadoRepository = null
  }

  // Casos de uso
  let consultarSaldoEstoqueUseCase, registrarEntradaProdutoUseCase, excluirEntradaProdutoUseCase, registrarDoacaoFinanceiraUseCase
  let criarBeneficiadoUseCase, listarBeneficiadosUseCase
  let estoqueController, doacaoFinanceiraController, beneficiadoController
  
  if (dbConnection) {
    consultarSaldoEstoqueUseCase = new ConsultarSaldoEstoqueUseCase(estoqueRepository)
    registrarEntradaProdutoUseCase = new RegistrarEntradaProdutoUseCase(entradaProdutoRepository, estoqueRepository)
    excluirEntradaProdutoUseCase = new ExcluirEntradaProdutoUseCase(entradaProdutoRepository)
    registrarDoacaoFinanceiraUseCase = new RegistrarDoacaoFinanceiraUseCase(doacaoFinanceiraRepository)
    
    criarBeneficiadoUseCase = new CriarBeneficiadoUseCase(beneficiadoRepository)
    listarBeneficiadosUseCase = new ListarBeneficiadosUseCase(beneficiadoRepository)
    
    estoqueController = new EstoqueController(consultarSaldoEstoqueUseCase, registrarEntradaProdutoUseCase, excluirEntradaProdutoUseCase)
    doacaoFinanceiraController = new DoacaoFinanceiraController(registrarDoacaoFinanceiraUseCase, doacaoFinanceiraRepository)
    beneficiadoController = new BeneficiadoController(criarBeneficiadoUseCase, listarBeneficiadosUseCase, beneficiadoRepository)
  } else {
    // Mock controllers for when database is not available
    estoqueController = null
    doacaoFinanceiraController = null
    beneficiadoController = null
  }
  
  const movimentacaoFinanceiraController = new MovimentacaoFinanceiraController(movimentacaoFinanceiraRepository)

  return {
    estoqueController,
    doacaoFinanceiraController,
    movimentacaoFinanceiraController,
    beneficiadoController
  }
}

export { configurarDependencias }