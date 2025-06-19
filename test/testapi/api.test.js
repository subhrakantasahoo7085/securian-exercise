import request from 'supertest';
import app from '../../src/api/server.js';
import { expect } from 'chai';
import http from 'http';

let server;

describe('API Integration Test', () => {
  before((done) => {
    server = http.createServer(app).listen(3300, done);
  });

  after((done) => {
    server.close(done);
  });

  it('GET /api/hello', async () => {
    const res = await request(server).get('/api/hello');
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Hello, world!');
  });

  it('POST /api/add', async () => {
    const res = await request(server)
      .post('/api/add')
      .send({ a: 5, b: 7 });
    expect(res.status).to.equal(200);
    expect(res.body.result).to.equal(12);
  });
});
