import { Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Module({
    providers: [ AuthGuard ],
    exports: [],
})
export class GuardModule {}
