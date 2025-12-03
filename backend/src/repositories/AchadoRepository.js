import { IAchadoRepository } from './IAchadoRepository.js'
import { Achado } from '../entities/Achado.js'

class AchadoRepository extends IAchadoRepository {
    constructor(dbConnection) {
        super();
        this.db = dbConnection;
    }

    async findAll() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                    a.id,
                    a.nome_objeto,
                    a.local_encontrado,
                    a.data_encontrado,
                    a.observacao,
                    a.tipo_objeto_id,
                    a.url_foto,
                    a.nome_pessoa,
                    a.data_cadastro,
                    a.status,
                    t.nome as tipo_objeto_nome
                FROM achados a
                INNER JOIN tipos_objetos t ON a.tipo_objeto_id = t.id
                ORDER BY a.data_cadastro DESC
            `;

            this.db.query(query, (err, results) => {
                if (err) {
                    return reject(err);
                }

                const achados = results.map(row => {
                    const achado = new Achado({
                        id: row.id,
                        nome_objeto: row.nome_objeto,
                        local_encontrado: row.local_encontrado,
                        data_encontrado: row.data_encontrado,
                        observacao: row.observacao,
                        tipo_objeto_id: row.tipo_objeto_id,
                        url_foto: row.url_foto,
                        nome_pessoa: row.nome_pessoa,
                        data_cadastro: row.data_cadastro,
                        status: row.status
                    });
                    achado.tipo_objeto_nome = row.tipo_objeto_nome;
                    return achado;
                });

                resolve(achados);
            });
        });
    }

    async findById(id) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                    a.id,
                    a.nome_objeto,
                    a.local_encontrado,
                    a.data_encontrado,
                    a.observacao,
                    a.tipo_objeto_id,
                    a.url_foto,
                    a.nome_pessoa,
                    a.data_cadastro,
                    a.status,
                    t.nome as tipo_objeto_nome
                FROM achados a
                INNER JOIN tipos_objetos t ON a.tipo_objeto_id = t.id
                WHERE a.id = ?
            `;

            this.db.query(query, [id], (err, results) => {
                if (err) {
                    return reject(err);
                }

                if (results.length === 0) {
                    return resolve(null);
                }

                const row = results[0];
                const achado = new Achado({
                    id: row.id,
                    nome_objeto: row.nome_objeto,
                    local_encontrado: row.local_encontrado,
                    data_encontrado: row.data_encontrado,
                    observacao: row.observacao,
                    tipo_objeto_id: row.tipo_objeto_id,
                    url_foto: row.url_foto,
                    nome_pessoa: row.nome_pessoa,
                    data_cadastro: row.data_cadastro,
                    status: row.status
                });
                achado.tipo_objeto_nome = row.tipo_objeto_nome;

                resolve(achado);
            });
        });
    }

    async create(achado) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO achados
                (nome_objeto, local_encontrado, data_encontrado, observacao, tipo_objeto_id, url_foto, nome_pessoa)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                achado.nome_objeto,
                achado.local_encontrado,
                achado.data_encontrado,
                achado.observacao || null,
                achado.tipo_objeto_id,
                achado.url_foto || null,
                achado.nome_pessoa
            ];

            this.db.query(query, values, (err, result) => {
                if (err) {
                    return reject(err);
                }

                resolve({
                    id: result.insertId,
                    ...achado
                });
            });
        });
    }

    async update(id, achado) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE achados
                SET nome_objeto = ?,
                    local_encontrado = ?,
                    data_encontrado = ?,
                    observacao = ?,
                    tipo_objeto_id = ?,
                    url_foto = ?,
                    nome_pessoa = ?,
                    status = ?
                WHERE id = ?
            `;

            const values = [
                achado.nome_objeto,
                achado.local_encontrado,
                achado.data_encontrado,
                achado.observacao,
                achado.tipo_objeto_id,
                achado.url_foto,
                achado.nome_pessoa,
                achado.status || 'Aguardando',
                id
            ];

            this.db.query(query, values, (err, result) => {
                if (err) {
                    return reject(err);
                }

                if (result.affectedRows === 0) {
                    return resolve(null);
                }

                resolve(true);
            });
        });
    }

    async delete(id) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM achados WHERE id = ?';

            this.db.query(query, [id], (err, result) => {
                if (err) {
                    return reject(err);
                }

                if (result.affectedRows === 0) {
                    return resolve(null);
                }

                resolve(true);
            });
        });
    }
}

export { AchadoRepository }

