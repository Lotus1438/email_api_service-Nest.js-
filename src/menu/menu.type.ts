import { IsEnum } from 'class-validator';

export interface IGetMessagesByMenuTypeParams {
  table_name: string;
  menu_type: string;
  user_email: string;
}
export enum EMenuTypes {
  INBOX = 'inbox',
  STARRED = 'starred',
  IMPORTANT = 'important',
  SENT = 'sent',
  DRAFT = 'draft',
}
export class MenuParamsDto {
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
