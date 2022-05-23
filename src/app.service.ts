import { Injectable, Logger } from '@nestjs/common';
import { RegisterService } from './register/register.service';

@Injectable()
export class AppService {
  logger: Logger;
  constructor(private registerService: RegisterService) {
    this.logger = new Logger('AppService');
  }
  async registerRecord(table_name: string, params: Record<string, any>) {
    this.logger.log(params);
    return await this.registerService.registerRecord(table_name, params);
  }
  async getAllRegisterRecord(table_name: string) {
    return await this.registerService.getRegisterRecord(table_name);
  }
}
