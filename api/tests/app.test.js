import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import supertest from 'supertest';
import app from '../app.js';

describe('GET /', () => {
  it('returns the API status', async () => {
    const res = await supertest(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', /json/);

    assert.deepEqual(res.body, { name: 'BOMB API', status: 'ok' });
  });
});

describe('Unknown routes', () => {
  it('returns 404 with a JSON message', async () => {
    const res = await supertest(app)
      .get('/does-not-exist')
      .expect(404)
      .expect('Content-Type', /json/);

    assert.deepEqual(res.body, { message: 'Not found' });
  });
});
