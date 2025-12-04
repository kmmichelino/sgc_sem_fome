export class EstoqueController {
  constructor(consultarSaldoEstoqueUseCase, registrarEntradaProdutoUseCase, excluirEntradaProdutoUseCase) {
    this.consultarSaldoEstoqueUseCase = consultarSaldoEstoqueUseCase
    this.registrarEntradaProdutoUseCase = registrarEntradaProdutoUseCase
    this.excluirEntradaProdutoUseCase = excluirEntradaProdutoUseCase
  }

  async consultarSaldo(req, res) {
    try {
      const saldos = await this.consultarSaldoEstoqueUseCase.executar()
      res.json({ success: true, data: saldos })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }

  async registrarEntrada(req, res) {
    try {
      const resultado = await this.registrarEntradaProdutoUseCase.executar(req.body)
      res.status(201).json({ success: true, data: resultado })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }

  async excluirEntrada(req, res) {
    try {
      const { id } = req.params
      const resultado = await this.excluirEntradaProdutoUseCase.executar(id)
      res.json({ success: true, data: resultado })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}