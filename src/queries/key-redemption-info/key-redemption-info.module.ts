import { Module } from '@nestjs/common';
import { KeyRedemptionInfoConsumerService } from './key-redemption-info.consumer.service';
import { KeyRedemptionInfoController } from './key-redemption-info.controller';


@Module({
  controllers: [ 
    
   ],
  providers: [ 
    KeyRedemptionInfoConsumerService,
    KeyRedemptionInfoController
  ]
})
export class KeyRedemptionInfoModule {}
