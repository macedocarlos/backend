const express = require('express');
const router = express.Router();
const mysql = require("../mysql").pool;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// LOGIN DE USUÁRIO
router.post('/login', (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).send({ mensagem: 'Informe email e senha.' });
    }
    if (!process.env.JWT_SECRET) {
        return res.status(500).send({ mensagem: 'JWT_SECRET não está configurado no servidor.' });
    }

    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error });
        conn.query(
            'SELECT id_usu, nome, email, senha, contato, genero, ativo FROM usuarios WHERE email = ?',
            [email],
            (queryError, resultado) => {
                conn.release();
                if (queryError) return res.status(500).send({ error: queryError });
                if (resultado.length === 0 || !resultado[0].ativo) {
                    return res.status(401).send({ mensagem: 'Email ou senha inválidos.' });
                }

                const usuario = resultado[0];
                const senhaArmazenada = usuario.senha;
                const senhaComHashBcrypt = /^\$2[aby]\$/.test(senhaArmazenada);
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
            }
        );
    });
});

//LISTAR USUÁRIOS
router.get('/', (req, res) => {
mysql.getConnection((error, conn) => {
   if (error) return res.status(500).send({ error });
    conn.query("SELECT id_usu, nome, email, contato, genero, ativo, criado_em, atualizado_em FROM usuarios", (error, resultado) => {
       conn.release();
  if (error) return res.status(500).send({ error });
       res.status(200).send({ usuario: resultado });
       });
    });
});


// BUSCAR USUÁRIO POR ID
router.get('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error: error });
        conn.query("SELECT id_usu, nome, email, contato, genero, ativo, criado_em, atualizado_em FROM usuarios WHERE id_usu = ?", 
            [req.params.id], (error, resultado) => {
            conn.release();
            if (error) return res.status(500).send({ error: error });
            res.status(200).send({ usuario: resultado });
        });
    });
});


// CADASTRAR USUÁRIO
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error: error });
        conn.query(
            "INSERT INTO usuarios (nome, email, senha, contato, genero, ativo) VALUES (?, ?, ? ,?, ?, ?)",
            [req.body.nome, req.body.email, req.body.senha,req.body.contato,req.body.genero,req.body.ativo],
            (error, resultado) => {
                console.log(error)
                conn.release();
                if (error) return res.status(500).send({ error: error });
                res.status(201).send({
                    mensagem: "Usuário criado com sucesso!",
                    id_usuario: resultado.insertId
                });
            }
        );
    });
});


// ATUALIZAR USUÁRIO
router.patch('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error: error });
        conn.query(
            "UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id_usu = ?",
            [req.body.nome, req.body.email, req.body.senha, req.params.id],
            (error, resultado) => {
                conn.release();
                if (error) return res.status(500).send({ error: error });
                res.status(202).send({ mensagem: "Usuário atualizado com sucesso!" });
            }
        );
    });
});


router.delete('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) return res.status(500).send({ error: error });
        conn.query("DELETE FROM usuarios WHERE id_usu = ?", [req.params.id], (error, resultado) => {
            conn.release();
            if (error) return res.status(500).send({ error: error });
            res.status(202).send({ mensagem: "Usuário removido com sucesso!" });
        });
    });
});

module.exports=router;