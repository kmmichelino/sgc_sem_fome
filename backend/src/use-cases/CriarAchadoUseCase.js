import { Achado } from '../entities/Achado.js'

class CriarAchadoUseCase {
    constructor(achadoRepository, tipoObjetoRepository) {
        this.achadoRepository = achadoRepository;
        this.tipoObjetoRepository = tipoObjetoRepository;
    }

    async execute(data) {
        try {
            const achado = new Achado({
                nome_objeto: data.nome_objeto,
                local_encontrado: data.local_encontrado,
                data_encontrado: data.data_encontrado,
                observacao: data.observacao,
                tipo_objeto_id: parseInt(data.tipo_objeto_id),
                url_foto: data.url_foto,
                nome_pessoa: data.nome_pessoa,
                status: 'Aguardando'
            });

            const validation = achado.validate();
            if (!validation.isValid) {
                return {
                    success: false,
                    error: 'Dados inválidos',
                    validationErrors: validation.errors
                };
            }

            const tipoObjeto = await this.tipoObjetoRepository.findById(achado.tipo_objeto_id);
            if (!tipoObjeto) {
                return {
                    success: false,
                    error: 'Tipo de objeto não encontrado'
                };
            }

            const resultado = await this.achadoRepository.create(achado);

            return {
                success: true,
                data: resultado,
                message: 'Objeto cadastrado com sucesso!'
            };
        } catch (error) {
            console.error('Erro ao criar achado:', error);
            return {
                success: false,
                error: 'Erro ao cadastrar achado'
            };
        }
    }
}

export { CriarAchadoUseCase }

