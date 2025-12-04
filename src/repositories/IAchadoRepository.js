class IAchadoRepository {
    async findAll() {
        throw new Error('Método findAll() deve ser implementado');
    }

    async findById(id) {
        throw new Error('Método findById() deve ser implementado');
    }

    async create(achado) {
        throw new Error('Método create() deve ser implementado');
    }

    async update(id, achado) {
        throw new Error('Método update() deve ser implementado');
    }

    async delete(id) {
        throw new Error('Método delete() deve ser implementado');
    }
}

export { IAchadoRepository }

