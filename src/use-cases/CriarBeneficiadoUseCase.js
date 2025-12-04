import { Beneficiado } from '../entities/Beneficiado.js'

export class CriarBeneficiadoUseCase {
  constructor(beneficiadoRepository) {
    this.beneficiadoRepository = beneficiadoRepository
  }

  async execute(data) {
    try {
      console.log('Dados recebidos para criar beneficiado:', data)
      const beneficiado = new Beneficiado(data)
      
      const validation = beneficiado.validate()
      if (!validation.isValid) {
        console.log('Erros de validação:', validation.errors)
        return {
          success: false,
          error: 'Dados inválidos',
          validationErrors: validation.errors
        }
      }

      // Verificar se CPF já existe
      const beneficiadoExistente = await this.beneficiadoRepository.buscarPorCpf(beneficiado.cpf)
      if (beneficiadoExistente) {
        return {
          success: false,
          error: 'CPF já cadastrado no sistema'
        }
      }

      const id = await this.beneficiadoRepository.criar(beneficiado)
      
      return {
        success: true,
        data: { id },
        message: 'Beneficiado cadastrado com sucesso!'
      }
    } catch (error) {
      console.error('Erro ao criar beneficiado:', error)
      return {
        success: false,
        error: 'Erro ao cadastrar beneficiado'
      }
    }
  }
}