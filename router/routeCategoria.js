const createCrudRouter = require('./crudRouter');

module.exports = createCrudRouter({
    table: 'categorias',
    idColumn: 'id_categoria',
    resource: 'categorias',
    fields: ['nome', 'descricao', 'ativo']
});