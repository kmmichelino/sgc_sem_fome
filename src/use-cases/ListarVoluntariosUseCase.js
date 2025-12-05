export class ListarVoluntariosUseCase {
  constructor(voluntarioRepository) {
    this.voluntarioRepository = voluntarioRepository
  }

  async execute() {
    try {
      const voluntarios = await this.voluntarioRepository.listar()
      
      return {
        success: true,
        data: voluntarios
      }
    } catch (error) {
      console.error('Erro ao listar voluntários:', error)
      return {
        success: false,
        error: 'Erro ao carregar voluntários'
      }
    }
  }
}