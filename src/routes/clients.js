
const express = require('express');
const router = express.Router();
const db = require('../db/connect');

// Cadastrar cliente
router.post('/', (req, res) => {
    const {
        nome,
        email,
        senha,
        cpf,
        telefone,
        endereco,
        cidade,
        estado,
        cep
    } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({
            erro: 'Nome, e-mail e senha são obrigatórios.'
        });
    }

    try {
        const inserir = db.prepare(`
            INSERT INTO clientes (
                nome, email, senha, cpf, telefone,
                endereco, cidade, estado, cep
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const resultado = inserir.run(
            nome, email, senha, cpf, telefone,
            endereco, cidade, estado, cep
        );

        res.status(201).json({
            mensagem: 'Cliente cadastrado com sucesso!',
            id: resultado.lastInsertRowid
        });

    } catch (erro) {
        if (erro.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(409).json({
                erro: 'Este e-mail ou CPF já está cadastrado.'
            });
        }

        res.status(500).json({
            erro: 'Erro ao cadastrar cliente.'
        });
    }
});

module.exports = router;
