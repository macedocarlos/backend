const createCrudRouter = require('./crudRouter');

module.exports = createCrudRouter({
    table: 'historico_precos',
    idColumn: 'id_historico',
    resource: 'historico_precos',
    fields: ['id_produto', 'preco', 'vigencia']
});