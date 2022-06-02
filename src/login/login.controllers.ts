import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { IResponse } from '../main.type';
import { LoginDto } from './login.dto';
import { LoginService } from './login.service';

@Controller()
export class LoginController {
  constructor(private loginService: LoginService) {}

  @Post('/login')
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response):Promise<IResponse> {
    const { username, password } = body;
    const { user, access_token } = await this.loginService.loginUser('user', {
      username,
      password,
    });
    if (!user) {
      return {
        success: false,
        message: 'Login Fail. Please check your username and password',
      };
    }
    res.cookie('access_token', access_token, { httpOnly: true });
    return { success: true, message: 'Login Successfully' };
  }

  @Post('/logout')
  async logout(@Res({ passthrough: true }) res: any): Promise<IResponse> {
    res.clearCookie('access_token');
    return { success: true, message: 'Logout Successfully' };
  }
}
