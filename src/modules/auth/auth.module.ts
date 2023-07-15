import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthServerController } from './auth.server.controller';

@Module({
  controllers: [
    AuthController,
    AuthServerController
  ],
  imports: [],
  providers: [
    
  ],
  

})
export class AuthModule {}
