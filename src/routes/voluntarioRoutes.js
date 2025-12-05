import express from 'express'

export function configurarRotasVoluntario(voluntarioController) {
  const router = express.Router()

  router.post('/login', (req, res) => voluntarioController.login(req, res))
  router.get('/', (req, res) => voluntarioController.listar(req, res))
  router.get('/:id', (req, res) => voluntarioController.buscarPorId(req, res))
  router.post('/', (req, res) => voluntarioController.criar(req, res))
  router.put('/:id', (req, res) => voluntarioController.atualizar(req, res))
  router.delete('/:id', (req, res) => voluntarioController.excluir(req, res))

  return router
}