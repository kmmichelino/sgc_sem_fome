class TipoObjeto {
    constructor({ id, nome }) {
        this.id = id;
        this.nome = nome;
    }

    validate() {
        const errors = [];

        if (!this.nome || this.nome.trim() === '') {
            errors.push('Nome do tipo de objeto é obrigatório');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

export { TipoObjeto }

