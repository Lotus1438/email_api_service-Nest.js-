import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseService } from '../database.provider';
import { AuthModule } from '../restriction/auth/auth.module';
import { RoleModule } from '../restriction/role/role.module';

@Module({
  imports: [AuthModule, RoleModule],
  controllers: [UserController],
  providers: [UserService, DatabaseService],
  exports: [UserService, DatabaseService],
})
export class UserModule {}
