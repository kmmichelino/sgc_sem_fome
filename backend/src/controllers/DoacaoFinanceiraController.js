export class DoacaoFinanceiraController {
  constructor(registrarDoacaoFinanceiraUseCase, doacaoFinanceiraRepository) {
    this.registrarDoacaoFinanceiraUseCase = registrarDoacaoFinanceiraUseCase
    this.doacaoFinanceiraRepository = doacaoFinanceiraRepository
  }

  async registrar(req, res) {
    try {
      const resultado = await this.registrarDoacaoFinanceiraUseCase.executar(req.body)
      res.status(201).json({ success: true, data: resultado })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }

  async listar(req, res) {
    try {
      const doacoes = await this.doacaoFinanceiraRepository.listar()
      res.json({ success: true, data: doacoes })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}