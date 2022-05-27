import {
  Controller,
  Get,
  Param,
  Request,
  Put,
  Body,
  UseGuards,
} from '@nestjs/common';
import { MenuService } from './menu.services';
import { AuthGuard } from '../restriction/auth/auth.guard';
import { RoleGuard } from '../restriction/role/role.guard';
import {
  GetMessagesByMenuParamsDto,
  MenuBodyDto,
  EMenuTypes,
  IMenuParams,
} from './menu.dto';

@Controller('menu')
export class MenuController {
  private table_name: string;
  constructor(private menuService: MenuService) {
    this.table_name = 'message';
  }

  @Get('/')
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard)
  async getAllMenu(@Request() request: any) {
    const { email } = await this.menuService.getLoggedinUser(
      request.headers.cookie ?? '',
    );
    const menu_types = EMenuTypes;
    return await this.menuService.groupMessagesByMenu(
      this.table_name,
      Object.values(menu_types),
      email,
    );
  }

  @Get('/:menu_type')
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard)
  async getMessagesByMenuType(
    @Param() params: GetMessagesByMenuParamsDto,
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
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard)
  async getMessageInAMenuById(@Param() params: IMenuParams) {
    const { message_id } = params;
    return await this.menuService.getMessageById(this.table_name, message_id);
  }

  @Put('/inbox/:message_id')
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard)
  async updateInboxMessageStatusById(
    @Param() params: IMenuParams,
    @Body() body: MenuBodyDto,
  ) {
    const { message_id } = params;
    const { status } = body;
    return await this.menuService.updateInboxMessageStatus({
      message_id,
      table_name: this.table_name,
      status,
    });
  }
}
