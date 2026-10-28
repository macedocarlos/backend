const createCrudRouter = require('./crudRouter');

module.exports = createCrudRouter({
    table: 'movimentacoes',
    idColumn: 'id_movimentacao',
    resource: 'movimentacoes',
    fields: ['id_produto', 'tipo', 'quantidade', 'data_movimentacao', 'observacao']
});