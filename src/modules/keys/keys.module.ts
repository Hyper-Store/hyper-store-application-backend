import { Module } from '@nestjs/common';
import { KeysController } from './keys.controller';
import { KeysServerController } from './keys.server.controller';

@Module({
  controllers: [
    KeysController,
    KeysServerController
  ],
  providers: []
})
export class KeysModule {}
