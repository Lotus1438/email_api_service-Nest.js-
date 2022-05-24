import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../../database.provider';
const { DATABASE_NAME = 'email_database' } = process.env;
@Injectable({})
export class RoleService {
  constructor(
    private jwtService: JwtService,
    private databaseService: DatabaseService,
  ) {}

  async getLoggedinUser(access_token: string) {
    const decoded = this.jwtService.decode(access_token ?? '') as Record<
      string,
      any
    >;
    console.log(
      '%c 🕋: RoleService -> getLoggedinUser -> decoded ',
      'font-size:16px;background-color:#036178;color:white;',
      typeof decoded,
    );
    const user_record = await this.databaseService.getRecordByFilter(
      DATABASE_NAME,
      'user',
      { username: decoded?.username, password: decoded?.password },
    );
    console.log(
      '%c 🇸🇰: RoleService -> getLoggedinUser -> user_record ',
      'font-size:16px;background-color:#3f6816;color:white;',
      user_record,
    );
  }
}
