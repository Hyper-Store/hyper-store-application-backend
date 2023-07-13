import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Global, Module } from '@nestjs/common';
import { exchanges } from './exchanges';
import { ConsumeMessage } from 'amqplib';

@Global()
@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges,
      uri: process.env.RABBITMQ_LOGIN_CREDENTIALS,
      connectionInitOptions: { wait: true },
      enableControllerDiscovery: true,
      
      // deserializer: (message: Buffer) => {
      //   // const decodedMessage = JSON.parse(message.toString('utf-8'))
      //   // return decodedMessage;
      // },
    }),
  ],
  exports: [ RabbitMQModule ],

})
export class RabbitModule {}