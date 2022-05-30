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

import { UserRoleService } from './user_role.service';
import { UtilityService } from '../utils/utility.service';
import { AuthGuard } from '../restriction/auth/auth.guard';
import { RoleGuard } from '../restriction/role/role.guard';
import { UserRoleDto, IUserRoleParams } from './user_role.dto';

@Controller('user_role')
export class UserRoleController {
  private logger: any;
  constructor(
    private userRoleService: UserRoleService,
    private utilityService: UtilityService,
  ) {
    this.logger = new Logger('USER ROLE');
  }

  @Post('/create')
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard)
  async createUserRole(@Body() body: UserRoleDto, @Req() req: Request) {
    const table_name = this.utilityService.getTableNameFromRoute(
      req.route.path,
    );
    return await this.userRoleService.createUserRole(table_name, body);
  }

  @Get('/')
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard)
  async getAllUserRole(@Req() req: Request) {
    const table_name = this.utilityService.getTableNameFromRoute(
      req.route.path,
    );
    this.logger.log(this.getAllUserRole);
    return await this.userRoleService.getAllUserRole(table_name);
  }

  @Get('/:user_role_id')
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard)
  async getUserRoleById(@Param() params: IUserRoleParams, @Req() req: Request) {
    const table_name = this.utilityService.getTableNameFromRoute(
      req.route.path,
    );
    const { user_role_id = '' } = params;
    const result = await this.userRoleService.getUserRoleById(
      table_name,
      user_role_id,
    );
    return result
      ? { success: true, message: 'Fetched record', data: result }
      : {
          success: false,
          message: 'User role does not exist',
        };
  }

  @Put('/:user_role_id')
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard)
  async updateUserRoleById(
    @Body() body: Record<string, any>,
    @Param() params: IUserRoleParams,
    @Req() req: Request,
  ) {
    const table_name = this.utilityService.getTableNameFromRoute(
      req.route.path,
    );
    const updated_params = { ...body, updated_date: new Date().getTime() };
    const { user_role_id = '' } = params;
    return await this.userRoleService.updateUserRoleById(
      table_name,
      user_role_id,
      updated_params,
    );
  }

  @Delete('/:user_role_id')
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard)
  async deleteUserRoleById(
    @Param() params: IUserRoleParams,
    @Req() req: Request,
  ) {
    const table_name = this.utilityService.getTableNameFromRoute(
      req.route.path,
    );
    const { user_role_id = '' } = params;
    return await this.userRoleService.deleteUserRoleById(
      table_name,
      user_role_id,
    );
  }
}
