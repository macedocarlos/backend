const createCrudRouter = require('./crudRouter');

module.exports = createCrudRouter({
    table: 'pedidos',
    idColumn: 'id_pedido',
    resource: 'pedidos',
    fields: ['status', 'data_pedido', 'id_cliente']
});