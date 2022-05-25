import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum EMessageStatuses {
  IMPORTANT = 'important',
  STARRED = 'starred',
  READ = 'read',
  DRAFT = 'draft',
  DELETED = 'deleted',
  UNREAD = 'unread',
}

export enum EMessageType {
  INBOX = 'inbox',
  SENTBOX = 'sentbox',
  DRAFT = 'draft',
}

export class MessageDto {
  constructor() {
    this.recipient = '';
    this.subject = '';
    this.message = '';
    this.sender = '';
    this.status = EMessageStatuses.UNREAD;
    this.message_type = EMessageType.SENTBOX;
  }
  @IsString()
  @IsNotEmpty()
  recipient: string;

  @IsString()
  @IsOptional()
  subject?: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsOptional()
  sender?: string;

  @IsEnum(EMessageStatuses, {
    message: `Message must be a valid enum value [${Object.values(
      EMessageStatuses,
    )}]`,
  })
  @IsNotEmpty()
  status: EMessageStatuses;

  @IsEnum(EMessageType, {
    message: `Message type must be a valid enum value [${Object.values(
      EMessageType,
    )}]`,
  })
  @IsNotEmpty()
  message_type: EMessageType;
}
