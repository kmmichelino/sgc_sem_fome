import express from 'express'

function configurarRotasTipoObjeto(tipoObjetoController) {
  const router = express.Router()
  router.get('/', (req, res) => tipoObjetoController.listar(req, res))
  return router
}

export { configurarRotasTipoObjeto }

