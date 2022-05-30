import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.provider';
import { UserDto } from './user.dto';

const { DATABASE_NAME = 'email_database' } = process.env;

@Injectable()
export class UserService {
  constructor(private databaseService: DatabaseService) {}
  async createUser(table_name: string, params: UserDto) {
    return await this.databaseService.createRecord(
      DATABASE_NAME,
      table_name,
      params,
    );
  }

  async getAllUser(table_name: string) {
    return await this.databaseService.getAllRecord(DATABASE_NAME, table_name);
  }

  async getUserById(table_name: string, id: string) {
    return await this.databaseService.getRecordById(
      DATABASE_NAME,
      table_name,
      id,
    );
  }

  async updateUserById(
    table_name: string,
    id: string,
    params: Record<string, any>,
  ) {
    return await this.databaseService.updateRecordById(
      DATABASE_NAME,
      table_name,
      id,
      params,
    );
  }

  async deleteUserById(table_name: string, id: string) {
    return await this.databaseService.deleteRecordById(
      DATABASE_NAME,
      table_name,
      id,
    );
  }
}
