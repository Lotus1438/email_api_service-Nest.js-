import { Controller, Get, Param, Request, Put, Body } from '@nestjs/common';
import { MenuService } from './menu.services';
import { MenuParamsDto } from './menu.type';

@Controller('menu')
export class MenuController {
  private table_name: string;
  constructor(private menuService: MenuService) {
    this.table_name = 'message';
  }

  @Get('/:menu_type')
  async getMessagesByMenuType(
    @Param() params: MenuParamsDto,
    @Request() request: any,
  ) {
    const { menu_type } = params;
    const { email } = await this.menuService.getLoggedinUser(
      request.headers.cookie,
    );
    return await this.menuService.getUserMessagesByMenuType({
      table_name: this.table_name,
      menu_type,
      user_email: email,
    });
  }

  @Get('/:menu_type/:message_id')
  async getMessageInAMenuById(@Param() params: any) {
    const { message_id } = params;
    return await this.menuService.getMessageById(this.table_name, message_id);
  }

  @Put('/inbox/:message_id')
  async updateInboxMessageStatusById(@Param() params: any, @Body() body: any) {
    const { message_id } = params;
    const { status } = body;
    //TODO: check if status is not deleted, possible kay mag DTO
    await this.menuService.updateInboxMessageStatus({
      message_id,
      table_name: this.table_name,
      status,
    });
  }
}
