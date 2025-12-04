export class IEstoqueRepository {
  async consultarSaldo() {
    throw new Error('Método consultarSaldo deve ser implementado')
  }

  async atualizarEstoque(produtoId, quantidade) {
    throw new Error('Método atualizarEstoque deve ser implementado')
  }

  async obterPorProduto(produtoId) {
    throw new Error('Método obterPorProduto deve ser implementado')
  }
}