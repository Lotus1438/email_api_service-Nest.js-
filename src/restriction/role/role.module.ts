import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { JwtModule } from '@nestjs/jwt';
import { RoleGuard } from './role.guard';
import { DatabaseService } from '../../database.provider';
import { UtilityService } from '../../utils/utility.service';
import { UtilityModule } from '../../utils/utility.module';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
    UtilityService,
    UtilityModule,
  ],
  providers: [RoleService, RoleGuard, DatabaseService],
  exports: [RoleService, UtilityService],
})
export class RoleModule {}
