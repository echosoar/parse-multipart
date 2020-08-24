import * as assert from 'assert';
import * as request from 'supertest';
import * as express from 'express';
import * as getRawBody from 'raw-body';
import { resolve } from 'path';
import { parseMultipart } from '../src';
describe('test multipart', () => {
  it('should get multipart file', done => {
    const app = express();
    app.post('/upload', async (req, res) => {
      req.body = await getRawBody(req);
      parseMultipart(req);
      res.status(200).json({});
    });
    request(app)
      .post('/upload')
      .field('test', '123')
      .attach('upfile', resolve(__dirname, './resource/file.txt'))
      .attach('upfile2', resolve(__dirname, './resource/file2.json'))
      .attach('npm', resolve(__dirname, './resource/npm.png'))
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        assert(res.body);
        done();
      });
  });
});