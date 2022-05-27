import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.provider';

const { DATABASE_NAME = 'email_database' } = process.env;

@Injectable()
export class MessageService {
  constructor(private databaseService: DatabaseService) {}
  async createMessage(table_name: string, params: Record<string, any>) {
    return await this.databaseService.createRecord(
      DATABASE_NAME,
      table_name,
      params,
    );
  }

  async getAllMessage(table_name: string) {
    return await this.databaseService.getAllRecord(DATABASE_NAME, table_name);
  }

  async getMessageById(table_name: string, id: string) {
    return await this.databaseService.getRecordById(
      DATABASE_NAME,
      table_name,
      id,
    );
  }

  async updateMessageById(
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

  async deleteMessageById(table_name: string, id: string) {
    return await this.databaseService.deleteRecordById(
      DATABASE_NAME,
      table_name,
      id,
    );
  }
}
