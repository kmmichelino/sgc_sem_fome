export class MovimentacaoFinanceiraController {
  constructor(movimentacaoFinanceiraRepository) {
    this.movimentacaoFinanceiraRepository = movimentacaoFinanceiraRepository
  }

  async criar(req, res) {
    try {
      const id = await this.movimentacaoFinanceiraRepository.criar(req.body)
      res.status(201).json({ success: true, id })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }

  async listar(req, res) {
    try {
      const movimentacoes = await this.movimentacaoFinanceiraRepository.listar()
      res.json({ success: true, data: movimentacoes })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }

  async obterTotais(req, res) {
    try {
      const totais = await this.movimentacaoFinanceiraRepository.obterTotais()
      res.json({ success: true, data: totais })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}