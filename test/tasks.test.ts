import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { newApp } from './helpers.js';

test('create a task on an open project', async () => {
  const app = newApp();
  const project = await request(app).post('/api/v1/projects').send({ name: 'Alpha' });

  const res = await request(app)
    .post(`/api/v1/projects/${project.body.id}/tasks`)
    .send({ title: 'Write tests' });

  assert.equal(res.status, 201);
  assert.equal(res.body.title, 'Write tests');
});

test('blank task title is rejected', async () => {
  const app = newApp();
  const project = await request(app).post('/api/v1/projects').send({ name: 'Alpha' });

  const res = await request(app)
    .post(`/api/v1/projects/${project.body.id}/tasks`)
    .send({ title: '' });

  assert.equal(res.status, 400);
  assert.equal(res.body.code, 'INVALID_REQUEST');
});

test('task on an unknown project returns 404', async () => {
  const app = newApp();

  const res = await request(app).post('/api/v1/projects/9999/tasks').send({ title: 'x' });

  assert.equal(res.status, 404);
  assert.equal(res.body.code, 'PROJECT_NOT_FOUND');
});

test('task on a closed project is rejected', async () => {
  const app = newApp();
  const project = await request(app).post('/api/v1/projects').send({ name: 'Alpha' });
  await request(app).patch(`/api/v1/projects/${project.body.id}`).send({ status: 'closed' });

  const res = await request(app)
    .post(`/api/v1/projects/${project.body.id}/tasks`)
    .send({ title: 'Write tests' });

  assert.equal(res.status, 409);
  assert.equal(res.body.code, 'PROJECT_CLOSED');
});

test('list tasks for a project', async () => {
  const app = newApp();
  const project = await request(app).post('/api/v1/projects').send({ name: 'Alpha' });
  await request(app).post(`/api/v1/projects/${project.body.id}/tasks`).send({ title: 'Write tests' });

  const res = await request(app).get(`/api/v1/projects/${project.body.id}/tasks`);

  assert.equal(res.status, 200);
  assert.equal(res.body.length, 1);
});
