import { IsEnum } from 'class-validator';
import { EMessageStatuses } from '../messages/message.dto';

export interface IMenuParams {
  menu_type?: string;
  message_id: string;
}

export enum EMenuTypes {
  INBOX = 'inbox',
  STARRED = 'starred',
  IMPORTANT = 'important',
  SENT = 'sent',
  DRAFT = 'draft',
}

export class GetMessagesByMenuParamsDto {
  constructor() {
    this.menu_type = EMenuTypes.SENT;
  }

  @IsEnum(EMenuTypes, {
    message: `Message must be a valid enum value [${Object.values(
      EMenuTypes,
    )}]`,
  })
  menu_type: EMenuTypes;
}

export class MenuBodyDto {
  constructor() {
    this.status = EMessageStatuses.DELETED;
  }

  @IsEnum(EMessageStatuses, {
    message: `Status must be a valid enum value [${Object.values(
      EMessageStatuses,
    )}]`,
  })
  status: EMessageStatuses;
}
