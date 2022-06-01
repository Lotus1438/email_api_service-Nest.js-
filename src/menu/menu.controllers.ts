import {
  Controller,
  Get,
  Param,
  Put,
  Delete,
  Request,
  Body,
  UseGuards,
} from '@nestjs/common';
import { MenuService } from './menu.services';
import { AuthGuard } from '../restriction/auth/auth.guard';
import { RoleGuard } from '../restriction/role/role.guard';
import { MenuParamsDto, MenuBodyDto, EMenuTypes } from './menu.dto';
import { EMessageStatuses } from '../messages/message.dto';
import { DatabaseService } from '../database.provider';

const { DATABASE_NAME = 'email_database' } = process.env;

@Controller('menu')
export class MenuController {
  private table_name: string;
  constructor(
    private menuService: MenuService,
    private databaseService: DatabaseService,
  ) {
    this.table_name = 'message';
  }

  @Get('/')
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard)
  async getAllMenu(@Request() request: any) {
    const { email } = await this.menuService.getLoggedinUser(
      request.cookies.access_token,
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
    @Param() params: MenuParamsDto,
    @Request() request: any,
  ) {
    const { menu_type } = params;
    const { email } = await this.menuService.getLoggedinUser(
      request.cookies.access_token,
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
  async getMessageInAMenuById(
    @Param() params: MenuParamsDto,
    @Request() request: any,
  ) {
    const { message_id = '', menu_type = '' } = params;
    const { email } = await this.menuService.getLoggedinUser(
      request.cookies.access_token,
    );
    const [result] = await this.menuService.getMessageByMenuType(
      this.table_name,
      menu_type,
      email,
      message_id,
    );
    if (!result) {
      return {
        success: false,
        message: `Message does not exist on Menu type ${menu_type}`,
      };
    }
    return result;
  }

  @Put('/:menu_type/:message_id')
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard)
  async updateMessageStatusById(
    @Body() body: MenuBodyDto,
    @Param() params: MenuParamsDto,
    @Request() request: any,
  ) {
    const { email } = await this.menuService.getLoggedinUser(
      request.cookies.access_token,
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
              'Cannot Update sent message status to unread, read or draft',
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
            message: 'Cannot Update draft message status to unread, read',
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

  @Delete('/:menu_type/:message_id')
  @UseGuards(AuthGuard)
  async deleteMessageByMenuType(
    @Param() params: MenuParamsDto,
    @Request() request: any,
  ) {
    const { email } = await this.menuService.getLoggedinUser(
      request.cookies.access_token,
    );
    const { message_id = '', menu_type } = params;
    const [record] = await this.menuService.getMessageByMenuType(
      this.table_name,
      menu_type,
      email,
      message_id,
    );
    if (!record) {
      return {
        success: false,
        message: `Message does not exist in ${menu_type}`,
      };
    }
    return await this.databaseService.deleteRecordById(
      DATABASE_NAME,
      this.table_name,
      message_id,
    );
  }
}
