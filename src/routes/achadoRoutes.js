import express from 'express'

function configurarRotasAchado(achadoController) {
  const router = express.Router()

  router.get('/', (req, res) => achadoController.listar(req, res))
  router.get('/:id', (req, res) => achadoController.buscarPorId(req, res))
  router.post('/', (req, res) => achadoController.criar(req, res))
  router.put('/:id', (req, res) => achadoController.atualizar(req, res))
  router.delete('/:id', (req, res) => achadoController.excluir(req, res))

  return router
}

export { configurarRotasAchado }

