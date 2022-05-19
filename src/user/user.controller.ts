import { Controller, Get, Post, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getHello(): string {
    return this.userService.getHello();
  }

  @Post('table/:user')
  async newTable(@Param ('user') user:any): Promise<string> {
    let response = await this.userService.createTable(user)
      .then(result => {
        return "User " + user + " received!\n" + JSON.stringify(result)
      })
      .catch(reason => {
        return reason
      })
  
      return response
  }
}
