import Database from "better-sqlite3";

const db = new Database('shop.bd');

const cart = "id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER NOT NULL, quantity INTEGER NOT NULL DEFAULT 1";

db.exec(`CREATE TABLE IF NOT EXISTS cart (${cart})`);

export default db;