import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export enum EUserStatuses {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export class UserDto {
  constructor() {
    this.status = EUserStatuses.ACTIVE;
    this.role_id = '';
    this.first_name = '';
    this.last_name = '';
    this.address = '';
    this.birthdate = '';
    this.email = '';
    this.password = '';
    this.username = '';
  }
  @IsString()
  @IsNotEmpty()
  status: EUserStatuses;

  @IsString()
  @IsNotEmpty()
  role_id: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  birthdate: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  username: string;
}
