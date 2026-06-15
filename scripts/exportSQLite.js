const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const dbPath = path.join(__dirname, "../offline/database.db");

// remove banco antigo
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const sqlite = new Database(dbPath);

sqlite.exec(`
CREATE TABLE pessoas (
  id INTEGER PRIMARY KEY,
  nome TEXT,
  cpf TEXT
);

CREATE TABLE familias (
  id INTEGER PRIMARY KEY,
  nome_referencia TEXT
);

CREATE TABLE visitas (
  id INTEGER PRIMARY KEY,
  pessoa_id INTEGER,
  data_visita TEXT,
  observacao TEXT
);
`);

console.log("Banco SQLite criado.");