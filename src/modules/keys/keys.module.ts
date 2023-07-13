import { Module } from '@nestjs/common';
import { KeysController } from './keys.controller';

@Module({
  controllers: [KeysController],
  providers: []
})
export class KeysModule {}
