import { Module } from '@nestjs/common';
import { LoginController } from './login.controllers';
import { LoginService } from './login.service';
import { DatabaseService } from '../database.provider';

@Module({
  imports: [],
  controllers: [LoginController],
  providers: [LoginService, DatabaseService],
  exports: [LoginService],
})
export class LoginModule {}
