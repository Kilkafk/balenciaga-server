import Database from "better-sqlite3";
function createDatabase(filename: string) {
  const db = new Database(filename);
  
  db.exec(`CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    product_id INTEGER NOT NULL, 
    quantity INTEGER NOT NULL DEFAULT 1
    )`);
  
  db.exec(`CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL UNIQUE,
  price INTEGER NOT NULL,
  src TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  shadow_bottom TEXT,
  shadow_left TEXT,
  shadow_width TEXT,
  shadow_height TEXT
    )`)
  
  db.exec(`INSERT OR IGNORE INTO products (title, price, src, quantity, shadow_bottom, shadow_left, shadow_width, shadow_height)
    VALUES 
    ('3XL', 1090, '3xl.png', 0, '-5px', '-2%', '103%', '13px'),
    ('TRACK', 925, 'track.png', 0, '-2px', '1%', '101%', '12px'),
    ('RUNNER', 975, 'runner.png', 0, '-4px', '1%', '97%', '14px')`)
  return db;
};

export default createDatabase;