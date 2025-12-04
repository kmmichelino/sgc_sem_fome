import express from 'express'

export function configurarRotasBeneficiado(beneficiadoController) {
  const router = express.Router()

  router.get('/', (req, res) => beneficiadoController.listar(req, res))
  router.get('/:id', (req, res) => beneficiadoController.buscarPorId(req, res))
  router.post('/', (req, res) => beneficiadoController.criar(req, res))
  router.put('/:id', (req, res) => beneficiadoController.atualizar(req, res))
  router.delete('/:id', (req, res) => beneficiadoController.excluir(req, res))

  return router
}