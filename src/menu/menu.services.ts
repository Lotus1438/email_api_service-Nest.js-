import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database.provider';
import { UtilityService } from '../utils/utility.service';
import { RoleService } from '../restriction/role/role.service';
import { EMenuTypes } from './menu.type';
import { EMessageStatuses } from '../messages/message.dto';

const { DATABASE_NAME = 'email_database' } = process.env;

@Injectable()
export class MenuService {
  private roleService: RoleService;
  constructor(
    private databaseService: DatabaseService,
    private utilityService: UtilityService,
  ) {
    this.roleService = new RoleService(new JwtService(), this.databaseService);
  }
  async getLoggedinUser(cookie: string) {
    const access_token = this.utilityService.decodeAccessToken(cookie);
    return await this.roleService.getLoggedinUser(access_token);
  }
  async getUserMessagesByMenuType({
    table_name,
    menu_type,
    user_email,
  }: Record<string, any>) {
    let filter_params = {};
    let filtered_messages: Record<string, any>[] = [];

    if (
      menu_type === EMenuTypes.STARRED ||
      menu_type === EMenuTypes.IMPORTANT
    ) {
      filtered_messages = await this.databaseService.getRecordByFilter(
        DATABASE_NAME,
        table_name,
        (message: any) => {
          return message('sender')
            .eq(user_email)
            .or(message('recipient').eq(user_email))
            .and(message('status').eq(menu_type));
        },
      );
    } else if (menu_type === EMenuTypes.INBOX) {
      filtered_messages = await this.databaseService.getRecordByFilter(
        DATABASE_NAME,
        table_name,
        (message: any) => {
          return message('recipient')
            .eq(user_email)
            .and(message('status').ne(EMessageStatuses.DELETED));
        },
      );
    } else if (menu_type === EMenuTypes.SENT) {
      filtered_messages = await this.databaseService.getRecordByFilter(
        DATABASE_NAME,
        table_name,
        (message: any) => {
          return message('sender')
            .eq(user_email)
            .and(message('status').ne(EMessageStatuses.DELETED));
        },
      );
    } else if (menu_type === EMenuTypes.DRAFT) {
      filter_params = {
        sender: user_email,
        status: EMessageStatuses.DRAFT,
      };
      filtered_messages = await this.databaseService.getRecordByFilter(
        DATABASE_NAME,
        table_name,
        filter_params,
      );
    } else {
      filtered_messages = [];
    }
    return filtered_messages;
  }

  async getMessageById(table_name: string, id: string) {
    return await this.databaseService.getRecordById(
      DATABASE_NAME,
      table_name,
      id,
    );
  }

  async updateInboxMessageStatus({
    message_id,
    table_name,
    status,
  }: Record<string, any>) {
    const { status: record_status } = await this.getMessageById(
      table_name,
      message_id,
    );
    if (status !== record_status) {
      const message = await this.databaseService.updateRecordById(
        DATABASE_NAME,
        table_name,
        message_id,
        { status },
      );
      console.log(
        '%c 🍗: MenuService -> message ',
        'font-size:16px;background-color:#24502d;color:white;',
        message,
      );
    }
  }
}
