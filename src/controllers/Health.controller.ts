import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { HealthService } from 'src/services/Health.service';
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private indicator: HealthService,
  ) {}

  @Get()
  @HealthCheck()
  async healthCheck(): Promise<HealthCheckResult> {
    return await this.health.check([
      (): Promise<HealthIndicatorResult> => this.indicator.db(),
    ]);
  }
}
