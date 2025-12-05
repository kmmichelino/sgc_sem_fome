export class LoginUseCase {
  constructor(voluntarioRepository) {
    this.voluntarioRepository = voluntarioRepository
  }

  async execute(nomeUsuario, senha) {
    try {
      console.log('Tentativa de login:', { nomeUsuario, senha })
      const voluntario = await this.voluntarioRepository.buscarPorNomeUsuario(nomeUsuario)
      
      if (!voluntario) {
        console.log('Usuário não encontrado:', nomeUsuario)
        return {
          success: false,
          error: 'Usuário não encontrado'
        }
      }

      console.log('Voluntário encontrado:', { id: voluntario.id, nome: voluntario.nome, senha: voluntario.senha })
      if (voluntario.senha !== senha) {
        console.log('Senha incorreta. Esperada:', voluntario.senha, 'Recebida:', senha)
        return {
          success: false,
          error: 'Senha incorreta'
        }
      }

      if (voluntario.status !== 'Ativo') {
        return {
          success: false,
          error: 'Usuário inativo'
        }
      }

      // Parse permissions from JSON
      let permissoes = []
      try {
        permissoes = JSON.parse(voluntario.responsavel_por || '[]')
      } catch (e) {
        permissoes = []
      }

      // DEV user has full admin access
      const isAdmin = voluntario.nome_usuario === 'dev'
      if (isAdmin) {
        permissoes = ['Beneficiados', 'Entrada de Produtos', 'Saída de Produtos', 'Financeiro', 'Patrocinadores']
      }

      return {
        success: true,
        data: {
          id: voluntario.id,
          nome: voluntario.nome,
          nomeUsuario: voluntario.nome_usuario,
          permissoes: permissoes,
          isAdmin: isAdmin
        }
      }
    } catch (error) {
      console.error('Erro no login:', error)
      return {
        success: false,
        error: 'Erro interno do servidor'
      }
    }
  }
}