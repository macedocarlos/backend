const createCrudRouter = require('./crudRouter');

module.exports = createCrudRouter({
    table: 'logs',
    idColumn: 'id_log',
    resource: 'logs',
    fields: ['usuario', 'tabela_afetada', 'acao', 'registro', 'data_hora']
});