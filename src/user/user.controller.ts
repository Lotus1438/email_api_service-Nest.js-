import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Logger,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  private logger: any;
  constructor(private userService: UserService) {
    this.logger = new Logger('USER');
  }

  @Post('/create')
  async createUser(@Body() body: any) {
    const { table_name, params } = body;
    return await this.userService.createUser(table_name, params);
  }

  @Get('/')
  async getAllUser(@Request() req: any) {
    const [table_name] = req.route.path
      .split('/')
      .filter((item: string) => item != '');
    return await this.userService.getAllUser(table_name);
  }

  @Get('/:id')
  async getUserById(@Param() params: any, @Request() req: any) {
    const [table_name] = req.route.path
      .split('/')
      .filter((item: string) => item != '');
    const { id = '' } = params;
    const result = await this.userService.getUserById(table_name, id);
    return result
      ? { success: true, message: 'Fetched record', data: result }
      : {
          success: false,
          message: 'User does not exist',
        };
  }

  @Put('/:id')
  async updateUserById(@Body() body: any, @Param() { id }: any) {
    const { table_name, params } = body;
    return await this.userService.updateUserById(table_name, id, params);
  }

  @Delete('/:id')
  async deleteUserById(@Param() params: any, @Request() req: any) {
    const [table_name] = req.route.path
      .split('/')
      .filter((item: string) => item != '');
    const { id = '' } = params;
    return await this.userService.deleteUserById(table_name, id);
  }
}
