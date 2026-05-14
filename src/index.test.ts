import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from './index';
import createDatabase from './database';
import fs from 'fs';
import { Express } from 'express';

let app: Express;
beforeAll(() => {
  if (fs.existsSync('shop.test.db')) {
    fs.unlinkSync('shop.test.db');
  }
  const db = createDatabase('shop.test.db');
  app = createApp(db);
});
interface Product {
  id: number;
  title: string;
  price: number;
  src: string;
  quantity: number;
  shadow_bottom: string;
  shadow_left: string;
  shadow_width: string;
  shadow_height: string;
}
interface CartItem {
  product_id: number;
  quantity: number;
}

it('get products', async () => {
  const response = await request(app).get('/products');
  expect(response.status).toBe(200);
});

it('get cart', async () => {
  const response = await request(app).get('/cart');
  expect(Array.isArray(response.body)).toBe(true);
});

it('add product', async () => {
  const newProduct = { title: `TEST-${Date.now()}`, price: 100, src: 'test-png', shadow_bottom: '0px', shadow_left: '0px', shadow_width: '0px', shadow_height: '0px' };
  const response = await request(app)
  .post('/products')
  .send(newProduct);
  expect(response.status).toBe(201);
  expect(response.body).toMatchObject(newProduct);
});

it('put product', async () => {
  const newProduct = { title: `TEST-${Date.now()}`, price: 100, src: 'test-png', shadow_bottom: '0px', shadow_left: '0px', shadow_width: '0px', shadow_height: '0px' };
  const response = await request(app)
  .post('/products')
  .send(newProduct);
  const productId = response.body.id;
  const responsePut = await request(app)
  .put(`/products/${productId}`)
  .send({...newProduct, price: 100})
  const responseGet = await request(app).get('/products');
  const updatedProduct = responseGet.body.find((product: Product) => product.id === productId);
  expect(responsePut.status).toBe(200);
  expect(responsePut.body.price).toBe(100);
  expect(updatedProduct.price).toBe(100);
});

it('delete product', async () => {
  const newProduct = { title: `TEST-${Date.now()}`, price: 100, src: 'test-png', shadow_bottom: '0px', shadow_left: '0px', shadow_width: '0px', shadow_height: '0px' };
  const response = await request(app)
  .post('/products')
  .send(newProduct);
  const productId = response.body.id;
  const responseDelete = await request(app)
  .delete(`/products/${productId}`)
  const responseGet = await request(app).get('/products');
  const deletedProduct = responseGet.body.find((product: Product) => product.id === productId);
  expect(responseDelete.status).toBe(200);
  expect(deletedProduct).toBeUndefined();
});

it('add product in cart', async () => {
  const response = await request(app).get('/products');
  const productId = response.body[0].id;
  const responseAddCart = await request(app)
  .post('/cart/add')
  .send({productId});
  const responseGet = await request(app).get('/cart');
  const cartItem = responseGet.body.find((item: CartItem) => item.product_id === productId);
  expect(responseAddCart.status).toBe(200);
  expect(responseAddCart.body.product_id).toBe(productId);
  expect(responseAddCart.body.quantity).toBeGreaterThan(0);
  expect(cartItem).toBeDefined();
});

it('remove product from cart', async () => {
  const response = await request(app).get('/products')
  const productId = response.body[0].id;
  const responseAddCart = await request(app)
  .post('/cart/add')
  .send({productId});
  const quantityItem = responseAddCart.body.quantity;
  const responseRemove = await request(app)
  .post('/cart/remove')
  .send({productId});
  const responseGet = await request(app).get('/cart');
  const cartItem = responseGet.body.find((item: CartItem) => item.product_id === productId);
  expect(responseRemove.status).toBe(200);
  if (quantityItem > 1) {
    expect(responseRemove.body.quantity).toBe(quantityItem - 1);
    expect(cartItem).toBeDefined();
  } else {
    expect(responseRemove.body.deleted).toBe(true);
    expect(cartItem).toBeUndefined();
  };
});

it('clear entire product from cart', async () => {
  const response = await request(app).get('/products')
  const productId = response.body[0].id;
  const responseAddCart = await request(app)
  .post('/cart/add')
  .send({productId});
  const responseClear = await request(app)
  .post('/cart/clear')
  .send({productId});
  const responseGet = await request(app).get('/cart');
  const cartItem = responseGet.body.find((item: CartItem) => item.product_id === productId);
  expect(responseClear.status).toBe(200);
  expect(responseClear.body.cleared).toBe(true);
  expect(cartItem).toBeUndefined();
});

