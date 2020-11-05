const request = require('supertest')
const app = require('../index.js')
const server = require('../index.js')
const { parse } =  require('../node_modules/node-html-parser');

describe('test accueil', () => {
  afterAll(done => {
    server.close();
  });

  it('should return the accueil.html page', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    const root = parse(res.text);
    expect(root.querySelector("title").rawText).toBe("Accueil");
  })
})