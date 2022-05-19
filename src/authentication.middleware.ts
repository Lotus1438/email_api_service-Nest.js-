import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor() {}

  use(req: Request, res: Response, next: () => void) {
    console.log(
      '%c 🇪🇬: AuthenticationMiddleware -> use -> req ',
      'font-size:16px;background-color:#40743c;color:white;',
      req.headers,
    );

    if (req.headers['username'] === '' && req.headers['password'] === '') {
      return next();
    }

    throw new UnauthorizedException();
  }
}
