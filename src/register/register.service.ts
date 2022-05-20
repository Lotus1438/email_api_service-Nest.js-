import { Injectable, Inject } from '@nestjs/common';
import { DatabaseService } from '../database.provider';
const { DATABASE_NAME = 'email_database' } = process.env;
@Injectable()
export class RegisterService {
  constructor(private databaseService: DatabaseService) {}
  //register
  async registerRecord(table_name: string, params: Record<string, any>) {
    return await this.databaseService.createRecord(
      DATABASE_NAME,
      table_name,
      params,
    );
  }
  //get all register record
  async getRegisterRecord(table_name: string) {
    return await this.databaseService.getAllRecord(DATABASE_NAME, table_name);
  }
  //get register by id
  // async getRegisterRecordById(table_name:string) {
  //   return await this.databaseService.getRecordById(DATABASE_NAME, table_name, id)
  // }
}
