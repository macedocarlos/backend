const createCrudRouter = require('./crudRouter');

module.exports = createCrudRouter({
    table: 'funcionarios',
    idColumn: 'id_funcionario',
    resource: 'funcionarios',
    fields: ['nome', 'cargo', 'salario', 'telefone', 'email', 'data_admissao', 'ativo']
});