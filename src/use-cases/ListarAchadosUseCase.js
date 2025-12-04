class ListarAchadosUseCase {
    constructor(achadoRepository) {
        this.achadoRepository = achadoRepository;
    }

    async execute() {
        try {
            const achados = await this.achadoRepository.findAll();
            return {
                success: true,
                data: achados
            };
        } catch (error) {
            console.error('Erro ao listar achados:', error);
            return {
                success: false,
                error: 'Erro ao buscar achados'
            };
        }
    }
}

export { ListarAchadosUseCase }

