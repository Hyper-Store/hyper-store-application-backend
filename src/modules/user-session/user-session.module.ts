import { Module } from '@nestjs/common';
import { UserSessionController } from './user-session.controller';

@Module({
  controllers: [UserSessionController],
  providers: []
})
export class UserSessionModule {}
