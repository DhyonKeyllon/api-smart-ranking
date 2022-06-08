import { AllExceptionsFilters } from './common/filters/http.exception.filter';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilters());
  await app.listen(8080);
}
bootstrap();
