import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DatabaseService } from './database.provider';
const { DATABASE_NAME = 'email_database' } = process.env;

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  private databaseService: DatabaseService;
  constructor() {
    this.databaseService = new DatabaseService();
  }

  async use(req: Request, res: Response, next: () => void) {
    const { authorization = '', ...rest } = req.headers;
    console.log(
      '%c 💍: AuthenticationMiddleware -> use -> rest ',
      'font-size:16px;background-color:#6cf02b;color:black;',
      rest,
    );
    console.log(
      '%c 🌔: AuthenticationMiddleware -> use -> authorization ',
      'font-size:16px;background-color:#731c4a;color:white;',
      authorization,
    );
    const [auth] = authorization.split(' ').filter((item) => item !== 'Basic');
    console.log(
      '%c 🍸: AuthenticationMiddleware -> use -> auth ',
      'font-size:16px;background-color:#a6b4e0;color:white;',
      auth,
    );
    const decoded = Buffer.from(auth, 'base64');
    console.log(
      '%c 💶: AuthenticationMiddleware -> use -> decoded ',
      'font-size:16px;background-color:#dd65b7;color:white;',
      decoded.toString('ascii'),
    );
    const [decoded_username, decoded_password] = decoded
      .toString('ascii')
      .split(':');
    const result = await this.databaseService.getRecordByFilter(
      DATABASE_NAME,
      'user',
      {
        username: decoded_username,
        password: decoded_password,
      },
    );
    if (result.length) return next();

    throw new UnauthorizedException();
  }
}
