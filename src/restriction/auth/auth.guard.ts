import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { UtilityService } from '../../utils/utility.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private utilityService: UtilityService) {}

  canActivate(context: ExecutionContext): Promise<boolean> | boolean {
    const cookie = context.getArgs()[1].req.headers.cookie;
    return !!this.utilityService.decodeAccessToken(cookie);
  }
}
