
const express = require('express');
const path = require('path');

// Inicialização do banco de dados
require('./db/init-db');

// Routes
const clientesRoutes = require('./routes/clients');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 3000;

// Middlewares
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/clientes', clientesRoutes);
app.use('/api/auth', authRoutes);

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Electro Store rodando em http://localhost:${PORT}`);
});
