const createCrudRouter = require('./crudRouter');

module.exports = createCrudRouter({
    table: 'entradas',
    idColumn: 'id_entrada',
    resource: 'entradas',
    fields: ['id_produto', 'id_fornecedor', 'quantidade', 'valor_unitario', 'data_entrada', 'observacao']
});