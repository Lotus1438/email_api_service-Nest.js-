import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { DatabaseService } from '../database.provider';

@Module({
  imports: [],
  controllers: [],
  providers: [RegisterService, DatabaseService],
  exports: [RegisterService],
})
export class RegisterModule {}
