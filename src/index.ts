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
const products = [{ id: 1, title: "3XL", price: 1090, src: "3xl.png", quantity: 0, shadow: { bottom: "-5px", left: "-2%", width: "103%", height: "13px" } },
{ id: 2, title: "TRACK", price: 925, src: "track.png", quantity: 0, shadow: { bottom: "-2px", left: "9%", width: "83%", height: "12px" } },
{ id: 3, title: "RUNNER", price: 975, src: "runner.png", quantity: 0, shadow: { bottom: "-4px", left: "1%", width: "97%", height: "14px" } }];


app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from Balenciaga server!');
});

app.get('/products', (req, res) => {
  res.json(products);
});

app.get('/cart', (req, res) => {
  const cart = db.prepare('SELECT * FROM cart').all();
  res.json(cart);
})

app.post('/cart/add', (req, res) => {
  const id = req.body.productId;
  const item = db.prepare('SELECT * FROM cart WHERE product_id = ?').get(id);
  if (item) {
    db.prepare('UPDATE cart SET quantity = quantity + 1 WHERE product_id = ?').run(id);
  } else {
    db.prepare('INSERT INTO cart (product_id, quantity) VALUES (?, 1)').run(id);
  }
  const cart = db.prepare('SELECT * FROM cart').all();
  res.json(cart);
}
)

app.post('/cart/remove', (req, res) => {
  const id = req.body.productId;
  const item = db.prepare('select * from cart where product_id = ?').get(id) as CartRow;
  if (item) {
    if (item.quantity > 1) {
      db.prepare('update cart set quantity = quantity - 1 where product_id = ?').run(id);
    } else {
      db.prepare('delete from cart where product_id = ?').run(id)
    }
  }
  const cart = db.prepare('select * from cart').all();
  res.json(cart);
})

app.post('/cart/clear', (req, res) => {
  const id = req.body.productId;
  const item = db.prepare('select * from cart where product_id = ?').get(id);
  if (item) {
  db.prepare('delete from cart where product_id = ?').run(id)
}
const cart = db.prepare('SELECT * FROM cart').all();
  res.json(cart);
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:3001`);
});