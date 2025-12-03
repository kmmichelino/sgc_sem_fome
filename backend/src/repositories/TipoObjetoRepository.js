import { ITipoObjetoRepository } from './ITipoObjetoRepository.js'
import { TipoObjeto } from '../entities/TipoObjeto.js'

class TipoObjetoRepository extends ITipoObjetoRepository {
    constructor(dbConnection) {
        super();
        this.db = dbConnection;
    }

    async findAll() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM tipos_objetos ORDER BY nome';
            
            this.db.query(query, (err, results) => {
                if (err) {
                    return reject(err);
                }
                
                const tiposObjetos = results.map(row => 
                    new TipoObjeto({
                        id: row.id,
                        nome: row.nome
                    })
                );
                
                resolve(tiposObjetos);
            });
        });
    }

    async findById(id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM tipos_objetos WHERE id = ?';
            
            this.db.query(query, [id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                
                if (results.length === 0) {
                    return resolve(null);
                }
                
                const row = results[0];
                const tipoObjeto = new TipoObjeto({
                    id: row.id,
                    nome: row.nome
                });
                
                resolve(tipoObjeto);
            });
        });
    }
}

export { TipoObjetoRepository }

