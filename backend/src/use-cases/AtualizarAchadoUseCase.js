import { Achado } from '../entities/Achado.js'

class AtualizarAchadoUseCase {
    constructor(achadoRepository, tipoObjetoRepository) {
        this.achadoRepository = achadoRepository;
        this.tipoObjetoRepository = tipoObjetoRepository;
    }

    async execute(id, data) {
        try {
            if (!id) {
                return {
                    success: false,
                    error: 'ID é obrigatório'
                };
            }

            const achadoExistente = await this.achadoRepository.findById(id);
            if (!achadoExistente) {
                return {
                    success: false,
                    error: 'Objeto não encontrado',
                    notFound: true
                };
            }

            const formatDate = (dateString) => {
              if (!dateString) return null
              const date = new Date(dateString)
              return date.toISOString().split('T')[0]
            }

            const achado = new Achado({
                id: id,
                nome_objeto: data.nome_objeto,
                local_encontrado: data.local_encontrado,
                data_encontrado: formatDate(data.data_encontrado),
                observacao: data.observacao,
                tipo_objeto_id: parseInt(data.tipo_objeto_id),
                url_foto: data.url_foto,
                nome_pessoa: data.nome_pessoa,
                status: data.status || 'Aguardando'
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

            await this.achadoRepository.update(id, achado);

            return {
                success: true,
                message: 'Objeto atualizado com sucesso!'
            };
        } catch (error) {
            console.error('Erro ao atualizar achado:', error);
            return {
                success: false,
                error: 'Erro ao atualizar achado'
            };
        }
    }
}

export { AtualizarAchadoUseCase }

