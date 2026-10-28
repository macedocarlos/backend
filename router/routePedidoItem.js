const createCrudRouter = require('./crudRouter');

module.exports = createCrudRouter({
    table: 'pedido_itens',
    idColumn: 'id_item',
    resource: 'itens',
    fields: ['id_pedido', 'id_produto', 'quantidade', 'valor_unitario', 'subtotal']
});