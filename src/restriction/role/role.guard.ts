import {
  CanActivate,
  Injectable,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { IRoleRequestParams } from './role.type';
import { RoleService } from './role.service';
import { UtilityService } from '../../utils/utility.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private roleService: RoleService,
    private utilityService: UtilityService,
  ) {}

  canActivate(context: ExecutionContext): Promise<boolean> | boolean {
    const cookie = context.getArgs()[1].req.headers.cookie;
    const method = context.getArgs()[0].method;
    const access_token = this.utilityService.decodeAccessToken(cookie);
    if (!access_token) throw new ForbiddenException();
    return this.handleRequest({ method, access_token });
  }
  async handleRequest({ method, access_token }: IRoleRequestParams) {
    const { priviledges } = await this.roleService.getLoggedinUserRole(
      access_token,
    );
    return await this.roleService.getLoggedinUserPriviledges({
      method,
      priviledges,
    });
  }
}
