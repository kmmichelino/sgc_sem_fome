// Repositórios
import { EstoqueRepository } from '../repositories/EstoqueRepository.js'
import { EntradaProdutoRepository } from '../repositories/EntradaProdutoRepository.js'
import { SaidaProdutoRepository } from '../repositories/SaidaProdutoRepository.js'
import { DoacaoFinanceiraRepository } from '../repositories/DoacaoFinanceiraRepository.js'
import { MovimentacaoFinanceiraRepository } from '../repositories/MovimentacaoFinanceiraRepository.js'
import { MockMovimentacaoFinanceiraRepository } from '../repositories/MockMovimentacaoFinanceiraRepository.js'
import { BeneficiadoRepository } from '../repositories/BeneficiadoRepository.js'
import { VoluntarioRepository } from '../repositories/VoluntarioRepository.js'

// Casos de uso
import { ConsultarSaldoEstoqueUseCase } from '../use-cases/ConsultarSaldoEstoqueUseCase.js'
import { RegistrarEntradaProdutoUseCase } from '../use-cases/RegistrarEntradaProdutoUseCase.js'
import { ExcluirEntradaProdutoUseCase } from '../use-cases/ExcluirEntradaProdutoUseCase.js'
import { RegistrarDoacaoFinanceiraUseCase } from '../use-cases/RegistrarDoacaoFinanceiraUseCase.js'
import { CriarBeneficiadoUseCase } from '../use-cases/CriarBeneficiadoUseCase.js'
import { ListarBeneficiadosUseCase } from '../use-cases/ListarBeneficiadosUseCase.js'
import { CriarVoluntarioUseCase } from '../use-cases/CriarVoluntarioUseCase.js'
import { ListarVoluntariosUseCase } from '../use-cases/ListarVoluntariosUseCase.js'
import { LoginUseCase } from '../use-cases/LoginUseCase.js'

// Controladores
import { EstoqueController } from '../controllers/EstoqueController.js'
import { DoacaoFinanceiraController } from '../controllers/DoacaoFinanceiraController.js'
import { MovimentacaoFinanceiraController } from '../controllers/MovimentacaoFinanceiraController.js'
import { BeneficiadoController } from '../controllers/BeneficiadoController.js'
import { VoluntarioController } from '../controllers/VoluntarioController.js'

function configurarDependencias(dbConnection) {
  // Repositórios
  let estoqueRepository, entradaProdutoRepository, saidaProdutoRepository, doacaoFinanceiraRepository, movimentacaoFinanceiraRepository
  let beneficiadoRepository, voluntarioRepository
  
  if (dbConnection) {
    estoqueRepository = new EstoqueRepository(dbConnection)
    entradaProdutoRepository = new EntradaProdutoRepository(dbConnection)
    saidaProdutoRepository = new SaidaProdutoRepository(dbConnection)
    doacaoFinanceiraRepository = new DoacaoFinanceiraRepository(dbConnection)
    movimentacaoFinanceiraRepository = new MovimentacaoFinanceiraRepository(dbConnection)
    beneficiadoRepository = new BeneficiadoRepository(dbConnection)
    voluntarioRepository = new VoluntarioRepository(dbConnection)
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
    voluntarioRepository = null
  }

  // Casos de uso
  let consultarSaldoEstoqueUseCase, registrarEntradaProdutoUseCase, excluirEntradaProdutoUseCase, registrarDoacaoFinanceiraUseCase
  let criarBeneficiadoUseCase, listarBeneficiadosUseCase, criarVoluntarioUseCase, listarVoluntariosUseCase, loginUseCase
  let estoqueController, doacaoFinanceiraController, beneficiadoController, voluntarioController
  
  if (dbConnection) {
    consultarSaldoEstoqueUseCase = new ConsultarSaldoEstoqueUseCase(estoqueRepository)
    registrarEntradaProdutoUseCase = new RegistrarEntradaProdutoUseCase(entradaProdutoRepository, estoqueRepository)
    excluirEntradaProdutoUseCase = new ExcluirEntradaProdutoUseCase(entradaProdutoRepository)
    registrarDoacaoFinanceiraUseCase = new RegistrarDoacaoFinanceiraUseCase(doacaoFinanceiraRepository)
    
    criarBeneficiadoUseCase = new CriarBeneficiadoUseCase(beneficiadoRepository)
    listarBeneficiadosUseCase = new ListarBeneficiadosUseCase(beneficiadoRepository)
    criarVoluntarioUseCase = new CriarVoluntarioUseCase(voluntarioRepository)
    listarVoluntariosUseCase = new ListarVoluntariosUseCase(voluntarioRepository)
    loginUseCase = new LoginUseCase(voluntarioRepository)
    
    estoqueController = new EstoqueController(consultarSaldoEstoqueUseCase, registrarEntradaProdutoUseCase, excluirEntradaProdutoUseCase)
    doacaoFinanceiraController = new DoacaoFinanceiraController(registrarDoacaoFinanceiraUseCase, doacaoFinanceiraRepository)
    beneficiadoController = new BeneficiadoController(criarBeneficiadoUseCase, listarBeneficiadosUseCase, beneficiadoRepository)
    voluntarioController = new VoluntarioController(criarVoluntarioUseCase, listarVoluntariosUseCase, voluntarioRepository, loginUseCase)
  } else {
    // Mock controllers for when database is not available
    estoqueController = null
    doacaoFinanceiraController = null
    
    // Create mock beneficiado controller
    beneficiadoController = {
      listar: (req, res) => res.json([]),
      buscarPorId: (req, res) => res.status(404).json({ error: 'Não encontrado' }),
      criar: (req, res) => res.status(500).json({ error: 'Banco de dados não disponível' }),
      atualizar: (req, res) => res.status(500).json({ error: 'Banco de dados não disponível' }),
      excluir: (req, res) => res.status(500).json({ error: 'Banco de dados não disponível' })
    }
    
    // Create mock voluntario controller for when database is not available
    voluntarioController = {
      login: (req, res) => {
        const { nomeUsuario, senha } = req.body
        if (nomeUsuario === 'dev' && senha === '1234') {
          return res.json({
            id: 1,
            nome: 'Administrador DEV',
            nomeUsuario: 'dev',
            permissoes: ['Beneficiados', 'Entrada de Produtos', 'Saída de Produtos', 'Financeiro', 'Patrocinadores'],
            isAdmin: true
          })
        }
        return res.status(401).json({ error: 'Credenciais inválidas' })
      },
      listar: (req, res) => res.json([]),
      buscarPorId: (req, res) => res.status(404).json({ error: 'Não encontrado' }),
      criar: (req, res) => res.status(500).json({ error: 'Banco de dados não disponível' }),
      atualizar: (req, res) => res.status(500).json({ error: 'Banco de dados não disponível' }),
      excluir: (req, res) => res.status(500).json({ error: 'Banco de dados não disponível' })
    }
  }
  
  const movimentacaoFinanceiraController = new MovimentacaoFinanceiraController(movimentacaoFinanceiraRepository)

  return {
    estoqueController,
    doacaoFinanceiraController,
    movimentacaoFinanceiraController,
    beneficiadoController,
    voluntarioController
  }
}

export { configurarDependencias }