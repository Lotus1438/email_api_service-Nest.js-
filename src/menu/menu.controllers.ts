import {
  Controller,
  Get,
  Param,
  Put,
  Request,
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
import { EMessageStatuses } from '../messages/message.dto';

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

  @Put('/:menu_type/:message_id')
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard)
  async updateMessageStatusById(
    @Body() body: MenuBodyDto,
    @Param() params: IMenuParams,
    @Request() request: any,
  ) {
    const { email } = await this.menuService.getLoggedinUser(
      request.headers.cookie,
    );
    const { menu_type, message_id } = params;
    const { status } = body;
    const updated_params = { status, updated_date: new Date().getTime() };
    switch (menu_type) {
      case 'inbox':
        if (
          status === EMessageStatuses.UNREAD ||
          status === EMessageStatuses.DRAFT
        ) {
          return {
            success: false,
            message: 'Cannot Update an inbox message status to unread or draft',
          };
        }
        return await this.menuService.updateInboxMessageStatus({
          message_id,
          table_name: this.table_name,
          user_email: email,
          updated_params,
        });
      case 'sent':
        if (
          status === EMessageStatuses.UNREAD ||
          status === EMessageStatuses.READ ||
          status === EMessageStatuses.DRAFT
        ) {
          return {
            success: false,
            message:
              'Cannot Update an sent message status to unread, read or draft',
          };
        }
        return await this.menuService.updateSentMessageStatus({
          message_id,
          table_name: this.table_name,
          updated_params,
          user_email: email,
        });
      case 'draft':
        if (
          status === EMessageStatuses.UNREAD ||
          status === EMessageStatuses.READ
        ) {
          return {
            success: false,
            message: 'Cannot Update an draft message status to unread, read',
          };
        }
        return await this.menuService.updateDraftMessageStatus({
          message_id,
          table_name: this.table_name,
          updated_params,
          user_email: email,
        });
      default:
        return await this.menuService.updateStarredOrImportantMessageStatus({
          message_id,
          table_name: this.table_name,
          updated_params,
          user_email: email,
          menu_type,
        });
    }
  }
}
