const createCrudRouter = require('./crudRouter');

module.exports = createCrudRouter({
    table: 'fornecedores',
    idColumn: 'id_fornecedor',
    resource: 'fornecedores',
    fields: ['nome', 'empresa', 'email', 'telefone', 'cidade', 'estado', 'ativo']
});