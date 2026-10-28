const createCrudRouter = require('./crudRouter');

module.exports = createCrudRouter({
    table: 'clientes',
    idColumn: 'id_cliente',
    resource: 'clientes',
    fields: ['nome', 'email', 'contato', 'ativo']
});