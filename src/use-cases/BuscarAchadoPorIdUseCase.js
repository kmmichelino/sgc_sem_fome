class BuscarAchadoPorIdUseCase {
    constructor(achadoRepository) {
        this.achadoRepository = achadoRepository;
    }

    async execute(id) {
        try {
            if (!id) {
                return {
                    success: false,
                    error: 'ID é obrigatório'
                };
            }

            const achado = await this.achadoRepository.findById(id);
            
            if (!achado) {
                return {
                    success: false,
                    error: 'Objeto não encontrado',
                    notFound: true
                };
            }

            return {
                success: true,
                data: achado
            };
        } catch (error) {
            console.error('Erro ao buscar achado:', error);
            return {
                success: false,
                error: 'Erro ao buscar achado'
            };
        }
    }
}

export { BuscarAchadoPorIdUseCase }

