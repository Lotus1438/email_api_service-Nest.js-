import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { LoginService } from './login.service';

@Controller()
export class LoginController {
  constructor(private loginService: LoginService) {}

  @Post('/login')
  async login(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const { params } = body;
    const { user, access_token } = await this.loginService.loginUser(
      'user',
      params,
    );
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
  async logout(@Res({ passthrough: true }) res: any) {
    res.clearCookie('access_token');
    return { success: true, message: 'Logout Successfully' };
  }
}
