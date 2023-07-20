import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './infra/filters';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    allowedHeaders: "*"
  });
  app.use(cookieParser());

  app.useGlobalPipes(new CustomValidationPipe());
  await app.listen(5000);
}
bootstrap();
