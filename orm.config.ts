import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { readFileSync } from 'fs';

const ENV = process.env;

const params: MikroOrmModuleOptions = {
  type: 'postgresql',
  host: ENV.DB_HOST,
  port: parseInt(ENV.DB_PORT),
  user: ENV.DB_USERNAME,
  password: ENV.DB_PASSWORD,
  dbName: ENV.DB_DATABASE,
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  contextName: 'AuthConnectionContext',
  registerRequestContext: false,
  migrations: {
    path: 'dist/db/migrations',
    pathTs: 'src/db/migrations',
  },
  driverOptions: {
    connection: {
      ssl: ENV.DB_CERT
        ? {
            rejectUnauthorized: true,
            ca: readFileSync(`${process.cwd()}/${ENV.DB_CERT}`).toString(),
          }
        : null,
    },
  },
  allowGlobalContext: true,
  forceUtcTimezone: true,
  autoLoadEntities: true,
  validate: true,
  strict: true,
  debug: ENV.ENV === 'prod' ? false : true,
  logger: console.log.bind(console),

  // for testing --------------------
  seeder: {
    path: 'test/seeders',
    pathTs: 'test/seeders',
    glob: '.seeders.{js,ts}',
    emit: 'ts',
    fileName: (className: string) => className,
  },
};

console.log(`ORM CONFIG: ${JSON.stringify(params)}`);

export default params;
