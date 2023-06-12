import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { RANDOM_JWT_TOKEN, initializeMikro, setupTest } from './helpers';
import { MikroORM } from '@mikro-orm/postgresql';
import { faker } from '@mikro-orm/seeder';
import { Users } from 'src/db/entities/Auth.entity';
import { UserRoleEnum } from 'src/db/entities/Base';
import { mutation, query } from 'gql-query-builder';
import { IsPrivateGQLApi } from 'src/guards/Auth.guard';
import { Notes } from 'src/db/entities/Note.entity';

const authGuard = {
  canActivate: async (context) => {
    return true;
  },
};

const createUser = async () => {
  const user = new Users();
  user.auth0 = faker.random.alpha(10);
  user.email = faker.internet.email();
  user.fullname = faker.name.fullName();
  user.role = UserRoleEnum.USER;
  const orm = await initializeMikro();
  await orm.em.persistAndFlush(user);
  return user;
};

const createNotes = async (user: Users) => {
  const note = new Notes();
  note.user = user;
  note.message = faker.random.words();
  const orm = await initializeMikro();
  await orm.em.persistAndFlush(note);
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
    await app.close();
  });

  it('test getUserNotes query', async () => {
    const _auth = app.get(IsPrivateGQLApi);
    jest.spyOn(_auth, 'canActivate').mockImplementation(authGuard.canActivate);

    const user = await createUser();
    await createNotes(user);
    const response = await request(app.getHttpServer())
      .post(`/graphql`)
      .set('Authorization', `Bearer ${RANDOM_JWT_TOKEN}`)
      .send(
        query({
          operation: 'getUserNotes',
          variables: {
            input: {
              value: {
                userUUID: user.uuid,
              },
              type: 'GetUserNotesInput',
              required: true,
            },
          },
          fields: [
            { user: ['id', 'uuid', 'email', 'fullname', 'role'] },
            { notes: ['id', 'message'] },
            'info',
          ],
        }),
      );
    console.log('Response:', response.body);

    const getUserNotes = response.body.data.getUserNotes;
    expect(getUserNotes.user.uuid).toEqual(user.uuid);
    expect(getUserNotes.user.email).toEqual(user.email);
    expect(getUserNotes.notes.length).toEqual(1);
  });

  it('test createUserNote mutation', async () => {
    const _auth = app.get(IsPrivateGQLApi);
    jest.spyOn(_auth, 'canActivate').mockImplementation(authGuard.canActivate);

    const user = await createUser();
    const response = await request(app.getHttpServer())
      .post(`/graphql`)
      .set('Authorization', `Bearer ${RANDOM_JWT_TOKEN}`)
      .send(
        mutation({
          operation: 'createUserNote',
          variables: {
            input: {
              value: {
                userUUID: user.uuid,
                message: faker.random.words(),
              },
              type: 'NoteInput',
              required: true,
            },
          },
          fields: ['message'],
        }),
      );
    console.log('Response:', response.body);

    const notes = await orm.em.count(Notes, { user });
    expect(notes).toEqual(1);
  });
});
