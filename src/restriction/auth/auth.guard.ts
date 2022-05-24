import {
  CanActivate,
  Injectable,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): Promise<boolean> | boolean {
    const cookie = context.getArgs()[1].req.headers.cookie;
    const [token] = cookie
      .split(';')
      .filter((item: string) => item.includes('access_token'));
    const [_, access_token] = token.split('=');
    if (!access_token) throw new ForbiddenException();
    return access_token;
    // const decoded = this.jwtService.decode([1]);
    // console.log(
    //   '%c 🍑: AuthGuard -> constructor -> decoded ',
    //   'font-size:16px;background-color:#8a93b2;color:white;',
    //   decoded,
    // );
    // return true;
  }
}
