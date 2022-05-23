import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.provider';
import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

const accessTokenSecret = 'youraccesstokensecret';
const app = express();
app.use(cookieParser());
const { DATABASE_NAME = 'email_database' } = process.env;

@Injectable()
export class LoginService {
  constructor(private databaseService: DatabaseService) {}
  async loginUser(table_name: string, params: Record<string, any>) {
    const [user] = await this.databaseService.login(
      DATABASE_NAME,
      table_name,
      params,
    );
    const access_token = jwt.sign(
      { username: user.username, password: user.password },
      accessTokenSecret,
    );
    return { access_token, user };
  }
}
