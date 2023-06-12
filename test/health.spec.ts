import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setupTest } from 'test/helpers';

describe('Health', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await setupTest();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Test healthCheck() to summarize status of all running dependencies', async () => {
    await request(app.getHttpServer())
      .get(`/health`)
      .send()
      .then((res) => {
        console.log('Response:', JSON.stringify(res.body));
        expect(res.status).toEqual(200);
      });
  });
});
