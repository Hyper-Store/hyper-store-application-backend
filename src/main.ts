import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './infra/filters';
import * as cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { NestExpressApplication } from "@nestjs/platform-express"
import "dotenv/config"

async function bootstrap() {
  console.log(process.env.RABBITMQ_LOGIN_CREDENTIALS)
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true
  });
  app.set('trust proxy', 1)
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
  await app.listen(5000);
}
bootstrap();


