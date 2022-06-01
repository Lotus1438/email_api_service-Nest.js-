import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { RoleService } from '../role/role.service';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../../database.provider';

@Injectable()
export class AuthGuard implements CanActivate {
  private roleService: RoleService;
  constructor(private databaseService: DatabaseService) {
    this.roleService = new RoleService(new JwtService(), this.databaseService);
  }

  canActivate(context: ExecutionContext): Promise<boolean> | boolean {
    const access_token = context.getArgs()[1].req.cookies.access_token;
    return !!this.handleRequest(access_token);
  }
  async handleRequest(access_token: string) {
    return await this.roleService.getLoggedinUser(access_token);
  }
}
