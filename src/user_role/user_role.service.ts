import { Injectable, Inject } from '@nestjs/common';
import { table } from 'console';
import * as rethink from 'rethinkdb';
import { UserRole } from './user_role.dto';

@Injectable()
export class UserRoleService {
  user_roles: UserRole[] = [];

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
