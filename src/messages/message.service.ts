import { Injectable, Inject } from '@nestjs/common';
import { table } from 'console';
import * as rethink from 'rethinkdb';
import { Message } from './message.dto';

@Injectable()
export class MessageService {
  messages: Message[] = [];

  getHello(): string {
    return 'Hello World!';
  }

  private connection: rethink.Connection;

  constructor(@Inject('MessageProvider') connection: any) {
    this.connection = connection;
  }

  // create table
  async createTable(tableName: string): Promise<rethink.CreateResult> {
    let result = await rethink
      .db('mydb')
      .tableCreate(tableName)
      .run(this.connection);
    return result;
  }

  // insert data
  async insert(
    tableName: string,
    content: object,
  ): Promise<rethink.WriteResult> {
    let result = await rethink
      .table(tableName)
      .insert(content)
      .run(this.connection);

    return result;
  }
  // // get all data
  // async getAll(tableName: string): Promise<rethink.DropResult> {
  //   let result = await rethink
  //     .table(tableName)
  //     //  .orderBy(desc("id"))
  //     .run(this.connection);
  //   return dropped;
  // }
}
