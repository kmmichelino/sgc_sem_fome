import { EntradaProduto } from '../entities/EntradaProduto.js'

export class RegistrarEntradaProdutoUseCase {
  constructor(entradaProdutoRepository, estoqueRepository) {
    this.entradaProdutoRepository = entradaProdutoRepository
    this.estoqueRepository = estoqueRepository
  }

  async executar(dados) {
    const entradaProduto = new EntradaProduto(
      null,
      dados.produtoId,
      dados.doadorId,
      dados.quantidade,
      dados.dataEntrada,
      dados.dataValidade,
      dados.lote,
      dados.observacoes,
      dados.responsavel
    )

    const id = await this.entradaProdutoRepository.criar(entradaProduto)
    await this.estoqueRepository.atualizarEstoque(dados.produtoId, dados.quantidade)

    return { id, message: 'Entrada de produto registrada com sucesso' }
  }
}