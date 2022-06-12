import { NestFactory } from '@nestjs/core';

import * as momentTimeZone from 'moment-timezone';

import { AppModule } from './app.module';
import { AllExceptionsFilters } from './common/filters/http.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilters());
  Date.prototype.toJSON = function (): any {
    return momentTimeZone(this)
      .tz('America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss:SSS');
  };
  await app.listen(8080);
}
bootstrap();
