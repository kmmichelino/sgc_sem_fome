export class BeneficiadoController {
  constructor(criarBeneficiadoUseCase, listarBeneficiadosUseCase, beneficiadoRepository) {
    this.criarBeneficiadoUseCase = criarBeneficiadoUseCase
    this.listarBeneficiadosUseCase = listarBeneficiadosUseCase
    this.beneficiadoRepository = beneficiadoRepository
  }

  async listar(req, res) {
    try {
      const resultado = await this.listarBeneficiadosUseCase.execute()

      if (!resultado.success) {
        return res.status(500).json({ error: resultado.error })
      }

      return res.json(resultado.data)
    } catch (error) {
      console.error('Erro no controller ao listar beneficiados:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async buscarPorId(req, res) {
    try {
      const { id } = req.params
      const beneficiado = await this.beneficiadoRepository.buscarPorId(id)

      if (!beneficiado) {
        return res.status(404).json({ error: 'Beneficiado não encontrado' })
      }

      return res.json(beneficiado)
    } catch (error) {
      console.error('Erro no controller ao buscar beneficiado:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async criar(req, res) {
    try {
      console.log('📝 Dados recebidos no controller:', req.body)
      const resultado = await this.criarBeneficiadoUseCase.execute(req.body)
      console.log('📋 Resultado do use case:', resultado)

      if (!resultado.success) {
        console.log('❌ Use case falhou:', resultado.error)
        if (resultado.validationErrors) {
          return res.status(400).json({
            error: resultado.error,
            validationErrors: resultado.validationErrors
          })
        }
        return res.status(400).json({ error: resultado.error })
      }

      return res.status(201).json({
        message: resultado.message,
        id: resultado.data.id
      })
    } catch (error) {
      console.error('💥 Erro no controller ao criar beneficiado:', error)
      return res.status(400).json({ error: 'Erro ao cadastrar beneficiado' })
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params
      const beneficiado = await this.beneficiadoRepository.buscarPorId(id)

      if (!beneficiado) {
        return res.status(404).json({ error: 'Beneficiado não encontrado' })
      }

      const sucesso = await this.beneficiadoRepository.atualizar(id, req.body)
      
      if (!sucesso) {
        return res.status(400).json({ error: 'Erro ao atualizar beneficiado' })
      }

      return res.json({ message: 'Beneficiado atualizado com sucesso!' })
    } catch (error) {
      console.error('Erro no controller ao atualizar beneficiado:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async excluir(req, res) {
    try {
      const { id } = req.params
      const beneficiado = await this.beneficiadoRepository.buscarPorId(id)

      if (!beneficiado) {
        return res.status(404).json({ error: 'Beneficiado não encontrado' })
      }

      const sucesso = await this.beneficiadoRepository.excluir(id)
      
      if (!sucesso) {
        return res.status(400).json({ error: 'Erro ao excluir beneficiado' })
      }

      return res.json({ message: 'Beneficiado excluído com sucesso!' })
    } catch (error) {
      console.error('Erro no controller ao excluir beneficiado:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }
}