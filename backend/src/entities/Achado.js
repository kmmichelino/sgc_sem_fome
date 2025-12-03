class Achado {
    constructor({
        id,
        nome_objeto,
        local_encontrado,
        data_encontrado,
        observacao,
        tipo_objeto_id,
        url_foto,
        nome_pessoa,
        data_cadastro,
        status = 'Aguardando'
    }) {
        this.id = id;
        this.nome_objeto = nome_objeto;
        this.local_encontrado = local_encontrado;
        this.data_encontrado = data_encontrado;
        this.observacao = observacao;
        this.tipo_objeto_id = tipo_objeto_id;
        this.url_foto = url_foto;
        this.nome_pessoa = nome_pessoa;
        this.data_cadastro = data_cadastro;
        this.status = status;
    }

    validate() {
        const errors = [];

        if (!this.nome_objeto || this.nome_objeto.trim() === '') {
            errors.push('Nome do objeto é obrigatório');
        }

        if (!this.local_encontrado || this.local_encontrado.trim() === '') {
            errors.push('Local onde foi encontrado é obrigatório');
        }

        if (!this.data_encontrado) {
            errors.push('Data em que o objeto foi encontrado é obrigatória');
        } else {
            const dataEncontrado = new Date(this.data_encontrado);
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);

            if (dataEncontrado > hoje) {
                errors.push('A data não pode ser no futuro');
            }
        }

        if (!this.tipo_objeto_id) {
            errors.push('Tipo do objeto é obrigatório');
        }

        if (!this.nome_pessoa || this.nome_pessoa.trim() === '') {
            errors.push('Nome da pessoa que encontrou é obrigatório');
        }

        if (this.url_foto && !this.isValidUrl(this.url_foto)) {
            errors.push('URL da foto inválida');
        }

        if (this.status && !['Aguardando', 'Devolvido'].includes(this.status)) {
            errors.push('Status inválido. Deve ser "Aguardando" ou "Devolvido"');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    marcarComoDevolvido() {
        this.status = 'Devolvido';
    }

    marcarComoAguardando() {
        this.status = 'Aguardando';
    }

    isDevolvido() {
        return this.status === 'Devolvido';
    }
}

export { Achado }

