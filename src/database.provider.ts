import { Injectable } from '@nestjs/common';
import rethinkdbdash from 'rethinkdbdash';

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

  async createTable(client: any) {
    this.client.db('mydb');
  }
}
