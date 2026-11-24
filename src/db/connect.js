
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const databaseFolder = path.join(__dirname, '../../database');

if (!fs.existsSync(databaseFolder)) {
    fs.mkdirSync(databaseFolder, { recursive: true });
}

const databasePath = path.join(databaseFolder, 'electro_store.db');

const db = new Database(databasePath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

console.log('Banco de dados SQLite conectado!');

module.exports = db;
