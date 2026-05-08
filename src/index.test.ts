import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './index';

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