import { Controller, Get, Post, Param } from '@nestjs/common';
import { UserRoleService } from './user_role.service';

@Controller('user_role')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @Get()
  getHello(): string {
    return this.userRoleService.getHello();
  }

  @Post('table/:user_role')
  async newTable(@Param('user_role') user_role: any): Promise<string> {
    let response = await this.userRoleService
      .createTable(user_role)
      .then((result) => {
        return (
          'User Role ' + user_role + ' received!\n' + JSON.stringify(result)
        );
      })
      .catch((reason) => {
        return reason;
      });

    return response;
  }
}
