import express from "express";
import cors from 'cors';
import db from "./database";

interface CartRow {
  id: number;
  product_id: number;
  quantity: number;
}

const app = express();
app.use(cors());
const port = 3001;


app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from Balenciaga server!');
});

app.get('/products', (req, res) => {
  const products = db.prepare('SELECT * FROM products').all();
  res.json(products);
});

app.post('/products', (req, res) => {
  try {
    const { title, price, src, shadow_bottom, shadow_left, shadow_width, shadow_height } = req.body;
    const insertProduct = db.prepare(`INSERT INTO products (title, price, src, shadow_bottom, shadow_left, shadow_width, shadow_height)
      VALUES (?, ?, ?, ?, ?, ?, ?)`).run(title, price, src, shadow_bottom, shadow_left, shadow_width, shadow_height);
    const id = insertProduct.lastInsertRowid;
    const newProduct = db.prepare('select * from products where id = ?').get(id);
    res.status(201).json(newProduct);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Failed to create product" });
  }
});

app.delete('/products/:id', (req, res) => {
  try {
    const id = req.params.id;
    const item = db.prepare('select * from products where id = ?').get(id);
    if (item) {
      db.prepare('delete from products where id = ?').run(id)
    };
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

app.put('/products/:id', (req, res) => {
  try {
    const id = req.params.id;
    const { title, price, src, shadow_bottom, shadow_left, shadow_width, shadow_height } = req.body;
    db.prepare('update products set title = ?, price = ?, src = ?, shadow_bottom = ?, shadow_left = ?, shadow_width = ?, shadow_height = ? where id = ?').run(title, price, src, shadow_bottom, shadow_left, shadow_width, shadow_height, id);
    const updatedProduct = db.prepare('select * from products where id = ?').get(id);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

app.get('/cart', (req, res) => {
  const cart = db.prepare('SELECT * FROM cart').all();
  res.json(cart);
});

app.post('/cart/add', (req, res) => {
  try {
    const id = req.body.productId;
    const item = db.prepare('SELECT * FROM cart WHERE product_id = ?').get(id);
    if (item) {
      db.prepare('UPDATE cart SET quantity = quantity + 1 WHERE product_id = ?').run(id);
    } else {
      db.prepare('INSERT INTO cart (product_id, quantity) VALUES (?, 1)').run(id);
    }
    const newItem = db.prepare('SELECT * FROM cart WHERE product_id = ?').get(id);
    res.json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to increase quantity" });
  }
}
);

app.post('/cart/remove', (req, res) => {
  try {
    const id = req.body.productId;
    const item = db.prepare('select * from cart where product_id = ?').get(id) as CartRow;
    if (item) {
      if (item.quantity > 1) {
        db.prepare('update cart set quantity = quantity - 1 where product_id = ?').run(id);
        const newItem = db.prepare('select * from cart where product_id = ?').get(id);
        res.json(newItem);
      } else {
        db.prepare('delete from cart where product_id = ?').run(id);
        res.json({deleted: true});
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to decrease quantity" });
  }
});

app.post('/cart/clear', (req, res) => {
  try {
    const id = req.body.productId;
    const item = db.prepare('select * from cart where product_id = ?').get(id);
    if (item) {
      db.prepare('delete from cart where product_id = ?').run(id);
      res.json({cleared: true});
    } else {
      res.json({ error: 'Product not found in cart' })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

export default app;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:3001`);
});