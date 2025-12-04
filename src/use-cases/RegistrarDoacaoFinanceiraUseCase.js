import { DoacaoFinanceira } from '../entities/DoacaoFinanceira.js'

export class RegistrarDoacaoFinanceiraUseCase {
  constructor(doacaoFinanceiraRepository) {
    this.doacaoFinanceiraRepository = doacaoFinanceiraRepository
  }

  async executar(dados) {
    const doacaoFinanceira = new DoacaoFinanceira(
      null,
      dados.doadorId,
      dados.valor,
      dados.dataDoacao,
      dados.formaPagamento,
      dados.campanhaId,
      dados.observacoes,
      dados.responsavel
    )

    const id = await this.doacaoFinanceiraRepository.criar(doacaoFinanceira)

    return { id, message: 'Doação financeira registrada com sucesso' }
  }
}