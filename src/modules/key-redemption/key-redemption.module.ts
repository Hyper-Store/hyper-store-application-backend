import { Module } from '@nestjs/common';
import { KeyRedemptionService } from './key-redemption.service';

@Module({
  providers: [KeyRedemptionService]
})
export class KeyRedemptionModule {}
