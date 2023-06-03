import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './modules/App.module';
import { ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';
import helmet from 'helmet';
import { AllExceptionsFilter } from './middlewares/AllExceptions.filter';

export const bootstrap = async (port: number, env: string) => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    ...(env === 'prod'
      ? { logger: ['error', 'warn'] }
      : { logger: ['log', 'error', 'warn', 'debug', 'verbose'] }),
  });
  app.enableCors();
  app.enableShutdownHooks();
  app.set('trust proxy', 1);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      validateCustomDecorators: true,
    }),
  );
  app.useGlobalFilters(
    new AllExceptionsFilter(app.get(HttpAdapterHost).httpAdapter),
  );
  app.use(compression());
  app.use(
    helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }),
  );
  await app.listen(port);
};
