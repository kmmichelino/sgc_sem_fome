class TipoObjetoController {
    constructor(listarTiposObjetosUseCase) {
        this.listarTiposObjetosUseCase = listarTiposObjetosUseCase;
    }

    async listar(req, res) {
        try {
            const resultado = await this.listarTiposObjetosUseCase.execute();

            if (!resultado.success) {
                return res.status(500).json({ error: resultado.error });
            }

            return res.json(resultado.data);
        } catch (error) {
            console.error('Erro no controller ao listar tipos de objetos:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

export { TipoObjetoController }

