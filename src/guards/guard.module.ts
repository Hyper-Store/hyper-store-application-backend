import { Global, Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Module({
    providers: [ AuthGuard ],
    exports: [ AuthGuard ],
})
export class GuardModule {}
