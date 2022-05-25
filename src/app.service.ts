import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from './database.provider';
const { DATABASE_NAME = 'email_database' } = process.env;

@Injectable()
export class AppService {
  logger: Logger;
  constructor(private databaseService: DatabaseService) {
    this.logger = new Logger('AppService');
  }
  async registerRecord(table_name: string, params: Record<string, any>) {
    this.logger.log(params);
    return await this.databaseService.createRecord(
      DATABASE_NAME,
      table_name,
      params,
    );
  }
  async getAllRegisterRecord(table_name: string) {
    return await this.databaseService.getAllRecord(DATABASE_NAME, table_name);
  }
}
