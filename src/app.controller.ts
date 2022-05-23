import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseService } from './database.provider';

const {
  DATABASE_NAME = 'email_database',
  TABLE_NAME = 'register,user,user_role,message',
} = process.env;

const tables = TABLE_NAME.split(',');

@Controller()
export class AppController {
  constructor(
    private appService: AppService,
    private databaseService: DatabaseService,
  ) {}

  async onModuleInit() {
    const initialized_role = {
      id: '703f3215-e3ef-43a9-b8c2-2929721022a0',
      role: 'Super Admin',
      priviledges: {
        has_read_access: true,
        has_add_access: true,
        has_edit_access: true,
        has_delete_access: true,
      },
    };
    await this.databaseService.createDatabase(DATABASE_NAME);
    await this.databaseService.createTable(DATABASE_NAME, tables);
    await this.databaseService.createRecord(
      DATABASE_NAME,
      'user_role',
      initialized_role,
    );
  }
  @Post('/register_user')
  registerUser(@Body() body: any, @Req() req: any) {
    const { table_name, params } = body;
    return this.appService.registerRecord(table_name, params);
  }
  @Get('/register_user')
  getAllRegisterUser(@Body() body: any) {
    const { table_name } = body;
    return this.appService.getAllRegisterRecord(table_name);
  }

  @Post('/register_user_role')
  registerUserRole(@Body() body: any) {
    const { table_name, params } = body;
    return this.appService.registerRecord(table_name, params);
  }
}
