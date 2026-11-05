const express = require('express');
const prisma = require('../prisma');

const modelByTable = {
    categorias: prisma.categoria,
    clientes: prisma.cliente,
    entradas: prisma.entrada,
    estoque: prisma.estoque,
    fornecedores: prisma.fornecedor,
    funcionarios: prisma.funcionario,
    historico_precos: prisma.historicoPreco,
    logs: prisma.log,
    movimentacoes: prisma.movimentacao,
    pedidos: prisma.pedido,
    pedido_itens: prisma.pedidoItem,
    produtos: prisma.produto,
    saidas: prisma.saida
};

function createCrudRouter({ table, idColumn, fields, resource }) {
    const router = express.Router();
    const model = modelByTable[table];

    if (!model) throw new Error(`Modelo Prisma não configurado para a tabela ${table}.`);

    function parseId(value) {
        const id = Number(value);
        return Number.isInteger(id) && id > 0 ? id : null;
    }

    router.get('/', async (req, res) => {
        const resultado = await model.findMany();
        res.status(200).send({ [resource]: resultado });
    });

    router.get('/:id', async (req, res) => {
        const id = parseId(req.params.id);
        if (id === null) return res.status(400).send({ mensagem: 'ID inválido.' });

        const resultado = await model.findUnique({ where: { [idColumn]: id } });
        if (!resultado) return res.status(404).send({ mensagem: 'Registro não encontrado.' });
        res.status(200).send({ [resource]: resultado });
    });

    router.post('/', async (req, res) => {
        const data = Object.fromEntries(fields.map((field) => [field, req.body[field] ?? null]));
        const resultado = await model.create({ data });
        res.status(201).send({
            mensagem: 'Registro criado com sucesso!',
            [idColumn]: resultado[idColumn]
        });
    });

    router.patch('/:id', async (req, res) => {
        const id = parseId(req.params.id);
        if (id === null) return res.status(400).send({ mensagem: 'ID inválido.' });

        const updatedFields = fields.filter((field) => Object.prototype.hasOwnProperty.call(req.body, field));
        if (updatedFields.length === 0) {
            return res.status(400).send({ mensagem: 'Informe ao menos um campo válido para atualizar.' });
        }

        const data = Object.fromEntries(updatedFields.map((field) => [field, req.body[field]]));
        try {
            await model.update({ where: { [idColumn]: id }, data });
            res.status(202).send({ mensagem: 'Registro atualizado com sucesso!' });
        } catch (error) {
            if (error.code === 'P2025') return res.status(404).send({ mensagem: 'Registro não encontrado.' });
            throw error;
        }
    });

    router.delete('/:id', async (req, res) => {
        const id = parseId(req.params.id);
        if (id === null) return res.status(400).send({ mensagem: 'ID inválido.' });

        try {
            await model.delete({ where: { [idColumn]: id } });
            res.status(202).send({ mensagem: 'Registro removido com sucesso!' });
        } catch (error) {
            if (error.code === 'P2025') return res.status(404).send({ mensagem: 'Registro não encontrado.' });
            throw error;
        }
    });

    return router;
}

module.exports = createCrudRouter;