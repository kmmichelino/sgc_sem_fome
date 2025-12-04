export class ExcluirEntradaProdutoUseCase {
  constructor(entradaProdutoRepository) {
    this.entradaProdutoRepository = entradaProdutoRepository
  }

  async executar(id) {
    return await this.entradaProdutoRepository.excluir(id)
  }
}