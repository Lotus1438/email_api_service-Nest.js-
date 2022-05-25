import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Logger,
  Request,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageDto } from './message.dto';
import { UtilityService } from '../utils/utility.service';
import { RoleService } from '../restriction/role/role.service';

@Controller('message')
export class MessageController {
  private logger: any;
  constructor(
    private messageService: MessageService,
    private utilityService: UtilityService,
    private roleService: RoleService,
  ) {
    this.logger = new Logger('MESSAGE');
  }
  @Post('/create')
  async createMessage(@Request() req: any, @Body() body: MessageDto) {
    console.log(
      '%c 🔙: MessageController -> createMessage -> req ',
      'font-size:16px;background-color:#a6f0a2;color:black;',
      req.headers.cookie,
      console.log(
        '%c 🏳️: MessageController -> createMessage -> req.headers.cookie ',
        'font-size:16px;background-color:#b34b8a;color:white;',
        req.headers.cookie,
      ),
    );
    const access_token = this.utilityService.decodeAccessToken(
      req.headers.cookie,
    );
    console.log(
      '%c #️⃣: MessageController -> createMessage -> access_token ',
      'font-size:16px;background-color:#dd0c7d;color:white;',
      access_token,
    );
    const loggedinUserRole = await this.roleService.getLoggedinUserRole(
      access_token,
    );
    console.log(
      '%c 😦: MessageController -> createMessage -> loggedinUserRole ',
      'font-size:16px;background-color:#84d5b0;color:black;',
      loggedinUserRole,
    );
    const [table_name] = req.route.path
      .split('/')
      .filter((item: string) => item != '');
    const params = { ...body };
    // return await this.messageService.createMessage(table_name, params);
  }

  @Get('/')
  async getAllMessage(@Request() req: any) {
    const [table_name] = req.route.path
      .split('/')
      .filter((item: string) => item != '');
    return await this.messageService.getAllMessage(table_name);
  }

  @Get('/:id')
  async getMessageById(@Param() params: any, @Request() req: any) {
    const [table_name] = req.route.path
      .split('/')
      .filter((item: string) => item != '');
    const { id = '' } = params;
    const result = await this.messageService.getMessageById(table_name, id);
    return result
      ? { success: true, message: 'Fetched record', data: result }
      : {
          success: false,
          message: 'Message does not exist',
        };
  }

  @Put('/:id')
  async updateMessageById(@Body() body: any, @Param() { id }: any) {
    const { table_name, params } = body;
    return await this.messageService.updateMessageById(table_name, id, params);
  }

  @Delete('/:id')
  async deleteMessageById(@Param() params: any, @Request() req: any) {
    const [table_name] = req.route.path
      .split('/')
      .filter((item: string) => item != '');
    const { id = '' } = params;
    return await this.messageService.deleteMessageById(table_name, id);
  }
}
