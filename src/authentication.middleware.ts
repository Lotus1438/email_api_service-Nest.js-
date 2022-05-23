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
    const [auth] = authorization.split(' ').filter((item) => item !== 'Basic');
    const decoded = Buffer.from(auth, 'base64');
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
