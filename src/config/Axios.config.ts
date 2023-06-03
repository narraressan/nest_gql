import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

const loadConfig = (env: ConfigService): Record<string, any> => {
  const config = {
    timeout: parseInt(env.get('HTTP_TIMEOUT')),
    maxRedirects: parseInt(env.get('HTTP_MAX_REDIRECTS')),
  };

  console.log(`AXIOS: ${JSON.stringify(config)}`);
  return config;
};

export default HttpModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => loadConfig(config),
});
