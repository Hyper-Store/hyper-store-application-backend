import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './infra/filters';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:8888',
    credentials: true,
  });
  app.useGlobalPipes(new CustomValidationPipe());
  await app.listen(5000);
}
bootstrap();
