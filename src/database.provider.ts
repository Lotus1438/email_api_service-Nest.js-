import { Injectable, Logger } from '@nestjs/common';
import rethinkdbdash from 'rethinkdbdash';
import Bluebird from 'bluebird';
import { UserDto } from './user/user.dto';
import { IResponse } from './main.type';
const { HOST = 'localhost', PORT = '28015' } = process.env;

@Injectable()
export class DatabaseService {
  private client: any;
  private logger: any;
  constructor() {
    const config = {
      host: HOST,
      port: Number(PORT),
    };
    this.client = rethinkdbdash(config);
    this.logger = new Logger('DATABASE PROVIDER');
  }
  async createDatabase(database_name: string) {
    try {
      await this.client.dbCreate(database_name).run();
    } catch (error: any) {
      this.logger.warn(error.message);
    }
  }
  async createTable(database_name: string, tables: string[]) {
    await Bluebird.each(tables, async (table_name) => {
      try {
        await this.client.db(database_name).tableCreate(table_name).run();
      } catch (error: any) {
        this.logger.warn(error.message);
      }
    });
  }

  async login(
    database_name: string,
    table_name: string,
    params: Record<string, any>,
  ): Promise<UserDto[]> {
    return this.client.db(database_name).table(table_name).filter(params).run();
  }

  async createRecord(
    database_name: string,
    table_name: string,
    params: Record<string, any>,
  ): Promise<IResponse> {
    const { id = '' } = params;
    const record = await this.getRecordById(database_name, table_name, id);
    if (!record) {
      const { inserted } = await this.client
        .db(database_name)
        .table(table_name)
        .insert(params)
        .run();
      if (inserted) {
        return { success: true, message: 'Inserted successfully' };
      }
      return { success: false, message: 'Failed to insert.' };
    }

    return { success: false, message: 'Record already existed' };
  }

  async getRecordById(
    database_name: string,
    table_name: string,
    id: string,
  ): Promise<Record<string, any>> {
    return this.client.db(database_name).table(table_name).get(id);
  }
  async getRecordByFilter(
    database_name: string,
    table_name: string,
    params: any,
  ): Promise<Record<string, any>[]> {
    return this.client.db(database_name).table(table_name).filter(params).run();
  }
  async getAllRecord(
    database_name: string,
    table_name: string,
  ): Promise<Record<string, any>[]> {
    return this.client.db(database_name).table(table_name).run();
  }
  async updateRecordById(
    database_name: string,
    table_name: string,
    id: string,
    params: Record<string, any>,
  ): Promise<IResponse> {
    const { replaced } = await this.client
      .db(database_name)
      .table(table_name)
      .get(id)
      .update(params)
      .run();
    return replaced
      ? { success: true, message: 'Updated successfully' }
      : { success: false, message: 'Fail to update record' };
  }

  async deleteRecordById(
    database_name: string,
    table_name: string,
    id: string,
  ): Promise<IResponse> {
    const { deleted } = await this.client
      .db(database_name)
      .table(table_name)
      .get(id)
      .delete()
      .run();
    return deleted
      ? { success: true, message: 'Deleted successfully' }
      : { success: false, message: 'Record does not exist' };
  }
}
