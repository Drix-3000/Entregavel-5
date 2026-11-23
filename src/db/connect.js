
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Caminho da pasta database na raiz do projeto
const databaseFolder = path.join(__dirname, '../../database');

// Cria a pasta caso ela ainda não exista
if (!fs.existsSync(databaseFolder)) {
    fs.mkdirSync(databaseFolder, { recursive: true });
}

// Caminho do arquivo do banco
const databasePath = path.join(databaseFolder, 'electro_store.db');

// Abre ou cria o banco SQLite
const db = new Database(databasePath);

// Configurações do banco
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

console.log('Banco de dados SQLite conectado!');


db.exec(`
    CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        senha TEXT NOT NULL,
        cpf TEXT UNIQUE,
        telefone TEXT,
        endereco TEXT,
        cidade TEXT,
        estado TEXT,
        cep TEXT,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        descricao TEXT,
        categoria_id INTEGER,
        preco REAL NOT NULL,
        estoque INTEGER DEFAULT 0,
        unidade_medida TEXT NOT NULL,
        ativo INTEGER DEFAULT 1,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    );
`);

console.log('Tabelas iniciais criadas!');

db.exec(`
    -- PEDIDOS
    CREATE TABLE IF NOT EXISTS pedidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER NOT NULL,
        data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'pendente',
        valor_total REAL NOT NULL,
        tipo_pagamento TEXT NOT NULL,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    );

    -- ITENS DOS PEDIDOS
    CREATE TABLE IF NOT EXISTS itens_pedido (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pedido_id INTEGER NOT NULL,
        produto_id INTEGER NOT NULL,
        quantidade INTEGER NOT NULL,
        preco_unitario REAL NOT NULL,
        subtotal REAL NOT NULL,
        FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
        FOREIGN KEY (produto_id) REFERENCES produtos(id)
    );

    -- MOVIMENTAÇÕES DE ESTOQUE
    CREATE TABLE IF NOT EXISTS movimentacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        produto_id INTEGER NOT NULL,
        tipo TEXT NOT NULL,
        quantidade INTEGER NOT NULL,
        motivo TEXT,
        data_movimentacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (produto_id) REFERENCES produtos(id)
    );

    -- PAGAMENTOS
    CREATE TABLE IF NOT EXISTS pagamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pedido_id INTEGER NOT NULL,
        valor REAL NOT NULL,
        forma_pagamento TEXT NOT NULL,
        data_pagamento DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'pendente',
        FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
    );

    -- NOTAS FISCAIS DEMONSTRATIVAS
    CREATE TABLE IF NOT EXISTS notas_fiscais (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pedido_id INTEGER NOT NULL,
        numero TEXT NOT NULL UNIQUE,
        valor_total REAL NOT NULL,
        data_emissao DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'demonstrativa',
        FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
    );

    -- PROMISSÓRIAS
    CREATE TABLE IF NOT EXISTS promissorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pedido_id INTEGER NOT NULL,
        cliente_id INTEGER NOT NULL,
        valor REAL NOT NULL,
        vencimento DATE NOT NULL,
        status TEXT DEFAULT 'pendente',
        data_emissao DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
        FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    );
`);

console.log('Todas as tabelas iniciais foram verificadas!');

module.exports = db;
