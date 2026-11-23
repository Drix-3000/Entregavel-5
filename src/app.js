
const express = require('express');
const path = require('path');
const db = require('./db/connect');

const clientesRoutes = require('./routes/clients');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API
app.use('/api/clientes', clientesRoutes);

app.listen(PORT, () => {
    console.log(`Electro Store rodando em http://localhost:${PORT}`);
});
