import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as dayjs from 'dayjs';
import { getServerTime } from 'src/utils';

@Injectable()
export class ReactionMeterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = getServerTime();
    return next.handle().pipe(
      tap(() => {
        const end = getServerTime();
        const reaction = dayjs.duration(end.diff(start));
        console.log(`Request took ${reaction.asSeconds()}s to complete`);
      }),
    );
  }
}
