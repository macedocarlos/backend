const createCrudRouter = require('./crudRouter');

module.exports = createCrudRouter({
    table: 'estoque',
    idColumn: 'id_estoque',
    resource: 'estoque',
    fields: ['id_produto', 'quantidade', 'estoque_minimo', 'estoque_maximo', 'localizacao']
});