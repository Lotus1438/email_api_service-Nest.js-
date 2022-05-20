import { Injectable } from '@nestjs/common';
import rethinkdbdash from 'rethinkdbdash';
import Bluebird from 'bluebird';

@Injectable()
export class DatabaseService {
  private client: any;
  constructor() {
    const config = {
      host: 'localhost',
      port: 28015,
    };
    this.client = rethinkdbdash(config);
  }
  //createa db
  async createDatabase(database_name: string) {
    try {
      await this.client.dbCreate(database_name).run();
    } catch (error: any) {
      console.log('ERROR @createDatabase: ', error.message);
    }
  }
  //create table
  async createTable(database_name: string, tables: string[]) {
    await Bluebird.each(tables, async (table_name) => {
      try {
        await this.client.db(database_name).tableCreate(table_name).run();
      } catch (error: any) {
        console.log('ERROR @createTable: ', error.message);
      }
    });
  }
  //create
  async createRecord(
    database_name: string,
    table_name: string,
    params: Record<string, any>,
  ) {
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
    } else return { success: false, message: 'Recored already existed' };
  }
  //get by id
  async getRecordById(database_name: string, table_name: string, id: string) {
    return await this.client.db(database_name).table(table_name).get(id);
  }
  //get by filter
  async getRecordByFilter(
    database_name: string,
    table_name: string,
    params: Record<string, any>,
  ) {
    return await this.client
      .db(database_name)
      .table(table_name)
      .filter(params)
      .run();
  }
  //get all
  async getAllRecord(database_name: string, table_name: string) {
    return await this.client.db(database_name).table(table_name).run();
  }
  //update
  async updateRecordById(
    database_name: string,
    table_name: string,
    id: string,
    params: Record<string, any>,
  ) {
    return await this.client
      .db(database_name)
      .table(table_name)
      .get(id)
      .update(params)
      .run();
  }
  //delete
  async deleteRecordById(
    database_name: string,
    table_name: string,
    id: string,
  ) {
    return await this.client
      .db(database_name)
      .table(table_name)
      .get(id)
      .delete()
      .run();
  }
}
