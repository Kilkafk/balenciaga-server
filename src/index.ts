import express from "express";
import cors from 'cors';


const app = express();
app.use(cors());
const port = 3001;
const products = [{ id: 1, title: "3XL", price: 1090, src: "3xl.png", quantity: 0, shadow: { bottom: "-5px", left: "-2%", width: "103%", height: "13px" } },
{ id: 2, title: "TRACK", price: 925, src: "track.png", quantity: 0, shadow: { bottom: "-2px", left: "9%", width: "83%", height: "12px" } },
{ id: 3, title: "RUNNER", price: 975, src: "runner.png", quantity: 0, shadow: { bottom: "-4px", left: "1%", width: "97%", height: "14px" } }];

let cart: {
  id: number;
  quantity: number;
}[] = [];

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from Balenciaga server!');
});

app.get('/products', (req, res) => {
  res.json(products);
});

app.get('/cart', (req, res) => {
  res.json(cart);
})

app.post('/cart/add', (req, res) => {
  const { productId } = req.body;
  const existingItem = cart.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      quantity: 1
    })
  }
  res.json(cart);
}
)

app.post('/cart/remove', (req, res) => {
  const { productId } = req.body;
  const existingItem = cart.find((item) => item.id === productId);
  if (existingItem) {
    if (existingItem.quantity > 1) {
      existingItem.quantity -= 1;
    } else {
      const indexItem = cart.findIndex((item) => item.id === productId);
      cart.splice(indexItem, 1);
    }
  }
  res.json(cart);
})

app.post('/cart/clear', (req, res) => {
  const { productId } = req.body;
  const existingItem = cart.find((item) => item.id === productId);
  if (existingItem) {
      const indexItem = cart.findIndex((item) => item.id === productId);
      cart.splice(indexItem, 1);
    }
    res.json(cart);
  }
)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:3001`);
});