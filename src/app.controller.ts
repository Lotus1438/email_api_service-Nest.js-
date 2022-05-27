import { Body, Controller, Get, Post, Req, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseService } from './database.provider';
import { UserDto } from './user/user.dto';
import { UtilityService } from './utils/utility.service';

const {
  DATABASE_NAME = 'email_database',
  TABLE_NAME = 'register,user,user_role,message',
} = process.env;

const tables = TABLE_NAME.split(',');

@Controller('/register')
export class AppController {
  private logger: any;
  constructor(
    private appService: AppService,
    private databaseService: DatabaseService,
    private utilityService: UtilityService,
  ) {
    this.logger = new Logger('APP');
  }

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
      created_date: new Date().getTime(),
      updated_date: new Date().getTime(),
    };
    await this.databaseService.createDatabase(DATABASE_NAME);
    await this.databaseService.createTable(DATABASE_NAME, tables);
    await this.databaseService.createRecord(
      DATABASE_NAME,
      'user_role',
      initialized_role,
    );
  }
  @Post('/user')
  registerUser(@Body() body: UserDto, @Req() req: any) {
    return this.appService.registerRecord('user', body);
  }
  @Get('/users')
  getAllRegisterUser(@Req() req: any) {
    return this.appService.getAllRegisterRecord('user');
  }

  @Post('/user_role')
  registerUserRole(@Body() body: any, @Req() req: any) {
    return this.appService.registerRecord('user_role', body);
  }
}
