import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { newApp } from './helpers.js';

test('create a project', async () => {
  const app = newApp();

  const res = await request(app).post('/api/v1/projects').send({ name: 'Alpha' });

  assert.equal(res.status, 201);
  assert.equal(res.body.name, 'Alpha');
  assert.equal(res.body.status, 'open');
});

test('blank project name is rejected', async () => {
  const app = newApp();

  const res = await request(app).post('/api/v1/projects').send({ name: '' });

  assert.equal(res.status, 400);
  assert.equal(res.body.code, 'INVALID_REQUEST');
});

test('duplicate project name is rejected', async () => {
  const app = newApp();
  await request(app).post('/api/v1/projects').send({ name: 'Alpha' });

  const res = await request(app).post('/api/v1/projects').send({ name: 'Alpha' });

  assert.equal(res.status, 409);
  assert.equal(res.body.code, 'PROJECT_NAME_TAKEN');
});

test('list projects', async () => {
  const app = newApp();
  await request(app).post('/api/v1/projects').send({ name: 'Alpha' });

  const res = await request(app).get('/api/v1/projects');

  assert.equal(res.status, 200);
  assert.equal(res.body.length, 1);
});

test('close a project', async () => {
  const app = newApp();
  const created = await request(app).post('/api/v1/projects').send({ name: 'Alpha' });

  const res = await request(app)
    .patch(`/api/v1/projects/${created.body.id}`)
    .send({ status: 'closed' });

  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'closed');
});

test('closing an unknown project returns 404', async () => {
  const app = newApp();

  const res = await request(app).patch('/api/v1/projects/9999').send({ status: 'closed' });

  assert.equal(res.status, 404);
  assert.equal(res.body.code, 'PROJECT_NOT_FOUND');
});
