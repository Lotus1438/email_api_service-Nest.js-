import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Logger,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { MessageService } from './message.service';
import {
  EMessageStatuses,
  MessageDto,
  IUpdateMessageBody,
  IMessageParams,
} from './message.dto';
import { AuthGuard } from '../restriction/auth/auth.guard';
import { RoleGuard } from '../restriction/role/role.guard';
import { UtilityService } from '../utils/utility.service';
import { RoleService } from '../restriction/role/role.service';

@Controller('message')
export class MessageController {
  private logger: any;
  private message_details: MessageDto;
  constructor(
    private messageService: MessageService,
    private utilityService: UtilityService,
    private roleService: RoleService,
  ) {
    this.logger = new Logger('MESSAGE');
    this.message_details = new MessageDto();
  }

  @Post('/create')
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard)
  async createMessage(@Req() req: Request, @Body() body: MessageDto) {
    const access_token = this.utilityService.decodeAccessToken(
      req.headers.cookie ?? '',
    );
    const { email } = await this.roleService.getLoggedinUser(access_token);
    const table_name = this.utilityService.getTableNameFromRoute(
      req.route.path,
    );
    const params = { ...this.message_details, ...body, sender: email };
    return await this.messageService.createMessage(table_name, params);
  }

  @Get('/')
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard)
  async getAllMessage(@Req() req: Request) {
    const table_name = this.utilityService.getTableNameFromRoute(
      req.route.path,
    );
    return await this.messageService.getAllMessage(table_name);
  }

  @Get('/:message_id')
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard)
  async getMessageById(@Param() params: IMessageParams, @Req() req: Request) {
    const table_name = this.utilityService.getTableNameFromRoute(
      req.route.path,
    );
    const { message_id = '' } = params;
    const result = await this.messageService.getMessageById(
      table_name,
      message_id,
    );
    return result
      ? { success: true, message: 'Fetched record', data: result }
      : {
          success: false,
          message: 'Message does not exist',
        };
  }

  @Put('/:message_id')
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard)
  async updateMessageById(
    @Body() body: IUpdateMessageBody,
    @Param() params: IMessageParams,
    @Req() req: Request,
  ) {
    const table_name = this.utilityService.getTableNameFromRoute(
      req.route.path,
    );
    const { message_id = '' } = params;
    const { message } = body;
    const { status } = await this.messageService.getMessageById(
      table_name,
      message_id,
    );
    if (status === EMessageStatuses.DRAFT) {
      return await this.messageService.updateMessageById(
        table_name,
        message_id,
        {
          message,
        },
      );
    } else {
      return { success: false, message: 'Only Draft messages can be edited.' };
    }
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard)
  async deleteMessageById(
    @Param() params: IMessageParams,
    @Req() req: Request,
  ) {
    const table_name = this.utilityService.getTableNameFromRoute(
      req.route.path,
    );
    const { message_id = '' } = params;
    return await this.messageService.deleteMessageById(table_name, message_id);
  }
}
