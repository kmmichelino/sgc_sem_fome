import { Voluntario } from '../entities/Voluntario.js'

export class CriarVoluntarioUseCase {
  constructor(voluntarioRepository) {
    this.voluntarioRepository = voluntarioRepository
  }

  async execute(data) {
    try {
      const voluntario = new Voluntario(data)
      
      const validation = voluntario.validate()
      if (!validation.isValid) {
        return {
          success: false,
          error: 'Dados inválidos',
          validationErrors: validation.errors
        }
      }

      // Verificar se CPF já existe
      const voluntarioExistente = await this.voluntarioRepository.buscarPorCpf(voluntario.cpf)
      if (voluntarioExistente) {
        return {
          success: false,
          error: 'CPF já cadastrado no sistema'
        }
      }

      const id = await this.voluntarioRepository.criar(voluntario)
      
      return {
        success: true,
        data: { id },
        message: 'Voluntário cadastrado com sucesso!'
      }
    } catch (error) {
      console.error('Erro ao criar voluntário:', error)
      return {
        success: false,
        error: 'Erro ao cadastrar voluntário'
      }
    }
  }
}