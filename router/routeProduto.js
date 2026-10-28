const createCrudRouter = require('./crudRouter');

module.exports = createCrudRouter({
    table: 'produtos',
    idColumn: 'id_produto',
    resource: 'produtos',
    fields: ['nome', 'descricao', 'preco', 'imagem_produto', 'id_categoria']
});