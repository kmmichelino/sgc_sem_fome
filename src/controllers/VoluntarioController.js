export class VoluntarioController {
  constructor(criarVoluntarioUseCase, listarVoluntariosUseCase, voluntarioRepository, loginUseCase) {
    this.criarVoluntarioUseCase = criarVoluntarioUseCase
    this.listarVoluntariosUseCase = listarVoluntariosUseCase
    this.voluntarioRepository = voluntarioRepository
    this.loginUseCase = loginUseCase
  }

  async login(req, res) {
    try {
      const { nomeUsuario, senha } = req.body
      
      if (!nomeUsuario || !senha) {
        return res.status(400).json({ error: 'Nome de usuário e senha são obrigatórios' })
      }

      const resultado = await this.loginUseCase.execute(nomeUsuario, senha)

      if (!resultado.success) {
        return res.status(401).json({ error: resultado.error })
      }

      return res.json(resultado.data)
    } catch (error) {
      console.error('Erro no controller de login:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async listar(req, res) {
    try {
      const resultado = await this.listarVoluntariosUseCase.execute()

      if (!resultado.success) {
        return res.status(500).json({ error: resultado.error })
      }

      return res.json(resultado.data)
    } catch (error) {
      console.error('Erro no controller ao listar voluntários:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async buscarPorId(req, res) {
    try {
      const { id } = req.params
      const voluntario = await this.voluntarioRepository.buscarPorId(id)

      if (!voluntario) {
        return res.status(404).json({ error: 'Voluntário não encontrado' })
      }

      return res.json(voluntario)
    } catch (error) {
      console.error('Erro no controller ao buscar voluntário:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async criar(req, res) {
    try {
      const resultado = await this.criarVoluntarioUseCase.execute(req.body)

      if (!resultado.success) {
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
      console.error('Erro no controller ao criar voluntário:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params
      const voluntario = await this.voluntarioRepository.buscarPorId(id)

      if (!voluntario) {
        return res.status(404).json({ error: 'Voluntário não encontrado' })
      }

      const sucesso = await this.voluntarioRepository.atualizar(id, req.body)
      
      if (!sucesso) {
        return res.status(400).json({ error: 'Erro ao atualizar voluntário' })
      }

      return res.json({ message: 'Voluntário atualizado com sucesso!' })
    } catch (error) {
      console.error('Erro no controller ao atualizar voluntário:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async excluir(req, res) {
    try {
      const { id } = req.params
      const voluntario = await this.voluntarioRepository.buscarPorId(id)

      if (!voluntario) {
        return res.status(404).json({ error: 'Voluntário não encontrado' })
      }

      const sucesso = await this.voluntarioRepository.excluir(id)
      
      if (!sucesso) {
        return res.status(400).json({ error: 'Erro ao excluir voluntário' })
      }

      return res.json({ message: 'Voluntário excluído com sucesso!' })
    } catch (error) {
      console.error('Erro no controller ao excluir voluntário:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }
}