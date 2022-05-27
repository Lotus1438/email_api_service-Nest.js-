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
import { Request } from 'express';
import { UserService } from './user.service';
import { AuthGuard } from '../restriction/auth/auth.guard';
import { RoleGuard } from '../restriction/role/role.guard';
import { UtilityService } from '../utils/utility.service';
import { UserDto, IUserParams } from './user.dto';

@Controller('user')
export class UserController {
  private logger: Logger;
  constructor(
    private userService: UserService,
    private utilityService: UtilityService,
  ) {
    this.logger = new Logger('USER');
  }

  @Post('/create')
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard)
  async createUser(@Body() body: UserDto, @Req() req: Request) {
    const table_name = this.utilityService.getTableNameFromRoute(
      req.route.path,
    );
    return await this.userService.createUser(table_name, body);
  }

  @Get('/')
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard)
  async getAllUser(@Req() req: Request) {
    const table_name = this.utilityService.getTableNameFromRoute(
      req.route.path,
    );
    return await this.userService.getAllUser(table_name);
  }

  @Get('/:user_id')
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard)
  async getUserById(@Param() params: IUserParams, @Req() req: Request) {
    const table_name = this.utilityService.getTableNameFromRoute(
      req.route.path,
    );
    const { user_id = '' } = params;
    const result = await this.userService.getUserById(table_name, user_id);
    return result
      ? { success: true, message: 'Fetched record', data: result }
      : {
          success: false,
          message: 'User does not exist',
        };
  }

  @Put('/:user_id')
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard)
  async updateUserById(
    @Body() body: Record<string, any>,
    @Param() { user_id }: IUserParams,
    @Req() req: Request,
  ) {
    const table_name = this.utilityService.getTableNameFromRoute(
      req.route.path,
    );
    return await this.userService.updateUserById(table_name, user_id, body);
  }

  @Delete('/:user_id')
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard)
  async deleteUserById(@Param() params: IUserParams, @Req() req: Request) {
    const table_name = this.utilityService.getTableNameFromRoute(
      req.route.path,
    );
    const { user_id = '' } = params;
    return await this.userService.deleteUserById(table_name, user_id);
  }
}
