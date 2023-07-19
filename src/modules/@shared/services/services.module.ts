import { Global, Module } from '@nestjs/common';
import { PrismaIdpotenceConsumerService } from './prisma-idpotence-consumer.service';


@Global()
@Module({
  controllers: [
    
  ],
  providers: [
    PrismaIdpotenceConsumerService
  ],
    exports: [
    PrismaIdpotenceConsumerService
    ]
})
export class ServicesModule {}
