import { Module } from '@nestjs/common';
import { UserRoleController } from './user_role.controllers';
import { UserRoleService } from './user_role.service';
import { DatabaseService } from '../database.provider';

@Module({
  imports: [],
  controllers: [UserRoleController],
  providers: [UserRoleService, DatabaseService],
  exports: [UserRoleService, DatabaseService],
})
export class AppModule {}
