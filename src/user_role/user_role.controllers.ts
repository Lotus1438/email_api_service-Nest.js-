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
import { UserRoleService } from './user_role.service';

@Controller('user_role')
export class UserRoleController {
  private logger: any;
  constructor(private userRoleService: UserRoleService) {
    this.logger = new Logger('USER ROLE');
  }

  @Post('/create')
  async createUserRole(@Body() body: any) {
    const { table_name, params } = body;
    return await this.userRoleService.createUserRole(table_name, params);
  }

  @Get('/')
  async getAllUserRole(@Request() req: any) {
    const [table_name] = req.route.path
      .split('/')
      .filter((item: string) => item != '');
    this.logger.log(this.getAllUserRole);
    return await this.userRoleService.getAllUserRole(table_name);
  }

  @Get('/:id')
  async getUserRoleById(@Param() params: any, @Request() req: any) {
    const [table_name] = req.route.path
      .split('/')
      .filter((item: string) => item != '');
    const { id = '' } = params;
    const result = await this.userRoleService.getUserRoleById(table_name, id);
    return result
      ? { success: true, message: 'Fetched record', data: result }
      : {
          success: false,
          message: 'User role does not exist',
        };
  }

  @Put('/:id')
  async updateUserRoleById(@Body() body: any, @Param() { id }: any) {
    const { table_name, params } = body;
    return await this.userRoleService.updateUserRoleById(
      table_name,
      id,
      params,
    );
  }

  @Delete('/:id')
  async deleteUserRoleById(@Param() params: any, @Request() req: any) {
    const [table_name] = req.route.path
      .split('/')
      .filter((item: string) => item != '');
    const { id = '' } = params;
    return await this.userRoleService.deleteUserRoleById(table_name, id);
  }
}
