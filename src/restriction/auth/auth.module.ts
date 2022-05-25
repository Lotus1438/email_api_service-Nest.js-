import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UtilityModule } from '../../utils/utility.module';
import { UtilityService } from '../../utils/utility.service';

@Module({
  imports: [UtilityModule],
  providers: [AuthService, AuthGuard, UtilityService],
  exports: [AuthService, UtilityService],
})
export class AuthModule {}
