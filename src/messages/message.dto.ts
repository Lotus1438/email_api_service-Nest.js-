import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum EMessageStatuses {
  IMPORTANT = 'Important',
  STARRED = 'Starred',
  READ = 'Read',
  DRAFT = 'Draft',
  DELETED = 'Deleted',
  UNREAD = 'Unread',
}

export class MessageDto {
  constructor() {
    this.recipient = '';
    this.subject = '';
    this.message = '';
    this.sender = '';
    this.status = EMessageStatuses.UNREAD;
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
}
