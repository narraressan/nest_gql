import {
  Global,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { LoggerMiddleware } from 'src/middlewares/Logger.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
// import { PassportModule } from '@nestjs/passport';
import ThrottleConfig from 'src/config/Throttle.config';
import HttpConfig from 'src/config/Axios.config';
import { ReactionMeterInterceptor } from 'src/interceptors/ReactionMeter.interceptor';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthModule } from './Auth.module';
import { GraphQLModule } from './GraphQL.module';
import { AuthService } from 'src/services/Auth.service';
import { JwtStrategy } from 'src/guards/Auth.guard';
import { PassportModule } from '@nestjs/passport';
import { HealthModule } from './Health.module';

const common = [
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  MikroOrmModule.forRoot(),
  PassportModule,
  ThrottleConfig,
  HttpConfig,
];

@Global()
@Module({
  imports: [...common, AuthModule, HealthModule, GraphQLModule],
  exports: [...common, AuthService],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ReactionMeterInterceptor,
    },
    JwtStrategy,
    AuthService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
