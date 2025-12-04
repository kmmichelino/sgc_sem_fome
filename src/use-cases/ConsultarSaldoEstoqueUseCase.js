export class ConsultarSaldoEstoqueUseCase {
  constructor(estoqueRepository) {
    this.estoqueRepository = estoqueRepository
  }

  async executar() {
    const saldos = await this.estoqueRepository.consultarSaldo()
    
    const saldosAgrupados = saldos.reduce((acc, item) => {
      const categoria = item.categoria_nome
      if (!acc[categoria]) {
        acc[categoria] = []
      }
      acc[categoria].push({
        id: item.id,
        produto: item.produto_nome,
        quantidade: item.quantidade,
        unidadeMedida: item.unidade_medida,
        dataValidade: item.data_validade,
        lote: item.lote
      })
      return acc
    }, {})

    return saldosAgrupados
  }
}