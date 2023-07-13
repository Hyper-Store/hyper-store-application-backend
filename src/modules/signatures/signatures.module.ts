import { Module } from '@nestjs/common';
import { SignaturesController } from './signatures.controller';

@Module({
  controllers: [SignaturesController],
  providers: []
})
export class SignaturesModule {}
