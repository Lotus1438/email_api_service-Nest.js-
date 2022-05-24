import {
  CanActivate,
  Injectable,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { IRoleRequestParams } from './role.type';
import { RoleService } from './role.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private roleService: RoleService) {}

  canActivate(context: ExecutionContext): Promise<boolean> | boolean {
    const cookie = context.getArgs()[1].req.headers.cookie;
    const method = context.getArgs()[0].method;
    console.log(
      '%c 💚: RoleGuard -> constructor -> method ',
      'font-size:16px;background-color:#86e9f3;color:black;',
      method,
    );
    console.log(
      '%c 💙: RoleGuard -> constructor -> headers ',
      'font-size:16px;background-color:#5d2f63;color:white;',
      context.getArgs()[1].req.headers,
    );
    const [token] = cookie
      .split(';')
      .filter((item: string) => item.includes('access_token'));
    const [_, access_token] = token.split('=');
    if (!access_token) throw new ForbiddenException();
    this.handleRequest({ method, access_token });
    return access_token;
  }
  async handleRequest({ method, access_token }: IRoleRequestParams) {
    const user = await this.roleService.getLoggedinUser(access_token);
    console.log(
      '%c 🌓: RoleGuard -> handleRequest -> user ',
      'font-size:16px;background-color:#c90c6b;color:white;',
      user,
    );
  }
}
