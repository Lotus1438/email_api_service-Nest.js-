import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.provider';
const { DATABASE_NAME = 'email_database' } = process.env;
@Injectable()
export class RegisterService {
  constructor(private databaseService: DatabaseService) {}
  async registerRecord(table_name: string, params: Record<string, any>) {
    return await this.databaseService.createRecord(
      DATABASE_NAME,
      table_name,
      params,
    );
  }
  async getRegisterRecord(table_name: string) {
    return await this.databaseService.getAllRecord(DATABASE_NAME, table_name);
  }
}
