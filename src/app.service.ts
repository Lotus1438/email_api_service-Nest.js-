import { Injectable } from '@nestjs/common';
import { RegisterService } from './register/register.service';

@Injectable()
export class AppService {
  constructor(private registerService: RegisterService) {}
  async registerRecord(table_name: string, params: Record<string, any>) {
    return await this.registerService.registerRecord(table_name, params);
  }
  async getAllRegisterRecord(table_name: string) {
    return await this.registerService.getRegisterRecord(table_name);
  }
  // async getRegisterRecordById(table_name:string, id:string){
  //   return await this.registerService.
  // }
}
