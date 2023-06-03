import {
  EntityManager,
  MikroORM,
  PostgreSqlDriver,
} from '@mikro-orm/postgresql';
import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/modules/App.module';
import { DefaultSeeder } from './seeders/Default.seeder';

export const initializeMikro = async () => {
  const orm = await MikroORM.init<PostgreSqlDriver>();
  return orm;
};

export const setupDB = async () => {
  const orm = await initializeMikro();
  const migrator = orm.getMigrator();
  await migrator.up();

  const seeder = orm.getSeeder();
  await orm.getSchemaGenerator().clearDatabase();
  await seeder.seed(DefaultSeeder);

  await orm.close(true);
};

export const setupTest = async () => {
  await setupDB();

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  return await app.init();
};

export const RANDOM_JWT_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
