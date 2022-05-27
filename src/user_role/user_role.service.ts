import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.provider';
import { UserRoleDto } from './user_role.dto';

const { DATABASE_NAME = 'email_database' } = process.env;

@Injectable()
export class UserRoleService {
  constructor(private databaseService: DatabaseService) {}
  async createUserRole(table_name: string, params: UserRoleDto) {
    return await this.databaseService.createRecord(
      DATABASE_NAME,
      table_name,
      params,
    );
  }

  async getAllUserRole(table_name: string) {
    return await this.databaseService.getAllRecord(DATABASE_NAME, table_name);
  }

  async getUserRoleById(table_name: string, id: string) {
    return await this.databaseService.getRecordById(
      DATABASE_NAME,
      table_name,
      id,
    );
  }

  async updateUserRoleById(
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

  async deleteUserRoleById(table_name: string, id: string) {
    return await this.databaseService.deleteRecordById(
      DATABASE_NAME,
      table_name,
      id,
    );
  }
}
