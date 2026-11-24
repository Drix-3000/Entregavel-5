const express = require('express');
const path = require('path');

const db = require('./db/connect');
require('./db/init');

// Routes 
const clientesRoutes = require('./routes/clients');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/clientes', clientesRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Electro Store rodando em http://localhost:${PORT}`);
});
