import { Module } from '@nestjs/common';
import { UserSessionController } from './user-session.controller';
import { UserSessionExpirationService } from './user-session-expiration.service';
import { CloseExpiredUserSessionService } from './close-expired-user-session.service';

@Module({
  controllers: [UserSessionController],
  providers: [
    UserSessionExpirationService,
    CloseExpiredUserSessionService
  ]
})
export class UserSessionModule {}
