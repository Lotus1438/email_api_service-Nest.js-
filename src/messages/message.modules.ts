import { Module } from '@nestjs/common';
import { MessageController } from './message.controllers';
import { MessageService } from './message.service';
import { DatabaseService } from '../database.provider';

@Module({
  imports: [],
  controllers: [MessageController],
  providers: [MessageService, DatabaseService],
  exports: [MessageService, DatabaseService],
})
export class AppModule {}
