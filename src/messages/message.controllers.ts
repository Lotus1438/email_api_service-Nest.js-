import { Controller, Get, Post, Param } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  getHello(): string {
    return this.messageService.getHello();
  }

  @Post('table/:message')
  async newTable(@Param('message') user: any): Promise<string> {
    let response = await this.messageService
      .createTable(user)
      .then((result) => {
        return 'User ' + user + ' received!\n' + JSON.stringify(result);
      })
      .catch((reason) => {
        return reason;
      });

    return response;
  }
}
