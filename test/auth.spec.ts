import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { initializeMikro, setupTest } from './helpers';
import { MikroORM } from '@mikro-orm/postgresql';
import { faker } from '@mikro-orm/seeder';
import { LoginOutputDto } from 'src/dto/Auth.dto';
import { Users } from 'src/db/entities/Auth.entity';
import { UserRoleEnum } from 'src/db/entities/Base';
import { cast } from 'src/utils';
import { AuthService } from 'src/services/Auth.service';

const authService = {
  authorize: async (code: string): Promise<LoginOutputDto> => {
    const user = new Users();
    user.auth0 = faker.random.alpha(10);
    user.email = faker.internet.email();
    user.fullname = faker.name.fullName();
    user.role = UserRoleEnum.USER;
    const orm = await initializeMikro();
    await orm.em.persistAndFlush(user);

    return cast(LoginOutputDto, {
      accessToken: 'test',
      refreshToken: 'test',
    });
  },
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let orm: MikroORM;

  beforeEach(async () => {
    app = await setupTest();
    orm = await initializeMikro();
  });

  afterAll(async () => {
    await orm.close();
  });

  it('test /auth/authorize api', async () => {
    const _auth = app.get(AuthService);
    jest.spyOn(_auth, 'authorize').mockImplementation(authService.authorize);

    const response = await request(app.getHttpServer())
      .get(`/auth/authorize?code=${faker.random.alpha(10)}`)
      .send();
    console.log('Response:', response.body);

    expect(response.body.accessToken).toBeTruthy();
    expect(response.body.refreshToken).toBeTruthy();
  });
});
