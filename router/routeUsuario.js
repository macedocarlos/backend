const express = require('express');
const router = express.Router();
const prisma = require('../prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// LOGIN DE USUÁRIO
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).send({ mensagem: 'Informe email e senha.' });
    }
    if (!process.env.JWT_SECRET) {
        return res.status(500).send({ mensagem: 'JWT_SECRET não está configurado no servidor.' });
    }

    const usuario = await prisma.usuario.findFirst({ where: { email } });
    if (!usuario || !usuario.ativo) {
        return res.status(401).send({ mensagem: 'Email ou senha inválidos.' });
    }

    const senhaArmazenada = usuario.senha;
    const senhaComHashBcrypt = /^\$2[aby]\$/.test(senhaArmazenada || '');
    const senhaValida = senhaComHashBcrypt
        ? bcrypt.compareSync(senha, senhaArmazenada)
        : senha === senhaArmazenada;

    if (!senhaValida) {
        return res.status(401).send({ mensagem: 'Email ou senha inválidos.' });
    }

    delete usuario.senha;
    const token = jwt.sign(
        { id_usu: usuario.id_usu, email: usuario.email },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    );
    return res.status(200).send({ mensagem: 'Login realizado com sucesso!', token, usuario });
});

//LISTAR USUÁRIOS
router.get('/', async (req, res) => {
    const resultado = await prisma.usuario.findMany({
        select: {
            id_usu: true,
            nome: true,
            email: true,
            contato: true,
            genero: true,
            ativo: true,
            criado_em: true,
            atualizado_em: true
        }
    });
    res.status(200).send({ usuario: resultado });
});


// BUSCAR USUÁRIO POR ID
router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(400).send({ mensagem: 'ID inválido.' });

    const resultado = await prisma.usuario.findUnique({
        where: { id_usu: id },
        select: {
            id_usu: true,
            nome: true,
            email: true,
            contato: true,
            genero: true,
            ativo: true,
            criado_em: true,
            atualizado_em: true
        }
    });
    res.status(200).send({ usuario: resultado ? [resultado] : [] });
});


// CADASTRAR USUÁRIO
router.post('/', async (req, res) => {
    const usuario = await prisma.usuario.create({
        data: {
            nome: req.body.nome ?? null,
            email: req.body.email ?? null,
            senha: req.body.senha ?? null,
            contato: req.body.contato ?? null,
            genero: req.body.genero ?? null,
            ativo: req.body.ativo ?? null
        }
    });
    res.status(201).send({
        mensagem: 'Usuário criado com sucesso!',
        id_usuario: usuario.id_usu
    });
});


// ATUALIZAR USUÁRIO
router.patch('/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(400).send({ mensagem: 'ID inválido.' });

    try {
        await prisma.usuario.update({
            where: { id_usu: id },
            data: {
                nome: req.body.nome ?? null,
                email: req.body.email ?? null,
                senha: req.body.senha ?? null
            }
        });
        res.status(202).send({ mensagem: 'Usuário atualizado com sucesso!' });
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).send({ mensagem: 'Usuário não encontrado.' });
        throw error;
    }
});


router.delete('/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(400).send({ mensagem: 'ID inválido.' });

    try {
        await prisma.usuario.delete({ where: { id_usu: id } });
        res.status(202).send({ mensagem: 'Usuário removido com sucesso!' });
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).send({ mensagem: 'Usuário não encontrado.' });
        throw error;
    }
});

module.exports=router;