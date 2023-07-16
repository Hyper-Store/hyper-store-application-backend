import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Global, Module } from '@nestjs/common';
import { exchanges } from './exchanges';
import "dotenv/config"

@Global()
@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges,
      uri: process.env.RABBITMQ_LOGIN_CREDENTIALS,
      connectionInitOptions: { wait: true },
      enableControllerDiscovery: true,
    }),
  ],
  exports: [RabbitMQModule],

})
export class RabbitModule { }