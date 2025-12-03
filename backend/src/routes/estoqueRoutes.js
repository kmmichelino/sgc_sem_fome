import { Router } from 'express'

export function configurarRotasEstoque(estoqueController) {
  const router = Router()

  router.get('/saldo', (req, res) => estoqueController.consultarSaldo(req, res))
  router.post('/entrada', (req, res) => estoqueController.registrarEntrada(req, res))
  router.delete('/entrada/:id', (req, res) => estoqueController.excluirEntrada(req, res))

  return router
}