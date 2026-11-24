
const express = require('express');
const router = express.Router();
const db = require('../db/connect');

// Login do cliente
router.post('/login', (req, res) => {
    const { email, senha } = req.body;

    // Verifica se os campos foram preenchidos
    if (!email || !senha) {
        return res.status(400).json({
            erro: 'E-mail e senha são obrigatórios.'
        });
    }

    try {
        // Procura o cliente pelo e-mail
        const buscarCliente = db.prepare(`
            SELECT id, nome, email, senha
            FROM clientes
            WHERE email = ?
        `);

        const cliente = buscarCliente.get(email);

        // Verifica se o cliente existe e se a senha está correta
        if (!cliente || cliente.senha !== senha) {
            return res.status(401).json({
                erro: 'E-mail ou senha incorretos.'
            });
        }

        // Login realizado
        res.status(200).json({
            mensagem: 'Login realizado com sucesso!',
            usuario: {
                id: cliente.id,
                nome: cliente.nome,
                email: cliente.email
            }
        });

    } catch (erro) {
        console.error('Erro no login:', erro);

        res.status(500).json({
            erro: 'Erro interno ao realizar login.'
        });
    }
});

module.exports = router;