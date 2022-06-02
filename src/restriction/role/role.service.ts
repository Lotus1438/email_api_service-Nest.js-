import { BadRequestException, Injectable } from '@nestjs/common';
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
    const [user] = await this.databaseService.getRecordByFilter(
      DATABASE_NAME,
      'user',
      {
        username: decoded?.username,
        password: decoded?.password,
      },
    );
    return user;
  }

  async getLoggedinUserRole(role_id: string) {
    const result = await this.databaseService.getRecordById(
      DATABASE_NAME,
      'user_role',
      role_id,
    );
    if (result) return result;
    else return { success: false, message: 'User role does not exist.' };
  }
  async getLoggedinUserPriviledges({
    method,
    priviledges,
  }: Record<string, any>) {
    const {
      has_read_access = false,
      has_add_access = false,
      has_delete_access = false,
      has_edit_access = false,
    } = priviledges;

    switch (method) {
      case 'GET':
        return has_read_access;
      case 'POST':
        return has_add_access;
      case 'PUT':
        return has_edit_access;
      case 'DELETE':
        return has_delete_access;
      default:
        return false;
    }
  }
}
