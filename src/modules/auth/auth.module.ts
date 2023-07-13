import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserSectionService } from '../user-section/user-section.service';
import { AuthServerController } from './auth.server.controller';

@Module({
  controllers: [
    AuthController,
    AuthServerController
  ],
  imports: [],
  providers: [
    UserSectionService
  ],
  

})
export class AuthModule {}
