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

@Controller('message')
export class MessageController {
  private logger: any;
  constructor(private messageService: MessageService) {
    this.logger = new Logger('MESSAGE');
  }
  @Post('/create')
  async createMessage(@Body() body: any) {
    const { table_name, params } = body;
    return await this.messageService.createMessage(table_name, params);
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
