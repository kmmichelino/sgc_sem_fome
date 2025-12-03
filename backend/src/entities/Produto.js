export class Produto {
  constructor(id, nome, categoriaId, unidadeMedida, dataRegistro = null) {
    this.id = id
    this.nome = nome
    this.categoriaId = categoriaId
    this.unidadeMedida = unidadeMedida
    this.dataRegistro = dataRegistro
  }
}