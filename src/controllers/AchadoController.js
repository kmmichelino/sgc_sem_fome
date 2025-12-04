class AchadoController {
  constructor(
    listarAchadosUseCase,
    buscarAchadoPorIdUseCase,
    criarAchadoUseCase,
    atualizarAchadoUseCase,
    excluirAchadoUseCase,
  ) {
    this.listarAchadosUseCase = listarAchadosUseCase
    this.buscarAchadoPorIdUseCase = buscarAchadoPorIdUseCase
    this.criarAchadoUseCase = criarAchadoUseCase
    this.atualizarAchadoUseCase = atualizarAchadoUseCase
    this.excluirAchadoUseCase = excluirAchadoUseCase
  }

  async listar(req, res) {
    try {
      const resultado = await this.listarAchadosUseCase.execute()

      if (!resultado.success) {
        return res.status(500).json({ error: resultado.error })
      }

      return res.json(resultado.data)
    } catch (error) {
      console.error('Erro no controller ao listar achados:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async buscarPorId(req, res) {
    try {
      const { id } = req.params
      const resultado = await this.buscarAchadoPorIdUseCase.execute(id)

      if (!resultado.success) {
        if (resultado.notFound) {
          return res.status(404).json({ error: resultado.error })
        }
        return res.status(400).json({ error: resultado.error })
      }

      return res.json(resultado.data)
    } catch (error) {
      console.error('Erro no controller ao buscar achado:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async criar(req, res) {
    try {
      const resultado = await this.criarAchadoUseCase.execute(req.body)

      if (!resultado.success) {
        if (resultado.validationErrors) {
          return res.status(400).json({
            error: resultado.error,
            validationErrors: resultado.validationErrors,
          })
        }
        return res.status(400).json({ error: resultado.error })
      }

      return res.status(201).json({
        message: resultado.message,
        id: resultado.data.id,
      })
    } catch (error) {
      console.error('Erro no controller ao criar achado:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params
      const resultado = await this.atualizarAchadoUseCase.execute(id, req.body)

      if (!resultado.success) {
        if (resultado.notFound) {
          return res.status(404).json({ error: resultado.error })
        }
        if (resultado.validationErrors) {
          return res.status(400).json({
            error: resultado.error,
            validationErrors: resultado.validationErrors,
          })
        }
        return res.status(400).json({ error: resultado.error })
      }

      return res.json({ message: resultado.message })
    } catch (error) {
      console.error('Erro no controller ao atualizar achado:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async excluir(req, res) {
    try {
      const { id } = req.params
      const resultado = await this.excluirAchadoUseCase.execute(id)

      if (!resultado.success) {
        if (resultado.notFound) {
          return res.status(404).json({ error: resultado.error })
        }
        return res.status(400).json({ error: resultado.error })
      }

      return res.json({ message: resultado.message })
    } catch (error) {
      console.error('Erro no controller ao excluir achado:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }
}

export { AchadoController }
