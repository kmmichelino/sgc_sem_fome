class ListarTiposObjetosUseCase {
    constructor(tipoObjetoRepository) {
        this.tipoObjetoRepository = tipoObjetoRepository;
    }

    async execute() {
        try {
            const tiposObjetos = await this.tipoObjetoRepository.findAll();
            return {
                success: true,
                data: tiposObjetos
            };
        } catch (error) {
            console.error('Erro ao listar tipos de objetos:', error);
            return {
                success: false,
                error: 'Erro ao buscar tipos de objetos'
            };
        }
    }
}

export { ListarTiposObjetosUseCase }

