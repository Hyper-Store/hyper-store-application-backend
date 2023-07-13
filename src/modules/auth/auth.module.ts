import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserSectionService } from '../user-section/user-section.service';

@Module({
  controllers: [AuthController],
  imports: [],
  providers: [
    UserSectionService
  ],
  

})
export class AuthModule {}
