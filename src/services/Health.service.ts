import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HttpHealthIndicator,
  MikroOrmHealthIndicator,
} from '@nestjs/terminus';

@Injectable()
export class HealthService extends HealthIndicator {
  constructor(
    private http: HttpHealthIndicator,
    private mikroOrm: MikroOrmHealthIndicator,
  ) {
    super();
  }

  async db(): Promise<HealthIndicatorResult> {
    return await this.mikroOrm.pingCheck('database');
  }
}
