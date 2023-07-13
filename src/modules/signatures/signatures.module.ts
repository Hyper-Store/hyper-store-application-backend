import { Module } from '@nestjs/common';
import { SignaturesService } from './signatures.service';
import { SignaturesController } from './signatures.controller';

@Module({
  controllers: [SignaturesController],
  providers: [SignaturesService]
})
export class SignaturesModule {}
