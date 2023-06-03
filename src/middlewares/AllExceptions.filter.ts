import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { sendToSlack } from 'src/utils';

@Catch(HttpException)
export class AllExceptionsFilter extends BaseExceptionFilter {
  async catch(exception: any, host: ArgumentsHost) {
    await sendToSlack(
      `error: ${
        exception?.stack || typeof exception === 'object'
          ? JSON.stringify(exception)
          : exception
      } \ndata: ${host.getArgs()?.toString()}`,
    );
    throw exception;
  }
}
