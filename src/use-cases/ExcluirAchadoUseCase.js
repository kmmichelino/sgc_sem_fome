class ExcluirAchadoUseCase {
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

            await this.achadoRepository.delete(id);

            return {
                success: true,
                message: 'Objeto excluído com sucesso!'
            };
        } catch (error) {
            console.error('Erro ao excluir achado:', error);
            return {
                success: false,
                error: 'Erro ao excluir achado'
            };
        }
    }
}

export { ExcluirAchadoUseCase }

