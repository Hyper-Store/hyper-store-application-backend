import { Module } from '@nestjs/common';
import { SignaturesController } from './signatures.server.controller';

@Module({
  controllers: [SignaturesController],
  providers: []
})
export class SignaturesModule {}
