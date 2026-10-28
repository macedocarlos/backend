const createCrudRouter = require('./crudRouter');

module.exports = createCrudRouter({
    table: 'saidas',
    idColumn: 'id_saida',
    resource: 'saidas',
    fields: ['id_produto', 'id_funcionario', 'quantidade', 'valor_unitario', 'data_saida', 'destino']
});