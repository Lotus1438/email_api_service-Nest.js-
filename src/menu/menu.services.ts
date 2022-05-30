import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database.provider';
import { UtilityService } from '../utils/utility.service';
import { RoleService } from '../restriction/role/role.service';
import { EMenuTypes } from './menu.dto';
import { EMessageStatuses } from '../messages/message.dto';
import { reduce } from 'bluebird';

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
    switch (menu_type) {
      case EMenuTypes.STARRED:
        return await this.databaseService.getRecordByFilter(
          DATABASE_NAME,
          table_name,
          (message: any) => {
            return message('sender')
              .eq(user_email)
              .or(message('recipient').eq(user_email))
              .and(message('status').eq(EMessageStatuses.STARRED));
          },
        );
      case EMenuTypes.IMPORTANT:
        return await this.databaseService.getRecordByFilter(
          DATABASE_NAME,
          table_name,
          (message: any) => {
            return message('sender')
              .eq(user_email)
              .or(message('recipient').eq(user_email))
              .and(message('status').eq(EMessageStatuses.IMPORTANT));
          },
        );
      case EMenuTypes.INBOX:
        return await this.databaseService.getRecordByFilter(
          DATABASE_NAME,
          table_name,
          (message: any) => {
            return message('recipient')
              .eq(user_email)
              .and(message('status').ne(EMessageStatuses.DELETED))
              .and(message('status').ne(EMessageStatuses.DRAFT));
          },
        );
      case EMenuTypes.SENT:
        return await this.databaseService.getRecordByFilter(
          DATABASE_NAME,
          table_name,
          (message: any) => {
            return message('sender')
              .eq(user_email)
              .and(message('status').ne(EMessageStatuses.DELETED))
              .and(message('status').ne(EMessageStatuses.DRAFT));
          },
        );
      case EMenuTypes.DRAFT:
        return await this.databaseService.getRecordByFilter(
          DATABASE_NAME,
          table_name,
          {
            sender: user_email,
            status: EMessageStatuses.DRAFT,
          },
        );
      default:
        return [];
    }
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
    updated_params,
    user_email,
  }: Record<string, any>) {
    const { recipient, status: record_status } = await this.getMessageById(
      table_name,
      message_id,
    );
    const { status } = updated_params;
    if (
      status !== record_status &&
      recipient === user_email &&
      (record_status !== EMessageStatuses.DRAFT ||
        record_status !== EMessageStatuses.DELETED)
    ) {
      const message = await this.databaseService.updateRecordById(
        DATABASE_NAME,
        table_name,
        message_id,
        updated_params,
      );
      return message;
    } else {
      return { success: false, message: 'Message does not exist in Inbox.' };
    }
  }

  async updateSentMessageStatus({
    message_id,
    table_name,
    updated_params,
    user_email,
  }: Record<string, any>) {
    const { sender, status: record_status } = await this.getMessageById(
      table_name,
      message_id,
    );
    const { status } = updated_params;
    if (
      status !== record_status &&
      sender === user_email &&
      (record_status !== EMessageStatuses.DRAFT ||
        record_status !== EMessageStatuses.DELETED)
    ) {
      const message = await this.databaseService.updateRecordById(
        DATABASE_NAME,
        table_name,
        message_id,
        updated_params,
      );
      return message;
    } else {
      return { success: false, message: 'Message does not exist in Sentbox.' };
    }
  }

  async updateDraftMessageStatus({
    message_id,
    table_name,
    updated_params,
    user_email,
  }: Record<string, any>) {
    const { sender, status: record_status } = await this.getMessageById(
      table_name,
      message_id,
    );
    if (sender === user_email && record_status === EMessageStatuses.DRAFT) {
      const message = await this.databaseService.updateRecordById(
        DATABASE_NAME,
        table_name,
        message_id,
        updated_params,
      );
      return message;
    } else {
      return { success: false, message: 'Message does not exist in Draft.' };
    }
  }

  async updateStarredOrImportantMessageStatus({
    message_id,
    table_name,
    updated_params,
    user_email,
    menu_type,
  }: Record<string, any>) {
    const {
      sender,
      recipient,
      status: record_status,
    } = await this.getMessageById(table_name, message_id);
    if (
      (sender === user_email || recipient === user_email) &&
      record_status !== EMessageStatuses.DELETED
    ) {
      const message = await this.databaseService.updateRecordById(
        DATABASE_NAME,
        table_name,
        message_id,
        updated_params,
      );
      return message;
    } else {
      return {
        success: false,
        message: `Message does not exist in ${menu_type}.`,
      };
    }
  }

  async groupMessagesByMenu(
    table_name: string,
    menu_types: string[],
    email: string,
  ) {
    return reduce(
      menu_types,
      async (acc: any, curr: any) => {
        const messages = await this.getUserMessagesByMenuType({
          table_name,
          menu_type: curr,
          user_email: email,
        });
        return { ...acc, [curr]: messages };
      },
      {},
    );
  }
}
