import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles signup request', () => {
    const email = 'asd1@asd.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({email, password: '1234'})
      .expect(201)
      .then((res)=>{
        const {id, email} = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });
});
