import { Injectable, Inject } from '@nestjs/common';
import * as rethink from 'rethinkdb';
import { User } from './user.dto';

@Injectable()
export class UserService {
  users: User[] = [];

  getHello(): string {
    return 'Hello World!';
  }

  private connection: rethink.Connection;

  constructor(@Inject('UserProvider') connection: any) {
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
}
