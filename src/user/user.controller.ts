import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Logger,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../restriction/auth/auth.guard';
import { RoleGuard } from '../restriction/role/role.guard';
import { Request } from 'express';
@Controller('user')
export class UserController {
  private logger: any;
  constructor(private userService: UserService) {
    this.logger = new Logger('USER');
  }

  @Post('/create')
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard)
  async createUser(@Body() body: any) {
    const { table_name, params } = body;
    return await this.userService.createUser(table_name, params);
  }

  @Get('/')
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard)
  async getAllUser(@Req() req: Request) {
    const [table_name] = req.route.path
      .split('/')
      .filter((item: string) => item != '');
    return await this.userService.getAllUser(table_name);
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard)
  async getUserById(@Param() params: any, @Req() req: any) {
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
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard)
  async updateUserById(@Body() body: any, @Param() { id }: any) {
    const { table_name, params } = body;
    return await this.userService.updateUserById(table_name, id, params);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard)
  async deleteUserById(@Param() params: any, @Req() req: any) {
    const [table_name] = req.route.path
      .split('/')
      .filter((item: string) => item != '');
    const { id = '' } = params;
    return await this.userService.deleteUserById(table_name, id);
  }
}
