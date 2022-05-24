import { Body, Controller, Post, Res, Logger, Req } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import express, { Response, Request } from 'express';
import { LoginService } from './login.service';

const app = express();
app.use(cookieParser());

@Controller()
export class LoginController {
  private logger: any;
  constructor(private loginService: LoginService) {
    this.logger = new Logger('LOGIN/LOGOUT');
  }

  @Post('/login')
  async login(
    @Body() body: any,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { params } = body;
    const { user, access_token } = await this.loginService.loginUser(
      'user',
      params,
    );
    if (!user) {
      return {
        success: false,
        message: 'Login Fail, Please check your username and password',
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
