export class ListarBeneficiadosUseCase {
  constructor(beneficiadoRepository) {
    this.beneficiadoRepository = beneficiadoRepository
  }

  async execute() {
    try {
      const beneficiados = await this.beneficiadoRepository.listar()
      return {
        success: true,
        data: beneficiados
      }
    } catch (error) {
      console.error('Erro ao listar beneficiados:', error)
      return {
        success: false,
        error: 'Erro ao buscar beneficiados'
      }
    }
  }
}