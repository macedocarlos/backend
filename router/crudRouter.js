const express = require('express');
const mysql = require('../mysql').pool;

function createCrudRouter({ table, idColumn, fields, resource }) {
    const router = express.Router();

    router.get('/', (req, res) => {
        mysql.getConnection((error, conn) => {
            if (error) return res.status(500).send({ error });
            conn.query(`SELECT * FROM ${table}`, (queryError, resultado) => {
                conn.release();
                if (queryError) return res.status(500).send({ error: queryError });
                res.status(200).send({ [resource]: resultado });
            });
        });
    });

    router.get('/:id', (req, res) => {
        mysql.getConnection((error, conn) => {
            if (error) return res.status(500).send({ error });
            conn.query(`SELECT * FROM ${table} WHERE ${idColumn} = ?`, [req.params.id], (queryError, resultado) => {
                conn.release();
                if (queryError) return res.status(500).send({ error: queryError });
                if (resultado.length === 0) return res.status(404).send({ mensagem: 'Registro não encontrado.' });
                res.status(200).send({ [resource]: resultado[0] });
            });
        });
    });

    router.post('/', (req, res) => {
        mysql.getConnection((error, conn) => {
            if (error) return res.status(500).send({ error });
            const columns = fields.join(', ');
            const placeholders = fields.map(() => '?').join(', ');
            const values = fields.map((field) => req.body[field] ?? null);
            conn.query(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`, values, (queryError, resultado) => {
                conn.release();
                if (queryError) return res.status(500).send({ error: queryError });
                res.status(201).send({
                    mensagem: 'Registro criado com sucesso!',
                    [idColumn]: resultado.insertId
                });
            });
        });
    });

    router.patch('/:id', (req, res) => {
        mysql.getConnection((error, conn) => {
            if (error) return res.status(500).send({ error });
            const updatedFields = fields.filter((field) => Object.prototype.hasOwnProperty.call(req.body, field));
            if (updatedFields.length === 0) {
                conn.release();
                return res.status(400).send({ mensagem: 'Informe ao menos um campo válido para atualizar.' });
            }
            const assignments = updatedFields.map((field) => `${field} = ?`).join(', ');
            const values = updatedFields.map((field) => req.body[field]);
            values.push(req.params.id);
            conn.query(`UPDATE ${table} SET ${assignments} WHERE ${idColumn} = ?`, values, (queryError) => {
                conn.release();
                if (queryError) return res.status(500).send({ error: queryError });
                res.status(202).send({ mensagem: 'Registro atualizado com sucesso!' });
            });
        });
    });

    router.delete('/:id', (req, res) => {
        mysql.getConnection((error, conn) => {
            if (error) return res.status(500).send({ error });
            conn.query(`DELETE FROM ${table} WHERE ${idColumn} = ?`, [req.params.id], (queryError, resultado) => {
                conn.release();
                if (queryError) return res.status(500).send({ error: queryError });
                if (resultado.affectedRows === 0) return res.status(404).send({ mensagem: 'Registro não encontrado.' });
                res.status(202).send({ mensagem: 'Registro removido com sucesso!' });
            });
        });
    });

    return router;
}

module.exports = createCrudRouter;