import { Router } from 'express'

export function configurarRotasDoacaoFinanceira(doacaoFinanceiraController) {
  const router = Router()

  router.post('/', (req, res) => doacaoFinanceiraController.registrar(req, res))
  router.get('/', (req, res) => doacaoFinanceiraController.listar(req, res))

  return router
}