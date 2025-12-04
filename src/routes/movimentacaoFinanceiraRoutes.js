import { Router } from 'express'

export function configurarRotasMovimentacaoFinanceira(movimentacaoFinanceiraController) {
  const router = Router()

  router.post('/', (req, res) => movimentacaoFinanceiraController.criar(req, res))
  router.get('/', (req, res) => movimentacaoFinanceiraController.listar(req, res))
  router.get('/totais', (req, res) => movimentacaoFinanceiraController.obterTotais(req, res))

  return router
}