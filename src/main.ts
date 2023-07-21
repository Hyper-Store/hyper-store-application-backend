import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './infra/filters';
import * as cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true
  });

  app.use(rateLimit({
    windowMs: 1000, // 1 second
    max: 5, // limit each IP to 5 requests per windowMs
    handler: function(req, res) {
      res.status(429).json({ 
        error: {
          message: 'Too many requests, please try again later.',
          name: "TooManyRequestsError"
        }
      });
    }
  }));

  app.use(cookieParser());

  app.useGlobalPipes(new CustomValidationPipe());
  await app.listen(80);
}
bootstrap();
