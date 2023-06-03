import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';

const loadConfig = () => {
  const { THROTTLE_TTL, THROTTLE_LIMIT } = process.env;
  const params = {
    ttl: parseInt(THROTTLE_TTL),
    limit: parseInt(THROTTLE_LIMIT),
  };

  console.log(`THROTTLE CONFIG: ${JSON.stringify(params)}`);
  return params;
};

// careful with tests or health check APIs - error will raise 429 code
export default ThrottlerModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: () => loadConfig(),
});
